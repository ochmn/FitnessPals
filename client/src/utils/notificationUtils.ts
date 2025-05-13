import { formatDistance } from "date-fns";

// Function to check if notifications are supported
export function notificationsSupported(): boolean {
  return "Notification" in window;
}

// Function to request notification permission
export async function requestNotificationPermission(): Promise<boolean> {
  if (!notificationsSupported()) {
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission === "denied") {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === "granted";
}

// Function to display a notification for a reminder
export function showReminderNotification(title: string, location: string, time: Date): void {
  if (!notificationsSupported() || Notification.permission !== "granted") {
    return;
  }

  const timeUntil = formatDistance(time, new Date(), { addSuffix: true });
  
  const notification = new Notification("FitPet Reminder", {
    body: `${title} at ${location} ${timeUntil}`,
    icon: "/favicon.ico", // Would add a favicon in a real app
  });

  // Close the notification after 10 seconds
  setTimeout(() => {
    notification.close();
  }, 10000);

  // Handle click on notification
  notification.onclick = () => {
    window.focus();
    notification.close();
  };
}

// Function to schedule a notification
export function scheduleNotification(
  title: string,
  location: string,
  time: Date,
  notificationTime: Date
): void {
  const now = new Date();
  if (notificationTime > now) {
    const delay = notificationTime.getTime() - now.getTime();
    
    setTimeout(() => {
      showReminderNotification(title, location, time);
    }, delay);
  }
}

// Function to register a service worker for background notifications
// This would be implemented in a full PWA
export async function registerNotificationServiceWorker(): Promise<boolean> {
  if (!("serviceWorker" in navigator)) {
    return false;
  }

  try {
    // In a full app, this would register a service worker for background notifications
    return true;
  } catch (error) {
    console.error("Service worker registration failed:", error);
    return false;
  }
}
