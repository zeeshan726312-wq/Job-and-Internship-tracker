/**
 * Notification Service — Handles Browser Push Notifications & Email Alerts
 */

export const notificationService = {
  // Request permission for native browser push notifications
  async requestPermission() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }
      return Notification.permission === 'granted';
    }
    return false;
  },

  // Send a browser push notification
  sendPushNotification(title, body) {
    try {
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
          body,
          icon: '/favicon.ico'
        });
      }
    } catch (e) {
      console.warn('[Notification Service Error]', e);
    }
  },

  // Dispatch email notification (Simulated / EmailJS fallback)
  async sendEmailAlert({ toEmail, toName, subject, message }) {
    console.log(`[Email Alert Dispatched] To: ${toName} (${toEmail}) | Subject: ${subject}`);
    // Simulate API delay
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true, message: `Email sent to ${toEmail}` });
      }, 500);
    });
  }
};
