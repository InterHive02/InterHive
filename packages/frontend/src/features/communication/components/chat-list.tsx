import React, { useState } from 'react';
import { Search, MessageSquare, MoreVertical, Pin, BellOff } from 'lucide-react';

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  hr: 'HR',
  manager: 'Manager',
  company: 'Company',
  intern: 'Intern',
};

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  hr: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  manager: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  company: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  intern: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

interface Participant {
  id: string;
  _id?: string;
  firstName: string;
  lastName: string;
  profilePhoto?: string;
  isOnline?: boolean;
  role?: string;
}

interface Chat {
  id: string;
  name?: string;
  isGroupChat: boolean;
  avatar?: string;
  participants: Participant[];
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
}

interface ChatListProps {
  chats: Chat[];
  activeChatId?: string;
  currentUserId: string;
  onChatSelect: (chatId: string) => void;
  onSearch?: (query: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  activeChatId,
  currentUserId,
  onChatSelect,
  onSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const getOtherParticipant = (chat: Chat): Participant | undefined => {
    if (!Array.isArray(chat?.participants)) return undefined;
    return chat.participants.find(
      p => (p?.id || p?._id?.toString()) !== currentUserId,
    );
  };

  const getChatName = (chat: Chat) => {
    if (chat?.isGroupChat) return chat.name || 'Group Chat';
    const other = getOtherParticipant(chat);
    return other
      ? `${other.firstName || ''} ${other.lastName || ''}`.trim() || 'Team Member'
      : chat?.name || 'Team Member';
  };

  const getChatAvatar = (chat: Chat) => {
    if (chat?.avatar) return chat.avatar;
    if (!chat?.isGroupChat) {
      const other = getOtherParticipant(chat);
      return other?.profilePhoto || '';
    }
    return '';
  };

  const getInitials = (chat: Chat) => {
    const name = getChatName(chat) || 'U';
    return name
      .split(' ')
      .map((n: string) => n[0] || '')
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  const formatTime = (date: Date) => {
    if (!date) return '';
    const now = new Date();
    const d = new Date(date);
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return d.toLocaleDateString();
  };

  const safeChats = Array.isArray(chats) ? chats : [];
  const filteredChats = searchQuery
    ? safeChats.filter(
        chat =>
          getChatName(chat).toLowerCase().includes(searchQuery.toLowerCase()) ||
          (Array.isArray(chat?.participants) &&
            chat.participants.some(p =>
              `${p?.firstName || ''} ${p?.lastName || ''}`
                .toLowerCase()
                .includes(searchQuery.toLowerCase()),
            )),
      )
    : safeChats;

  const sortedChats = [...filteredChats].sort((a, b) => {
    if (a?.isPinned && !b?.isPinned) return -1;
    if (!a?.isPinned && b?.isPinned) return 1;
    return new Date(b?.updatedAt || 0).getTime() - new Date(a?.updatedAt || 0).getTime();
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
            onChange={e => handleSearch(e.target.value)}
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
              Your role-based chats will appear here
            </p>
          </div>
        ) : (
          sortedChats.map(chat => {
            const isActive = chat.id === activeChatId;
            const chatName = getChatName(chat);
            const avatar = getChatAvatar(chat);
            const initials = getInitials(chat);
            const otherParticipant = getOtherParticipant(chat);
            const unread =
              typeof chat.unreadCount === 'number' ? chat.unreadCount : 0;

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
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {chatName}
                      </p>
                      {!chat.isGroupChat && otherParticipant?.role && (
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${
                            ROLE_COLORS[otherParticipant.role] || 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {ROLE_LABELS[otherParticipant.role] || otherParticipant.role}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                      {chat.lastMessage ? formatTime(chat.lastMessage.createdAt) : ''}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate flex-1">
                      {chat.lastMessage ? (
                        <>
                          {chat.lastMessage.senderId === currentUserId ? 'You: ' : ''}
                          {chat.lastMessage.content}
                        </>
                      ) : (
                        'No messages yet'
                      )}
                    </p>

                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                      {chat.isPinned && <Pin className="w-3 h-3 text-gray-400" />}
                      {chat.isMuted && <BellOff className="w-3 h-3 text-gray-400" />}
                      {unread > 0 && (
                        <span className="w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                          {unread > 9 ? '9+' : unread}
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
