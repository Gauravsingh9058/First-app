import { useEffect, useState, type ReactNode } from "react";
import { motion } from "motion/react";

interface Props {
  label: string;
  value: number;
  target: number;
  unit?: string;
  color: string;
  icon?: ReactNode;
}

export function MacroRing({ label, value, target, unit = "g", color, icon }: Props) {
  const pct = Math.min(1, target > 0 ? value / target : 0);
  const pctDisplay = Math.min(100, Math.round(pct * 100));
  const r = 28;
  const c = 2 * Math.PI * r;
  const dash = c * pct;

  const [displayVal, setDisplayVal] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    let startTimestamp: number | null = null;
    const duration = 800;
    const endVal = Math.round(value);

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayVal(Math.round(endVal * easedProgress));
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };
    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group relative flex flex-col items-center justify-between gap-3 rounded-[22px] border border-border/80 bg-card text-card-foreground shadow-sm backdrop-blur-2xl transition-all duration-300 hover:border-border dark:border-white/10 dark:bg-[#0C1722]/80 dark:text-white dark:hover:bg-[#0F2130] dark:hover:border-[#38BDF8]/30 dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] p-3 sm:p-4 active:scale-[0.98] min-w-0 overflow-hidden"
    >
      <div className="flex w-full items-center justify-between gap-1 border-b border-border/50 dark:border-white/5 pb-2.5 min-w-0">
        <div className="flex items-center gap-1 font-display text-xs font-bold text-foreground dark:text-white min-w-0">
          {icon && (
            <span
              className="drop-shadow-sm dark:drop-shadow-[0_0_8px_currentColor] transition-transform duration-300 group-hover:scale-110 shrink-0"
              style={{ color }}
            >
              {icon}
            </span>
          )}
          <span className="truncate">{label}</span>
        </div>
        <span
          className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black tabular-nums border border-border/40 dark:border-white/5"
          style={{
            backgroundColor: `${color}18`,
            color: color,
          }}
        >
          {pctDisplay}%
        </span>
      </div>

      <div className="relative my-1 flex items-center justify-center">
        <svg
          width="78"
          height="78"
          viewBox="0 0 78 78"
          className="drop-shadow-sm dark:drop-shadow-[0_0_12px_rgba(56,189,248,0.2)]"
        >
          <circle
            cx="39"
            cy="39"
            r={r}
            fill="none"
            className="stroke-muted dark:stroke-white/10"
            strokeWidth="7"
          />
          <circle
            cx="39"
            cy="39"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`}
            transform="rotate(-90 39 39)"
            style={{ transition: "stroke-dasharray 900ms cubic-bezier(.16,1,.3,1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="font-display text-base font-black tracking-tight text-foreground dark:text-white tabular-nums">
            {displayVal}
            <span className="text-[10px] font-medium text-muted-foreground dark:text-slate-400 ml-0.5">
              {unit}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full text-center text-[10px] font-bold text-muted-foreground dark:text-slate-400">
        Target: {target}
        {unit}
      </div>
    </motion.div>
  );
}
