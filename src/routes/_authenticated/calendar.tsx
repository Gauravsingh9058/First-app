import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getCalendarRange, getDay } from "@/lib/analytics.functions";
import { useState, useMemo, useEffect } from "react";
import { LocalStore, LocalMeal } from "@/lib/local-store";
import { getLocalDateString } from "@/lib/date-utils";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Flame,
  Droplet,
  Utensils,
  Award,
  Sparkles,
  Zap,
  Clock,
  Activity,
  CheckCircle2,
  Footprints,
  Navigation,
  ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/calendar")({
  head: () => ({ meta: [{ title: "Nutrition & Activity Calendar — NutriLens" }] }),
  component: CalendarPage,
});

const MONTH_NAMES = [
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
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarPage() {
  const calFn = useServerFn(getCalendarRange);
  const dayFn = useServerFn(getDay);

  const todayObj = new Date();
  const todayStr = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, "0")}-${String(todayObj.getDate()).padStart(2, "0")}`;

  const [year, setYear] = useState<number>(todayObj.getFullYear());
  const [month, setMonth] = useState<number>(todayObj.getMonth());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);
  const [localVersion, setLocalVersion] = useState<number>(0);

  useEffect(() => {
    const handleDataChange = () => {
      setLocalVersion((v) => v + 1);
    };
    window.addEventListener("nutrilens-data-changed", handleDataChange);
    return () => window.removeEventListener("nutrilens-data-changed", handleDataChange);
  }, []);

  const calQ = useQuery({
    queryKey: ["calendar", 3650],
    queryFn: () => calFn({ data: { days: 3650 } }),
  });

  const dayQ = useQuery({
    queryKey: ["day", selectedDateStr],
    queryFn: () => dayFn({ data: { day: selectedDateStr } }),
    enabled: !!selectedDateStr,
  });

  // Combine server calendar data with local meals, water, and step history without double counting
  const aggregatedMap = useMemo(() => {
    const map = new Map<
      string,
      {
        calories: number;
        protein_g: number;
        carbs_g: number;
        fat_g: number;
        fiber_g: number;
        sugar_g: number;
        sodium_mg: number;
        iron_mg: number;
        calcium_mg: number;
        magnesium_mg: number;
        potassium_mg: number;
        vit_a_ug: number;
        vit_b12_ug: number;
        vit_d_ug: number;
        omega3_g: number;
        water_glasses: number;
        steps: number;
        meal_count: number;
        score: number;
        meals: LocalMeal[];
      }
    >();

    if (calQ.data) {
      for (const item of calQ.data) {
        const dKey = item.day as string;
        map.set(dKey, {
          calories: Number(item.calories || 0),
          protein_g: Number(item.protein_g || 0),
          carbs_g: Number(item.carbs_g || 0),
          fat_g: Number(item.fat_g || 0),
          fiber_g: Number(item.fiber_g || 0),
          sugar_g: Number(item.sugar_g || 0),
          sodium_mg: Number(item.sodium_mg || 0),
          iron_mg: Number(item.iron_mg || 0),
          calcium_mg: Number(item.calcium_mg || 0),
          magnesium_mg: Number(item.magnesium_mg || 0),
          potassium_mg: Number(item.potassium_mg || 0),
          vit_a_ug: Number(item.vit_a_ug || 0),
          vit_b12_ug: Number(item.vit_b12_ug || 0),
          vit_d_ug: Number(item.vit_d_ug || 0),
          omega3_g: Number(item.omega3_g || 0),
          water_glasses: Number(item.water_glasses || 0),
          steps: Number(item.steps || 0),
          meal_count: Number(item.meal_count || 0),
          score: Number(item.score || 0),
          meals: [],
        });
      }
    }

    const localMeals = LocalStore.getMeals();
    for (const m of localMeals) {
      const dKey = m.eaten_on || (m.eaten_at ? getLocalDateString(new Date(m.eaten_at)) : "");
      if (!dKey) continue;
      const existing = map.get(dKey);

      if (!existing) {
        // Date was not in server rollup, use local summary
        const summary = LocalStore.getDailySummary(dKey);
        map.set(dKey, {
          calories: summary.calories,
          protein_g: summary.protein_g,
          carbs_g: summary.carbs_g,
          fat_g: summary.fat_g,
          fiber_g: summary.fiber_g,
          sugar_g: summary.sugar_g,
          sodium_mg: summary.sodium_mg,
          iron_mg: summary.iron_mg,
          calcium_mg: summary.calcium_mg,
          magnesium_mg: summary.magnesium_mg,
          potassium_mg: summary.potassium_mg,
          vit_a_ug: summary.vit_a_ug,
          vit_b12_ug: summary.vit_b12_ug,
          vit_d_ug: summary.vit_d_ug,
          omega3_g: summary.omega3_g,
          water_glasses: summary.water_glasses,
          steps: summary.steps,
          meal_count: summary.meal_count,
          score: summary.score,
          meals: summary.meals,
        });
      } else {
        if (!existing.meals.some((x) => x.id === m.id)) {
          existing.meals.push(m);
        }
      }
    }

    void localVersion;
    // Merge local water & step logs for every date
    for (const [dKey, entry] of map.entries()) {
      const w = LocalStore.getWater(dKey);
      if (w > 0) {
        entry.water_glasses = Math.max(entry.water_glasses, w);
      }
      const st = LocalStore.getSteps(dKey);
      if (st > 0) {
        entry.steps = Math.max(entry.steps, st);
      }
    }

    return map;
  }, [calQ.data, localVersion]);

  const daysInMonthGrid = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startWeekday = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const grid: ({ dayNum: number; dateStr: string } | null)[] = [];

    for (let i = 0; i < startWeekday; i++) {
      grid.push(null);
    }

    for (let d = 1; d <= totalDays; d++) {
      const mm = String(month + 1).padStart(2, "0");
      const dd = String(d).padStart(2, "0");
      const dateStr = `${year}-${mm}-${dd}`;
      grid.push({ dayNum: d, dateStr });
    }

    return grid;
  }, [year, month]);

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const selectedData = useMemo(() => {
    const localEntry = aggregatedMap.get(selectedDateStr);
    const serverRollup = dayQ.data?.rollup;
    const serverMeals = dayQ.data?.meals || [];
    const serverProfile = dayQ.data?.profile;

    const allMeals: LocalMeal[] = [...(localEntry?.meals || [])];
    for (const sm of serverMeals) {
      if (!allMeals.some((m) => m.id === sm.id)) {
        const mic = Array.isArray(sm.meal_micros) ? sm.meal_micros[0] : sm.meal_micros;
        allMeals.push({
          id: sm.id,
          eaten_at: sm.eaten_at,
          eaten_on: sm.eaten_on,
          name: sm.name,
          source: (sm.source as "photo" | "manual" | "barcode") || "manual",
          serving_desc: sm.serving_desc || null,
          calories: Number(sm.calories || 0),
          protein_g: Number(sm.protein_g || 0),
          carbs_g: Number(sm.carbs_g || 0),
          fat_g: Number(sm.fat_g || 0),
          fiber_g: Number(sm.fiber_g || 0),
          sugar_g: Number(sm.sugar_g || 0),
          sodium_mg: Number(sm.sodium_mg || 0),
          iron_mg: Number(mic?.iron_mg || 0),
          calcium_mg: Number(mic?.calcium_mg || 0),
          magnesium_mg: Number(mic?.magnesium_mg || 0),
          potassium_mg: Number(mic?.potassium_mg || 0),
          vit_a_ug: Number(mic?.vit_a_ug || 0),
          vit_b12_ug: Number(mic?.vit_b12_ug || 0),
          vit_d_ug: Number(mic?.vit_d_ug || 0),
          omega3_g: Number(mic?.omega3_g || 0),
        });
      }
    }

    const waterG = Math.max(
      Number(serverRollup?.water_glasses || 0),
      LocalStore.getWater(selectedDateStr),
    );

    const hasData = serverRollup
      ? Number(serverRollup.calories) > 0 || waterG > 0
      : allMeals.length > 0 || waterG > 0;

    if (!hasData) {
      return {
        hasData: false,
        totalCals: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        totalFiber: 0,
        totalSugar: 0,
        totalSodium: 0,
        totalIron: 0,
        totalCalcium: 0,
        totalMagnesium: 0,
        totalPotassium: 0,
        totalVitA: 0,
        totalVitB12: 0,
        totalVitD: 0,
        totalOmega3: 0,
        waterG: 0,
        score: 0,
        meals: [],
        targets: {
          calories: Number(serverProfile?.daily_calorie_target || 2000),
          protein: Number(serverProfile?.protein_target_g || 120),
          water: Number(serverProfile?.water_target_glasses || 8),
        },
      };
    }

    const totalCals = Math.round(
      serverRollup
        ? Number(serverRollup.calories || 0)
        : allMeals.reduce((acc, m) => acc + Number(m.calories || 0), 0),
    );
    const totalProtein = Math.round(
      serverRollup
        ? Number(serverRollup.protein_g || 0)
        : allMeals.reduce((acc, m) => acc + Number(m.protein_g || 0), 0),
    );
    const totalCarbs = Math.round(
      serverRollup
        ? Number(serverRollup.carbs_g || 0)
        : allMeals.reduce((acc, m) => acc + Number(m.carbs_g || 0), 0),
    );
    const totalFat = Math.round(
      serverRollup
        ? Number(serverRollup.fat_g || 0)
        : allMeals.reduce((acc, m) => acc + Number(m.fat_g || 0), 0),
    );
    const totalFiber = Math.round(
      serverRollup
        ? Number(serverRollup.fiber_g || 0)
        : allMeals.reduce((acc, m) => acc + Number(m.fiber_g || 0), 0),
    );
    const totalSugar = Math.round(
      serverRollup
        ? Number(serverRollup.sugar_g || 0)
        : allMeals.reduce((acc, m) => acc + Number(m.sugar_g || 0), 0),
    );
    const totalSodium = Math.round(
      serverRollup
        ? Number(serverRollup.sodium_mg || 0)
        : allMeals.reduce((acc, m) => acc + Number(m.sodium_mg || 0), 0),
    );

    const totalIron = Number(
      (serverRollup
        ? Number(serverRollup.iron_mg || 0)
        : allMeals.reduce((acc, m) => acc + Number(m.iron_mg || 0), 0)
      ).toFixed(1),
    );
    const totalCalcium = Number(
      (serverRollup
        ? Number(serverRollup.calcium_mg || 0)
        : allMeals.reduce((acc, m) => acc + Number(m.calcium_mg || 0), 0)
      ).toFixed(1),
    );
    const totalMagnesium = Number(
      (serverRollup
        ? Number(serverRollup.magnesium_mg || 0)
        : allMeals.reduce((acc, m) => acc + Number(m.magnesium_mg || 0), 0)
      ).toFixed(1),
    );
    const totalPotassium = Number(
      (serverRollup
        ? Number(serverRollup.potassium_mg || 0)
        : allMeals.reduce((acc, m) => acc + Number(m.potassium_mg || 0), 0)
      ).toFixed(1),
    );
    const totalVitA = Number(
      (serverRollup
        ? Number(serverRollup.vit_a_ug || 0)
        : allMeals.reduce((acc, m) => acc + Number(m.vit_a_ug || 0), 0)
      ).toFixed(1),
    );
    const totalVitB12 = Number(
      (serverRollup
        ? Number(serverRollup.vit_b12_ug || 0)
        : allMeals.reduce((acc, m) => acc + Number(m.vit_b12_ug || 0), 0)
      ).toFixed(1),
    );
    const totalVitD = Number(
      (serverRollup
        ? Number(serverRollup.vit_d_ug || 0)
        : allMeals.reduce((acc, m) => acc + Number(m.vit_d_ug || 0), 0)
      ).toFixed(1),
    );
    const totalOmega3 = Number(
      (serverRollup
        ? Number(serverRollup.omega3_g || 0)
        : allMeals.reduce((acc, m) => acc + Number(m.omega3_g || 0), 0)
      ).toFixed(1),
    );

    const score = serverRollup
      ? Number(serverRollup.score || 0)
      : Math.min(
          100,
          Math.round(
            (totalCals > 0 ? 40 : 0) +
              Math.min(30, (totalProtein / 100) * 30) +
              Math.min(15, (totalFiber / 25) * 15) +
              Math.min(15, totalIron + totalCalcium > 0 ? 15 : 0),
          ),
        );

    return {
      hasData: true,
      totalCals,
      totalProtein,
      totalCarbs,
      totalFat,
      totalFiber,
      totalSugar,
      totalSodium,
      totalIron,
      totalCalcium,
      totalMagnesium,
      totalPotassium,
      totalVitA,
      totalVitB12,
      totalVitD,
      totalOmega3,
      waterG,
      score,
      meals: allMeals,
      targets: {
        calories: Number(serverProfile?.daily_calorie_target || 2000),
        protein: Number(serverProfile?.protein_target_g || 120),
        water: Number(serverProfile?.water_target_glasses || 8),
      },
    };
  }, [selectedDateStr, aggregatedMap, dayQ.data]);

  const yearOptions = [2024, 2025, 2026, 2027, 2028];

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Header & Controls Card */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="grid h-12 w-12 place-items-center rounded-[20px] bg-gradient-to-br from-emerald-500/20 via-primary/10 to-teal-500/20 text-primary border border-primary/30 shadow-[0_0_20px_rgba(0,229,143,0.25)] shrink-0">
            <CalendarIcon className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Permanent Nutrition History
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {MONTH_NAMES[month]} {year}
            </h1>
          </div>
        </div>

        {/* Multi-Year & Month Selector Navigation */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setYear(todayObj.getFullYear());
              setMonth(todayObj.getMonth());
              setSelectedDateStr(todayStr);
            }}
            className="rounded-[16px] border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-bold text-primary hover:bg-primary/20 transition-all active:scale-95 shadow-[0_0_12px_rgba(0,229,143,0.15)] flex items-center gap-1"
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Today
          </button>

          {/* Year Dropdown */}
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="rounded-[16px] border border-border/80 bg-card/80 px-3 py-2 text-xs font-bold text-foreground hover:bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-md"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y} className="bg-card text-foreground">
                {y}
              </option>
            ))}
          </select>

          {/* Month Dropdown */}
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="rounded-[16px] border border-border/80 bg-card/80 px-3 py-2 text-xs font-bold text-foreground hover:bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-md"
          >
            {MONTH_NAMES.map((mName, idx) => (
              <option key={mName} value={idx} className="bg-card text-foreground">
                {mName}
              </option>
            ))}
          </select>

          {/* Prev/Next Month Controls */}
          <div className="flex items-center rounded-[18px] border border-border/80 bg-card/60 backdrop-blur-xl p-1 shadow-lg">
            <button
              onClick={prevMonth}
              className="rounded-[14px] p-2 hover:bg-muted/60 text-foreground transition-all active:scale-90"
              title="Previous Month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 text-xs font-extrabold w-24 text-center text-foreground font-mono">
              {MONTH_NAMES[month].slice(0, 3)} {year}
            </span>
            <button
              onClick={nextMonth}
              className="rounded-[14px] p-2 hover:bg-muted/60 text-foreground transition-all active:scale-90"
              title="Next Month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Calendar Grid Glass Card */}
      <div className="rounded-[24px] border border-border/80 bg-card/60 dark:border-white/10 dark:bg-[#0C1722]/80 backdrop-blur-2xl p-4 sm:p-6 shadow-2xl space-y-3">
        {/* Weekday Labels */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center border-b border-border/60 pb-2">
          {WEEKDAYS.map((wd) => (
            <div
              key={wd}
              className="py-1 text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground/80"
            >
              {wd}
            </div>
          ))}
        </div>

        {/* Dates Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 pt-1">
          {daysInMonthGrid.map((item, idx) => {
            if (!item) {
              return (
                <div
                  key={`empty-${idx}`}
                  className="h-16 sm:h-24 rounded-[14px] sm:rounded-[18px] bg-muted/5 border border-transparent"
                />
              );
            }

            const { dayNum, dateStr } = item;
            const entry = aggregatedMap.get(dateStr);
            const cals = entry?.calories || 0;
            const mealCount = entry?.meals?.length || entry?.meal_count || 0;
            const waterCount = entry?.water_glasses || LocalStore.getWater(dateStr);
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDateStr;

            const profile = LocalStore.getProfile();
            const targetCal = profile?.daily_calorie_target || 2000;
            const stepCount = entry?.steps || LocalStore.getSteps(dateStr);
            const goalPct = cals > 0 ? Math.round((cals / targetCal) * 100) : 0;

            let statusColor = "red"; // Red: No meals logged
            if (goalPct >= 90 || cals >= targetCal * 0.9) {
              statusColor = "green"; // Green: Goal Achieved
            } else if (cals > 0 || mealCount > 0 || waterCount > 0 || stepCount > 0) {
              statusColor = "yellow"; // Yellow: Partially Completed
            }

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDateStr(dateStr)}
                className={`group relative flex flex-col justify-between rounded-[14px] sm:rounded-[18px] p-1 sm:p-2.5 h-16 sm:h-24 text-left transition-all duration-300 active:scale-95 ${
                  isSelected
                    ? "border-2 border-primary bg-primary/15 shadow-[0_0_25px_rgba(0,229,143,0.3)] scale-[1.02] z-10"
                    : isToday
                      ? "border-2 border-emerald-500/60 bg-emerald-500/10 shadow-[0_0_15px_rgba(0,229,143,0.2)]"
                      : statusColor === "green"
                        ? "border border-emerald-500/40 bg-emerald-500/10 hover:border-emerald-500 hover:-translate-y-0.5"
                        : statusColor === "yellow"
                          ? "border border-amber-500/40 bg-amber-500/10 hover:border-amber-500 hover:-translate-y-0.5"
                          : "border border-rose-500/20 bg-rose-500/5 hover:border-rose-500/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-display text-[10px] sm:text-sm font-extrabold ${
                      isToday
                        ? "inline-flex h-4.5 w-4.5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_10px_#00E58F] text-[9px] sm:text-xs"
                        : "text-foreground"
                    }`}
                  >
                    {dayNum}
                  </span>
                  <span
                    className={`inline-block h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${
                      statusColor === "green"
                        ? "bg-emerald-400 shadow-[0_0_8px_#10B981]"
                        : statusColor === "yellow"
                          ? "bg-amber-400 shadow-[0_0_8px_#F59E0B]"
                          : "bg-rose-500/60"
                    }`}
                  />
                </div>

                <div className="mt-0.5 space-y-0.5 overflow-hidden">
                  {cals > 0 ? (
                    <div className="flex items-center gap-0.5 sm:gap-1 text-[8px] xs:text-[9.5px] sm:text-xs font-bold text-amber-400 truncate">
                      <Flame className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-amber-500 shrink-0" />
                      <span className="tabular-nums truncate">{Math.round(cals)}</span>
                    </div>
                  ) : mealCount > 0 || waterCount > 0 ? (
                    <div className="text-[8px] sm:text-[10px] text-amber-400 font-bold truncate">
                      Log
                    </div>
                  ) : (
                    <div className="text-[8px] sm:text-[10px] text-rose-400/70 font-medium truncate">
                      Empty
                    </div>
                  )}

                  {stepCount > 0 && (
                    <div className="hidden sm:flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-[#00E58F] truncate">
                      <Footprints className="h-2.5 w-2.5 shrink-0" />
                      <span className="tabular-nums truncate font-mono">
                        {stepCount.toLocaleString()} steps
                      </span>
                    </div>
                  )}
                </div>

                {entry && (entry.iron_mg > 0 || entry.calcium_mg > 0 || entry.vit_a_ug > 0) && (
                  <div className="hidden md:flex gap-1 text-[8px] font-extrabold text-teal-400 bg-teal-500/10 px-1 py-0.5 rounded border border-teal-500/20 w-fit">
                    <span>+Micro</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Detailed Nutrition Inspector */}
      <div className="rounded-[24px] border border-border/80 bg-card/60 dark:border-white/10 dark:bg-[#0C1722]/80 backdrop-blur-2xl p-5 sm:p-6 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4 gap-3">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> Date Nutrition Log Record
            </div>
            <h2 className="font-display text-2xl font-extrabold text-foreground tracking-tight">
              {new Date(selectedDateStr + "T00:00:00").toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {selectedData.hasData ? (
              <>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-3.5 py-1.5 text-xs font-bold text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                  <Flame className="h-3.5 w-3.5 text-amber-500" /> {selectedData.totalCals} kcal
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 px-3.5 py-1.5 text-xs font-bold text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                  <Droplet className="h-3.5 w-3.5 text-cyan-400" /> {selectedData.waterG} Glasses
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1.5 text-xs font-bold text-emerald-400 shadow-[0_0_12px_rgba(0,229,143,0.2)]">
                  <Award className="h-3.5 w-3.5 text-emerald-400" /> Score: {selectedData.score}/100
                </span>
              </>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/30 border border-border px-3.5 py-1.5 text-xs font-bold text-muted-foreground">
                No entries recorded for this date
              </span>
            )}
          </div>
        </div>

        {/* Zero state banner if no data */}
        {!selectedData.hasData && (
          <div className="rounded-[20px] border border-dashed border-border/80 bg-card/30 p-5 text-center space-y-1">
            <div className="text-sm font-bold text-foreground">
              Zero values logged for {selectedDateStr}
            </div>
            <p className="text-xs text-muted-foreground">
              No meals or water intake were saved on this calendar date. Historical integrity is
              preserved with zero numbers.
            </p>
          </div>
        )}

        {/* Color-Coded Key Metrics Dashboard */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <ColorStatCard
            label="Calories"
            value={selectedData.totalCals}
            unit="kcal"
            target={selectedData.targets.calories}
            icon={<Flame className="h-4 w-4 text-amber-500" />}
            gradientClass="from-amber-500 to-orange-400"
            borderClass="border-amber-500/30"
            bgClass="bg-amber-500/5"
            textColor="text-amber-400"
          />
          <ColorStatCard
            label="Protein"
            value={selectedData.totalProtein}
            unit="g"
            target={selectedData.targets.protein}
            icon={<Utensils className="h-4 w-4 text-emerald-500" />}
            gradientClass="from-emerald-500 to-green-400"
            borderClass="border-emerald-500/30"
            bgClass="bg-emerald-500/5"
            textColor="text-emerald-400"
          />
          <ColorStatCard
            label="Carbs"
            value={selectedData.totalCarbs}
            unit="g"
            target={220}
            icon={<Award className="h-4 w-4 text-blue-500" />}
            gradientClass="from-blue-500 to-cyan-400"
            borderClass="border-blue-500/30"
            bgClass="bg-blue-500/5"
            textColor="text-blue-400"
          />
          <ColorStatCard
            label="Fat"
            value={selectedData.totalFat}
            unit="g"
            target={65}
            icon={<Sparkles className="h-4 w-4 text-purple-500" />}
            gradientClass="from-purple-500 to-pink-400"
            borderClass="border-purple-500/30"
            bgClass="bg-purple-500/5"
            textColor="text-purple-400"
          />
        </div>

        {/* Micronutrients Grid */}
        <div className="rounded-[22px] border border-teal-500/30 bg-teal-500/5 backdrop-blur-xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="text-xs font-extrabold text-teal-400 uppercase tracking-wider flex items-center gap-2">
              <Zap className="h-4 w-4 text-teal-400 animate-pulse" /> Advanced Vitamins & Minerals
            </div>
            <span className="text-[10px] font-mono font-bold text-teal-400/80 bg-teal-500/10 border border-teal-500/20 px-2.5 py-1 rounded-full">
              Daily Target RDA
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
            <MicroStatBar label="Fiber" value={selectedData.totalFiber} unit="g" target={30} />
            <MicroStatBar label="Sugar" value={selectedData.totalSugar} unit="g" target={38} />
            <MicroStatBar label="Sodium" value={selectedData.totalSodium} unit="mg" target={2300} />
            <MicroStatBar label="Iron" value={selectedData.totalIron} unit="mg" target={18} />
            <MicroStatBar
              label="Calcium"
              value={selectedData.totalCalcium}
              unit="mg"
              target={1000}
            />
            <MicroStatBar
              label="Magnesium"
              value={selectedData.totalMagnesium}
              unit="mg"
              target={400}
            />
            <MicroStatBar
              label="Potassium"
              value={selectedData.totalPotassium}
              unit="mg"
              target={3500}
            />
            <MicroStatBar label="Vit A" value={selectedData.totalVitA} unit="µg" target={900} />
            <MicroStatBar label="Vit B12" value={selectedData.totalVitB12} unit="µg" target={2.4} />
            <MicroStatBar label="Vit D" value={selectedData.totalVitD} unit="µg" target={20} />
            <MicroStatBar label="Omega 3" value={selectedData.totalOmega3} unit="g" target={1.6} />
          </div>
        </div>

        {/* Logged Meals List Section */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-extrabold text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Logged Meals & Scans for {selectedDateStr}
            </div>
            <span className="text-xs font-mono font-bold text-muted-foreground bg-muted/40 border border-border/60 px-2.5 py-0.5 rounded-full">
              {selectedData.meals.length} Logged
            </span>
          </div>

          {selectedData.meals.length === 0 ? (
            <div className="rounded-[22px] border border-dashed border-border/80 bg-card/40 p-8 text-center text-xs text-muted-foreground shadow-inner space-y-2">
              <Utensils className="h-8 w-8 text-muted-foreground/40 mx-auto" />
              <div className="font-bold text-foreground">0 meals logged on this date</div>
              <p className="text-[11px]">You did not record any meals for this calendar date.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedData.meals.map((m, i) => (
                <div
                  key={m.id || `m-${i}`}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[20px] border border-border/80 bg-card/60 backdrop-blur-xl p-4 shadow-lg hover:border-primary/50 hover:bg-card hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-foreground group-hover:text-primary transition-colors">
                        {m.name}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md">
                        {m.source || "manual"}
                      </span>
                    </div>

                    <div className="text-xs text-muted-foreground font-medium flex flex-wrap items-center gap-2">
                      <span className="text-rose-400 font-semibold">P: {m.protein_g}g</span>
                      <span>•</span>
                      <span className="text-amber-400 font-semibold">C: {m.carbs_g}g</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">F: {m.fat_g}g</span>
                      {Boolean(m.fiber_g) && (
                        <>
                          <span>•</span>
                          <span className="text-teal-400 font-semibold">Fiber: {m.fiber_g}g</span>
                        </>
                      )}
                    </div>

                    {(m.iron_mg || m.calcium_mg || m.magnesium_mg || m.potassium_mg) && (
                      <div className="mt-1.5 flex flex-wrap gap-1.5 text-[10px] font-bold">
                        {Boolean(m.iron_mg) && (
                          <span className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-amber-400">
                            Iron: {m.iron_mg}mg
                          </span>
                        )}
                        {Boolean(m.calcium_mg) && (
                          <span className="rounded-lg bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-blue-400">
                            Calcium: {m.calcium_mg}mg
                          </span>
                        )}
                        {Boolean(m.magnesium_mg) && (
                          <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-emerald-400">
                            Magnesium: {m.magnesium_mg}mg
                          </span>
                        )}
                        {Boolean(m.potassium_mg) && (
                          <span className="rounded-lg bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-purple-400">
                            Potassium: {m.potassium_mg}mg
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="text-right font-display text-lg font-extrabold text-amber-400 tabular-nums shrink-0">
                    {Math.round(Number(m.calories))}{" "}
                    <span className="text-xs font-normal text-muted-foreground font-mono">
                      kcal
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ColorStatCard({
  label,
  value,
  unit,
  target,
  icon,
  gradientClass,
  borderClass,
  bgClass,
  textColor,
}: {
  label: string;
  value: number;
  unit: string;
  target: number;
  icon: React.ReactNode;
  gradientClass: string;
  borderClass: string;
  bgClass: string;
  textColor: string;
}) {
  const percent = Math.min(100, Math.round((value / target) * 100));

  return (
    <div
      className={`rounded-[20px] border ${borderClass} ${bgClass} backdrop-blur-xl p-4 shadow-xl flex flex-col justify-between hover:-translate-y-1 transition-all duration-300`}
    >
      <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
        <span>{label}</span>
        {icon}
      </div>
      <div className={`mt-2 font-display text-2xl font-extrabold ${textColor} tabular-nums`}>
        {value} <span className="text-xs font-normal text-muted-foreground font-mono">{unit}</span>
      </div>
      <div className="mt-3 space-y-1">
        <div className="h-1.5 w-full rounded-full bg-black/40 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${gradientClass} transition-all duration-500`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="text-[9px] text-muted-foreground/80 font-mono text-right">
          {percent}% of {target}
          {unit}
        </div>
      </div>
    </div>
  );
}

function MicroStatBar({
  label,
  value,
  unit,
  target,
}: {
  label: string;
  value: number;
  unit: string;
  target: number;
}) {
  const percent = Math.min(100, Math.round((value / target) * 100));

  return (
    <div className="rounded-[18px] border border-border/80 bg-card/80 p-3 space-y-2 min-w-0 overflow-hidden">
      <div className="flex items-center justify-between gap-1 text-[11px] font-bold text-muted-foreground min-w-0 leading-tight">
        <span className="truncate uppercase tracking-tight text-foreground/90 font-black">
          {label}
        </span>
        <span className="font-mono text-teal-400 shrink-0 text-[10px] whitespace-nowrap font-bold">
          {value.toFixed(1)} <span className="text-[9px] uppercase">{unit}</span>
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-black/40 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="text-[9px] text-muted-foreground/70 font-mono flex items-center justify-between">
        <span className="whitespace-nowrap">
          Target: {target}
          {unit}
        </span>
        <span className="font-bold">{percent}%</span>
      </div>
    </div>
  );
}
