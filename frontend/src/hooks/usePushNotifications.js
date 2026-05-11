import { useEffect, useState } from 'react';

export function usePushNotifications() {
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  const request = async () => {
    if (!('Notification' in window)) return 'unsupported';
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  };

  const scheduleDeadlineNotification = (title, body, url, delayMs) => {
    if (permission !== 'granted') return;
    setTimeout(() => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(sw => {
          sw.showNotification(title, { body, icon: '/favicon.svg', data: { url } });
        });
      } else {
        new Notification(title, { body, icon: '/favicon.svg' });
      }
    }, delayMs);
  };

  return { permission, request, scheduleDeadlineNotification };
}
