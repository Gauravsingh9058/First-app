import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  Settings,
  User,
  Camera,
  HeartPulse,
  Target,
  Utensils,
  Flame,
  Smartphone,
  Sparkles,
  Bell,
  ShieldCheck,
  HelpCircle,
  LogOut,
  ChevronRight,
  BadgeCheck,
  Lock,
  Check,
  X,
  Mail,
  Phone,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  getNotificationPreferences,
  saveNotificationPreferences,
  requestNutriLensNotificationPermission,
  triggerTestNotification,
  getBrowserNotificationPermission,
} from "@/lib/notifications";

export interface ProfileData {
  display_name: string;
  phone_number?: string;
  gender: string;
  dob?: string;
  age: number;
  height_cm: number;
  weight_kg: number;
  goal_weight_kg: number;
  activity: string;
  goal: string;
  diet: string;
  country?: string;
  blood_group?: string;
  photo_url?: string;
  [key: string]: unknown;
}

interface AuroraProfileScreenProps {
  profile: ProfileData;
  computedAge: number;
  computedBMI: number;
  computedBMR: number;
  computedTDEE: number;
  computedTargets: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    waterGlasses: number;
  };
  bmiCategory: {
    label: string;
    color: string;
    bg: string;
  };
  onEditProfile: () => void;
  onOpenStep: (stepId: number) => void;
  onSignOut: () => void;
  onUpdateAvatar?: (photoUrl: string) => void;
  onSaveSection?: (updatedFields: Record<string, unknown>) => Promise<void> | void;
}

export function AuroraProfileScreen({
  profile,
  computedAge,
  computedBMI,
  computedBMR,
  computedTDEE,
  computedTargets,
  bmiCategory,
  onEditProfile,
  onOpenStep,
  onSignOut,
  onUpdateAvatar,
  onSaveSection,
}: AuroraProfileScreenProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [userEmail, setUserEmail] = useState<string>("");
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | null>(profile.photo_url || null);

  // Active modal state
  const [activeModal, setActiveModal] = useState<
    | "subscription"
    | "notifications"
    | "privacy"
    | "help"
    | "personal"
    | "health"
    | "goals"
    | "diet"
    | "activity"
    | "devices"
    | null
  >(null);

  // Editable Form State for focused section editing
  const [editForm, setEditForm] = useState<Record<string, unknown>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Sync editForm state when a section modal is opened
  useEffect(() => {
    if (
      activeModal &&
      ["personal", "health", "goals", "diet", "activity", "devices"].includes(activeModal)
    ) {
      const ext = (profile.extended_data as Record<string, unknown>) || {};
      setEditForm({
        display_name: profile.display_name || "",
        gender: profile.gender || "male",
        dob: profile.dob || "1998-05-15",
        phone_number: profile.phone_number || "",
        country: profile.country || ext.country || "India",
        blood_group: profile.blood_group || ext.blood_group || "O+",
        height_cm: profile.height_cm || 175,
        weight_kg: profile.weight_kg || 75,
        goal_weight_kg: profile.goal_weight_kg || 70,
        body_fat_pct: ext.body_fat_pct || 20,
        goal: profile.goal || "fat_loss",
        daily_steps: ext.daily_steps || 8000,
        water_goal_l: ext.water_goal_l || 3.5,
        goal_timeline: ext.goal_timeline || "3 Months",
        diet: profile.diet || "non_veg",
        allergies: (ext.allergies as string[]) || [],
        health_flags: (ext.health_flags as string[]) || [],
        activity: profile.activity || "moderate",
        sitting_hours: ext.sitting_hours || 8,
        exercise_days: ext.exercise_days || 4,
        workout_type: ext.workout_type || "Gym & Cardio",
        wearables: ext.wearables || {
          google_fit: true,
          apple_health: false,
          health_connect: true,
          sync_steps: true,
          sync_calories: true,
        },
      });
    }
  }, [activeModal, profile]);

  const handleFormSave = async () => {
    setIsSaving(true);
    try {
      if (onSaveSection) {
        await onSaveSection(editForm);
      }
      toast.success("Profile updated successfully!");
      setActiveModal(null);
    } catch {
      toast.error("Failed to update profile section");
    } finally {
      setIsSaving(false);
    }
  };

  // Notification state synced with NutriLens notification engine
  const [notifications, setNotifications] = useState(getNotificationPreferences);
  const [notifPerm, setNotifPerm] = useState(getBrowserNotificationPermission);

  useEffect(() => {
    setNotifications(getNotificationPreferences());
    setNotifPerm(getBrowserNotificationPermission());
  }, [activeModal]);

  // Fetch email and avatar from Supabase auth session or guest session
  useEffect(() => {
    const loadSession = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user?.email) {
          setUserEmail(data.user.email);
          if (data.user.user_metadata?.avatar_url && !profile.photo_url) {
            setUserAvatarUrl(data.user.user_metadata.avatar_url);
          }
        } else {
          const guestStr = localStorage.getItem("nutrilens_guest_session");
          if (guestStr) {
            const guestObj = JSON.parse(guestStr);
            if (guestObj?.user?.email) {
              setUserEmail(guestObj.user.email);
            }
          }
        }
      } catch {
        // Fallback email
      }
    };
    loadSession();
  }, [profile.photo_url]);

  // Handle avatar photo selection
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setUserAvatarUrl(result);
        if (onUpdateAvatar) {
          onUpdateAvatar(result);
        }
        toast.success("Profile photo updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const displayName = profile.display_name || "Alex Johnson";
  const emailDisplay = userEmail || `${displayName.toLowerCase().replace(/\s+/g, ".")}@gmail.com`;
  const phoneDisplay = profile.phone_number || "+1 (555) 234-5678";
  const userInitial = (displayName[0] || "A").toUpperCase();

  // Goal formatted string
  const formattedGoal =
    profile.goal_weight_kg > 0
      ? `${profile.goal_weight_kg} kg`
      : profile.goal
        ? profile.goal.replace("_", " ")
        : "70 kg";

  // Option list items
  const optionRows = [
    {
      id: "personal",
      icon: User,
      title: "Personal Information",
      onClick: () => setActiveModal("personal"),
    },
    {
      id: "health",
      icon: HeartPulse,
      title: "Health Parameters",
      onClick: () => setActiveModal("health"),
    },
    {
      id: "goals",
      icon: Target,
      title: "Goals & Targets",
      onClick: () => setActiveModal("goals"),
    },
    {
      id: "diet",
      icon: Utensils,
      title: "Diet Preference",
      onClick: () => setActiveModal("diet"),
    },
    {
      id: "activity",
      icon: Flame,
      title: "Activity Level",
      onClick: () => setActiveModal("activity"),
    },
    {
      id: "devices",
      icon: Smartphone,
      title: "Devices & Apps",
      onClick: () => setActiveModal("devices"),
    },
    {
      id: "retake",
      icon: RotateCcw,
      title: "Retake Health Questionnaire",
      onClick: () => onEditProfile(),
    },
    {
      id: "subscription",
      icon: Sparkles,
      title: "Subscription",
      isPro: true,
      onClick: () => setActiveModal("subscription"),
    },
    {
      id: "notifications",
      icon: Bell,
      title: "Notifications",
      onClick: () => setActiveModal("notifications"),
    },
    {
      id: "privacy",
      icon: ShieldCheck,
      title: "Privacy",
      onClick: () => setActiveModal("privacy"),
    },
    {
      id: "help",
      icon: HelpCircle,
      title: "Help & Support",
      onClick: () => setActiveModal("help"),
    },
  ];

  return (
    <div className="relative text-foreground font-sans max-w-xl mx-auto space-y-4 pb-8">
      {/* Background Mesh Gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-80">
        <div className="absolute -left-32 -top-32 h-[450px] w-[450px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.14)_0%,rgba(0,0,0,0)_70%)] blur-3xl" />
        <div className="absolute -right-32 top-1/4 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(52,211,153,0.12)_0%,rgba(0,0,0,0)_70%)] blur-3xl" />
        <div className="absolute bottom-10 left-1/3 h-[550px] w-[550px] rounded-full bg-[radial-gradient(circle,rgba(129,140,248,0.08)_0%,rgba(0,0,0,0)_70%)] blur-3xl" />
      </div>

      <div className="relative z-10 space-y-4">
        {/* HEADER */}
        <div className="flex items-center justify-between py-2">
          <button
            onClick={() => navigate({ to: "/home" })}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-card border border-border text-foreground hover:bg-accent active:scale-95 transition-all shadow-md"
            aria-label="Back to Home"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <h1 className="font-display text-lg font-black tracking-tight text-foreground">
            Profile
          </h1>

          <button
            onClick={() => setActiveModal("personal")}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-card border border-border text-foreground hover:bg-accent active:scale-95 transition-all shadow-md"
            title="Edit Personal Information"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>

        {/* PROFILE CARD */}
        <div className="relative overflow-hidden rounded-[24px] border border-border bg-card/90 dark:bg-white/[0.05] dark:border-white/10 p-5 shadow-xl backdrop-blur-2xl">
          <div className="flex items-center gap-4">
            {/* Avatar with Camera Badge */}
            <div className="relative shrink-0">
              <div className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-[#38BDF8] via-[#6366F1] to-[#34D399] p-[2px] shadow-[0_0_25px_rgba(56,189,248,0.35)]">
                <div className="h-full w-full rounded-full bg-background dark:bg-[#071018] flex items-center justify-center overflow-hidden">
                  {userAvatarUrl ? (
                    <img
                      src={userAvatarUrl}
                      alt={displayName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="font-display text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] to-[#34D399]">
                      {userInitial}
                    </span>
                  )}
                </div>
              </div>

              {/* Edit Photo Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-[#38BDF8] to-[#34D399] text-[#071018] shadow-lg hover:scale-110 active:scale-95 transition-all border-2 border-background dark:border-[#071018]"
                title="Edit profile photo"
                aria-label="Edit profile photo"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoSelect}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Name, Badge & Contact info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display text-lg sm:text-xl font-extrabold text-foreground tracking-tight truncate">
                  {displayName}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#38BDF8] to-[#34D399] px-2.5 py-0.5 text-[10px] font-black uppercase text-[#071018] shadow-[0_0_12px_rgba(52,211,153,0.3)]">
                  AI
                </span>
              </div>

              <div className="mt-1 space-y-0.5 text-xs text-muted-foreground font-medium">
                <div className="flex items-center gap-1.5 truncate">
                  <Phone className="h-3 w-3 text-cyan-600 dark:text-[#38BDF8] shrink-0" />
                  <span className="truncate text-foreground/80 dark:text-white/80">
                    {phoneDisplay}
                  </span>
                  {profile.mobile_verified && (
                    <BadgeCheck
                      className="h-3.5 w-3.5 text-emerald-600 dark:text-[#34D399] shrink-0"
                      title="Verified Mobile"
                    />
                  )}
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <Mail className="h-3 w-3 text-cyan-600 dark:text-[#38BDF8] shrink-0" />
                  <span className="truncate text-foreground/80 dark:text-white/80">
                    {emailDisplay}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HEALTH SUMMARY CARD */}
        <div className="rounded-[24px] border border-border bg-card/90 dark:bg-white/[0.05] dark:border-white/10 p-4 shadow-xl backdrop-blur-2xl">
          <div className="grid grid-cols-4 gap-2 text-center divide-x divide-border/60 dark:divide-white/10">
            {/* Age */}
            <div className="flex flex-col items-center justify-center p-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Age
              </span>
              <span className="font-display text-base sm:text-lg font-black text-foreground mt-1">
                {computedAge}
              </span>
            </div>

            {/* Height */}
            <div className="flex flex-col items-center justify-center p-1 border-l border-border/60 dark:border-white/10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Height
              </span>
              <span className="font-display text-base sm:text-lg font-black text-foreground mt-1">
                {profile.height_cm || 178} cm
              </span>
            </div>

            {/* Weight */}
            <div className="flex flex-col items-center justify-center p-1 border-l border-border/60 dark:border-white/10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Weight
              </span>
              <span className="font-display text-base sm:text-lg font-black text-cyan-600 dark:text-[#38BDF8] mt-1">
                {profile.weight_kg || 70} kg
              </span>
            </div>

            {/* Goal */}
            <div className="flex flex-col items-center justify-center p-1 border-l border-border/60 dark:border-white/10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Goal
              </span>
              <span className="font-display text-base sm:text-lg font-black text-emerald-600 dark:text-[#34D399] mt-1 truncate max-w-full">
                {formattedGoal}
              </span>
            </div>
          </div>
        </div>

        {/* PROFILE OPTIONS LIST */}
        <div className="space-y-2 pt-1">
          <div className="px-1 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
            Account & Preferences
          </div>

          <div className="rounded-[24px] border border-border bg-card/90 dark:bg-white/[0.05] dark:border-white/10 overflow-hidden shadow-xl backdrop-blur-2xl divide-y divide-border/60 dark:divide-white/[0.06]">
            {optionRows.map((row) => {
              const Icon = row.icon;
              return (
                <button
                  key={row.id}
                  onClick={row.onClick}
                  className="w-full flex items-center justify-between p-3.5 px-4 hover:bg-accent/60 dark:hover:bg-white/[0.08] active:bg-accent transition-all text-left group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="h-10 w-10 rounded-2xl bg-muted/80 dark:bg-white/10 border border-border dark:border-white/10 flex items-center justify-center text-foreground dark:text-white/80 group-hover:text-cyan-600 dark:group-hover:text-[#38BDF8] group-hover:border-cyan-500/30 group-hover:bg-cyan-500/10 transition-all shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-foreground group-hover:text-cyan-600 dark:group-hover:text-[#38BDF8] transition-colors truncate">
                          {row.title}
                        </span>
                        {row.isPro && (
                          <span className="rounded-full bg-gradient-to-r from-[#38BDF8] to-[#34D399] px-2 py-0.2 text-[9px] font-black uppercase text-[#071018] shadow-sm shrink-0">
                            AI
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </button>
              );
            })}
          </div>
        </div>

        {/* LOGOUT ROW */}
        <div className="pt-2">
          <button
            onClick={onSignOut}
            className="w-full rounded-[20px] border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 active:scale-[0.99] p-3.5 px-4 transition-all flex items-center justify-between group shadow-lg"
          >
            <div className="flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-500 shrink-0">
                <LogOut className="h-5 w-5" />
              </div>
              <span className="text-sm font-extrabold text-rose-600 dark:text-rose-300 group-hover:text-rose-700 dark:group-hover:text-rose-200 block">
                Log Out
              </span>
            </div>

            <ChevronRight className="h-4 w-4 text-rose-500/70 group-hover:text-rose-600 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* MODALS FOR OPTIONS */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg my-auto rounded-[28px] border border-border bg-card p-5 sm:p-6 text-card-foreground shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto mx-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-display text-lg font-extrabold text-foreground flex items-center gap-2">
                  {activeModal === "personal" && (
                    <>
                      <User className="h-5 w-5 text-cyan-500" /> Personal Information
                    </>
                  )}
                  {activeModal === "health" && (
                    <>
                      <HeartPulse className="h-5 w-5 text-emerald-500" /> Health Parameters
                    </>
                  )}
                  {activeModal === "goals" && (
                    <>
                      <Target className="h-5 w-5 text-amber-500" /> Goals & Targets
                    </>
                  )}
                  {activeModal === "diet" && (
                    <>
                      <Utensils className="h-5 w-5 text-emerald-500" /> Diet Preference
                    </>
                  )}
                  {activeModal === "activity" && (
                    <>
                      <Flame className="h-5 w-5 text-orange-500" /> Activity Level
                    </>
                  )}
                  {activeModal === "devices" && (
                    <>
                      <Smartphone className="h-5 w-5 text-blue-500" /> Devices & App Sync
                    </>
                  )}
                  {activeModal === "subscription" && (
                    <>
                      <Sparkles className="h-5 w-5 text-cyan-600 dark:text-[#38BDF8]" /> NutriLens
                      AI Plan
                    </>
                  )}
                  {activeModal === "notifications" && (
                    <>
                      <Bell className="h-5 w-5 text-emerald-600 dark:text-[#34D399]" /> Notification
                      Settings
                    </>
                  )}
                  {activeModal === "privacy" && (
                    <>
                      <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-[#818CF8]" />{" "}
                      Privacy & Data Security
                    </>
                  )}
                  {activeModal === "help" && (
                    <>
                      <HelpCircle className="h-5 w-5 text-cyan-600 dark:text-[#38BDF8]" /> Help &
                      Support
                    </>
                  )}
                </h3>

                <button
                  onClick={() => setActiveModal(null)}
                  className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Personal Information Form */}
              {activeModal === "personal" && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-foreground block mb-1">Display Name</label>
                    <input
                      type="text"
                      value={editForm.display_name || ""}
                      onChange={(e) => setEditForm({ ...editForm, display_name: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background p-2.5 font-medium text-foreground"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-foreground block mb-1">Gender</label>
                      <select
                        value={editForm.gender || "male"}
                        onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                        className="w-full rounded-xl border border-border bg-background p-2.5 font-medium text-foreground"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-foreground block mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={editForm.dob || "1998-05-15"}
                        onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
                        className="w-full rounded-xl border border-border bg-background p-2.5 font-medium text-foreground"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-foreground block mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={editForm.phone_number || ""}
                        onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })}
                        className="w-full rounded-xl border border-border bg-background p-2.5 font-medium text-foreground"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-foreground block mb-1">Blood Group</label>
                      <select
                        value={editForm.blood_group || "O+"}
                        onChange={(e) => setEditForm({ ...editForm, blood_group: e.target.value })}
                        className="w-full rounded-xl border border-border bg-background p-2.5 font-medium text-foreground"
                      >
                        {["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"].map((bg) => (
                          <option key={bg} value={bg}>
                            {bg}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleFormSave}
                    disabled={isSaving}
                    className="w-full mt-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 py-3 font-extrabold text-slate-950 flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition"
                  >
                    <Check className="h-4 w-4" /> Save Changes
                  </button>
                </div>
              )}

              {/* Health Parameters Form */}
              {activeModal === "health" && (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-foreground block mb-1">Height (cm)</label>
                      <input
                        type="number"
                        value={editForm.height_cm || 175}
                        onChange={(e) =>
                          setEditForm({ ...editForm, height_cm: Number(e.target.value) })
                        }
                        className="w-full rounded-xl border border-border bg-background p-2.5 font-medium text-foreground"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-foreground block mb-1">
                        Current Weight (kg)
                      </label>
                      <input
                        type="number"
                        value={editForm.weight_kg || 75}
                        onChange={(e) =>
                          setEditForm({ ...editForm, weight_kg: Number(e.target.value) })
                        }
                        className="w-full rounded-xl border border-border bg-background p-2.5 font-medium text-foreground"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-foreground block mb-1">
                        Goal Weight (kg)
                      </label>
                      <input
                        type="number"
                        value={editForm.goal_weight_kg || 70}
                        onChange={(e) =>
                          setEditForm({ ...editForm, goal_weight_kg: Number(e.target.value) })
                        }
                        className="w-full rounded-xl border border-border bg-background p-2.5 font-medium text-foreground"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-foreground block mb-1">Body Fat %</label>
                      <input
                        type="number"
                        value={editForm.body_fat_pct || 20}
                        onChange={(e) =>
                          setEditForm({ ...editForm, body_fat_pct: Number(e.target.value) })
                        }
                        className="w-full rounded-xl border border-border bg-background p-2.5 font-medium text-foreground"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleFormSave}
                    disabled={isSaving}
                    className="w-full mt-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 font-extrabold text-slate-950 flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition"
                  >
                    <Check className="h-4 w-4" /> Save Changes
                  </button>
                </div>
              )}

              {/* Goals & Targets Form */}
              {activeModal === "goals" && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-foreground block mb-1">
                      Primary Fitness Goal
                    </label>
                    <select
                      value={editForm.goal || "fat_loss"}
                      onChange={(e) => setEditForm({ ...editForm, goal: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background p-2.5 font-medium text-foreground"
                    >
                      <option value="fat_loss">Fat Loss & Toning</option>
                      <option value="lean_bulk">Lean Muscle Bulk</option>
                      <option value="muscle_gain">Maximum Muscle Gain</option>
                      <option value="maintenance">Weight Maintenance</option>
                      <option value="recomp">Body Recomposition</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-foreground block mb-1">
                        Daily Step Goal
                      </label>
                      <input
                        type="number"
                        value={editForm.daily_steps || 8000}
                        onChange={(e) =>
                          setEditForm({ ...editForm, daily_steps: Number(e.target.value) })
                        }
                        className="w-full rounded-xl border border-border bg-background p-2.5 font-medium text-foreground"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-foreground block mb-1">
                        Water Goal (Liters)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={editForm.water_goal_l || 3.5}
                        onChange={(e) =>
                          setEditForm({ ...editForm, water_goal_l: Number(e.target.value) })
                        }
                        className="w-full rounded-xl border border-border bg-background p-2.5 font-medium text-foreground"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleFormSave}
                    disabled={isSaving}
                    className="w-full mt-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3 font-extrabold text-slate-950 flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition"
                  >
                    <Check className="h-4 w-4" /> Save Changes
                  </button>
                </div>
              )}

              {/* Diet Preference Form */}
              {activeModal === "diet" && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-foreground block mb-1">
                      Dietary Preference
                    </label>
                    <select
                      value={editForm.diet || "non_veg"}
                      onChange={(e) => setEditForm({ ...editForm, diet: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background p-2.5 font-medium text-foreground"
                    >
                      <option value="vegetarian">Vegetarian</option>
                      <option value="non_veg">Non-Vegetarian</option>
                      <option value="vegan">Vegan</option>
                      <option value="jain">Jain</option>
                      <option value="keto">Keto</option>
                      <option value="high_protein">High Protein</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-foreground block mb-1">Allergies</label>
                    <div className="flex flex-wrap gap-1.5">
                      {["Dairy", "Gluten", "Peanuts", "Eggs", "Soy", "Seafood", "Tree Nuts"].map(
                        (item) => {
                          const active = (editForm.allergies || []).includes(item);
                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() => {
                                const curr = editForm.allergies || [];
                                const updated = active
                                  ? curr.filter((x: string) => x !== item)
                                  : [...curr, item];
                                setEditForm({ ...editForm, allergies: updated });
                              }}
                              className={`rounded-xl px-3 py-1.5 text-xs font-bold border transition ${
                                active
                                  ? "bg-emerald-500 text-slate-950 border-emerald-500"
                                  : "bg-muted border-border text-foreground"
                              }`}
                            >
                              {item}
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleFormSave}
                    disabled={isSaving}
                    className="w-full mt-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 font-extrabold text-slate-950 flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition"
                  >
                    <Check className="h-4 w-4" /> Save Changes
                  </button>
                </div>
              )}

              {/* Activity Level Form */}
              {activeModal === "activity" && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-foreground block mb-1">Activity Level</label>
                    <select
                      value={editForm.activity || "moderate"}
                      onChange={(e) => setEditForm({ ...editForm, activity: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background p-2.5 font-medium text-foreground"
                    >
                      <option value="sedentary">Sedentary (Desk Job)</option>
                      <option value="light">Lightly Active (1-3 workouts/wk)</option>
                      <option value="moderate">Moderately Active (3-5 workouts/wk)</option>
                      <option value="active">Very Active (6-7 workouts/wk)</option>
                      <option value="very_active">Extra Active (Intense Daily)</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-foreground block mb-1">
                        Sitting Hours/Day
                      </label>
                      <input
                        type="number"
                        value={editForm.sitting_hours || 8}
                        onChange={(e) =>
                          setEditForm({ ...editForm, sitting_hours: Number(e.target.value) })
                        }
                        className="w-full rounded-xl border border-border bg-background p-2.5 font-medium text-foreground"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-foreground block mb-1">
                        Workout Days/Wk
                      </label>
                      <input
                        type="number"
                        value={editForm.exercise_days || 4}
                        onChange={(e) =>
                          setEditForm({ ...editForm, exercise_days: Number(e.target.value) })
                        }
                        className="w-full rounded-xl border border-border bg-background p-2.5 font-medium text-foreground"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleFormSave}
                    disabled={isSaving}
                    className="w-full mt-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 font-extrabold text-slate-950 flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition"
                  >
                    <Check className="h-4 w-4" /> Save Changes
                  </button>
                </div>
              )}

              {/* Devices & Wearables Form */}
              {activeModal === "devices" && (
                <div className="space-y-3 text-xs">
                  <div className="space-y-2">
                    {[
                      { key: "google_fit", label: "Google Fit Sync" },
                      { key: "apple_health", label: "Apple HealthKit Sync" },
                      { key: "health_connect", label: "Health Connect Android" },
                      { key: "sync_steps", label: "Sync Step Counter" },
                      { key: "sync_calories", label: "Sync Active Calories" },
                    ].map((item) => {
                      const w = editForm.wearables || {};
                      const isChecked = Boolean(w[item.key]);
                      return (
                        <div
                          key={item.key}
                          className="flex items-center justify-between p-3 rounded-2xl bg-muted/50 border border-border"
                        >
                          <span className="font-bold text-foreground">{item.label}</span>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              setEditForm({
                                ...editForm,
                                wearables: { ...w, [item.key]: e.target.checked },
                              });
                            }}
                            className="h-5 w-5 rounded border-border bg-background text-emerald-500 focus:ring-0 cursor-pointer"
                          />
                        </div>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={handleFormSave}
                    disabled={isSaving}
                    className="w-full mt-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 py-3 font-extrabold text-slate-950 flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition"
                  >
                    <Check className="h-4 w-4" /> Save Changes
                  </button>
                </div>
              )}

              {/* Subscription Content */}
              {activeModal === "subscription" && (
                <div className="space-y-4 text-xs">
                  <div className="rounded-2xl bg-gradient-to-r from-cyan-500/15 to-emerald-500/15 p-4 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-foreground">NutriLens AI</span>
                      <span className="rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-black text-slate-950">
                        ACTIVE
                      </span>
                    </div>
                    <p className="text-muted-foreground">
                      You are currently enjoying full NutriLens AI access including AI food camera
                      scanning, custom macro targets, and unlimited coach consultations.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-bold text-foreground">
                      Included NutriLens AI Features:
                    </div>
                    {[
                      "Unlimited Instant AI Meal Scans",
                      "Barcode Scanner & Nutrition Database",
                      "Personalized AI Nutrition Coach",
                      "Macro & Micro Nutrient Trends",
                      "Export Health Records",
                    ].map((feat) => (
                      <div
                        key={feat}
                        className="flex items-center gap-2 text-foreground font-medium"
                      >
                        <Check className="h-4 w-4 text-emerald-500" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notifications Content */}
              {activeModal === "notifications" && (
                <div className="space-y-4">
                  {/* Master & Permission status */}
                  <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-sky-400">
                        NutriLens Notification Engine
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {notifPerm === "granted"
                          ? "✓ Device notifications active"
                          : "Tap allow to receive system alerts"}
                      </div>
                    </div>
                    {notifPerm !== "granted" ? (
                      <button
                        onClick={async () => {
                          const granted = await requestNutriLensNotificationPermission();
                          setNotifPerm(getBrowserNotificationPermission());
                          setNotifications(getNotificationPreferences());
                          if (granted) toast.success("Device notifications enabled!");
                        }}
                        className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-black transition"
                      >
                        Enable
                      </button>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Active
                      </span>
                    )}
                  </div>

                  {/* Audio chime toggle */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/50 border border-border">
                    <div>
                      <div className="text-xs font-bold text-foreground">Sound & Audio Chime</div>
                      <div className="text-[11px] text-muted-foreground">
                        Play pleasant tone on meal & hydration check-ins
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(notifications.soundEnabled)}
                      onChange={(e) => {
                        const updated = saveNotificationPreferences({
                          soundEnabled: e.target.checked,
                        });
                        setNotifications(updated);
                        toast.success("Sound preference saved");
                      }}
                      className="h-5 w-5 rounded border-border bg-background text-emerald-500 focus:ring-0 cursor-pointer accent-emerald-500"
                    />
                  </div>

                  {/* Channels */}
                  <div className="space-y-2">
                    {[
                      {
                        key: "mealReminders" as const,
                        title: "Meal Logging Reminders",
                        desc: "Breakfast (8:30am), Lunch (1:00pm) & Dinner (7:30pm)",
                      },
                      {
                        key: "waterAlerts" as const,
                        title: "Hydration Alerts",
                        desc: "Gentle reminders to drink water every 2 hours",
                      },
                      {
                        key: "streakReminders" as const,
                        title: "Streak Safeguard Alert",
                        desc: "Evening alert (8:30pm) if daily macro goals are incomplete",
                      },
                      {
                        key: "coachTips" as const,
                        title: "AI Coach Daily Tips",
                        desc: "Smart suggestions tailored to your goals and nutrient gaps",
                      },
                      {
                        key: "weeklyReport" as const,
                        title: "Weekly Summary Report",
                        desc: "Weekly progress and body composition recap",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-3 rounded-2xl bg-muted/50 border border-border"
                      >
                        <div>
                          <div className="text-xs font-bold text-foreground">{item.title}</div>
                          <div className="text-[11px] text-muted-foreground">{item.desc}</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={Boolean(notifications[item.key])}
                          onChange={(e) => {
                            const updated = saveNotificationPreferences({
                              [item.key]: e.target.checked,
                            });
                            setNotifications(updated);
                            toast.success("Notification setting updated");
                          }}
                          className="h-5 w-5 rounded border-border bg-background text-emerald-500 focus:ring-0 cursor-pointer accent-emerald-500"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Test notification trigger */}
                  <div className="pt-2 border-t border-border flex items-center justify-between">
                    <span className="text-xs font-bold text-muted-foreground">
                      Test Live System:
                    </span>
                    <button
                      onClick={() => triggerTestNotification("meal")}
                      className="px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-bold transition active:scale-95"
                    >
                      Trigger Test Alert 🔔
                    </button>
                  </div>
                </div>
              )}

              {/* Privacy Content */}
              {activeModal === "privacy" && (
                <div className="space-y-3 text-xs text-foreground">
                  <div className="p-3 rounded-2xl bg-muted/50 border border-border space-y-1">
                    <div className="font-bold text-foreground flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-cyan-500" /> Encrypted Health Data
                    </div>
                    <p className="text-muted-foreground">
                      Your dietary inputs, weight logs, and personal health metrics are stored
                      securely and never sold to third parties.
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-muted/50 border border-border space-y-1">
                    <div className="font-bold text-foreground">Camera Access</div>
                    <p className="text-muted-foreground">
                      Camera permissions are used solely for scanning meal photos and food barcodes.
                    </p>
                  </div>
                </div>
              )}

              {/* Help & Support Content */}
              {activeModal === "help" && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-2xl bg-muted/50 border border-border space-y-1">
                    <div className="font-bold text-foreground">Need help or have suggestions?</div>
                    <p className="text-muted-foreground">
                      Our NutriLens support team is here for you 24/7.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      toast.info("Support request sent! We will contact you soon.");
                      setActiveModal(null);
                    }}
                    className="w-full rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#34D399] p-3 text-center font-bold text-[#071018]"
                  >
                    Contact Support Team
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
