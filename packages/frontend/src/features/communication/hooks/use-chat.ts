import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '../../../core/providers/socket.provider';
import { communicationApi } from '../../../api/endpoints/communication.api';
import { toast } from 'react-hot-toast';

export const useChat = (userId: string) => {
  const { socket, isConnected, emit, on, off } = useSocket();
  const [chats, setChats] = useState<any[]>([]);
  const [messages, setMessages] = useState<Record<string, any[]>>({});
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load chats
  const loadChats = useCallback(async () => {
    try {
      const response = await communicationApi.getChats(1, 50);
      setChats(response.data.data);
    } catch (error) {
      console.error('Failed to load chats:', error);
    }
  }, []);

  // Load announcements
  const loadAnnouncements = useCallback(async () => {
    try {
      const response = await communicationApi.getAnnouncements();
      setAnnouncements(response.data.data);
    } catch (error) {
      console.error('Failed to load announcements:', error);
    }
  }, []);

  // Load messages for a chat
  const loadMessages = useCallback(async (chatId: string) => {
    try {
      const response = await communicationApi.getMessages(chatId, 1, 50);
      setMessages(prev => ({
        ...prev,
        [chatId]: response.data.data.reverse(),
      }));
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  }, []);

  // Send message
  const sendMessage = useCallback(async (chatId: string, content: string, type: string = 'text', attachments?: File[]) => {
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

      // Optimistically add message
      const newMessage = response.data.data;
      setMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), newMessage],
      }));

      // Update chat last message
      setChats(prev => prev.map(chat =>
        chat.id === chatId
          ? { ...chat, lastMessage: newMessage, updatedAt: new Date() }
          : chat
      ));

      return newMessage;
    } catch (error) {
      toast.error('Failed to send message');
      throw error;
    }
  }, []);

  // Mark announcement as read
  const markAnnouncementAsRead = useCallback(async (id: string) => {
    try {
      await communicationApi.markAnnouncementAsRead(id);
      setAnnouncements(prev => prev.map(a =>
        a.id === id
          ? { ...a, readBy: [...a.readBy, userId] }
          : a
      ));
    } catch (error) {
      console.error('Failed to mark announcement as read:', error);
    }
  }, [userId]);

  // Pin/unpin announcement
  const pinAnnouncement = useCallback(async (id: string) => {
    try {
      const announcement = announcements.find(a => a.id === id);
      if (announcement) {
        await communicationApi.pinAnnouncement(id, !announcement.isPinned);
        setAnnouncements(prev => prev.map(a =>
          a.id === id
            ? { ...a, isPinned: !a.isPinned }
            : a
        ));
      }
    } catch (error) {
      console.error('Failed to pin announcement:', error);
    }
  }, [announcements]);

  // Socket event handlers
  useEffect(() => {
    if (!isConnected || !socket) return;

    // New message handler
    const handleNewMessage = (data: any) => {
      const { message, chat } = data;
      setMessages(prev => ({
        ...prev,
        [chat.id]: [...(prev[chat.id] || []), message],
      }));
      setChats(prev => prev.map(c =>
        c.id === chat.id
          ? { ...c, lastMessage: message, updatedAt: new Date() }
          : c
      ));
    };

    // New chat handler
    const handleChatCreated = (chat: any) => {
      setChats(prev => [chat, ...prev]);
    };

    // Chat updated handler
    const handleChatUpdated = (chat: any) => {
      setChats(prev => prev.map(c =>
        c.id === chat.id ? chat : c
      ));
    };

    // New announcement handler
    const handleNewAnnouncement = (announcement: any) => {
      setAnnouncements(prev => [announcement, ...prev]);
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
    const init = async () => {
      setIsLoading(true);
      await Promise.all([loadChats(), loadAnnouncements()]);
      setIsLoading(false);
    };
    init();
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
