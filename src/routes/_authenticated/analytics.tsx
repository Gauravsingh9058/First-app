import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMacroTrend, getMicroTrend, getWeightTrend } from "@/lib/analytics.functions";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { MICRO_LABELS, MICRO_UNITS, RDA } from "@/lib/nutrition";
import { LocalStore } from "@/lib/local-store";
import { getLocalDateString } from "@/lib/date-utils";
import { useMemo, useState, useEffect } from "react";
import {
  TrendingUp,
  Sparkles,
  Flame,
  Utensils,
  Award,
  Zap,
  Scale,
  Calendar,
  Activity,
  CheckCircle2,
  Info,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/analytics")({
  head: () => ({ meta: [{ title: "Nutrition Analytics — NutriLens" }] }),
  component: AnalyticsPage,
});

export function AnalyticsPage() {
  const [daysFilter, setDaysFilter] = useState<7 | 14 | 30 | 60>(30);
  const [localVersion, setLocalVersion] = useState<number>(0);

  useEffect(() => {
    const handleDataChange = () => {
      setLocalVersion((v) => v + 1);
    };
    window.addEventListener("nutrilens-data-changed", handleDataChange);
    return () => window.removeEventListener("nutrilens-data-changed", handleDataChange);
  }, []);

  const macroFn = useServerFn(getMacroTrend);
  const microFn = useServerFn(getMicroTrend);
  const wtFn = useServerFn(getWeightTrend);

  const macroQ = useQuery({
    queryKey: ["macros", daysFilter],
    queryFn: () => macroFn({ data: { days: daysFilter } }),
  });
  const microQ = useQuery({
    queryKey: ["micros", daysFilter],
    queryFn: () => microFn({ data: { days: daysFilter } }),
  });
  const wtQ = useQuery({ queryKey: ["weights", 60], queryFn: () => wtFn({ data: { days: 60 } }) });

  // Continuous N-day date series up to today
  const combinedMacroTrend = useMemo(() => {
    const today = new Date();
    const map = new Map<
      string,
      { day: string; calories: number; protein_g: number; carbs_g: number; fat_g: number }
    >();

    for (let i = daysFilter - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dKey = getLocalDateString(d);
      map.set(dKey, { day: dKey, calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 });
    }

    if (macroQ.data) {
      for (const r of macroQ.data) {
        const dKey = String(r.day);
        const existing = map.get(dKey) || {
          day: dKey,
          calories: 0,
          protein_g: 0,
          carbs_g: 0,
          fat_g: 0,
        };
        existing.calories = Math.max(existing.calories, Number(r.calories || 0));
        existing.protein_g = Math.max(existing.protein_g, Number(r.protein_g || 0));
        existing.carbs_g = Math.max(existing.carbs_g, Number(r.carbs_g || 0));
        existing.fat_g = Math.max(existing.fat_g, Number(r.fat_g || 0));
        map.set(dKey, existing);
      }
    }

    const localMeals = LocalStore.getMeals();
    for (const m of localMeals) {
      const dKey = m.eaten_on || (m.eaten_at ? getLocalDateString(new Date(m.eaten_at)) : "");
      if (map.has(dKey)) {
        const entry = map.get(dKey)!;
        entry.calories += Number(m.calories || 0);
        entry.protein_g += Number(m.protein_g || 0);
        entry.carbs_g += Number(m.carbs_g || 0);
        entry.fat_g += Number(m.fat_g || 0);
      }
    }

    void localVersion;
    return Array.from(map.values()).map((r) => ({
      ...r,
      calories: Math.round(r.calories),
      protein_g: Math.round(r.protein_g),
      carbs_g: Math.round(r.carbs_g),
      fat_g: Math.round(r.fat_g),
    }));
  }, [macroQ.data, daysFilter, localVersion]);

  // Overall averages for the top summary cards
  const summaryStats = useMemo(() => {
    if (combinedMacroTrend.length === 0)
      return { avgCals: 0, avgProtein: 0, avgCarbs: 0, avgFat: 0 };
    const loggedDays = combinedMacroTrend.filter((d) => d.calories > 0);
    const count = Math.max(1, loggedDays.length);
    const totalCals = loggedDays.reduce((acc, d) => acc + d.calories, 0);
    const totalProt = loggedDays.reduce((acc, d) => acc + d.protein_g, 0);
    const totalCarbs = loggedDays.reduce((acc, d) => acc + d.carbs_g, 0);
    const totalFat = loggedDays.reduce((acc, d) => acc + d.fat_g, 0);

    return {
      avgCals: Math.round(totalCals / count),
      avgProtein: Math.round(totalProt / count),
      avgCarbs: Math.round(totalCarbs / count),
      avgFat: Math.round(totalFat / count),
    };
  }, [combinedMacroTrend]);

  const microBarData = useMemo(() => {
    void localVersion;
    const localMeals = LocalStore.getMeals();
    const nutKeys = Object.keys(RDA) as Array<keyof typeof RDA>;

    return nutKeys.map((nut) => {
      const localTotal = localMeals.reduce(
        (sum, m) => sum + Number((m as unknown as Record<string, unknown>)[nut] || 0),
        0,
      );

      let serverTotal = 0;
      let count = localMeals.length > 0 ? 1 : 0;

      if (microQ.data?.rows) {
        const logged = microQ.data.rows.filter((r) => Number(r.meal_count ?? 0) > 0);
        if (logged.length > 0) {
          serverTotal = logged.reduce(
            (s, r) => s + Number((r as Record<string, unknown>)[nut] ?? 0),
            0,
          );
          count = logged.length;
        }
      }

      const totalVal = Math.max(serverTotal, localTotal);
      const avg = count > 0 ? totalVal / Math.max(1, count) : 0;
      const pct = Math.min(180, Math.round((avg / RDA[nut]) * 100));

      return {
        name: MICRO_LABELS[nut].replace("Vitamin ", "Vit "),
        pct,
        unit: MICRO_UNITS[nut],
        rda: RDA[nut],
      };
    });
  }, [microQ.data, localVersion]);

  const latestWeight = useMemo(() => {
    if (!wtQ.data || wtQ.data.length === 0) return null;
    return wtQ.data[wtQ.data.length - 1];
  }, [wtQ.data]);

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Top Header & Range Switcher Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="grid h-12 w-12 place-items-center rounded-[20px] bg-gradient-to-br from-emerald-500/20 via-primary/10 to-teal-500/20 text-primary border border-primary/30 shadow-[0_0_20px_rgba(0,229,143,0.25)] shrink-0">
            <TrendingUp className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Analytics & Intelligence
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Nutritional Trends
            </h1>
          </div>
        </div>

        {/* Time Filter Segmented Pills */}
        <div className="flex items-center rounded-[22px] bg-card/60 backdrop-blur-xl p-1.5 border border-border/80 shadow-lg shrink-0 self-start sm:self-auto">
          {([7, 14, 30, 60] as const).map((days) => (
            <button
              key={days}
              onClick={() => setDaysFilter(days)}
              className={`rounded-[18px] px-3.5 py-2 text-xs font-extrabold transition-all duration-300 active:scale-95 ${
                daysFilter === days
                  ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(0,229,143,0.4)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              {days}D
            </button>
          ))}
        </div>
      </div>

      {/* Top Summary Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SummaryCard
          label="Avg Daily Cals"
          value={summaryStats.avgCals}
          unit="kcal"
          sub="Target: 2,000"
          icon={<Flame className="h-4 w-4 text-amber-500" />}
          borderClass="border-amber-500/30"
          bgClass="bg-amber-500/5"
          textColor="text-amber-400"
        />
        <SummaryCard
          label="Avg Protein"
          value={summaryStats.avgProtein}
          unit="g/day"
          sub="Target: 140g"
          icon={<Utensils className="h-4 w-4 text-emerald-500" />}
          borderClass="border-emerald-500/30"
          bgClass="bg-emerald-500/5"
          textColor="text-emerald-400"
        />
        <SummaryCard
          label="Avg Carbs"
          value={summaryStats.avgCarbs}
          unit="g/day"
          sub="Target: 220g"
          icon={<Award className="h-4 w-4 text-blue-500" />}
          borderClass="border-blue-500/30"
          bgClass="bg-blue-500/5"
          textColor="text-blue-400"
        />
        <SummaryCard
          label="Avg Fat"
          value={summaryStats.avgFat}
          unit="g/day"
          sub="Target: 65g"
          icon={<Sparkles className="h-4 w-4 text-purple-500" />}
          borderClass="border-purple-500/30"
          bgClass="bg-purple-500/5"
          textColor="text-purple-400"
        />
      </div>

      {/* Calories Intake Chart */}
      <GlassCard
        title={`Calories Intake — Last ${daysFilter} Days`}
        subtitle="Daily energy intake versus recommended baseline"
      >
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={combinedMacroTrend}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="calGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00E58F" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00E58F" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="#ffffff" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                tickFormatter={(d) => String(d).slice(5)}
              />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(10, 15, 12, 0.9)",
                  borderColor: "rgba(0, 229, 143, 0.3)",
                  borderRadius: "16px",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
                  color: "#ffffff",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
                formatter={(v: number) => [`${v} kcal`, "Calories"]}
              />
              <Area
                type="monotone"
                dataKey="calories"
                stroke="#00E58F"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#calGradient)"
                activeDot={{ r: 6, fill: "#00E58F", stroke: "#ffffff", strokeWidth: 2 }}
                dot={{ r: 2, fill: "#00E58F" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Macronutrients Balance Chart */}
      <GlassCard
        title="Macronutrients Balance — Protein, Carbs, Fat (g)"
        subtitle="Daily distribution of energy sources"
      >
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={combinedMacroTrend}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="#ffffff" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                tickFormatter={(d) => String(d).slice(5)}
              />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(10, 15, 12, 0.9)",
                  borderColor: "rgba(255, 255, 255, 0.15)",
                  borderRadius: "16px",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
                  color: "#ffffff",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
              <Line
                name="Protein (g)"
                type="monotone"
                dataKey="protein_g"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={false}
              />
              <Line
                name="Carbs (g)"
                type="monotone"
                dataKey="carbs_g"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={false}
              />
              <Line
                name="Fat (g)"
                type="monotone"
                dataKey="fat_g"
                stroke="#f43f5e"
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Micronutrient Target Sufficiency Chart */}
      <GlassCard
        title="Micronutrient Target Sufficiency (% of RDA)"
        subtitle="Average daily intake vs Recommended Daily Allowance"
      >
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={microBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="#ffffff" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9ca3af" }} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} domain={[0, 150]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(10, 15, 12, 0.9)",
                  borderColor: "rgba(0, 229, 143, 0.3)",
                  borderRadius: "16px",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
                  color: "#ffffff",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
                formatter={(v: number) => [`${v}% RDA`, "Achieved"]}
              />
              <Bar dataKey="pct" fill="#00E58F" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 pt-3 border-t border-border/60 text-[11px] text-muted-foreground flex flex-wrap gap-2">
          <span className="font-bold text-foreground">RDA References:</span>
          {(Object.keys(RDA) as Array<keyof typeof RDA>)
            .map((k) => `${MICRO_LABELS[k]}: ${RDA[k]}${MICRO_UNITS[k]}`)
            .join(" • ")}
        </div>
      </GlassCard>

      {/* Weight Tracking Chart */}
      <GlassCard
        title="Weight Tracking — Last 60 Days"
        subtitle="Body mass trajectory and trendline over time"
      >
        {latestWeight && (
          <div className="mb-4 flex items-center justify-between bg-primary/10 border border-primary/20 rounded-[18px] p-3 px-4">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <Scale className="h-4 w-4 text-primary" /> Current Recorded Weight
            </div>
            <div className="font-display text-lg font-extrabold text-primary font-mono">
              {latestWeight.weight_kg} kg
            </div>
          </div>
        )}

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={wtQ.data ?? []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="#ffffff" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                tickFormatter={(d) => String(d).slice(5)}
              />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(10, 15, 12, 0.9)",
                  borderColor: "rgba(6, 182, 212, 0.3)",
                  borderRadius: "16px",
                  backdropFilter: "blur(12px)",
                  color: "#ffffff",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              />
              <Line
                type="monotone"
                dataKey="weight_kg"
                stroke="#06b6d4"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#06b6d4" }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {(wtQ.data?.length ?? 0) === 0 && (
          <div className="mt-3 text-xs text-muted-foreground italic flex items-center gap-1.5 bg-muted/20 p-3 rounded-xl border border-border/60">
            <Info className="h-4 w-4 text-primary shrink-0" /> No weight logs available yet. Update
            your health profile to track progress over time.
          </div>
        )}
      </GlassCard>

      {/* AI Nutritionist Insights Banner */}
      <div className="rounded-[24px] border border-primary/30 bg-primary/10 backdrop-blur-xl p-5 space-y-2 shadow-[0_0_25px_rgba(0,229,143,0.15)]">
        <div className="flex items-center gap-2 font-display text-xs font-extrabold uppercase tracking-wider text-primary">
          <Zap className="h-4 w-4 animate-pulse text-primary" /> Nutrition Intelligence Verdict
        </div>
        <p className="text-xs sm:text-sm font-medium text-foreground leading-relaxed">
          Based on your {daysFilter}-day trend, your protein intake averages{" "}
          {summaryStats.avgProtein}g per day. Consistently keeping your protein target around 140g
          will accelerate muscle recovery and body re-composition.
        </p>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  unit,
  sub,
  icon,
  borderClass,
  bgClass,
  textColor,
}: {
  label: string;
  value: number;
  unit: string;
  sub: string;
  icon: React.ReactNode;
  borderClass: string;
  bgClass: string;
  textColor: string;
}) {
  return (
    <div
      className={`rounded-[22px] border ${borderClass} ${bgClass} backdrop-blur-xl p-4 shadow-xl flex flex-col justify-between hover:-translate-y-1 transition-all duration-300`}
    >
      <div className="flex items-center justify-between text-xs font-extrabold text-muted-foreground">
        <span>{label}</span>
        {icon}
      </div>
      <div className={`mt-2 font-display text-2xl font-extrabold ${textColor} tabular-nums`}>
        {value} <span className="text-xs font-normal text-muted-foreground font-mono">{unit}</span>
      </div>
      <div className="mt-1 text-[10px] text-muted-foreground/80 font-mono">{sub}</div>
    </div>
  );
}

function GlassCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-border/80 bg-card/60 dark:border-white/10 dark:bg-[#0C1722]/80 backdrop-blur-2xl p-5 sm:p-6 shadow-2xl space-y-4 hover:border-primary/30 dark:hover:border-white/20 transition-all duration-300">
      <div>
        <h3 className="font-display text-base sm:text-lg font-extrabold text-foreground tracking-tight">
          {title}
        </h3>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
