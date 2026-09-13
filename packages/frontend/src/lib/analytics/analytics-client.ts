interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: Date;
}

interface AnalyticsConfig {
  enabled: boolean;
  debug?: boolean;
  endpoint?: string;
  apiKey?: string;
}

class AnalyticsClient {
  private config: AnalyticsConfig = {
    enabled: true,
    debug: false,
  };
  private eventQueue: AnalyticsEvent[] = [];
  private flushInterval: number | null = null;
  private isFlushing = false;
  private userId: string | null = null;
  private sessionId: string | null = null;

  constructor(config?: Partial<AnalyticsConfig>) {
    this.config = { ...this.config, ...config };
    this.sessionId = this.generateSessionId();
    this.startFlushInterval();
  }

  initialize(userId: string): void {
    this.userId = userId;
    this.sessionId = this.generateSessionId();
  }

  track(eventName: string, properties?: Record<string, any>): void {
    if (!this.config.enabled) return;

    const event: AnalyticsEvent = {
      name: eventName,
      properties: {
        ...properties,
        userId: this.userId,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
      },
      timestamp: new Date(),
    };

    if (this.config.debug) {
      console.log('[Analytics] Track:', event);
    }

    this.eventQueue.push(event);

    if (this.eventQueue.length >= 10) {
      this.flush();
    }
  }

  pageView(page: string, properties?: Record<string, any>): void {
    this.track('page_view', {
      page,
      title: document.title,
      ...properties,
    });
  }

  identify(userId: string, traits?: Record<string, any>): void {
    this.userId = userId;
    this.track('identify', {
      userId,
      traits,
    });
  }

  private flush(): void {
    if (this.isFlushing || this.eventQueue.length === 0) return;

    this.isFlushing = true;
    const events = [...this.eventQueue];
    this.eventQueue = [];

    // Send events to analytics endpoint
    this.sendEvents(events)
      .then(() => {
        if (this.config.debug) {
          console.log(`[Analytics] Flushed ${events.length} events`);
        }
      })
      .catch((error) => {
        console.error('[Analytics] Failed to send events:', error);
        // Re-queue events
        this.eventQueue = [...events, ...this.eventQueue];
      })
      .finally(() => {
        this.isFlushing = false;
      });
  }

  private async sendEvents(events: AnalyticsEvent[]): Promise<void> {
    if (!this.config.endpoint) {
      // In development, just log events
      if (this.config.debug) {
        console.log('[Analytics] Events to send:', events);
      }
      return;
    }

    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.config.apiKey || '',
      },
      body: JSON.stringify({
        events,
        userId: this.userId,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send analytics: ${response.statusText}`);
    }
  }

  private startFlushInterval(): void {
    this.flushInterval = window.setInterval(() => {
      this.flush();
    }, 30000); // Flush every 30 seconds
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    this.flush();
  }

  enable(): void {
    this.config.enabled = true;
  }

  disable(): void {
    this.config.enabled = false;
  }

  setDebug(debug: boolean): void {
    this.config.debug = debug;
  }

  getSessionId(): string | null {
    return this.sessionId;
  }

  getUserId(): string | null {
    return this.userId;
  }
}

// Singleton instance
export const analyticsClient = new AnalyticsClient({
  enabled: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  debug: import.meta.env.VITE_NODE_ENV === 'development',
  endpoint: import.meta.env.VITE_ANALYTICS_ENDPOINT,
  apiKey: import.meta.env.VITE_ANALYTICS_API_KEY,
});

// Helper function for performance tracking
export const trackPerformance = (label: string) => {
  const startTime = performance.now();
  return () => {
    const duration = performance.now() - startTime;
    analyticsClient.track('performance', {
      label,
      duration: Math.round(duration),
    });
  };
};

// Helper for error tracking
export const trackError = (error: Error, context?: Record<string, any>) => {
  analyticsClient.track('error', {
    message: error.message,
    stack: error.stack,
    name: error.name,
    ...context,
  });
};
