import React, { useState, useEffect } from "react";
import { Droplet, X, Check, Sparkles, Plus } from "lucide-react";
import { toast } from "sonner";
import { LocalStore } from "@/lib/local-store";
import { updateProfile, addWater } from "@/lib/profile.functions";
import { useServerFn } from "@tanstack/react-start";

interface CustomWaterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGlasses: number;
  waterTargetGlasses: number;
  todayStr: string;
  onUpdate: () => void;
}

export function CustomWaterModal({
  isOpen,
  onClose,
  currentGlasses,
  waterTargetGlasses,
  todayStr,
  onUpdate,
}: CustomWaterModalProps) {
  const addWaterFn = useServerFn(addWater);
  const updateProfileFn = useServerFn(updateProfile);

  // 1. Daily Goal state (in Liters)
  const initialTargetL = (waterTargetGlasses * 0.25).toFixed(1);
  const [targetLitersStr, setTargetLitersStr] = useState<string>(initialTargetL);

  // 2. Today's Intake state (in Liters to add)
  const [addLitersStr, setAddLitersStr] = useState<string>("0.5");

  const [isSavingTarget, setIsSavingTarget] = useState(false);
  const [isLoggingWater, setIsLoggingWater] = useState(false);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setTargetLitersStr((waterTargetGlasses * 0.25).toFixed(1));
    }
  }, [isOpen, waterTargetGlasses]);

  if (!isOpen) return null;

  // Real-time calculation helper
  const parsedTargetL = parseFloat(targetLitersStr) || 0;
  const calcTargetGlasses = Math.round((parsedTargetL * 1000) / 250);

  const parsedAddL = parseFloat(addLitersStr) || 0;
  const calcAddGlasses = Math.round(((parsedAddL * 1000) / 250) * 10) / 10;

  const currentLitersNum = currentGlasses * 0.25;
  const currentLiters = currentLitersNum.toFixed(1);
  const targetLitersNum = waterTargetGlasses * 0.25;
  const progressPercent =
    targetLitersNum > 0 ? Math.min(100, Math.round((currentLitersNum / targetLitersNum) * 100)) : 0;

  // Save Daily Target Goal
  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedTargetL < 0.5 || parsedTargetL > 10) {
      toast.error("Please enter a realistic goal between 0.5L and 10L");
      return;
    }

    setIsSavingTarget(true);
    const newGlasses = Math.max(2, Math.round((parsedTargetL * 1000) / 250));

    try {
      const p = LocalStore.getProfile();
      if (p) {
        LocalStore.saveProfile({
          ...p,
          water_target_glasses: newGlasses,
          water_goal_l: parsedTargetL,
        });
      }

      await updateProfileFn({
        data: {
          water_goal_l: parsedTargetL,
          water_target_glasses: newGlasses,
        },
      });

      toast.success(`Daily Goal updated to ${parsedTargetL} Liters (${newGlasses} glasses)!`);
      onUpdate();
      onClose();
    } catch {
      toast.success(`Daily Goal updated to ${parsedTargetL} Liters!`);
      onUpdate();
      onClose();
    } finally {
      setIsSavingTarget(false);
    }
  };

  // Log Intake
  const handleLogIntake = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedAddL <= 0) {
      toast.error("Please enter a valid amount in Liters");
      return;
    }

    setIsLoggingWater(true);
    try {
      LocalStore.addWater(calcAddGlasses, todayStr);
      toast.success(`Logged ${parsedAddL}L (+${calcAddGlasses} glasses)`);

      try {
        await addWaterFn({ data: { glasses: calcAddGlasses, day: todayStr } });
      } catch {
        // saved locally
      }

      onUpdate();
      onClose();
    } catch {
      toast.error("Failed to log water");
    } finally {
      setIsLoggingWater(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/70 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-[92vw] max-w-md md:max-w-lg lg:max-w-xl my-auto rounded-[24px] sm:rounded-[28px] md:rounded-[32px] border border-cyan-500/30 bg-[#0A1612] p-4 sm:p-6 md:p-7 shadow-[0_0_50px_rgba(6,182,212,0.25)] text-foreground space-y-4 sm:space-y-5 md:space-y-6 max-h-[90vh] overflow-y-auto scrollbar-none min-w-0">
        {/* Glow */}
        <div className="absolute -top-20 -right-20 h-44 w-44 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 sm:pb-4 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="grid h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 place-items-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shrink-0">
              <Droplet className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0">
              <h2 className="font-display text-base sm:text-lg md:text-xl font-extrabold text-white truncate">
                Custom Water Intake
              </h2>
              <p className="text-xs md:text-sm text-cyan-300/80 truncate">
                Today: <span className="font-bold text-white">{currentLiters}L</span> (
                {currentGlasses} glasses)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close custom water intake"
            className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full bg-white/10 hover:bg-white/20 text-muted-foreground hover:text-white transition shrink-0 cursor-pointer"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Today's Hydration Visual Progress Bar */}
        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-3 sm:p-4 space-y-2">
          <div className="flex items-center justify-between text-xs md:text-sm font-extrabold text-cyan-200">
            <span>Hydration Progress</span>
            <span className="font-mono text-cyan-400">{progressPercent}% of Goal</span>
          </div>
          <div className="h-2.5 sm:h-3 w-full rounded-full bg-black/60 overflow-hidden border border-cyan-500/20 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 transition-all duration-500 shadow-[0_0_12px_rgba(6,182,212,0.6)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SECTION 1: SET DAILY GOAL (IN LITERS) */}
          <form
            onSubmit={handleSaveGoal}
            className="rounded-2xl border border-cyan-500/20 bg-cyan-950/30 p-3.5 sm:p-4 md:p-5 space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <label className="text-[11px] sm:text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400 shrink-0" /> Daily Goal
                </label>
                <span className="text-[10px] font-extrabold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20 shrink-0">
                  Auto-Calculated
                </span>
              </div>

              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="10"
                  value={targetLitersStr}
                  onChange={(e) => setTargetLitersStr(e.target.value)}
                  placeholder="e.g. 3.0"
                  className="w-full rounded-xl border border-cyan-500/30 bg-black/50 px-3.5 sm:px-4 py-2 sm:py-2.5 text-base sm:text-lg font-black text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition pr-16"
                />
                <span className="absolute right-3.5 sm:right-4 top-2.5 sm:top-3 text-xs font-black text-cyan-400 uppercase pointer-events-none">
                  Liters
                </span>
              </div>

              {/* Goal Presets for Tablets/Touch */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {["1.5", "2.0", "2.5", "3.0"].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setTargetLitersStr(val)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition cursor-pointer border ${
                      targetLitersStr === val
                        ? "bg-cyan-500 text-slate-950 border-cyan-400"
                        : "bg-cyan-500/10 text-cyan-300 border-cyan-500/20 hover:bg-cyan-500/20"
                    }`}
                  >
                    {val}L
                  </button>
                ))}
              </div>

              {/* Auto Calculation Result Display */}
              <div className="rounded-xl bg-cyan-500/10 border border-cyan-500/20 p-2.5 flex items-center justify-between gap-2 text-xs">
                <span className="text-cyan-200/80 font-medium shrink-0">Glasses:</span>
                <span className="font-extrabold text-white text-xs sm:text-sm text-right">
                  ✨ {calcTargetGlasses} Glasses{" "}
                  <span className="text-[10px] text-cyan-300 font-normal whitespace-nowrap">
                    (250ml each)
                  </span>
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSavingTarget}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-500 py-2.5 text-xs font-black text-[#071018] hover:bg-cyan-400 transition cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50"
            >
              <Check className="h-4 w-4 stroke-[3]" /> Save Goal ({targetLitersStr || 0}L)
            </button>
          </form>

          {/* SECTION 2: QUICK LOG WATER DRANK (IN LITERS) */}
          <form
            onSubmit={handleLogIntake}
            className="rounded-2xl border border-white/10 bg-white/5 p-3.5 sm:p-4 md:p-5 space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[11px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="h-3.5 w-3.5 text-cyan-400 shrink-0" /> Log Water Drank
                </label>
              </div>

              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="5"
                  value={addLitersStr}
                  onChange={(e) => setAddLitersStr(e.target.value)}
                  placeholder="e.g. 0.5"
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 sm:px-4 py-2 sm:py-2.5 text-base sm:text-lg font-black text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition pr-16"
                />
                <span className="absolute right-3.5 sm:right-4 top-2.5 sm:top-3 text-xs font-black text-cyan-400 uppercase pointer-events-none">
                  Liters
                </span>
              </div>

              {/* Quick Add Presets for Tablets/Touch */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {[
                  { label: "+0.25L", val: "0.25" },
                  { label: "+0.5L", val: "0.5" },
                  { label: "+0.75L", val: "0.75" },
                  { label: "+1.0L", val: "1.0" },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setAddLitersStr(item.val)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition cursor-pointer border ${
                      addLitersStr === item.val
                        ? "bg-cyan-400 text-slate-950 border-cyan-300"
                        : "bg-white/10 text-slate-200 border-white/10 hover:bg-white/20"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Auto Calculation Result Display */}
              <div className="rounded-xl bg-white/5 border border-white/10 p-2.5 flex items-center justify-between gap-2 text-xs">
                <span className="text-muted-foreground font-medium shrink-0">Glasses:</span>
                <span className="font-extrabold text-white text-xs sm:text-sm text-right">
                  +{calcAddGlasses} Glasses{" "}
                  <span className="text-[10px] text-muted-foreground font-normal whitespace-nowrap">
                    ({parsedAddL * 1000} ml)
                  </span>
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingWater}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 py-2.5 text-xs font-black text-[#071018] hover:brightness-110 transition cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50"
            >
              <Plus className="h-4 w-4 stroke-[3]" /> Log +{addLitersStr || 0} Liters
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
