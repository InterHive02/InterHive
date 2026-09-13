import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '../../../core/providers/socket.provider';
import { communicationApi } from '../../../api/endpoints/communication.api';

export const useChat = (userId: string) => {
  const { socket, isConnected, on, off } = useSocket();
  const [chats, setChats] = useState<any[]>([]);
  const [messages, setMessages] = useState<Record<string, any[]>>({});
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load chats
  const loadChats = useCallback(async () => {
    try {
      const response = await communicationApi.getChats(1, 50);
      const data = response?.data?.data || response?.data;
      if (Array.isArray(data)) {
        const mapped = data.map((c: any) => ({
          ...c,
          id: c.id || c._id?.toString(),
          // Normalise participants: backend populates with role field
          participants: (c.participants || []).map((p: any) => ({
            ...p,
            id: p.id || p._id?.toString(),
          })),
          unreadCount: c.unreadCount?.data?.count ?? c.unreadCount ?? 0,
          updatedAt: c.updatedAt ? new Date(c.updatedAt) : new Date(),
        }));
        setChats(mapped);
      }
    } catch (error) {
      console.warn('Failed to load chats from backend', error);
    }
  }, []);

  // Load announcements
  const loadAnnouncements = useCallback(async () => {
    try {
      const response = await communicationApi.getAnnouncements();
      const data = response?.data?.data || response?.data;
      if (Array.isArray(data)) {
        const mapped = data.map((a: any) => ({
          ...a,
          id: a.id || a._id?.toString(),
        }));
        setAnnouncements(mapped);
      }
    } catch (error) {
      console.warn('Failed to load announcements from backend', error);
    }
  }, []);

  // Load messages for a chat
  const loadMessages = useCallback(async (chatId: string) => {
    try {
      const response = await communicationApi.getMessages(chatId, 1, 50);
      const data = response?.data?.data || response?.data;
      if (Array.isArray(data)) {
        const sorted = [...data].sort(
          (a: any, b: any) =>
            new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime(),
        );
        setMessages(prev => ({ ...prev, [chatId]: sorted }));
      }
    } catch (error) {
      console.warn('Failed to load messages for chat:', chatId, error);
    }
  }, []);

  // Send message
  const sendMessage = useCallback(
    async (chatId: string, content: string, type: string = 'text', attachments?: File[]) => {
      const tempId = `temp-${Date.now()}`;
      const optimisticMessage = {
        id: tempId,
        senderId: userId,
        content,
        type,
        attachments: attachments?.map(f => ({
          name: f.name,
          url: URL.createObjectURL(f),
          type: f.type,
          size: f.size,
        })),
        createdAt: new Date(),
        isRead: false,
        isEdited: false,
        isDeleted: false,
      };

      // Optimistically add message
      setMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), optimisticMessage],
      }));

      // Update chat last message optimistically
      setChats(prev =>
        prev.map(chat =>
          chat.id === chatId
            ? { ...chat, lastMessage: optimisticMessage, updatedAt: new Date() }
            : chat,
        ),
      );

      try {
        const response = await communicationApi.sendMessage(chatId, {
          content,
          type,
          attachments: attachments?.map(f => ({
            name: f.name,
            url: URL.createObjectURL(f),
            type: f.type,
            size: f.size,
          })),
        });

        const serverMessage = response?.data?.data || response?.data;
        if (serverMessage) {
          const mapped = {
            ...serverMessage,
            id: serverMessage.id || serverMessage._id?.toString() || tempId,
          };
          setMessages(prev => ({
            ...prev,
            [chatId]: (prev[chatId] || []).map(m => (m.id === tempId ? mapped : m)),
          }));
          return mapped;
        }
        return optimisticMessage;
      } catch (error) {
        // Keep optimistic message so user's work is not lost
        return optimisticMessage;
      }
    },
    [userId],
  );

  // Mark announcement as read
  const markAnnouncementAsRead = useCallback(
    async (id: string) => {
      try {
        await communicationApi.markAnnouncementAsRead(id);
      } catch (error) {
        console.warn('Failed to persist announcement read state');
      }
      setAnnouncements(prev =>
        prev.map(a =>
          a.id === id
            ? { ...a, readBy: [...(Array.isArray(a.readBy) ? a.readBy : []), userId] }
            : a,
        ),
      );
    },
    [userId],
  );

  // Pin/unpin announcement
  const pinAnnouncement = useCallback(
    async (id: string) => {
      const announcement = announcements.find(a => a.id === id);
      if (!announcement) return;
      const newPinned = !announcement.isPinned;

      try {
        await communicationApi.pinAnnouncement(id, newPinned);
      } catch (error) {
        console.warn('Failed to persist announcement pin state');
      }
      setAnnouncements(prev => prev.map(a => (a.id === id ? { ...a, isPinned: newPinned } : a)));
    },
    [announcements],
  );

  // Socket event handlers
  useEffect(() => {
    if (!isConnected || !socket) return;

    const handleNewMessage = (data: any) => {
      const { message, chat } = data;
      if (!chat?.id || !message) return;
      setMessages(prev => ({
        ...prev,
        [chat.id]: [...(prev[chat.id] || []), message],
      }));
      setChats(prev =>
        prev.map(c =>
          c.id === chat.id ? { ...c, lastMessage: message, updatedAt: new Date() } : c,
        ),
      );
    };

    const handleChatCreated = (chat: any) => {
      if (!chat?.id && !chat?._id) return;
      const mapped = {
        ...chat,
        id: chat.id || chat._id?.toString(),
        participants: (chat.participants || []).map((p: any) => ({
          ...p,
          id: p.id || p._id?.toString(),
        })),
        unreadCount: 0,
        updatedAt: chat.updatedAt ? new Date(chat.updatedAt) : new Date(),
      };
      setChats(prev => {
        const exists = prev.some(c => c.id === mapped.id);
        return exists ? prev.map(c => (c.id === mapped.id ? mapped : c)) : [mapped, ...prev];
      });
    };

    const handleChatUpdated = (chat: any) => {
      if (chat?.id) {
        setChats(prev => prev.map(c => (c.id === chat.id ? { ...c, ...chat } : c)));
      }
    };

    const handleNewAnnouncement = (announcement: any) => {
      if (announcement?.id) {
        setAnnouncements(prev => [announcement, ...prev]);
      }
    };

    on('new_message', handleNewMessage);
    on('chat_created', handleChatCreated);
    on('chat_updated', handleChatUpdated);
    on('new_announcement', handleNewAnnouncement);

    return () => {
      off('new_message', handleNewMessage);
      off('chat_created', handleChatCreated);
      off('chat_updated', handleChatUpdated);
      off('new_announcement', handleNewAnnouncement);
    };
  }, [isConnected, socket, on, off]);

  // Initial load
  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      setIsLoading(true);
      try {
        await Promise.all([loadChats(), loadAnnouncements()]);
      } catch (err) {
        console.error('Initial chat load error:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    init();
    return () => {
      isMounted = false;
    };
  }, [loadChats, loadAnnouncements]);

  return {
    chats,
    messages,
    announcements,
    isLoading,
    loadChats,
    loadMessages,
    sendMessage,
    markAnnouncementAsRead,
    pinAnnouncement,
  };
};
