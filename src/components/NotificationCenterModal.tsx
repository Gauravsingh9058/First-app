import { useState, useEffect } from "react";
import {
  Bell,
  BellRing,
  Check,
  CheckCheck,
  Trash2,
  Volume2,
  VolumeX,
  Sparkles,
  Flame,
  Droplet,
  Utensils,
  Clock,
  X,
} from "lucide-react";
import {
  NutriLensNotificationPreferences,
  NutriLensNotificationItem,
  getNotificationPreferences,
  saveNotificationPreferences,
  getNotificationHistory,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearAllNotifications,
  triggerTestNotification,
  requestNutriLensNotificationPermission,
  getBrowserNotificationPermission,
  NotificationType,
} from "@/lib/notifications";
import { toast } from "sonner";

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationCenterModal({ isOpen, onClose }: NotificationCenterModalProps) {
  const [prefs, setPrefs] = useState<NutriLensNotificationPreferences>(getNotificationPreferences);
  const [history, setHistory] = useState<NutriLensNotificationItem[]>(getNotificationHistory);
  const [permissionStatus, setPermissionStatus] = useState(getBrowserNotificationPermission);
  const [activeTab, setActiveTab] = useState<"inbox" | "settings">("inbox");

  const refreshData = () => {
    setPrefs(getNotificationPreferences());
    setHistory(getNotificationHistory());
    setPermissionStatus(getBrowserNotificationPermission());
  };

  useEffect(() => {
    if (!isOpen) return;
    refreshData();

    const handleUpdate = () => refreshData();
    window.addEventListener("nutrilens-notification-received", handleUpdate);
    window.addEventListener("nutrilens-notifications-updated", handleUpdate);
    window.addEventListener("nutrilens-notifications-prefs-changed", handleUpdate);

    return () => {
      window.removeEventListener("nutrilens-notification-received", handleUpdate);
      window.removeEventListener("nutrilens-notifications-updated", handleUpdate);
      window.removeEventListener("nutrilens-notifications-prefs-changed", handleUpdate);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const granted = await requestNutriLensNotificationPermission();
    refreshData();
    if (granted) {
      toast.success("System notifications enabled successfully!");
    } else {
      toast.info("In-app notifications are active.");
    }
  };

  const handleTogglePref = (key: keyof NutriLensNotificationPreferences, value: boolean) => {
    const updated = saveNotificationPreferences({ [key]: value });
    setPrefs(updated);
    toast.success("Notification settings updated");
  };

  const handleTestNotif = (type: NotificationType) => {
    triggerTestNotification(type);
  };

  const unreadCount = history.filter((h) => !h.read).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0F1722] border border-white/10 rounded-[28px] shadow-2xl overflow-hidden text-white flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#131E2D]/70">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <BellRing className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight text-white flex items-center gap-2">
                NutriLens Notifications
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-sky-500 text-slate-950">
                    {unreadCount} new
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">Real-time alerts, meals & streak reminders</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab selector */}
        <div className="grid grid-cols-2 p-2 bg-[#0B111A] border-b border-white/5 gap-1.5">
          <button
            onClick={() => setActiveTab("inbox")}
            className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === "inbox"
                ? "bg-[#1E293B] text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Bell className="h-3.5 w-3.5" />
            Inbox ({history.length})
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === "settings"
                ? "bg-[#1E293B] text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            Schedules & Channels
          </button>
        </div>

        {/* Permission Banner if not granted */}
        {permissionStatus !== "granted" && (
          <div className="p-3.5 bg-gradient-to-r from-sky-950/50 to-blue-950/50 border-b border-sky-500/20 flex items-center justify-between gap-3">
            <div className="text-xs">
              <span className="font-bold text-sky-300 block">Enable Device Notifications</span>
              <span className="text-[11px] text-slate-300">
                Receive lock screen alerts for your daily meal & water targets
              </span>
            </div>
            <button
              onClick={handleRequestPermission}
              className="shrink-0 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs transition"
            >
              Allow
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {activeTab === "inbox" && (
            <div className="space-y-3">
              {/* Quick Actions Row */}
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-slate-400">Test Notification Engine</span>
                {history.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] font-bold text-sky-400 hover:underline flex items-center gap-1"
                    >
                      <CheckCheck className="h-3 w-3" /> Mark all read
                    </button>
                    <button
                      onClick={clearAllNotifications}
                      className="text-[11px] font-bold text-rose-400 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" /> Clear
                    </button>
                  </div>
                )}
              </div>

              {/* Test chips */}
              <div className="flex flex-wrap gap-2 pb-2">
                <button
                  onClick={() => handleTestNotif("meal")}
                  className="px-3 py-1.5 rounded-xl bg-[#172535] hover:bg-[#1E334A] border border-sky-500/30 text-sky-300 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
                >
                  <Utensils className="h-3.5 w-3.5" /> Test Meal Alert
                </button>
                <button
                  onClick={() => handleTestNotif("hydration")}
                  className="px-3 py-1.5 rounded-xl bg-[#132A38] hover:bg-[#1A3B4F] border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
                >
                  <Droplet className="h-3.5 w-3.5" /> Test Water Alert
                </button>
                <button
                  onClick={() => handleTestNotif("streak")}
                  className="px-3 py-1.5 rounded-xl bg-[#321C16] hover:bg-[#47261E] border border-orange-500/30 text-orange-300 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
                >
                  <Flame className="h-3.5 w-3.5" /> Test Streak Alert
                </button>
                <button
                  onClick={() => handleTestNotif("ai")}
                  className="px-3 py-1.5 rounded-xl bg-[#261738] hover:bg-[#392154] border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
                >
                  <Sparkles className="h-3.5 w-3.5" /> Test AI Coach
                </button>
              </div>

              {/* History list */}
              {history.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <div className="h-12 w-12 rounded-full bg-[#182332] text-slate-500 grid place-items-center mx-auto">
                    <Bell className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-300">No notifications yet</p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Tap any of the test buttons above to see how real NutriLens alerts look and
                    chime.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => markNotificationAsRead(item.id)}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                        !item.read
                          ? "bg-[#182536] border-sky-500/40 shadow-sm"
                          : "bg-[#111A24] border-white/5 opacity-80"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {!item.read && (
                              <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
                            )}
                            <h4 className="text-xs font-bold text-white">{item.title}</h4>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">{item.body}</p>
                        </div>
                        <span className="text-[10px] text-slate-500 shrink-0">
                          {new Date(item.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-4">
              {/* Master Toggle */}
              <div className="p-4 rounded-2xl bg-[#141F2D] border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-sm font-black text-white">Enable Notifications</div>
                  <div className="text-xs text-slate-400">
                    Master switch for all NutriLens alerts
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.enabled}
                  onChange={(e) => handleTogglePref("enabled", e.target.checked)}
                  className="h-5 w-5 rounded border-slate-600 bg-slate-800 text-sky-500 focus:ring-0 cursor-pointer accent-sky-500"
                />
              </div>

              {/* Sound toggle */}
              <div className="p-3.5 rounded-2xl bg-[#141F2D] border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {prefs.soundEnabled ? (
                    <Volume2 className="h-4 w-4 text-sky-400" />
                  ) : (
                    <VolumeX className="h-4 w-4 text-slate-500" />
                  )}
                  <div>
                    <div className="text-xs font-bold text-white">Audio Chime</div>
                    <div className="text-[11px] text-slate-400">
                      Play tone when receiving notifications
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.soundEnabled}
                  onChange={(e) => handleTogglePref("soundEnabled", e.target.checked)}
                  className="h-5 w-5 rounded border-slate-600 bg-slate-800 text-sky-500 focus:ring-0 cursor-pointer accent-sky-500"
                />
              </div>

              {/* Channels list */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block px-1">
                  Active Channels
                </span>

                {[
                  {
                    key: "mealReminders" as const,
                    title: "Meal Logging Reminders",
                    desc: "Breakfast (8:30am), Lunch (1:00pm), Dinner (7:30pm)",
                    icon: Utensils,
                    color: "text-amber-400",
                  },
                  {
                    key: "waterAlerts" as const,
                    title: "Hydration Reminders",
                    desc: "Gentle reminders to drink 250ml water every 2 hours",
                    icon: Droplet,
                    color: "text-cyan-400",
                  },
                  {
                    key: "streakReminders" as const,
                    title: "Streak Safeguard Alert",
                    desc: "Notifies you at 8:30pm if your daily calorie goal is incomplete",
                    icon: Flame,
                    color: "text-orange-400",
                  },
                  {
                    key: "coachTips" as const,
                    title: "AI Nutritionist Insights",
                    desc: "Personalized micro/macro balance suggestions and tips",
                    icon: Sparkles,
                    color: "text-purple-400",
                  },
                ].map((channel) => {
                  const Icon = channel.icon;
                  return (
                    <div
                      key={channel.key}
                      className="p-3 rounded-2xl bg-[#111A24] border border-white/5 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl bg-white/5 ${channel.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{channel.title}</div>
                          <div className="text-[11px] text-slate-400">{channel.desc}</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={Boolean(prefs[channel.key])}
                        onChange={(e) => handleTogglePref(channel.key, e.target.checked)}
                        className="h-5 w-5 rounded border-slate-600 bg-slate-800 text-sky-500 focus:ring-0 cursor-pointer accent-sky-500"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-[#131E2D]/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            NutriLens Notification Service Active
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
