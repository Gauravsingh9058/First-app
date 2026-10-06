import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { LocalStore, LocalProfile } from "@/lib/local-store";
import { supabase } from "@/integrations/supabase/client";
import { AuroraProfileScreen } from "@/components/AuroraProfileScreen";
import { saveOnboarding } from "@/lib/profile.functions";
import {
  requestNutriLensNotificationPermission,
  saveNotificationPreferences,
  triggerTestNotification,
} from "@/lib/notifications";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Flame,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  Bell,
  CheckCircle2,
  Lock,
  User,
  Activity,
  Heart,
  Target,
  Scale,
  Calendar,
  Dumbbell,
  Shield,
  Award,
  CircleCheck,
  Users,
  Tv,
  Utensils,
  Apple,
  Wheat,
  Salad,
  Fish,
  Sprout,
  Leaf,
  Beef,
} from "lucide-react";

function HearAboutIcon({ name }: { name: string }) {
  switch (name) {
    case "Instagram":
      return (
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] grid place-items-center text-white shadow-md shrink-0">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </div>
      );
    case "Facebook":
      return (
        <div className="h-9 w-9 rounded-xl bg-[#1877F2] grid place-items-center text-white shadow-md shrink-0">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </div>
      );
    case "TikTok":
      return (
        <div className="h-9 w-9 rounded-xl bg-black dark:bg-[#121212] border border-white/20 grid place-items-center text-white shadow-md shrink-0">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.98-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.57-1.31 1.56-1.31 2.56.02.82.42 1.61 1.08 2.1 1.05.82 2.57.8 3.58-.08.69-.58 1.08-1.46 1.08-2.36.02-4.29.01-8.58.01-12.87z" />
          </svg>
        </div>
      );
    case "YouTube":
      return (
        <div className="h-9 w-9 rounded-xl bg-[#FF0000] grid place-items-center text-white shadow-md shrink-0">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </div>
      );
    case "Google":
      return (
        <div className="h-9 w-9 rounded-xl bg-white border border-slate-200 grid place-items-center shadow-md shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.24 21.3 7.31 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 10.03 0 12s.46 3.83 1.26 5.42l4.02-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.24 2.7 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
        </div>
      );
    case "X":
      return (
        <div className="h-9 w-9 rounded-xl bg-black text-white border border-white/20 grid place-items-center shadow-md shrink-0">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>
      );
    case "Friend or family":
      return (
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-500 grid place-items-center text-white shadow-md shrink-0">
          <Users className="w-5 h-5 stroke-[2.5]" />
        </div>
      );
    case "Play Store":
      return (
        <div className="h-9 w-9 rounded-xl bg-slate-900 border border-slate-700 grid place-items-center shadow-md shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M3.6 1.8C3.2 2.2 3 2.8 3 3.6v16.8c0 .8.2 1.4.6 1.8l.1.1 9.4-9.4v-.2-.2L3.7 1.7l-.1.1z"
            />
            <path
              fill="#FBBC04"
              d="M16.2 15.8l-3.1-3.1v-.2-.2l3.1-3.1.1.1 3.7 2.1c1.1.6 1.1 1.7 0 2.3l-3.8 2.1z"
            />
            <path fill="#4285F4" d="M16.3 15.7L13.1 12.5 3.6 22c.4.4.9.4 1.6 0l11.1-6.3" />
            <path fill="#34A853" d="M16.3 8.3L5.2 2c-.7-.4-1.2-.4-1.6 0l9.5 9.5 3.2-3.2z" />
          </svg>
        </div>
      );
    case "TV":
      return (
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 grid place-items-center text-white shadow-md shrink-0">
          <Tv className="w-5 h-5 stroke-[2.2]" />
        </div>
      );
    default:
      return (
        <div className="h-9 w-9 rounded-xl bg-muted grid place-items-center text-lg shrink-0">
          📢
        </div>
      );
  }
}

function DietOptionIcon({ name }: { name: string }) {
  switch (name) {
    case "Balanced":
      return (
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 grid place-items-center text-white shadow-md shrink-0">
          <Utensils className="w-5 h-5 stroke-[2.5]" />
        </div>
      );
    case "Whole-food focus":
      return (
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-lime-500 to-emerald-600 grid place-items-center text-white shadow-md shrink-0">
          <Apple className="w-5 h-5 stroke-[2.5]" />
        </div>
      );
    case "Mediterranean":
      return (
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 grid place-items-center text-white shadow-md shrink-0">
          <Wheat className="w-5 h-5 stroke-[2.5]" />
        </div>
      );
    case "Flexitarian":
      return (
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-500 grid place-items-center text-white shadow-md shrink-0">
          <Salad className="w-5 h-5 stroke-[2.5]" />
        </div>
      );
    case "Pescatarian":
      return (
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 grid place-items-center text-white shadow-md shrink-0">
          <Fish className="w-5 h-5 stroke-[2.5]" />
        </div>
      );
    case "Vegetarian":
      return (
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 grid place-items-center text-white shadow-md shrink-0">
          <Sprout className="w-5 h-5 stroke-[2.5]" />
        </div>
      );
    case "Vegan":
      return (
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-green-500 to-lime-400 grid place-items-center text-white shadow-md shrink-0">
          <Leaf className="w-5 h-5 stroke-[2.5]" />
        </div>
      );
    case "Low-carb":
      return (
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-rose-500 to-red-600 grid place-items-center text-white shadow-md shrink-0">
          <Flame className="w-5 h-5 stroke-[2.5]" />
        </div>
      );
    case "Keto":
      return (
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-amber-600 to-red-500 grid place-items-center text-white shadow-md shrink-0">
          <Zap className="w-5 h-5 stroke-[2.5]" />
        </div>
      );
    case "Paleo":
      return (
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-700 grid place-items-center text-white shadow-md shrink-0">
          <Beef className="w-5 h-5 stroke-[2.5]" />
        </div>
      );
    default:
      return (
        <div className="h-9 w-9 rounded-xl bg-muted grid place-items-center text-lg shrink-0">
          🥗
        </div>
      );
  }
}

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({ meta: [{ title: "Profile Setup — NutriLens" }] }),
  component: CalAiOnboarding,
});

export function CalAiOnboarding() {
  const navigate = useNavigate();
  const saveOnboardingFn = useServerFn(saveOnboarding);

  // Step Counter (1 to 23)
  const [step, setStep] = useState(1);
  const totalSteps = 23;

  // Profile View / Setup Mode State
  const [isEditingSetup, setIsEditingSetup] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<LocalProfile | null>(() =>
    LocalStore.getProfile(),
  );

  // Listen to profile updates
  useEffect(() => {
    const handleProfileChange = () => {
      setCurrentProfile(LocalStore.getProfile());
    };
    window.addEventListener("nutrilens-data-changed", handleProfileChange);
    return () => window.removeEventListener("nutrilens-data-changed", handleProfileChange);
  }, []);

  // Form Data State
  const [sex, setSex] = useState<"male" | "female" | "other">("male");
  const [workouts, setWorkouts] = useState<"0-2" | "3-5" | "6+">("3-5");
  const [hearAbout, setHearAbout] = useState<string>("Instagram");
  const [triedOtherApps, setTriedOtherApps] = useState<"yes" | "no">("yes");

  // Height State
  const [heightUnit, setHeightUnit] = useState<"ft_in" | "cm">("cm");
  const [heightCm, setHeightCm] = useState(175);
  const [heightFeet, setHeightFeet] = useState(5);
  const [heightInches, setHeightInches] = useState(9);

  // Weight State
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [weightKg, setWeightKg] = useState(69.7);

  // Birthday State
  const [birthMonth, setBirthMonth] = useState("August");
  const [birthDay, setBirthDay] = useState(20);
  const [birthYear, setBirthYear] = useState(2005);

  // Medical/Trainer
  const [hasTrainer, setHasTrainer] = useState<"yes" | "no">("no");

  // Goal & Desired Weight
  const [goal, setGoal] = useState<"lose" | "maintain" | "gain">("gain");
  const [desiredWeightKg, setDesiredWeightKg] = useState(79.4);
  const [weeklyRateKg, setWeeklyRateKg] = useState(0.8);

  // Preferences & Obstacles
  const [obstacle, setObstacle] = useState("Lack of consistency");
  const [diet, setDiet] = useState("Balanced");
  const [accomplishment, setAccomplishment] = useState("Eat and live healthier");

  // Notifications toggle mock
  const [notificationsAllowed, setNotificationsAllowed] = useState(false);

  // Commitment hold state
  const [holdProgress, setHoldProgress] = useState(0);
  const [isCommitted, setIsCommitted] = useState(false);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Plan generation state
  const [genPercent, setGenPercent] = useState(0);
  const [genStepIdx, setGenStepIdx] = useState(0);

  // Sync Feet/Inches to Cm
  useEffect(() => {
    if (heightUnit === "ft_in") {
      const totalInches = heightFeet * 12 + heightInches;
      setHeightCm(Math.round(totalInches * 2.54));
    }
  }, [heightFeet, heightInches, heightUnit]);

  // Handle Ruler Weight Drag
  const handleRulerDrag = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    isDesired = false,
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const offsetX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const ratio = offsetX / rect.width;

    // Scale 40kg to 140kg or 90lbs to 300lbs
    if (weightUnit === "kg") {
      const val = Number((40 + ratio * 80).toFixed(1));
      if (isDesired) setDesiredWeightKg(val);
      else setWeightKg(val);
    } else {
      const valLbs = Number((90 + ratio * 180).toFixed(1));
      const valKg = Number((valLbs / 2.20462).toFixed(1));
      if (isDesired) setDesiredWeightKg(valKg);
      else setWeightKg(valKg);
    }
  };

  // Plan Generation Timer
  useEffect(() => {
    if (step === 21) {
      setGenPercent(0);
      setGenStepIdx(0);
      const interval = setInterval(() => {
        setGenPercent((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep(22), 600);
            return 100;
          }
          const next = prev + 2;
          if (next > 25 && next <= 50) setGenStepIdx(1);
          else if (next > 50 && next <= 75) setGenStepIdx(2);
          else if (next > 75) setGenStepIdx(3);
          return next;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Hold to Commit Logic
  const startHold = () => {
    if (isCommitted) return;
    setHoldProgress(0);
    const startTime = Date.now();
    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / 1800) * 100);
      setHoldProgress(pct);
      if (pct >= 100) {
        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
        setIsCommitted(true);
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore if canvas-confetti fails
        }
      }
    }, 30);
  };

  const endHold = () => {
    if (isCommitted) return;
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    setHoldProgress(0);
  };

  // Calculations
  const calculatedPlan = () => {
    const age = Math.max(16, 2026 - birthYear);
    let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
    if (sex === "female") bmr -= 161;
    else if (sex === "male") bmr += 5;
    else bmr -= 78;

    let activityMult = 1.2;
    if (workouts === "3-5") activityMult = 1.45;
    if (workouts === "6+") activityMult = 1.7;

    const tdee = Math.round(bmr * activityMult);
    const dailySurplusDeficit = Math.round((weeklyRateKg * 7700) / 7);

    let targetCalories = tdee;
    if (goal === "lose") targetCalories = Math.max(1200, tdee - dailySurplusDeficit);
    else if (goal === "gain") targetCalories = tdee + dailySurplusDeficit;

    const proteinG = Math.round(weightKg * 2.1);
    const fatsG = Math.round((targetCalories * 0.25) / 9);
    const carbsG = Math.max(50, Math.round((targetCalories - (proteinG * 4 + fatsG * 9)) / 4));

    const diffKg = Math.abs(desiredWeightKg - weightKg);
    let weeksNeeded = weeklyRateKg <= 0.3 ? 24 : 12;
    let monthsText = "3 months";
    if (weeklyRateKg <= 0.3) {
      monthsText = "6 months";
      weeksNeeded = 24;
    } else {
      monthsText = "3 months";
      weeksNeeded = 12;
    }

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + weeksNeeded * 7);

    return {
      targetCalories,
      proteinG,
      carbsG,
      fatsG,
      weeksNeeded,
      monthsText,
      targetDateFormatted: targetDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      diffKgFormatted: `${diffKg.toFixed(1)} kg`,
    };
  };

  const plan = calculatedPlan();

  const handleFinishOnboarding = async () => {
    const calculatedAge = Math.max(13, 2026 - birthYear);

    // Map activity to database enum
    const validActivity =
      workouts === "6+" ? "very_active" : workouts === "3-5" ? "moderate" : "light";

    // Map goal to database enum
    const validGoal =
      goal === "lose" ? "fat_loss" : goal === "gain" ? "muscle_gain" : "maintenance";

    // Map diet to database enum
    const dLower = diet.toLowerCase();
    let validDiet: "vegetarian" | "vegan" | "non_veg" | "jain" | "keto" | "high_protein" =
      "vegetarian";
    if (dLower.includes("vegan")) validDiet = "vegan";
    else if (dLower.includes("keto")) validDiet = "keto";
    else if (dLower.includes("jain")) validDiet = "jain";
    else if (dLower.includes("pescatarian") || dLower.includes("paleo") || dLower.includes("meat"))
      validDiet = "non_veg";
    else if (dLower.includes("high_protein") || dLower.includes("protein"))
      validDiet = "high_protein";
    else if (dLower.includes("veg")) validDiet = "vegetarian";
    else validDiet = "non_veg";

    const extendedData = {
      workouts_per_week: workouts,
      discovery_source: hearAbout,
      has_trainer: hasTrainer,
      weekly_rate_kg: weeklyRateKg,
      obstacle,
      accomplishment,
      notifications_allowed: notificationsAllowed,
      birth_month: birthMonth,
      birth_day: birthDay,
      birth_year: birthYear,
      tried_other_apps: triedOtherApps,
      height_unit: heightUnit,
      weight_unit: weightUnit,
      carbs_g: plan.carbsG,
      fat_g: plan.fatsG,
      daily_steps: 8000,
      water_goal_l: 3.5,
      goal_timeline: plan.monthsText,
    };

    const profileData: LocalProfile = {
      display_name: currentProfile?.display_name || "NutriLens User",
      gender: sex,
      age: calculatedAge,
      height_cm: heightCm,
      weight_kg: weightKg,
      goal_weight_kg: desiredWeightKg,
      activity: validActivity,
      goal: validGoal,
      diet: validDiet,
      daily_calorie_target: plan.targetCalories,
      protein_target_g: plan.proteinG,
      water_target_glasses: 8,
      water_goal_l: 3.5,
      onboarded: true,
      mobile_verified: true,
      extended_data: extendedData,
    };

    // 1. First persist to server Supabase
    try {
      const { data: sessData } = await supabase.auth.getSession();
      const userId = sessData.session?.user?.id;
      if (userId) {
        profileData.user_id = userId;
        LocalStore.setAccount(userId);

        await saveOnboardingFn({
          data: {
            display_name: profileData.display_name,
            gender: profileData.gender,
            age: profileData.age,
            height_cm: profileData.height_cm,
            weight_kg: profileData.weight_kg,
            goal_weight_kg: profileData.goal_weight_kg,
            activity: validActivity,
            goal: validGoal,
            diet: validDiet,
            flags: [],
            extended_data: extendedData,
          },
        });
      }
    } catch (err) {
      console.warn("[handleFinishOnboarding] Server save error:", err);
    }

    // 2. Save to account-scoped local store
    LocalStore.saveProfile(profileData);
    setIsEditingSetup(false);
    setCurrentProfile(LocalStore.getProfile());
    toast.success("🎉 Profile setup complete! Welcome to NutriLens");
    navigate({ to: "/home", replace: true });
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((s) => s - 1);
    } else {
      navigate({ to: "/" });
    }
  };

  // Convert KG display value to LBS if needed
  const displayWeight = (kgVal: number) => {
    if (weightUnit === "lbs") {
      return `${(kgVal * 2.20462).toFixed(1)} lbs`;
    }
    return `${kgVal.toFixed(1)} kg`;
  };

  // If user has already onboarded and is not actively re-taking setup, show Aurora Profile Screen
  if (currentProfile?.onboarded && !isEditingSetup) {
    const age = currentProfile.age || 21;
    const height = currentProfile.height_cm || 175;
    const weight = currentProfile.weight_kg || 70;
    const heightM = height / 100;
    const bmi = Number((weight / (heightM * heightM)).toFixed(1));

    const bmr = Math.round(
      10 * weight + 6.25 * height - 5 * age + (currentProfile.gender === "female" ? -161 : 5),
    );
    const tdee = Math.round(bmr * 1.55);

    let bmiCat = { label: "Normal Weight", color: "text-emerald-500", bg: "bg-emerald-500/10" };
    if (bmi < 18.5)
      bmiCat = { label: "Underweight", color: "text-amber-500", bg: "bg-amber-500/10" };
    else if (bmi >= 25 && bmi < 30)
      bmiCat = { label: "Overweight", color: "text-amber-500", bg: "bg-amber-500/10" };
    else if (bmi >= 30) bmiCat = { label: "Obese", color: "text-rose-500", bg: "bg-rose-500/10" };

    return (
      <div className="min-h-screen bg-background text-foreground px-4 py-6">
        <AuroraProfileScreen
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          profile={currentProfile as any}
          computedAge={age}
          computedBMI={bmi}
          computedBMR={bmr}
          computedTDEE={tdee}
          computedTargets={{
            calories: currentProfile.daily_calorie_target || 2000,
            protein: currentProfile.protein_target_g || 120,
            carbs:
              ((currentProfile.extended_data as Record<string, unknown>)?.carbs_g as number) || 220,
            fat: ((currentProfile.extended_data as Record<string, unknown>)?.fat_g as number) || 60,
            waterGlasses: currentProfile.water_target_glasses || 8,
          }}
          bmiCategory={bmiCat}
          onEditProfile={() => setIsEditingSetup(true)}
          onOpenStep={(stepId) => {
            setStep(stepId);
            setIsEditingSetup(true);
          }}
          onSignOut={async () => {
            localStorage.removeItem("nutrilens_guest_session");
            LocalStore.clearAll();
            await supabase.auth.signOut();
            navigate({ to: "/auth", replace: true });
          }}
          onSaveSection={(updatedFields) => {
            const updated = {
              ...currentProfile,
              ...updatedFields,
              extended_data: {
                ...(currentProfile.extended_data || {}),
                ...updatedFields,
              },
            };
            LocalStore.saveProfile(updated as LocalProfile);
            setCurrentProfile(LocalStore.getProfile());
            toast.success("Profile section updated!");
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-between px-4 sm:px-6 py-6 selection:bg-primary/20">
      {/* Top Header Navigation & Progress Bar */}
      <div className="w-full max-w-md space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="grid h-10 w-10 place-items-center rounded-full bg-muted/60 text-foreground hover:bg-muted transition cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          {/* Top Progress Bar indicator */}
          <div className="flex-1 mx-4 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-foreground transition-all duration-300 ease-out"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>

          <span className="text-xs font-extrabold text-muted-foreground w-8 text-right">
            {step}/{totalSteps}
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md my-auto py-6">
        {/* STEP 1: Choose Sex */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                Choose your sex
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                This helps personalize your experience.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { id: "male", label: "Male", icon: "♂" },
                { id: "female", label: "Female", icon: "♀" },
                { id: "other", label: "Other", icon: "🔲" },
              ].map((opt) => {
                const selected = sex === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSex(opt.id as "male" | "female" | "other")}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      selected
                        ? "border-foreground bg-card shadow-md scale-[1.01]"
                        : "border-border/80 bg-card/60 hover:border-border text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold">{opt.icon}</span>
                      <span className="text-base font-bold text-foreground">{opt.label}</span>
                    </div>
                    <div
                      className={`h-5 w-5 rounded-full border-2 grid place-items-center ${
                        selected
                          ? "border-foreground bg-foreground text-background"
                          : "border-muted-foreground/40"
                      }`}
                    >
                      {selected && <div className="h-2 w-2 rounded-full bg-background" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Workouts per week */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                How many workouts do you do per week?
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                This will be used to calibrate your custom plan.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { id: "0-2", title: "0 - 2", desc: "Workouts now and then", icon: "🏋️" },
                { id: "3-5", title: "3 - 5", desc: "A few workouts per week", icon: "🏃" },
                { id: "6+", title: "6+", desc: "Dedicated athlete", icon: "🔥" },
              ].map((opt) => {
                const selected = workouts === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setWorkouts(opt.id as "0-2" | "3-5" | "6+")}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      selected
                        ? "border-foreground bg-card shadow-md scale-[1.01]"
                        : "border-border/80 bg-card/60 hover:border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-muted grid place-items-center text-lg">
                        {opt.icon}
                      </div>
                      <div className="text-left">
                        <div className="text-base font-black text-foreground">{opt.title}</div>
                        <div className="text-xs text-muted-foreground font-medium">{opt.desc}</div>
                      </div>
                    </div>
                    <div
                      className={`h-5 w-5 rounded-full border-2 grid place-items-center ${
                        selected
                          ? "border-foreground bg-foreground text-background"
                          : "border-muted-foreground/40"
                      }`}
                    >
                      {selected && <div className="h-2 w-2 rounded-full bg-background" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Where did you hear about us? */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                Where did you hear about us?
              </h1>
            </div>

            <div className="grid grid-cols-1 gap-2.5 max-h-[420px] overflow-y-auto pr-1">
              {[
                "Instagram",
                "Facebook",
                "TikTok",
                "YouTube",
                "Google",
                "X",
                "Friend or family",
                "Play Store",
                "TV",
              ].map((name) => {
                const selected = hearAbout === name;
                return (
                  <button
                    key={name}
                    onClick={() => setHearAbout(name)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                      selected
                        ? "border-foreground bg-card shadow-sm"
                        : "border-border/80 bg-card/60 hover:border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <HearAboutIcon name={name} />
                      <span className="text-sm font-bold text-foreground">{name}</span>
                    </div>
                    <div
                      className={`h-5 w-5 rounded-full border-2 grid place-items-center shrink-0 ${
                        selected
                          ? "border-foreground bg-foreground text-background"
                          : "border-muted-foreground/40"
                      }`}
                    >
                      {selected && <div className="h-2 w-2 rounded-full bg-background" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Tried other calorie tracking apps? */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                Have you tried other calorie tracking apps?
              </h1>
            </div>

            <div className="space-y-3">
              {[
                { id: "yes", label: "Yes", icon: ThumbsUp },
                { id: "no", label: "No", icon: ThumbsDown },
              ].map((opt) => {
                const Icon = opt.icon;
                const selected = triedOtherApps === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setTriedOtherApps(opt.id as "yes" | "no")}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      selected
                        ? "border-foreground bg-card shadow-md scale-[1.01]"
                        : "border-border/80 bg-card/60 hover:border-border text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-foreground" />
                      <span className="text-base font-bold text-foreground">{opt.label}</span>
                    </div>
                    <div
                      className={`h-5 w-5 rounded-full border-2 grid place-items-center ${
                        selected
                          ? "border-foreground bg-foreground text-background"
                          : "border-muted-foreground/40"
                      }`}
                    >
                      {selected && <div className="h-2 w-2 rounded-full bg-background" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: Motivational Chart Screen */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                Designed to help you stay on track
              </h1>
            </div>

            {/* Chart Card Graphic */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                <span>Your weight</span>
              </div>

              {/* SVG Comparison Graph */}
              <div className="relative h-44 w-full pt-4">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 300 120">
                  {/* Traditional Diet Curve (Red dashed rebound) */}
                  <path
                    d="M 10 30 Q 100 80, 160 30 T 290 20"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                  />
                  <text x="200" y="30" fill="#EF4444" fontSize="10" fontWeight="700">
                    Traditional diet
                  </text>

                  {/* NutriLens Curve (Sustained Black Drop) */}
                  <path
                    d="M 10 30 C 90 35, 140 100, 280 100"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    className="text-foreground"
                  />
                  <circle cx="280" cy="100" r="5" className="fill-foreground" />

                  {/* Month Markers */}
                  <text x="10" y="118" fill="gray" fontSize="9" fontWeight="600">
                    Month 1
                  </text>
                  <text x="250" y="118" fill="gray" fontSize="9" fontWeight="600">
                    Month 6
                  </text>
                </svg>

                {/* Badge overlay */}
                <div className="absolute top-10 left-4 rounded-full bg-foreground px-2.5 py-1 text-[10px] font-black text-background shadow">
                  NutriLens Weight
                </div>
              </div>

              <p className="text-xs font-semibold text-center text-muted-foreground pt-2">
                80% of NutriLens users maintain their weight loss even 6 months later
              </p>
            </div>
          </div>
        )}

        {/* STEP 6: Height Picker */}
        {step === 6 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                What is your height?
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                This will be taken into account when calculating your daily nutrition goals.
              </p>
            </div>

            {/* Toggle Unit */}
            <div className="flex justify-center">
              <div className="inline-flex rounded-xl bg-muted p-1">
                <button
                  type="button"
                  onClick={() => setHeightUnit("ft_in")}
                  className={`rounded-lg px-4 py-1.5 text-xs font-black transition ${
                    heightUnit === "ft_in"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  ft, in
                </button>
                <button
                  type="button"
                  onClick={() => setHeightUnit("cm")}
                  className={`rounded-lg px-4 py-1.5 text-xs font-black transition ${
                    heightUnit === "cm"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  cm
                </button>
              </div>
            </div>

            {/* Height Display & Picker */}
            {heightUnit === "cm" ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-6">
                <div className="text-5xl font-black tracking-tight text-foreground">
                  {heightCm} <span className="text-2xl text-muted-foreground font-bold">cm</span>
                </div>
                <input
                  type="range"
                  min={120}
                  max={220}
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-6 py-6">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-black text-foreground">{heightFeet} ft</span>
                  <div className="flex gap-2 mt-2">
                    {[4, 5, 6, 7].map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setHeightFeet(f)}
                        className={`h-10 w-10 rounded-xl font-bold border ${
                          heightFeet === f
                            ? "border-foreground bg-foreground text-background"
                            : "border-border"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-3xl font-black text-foreground">{heightInches} in</span>
                  <div className="flex gap-1.5 mt-2 overflow-x-auto max-w-[200px] pb-1">
                    {[0, 2, 4, 6, 8, 10].map((inc) => (
                      <button
                        key={inc}
                        type="button"
                        onClick={() => setHeightInches(inc)}
                        className={`h-9 w-9 rounded-xl font-bold text-xs border shrink-0 ${
                          heightInches === inc
                            ? "border-foreground bg-foreground text-background"
                            : "border-border"
                        }`}
                      >
                        {inc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 7: Weight Picker with Interactive Ruler */}
        {step === 7 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                What is your weight?
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                This will be taken into account when calculating your daily nutrition goals.
              </p>
            </div>

            {/* Toggle Unit */}
            <div className="flex justify-center">
              <div className="inline-flex rounded-xl bg-muted p-1">
                <button
                  type="button"
                  onClick={() => setWeightUnit("lbs")}
                  className={`rounded-lg px-4 py-1.5 text-xs font-black transition ${
                    weightUnit === "lbs"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  lbs
                </button>
                <button
                  type="button"
                  onClick={() => setWeightUnit("kg")}
                  className={`rounded-lg px-4 py-1.5 text-xs font-black transition ${
                    weightUnit === "kg"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  kg
                </button>
              </div>
            </div>

            <div className="text-center py-2">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Current Weight
              </div>
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-foreground mt-1">
                {displayWeight(weightKg)}
              </div>
            </div>

            {/* Interactive Ruler Slider */}
            <div
              onMouseDown={(e) => handleRulerDrag(e, false)}
              onTouchMove={(e) => handleRulerDrag(e, false)}
              className="relative h-24 w-full bg-card border border-border rounded-2xl overflow-hidden cursor-ew-resize select-none flex items-center justify-center p-2"
            >
              {/* Center Pointer */}
              <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-foreground z-10" />

              {/* Ruler Ticks */}
              <div className="flex items-end justify-between w-full h-12 px-2 opacity-60">
                {Array.from({ length: 41 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-0.5 bg-foreground ${
                      i % 10 === 0 ? "h-10 bg-foreground" : i % 5 === 0 ? "h-6" : "h-3"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 8: Date of Birth Picker */}
        {step === 8 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                When were you born?
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                This will be taken into account when calculating your daily nutrition goals.
              </p>
            </div>

            {/* Month, Day, Year drum select cards */}
            <div className="grid grid-cols-3 gap-3 py-6">
              {/* Month */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-muted-foreground text-center">Month</span>
                <select
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(e.target.value)}
                  className="rounded-2xl border-2 border-border bg-card p-3 text-sm font-bold text-foreground outline-none focus:border-foreground"
                >
                  {[
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Day */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-muted-foreground text-center">Day</span>
                <select
                  value={birthDay}
                  onChange={(e) => setBirthDay(Number(e.target.value))}
                  className="rounded-2xl border-2 border-border bg-card p-3 text-sm font-bold text-foreground outline-none focus:border-foreground"
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      {d < 10 ? `0${d}` : d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-muted-foreground text-center">Year</span>
                <select
                  value={birthYear}
                  onChange={(e) => setBirthYear(Number(e.target.value))}
                  className="rounded-2xl border-2 border-border bg-card p-3 text-sm font-bold text-foreground outline-none focus:border-foreground"
                >
                  {Array.from({ length: 60 }, (_, i) => 2010 - i).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 9: Personal Trainer / Dietitian */}
        {step === 9 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                Do you currently work with a personal trainer or registered dietitian?
              </h1>
            </div>

            <div className="space-y-3">
              {[
                { id: "yes", label: "Yes", icon: ThumbsUp },
                { id: "no", label: "No", icon: ThumbsDown },
              ].map((opt) => {
                const Icon = opt.icon;
                const selected = hasTrainer === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setHasTrainer(opt.id as "yes" | "no")}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      selected
                        ? "border-foreground bg-card shadow-md scale-[1.01]"
                        : "border-border/80 bg-card/60 hover:border-border text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-foreground" />
                      <span className="text-base font-bold text-foreground">{opt.label}</span>
                    </div>
                    <div
                      className={`h-5 w-5 rounded-full border-2 grid place-items-center ${
                        selected
                          ? "border-foreground bg-foreground text-background"
                          : "border-muted-foreground/40"
                      }`}
                    >
                      {selected && <div className="h-2 w-2 rounded-full bg-background" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 10: Goal Selection */}
        {step === 10 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                What is your goal?
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                This helps us generate a plan for your calorie intake.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { id: "lose", label: "Lose Weight", icon: TrendingDown },
                { id: "maintain", label: "Maintain", icon: Minus },
                { id: "gain", label: "Gain Weight", icon: TrendingUp },
              ].map((opt) => {
                const Icon = opt.icon;
                const selected = goal === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setGoal(opt.id as "lose" | "maintain" | "gain")}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      selected
                        ? "border-foreground bg-card shadow-md scale-[1.01]"
                        : "border-border/80 bg-card/60 hover:border-border text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-foreground" />
                      <span className="text-base font-bold text-foreground">{opt.label}</span>
                    </div>
                    <div
                      className={`h-5 w-5 rounded-full border-2 grid place-items-center ${
                        selected
                          ? "border-foreground bg-foreground text-background"
                          : "border-muted-foreground/40"
                      }`}
                    >
                      {selected && <div className="h-2 w-2 rounded-full bg-background" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 11: Desired Weight */}
        {step === 11 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                What is your desired weight?
              </h1>
            </div>

            {/* Toggle Unit */}
            <div className="flex justify-center">
              <div className="inline-flex rounded-xl bg-muted p-1">
                <button
                  type="button"
                  onClick={() => setWeightUnit("lbs")}
                  className={`rounded-lg px-4 py-1.5 text-xs font-black transition ${
                    weightUnit === "lbs"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  lbs
                </button>
                <button
                  type="button"
                  onClick={() => setWeightUnit("kg")}
                  className={`rounded-lg px-4 py-1.5 text-xs font-black transition ${
                    weightUnit === "kg"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  Kg
                </button>
              </div>
            </div>

            <div className="text-center py-2">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {goal === "gain"
                  ? "Gain Weight"
                  : goal === "lose"
                    ? "Lose Weight"
                    : "Target Weight"}
              </div>
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-foreground mt-1">
                {displayWeight(desiredWeightKg)}
              </div>
            </div>

            {/* Interactive Ruler Slider for Desired Weight */}
            <div
              onMouseDown={(e) => handleRulerDrag(e, true)}
              onTouchMove={(e) => handleRulerDrag(e, true)}
              className="relative h-24 w-full bg-card border border-border rounded-2xl overflow-hidden cursor-ew-resize select-none flex items-center justify-center p-2"
            >
              <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-foreground z-10" />
              <div className="flex items-end justify-between w-full h-12 px-2 opacity-60">
                {Array.from({ length: 41 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-0.5 bg-foreground ${
                      i % 10 === 0 ? "h-10 bg-foreground" : i % 5 === 0 ? "h-6" : "h-3"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 12: Goal Encouragement Card */}
        {step === 12 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 py-8">
            <div className="text-center space-y-4">
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-tight">
                {goal === "gain"
                  ? `Gaining ${plan.diffKgFormatted} is a realistic target. It's not hard at all!`
                  : `Losing ${plan.diffKgFormatted} is a realistic target. It's not hard at all!`}
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                90% of users say that the change is obvious after using NutriLens and it is not easy
                to rebound.
              </p>
            </div>
          </div>
        )}

        {/* STEP 13: Goal Speed / Rate */}
        {step === 13 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                How fast do you want to reach your goal?
              </h1>
            </div>

            <div className="text-center font-bold text-sm text-muted-foreground">
              Weight {goal === "gain" ? "gain" : "loss"} speed per week
              <div className="text-2xl font-black text-foreground mt-1">{weeklyRateKg} kg</div>
            </div>

            {/* Speed Options */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { rate: 0.2, label: "Slow", icon: "🐌" },
                { rate: 0.8, label: "Recommended", icon: "🏃" },
                { rate: 1.3, label: "Fast", icon: "🐆" },
              ].map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setWeeklyRateKg(opt.rate)}
                  className={`px-1.5 py-3.5 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition w-full min-w-0 ${
                    weeklyRateKg === opt.rate
                      ? "border-foreground bg-card shadow-sm"
                      : "border-border bg-card/60 text-muted-foreground"
                  }`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  <span className="text-[11px] sm:text-xs font-black text-foreground truncate w-full text-center tracking-tight leading-none">
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Timeline Calculation Box */}
            <div className="rounded-2xl bg-muted/60 p-4 space-y-2 border border-border">
              <div className="text-sm font-bold text-foreground">
                You will reach your goal in{" "}
                <span className="text-primary font-black underline">{plan.monthsText}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {weeklyRateKg <= 0.3
                  ? "Going slow means a gentler and more sustainable daily calorie goal."
                  : weeklyRateKg <= 0.9
                    ? "This is the most balanced pace, motivating and ideal for most users."
                    : "This pace moves quickly, staying consistent will be key."}
              </p>
              <div className="text-xs font-black text-foreground pt-1">
                Daily calorie goal: {plan.targetCalories} cal
              </div>
            </div>
          </div>
        )}

        {/* STEP 14: Progress Comparison Graphic */}
        {step === 14 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                Achieve twice as much progress with NutriLens vs on your own
              </h1>
            </div>

            {/* Bar Chart Comparison */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-6">
              <div className="grid grid-cols-2 gap-4 items-end h-40 pt-4">
                {/* Without NutriLens */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-full bg-muted rounded-2xl h-16 flex items-center justify-center font-black text-xs text-muted-foreground">
                    20%
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">Without NutriLens</span>
                </div>

                {/* With NutriLens */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-full bg-foreground rounded-2xl h-32 flex items-center justify-center font-black text-base text-background shadow-lg">
                    2X
                  </div>
                  <span className="text-xs font-black text-foreground">With NutriLens</span>
                </div>
              </div>

              <p className="text-xs text-center font-medium text-muted-foreground">
                NutriLens makes it easy and holds you accountable
              </p>
            </div>
          </div>
        )}

        {/* STEP 15: Obstacles */}
        {step === 15 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                What's stopping you from reaching your goals?
              </h1>
            </div>

            <div className="space-y-2.5">
              {[
                { name: "Lack of consistency", icon: "📊" },
                { name: "Unhealthy eating habits", icon: "🍔" },
                { name: "Lack of support", icon: "👥" },
                { name: "Busy schedule", icon: "📅" },
                { name: "Lack of meal inspiration", icon: "💡" },
              ].map((opt) => {
                const selected = obstacle === opt.name;
                return (
                  <button
                    key={opt.name}
                    onClick={() => setObstacle(opt.name)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                      selected
                        ? "border-foreground bg-card shadow-sm"
                        : "border-border/80 bg-card/60 hover:border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{opt.icon}</span>
                      <span className="text-sm font-bold text-foreground">{opt.name}</span>
                    </div>
                    <div
                      className={`h-5 w-5 rounded-full border-2 grid place-items-center ${
                        selected
                          ? "border-foreground bg-foreground text-background"
                          : "border-muted-foreground/40"
                      }`}
                    >
                      {selected && <div className="h-2 w-2 rounded-full bg-background" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 16: Diet Type */}
        {step === 16 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                Do you follow a specific diet?
              </h1>
            </div>

            <div className="grid grid-cols-1 gap-2.5 max-h-[420px] overflow-y-auto pr-1">
              {[
                "Balanced",
                "Whole-food focus",
                "Mediterranean",
                "Flexitarian",
                "Pescatarian",
                "Vegetarian",
                "Vegan",
                "Low-carb",
                "Keto",
                "Paleo",
              ].map((name) => {
                const selected = diet === name;
                return (
                  <button
                    key={name}
                    onClick={() => setDiet(name)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                      selected
                        ? "border-foreground bg-card shadow-sm"
                        : "border-border/80 bg-card/60 hover:border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <DietOptionIcon name={name} />
                      <span className="text-sm font-bold text-foreground">{name}</span>
                    </div>
                    <div
                      className={`h-5 w-5 rounded-full border-2 grid place-items-center shrink-0 ${
                        selected
                          ? "border-foreground bg-foreground text-background"
                          : "border-muted-foreground/40"
                      }`}
                    >
                      {selected && <div className="h-2 w-2 rounded-full bg-background" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 17: What would you like to accomplish? */}
        {step === 17 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                What would you like to accomplish?
              </h1>
            </div>

            <div className="space-y-3">
              {[
                { name: "Eat and live healthier", icon: "🍏" },
                { name: "Boost my energy and mood", icon: "☀️" },
                { name: "Stay motivated and consistent", icon: "💪" },
                { name: "Feel better about my body", icon: "🧘" },
              ].map((opt) => {
                const selected = accomplishment === opt.name;
                return (
                  <button
                    key={opt.name}
                    onClick={() => setAccomplishment(opt.name)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      selected
                        ? "border-foreground bg-card shadow-md scale-[1.01]"
                        : "border-border/80 bg-card/60 hover:border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{opt.icon}</span>
                      <span className="text-sm font-bold text-foreground">{opt.name}</span>
                    </div>
                    <div
                      className={`h-5 w-5 rounded-full border-2 grid place-items-center ${
                        selected
                          ? "border-foreground bg-foreground text-background"
                          : "border-muted-foreground/40"
                      }`}
                    >
                      {selected && <div className="h-2 w-2 rounded-full bg-background" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 18: Weight Transition Projection */}
        {step === 18 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                You have great potential to crush your goal
              </h1>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-4">
              <span className="text-xs font-bold text-muted-foreground">
                Your weight transition
              </span>
              <div className="h-40 w-full pt-4">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100">
                  <path
                    d="M 10 80 Q 150 70, 280 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    className="text-foreground"
                  />
                  <circle cx="280" cy="20" r="5" className="fill-foreground" />
                  <text x="10" y="98" fill="gray" fontSize="9" fontWeight="600">
                    3 Days
                  </text>
                  <text x="120" y="98" fill="gray" fontSize="9" fontWeight="600">
                    7 Days
                  </text>
                  <text x="250" y="98" fill="gray" fontSize="9" fontWeight="600">
                    {plan.targetDateFormatted}
                  </text>
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* STEP 19: Real NutriLens Notifications Permission Prompt */}
        {step === 19 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 text-center py-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                Reach your goals with notifications
              </h1>
            </div>

            {/* NutriLens Realistic System Prompt Card */}
            <div className="rounded-[32px] border border-white/10 bg-[#0F1722] p-8 shadow-2xl space-y-6 max-w-sm mx-auto text-center backdrop-blur-md">
              <div className="h-14 w-14 rounded-full bg-[#182635] border border-sky-500/20 grid place-items-center mx-auto text-[#38BDF8] shadow-inner">
                <Bell className="h-6 w-6" />
              </div>

              <p className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug px-2">
                NutriLens would like to send you Notifications
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setNotificationsAllowed(false);
                    saveNotificationPreferences({ enabled: false });
                    toast.info("Notifications disabled. You can turn them on anytime in Profile.");
                  }}
                  className={`py-3.5 px-4 rounded-[22px] text-xs sm:text-sm font-bold transition-all border ${
                    !notificationsAllowed
                      ? "bg-[#1E293B] text-white border-white/20 shadow-md scale-100"
                      : "bg-[#16212E] text-slate-400 border-white/5 hover:text-white"
                  }`}
                >
                  Don't Allow
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setNotificationsAllowed(true);
                    const granted = await requestNutriLensNotificationPermission();
                    if (granted) {
                      toast.success("✓ Notifications enabled! Welcome alert sent.");
                    } else {
                      toast.success("✓ In-app NutriLens alerts activated.");
                    }
                  }}
                  className={`py-3.5 px-4 rounded-[22px] text-xs sm:text-sm font-black transition-all ${
                    notificationsAllowed
                      ? "bg-[#38BDF8] text-[#081524] shadow-[0_0_24px_rgba(56,189,248,0.5)] scale-105"
                      : "bg-[#38BDF8] text-[#081524] hover:bg-[#0EA5E9] shadow-[0_0_16px_rgba(56,189,248,0.35)]"
                  }`}
                >
                  Allow
                </button>
              </div>

              {notificationsAllowed && (
                <div className="pt-2 animate-in fade-in duration-300">
                  <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-left flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="text-[11px] font-bold text-sky-300">Smart Reminders Active</p>
                      <p className="text-[10px] text-slate-300 leading-tight">
                        Daily meal logging, 2h hydration checks & 8:30 PM streak safeguard alerts
                        are set.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => triggerTestNotification("meal")}
                    className="mt-2 text-[11px] font-bold text-sky-400 hover:text-sky-300 underline"
                  >
                    Send test notification now
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 20: Commit to your Goal (Tap and Hold) */}
        {step === 20 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 text-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                Commit to your goal
              </h1>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-3 text-left">
              <p className="text-sm font-extrabold text-foreground leading-relaxed">
                I am committed to my goal of {goal === "gain" ? "gaining" : "losing"}{" "}
                {displayWeight(desiredWeightKg)} by {plan.targetDateFormatted}.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                I will track my meals, fuel my body with intention, and hold myself accountable.
              </p>
            </div>

            {/* Tap and Hold Button */}
            <div className="flex flex-col items-center justify-center py-6 space-y-3">
              <div
                onMouseDown={startHold}
                onMouseUp={endHold}
                onMouseLeave={endHold}
                onTouchStart={startHold}
                onTouchEnd={endHold}
                className="relative h-28 w-28 rounded-full border-4 border-muted grid place-items-center cursor-pointer select-none active:scale-95 transition-transform"
              >
                {/* SVG Progress Ring */}
                <svg className="absolute inset-0 h-full w-full -rotate-90">
                  <circle
                    cx="52"
                    cy="52"
                    r="48"
                    className="stroke-foreground"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray="301"
                    strokeDashoffset={301 - (301 * holdProgress) / 100}
                    strokeLinecap="round"
                  />
                </svg>

                <div className="h-20 w-20 rounded-full bg-foreground text-background grid place-items-center shadow-lg">
                  {isCommitted ? (
                    <Check className="h-8 w-8 stroke-[3]" />
                  ) : (
                    <Sparkles className="h-8 w-8 animate-pulse" />
                  )}
                </div>
              </div>

              <span className="text-xs font-black text-foreground">
                {isCommitted
                  ? "Committed 🤝 This is the first step toward my goal."
                  : "Tap and hold to make your commitment"}
              </span>
            </div>
          </div>
        )}

        {/* STEP 21: AI Plan Generation Animation Screen */}
        {step === 21 && (
          <div className="space-y-8 animate-in fade-in duration-300 text-center py-6">
            <div className="space-y-2">
              <div className="text-6xl sm:text-7xl font-black tracking-tight text-foreground">
                {genPercent}%
              </div>
              <h1 className="text-2xl font-black text-foreground">
                We're setting everything up for you
              </h1>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-foreground transition-all duration-75"
                style={{ width: `${genPercent}%` }}
              />
            </div>

            <p className="text-xs font-bold text-muted-foreground animate-pulse">
              {
                [
                  "Customizing health plan...",
                  "Applying BMR formula...",
                  "Estimating metabolic age...",
                  "Finalizing results...",
                ][genStepIdx]
              }
            </p>

            {/* Checklist */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-3 text-left max-w-xs mx-auto">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                Daily recommendation for
              </span>

              {[
                { label: "Calories", step: 0 },
                { label: "Carbs", step: 1 },
                { label: "Protein", step: 2 },
                { label: "Fats", step: 2 },
                { label: "Health score", step: 3 },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm font-bold">
                  <span>· {item.label}</span>
                  {genStepIdx >= item.step ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <div className="h-3 w-3 rounded-full border border-muted-foreground/30" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 22: Final Plan Summary Screen */}
        {step === 22 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-foreground text-background grid place-items-center mx-auto shadow">
                <Check className="h-6 w-6 stroke-[3]" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                {goal === "gain" ? "Gain" : "Lose"} {displayWeight(desiredWeightKg)} by{" "}
                {plan.targetDateFormatted}
              </h1>
              <p className="text-xs text-muted-foreground">
                Follow this plan to achieve your target.
              </p>
            </div>

            {/* Graph Card */}
            <div className="rounded-3xl border border-border bg-card p-5 shadow-lg space-y-3">
              <span className="text-xs font-bold text-muted-foreground">Projected progress</span>
              <div className="h-28 w-full pt-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80">
                  <path
                    d="M 10 60 Q 150 50, 280 15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    className="text-foreground"
                  />
                  <circle cx="280" cy="15" r="5" className="fill-foreground" />
                  <text x="10" y="78" fill="gray" fontSize="9" fontWeight="600">
                    Now
                  </text>
                  <text x="240" y="78" fill="gray" fontSize="9" fontWeight="600">
                    {plan.targetDateFormatted}
                  </text>
                </svg>
              </div>
            </div>

            {/* Daily Recommendation Card */}
            <div className="rounded-3xl border border-border bg-card p-5 shadow-lg space-y-4">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Your daily recommendation
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-orange-500/10 text-orange-500 grid place-items-center">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-black text-foreground">{plan.targetCalories}</div>
                  <div className="text-xs font-semibold text-muted-foreground">Calories</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
                <div className="text-center p-2 rounded-xl bg-muted/50">
                  <div className="text-sm font-black text-foreground">{plan.proteinG}g</div>
                  <div className="text-[10px] font-bold text-muted-foreground">Protein</div>
                </div>
                <div className="text-center p-2 rounded-xl bg-muted/50">
                  <div className="text-sm font-black text-foreground">{plan.carbsG}g</div>
                  <div className="text-[10px] font-bold text-muted-foreground">Carbs</div>
                </div>
                <div className="text-center p-2 rounded-xl bg-muted/50">
                  <div className="text-sm font-black text-foreground">{plan.fatsG}g</div>
                  <div className="text-[10px] font-bold text-muted-foreground">Fats</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 23: Create Account or Skip */}
        {step === 23 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 text-center py-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                Create an account
              </h1>
            </div>

            <div className="space-y-3 pt-4">
              <button
                onClick={handleFinishOnboarding}
                className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-foreground text-background font-black text-sm hover:opacity-90 transition shadow-lg cursor-pointer"
              >
                <span className="text-base">G</span> Sign in with Google
              </button>

              <button
                onClick={handleFinishOnboarding}
                className="w-full p-4 rounded-2xl border-2 border-border bg-card text-foreground font-black text-sm hover:bg-muted transition cursor-pointer"
              >
                Skip
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Button */}
      {step !== 21 && (
        <div className="w-full max-w-md pt-4">
          <button
            onClick={() => {
              if (step === 20 && !isCommitted) {
                toast.info("Please tap and hold the button to commit to your goal!");
                return;
              }
              if (step === totalSteps) {
                handleFinishOnboarding();
              } else {
                handleNext();
              }
            }}
            className="w-full py-4 rounded-2xl bg-foreground text-background text-base font-black tracking-wide hover:opacity-90 transition active:scale-95 shadow-xl cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{step === totalSteps ? "Get Started" : "Continue"}</span>
            {step < totalSteps && <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      )}
    </div>
  );
}
