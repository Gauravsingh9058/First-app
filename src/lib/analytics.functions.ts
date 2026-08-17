import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { RDA, DEFICIENCY_CUTOFF } from "./nutrition";

export const getToday = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ day: z.string().optional() }).optional().parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const day = data?.day || new Date().toISOString().slice(0, 10);
    try {
      const [{ data: rollup }, { data: profile }, { data: meals }] = await Promise.all([
        supabase
          .from("daily_rollup")
          .select("*")
          .eq("user_id", userId)
          .eq("day", day)
          .maybeSingle(),
        supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
        supabase
          .from("meals")
          .select("id,name,eaten_at,calories,protein_g,carbs_g,fat_g")
          .eq("user_id", userId)
          .eq("eaten_on", day)
          .order("eaten_at", { ascending: false }),
      ]);
      return {
        day,
        rollup: rollup ?? null,
        profile: profile ?? null,
        meals: meals ?? [],
        localFallback: false,
      };
    } catch {
      return {
        day,
        rollup: null,
        profile: null,
        meals: [],
        localFallback: true,
      };
    }
  });

export const getMacroTrend = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ days: z.number().int().min(7).max(90).default(30) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const start = new Date();
    start.setUTCDate(start.getUTCDate() - data.days + 1);
    const since = start.toISOString().slice(0, 10);
    try {
      const { data: rows, error } = await context.supabase
        .from("daily_rollup")
        .select("day,calories,protein_g,carbs_g,fat_g,fiber_g,score")
        .eq("user_id", context.userId)
        .gte("day", since)
        .order("day", { ascending: true });
      if (error) return [];
      return rows ?? [];
    } catch {
      return [];
    }
  });

export const getMicroTrend = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ days: z.number().int().min(7).max(90).default(30) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const start = new Date();
    start.setUTCDate(start.getUTCDate() - data.days + 1);
    const since = start.toISOString().slice(0, 10);
    try {
      const { data: rows, error } = await context.supabase
        .from("daily_rollup")
        .select(
          "day,iron_mg,calcium_mg,magnesium_mg,potassium_mg,vit_a_ug,vit_b12_ug,vit_d_ug,omega3_g,meal_count",
        )
        .eq("user_id", context.userId)
        .gte("day", since)
        .order("day", { ascending: true });
      if (error) return { rows: [], deficiencies: [] };

      const rowsArr = rows ?? [];
      const deficiencies = (Object.keys(RDA) as Array<keyof typeof RDA>).map((nut) => {
        const cutoff = RDA[nut] * DEFICIENCY_CUTOFF;
        const loggedDays = rowsArr.filter((r) => (r.meal_count ?? 0) > 0);
        const lowDays = loggedDays.filter(
          (r) => Number((r as Record<string, unknown>)[nut] ?? 0) < cutoff,
        );
        return {
          nutrient: nut,
          lowDays: lowDays.length,
          totalDays: loggedDays.length,
        };
      });

      return { rows: rowsArr, deficiencies };
    } catch {
      return { rows: [], deficiencies: [] };
    }
  });

export const getCalendarRange = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ days: z.number().int().min(1).max(3650).default(365) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const start = new Date();
    start.setUTCDate(start.getUTCDate() - data.days + 1);
    const since = start.toISOString().slice(0, 10);
    try {
      const { data: rows, error } = await context.supabase
        .from("daily_rollup")
        .select("*")
        .eq("user_id", context.userId)
        .gte("day", since)
        .order("day", { ascending: true });
      if (error) return [];
      return rows ?? [];
    } catch {
      return [];
    }
  });

export const getDay = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ day: z.string() }).parse(d))
  .handler(async ({ data, context }) => {
    try {
      const [{ data: rollup }, { data: meals }, { data: profile }] = await Promise.all([
        context.supabase
          .from("daily_rollup")
          .select("*")
          .eq("user_id", context.userId)
          .eq("day", data.day)
          .maybeSingle(),
        context.supabase
          .from("meals")
          .select("*, meal_micros(*)")
          .eq("user_id", context.userId)
          .eq("eaten_on", data.day)
          .order("eaten_at", { ascending: true }),
        context.supabase
          .from("profiles")
          .select("daily_calorie_target, protein_target_g, water_target_glasses")
          .eq("user_id", context.userId)
          .maybeSingle(),
      ]);
      return {
        day: data.day,
        rollup: rollup ?? null,
        meals: meals ?? [],
        profile: profile ?? null,
      };
    } catch {
      return { day: data.day, rollup: null, meals: [], profile: null };
    }
  });

export const getWeightTrend = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ days: z.number().int().min(7).max(365).default(60) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const start = new Date();
    start.setUTCDate(start.getUTCDate() - data.days + 1);
    const since = start.toISOString().slice(0, 10);
    try {
      const { data: rows, error } = await context.supabase
        .from("weights")
        .select("day,weight_kg")
        .eq("user_id", context.userId)
        .gte("day", since)
        .order("day", { ascending: true });
      if (error) return [];
      return rows ?? [];
    } catch {
      return [];
    }
  });
