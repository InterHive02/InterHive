import { io, Socket } from 'socket.io-client';
import { APP_CONFIG } from '../../core/config/app.config';

export interface SocketEvents {
  connect: () => void;
  disconnect: () => void;
  error: (error: Error) => void;
  new_message: (data: any) => void;
  chat_created: (data: any) => void;
  chat_updated: (data: any) => void;
  new_announcement: (data: any) => void;
  typing: (data: { chatId: string; userId: string; isTyping: boolean }) => void;
  message_read: (data: { chatId: string; messageId: string; userId: string }) => void;
  unread_count: (data: { count: number }) => void;
}

class SocketClient {
  private socket: Socket | null = null;
  private _isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private eventListeners: Map<string, Set<Function>> = new Map();

  connect(token: string): void {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    this.socket = io(APP_CONFIG.wsBaseUrl, {
      path: APP_CONFIG.socketPath,
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this._isConnected = true;
      this.reconnectAttempts = 0;
      console.log('Socket connected');
      this.emitEvent('connect');
    });

    this.socket.on('disconnect', (reason) => {
      this._isConnected = false;
      console.log('Socket disconnected:', reason);
      this.emitEvent('disconnect');
    });

    this.socket.on('connect_error', (error) => {
      this.reconnectAttempts++;
      console.error('Socket connection error:', error);
      this.emitEvent('error', error);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      this.emitEvent('error', error);
    });

    // Custom events
    this.socket.on('new_message', (data) => {
      this.emitEvent('new_message', data);
    });

    this.socket.on('chat_created', (data) => {
      this.emitEvent('chat_created', data);
    });

    this.socket.on('chat_updated', (data) => {
      this.emitEvent('chat_updated', data);
    });

    this.socket.on('new_announcement', (data) => {
      this.emitEvent('new_announcement', data);
    });

    this.socket.on('typing', (data) => {
      this.emitEvent('typing', data);
    });

    this.socket.on('message_read', (data) => {
      this.emitEvent('message_read', data);
    });

    this.socket.on('unread_count', (data) => {
      this.emitEvent('unread_count', data);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this._isConnected = false;
    }
  }

  emit(event: string, data: any): void {
    if (this.socket && this.isConnected()) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit:', event);
    }
  }

  on<K extends keyof SocketEvents>(event: K, callback: SocketEvents[K]): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)?.add(callback as Function);
  }

  off<K extends keyof SocketEvents>(event: K, callback: SocketEvents[K]): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback as Function);
      if (listeners.size === 0) {
        this.eventListeners.delete(event);
      }
    }
  }

  private emitEvent(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this._isConnected;
  }
}

export const socketClient = new SocketClient();
