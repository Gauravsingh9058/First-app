import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type CalorieStatus = "no_data" | "under" | "on_target" | "slightly_over" | "over";
type HeatColor = "grey" | "red" | "yellow" | "green";

function calorieStatus(value: number, target: number): CalorieStatus {
  if (value <= 0) return "no_data";
  const pct = value / target;
  if (pct < 0.85) return "under";
  if (pct <= 1.05) return "on_target";
  if (pct <= 1.15) return "slightly_over";
  return "over";
}

function monthName(m: number): string {
  return [
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
  ][m];
}

/**
 * Premium analytics payload for the dashboard:
 *  - 30-day calorie trend (with per-day status vs target)
 *  - 30-day macro distribution (protein/carbs/fat in g, math-aligned with calories: 4/4/9 kcal/g)
 *  - 120-day consistency heatmap with pre-formatted tooltip strings
 */
export const getDashboardPayload = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const today = new Date();
    const start120 = new Date(today);
    start120.setUTCDate(today.getUTCDate() - 119);
    const since120 = start120.toISOString().slice(0, 10);

    let profile: Record<string, unknown> | null = null;
    let rollups: Array<Record<string, unknown>> = [];
    try {
      const [res1, res2] = await Promise.all([
        supabase
          .from("profiles")
          .select("daily_calorie_target,protein_target_g")
          .eq("user_id", userId)
          .maybeSingle(),
        supabase
          .from("daily_rollup")
          .select("day,calories,protein_g,carbs_g,fat_g,meal_count,score")
          .eq("user_id", userId)
          .gte("day", since120)
          .order("day", { ascending: true }),
      ]);
      profile = res1.data;
      rollups = res2.data ?? [];
    } catch {
      // Ignore database schema missing errors
    }

    const calorieTarget = Number(profile?.daily_calorie_target ?? 2000);
    const proteinTarget = Number(profile?.protein_target_g ?? 120);
    // Derive carb/fat targets from typical macro split (50% carbs, 30% fat) when not stored.
    const carbTarget = Math.round((calorieTarget * 0.5) / 4);
    const fatTarget = Math.round((calorieTarget * 0.3) / 9);

    const byDay = new Map<
      string,
      {
        calories: number;
        protein_g: number;
        carbs_g: number;
        fat_g: number;
        meal_count: number;
        score: number;
      }
    >();
    for (const r of rollups ?? []) {
      byDay.set(r.day as string, {
        calories: Number(r.calories ?? 0),
        protein_g: Number(r.protein_g ?? 0),
        carbs_g: Number(r.carbs_g ?? 0),
        fat_g: Number(r.fat_g ?? 0),
        meal_count: Number(r.meal_count ?? 0),
        score: Number(r.score ?? 0),
      });
    }

    // Build 120-day continuous series
    const days: { date: string; d: Date }[] = [];
    for (let i = 119; i >= 0; i--) {
      const d = new Date(today);
      d.setUTCDate(today.getUTCDate() - i);
      days.push({ date: d.toISOString().slice(0, 10), d });
    }

    // 30-day window (tail of 120)
    const window30 = days.slice(-30);

    const calorieSeries = window30.map(({ date }) => {
      const row = byDay.get(date);
      const value = Math.round(row?.calories ?? 0);
      return { date, value, status: calorieStatus(value, calorieTarget) };
    });

    // Macros — aligned to calories using 4/4/9 kcal/g.
    const macroSeries = window30.map(({ date }) => {
      const row = byDay.get(date);
      return {
        date,
        protein_g: Math.round(row?.protein_g ?? 0),
        carbs_g: Math.round(row?.carbs_g ?? 0),
        fat_g: Math.round(row?.fat_g ?? 0),
      };
    });

    // 120-day heatmap, colored by consistency (target adherence), not raw volume.
    const heatmap = days.map(({ date, d }) => {
      const row = byDay.get(date);
      if (!row || row.meal_count === 0) {
        return {
          date,
          color_code: "grey" as HeatColor,
          tooltip_summary: `${monthName(d.getUTCMonth())} ${d.getUTCDate()}: No data`,
        };
      }
      const calPct = row.calories / calorieTarget;
      const proPct = row.protein_g / proteinTarget;
      const carbPct = row.carbs_g / carbTarget;
      const fatPct = row.fat_g / fatTarget;

      const calOk = calPct >= 0.9 && calPct <= 1.1;
      const proOk = proPct >= 0.9;
      const carbOver = carbPct > 1.15;
      const fatOver = fatPct > 1.2;
      const calOver = calPct > 1.15;
      const calUnder = calPct < 0.7;

      let color: HeatColor;
      let detail: string;
      if (calOk && proOk && !carbOver && !fatOver) {
        color = "green";
        detail = "Goal Achieved";
      } else if (calOver) {
        color = carbOver ? "yellow" : "red";
        detail = carbOver ? "Carbs Target Exceeded" : "Calorie Goal Missed";
      } else if (calUnder) {
        color = "red";
        detail = "Calories Well Under Target";
      } else if (!proOk) {
        color = "yellow";
        detail = "Protein Below Target";
      } else if (carbOver) {
        color = "yellow";
        detail = "Carbs Target Exceeded";
      } else if (fatOver) {
        color = "yellow";
        detail = "Fat Target Exceeded";
      } else {
        color = "yellow";
        detail = "Close to Goal";
      }

      const kcalStr = Math.round(row.calories).toLocaleString("en-US");
      return {
        date,
        color_code: color,
        tooltip_summary: `${monthName(d.getUTCMonth())} ${d.getUTCDate()}: ${kcalStr} kcal | ${detail}`,
      };
    });

    return {
      analytics: {
        time_frame: "last_30_days" as const,
        calorie_target_kcal: calorieTarget,
        charts: {
          calories: {
            title: "Calories — last 30 days",
            y_axis_label: "kcal",
            data_points: calorieSeries,
          },
          macros: {
            title: "Macros — protein, carbs, fat",
            legend: { protein: "Red", carbs: "Yellow", fat: "Olive" },
            data_points: macroSeries,
          },
        },
      },
      calendar_heatmap: {
        title: "Your last 120 days",
        legend_meaning: {
          grey: "No Data",
          red: "Missed Goal",
          yellow: "Close to Goal",
          green: "Goal Achieved",
        },
        days: heatmap,
      },
    };
  });
