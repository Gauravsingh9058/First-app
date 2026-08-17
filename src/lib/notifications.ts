import { toast } from "sonner";

export type NotificationType = "meal" | "hydration" | "streak" | "ai" | "system";

export interface NutriLensNotificationPreferences {
  enabled: boolean;
  mealReminders: boolean;
  waterAlerts: boolean;
  streakReminders: boolean;
  coachTips: boolean;
  weeklyReport: boolean;
  soundEnabled: boolean;
  mealTimes: {
    breakfast: string; // e.g. "08:30"
    lunch: string; // e.g. "13:00"
    dinner: string; // e.g. "19:30"
  };
}

export interface NutriLensNotificationItem {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  timestamp: number;
  read: boolean;
  actionUrl?: string;
}

const PREFS_STORAGE_KEY = "nutrilens_notification_preferences";
const HISTORY_STORAGE_KEY = "nutrilens_notification_history";

export const DEFAULT_NOTIFICATION_PREFERENCES: NutriLensNotificationPreferences = {
  enabled: true,
  mealReminders: true,
  waterAlerts: true,
  streakReminders: true,
  coachTips: true,
  weeklyReport: true,
  soundEnabled: true,
  mealTimes: {
    breakfast: "08:30",
    lunch: "13:00",
    dinner: "19:30",
  },
};

// Play a pleasant Web Audio notification chime
export function playNotificationChime() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Harmonic bell tone
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(880, now);
    osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.12); // D6

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.18, now + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.45);
    osc2.stop(now + 0.45);
  } catch (err) {
    console.debug("Could not play audio chime:", err);
  }
}

// Get notification preferences
export function getNotificationPreferences(): NutriLensNotificationPreferences {
  if (typeof window === "undefined") return DEFAULT_NOTIFICATION_PREFERENCES;
  try {
    const raw = localStorage.getItem(PREFS_STORAGE_KEY);
    if (!raw) return DEFAULT_NOTIFICATION_PREFERENCES;
    return { ...DEFAULT_NOTIFICATION_PREFERENCES, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_NOTIFICATION_PREFERENCES;
  }
}

// Save notification preferences
export function saveNotificationPreferences(
  prefs: Partial<NutriLensNotificationPreferences>,
): NutriLensNotificationPreferences {
  if (typeof window === "undefined") return DEFAULT_NOTIFICATION_PREFERENCES;
  const current = getNotificationPreferences();
  const updated = { ...current, ...prefs };
  try {
    localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(
      new CustomEvent("nutrilens-notifications-prefs-changed", { detail: updated }),
    );
  } catch (err) {
    console.warn("Error saving notification preferences:", err);
  }
  return updated;
}

// Get notification history
export function getNotificationHistory(): NutriLensNotificationItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// Save notification item to history
export function saveNotificationToHistory(
  item: Omit<NutriLensNotificationItem, "id" | "timestamp" | "read">,
) {
  if (typeof window === "undefined") return;
  try {
    const history = getNotificationHistory();
    const newItem: NutriLensNotificationItem = {
      ...item,
      id: "notif_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      timestamp: Date.now(),
      read: false,
    };
    const updated = [newItem, ...history].slice(0, 50); // Keep last 50
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("nutrilens-notification-received", { detail: newItem }));
    return newItem;
  } catch (err) {
    console.warn("Error saving notification to history:", err);
  }
}

// Mark notification as read
export function markNotificationAsRead(id: string) {
  if (typeof window === "undefined") return;
  const history = getNotificationHistory();
  const updated = history.map((item) => (item.id === id ? { ...item, read: true } : item));
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent("nutrilens-notifications-updated"));
}

// Mark all as read
export function markAllNotificationsAsRead() {
  if (typeof window === "undefined") return;
  const history = getNotificationHistory();
  const updated = history.map((item) => ({ ...item, read: true }));
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent("nutrilens-notifications-updated"));
}

// Clear all notifications
export function clearAllNotifications() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(HISTORY_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("nutrilens-notifications-updated"));
}

// Check current browser permission
export function getBrowserNotificationPermission(): NotificationPermission | "unsupported" {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission;
}

// Request real notification permission
export async function requestNutriLensNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  let granted = false;

  if ("Notification" in window) {
    try {
      if (Notification.permission === "granted") {
        granted = true;
      } else if (Notification.permission !== "denied") {
        const result = await Notification.requestPermission();
        granted = result === "granted";
      }
    } catch (err) {
      console.warn("Notification.requestPermission error (may be sandboxed iframe):", err);
      // If sandboxed, we still enable in-app notifications
      granted = true;
    }
  } else {
    // Unsupported browser / iframe fallback
    granted = true;
  }

  // Update preferences
  saveNotificationPreferences({ enabled: granted });

  if (granted) {
    // Send immediate confirmation notification
    sendNutriLensNotification({
      title: "NutriLens AI ✨",
      body: "Notifications enabled! You'll receive daily meal reminders, water alerts, and macro goal tracking.",
      type: "system",
    });
  }

  return granted;
}

// Send real system / browser / in-app notification
export function sendNutriLensNotification(params: {
  title: string;
  body: string;
  type?: NotificationType;
  actionUrl?: string;
  silent?: boolean;
}) {
  if (typeof window === "undefined") return;

  const prefs = getNotificationPreferences();
  if (!prefs.enabled) return;

  const type = params.type || "system";

  // Check specific channel toggles
  if (type === "meal" && !prefs.mealReminders) return;
  if (type === "hydration" && !prefs.waterAlerts) return;
  if (type === "streak" && !prefs.streakReminders) return;
  if (type === "ai" && !prefs.coachTips) return;

  // 1. Play sound chime if enabled
  if (prefs.soundEnabled && !params.silent) {
    playNotificationChime();
  }

  // 2. Dispatch native OS / Browser Notification if granted
  if ("Notification" in window && Notification.permission === "granted") {
    try {
      const nativeNotif = new Notification(params.title, {
        body: params.body,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: "nutrilens-" + type,
      });

      nativeNotif.onclick = () => {
        window.focus();
        if (params.actionUrl) {
          window.location.href = params.actionUrl;
        }
        nativeNotif.close();
      };
    } catch (err) {
      console.debug("Native notification error:", err);
    }
  }

  // 3. Save to in-app notification history
  saveNotificationToHistory({
    title: params.title,
    body: params.body,
    type,
    actionUrl: params.actionUrl,
  });

  // 4. Show rich in-app toast
  const iconMap: Record<NotificationType, string> = {
    meal: "🥗",
    hydration: "💧",
    streak: "🔥",
    ai: "✨",
    system: "🔔",
  };

  toast(params.title, {
    description: params.body,
    icon: iconMap[type] || "🔔",
    duration: 5000,
  });
}

// Trigger a test notification for a given channel
export function triggerTestNotification(type: NotificationType = "meal") {
  const samples: Record<NotificationType, { title: string; body: string; actionUrl?: string }> = {
    meal: {
      title: "🥗 Lunch Reminder",
      body: "Time for a healthy midday meal! You have 620 kcal & 45g protein remaining today.",
      actionUrl: "/meals",
    },
    hydration: {
      title: "💧 Hydration Check-in",
      body: "Drink a glass of water (250ml) to keep your energy high and boost metabolic efficiency.",
      actionUrl: "/home",
    },
    streak: {
      title: "🔥 Streak Alert!",
      body: "You're only 1 meal away from completing today's goal and securing your 7-day streak!",
      actionUrl: "/home",
    },
    ai: {
      title: "✨ AI Nutrition Insight",
      body: "Great job on your fiber intake today! Pair dinner with lean protein for ideal muscle recovery.",
      actionUrl: "/analytics",
    },
    system: {
      title: "🔔 NutriLens System Alert",
      body: "Daily meal log and barcode scanner are active. Reach your goals with smart AI reminders.",
      actionUrl: "/home",
    },
  };

  const sample = samples[type] || samples.system;
  sendNutriLensNotification({
    ...sample,
    type,
  });
}

// Background scheduler singleton for proactive notifications during active app sessions
let schedulerInitialized = false;
export function initNutriLensScheduler() {
  if (typeof window === "undefined" || schedulerInitialized) return;
  schedulerInitialized = true;

  // Check every 60 seconds
  setInterval(() => {
    try {
      const prefs = getNotificationPreferences();
      if (!prefs.enabled) return;

      const now = new Date();
      const currentHour = now.getHours();
      const currentMin = now.getMinutes();
      const currentTimeStr = `${String(currentHour).padStart(2, "0")}:${String(currentMin).padStart(2, "0")}`;
      const lastTriggerKey = `nutrilens_last_reminder_${now.toDateString()}_${currentTimeStr}`;

      if (sessionStorage.getItem(lastTriggerKey)) return;

      // Check Breakfast
      if (prefs.mealReminders && currentTimeStr === prefs.mealTimes.breakfast) {
        sessionStorage.setItem(lastTriggerKey, "true");
        sendNutriLensNotification({
          title: "🍳 Breakfast Time!",
          body: "Kickstart your metabolism with a protein-rich breakfast. Scan or log your meal now.",
          type: "meal",
          actionUrl: "/meals",
        });
      }

      // Check Lunch
      if (prefs.mealReminders && currentTimeStr === prefs.mealTimes.lunch) {
        sessionStorage.setItem(lastTriggerKey, "true");
        sendNutriLensNotification({
          title: "🥗 Lunch Reminder",
          body: "Time for lunch! Log your macros to stay on track for your daily health goal.",
          type: "meal",
          actionUrl: "/meals",
        });
      }

      // Check Dinner
      if (prefs.mealReminders && currentTimeStr === prefs.mealTimes.dinner) {
        sessionStorage.setItem(lastTriggerKey, "true");
        sendNutriLensNotification({
          title: "🍲 Evening Dinner Time",
          body: "Fuel up for restful recovery. Check your remaining calorie & protein allowance.",
          type: "meal",
          actionUrl: "/meals",
        });
      }

      // Check Streak Alert (around 20:30)
      if (prefs.streakReminders && currentTimeStr === "20:30") {
        sessionStorage.setItem(lastTriggerKey, "true");
        sendNutriLensNotification({
          title: "🔥 Evening Streak Check",
          body: "Don't let your streak slip! Check your daily food diary and close your calorie ring.",
          type: "streak",
          actionUrl: "/home",
        });
      }
    } catch (err) {
      console.debug("Scheduler tick error:", err);
    }
  }, 60000);
}
