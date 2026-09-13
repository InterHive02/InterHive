import React, { useState, useEffect } from 'react';
import { useSocket } from '../../../core/providers/socket.provider';
import { useAuth } from '../../../api/hooks/use-auth';
import { ChatList } from '../components/chat-list';
import { ChatWindow } from '../components/chat-window';
import { AnnouncementList } from '../components/announcement-list';
import { useChat } from '../hooks/use-chat';
import { MessageSquare, Megaphone, Users } from 'lucide-react';

type TabType = 'chats' | 'announcements';

export const CommunicationPage: React.FC = () => {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const [activeTab, setActiveTab] = useState<TabType>('chats');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const {
    chats,
    messages,
    announcements,
    sendMessage,
    markAnnouncementAsRead,
    pinAnnouncement,
    isLoading,
    loadMessages,
  } = useChat(user?.id || '');

  // Auto-select first chat if available and no active chat
  useEffect(() => {
    if (chats.length > 0 && !activeChatId) {
      setActiveChatId(chats[0].id);
    }
  }, [chats, activeChatId]);

  const activeChat = chats.find(c => c.id === activeChatId);
  const activeMessages = activeChatId ? messages[activeChatId] || [] : [];

  const handleChatSelect = (chatId: string) => {
    setActiveChatId(chatId);
    loadMessages(chatId);
  };

  const handleSendMessage = (content: string, type?: string, attachments?: File[]) => {
    if (activeChatId) {
      sendMessage(activeChatId, content, type || 'text', attachments);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden">
      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('chats')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'chats'
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Chats
            {(chats || []).reduce((acc, chat) => acc + (chat?.unreadCount || 0), 0) > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {(chats || []).reduce((acc, chat) => acc + (chat?.unreadCount || 0), 0)}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'announcements'
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            Announcements
            {(announcements || []).filter(a => Array.isArray(a?.readBy) ? !a.readBy.includes(user?.id || '') : true).length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {(announcements || []).filter(a => Array.isArray(a?.readBy) ? !a.readBy.includes(user?.id || '') : true).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex h-[calc(100%-52px)]">
        {activeTab === 'chats' ? (
          <>
            {/* Chat List */}
            <div className="w-full lg:w-80 border-r border-gray-200 dark:border-gray-700 flex-shrink-0">
              <ChatList
                chats={chats}
                activeChatId={activeChatId || undefined}
                currentUserId={user?.id || ''}
                onChatSelect={handleChatSelect}
              />
            </div>

            {/* Chat Window */}
            <div className="flex-1 hidden lg:block">
              {activeChat ? (
                <ChatWindow
                  chat={{
                    id: activeChat.id,
                    name: activeChat.name,
                    isGroupChat: activeChat.isGroupChat,
                    avatar: activeChat.avatar,
                    participants: activeChat.participants,
                    isPinned: activeChat.isPinned,
                    isMuted: activeChat.isMuted,
                  }}
                  messages={activeMessages}
                  currentUserId={user?.id || ''}
                  onSendMessage={handleSendMessage}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    No conversation selected
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Select a chat from the list to start messaging
                  </p>
                </div>
              )}
            </div>

            {/* Mobile Chat View */}
            {activeChat && (
              <div className="lg:hidden flex-1">
                <ChatWindow
                  chat={{
                    id: activeChat.id,
                    name: activeChat.name,
                    isGroupChat: activeChat.isGroupChat,
                    avatar: activeChat.avatar,
                    participants: activeChat.participants,
                    isPinned: activeChat.isPinned,
                    isMuted: activeChat.isMuted,
                  }}
                  messages={activeMessages}
                  currentUserId={user?.id || ''}
                  onBack={() => setActiveChatId(null)}
                  onSendMessage={handleSendMessage}
                />
              </div>
            )}
          </>
        ) : (
          // Announcements
          <div className="w-full p-4 overflow-y-auto">
            <AnnouncementList
              announcements={announcements}
              userId={user?.id || ''}
              onMarkAsRead={markAnnouncementAsRead}
              onPin={pinAnnouncement}
            />
          </div>
        )}
      </div>
    </div>
  );
};
