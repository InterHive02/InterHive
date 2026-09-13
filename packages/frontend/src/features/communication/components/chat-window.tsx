import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, MoreVertical, Phone, Video, Users, Pin, Bell, BellOff, Search } from 'lucide-react';
import { MessageInput } from './message-input';

interface ChatWindowProps {
  chat: {
    id: string;
    name: string;
    isGroupChat: boolean;
    avatar?: string;
    participants: { id: string; firstName: string; lastName: string; profilePhoto?: string; isOnline?: boolean }[];
    isPinned?: boolean;
    isMuted?: boolean;
  };
  messages: {
    id: string;
    senderId: string;
    content: string;
    type: 'text' | 'image' | 'file' | 'audio' | 'video';
    attachments?: { name: string; url: string; type: string; size: number }[];
    createdAt: Date;
    isRead: boolean;
    isEdited: boolean;
    isDeleted: boolean;
  }[];
  currentUserId: string;
  onBack?: () => void;
  onSendMessage: (content: string, type?: string, attachments?: File[]) => void;
  onTyping?: (isTyping: boolean) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  chat,
  messages,
  currentUserId,
  onBack,
  onSendMessage,
  onTyping,
}) => {
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const getChatName = () => {
    if (chat.isGroupChat) {
      return chat.name;
    }
    const otherParticipant = chat.participants.find(p => p.id !== currentUserId);
    return otherParticipant ? `${otherParticipant.firstName} ${otherParticipant.lastName}` : 'Unknown User';
  };

  const getChatAvatar = () => {
    if (chat.avatar) return chat.avatar;
    if (!chat.isGroupChat) {
      const otherParticipant = chat.participants.find(p => p.id !== currentUserId);
      return otherParticipant?.profilePhoto || '';
    }
    return '';
  };

  const getInitials = () => {
    const name = getChatName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getOnlineStatus = () => {
    if (chat.isGroupChat) {
      const online = chat.participants.filter(p => p.isOnline && p.id !== currentUserId);
      return online.length > 0 ? `${online.length} online` : '';
    }
    const otherParticipant = chat.participants.find(p => p.id !== currentUserId);
    return otherParticipant?.isOnline ? 'Online' : 'Offline';
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleTyping = (isTyping: boolean) => {
    setIsTyping(isTyping);
    onTyping?.(isTyping);

    clearTimeout(typingTimeoutRef.current);
    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        onTyping?.(false);
      }, 3000);
    }
  };

  const formatMessageTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return messageDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOwnMessage = (senderId: string) => senderId === currentUserId;

  const groupMessagesByDate = () => {
    const groups: { date: string; messages: typeof messages }[] = [];
    let currentDate = '';

    messages.forEach((message) => {
      const date = formatDate(message.createdAt);
      if (date !== currentDate) {
        currentDate = date;
        groups.push({ date, messages: [] });
      }
      groups[groups.length - 1].messages.push(message);
    });

    return groups;
  };

  const messageGroups = groupMessagesByDate();

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="relative">
            {getChatAvatar() ? (
              <img
                src={getChatAvatar()}
                alt={getChatName()}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                {getInitials()}
              </div>
            )}
            {!chat.isGroupChat && chat.participants.find(p => p.id !== currentUserId)?.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
            )}
          </div>

          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {getChatName()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {getOnlineStatus()}
              {chat.isGroupChat && ` • ${chat.participants.length} members`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messageGroups.map((group, index) => (
          <div key={index}>
            <div className="flex justify-center mb-4">
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-500 dark:text-gray-400 rounded-full">
                {group.date}
              </span>
            </div>
            {group.messages.map((message) => {
              const isOwn = isOwnMessage(message.senderId);
              const sender = chat.participants.find(p => p.id === message.senderId);

              return (
                <div
                  key={message.id}
                  className={`flex items-end gap-2 mb-3 ${isOwn ? 'flex-row-reverse' : ''}`}
                >
                  {!isOwn && (
                    <div className="flex-shrink-0">
                      {sender?.profilePhoto ? (
                        <img
                          src={sender.profilePhoto}
                          alt={`${sender.firstName} ${sender.lastName}`}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400">
                          {sender ? `${sender.firstName[0]}${sender.lastName[0]}` : 'U'}
                        </div>
                      )}
                    </div>
                  )}

                  <div
                    className={`max-w-[70%] ${isOwn ? 'order-1' : ''}`}
                  >
                    {!isOwn && !chat.isGroupChat && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 ml-1">
                        {sender?.firstName} {sender?.lastName}
                      </p>
                    )}
                    <div
                      className={`p-3 rounded-lg ${
                        isOwn
                          ? 'bg-primary text-white rounded-br-none'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.isDeleted ? (
                          <span className="italic text-gray-400">Message deleted</span>
                        ) : (
                          message.content
                        )}
                      </p>
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.attachments.map((file, idx) => (
                            <a
                              key={idx}
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-xs ${isOwn ? 'text-white/80' : 'text-primary'} hover:underline flex items-center gap-1`}
                            >
                              📎 {file.name}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className={`flex items-center gap-1 mt-1 text-xs text-gray-400 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <span>{formatMessageTime(message.createdAt)}</span>
                      {isOwn && (
                        <span>
                          {message.isRead ? '✓✓' : '✓'}
                        </span>
                      )}
                      {message.isEdited && (
                        <span className="italic">(edited)</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 ml-10">
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg rounded-bl-none">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <MessageInput
        onSendMessage={onSendMessage}
        onTyping={handleTyping}
        isMuted={chat.isMuted}
      />
    </div>
  );
};
