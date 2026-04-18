/**
 * Ghost Claw OS - Firebase Service
 * Push Notifications, Real-time Database, Analytics
 */

import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
  jobId?: string;
  type?: 'job_complete' | 'job_failed' | 'publish_success' | 'alert';
}

export interface FirebaseConfig {
  projectId: string;
  apiKey: string;
  messagingSenderId: string;
  appId: string;
  databaseURL?: string;
}

/**
 * Firebase Service
 * Handles notifications, real-time updates, and analytics
 */
export class FirebaseService {
  private config: FirebaseConfig;
  private notificationListener: any;
  private responseListener: any;
  private subscriptions: Map<string, (data: any) => void> = new Map();

  constructor(config: FirebaseConfig) {
    this.config = config;
    this.setupNotifications();
  }

  /**
   * Setup notification handlers
   */
  private setupNotifications() {
    // Set notification handler
    Notifications.setNotificationHandler({
      handleNotification: async (notification) => {
        console.log('Notification received:', notification);
        return {
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
          shouldShowBanner: true,
          shouldShowList: true,
        };
      },
    });

    // Listen for notifications
    this.notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        this.handleNotification(notification);
      }
    );

    // Listen for notification responses
    this.responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        this.handleNotificationResponse(response);
      });
  }

  /**
   * Handle incoming notification
   */
  private handleNotification(notification: Notifications.Notification) {
    const { data } = notification.request.content;

    // Emit event to subscribers
    if (data && typeof data === 'object' && 'type' in data) {
      const subscribers = this.subscriptions.get(String(data.type));
      if (subscribers) {
        subscribers(data);
      }
    }

    // Save to notification history
    this.saveNotificationToHistory({
      title: notification.request.content.title || '',
      body: notification.request.content.body || '',
      data,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Handle notification response (user tapped)
   */
  private handleNotificationResponse(response: Notifications.NotificationResponse) {
    const { data } = response.notification.request.content;

    console.log('Notification tapped:', data);

    // Navigate based on notification type
    if (data?.jobId) {
      // Navigate to job detail
      // router.push(`/modules/render-queue/${data.jobId}`);
    }
  }

  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Failed to request notification permissions:', error);
      return false;
    }
  }

  /**
   * Get device token
   */
  async getDeviceToken(): Promise<string | null> {
    try {
      // Check if already cached
      const cached = await AsyncStorage.getItem('deviceToken');
      if (cached) {
        return cached;
      }

      // Get new token
      const token = (await Notifications.getExpoPushTokenAsync()).data;

      // Cache token
      await AsyncStorage.setItem('deviceToken', token);

      return token;
    } catch (error) {
      console.error('Failed to get device token:', error);
      return null;
    }
  }

  /**
   * Send local notification
   */
  async sendLocalNotification(payload: NotificationPayload) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: payload.title,
          body: payload.body,
          data: payload.data || {},
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error('Failed to send local notification:', error);
    }
  }

  /**
   * Schedule notification
   */
  async scheduleNotification(
    payload: NotificationPayload,
    delaySeconds: number
  ) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: payload.title,
          body: payload.body,
          data: payload.data || {},
        },
      trigger: {
        seconds: delaySeconds,
      } as any,
      });
    } catch (error) {
      console.error('Failed to schedule notification:', error);
    }
  }

  /**
   * Subscribe to notification type
   */
  subscribe(type: string, callback: (data: any) => void): () => void {
    this.subscriptions.set(type, callback);

    // Return unsubscribe function
    return () => {
      this.subscriptions.delete(type);
    };
  }

  /**
   * Get notification history
   */
  async getNotificationHistory(limit: number = 20): Promise<any[]> {
    try {
      const history = await AsyncStorage.getItem('notificationHistory');
      if (!history) {
        return [];
      }

      const notifications = JSON.parse(history);
      return notifications.slice(-limit);
    } catch (error) {
      console.error('Failed to get notification history:', error);
      return [];
    }
  }

  /**
   * Save notification to history
   */
  private async saveNotificationToHistory(notification: any) {
    try {
      const history = await AsyncStorage.getItem('notificationHistory');
      const notifications = history ? JSON.parse(history) : [];

      notifications.push(notification);

      // Keep only last 100 notifications
      if (notifications.length > 100) {
        notifications.shift();
      }

      await AsyncStorage.setItem(
        'notificationHistory',
        JSON.stringify(notifications)
      );
    } catch (error) {
      console.error('Failed to save notification to history:', error);
    }
  }

  /**
   * Clear notification history
   */
  async clearNotificationHistory() {
    try {
      await AsyncStorage.removeItem('notificationHistory');
    } catch (error) {
      console.error('Failed to clear notification history:', error);
    }
  }

  /**
   * Send notification for job completion
   */
  async notifyJobComplete(jobId: string, jobName: string) {
    await this.sendLocalNotification({
      title: '✅ Job Complete',
      body: `${jobName} has finished processing`,
      data: { jobId, type: 'job_complete' },
      type: 'job_complete',
    });
  }

  /**
   * Send notification for job failure
   */
  async notifyJobFailed(jobId: string, jobName: string, error: string) {
    await this.sendLocalNotification({
      title: '❌ Job Failed',
      body: `${jobName} failed: ${error}`,
      data: { jobId, error, type: 'job_failed' },
      type: 'job_failed',
    });
  }

  /**
   * Send notification for publish success
   */
  async notifyPublishSuccess(storyId: string, platforms: string[]) {
    await this.sendLocalNotification({
      title: '🎉 Published Successfully',
      body: `Your story was published to ${platforms.join(', ')}`,
      data: { storyId, platforms, type: 'publish_success' },
      type: 'publish_success',
    });
  }

  /**
   * Send alert notification
   */
  async sendAlert(title: string, message: string) {
    await this.sendLocalNotification({
      title,
      body: message,
      data: { type: 'alert' },
      type: 'alert',
    });
  }

  /**
   * Get analytics event
   */
  async trackEvent(eventName: string, eventData?: Record<string, any>) {
    try {
      // Save event to local storage
      const events = await AsyncStorage.getItem('analyticsEvents');
      const eventsList = events ? JSON.parse(events) : [];

      eventsList.push({
        name: eventName,
        data: eventData,
        timestamp: new Date().toISOString(),
      });

      // Keep only last 1000 events
      if (eventsList.length > 1000) {
        eventsList.shift();
      }

      await AsyncStorage.setItem('analyticsEvents', JSON.stringify(eventsList));

      console.log('Event tracked:', eventName, eventData);
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  /**
   * Get analytics events
   */
  async getAnalyticsEvents(limit: number = 100): Promise<any[]> {
    try {
      const events = await AsyncStorage.getItem('analyticsEvents');
      if (!events) {
        return [];
      }

      const eventsList = JSON.parse(events);
      return eventsList.slice(-limit);
    } catch (error) {
      console.error('Failed to get analytics events:', error);
      return [];
    }
  }

  /**
   * Cleanup
   */
  cleanup() {
    if (this.notificationListener) {
      this.notificationListener.remove();
    }

    if (this.responseListener) {
      this.responseListener.remove();
    }

    this.subscriptions.clear();
  }
}

// Singleton instance
let instance: FirebaseService | null = null;

export function getFirebaseService(
  config?: FirebaseConfig
): FirebaseService {
  if (!instance && config) {
    instance = new FirebaseService(config);
  }
  return instance!;
}

export function resetFirebaseService(): void {
  if (instance) {
    instance.cleanup();
  }
  instance = null;
}
