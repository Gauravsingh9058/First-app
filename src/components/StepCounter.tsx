import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LocalStore } from "@/lib/local-store";
import {
  Footprints,
  Flame,
  Navigation,
  Clock,
  Sparkles,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Info,
  ShieldCheck,
  Play,
  Square,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useStepCounter } from "@/hooks/useStepCounter";

interface StepCounterProps {
  todayStr: string;
  weightKg?: number;
  heightCm?: number;
  goalWeightKg?: number;
  userGoal?: string;
  fitnessGoals?: string[];
  activityLevel?: string;
  customTargetSteps?: number;
}

export type StepSourceType =
  | "hardware_counter" // Priority 1: Hardware Step Counter (Sensor.TYPE_STEP_COUNTER)
  | "hardware_detector" // Priority 2: Hardware Step Detector
  | "health_connect" // Priority 3: Health Connect
  | "unsupported"; // Priority 4: Unsupported

// Predict AI Step Target based on Fitness Goals & Body Composition
export function calculateAIStepGoal(
  goal?: string,
  fitnessGoals: string[] = [],
  currentWeight: number = 70,
  goalWeight: number = 70,
  activity?: string,
) {
  const g = (goal || "").toLowerCase().replace(/_/g, " ");
  const fgList = fitnessGoals.map((item) => item.toLowerCase());

  const hasFatLoss =
    g.includes("fat loss") ||
    g.includes("weight loss") ||
    g.includes("cut") ||
    g.includes("loss") ||
    fgList.some((f) => f.includes("lose weight") || f.includes("fat loss"));

  const hasMuscleGain =
    !hasFatLoss &&
    (g.includes("bulk") ||
      g.includes("muscle") ||
      g.includes("gain") ||
      fgList.some((f) => f.includes("gain weight") || f.includes("gain muscle")));

  const hasRecomp =
    !hasFatLoss &&
    !hasMuscleGain &&
    (g.includes("recomp") || fgList.some((f) => f.includes("recomposition")));

  const hasStamina =
    !hasFatLoss &&
    !hasMuscleGain &&
    !hasRecomp &&
    fgList.some((f) => f.includes("stamina") || f.includes("heart") || f.includes("diabetes"));

  if (hasFatLoss) {
    const target = currentWeight >= 85 ? 12500 : 11000;
    return {
      target,
      goalLabel: "Fat Loss / Calorie Deficit",
      strategy: "Fat Loss & Calorie Deficit 🔥",
      reason: `Target set to ${target.toLocaleString()} steps/day. High daily NEAT creates a strong caloric deficit while protecting lean muscle mass.`,
      badgeColor: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    };
  } else if (hasMuscleGain) {
    const target = 6500;
    return {
      target,
      goalLabel: "Muscle & Weight Gain",
      strategy: "Muscle & Mass Building 🏋️",
      reason: `Target set to ${target.toLocaleString()} steps/day. Moderate walking conserves energy surplus for weight lifting & muscle growth.`,
      badgeColor: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    };
  } else if (hasRecomp) {
    const target = 9000;
    return {
      target,
      goalLabel: "Body Recomposition",
      strategy: "Body Recomposition ⚖️",
      reason: `Target set to ${target.toLocaleString()} steps/day. Balances fat oxidation with muscle retention.`,
      badgeColor: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
    };
  } else if (hasStamina) {
    const target = 10000;
    return {
      target,
      goalLabel: "Improve Stamina & Health",
      strategy: "Cardiovascular Endurance 🫀",
      reason: `Target set to ${target.toLocaleString()} steps/day. Optimizes VO2 max, glucose control, and stamina.`,
      badgeColor: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
    };
  } else {
    const target = 8000;
    return {
      target,
      goalLabel: "Maintain Weight & Wellness",
      strategy: "Weight Maintenance & Wellness 🌿",
      reason: `Target set to ${target.toLocaleString()} steps/day for active metabolism, stamina, and health stability.`,
      badgeColor: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    };
  }
}

export function StepCounter({
  todayStr,
  weightKg = 70,
  heightCm = 175,
  goalWeightKg = 70,
  userGoal = "fat_loss",
  fitnessGoals = [],
  activityLevel = "moderate",
  customTargetSteps,
}: StepCounterProps) {
  const [showEditInput, setShowEditInput] = useState<boolean>(false);
  const [customInput, setCustomInput] = useState<string>("");
  const [overrideTarget, setOverrideTarget] = useState<number | null>(customTargetSteps || null);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState<boolean>(false);
  const [isSyncingHC, setIsSyncingHC] = useState<boolean>(false);

  // Compute AI Step Goal based on user parameters
  const aiPrediction = calculateAIStepGoal(
    userGoal,
    fitnessGoals,
    weightKg,
    goalWeightKg,
    activityLevel,
  );

  const targetSteps = overrideTarget && overrideTarget > 0 ? overrideTarget : aiPrediction.target;

  // Real-time Native Android Step Counter Hook
  const {
    steps,
    isTracking,
    isAvailable,
    sensorName,
    hasPermission,
    error,
    isNative,
    strideMeters,
    distanceKm,
    caloriesBurned,
    activeMins,
    progressPct,
    remainingSteps,
    startTracking,
    stopTracking,
    requestPermission,
    refreshSteps,
    updateManualSteps,
  } = useStepCounter({
    todayStr,
    weightKg,
    heightCm,
    targetSteps,
    autoStart: true,
  });

  // Alert Modal state for permission prompt on entry
  const [showSensorAlertModal, setShowSensorAlertModal] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("nutrilens_sensor_alert_dismissed") !== "true";
  });

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      toast.success("Activity Recognition permission granted! Real-time step counter active.");
      await startTracking();
      setShowSensorAlertModal(false);
      localStorage.setItem("nutrilens_sensor_alert_dismissed", "true");
    } else {
      toast.error("Permission was not granted. Please enable Physical Activity in App Settings.");
    }
  };

  const handleToggleTracking = async () => {
    if (isTracking) {
      const ok = await stopTracking();
      if (ok) toast.info("Step tracking paused.");
    } else {
      const ok = await startTracking();
      if (ok) toast.success("Step tracking started!");
      else if (error) toast.error(error);
    }
  };

  const handleManualSave = () => {
    const val = parseInt(customInput, 10);
    if (!isNaN(val) && val >= 0) {
      setOverrideTarget(val);
      toast.success(`Daily target steps updated to ${val.toLocaleString()}`);
      setShowEditInput(false);
    } else {
      toast.error("Please enter a valid step count");
    }
  };

  const handleAddTestSteps = () => {
    updateManualSteps(steps + 100);
    toast.success("Added 100 steps for verification!");
  };

  // Health Connect Sync Handler
  const handleHealthConnectSync = async () => {
    setIsSyncingHC(true);
    try {
      await refreshSteps();
      toast.success("Step counter refreshed!");
    } catch {
      toast.error("Failed to sync step counter");
    } finally {
      setIsSyncingHC(false);
    }
  };

  // Human-friendly status label
  const getSourceDisplayLabel = () => {
    if (isNative) {
      if (hasPermission === false) {
        return {
          userLabel: "Activity Permission Required",
          badgeText: "Permission Needed",
          badgeColor: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
          techDetails: `Android Native · ${sensorName || "TYPE_STEP_COUNTER"} (Permission Needed)`,
          icon: <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />,
        };
      }
      if (isAvailable === false) {
        return {
          userLabel: "Hardware Sensor Unavailable",
          badgeText: "Sensor Unavailable",
          badgeColor: "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30",
          techDetails: "Device lacks hardware TYPE_STEP_COUNTER sensor",
          icon: <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />,
        };
      }
      return {
        userLabel: isTracking
          ? "Android Native Hardware Step Sensor Active"
          : "Hardware Step Sensor Paused",
        badgeText: isTracking ? "Sensor Active" : "Sensor Paused",
        badgeColor: isTracking
          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
          : "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30",
        techDetails: `Android SensorManager: ${sensorName || "Sensor.TYPE_STEP_COUNTER"} · Foreground Service`,
        icon: <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />,
      };
    } else {
      return {
        userLabel: "Step tracking is active in the Android app",
        badgeText: "Web Preview",
        badgeColor:
          "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
        techDetails:
          "Web Preview Mode · Native Android TYPE_STEP_COUNTER is used when installed on Android",
        icon: <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />,
      };
    }
  };

  const statusInfo = getSourceDisplayLabel();

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-5">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-500 border border-emerald-500/25 shadow-sm">
            <Footprints className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display text-lg font-extrabold text-foreground tracking-tight truncate">
                Activity & Step Tracker
              </h2>
              <button
                type="button"
                onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${statusInfo.badgeColor} transition hover:scale-105 active:scale-95 shrink-0`}
                title="Click to view step tracking diagnostic details"
              >
                {statusInfo.icon}
                <span>{statusInfo.badgeText}</span>
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 font-medium truncate">
              {statusInfo.userLabel}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {isNative && (
            <button
              onClick={handleToggleTracking}
              className={`inline-flex items-center gap-1.5 rounded-2xl border px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
                isTracking
                  ? "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
              }`}
              title={isTracking ? "Pause background step sensor" : "Start live step sensor"}
            >
              {isTracking ? <Square className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span>{isTracking ? "Pause Sensor" : "Start Sensor"}</span>
            </button>
          )}

          <button
            onClick={handleAddTestSteps}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition active:scale-95"
            title="Simulate 100 steps for verification"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>+100 Test</span>
          </button>

          <button
            onClick={() => {
              setCustomInput(String(targetSteps));
              setShowEditInput(!showEditInput);
            }}
            className="rounded-2xl border border-border bg-card/80 px-3.5 py-1.5 text-xs font-bold text-foreground hover:border-emerald-500/40 transition shadow-sm active:scale-95"
          >
            {showEditInput ? "Cancel" : "Custom Goal"}
          </button>
        </div>
      </div>

      {/* SENSOR PERMISSION ALERT MODAL POPUP ON ENTRY */}
      <AnimatePresence>
        {showSensorAlertModal && isNative && hasPermission === false && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md rounded-3xl border border-emerald-500/30 bg-card p-6 shadow-2xl space-y-5 text-card-foreground overflow-hidden"
            >
              {/* Background Accent Glow */}
              <div className="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full bg-emerald-500/20 blur-3xl" />

              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-500 border border-emerald-500/30 shadow-md">
                    <Smartphone className="h-6 w-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-extrabold text-foreground tracking-tight">
                      Turn On Step Tracker
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium">
                      Physical Activity Sensor Permission
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowSensorAlertModal(false)}
                  className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                NutriLens AI uses your Android device's hardware step sensor to record real
                footsteps accurately in the background without battery drain.
              </p>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleRequestPermission}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 py-3 text-xs font-black text-slate-950 shadow-lg hover:brightness-110 active:scale-95 transition"
                >
                  <Footprints className="h-4 w-4" />
                  <span>Allow Physical Activity Permission</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowSensorAlertModal(false)}
                  className="w-full rounded-2xl border border-border bg-card py-2.5 text-xs font-bold text-muted-foreground hover:bg-muted transition text-center"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TECHNICAL SENSOR DIAGNOSTIC COLLAPSIBLE */}
      {showTechnicalDetails && (
        <div className="rounded-2xl border border-border bg-muted/40 p-3.5 text-xs space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between font-bold text-foreground">
            <span className="flex items-center gap-1.5 text-emerald-500">
              <Info className="h-4 w-4" /> System Step Tracking Diagnostics
            </span>
            <span className="text-[10px] text-muted-foreground">
              {isNative ? "Android Native Sensor" : "Web Preview Mode"}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted-foreground font-mono text-[11px]">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-card border border-border/50">
              <span className="font-bold text-foreground">Active Driver:</span>
              <span className="truncate">{statusInfo.techDetails}</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-card border border-border/50">
              <span className="font-bold text-foreground">Stride Math:</span>
              <span>
                {(strideMeters * 100).toFixed(1)} cm / step ({heightCm}cm height)
              </span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-card border border-border/50">
              <span className="font-bold text-foreground">Status:</span>
              <span>{isTracking ? "Tracking Live" : "Standby"}</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-card border border-border/50">
              <span className="font-bold text-foreground">MET Formula:</span>
              <span>
                {(weightKg * 0.0006125).toFixed(4)} kcal/step ({weightKg}kg)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM TARGET GOAL FORM */}
      {showEditInput && (
        <div className="flex items-center gap-2 rounded-2xl bg-muted/30 p-3 border border-border animate-in fade-in">
          <input
            type="number"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Set custom daily step goal"
            className="input text-sm py-1.5"
            min="1000"
          />
          <button
            onClick={handleManualSave}
            className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow"
          >
            Save Target
          </button>
        </div>
      )}

      {/* HERO DISPLAY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Steps Main Display & Circular Progress Ring (Green Gradient Card) */}
        <div className="md:col-span-2 lg:col-span-2 rounded-[22px] bg-gradient-to-br from-emerald-500/15 via-emerald-950/20 to-transparent border border-emerald-500/30 p-4 sm:p-5 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-emerald-500/50 transition min-w-0">
          <div className="absolute top-0 right-0 h-32 w-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between text-xs font-bold text-emerald-500">
            <span className="uppercase tracking-widest flex items-center gap-1.5">
              <Footprints className="h-4 w-4" /> TODAY'S STEPS
            </span>
            <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 border border-emerald-500/30">
              {progressPct}% Goal
            </span>
          </div>

          <div className="my-3 flex items-center justify-between gap-4 min-w-0">
            <div className="min-w-0">
              <div className="font-display text-3xl sm:text-4xl font-black text-foreground tabular-nums tracking-tight truncate">
                {steps.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-medium truncate">
                Goal: {targetSteps.toLocaleString()} steps ({aiPrediction.goalLabel})
              </div>
              <div className="text-[11px] text-emerald-500 font-semibold mt-1">
                {remainingSteps > 0
                  ? `${remainingSteps.toLocaleString()} steps remaining`
                  : "🎉 Target Achieved!"}
              </div>
            </div>

            {/* Circular Progress Ring */}
            <div className="relative grid h-16 w-16 place-items-center shrink-0">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                <path
                  className="text-emerald-950/50"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500 transition-all duration-700 ease-out"
                  strokeDasharray={`${progressPct}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-display text-xs font-black text-foreground">
                {progressPct}%
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2.5 w-full rounded-full bg-emerald-950/40 border border-emerald-500/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_#34D399] transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Calories Burned Based on Footsteps (Orange Gradient Card) */}
        <div className="md:col-span-1 lg:col-span-1 rounded-[22px] border border-amber-500/30 bg-gradient-to-br from-amber-500/15 via-orange-950/20 to-transparent p-4 flex flex-col justify-between shadow-md hover:border-amber-500/50 transition min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-amber-500 dark:text-amber-400 flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-amber-500 animate-pulse shrink-0" /> CALORIES BURNED
            </span>
          </div>
          <div className="my-2 min-w-0">
            <div className="font-display text-2xl sm:text-3xl font-black text-amber-500 dark:text-amber-400 tabular-nums truncate">
              {caloriesBurned}
            </div>
            <div className="text-[11px] font-semibold text-muted-foreground mt-0.5 truncate">
              kcal ({weightKg}kg weight)
            </div>
          </div>
          <div className="text-[10px] text-amber-500/80 font-medium truncate">
            Accurate MET scale (~{(weightKg * 0.0006125).toFixed(3)} kcal/step)
          </div>
        </div>

        {/* Distance & Time Walked (Blue Gradient Card) */}
        <div className="md:col-span-1 lg:col-span-1 rounded-[22px] border border-blue-500/30 bg-gradient-to-br from-blue-500/15 via-indigo-950/20 to-transparent p-4 flex flex-col justify-between shadow-md hover:border-blue-500/50 transition min-w-0">
          <div className="flex items-center justify-between text-xs font-extrabold uppercase text-blue-400">
            <span className="flex items-center gap-1.5 truncate">
              <Navigation className="h-4 w-4 text-blue-400 shrink-0" /> DISTANCE & TIME
            </span>
          </div>
          <div className="my-2 min-w-0">
            <div className="font-display text-2xl font-black text-foreground tabular-nums truncate">
              {distanceKm} <span className="text-xs font-bold text-muted-foreground">km</span>
            </div>
            <div className="text-xs text-blue-400 font-semibold flex items-center gap-1 mt-1 truncate">
              <Clock className="h-3.5 w-3.5 shrink-0" /> {activeMins} mins active
            </div>
          </div>
          <div className="text-[10px] text-muted-foreground font-medium truncate">
            Stride length ~{(strideMeters * 100).toFixed(1)}cm ({heightCm}cm)
          </div>
        </div>
      </div>
    </div>
  );
}
