import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { APP_CONFIG, getWsUrl } from '../config/app.config';
import { useAuth } from '../../api/hooks/use-auth';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  emit: (event: string, data: any) => void;
  on: (event: string, callback: (data: any) => void) => void;
  off: (event: string, callback?: (data: any) => void) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const { user, isAuthenticated } = useAuth();

  const connect = React.useCallback(() => {
    if (!isAuthenticated || !user) {
      console.log('Socket: User not authenticated');
      return;
    }

    if (socketRef.current?.connected) {
      console.log('Socket: Already connected');
      return;
    }

    console.log('Socket: Connecting...');
    const token = localStorage.getItem('accessToken');
    const socket = io(getWsUrl(), {
      path: APP_CONFIG.socketPath,
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 2,
      reconnectionDelay: 5000,
      autoConnect: true,
      timeout: 10000,
    });

    socket.on('connect', () => {
      console.log('Socket: Connected');
      setIsConnected(true);
    });

    socket.on('disconnect', (reason) => {
      setIsConnected(false);
    });

    socket.on('connect_error', () => {
      // Graceful fallback when WebSocket is inactive
      setIsConnected(false);
    });

    socketRef.current = socket;
  }, [isAuthenticated, user]);

  const disconnect = React.useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      console.log('Socket: Disconnected manually');
    }
  }, []);

  const emit = React.useCallback((event: string, data: any) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn('Socket: Cannot emit, not connected');
    }
  }, [isConnected]);

  const on = React.useCallback((event: string, callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  }, []);

  const off = React.useCallback((event: string, callback?: (data: any) => void) => {
    if (socketRef.current) {
      if (callback) {
        socketRef.current.off(event, callback);
      } else {
        socketRef.current.off(event);
      }
    }
  }, []);

  // Auto-connect on auth change
  useEffect(() => {
    if (isAuthenticated && user) {
      connect();
    } else {
      disconnect();
    }
  }, [isAuthenticated, user, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  const value = React.useMemo(() => ({
    socket: socketRef.current,
    isConnected,
    connect,
    disconnect,
    emit,
    on,
    off,
  }), [socketRef.current, isConnected, connect, disconnect, emit, on, off]);

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
