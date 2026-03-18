import { supabase } from './config';

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

// Subscribe to push notifications
export const subscribeToNotifications = async (userId) => {
  try {
    // Request permission first
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      console.log('Notification permission denied');
      return { success: false, error: 'Permission denied' };
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      // Subscribe to push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY' // You'll get this from Supabase
      });

      // Save subscription to database
      const { error } = await supabase
        .from('push_subscriptions')
        .upsert({
          user_id: userId,
          subscription: JSON.stringify(subscription),
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving subscription:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    }
  } catch (error) {
    console.error('Error subscribing to notifications:', error);
    return { success: false, error: error.message };
  }
};

// Send notification to user
export const sendNotification = async (userId, title, body, data = {}) => {
  try {
    // This would typically be done via Supabase Edge Function
    // For now, we'll use browser notifications as fallback
    
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        data,
        requireInteraction: true,
        actions: [
          {
            action: 'view',
            title: 'Виж'
          },
          {
            action: 'dismiss',
            title: 'Затвори'
          }
        ]
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
        // You can handle navigation here based on data
        if (data.profileId) {
          // Navigate to profile or cards
        }
      };

      return { success: true };
    }

    return { success: false, error: 'Permission not granted' };
  } catch (error) {
    console.error('Error sending notification:', error);
    return { success: false, error: error.message };
  }
};

// Send match notification
export const sendMatchNotification = async (matchedUserId, matcherName, drink, distance) => {
  return await sendNotification(
    matchedUserId,
    '🎉 Нов Match!',
    `${matcherName} също те хареса! Чака те с ${drink} на ${distance} км от теб!`,
    { type: 'match', matcherName }
  );
};

// Send new user notification (when someone registers)
export const sendNewUserNotification = async (userId, newUserName) => {
  return await sendNotification(
    userId,
    '👋 Нов потребител!',
    `${newUserName} се регистрира! Може да го/я намериш в картите.`,
    { type: 'new_user', newUserName }
  );
};

// Initialize notifications for user
export const initializeNotifications = async (userId) => {
  const result = await subscribeToNotifications(userId);
  
  if (result.success) {
    console.log('Notifications initialized successfully');
  } else {
    console.log('Failed to initialize notifications:', result.error);
  }
  
  return result;
};
