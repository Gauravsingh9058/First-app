import { useEffect, useState } from "react";
import { Flame, Trophy, Zap } from "lucide-react";
import { motion } from "motion/react";

interface Props {
  consumed: number;
  target: number;
  protein: number;
  proteinTarget: number;
  score: number;
}

export function CalorieHero({ consumed, target, protein, proteinTarget, score }: Props) {
  const remaining = Math.max(0, target - consumed);
  const pct = Math.min(1, target > 0 ? consumed / target : 0);
  const [animatedPct, setAnimatedPct] = useState(0);
  const [displayConsumed, setDisplayConsumed] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimatedPct(pct), 60);
    return () => clearTimeout(t);
  }, [pct]);

  // Smooth number easing animation
  useEffect(() => {
    let animationFrameId: number;
    let startTimestamp: number | null = null;
    const duration = 1000;
    const endVal = Math.round(consumed);

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayConsumed(Math.round(endVal * easedProgress));
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };
    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [consumed]);

  const r = 88;
  const c = 2 * Math.PI * r;
  const dash = c * animatedPct;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-[24px] border border-border/80 bg-card text-card-foreground shadow-lg dark:border-white/10 dark:bg-[#0C1722]/80 backdrop-blur-2xl dark:text-white dark:shadow-2xl p-6 transition-all duration-300 hover:border-border dark:hover:border-white/20 sm:p-7"
    >
      {/* Ambient background glows (Dark mode only) */}
      <div className="hidden dark:block animate-ambient-breathing pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-[#38BDF8]/15 blur-3xl" />
      <div className="hidden dark:block animate-ambient-breathing pointer-events-none absolute -bottom-16 -left-12 h-64 w-64 rounded-full bg-[#34D399]/10 blur-3xl [animation-delay:3s]" />

      {/* Header Badge */}
      <div className="mb-5 flex items-center justify-between border-b border-border/50 dark:border-white/5 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 shadow-sm dark:shadow-[0_0_12px_rgba(56,189,248,0.2)]">
            <Flame className="h-4.5 w-4.5" />
          </div>
          <span className="font-display text-sm font-black tracking-wide text-foreground dark:text-white">
            CALORIE & MACRO OVERVIEW
          </span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-[#38BDF8]/30 bg-[#38BDF8]/10 text-[#38BDF8] px-3 py-1 text-[11px] font-black shadow-sm dark:shadow-[0_0_10px_rgba(56,189,248,0.2)]">
          <Zap className="h-3.5 w-3.5 animate-pulse" />
          <span>Optimal Energy</span>
        </div>
      </div>

      <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
        {/* Left: Animated Circular Progress Ring */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg
            width="210"
            height="210"
            viewBox="0 0 210 210"
            className="drop-shadow-sm dark:drop-shadow-[0_0_20px_rgba(56,189,248,0.3)]"
          >
            <defs>
              <linearGradient id="primaryGreenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#34D399" />
              </linearGradient>
            </defs>
            {/* Background Track */}
            <circle
              cx="105"
              cy="105"
              r={r}
              fill="none"
              className="stroke-muted dark:stroke-white/10"
              strokeWidth="15"
            />
            {/* Progress Arc */}
            <circle
              cx="105"
              cy="105"
              r={r}
              fill="none"
              stroke="url(#primaryGreenGradient)"
              strokeWidth="15"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${c}`}
              transform="rotate(-90 105 105)"
              style={{ transition: "stroke-dasharray 1200ms cubic-bezier(.16,1,.3,1)" }}
            />
          </svg>

          {/* Center Text inside Circular Ring */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="font-display text-4xl font-black leading-none text-foreground dark:text-white tracking-tight tabular-nums">
              {displayConsumed}
            </div>
            <div className="mt-1 text-[10px] font-black uppercase tracking-widest text-[#38BDF8]">
              KCAL EATEN
            </div>
            <div className="mt-1.5 rounded-full border border-border bg-muted/50 dark:border-white/10 dark:bg-white/5 px-3 py-0.5 text-xs font-semibold text-muted-foreground dark:text-slate-300">
              {Math.round(remaining)} kcal left
            </div>
          </div>
        </div>

        {/* Right Details */}
        <div className="w-full flex-1 space-y-4">
          {/* Target */}
          <div className="flex items-center justify-between rounded-[20px] border border-border/60 bg-muted/30 dark:border-white/5 dark:bg-[#0F2130]/80 p-3.5 backdrop-blur-xl">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground dark:text-slate-400">
                DAILY GOAL TARGET
              </div>
              <div className="font-display text-2xl font-black text-foreground dark:text-white tabular-nums">
                {target}{" "}
                <span className="text-xs font-medium text-muted-foreground dark:text-slate-400">
                  kcal
                </span>
              </div>
            </div>
            <div className="text-right text-xs text-[#38BDF8] font-black">
              {Math.round(pct * 100)}% Met
            </div>
          </div>

          {/* Protein Progress */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground/90 dark:text-slate-300 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#38BDF8] shadow-sm dark:shadow-[0_0_8px_#38BDF8]" />{" "}
                Protein Intake
              </span>
              <span className="font-bold tabular-nums text-foreground dark:text-white">
                {Math.round(protein)}{" "}
                <span className="text-muted-foreground dark:text-slate-400">
                  / {proteinTarget}g
                </span>
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted dark:bg-white/5 p-0.5 border border-border/40 dark:border-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#38BDF8] to-[#34D399] shadow-sm dark:shadow-[0_0_12px_rgba(56,189,248,0.5)] transition-all duration-1000 ease-out"
                style={{
                  width: `${Math.min(100, (protein / Math.max(proteinTarget, 1)) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Nutrition Score */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground/90 dark:text-[#C7D2CC] flex items-center gap-1.5">
                <Trophy className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" /> Nutrition
                Quality Score
              </span>
              <span className="font-display text-lg font-black text-amber-500 dark:text-amber-400 tabular-nums">
                {score}
                <span className="text-xs text-muted-foreground dark:text-slate-400">/100</span>
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted dark:bg-white/5 p-0.5 border border-border/40 dark:border-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300 shadow-sm dark:shadow-[0_0_12px_rgba(245,158,11,0.4)] transition-all duration-1000 ease-out"
                style={{
                  width: `${Math.min(100, score)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
