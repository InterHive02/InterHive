import React, { useState } from 'react';
import { Search, Users, MessageSquare, MoreVertical, Pin, Bell, BellOff, CheckCircle, Circle, Clock } from 'lucide-react';

interface ChatListProps {
  chats: {
    id: string;
    name: string;
    isGroupChat: boolean;
    avatar?: string;
    participants: { id: string; firstName: string; lastName: string; profilePhoto?: string; isOnline?: boolean }[];
    lastMessage?: {
      content: string;
      senderId: string;
      createdAt: Date;
      isRead: boolean;
    };
    unreadCount: number;
    isPinned?: boolean;
    isMuted?: boolean;
    updatedAt: Date;
  }[];
  activeChatId?: string;
  onChatSelect: (chatId: string) => void;
  onSearch?: (query: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  activeChatId,
  onChatSelect,
  onSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const getChatName = (chat: ChatListProps['chats'][0]) => {
    if (chat.isGroupChat) {
      return chat.name;
    }
    const otherParticipant = chat.participants.find(p => p.id !== 'current-user-id');
    return otherParticipant ? `${otherParticipant.firstName} ${otherParticipant.lastName}` : 'Unknown User';
  };

  const getChatAvatar = (chat: ChatListProps['chats'][0]) => {
    if (chat.avatar) return chat.avatar;
    if (!chat.isGroupChat) {
      const otherParticipant = chat.participants.find(p => p.id !== 'current-user-id');
      return otherParticipant?.profilePhoto || '';
    }
    return '';
  };

  const getInitials = (chat: ChatListProps['chats'][0]) => {
    const name = getChatName(chat);
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  const filteredChats = searchQuery
    ? chats.filter(chat => 
        getChatName(chat).toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.participants.some(p => 
          `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : chats;

  const sortedChats = [...filteredChats].sort((a, b) => {
    // Pinned first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    // Then by last message time
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Messages</h2>
          <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none dark:text-white dark:placeholder-gray-400"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {sortedChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No conversations yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Start a new conversation with someone
            </p>
          </div>
        ) : (
          sortedChats.map((chat) => {
            const isActive = chat.id === activeChatId;
            const chatName = getChatName(chat);
            const avatar = getChatAvatar(chat);
            const initials = getInitials(chat);
            const otherParticipant = chat.participants.find(p => p.id !== 'current-user-id');

            return (
              <button
                key={chat.id}
                onClick={() => onChatSelect(chat.id)}
                className={`
                  w-full flex items-start gap-3 p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50
                  ${isActive ? 'bg-primary/5 dark:bg-primary/10 border-l-4 border-primary' : ''}
                `}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={chatName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {initials}
                    </div>
                  )}
                  {!chat.isGroupChat && otherParticipant?.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {chatName}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                      {chat.lastMessage ? formatTime(chat.lastMessage.createdAt) : ''}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate flex-1">
                      {chat.lastMessage ? (
                        <>
                          {chat.lastMessage.senderId === 'current-user-id' ? 'You: ' : ''}
                          {chat.lastMessage.content}
                        </>
                      ) : (
                        'No messages yet'
                      )}
                    </p>

                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                      {chat.isPinned && (
                        <Pin className="w-3 h-3 text-gray-400" />
                      )}
                      {chat.isMuted && (
                        <BellOff className="w-3 h-3 text-gray-400" />
                      )}
                      {chat.unreadCount > 0 && (
                        <span className="w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                          {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
