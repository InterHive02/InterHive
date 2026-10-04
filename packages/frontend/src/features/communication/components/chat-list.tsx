import React, { useState } from 'react';
import { Search, MessageSquare, Plus, Users, Shield, Briefcase, GraduationCap, Building2, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../../api/hooks/use-auth';

const ROLE_LABELS: Record<string, string> = {
  admin: 'Super Admin',
  hr: 'HR Manager',
  manager: 'Engineering Manager',
  company: 'Hiring Partner',
  intern: 'Intern Student',
};

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800',
  hr: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  manager: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  company: 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800',
  intern: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
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
  relatedDomain?: string;
  studentMetadata?: {
    fullName?: string;
    domain?: string;
    applicationStatus?: string;
    degree?: string;
    institution?: string;
  };
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
  onCreateGroupClick?: () => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  activeChatId,
  currentUserId,
  onChatSelect,
  onSearch,
  onCreateGroupClick,
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const userRole = user?.role || 'intern';

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
    if (chat?.isGroupChat) return chat.name || 'Intern Group';
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
          chat.relatedDomain?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  // Categorize chats by section for clean dashboard organization
  const categorizeChats = () => {
    const directChats = sortedChats.filter(c => !c.isGroupChat);
    const groupChats = sortedChats.filter(c => c.isGroupChat);

    if (userRole === 'admin') {
      return [
        { title: 'HR Managers', icon: Shield, items: directChats.filter(c => getOtherParticipant(c)?.role === 'hr') },
        { title: 'Engineering Managers', icon: Briefcase, items: directChats.filter(c => getOtherParticipant(c)?.role === 'manager') },
        { title: 'Corporate Hiring Partners', icon: Building2, items: directChats.filter(c => getOtherParticipant(c)?.role === 'company') },
        { title: 'System Groups', icon: Users, items: groupChats },
      ];
    }

    if (userRole === 'manager') {
      return [
        { title: 'Super Admin', icon: Shield, items: directChats.filter(c => getOtherParticipant(c)?.role === 'admin') },
        { title: 'HR Operations', icon: Shield, items: directChats.filter(c => getOtherParticipant(c)?.role === 'hr') },
        { title: 'Applied Students / Interns', icon: GraduationCap, items: directChats.filter(c => getOtherParticipant(c)?.role === 'intern') },
        { title: 'Domain Intern Groups', icon: Users, items: groupChats, canCreateGroup: true },
      ];
    }

    if (userRole === 'hr') {
      return [
        { title: 'Super Admin', icon: Shield, items: directChats.filter(c => getOtherParticipant(c)?.role === 'admin') },
        { title: 'Engineering Managers', icon: Briefcase, items: directChats.filter(c => getOtherParticipant(c)?.role === 'manager') },
        { title: 'Applied Students / Candidates', icon: GraduationCap, items: directChats.filter(c => getOtherParticipant(c)?.role === 'intern') },
      ];
    }

    if (userRole === 'intern') {
      return [
        { title: 'Assigned HR Manager', icon: Shield, items: directChats.filter(c => getOtherParticipant(c)?.role === 'hr') },
        { title: 'Assigned Technical Manager', icon: Briefcase, items: directChats.filter(c => getOtherParticipant(c)?.role === 'manager') },
        { title: 'My Team Groups', icon: Users, items: groupChats },
      ];
    }

    if (userRole === 'company') {
      return [
        { title: 'InterHive Admin Support', icon: Building2, items: directChats.filter(c => getOtherParticipant(c)?.role === 'admin') },
      ];
    }

    return [{ title: 'All Conversations', icon: MessageSquare, items: sortedChats }];
  };

  const sections = categorizeChats();

  const renderChatItem = (chat: Chat) => {
    const isActive = chat.id === activeChatId;
    const chatName = getChatName(chat);
    const avatar = getChatAvatar(chat);
    const initials = getInitials(chat);
    const otherParticipant = getOtherParticipant(chat);
    const unread = typeof chat.unreadCount === 'number' ? chat.unreadCount : 0;
    const studentDomain = chat.studentMetadata?.domain || chat.relatedDomain || otherParticipant?.role === 'intern' ? 'Full Stack Developer' : null;

    return (
      <button
        key={chat.id}
        onClick={() => onChatSelect(chat.id)}
        className={`w-full flex items-start gap-3 p-3.5 rounded-2xl transition-all text-left cursor-pointer mb-1 ${
          isActive
            ? 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 shadow-xs'
            : 'hover:bg-slate-100/80 dark:hover:bg-slate-800/50 border border-transparent'
        }`}
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt={chatName}
              width={44}
              height={44}
              loading="lazy"
              decoding="async"
              className="w-11 h-11 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
            />
          ) : (
            <div className={`w-11 h-11 rounded-2xl ${chat.isGroupChat ? 'bg-purple-600' : 'bg-indigo-600'} text-white font-bold flex items-center justify-center text-sm shadow-xs`}>
              {chat.isGroupChat ? <Users className="w-5 h-5" /> : initials}
            </div>
          )}
          {!chat.isGroupChat && otherParticipant?.isOnline && (
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
              {chatName}
            </h4>
            <span className="text-[11px] font-semibold text-slate-400 shrink-0">
              {chat.lastMessage ? formatTime(chat.lastMessage.createdAt) : ''}
            </span>
          </div>

          {/* Role & Domain Metadata Tag */}
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            {!chat.isGroupChat && otherParticipant?.role && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold border ${ROLE_COLORS[otherParticipant.role] || 'bg-slate-100 text-slate-600'}`}>
                {ROLE_LABELS[otherParticipant.role] || otherParticipant.role}
              </span>
            )}
            {chat.isGroupChat && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                Group • {chat.relatedDomain || 'Domain'}
              </span>
            )}
            {studentDomain && !chat.isGroupChat && otherParticipant?.role === 'intern' && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {studentDomain}
              </span>
            )}
          </div>

          {/* Last Message Preview */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex-1 font-medium">
              {chat.lastMessage ? (
                <>
                  {chat.lastMessage.senderId === currentUserId ? 'You: ' : ''}
                  {chat.lastMessage.content}
                </>
              ) : (
                'Tap to open conversation'
              )}
            </p>
            {unread > 0 && (
              <span className="w-5 h-5 bg-indigo-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shrink-0 ml-2 shadow-xs">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#121526] border-r border-slate-200/80 dark:border-slate-800/80">
      {/* Search Bar */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">Conversations</h2>
          </div>
          {(userRole === 'manager' || userRole === 'admin') && (
            <button
              onClick={onCreateGroupClick}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Group</span>
            </button>
          )}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search role, name, or domain..."
            value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Categorized Chat List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {sortedChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-2">
            <MessageSquare className="w-10 h-10 text-slate-300 dark:text-slate-600" />
            <p className="font-bold text-sm text-slate-700 dark:text-slate-300">No Authorized Chats Found</p>
            <p className="text-xs text-slate-400 max-w-xs">
              Your role-authorized conversations automatically appear here based on your account permissions.
            </p>
          </div>
        ) : (
          sections.map((sec, sIdx) => {
            if (!sec.items || sec.items.length === 0) return null;
            const Icon = sec.icon;
            return (
              <div key={sIdx} className="space-y-1">
                <div className="flex items-center justify-between px-2 py-1">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    <Icon className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{sec.title}</span>
                  </div>
                  {sec.canCreateGroup && (
                    <button
                      onClick={onCreateGroupClick}
                      className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Group</span>
                    </button>
                  )}
                </div>
                {sec.items.map(renderChatItem)}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
