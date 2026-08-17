import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getToday } from "@/lib/analytics.functions";
import { getProfile } from "@/lib/profile.functions";
import { addWater } from "@/lib/profile.functions";
import { LocalStore } from "@/lib/local-store";
import { getLocalDateString } from "@/lib/date-utils";
import { CalorieHero } from "@/components/CalorieHero";
import { StepCounter } from "@/components/StepCounter";
import { MacroRing } from "@/components/MacroRing";
import { RDA, MICRO_LABELS, MICRO_UNITS } from "@/lib/nutrition";
import {
  Camera,
  Droplet,
  Plus,
  Sparkles,
  Activity,
  Flame,
  Dumbbell,
  Wheat,
  Leaf,
  Heart,
  Utensils,
  ArrowRight,
  PartyPopper,
  Trophy,
  CheckCircle2,
  Lock,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { fireCongratulationsConfetti } from "@/lib/confetti";
import { CustomWaterModal } from "@/components/CustomWaterModal";
import { NotificationCenterModal } from "@/components/NotificationCenterModal";
import { getNotificationHistory } from "@/lib/notifications";
import { Bell } from "lucide-react";

export const Route = createFileRoute("/_authenticated/home")({
  head: () => ({ meta: [{ title: "Home — NutriLens" }] }),
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const getTodayFn = useServerFn(getToday);
  const getProfileFn = useServerFn(getProfile);
  const addWaterFn = useServerFn(addWater);

  const [extraWater, setExtraWater] = useState<number>(0);
  const [isWaterModalOpen, setIsWaterModalOpen] = useState<boolean>(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState<boolean>(false);
  const [unreadNotifs, setUnreadNotifs] = useState<number>(() => {
    const hist = getNotificationHistory();
    return hist.filter((n) => !n.read).length;
  });

  useEffect(() => {
    const updateUnread = () => {
      const hist = getNotificationHistory();
      setUnreadNotifs(hist.filter((n) => !n.read).length);
    };
    window.addEventListener("nutrilens-notification-received", updateUnread);
    window.addEventListener("nutrilens-notifications-updated", updateUnread);
    return () => {
      window.removeEventListener("nutrilens-notification-received", updateUnread);
      window.removeEventListener("nutrilens-notifications-updated", updateUnread);
    };
  }, []);

  const profileQ = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfileFn({ data: undefined }),
  });
  const todayQ = useQuery({ queryKey: ["today"], queryFn: () => getTodayFn({ data: undefined }) });

  useEffect(() => {
    if (profileQ.data && profileQ.data.profile && !profileQ.data.profile.onboarded) {
      const localP = LocalStore.getProfile();
      if (!localP?.onboarded) {
        navigate({ to: "/onboarding", replace: true });
      }
    }
  }, [profileQ.data, navigate]);

  const getLocalDateStr = () => getLocalDateString();

  const [todayStr, setTodayStr] = useState<string>(getLocalDateStr);
  const [localVersion, setLocalVersion] = useState<number>(0);

  // Subscribe to local SQLite / LocalStore data changes
  useEffect(() => {
    const handleDataChange = () => {
      setLocalVersion((v) => v + 1);
    };
    window.addEventListener("nutrilens-data-changed", handleDataChange);
    return () => window.removeEventListener("nutrilens-data-changed", handleDataChange);
  }, []);

  // Auto-refresh home page when 12:00 AM midnight passes and a new day starts
  useEffect(() => {
    const checkMidnight = () => {
      const nowStr = getLocalDateStr();
      if (nowStr !== todayStr) {
        setTodayStr(nowStr);
        setExtraWater(0);
        qc.invalidateQueries({ queryKey: ["today"] });
        qc.invalidateQueries({ queryKey: ["profile"] });
        toast.info(
          "🌅 A new day has started! Your daily dashboard and targets have been refreshed.",
          {
            duration: 5000,
          },
        );
      }
    };

    // Check every 5 seconds for midnight transition
    const timer = setInterval(checkMidnight, 5000);

    // Also check whenever user switches back to this window
    const handleFocus = () => checkMidnight();
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, [todayStr, qc]);

  const water = useMutation({
    mutationFn: async () => {
      const newTotal = LocalStore.addWater(todayStr, 1);
      setExtraWater(newTotal);
      try {
        await addWaterFn({ data: { glasses: 1 } });
      } catch {
        // Local state updated
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["today"] });
      toast.success("+1 glass logged");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const localMeals = typeof window !== "undefined" ? LocalStore.getMeals(todayStr) : [];
  const localWater = typeof window !== "undefined" ? LocalStore.getWater(todayStr) : 0;
  const localProfile = typeof window !== "undefined" ? LocalStore.getProfile() : null;

  const serverMeals = todayQ.data?.meals ?? [];
  const serverMealIds = new Set(serverMeals.map((m) => m.id));
  const combinedMeals = [...serverMeals, ...localMeals.filter((m) => !serverMealIds.has(m.id))];

  const profile = profileQ.data?.profile ||
    localProfile || {
      display_name: "Gaurav",
      daily_calorie_target: 2000,
      protein_target_g: 120,
      water_target_glasses: 8,
    };

  const rollup = todayQ.data?.rollup;
  const calTarget = Number(profile?.daily_calorie_target ?? 2000);
  const protTarget = Number(profile?.protein_target_g ?? 120);
  const waterTarget = Number(profile?.water_target_glasses ?? 8);

  const caloriesFromMeals = combinedMeals.reduce((sum, m) => sum + Number(m.calories || 0), 0);
  const proteinFromMeals = combinedMeals.reduce((sum, m) => sum + Number(m.protein_g || 0), 0);
  const carbsFromMeals = combinedMeals.reduce((sum, m) => sum + Number(m.carbs_g || 0), 0);
  const fatFromMeals = combinedMeals.reduce((sum, m) => sum + Number(m.fat_g || 0), 0);
  const fiberFromMeals = combinedMeals.reduce((sum, m) => sum + Number(m.fiber_g || 0), 0);
  const sugarFromMeals = combinedMeals.reduce((sum, m) => sum + Number(m.sugar_g || 0), 0);

  const calories = Math.max(Number(rollup?.calories || 0), caloriesFromMeals);
  const protein = Math.max(Number(rollup?.protein_g || 0), proteinFromMeals);
  const carbs = Math.max(Number(rollup?.carbs_g || 0), carbsFromMeals);
  const fat = Math.max(Number(rollup?.fat_g || 0), fatFromMeals);
  const fiber = Math.max(Number(rollup?.fiber_g || 0), fiberFromMeals);
  const sugar = Math.max(Number(rollup?.sugar_g || 0), sugarFromMeals);
  const waterGlasses = Math.max(Number(rollup?.water_glasses ?? 0), localWater, extraWater);

  // Advanced Micronutrients summary computed from combinedMeals & rollup
  const microKeys = Object.keys(RDA) as Array<keyof typeof RDA>;
  const microStats = microKeys.map((k) => {
    const serverVal = Number((rollup as Record<string, unknown> | null)?.[k] ?? 0);
    const mealVal = combinedMeals.reduce(
      (sum, m) => sum + Number((m as unknown as Record<string, unknown>)[k] || 0),
      0,
    );
    const total = Math.round((serverVal > 0 ? serverVal : mealVal) * 10) / 10;
    const rda = RDA[k];
    const pct = Math.min(100, Math.round((total / rda) * 100));
    return {
      key: k,
      label: MICRO_LABELS[k],
      unit: MICRO_UNITS[k],
      value: total,
      rda,
      pct,
    };
  });

  // Health Score computation
  const score = rollup?.score
    ? Number(rollup.score)
    : Math.min(
        100,
        Math.round(
          (calories > 0 ? 30 : 0) +
            Math.min(35, (protein / Math.max(1, protTarget)) * 35) +
            Math.min(20, (waterGlasses / Math.max(1, waterTarget)) * 20) +
            Math.min(15, (fiber / 30) * 15),
        ),
      );

  const lowMicros = microStats.filter((m) => m.pct < 50).slice(0, 3);

  // Daily Tasks Completion Logic
  const mealTaskDone = combinedMeals.length > 0;
  const calTaskDone = calories >= calTarget * 0.85; // Require at least 85% of calorie target
  const proteinTaskDone = protein >= protTarget * 0.8; // Require at least 80% of protein target
  const waterTaskDone = waterGlasses >= waterTarget; // Require full water intake target

  const totalTasksCount = 4;
  const completedTasksCount =
    (mealTaskDone ? 1 : 0) +
    (calTaskDone ? 1 : 0) +
    (proteinTaskDone ? 1 : 0) +
    (waterTaskDone ? 1 : 0);
  const isAllTasksCompleted = completedTasksCount === totalTasksCount;

  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);

  useEffect(() => {
    if (isAllTasksCompleted) {
      const celebratedKey = `celebrated_popup_${todayStr}`;
      const hasCelebrated = localStorage.getItem(celebratedKey);
      if (!hasCelebrated) {
        setShowVictoryModal(true);
        fireCongratulationsConfetti();
        localStorage.setItem(celebratedKey, "true");
        toast.success(
          "🎉 Outstanding! All your daily nutrition tasks & calorie targets are completed!",
        );
      }
    }
  }, [isAllTasksCompleted, todayStr]);

  // AI recommendation
  let advice = "Add a balanced lunch and you're on track for today.";
  if (calories === 0) advice = "Log your first meal to start tracking today.";
  else if (protein < protTarget * 0.6)
    advice = `You're ${Math.round(protTarget - protein)}g short on protein — a Greek yogurt or chicken breast would close most of that gap.`;
  else if (calories > calTarget * 1.1)
    advice = `You're ${Math.round(calories - calTarget)} kcal over today's target. Light, fiber-forward dinner recommended.`;
  else if (lowMicros.length > 0)
    advice = `Your ${lowMicros[0].label} intake is low today — consider adding a nutrient-dense snack.`;

  const formattedAuroraMeals = combinedMeals.map((m, idx) => ({
    id: String(m.id || idx),
    name: m.name || "Logged Meal",
    calories: Number(m.calories || 0),
    protein: Number(m.protein_g || 0),
    time: m.time || "Today",
    emoji: m.emoji || (idx % 2 === 0 ? "🍳" : "🥗"),
  }));

  return (
    <div className="space-y-6 pb-6 animate-in fade-in duration-300">
      {/* GREETING SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
        <div className="space-y-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#00E58F]/30 bg-[#00E58F]/10 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-[#00E58F]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00E58F] animate-pulse" />
            TODAY
          </div>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground truncate">
            Hello, {profile?.display_name ? profile.display_name.split(" ")[0] : "Gaurav"}
          </h1>
          <p className="text-xs font-semibold text-muted-foreground truncate">
            Let's make today healthier than yesterday.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          {/* Notification Bell Button */}
          <button
            onClick={() => setIsNotifModalOpen(true)}
            className="relative p-3 rounded-2xl bg-card border border-border hover:bg-muted text-foreground transition-all duration-200 active:scale-95 cursor-pointer shadow-sm"
            title="NutriLens Notifications & Reminders"
            aria-label="Open Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadNotifs > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-[10px] font-black text-slate-950 shadow-[0_0_8px_rgba(56,189,248,0.5)]">
                {unreadNotifs > 9 ? "9+" : unreadNotifs}
              </span>
            )}
          </button>

          {/* Scan Meal Button */}
          <button
            onClick={() => navigate({ to: "/scan" })}
            className="group relative flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#38BDF8] via-[#22D3EE] to-[#34D399] px-4 py-3 text-xs font-black text-[#071018] shadow-lg shadow-[#38BDF8]/25 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <div className="grid h-7 w-7 place-items-center rounded-xl bg-black/15 text-[#071018]">
              <Camera className="h-4 w-4" />
            </div>
            <span className="inline">Scan Meal</span>
          </button>
        </div>
      </div>

      {/* 1. CALORIE & MACRO OVERVIEW SECTION */}
      <CalorieHero
        consumed={calories}
        target={calTarget}
        protein={protein}
        proteinTarget={protTarget}
        score={score}
      />

      {/* 2. MACRO BREAKDOWN SECTION */}
      <div className="space-y-3 min-w-0">
        <div className="flex items-center justify-between min-w-0">
          <span className="font-display text-base font-extrabold tracking-tight text-foreground truncate">
            Macro Breakdown
          </span>
          <span className="text-xs font-semibold text-muted-foreground truncate">
            Daily Target Balance
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
          <MacroRing
            label="Protein"
            value={protein}
            target={protTarget}
            color="var(--color-protein)"
            icon={<Dumbbell className="h-3.5 w-3.5 text-[#00E58F]" />}
          />
          <MacroRing
            label="Carbs"
            value={carbs}
            target={Math.round((calTarget * 0.45) / 4)}
            color="var(--color-carbs)"
            icon={<Wheat className="h-3.5 w-3.5 text-blue-400" />}
          />
          <MacroRing
            label="Fat"
            value={fat}
            target={Math.round((calTarget * 0.3) / 9)}
            color="var(--color-fat)"
            icon={<Droplet className="h-3.5 w-3.5 text-amber-500" />}
          />
          <MacroRing
            label="Fiber"
            value={fiber}
            target={30}
            color="var(--color-fiber)"
            icon={<Leaf className="h-3.5 w-3.5 text-teal-400" />}
          />
          <MacroRing
            label="Sugar"
            value={sugar}
            target={50}
            color="var(--color-sugar)"
            icon={<Heart className="h-3.5 w-3.5 text-pink-400" />}
          />
        </div>
      </div>

      {/* COACH INSIGHT RECOMMENDATION CARD */}
      <div className="rounded-[22px] border border-[#38BDF8]/30 bg-[#38BDF8]/10 text-card-foreground shadow-sm dark:border-[#38BDF8]/30 dark:bg-gradient-to-r dark:from-[#38BDF8]/15 dark:via-[#0C1722] dark:to-[#071018] dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)] p-4 sm:p-5 backdrop-blur-xl min-w-0 w-full">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#38BDF8]">
          <Sparkles className="h-4 w-4 animate-pulse text-[#38BDF8] shrink-0" />
          <span>NutriLens Coach Recommendation</span>
        </div>
        <div className="mt-2 text-xs font-semibold text-foreground/90 dark:text-slate-300 leading-relaxed">
          {advice}
        </div>
      </div>

      {/* 3. ADVANCED MICRONUTRIENTS SECTION */}
      <div className="rounded-[24px] border border-border/80 bg-card text-card-foreground shadow-sm dark:border-white/10 dark:bg-[#0C1722]/90 dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] p-4 sm:p-5 backdrop-blur-xl space-y-4 min-w-0">
        <div className="flex items-center justify-between border-b border-border/50 dark:border-white/5 pb-3">
          <div className="flex items-center gap-2 min-w-0">
            <Activity className="h-4 w-4 text-[#38BDF8] shrink-0" />
            <span className="font-display text-base font-black text-foreground dark:text-white tracking-tight truncate">
              Advanced Micronutrients
            </span>
          </div>
          <span className="text-xs font-semibold text-muted-foreground dark:text-slate-400 shrink-0">
            Essential Minerals & Vitamins
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {microStats.map((m) => (
            <div
              key={m.key}
              className={`rounded-2xl border p-3 min-w-0 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 ${
                m.key === "iron_mg" || kIsMineral(m.key)
                  ? "border-[#38BDF8]/30 bg-[#38BDF8]/5 dark:border-[#38BDF8]/30 dark:bg-[#38BDF8]/5 shadow-sm dark:shadow-[0_0_12px_rgba(56,189,248,0.08)]"
                  : "border-border/60 bg-muted/20 dark:border-white/5 dark:bg-[#0F2130]/60"
              }`}
            >
              <div className="flex items-center justify-between gap-1 min-w-0">
                <span className="text-xs font-extrabold text-foreground dark:text-white truncate">
                  {m.label}
                </span>
                <span className="shrink-0 rounded-full bg-[#38BDF8]/15 px-2 py-0.5 text-[10px] font-black text-[#38BDF8] tabular-nums border border-[#38BDF8]/20">
                  {m.pct}%
                </span>
              </div>
              <div className="mt-1.5 font-display text-lg font-black text-foreground dark:text-white tabular-nums">
                {m.value}{" "}
                <span className="text-xs font-normal text-muted-foreground dark:text-slate-400">
                  {m.unit}
                </span>
              </div>
              <div className="text-[10px] font-semibold text-muted-foreground dark:text-slate-400 mt-0.5 truncate">
                RDA: {m.rda} {m.unit}
              </div>

              {/* Progress bar */}
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted dark:bg-white/5 border border-border/40 dark:border-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#38BDF8] to-[#34D399] shadow-sm dark:shadow-[0_0_8px_#38BDF8] transition-all duration-500"
                  style={{ width: `${m.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. FOOT STEP TRACKER SECTION */}
      <StepCounter
        todayStr={todayStr}
        weightKg={profile?.weight_kg || 70}
        heightCm={profile?.height_cm || 175}
        goalWeightKg={profile?.goal_weight_kg || profile?.weight_kg || 70}
        userGoal={profile?.goal || "fat_loss"}
        fitnessGoals={
          ((profile?.extended_data as Record<string, unknown>)?.fitness_goals as string[]) || []
        }
        activityLevel={profile?.activity || "moderate"}
      />

      {/* 5. WATER INTAKE SECTION */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-[24px] border border-cyan-500/30 bg-cyan-500/5 text-card-foreground shadow-sm dark:bg-gradient-to-br dark:from-cyan-500/10 dark:via-[#0C1722] dark:to-[#071018] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] p-4 sm:p-5 md:p-6 backdrop-blur-xl transition-all hover:border-cyan-400/50">
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          <div className="grid h-12 w-12 sm:h-14 sm:w-14 shrink-0 place-items-center rounded-2xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Droplet className="h-6 w-6 sm:h-7 sm:w-7 text-cyan-600 dark:text-cyan-400 animate-water-bounce" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground dark:text-slate-400 uppercase tracking-wider">
                Water Intake
              </span>
              <span className="text-[10px] font-extrabold text-cyan-500 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                {(waterGlasses * 0.25).toFixed(1)}L / {(waterTarget * 0.25).toFixed(1)}L
              </span>
            </div>
            <div className="font-display text-xl sm:text-2xl font-black tabular-nums text-foreground dark:text-white">
              {waterGlasses.toFixed(waterGlasses % 1 !== 0 ? 1 : 0)}
              <span className="text-xs sm:text-sm font-semibold text-muted-foreground dark:text-slate-400">
                {" "}
                / {waterTarget} glasses
              </span>
            </div>
          </div>
        </div>

        {/* Tablet Progress Bar */}
        <div className="w-full md:w-48 lg:w-64 px-1 md:px-0">
          <div className="flex items-center justify-between text-[11px] font-bold text-cyan-600 dark:text-cyan-300 mb-1">
            <span>Progress</span>
            <span className="font-mono">
              {waterTarget > 0 ? Math.min(100, Math.round((waterGlasses / waterTarget) * 100)) : 0}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-cyan-950/40 border border-cyan-500/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
              style={{
                width: `${waterTarget > 0 ? Math.min(100, Math.round((waterGlasses / waterTarget) * 100)) : 0}%`,
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end shrink-0">
          <button
            type="button"
            onClick={() => setIsWaterModalOpen(true)}
            className="flex items-center gap-1.5 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2.5 text-xs sm:text-sm font-black text-cyan-500 dark:text-cyan-400 hover:bg-cyan-500/20 transition-all active:scale-95 cursor-pointer shadow-sm"
            title="Custom Water System"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Custom
          </button>
          <button
            type="button"
            onClick={() => water.mutate()}
            disabled={water.isPending}
            className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#38BDF8] to-[#34D399] text-[#071018] font-black shadow-[0_0_20px_rgba(56,189,248,0.35)] transition-all active:scale-90 disabled:opacity-50 hover:brightness-110 cursor-pointer shrink-0"
            title="Add 1 glass"
          >
            <Plus className="h-6 w-6 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* 6. MEAL LOGGED TODAY SECTION */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between rounded-[24px] border border-[#38BDF8]/30 bg-[#38BDF8]/5 text-card-foreground shadow-sm dark:border-[#38BDF8]/30 dark:bg-gradient-to-br dark:from-[#38BDF8]/10 dark:via-[#0C1722] dark:to-[#071018] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] p-5 backdrop-blur-xl transition-all hover:border-[#38BDF8]/50">
          <div className="flex items-center gap-3.5">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30 shadow-[0_0_15px_rgba(56,189,248,0.25)]">
              <Utensils className="h-6 w-6 text-[#38BDF8]" />
            </div>
            <div>
              <div className="text-xs font-bold text-muted-foreground dark:text-slate-400 uppercase tracking-wider">
                Meals Logged Today
              </div>
              <div className="font-display text-2xl font-black tabular-nums text-foreground dark:text-white">
                {combinedMeals.length}{" "}
                <span className="text-xs font-semibold text-muted-foreground dark:text-slate-400">
                  meals
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate({ to: "/scan" })}
            className="rounded-2xl border border-[#38BDF8]/40 bg-[#38BDF8]/15 px-4 py-2.5 text-xs font-black text-[#38BDF8] hover:bg-gradient-to-r hover:from-[#38BDF8] hover:to-[#34D399] hover:text-[#071018] transition-all shadow-sm dark:shadow-[0_0_15px_rgba(56,189,248,0.2)] active:scale-95 cursor-pointer"
          >
            + Add Meal
          </button>
        </div>

        {/* RECENT MEALS LOGGED LIST */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-display text-base font-extrabold tracking-tight text-foreground">
              Recent Meals Logged
            </span>
            {combinedMeals.length > 0 && (
              <button
                onClick={() => navigate({ to: "/calendar" })}
                className="text-xs font-bold text-[#00E58F] hover:underline"
              >
                View History
              </button>
            )}
          </div>

          {combinedMeals.length === 0 ? (
            <div className="rounded-[24px] border-2 border-dashed border-border/80 bg-card/40 p-8 text-center backdrop-blur-md space-y-3">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#00E58F]/15 text-[#00E58F]">
                <Utensils className="h-6 w-6" />
              </div>
              <div>
                <p className="font-display text-base font-extrabold text-foreground">
                  No meals logged yet today
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Scan your plate with NutriLens for instant macro breakdown
                </p>
              </div>
              <button
                onClick={() => navigate({ to: "/scan" })}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#00E58F] px-5 py-2.5 text-xs font-black text-black shadow-md shadow-[#00E58F]/25 transition hover:scale-105 active:scale-95"
              >
                <Camera className="h-4 w-4" /> Scan your first meal{" "}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {combinedMeals.map((m, idx) => (
                <div
                  key={m.id || `meal-${idx}`}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 rounded-[20px] border border-border/80 bg-card/80 p-4 shadow-sm backdrop-blur-md transition-all duration-200 hover:border-border min-w-0"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-sm font-extrabold text-foreground truncate">
                      {m.name}
                    </div>
                    <div className="text-xs font-medium text-muted-foreground mt-0.5 truncate">
                      {m.serving_desc ? `${m.serving_desc} · ` : ""}
                      {m.eaten_at
                        ? new Date(m.eaten_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Today"}
                    </div>
                    {/* Advanced Micro Badges if available */}
                    {(m.iron_mg || m.calcium_mg || m.magnesium_mg) && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {Boolean(m.iron_mg) && (
                          <span className="inline-flex items-center rounded-lg bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-500">
                            Iron: {m.iron_mg}mg
                          </span>
                        )}
                        {Boolean(m.calcium_mg) && (
                          <span className="inline-flex items-center rounded-lg bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-400">
                            Calcium: {m.calcium_mg}mg
                          </span>
                        )}
                        {Boolean(m.magnesium_mg) && (
                          <span className="inline-flex items-center rounded-lg bg-[#00E58F]/10 border border-[#00E58F]/20 px-2 py-0.5 text-[10px] font-bold text-[#00E58F]">
                            Magnesium: {m.magnesium_mg}mg
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="text-left sm:text-right text-xs shrink-0">
                    <div className="font-display text-base font-black tabular-nums text-foreground">
                      {Math.round(Number(m.calories))}{" "}
                      <span className="text-xs text-muted-foreground font-normal">kcal</span>
                    </div>
                    <div className="text-[11px] font-semibold text-muted-foreground mt-0.5">
                      P {Math.round(Number(m.protein_g))}g · C {Math.round(Number(m.carbs_g))}g · F{" "}
                      {Math.round(Number(m.fat_g))}g
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CustomWaterModal
        isOpen={isWaterModalOpen}
        onClose={() => setIsWaterModalOpen(false)}
        currentGlasses={waterGlasses}
        waterTargetGlasses={waterTarget}
        todayStr={todayStr}
        onUpdate={() => {
          qc.invalidateQueries({ queryKey: ["today"] });
          qc.invalidateQueries({ queryKey: ["profile"] });
        }}
      />

      {/* AUTOMATIC CELEBRATION VICTORY POPUP MODAL */}
      <AnimatePresence>
        {showVictoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md my-auto rounded-[32px] border border-amber-400/40 bg-gradient-to-b from-[#18231E] via-[#0C1722] to-[#071018] p-6 sm:p-7 shadow-[0_0_50px_rgba(251,191,36,0.3)] text-foreground space-y-5 text-center overflow-hidden mx-auto"
            >
              {/* Glow background */}
              <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setShowVictoryModal(false)}
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-muted-foreground hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Trophy & Badge */}
              <div className="flex flex-col items-center justify-center space-y-2 pt-2">
                <div className="relative grid h-20 w-20 place-items-center rounded-3xl bg-amber-500/20 border border-amber-400/40 text-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.4)] animate-bounce">
                  <Trophy className="h-10 w-10 text-amber-400" />
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-1 text-xs font-black uppercase tracking-widest text-amber-400">
                  <PartyPopper className="h-3.5 w-3.5" /> Victory Unlocked
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <h2 className="font-display text-2xl font-black tracking-tight text-white">
                  Daily Goals Complete!
                </h2>
                <p className="text-xs font-medium text-slate-300">
                  Incredible discipline! You hit all 4 nutrition and calorie targets today.
                </p>
              </div>

              {/* Achievements Checklist */}
              <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5 space-y-2.5 text-left text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-bold text-slate-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    Meal Logged
                  </span>
                  <span className="font-black text-emerald-400">{combinedMeals.length} Meals</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-bold text-slate-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    Calorie Target
                  </span>
                  <span className="font-black text-emerald-400">
                    {Math.round(calories)} / {calTarget} kcal
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-bold text-slate-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    Protein Target
                  </span>
                  <span className="font-black text-emerald-400">
                    {Math.round(protein)}g / {protTarget}g
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-bold text-slate-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    Water Target
                  </span>
                  <span className="font-black text-emerald-400">
                    {waterGlasses} / {waterTarget} glasses
                  </span>
                </div>
              </div>

              {/* Claim Button */}
              <button
                onClick={() => {
                  fireCongratulationsConfetti();
                  setShowVictoryModal(false);
                }}
                className="w-full rounded-2xl bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 py-3.5 px-4 font-black text-slate-950 shadow-[0_0_25px_rgba(251,191,36,0.4)] hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <PartyPopper className="h-4 w-4" /> Claim Victory 🏆
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Notification Center Modal */}
      <NotificationCenterModal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
      />
    </div>
  );
}

function kIsMineral(key: string): boolean {
  return key === "iron_mg" || key === "calcium_mg" || key === "magnesium_mg";
}
