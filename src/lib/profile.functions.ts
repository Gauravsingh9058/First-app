import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { getLocalDateString } from "./date-utils";
import { Database } from "@/integrations/supabase/types";
import { z } from "zod";

export const getProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    try {
      const { data: profile, error: pErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      if (
        pErr &&
        (pErr.message.includes("schema cache") ||
          pErr.message.includes("relation") ||
          pErr.code === "42P01")
      ) {
        return { profile: null, flags: [], localFallback: true };
      }
      const { data: flags } = await supabase
        .from("user_medical_flags")
        .select("flag")
        .eq("user_id", userId);
      return {
        profile: profile ?? null,
        flags: (flags ?? []).map((f) => f.flag) as string[],
        localFallback: false,
      };
    } catch {
      return { profile: null, flags: [], localFallback: true };
    }
  });

const OnboardInput = z.object({
  display_name: z.string().min(1).max(60),
  gender: z.string().max(20).optional().nullable(),
  age: z.number().int().min(13).max(120),
  height_cm: z.number().min(80).max(260),
  weight_kg: z.number().min(25).max(400),
  goal_weight_kg: z.number().min(25).max(400),
  activity: z.enum(["sedentary", "light", "moderate", "active", "very_active"]),
  goal: z.enum(["fat_loss", "lean_bulk", "muscle_gain", "maintenance", "recomp"]),
  diet: z.enum(["vegetarian", "vegan", "non_veg", "jain", "keto", "high_protein"]),
  flags: z.array(z.string()).default([]),
  extended_data: z.any().optional(),
});

export const saveOnboarding = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => OnboardInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    // Mifflin-St Jeor BMR
    const isMale = (data.gender ?? "").toLowerCase().startsWith("m");
    const bmr = Math.round(
      10 * data.weight_kg + 6.25 * data.height_cm - 5 * data.age + (isMale ? 5 : -161),
    );
    const actMult: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };
    const tdee = Math.round(bmr * (actMult[data.activity] || 1.55));
    const goalAdj: Record<string, number> = {
      fat_loss: -400,
      lean_bulk: 250,
      muscle_gain: 350,
      maintenance: 0,
      recomp: -150,
    };
    const calorieTarget = Math.round(tdee + (goalAdj[data.goal] || 0));
    const proteinTarget = Math.round(
      data.weight_kg * (data.goal === "muscle_gain" || data.goal === "lean_bulk" ? 2.0 : 1.6),
    );

    const extendedData =
      data.extended_data && typeof data.extended_data === "object" ? data.extended_data : {};

    const waterGoalL =
      typeof (extendedData as Record<string, unknown>)?.water_goal_l === "number"
        ? Number((extendedData as Record<string, unknown>).water_goal_l)
        : 3.5;

    try {
      const { error } = await supabase.from("profiles").upsert(
        {
          user_id: userId,
          display_name: data.display_name,
          gender: data.gender ?? null,
          age: data.age,
          height_cm: data.height_cm,
          weight_kg: data.weight_kg,
          goal_weight_kg: data.goal_weight_kg,
          activity: data.activity,
          goal: data.goal,
          diet: data.diet,
          daily_calorie_target: calorieTarget,
          protein_target_g: proteinTarget,
          water_target_glasses: 8,
          water_goal_l: waterGoalL,
          extended_data: extendedData,
          onboarded: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );

      if (
        error &&
        (error.message.includes("schema cache") ||
          error.message.includes("relation") ||
          error.code === "42P01")
      ) {
        return { ok: true, calorieTarget, proteinTarget, bmr, tdee, localFallback: true };
      }
      if (error) {
        console.warn("[saveOnboarding] profile upsert note:", error.message);
      }

      // Replace medical flags if table exists
      try {
        await supabase.from("user_medical_flags").delete().eq("user_id", userId);
        if (data.flags.length > 0) {
          const allowedFlags = [
            "diabetes",
            "pcos",
            "hypertension",
            "fatty_liver",
            "kidney_disease",
            "food_allergy",
          ] as const;
          type MedicalFlag = (typeof allowedFlags)[number];
          const validFlags = data.flags.filter((f): f is MedicalFlag =>
            allowedFlags.includes(f as MedicalFlag),
          );
          if (validFlags.length > 0) {
            await supabase
              .from("user_medical_flags")
              .insert(validFlags.map((flag) => ({ user_id: userId, flag })));
          }
        }
      } catch {
        // ignore medical flag table error
      }
      return { ok: true, calorieTarget, proteinTarget, bmr, tdee, localFallback: false };
    } catch {
      return { ok: true, calorieTarget, proteinTarget, bmr, tdee, localFallback: true };
    }
  });

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        water_goal_l: z.number().optional(),
        water_target_glasses: z.number().optional(),
        daily_calorie_target: z.number().optional(),
        protein_target_g: z.number().optional(),
        extended_data: z.any().optional(),
        display_name: z.string().optional(),
        weight_kg: z.number().optional(),
        goal_weight_kg: z.number().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    try {
      const updates: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };
      if (data.water_goal_l !== undefined) updates.water_goal_l = data.water_goal_l;
      if (data.water_target_glasses !== undefined)
        updates.water_target_glasses = data.water_target_glasses;
      if (data.daily_calorie_target !== undefined)
        updates.daily_calorie_target = data.daily_calorie_target;
      if (data.protein_target_g !== undefined) updates.protein_target_g = data.protein_target_g;
      if (data.extended_data !== undefined) updates.extended_data = data.extended_data;
      if (data.display_name !== undefined) updates.display_name = data.display_name;
      if (data.weight_kg !== undefined) updates.weight_kg = data.weight_kg;
      if (data.goal_weight_kg !== undefined) updates.goal_weight_kg = data.goal_weight_kg;

      if (Object.keys(updates).length > 0) {
        await supabase
          .from("profiles")
          .update(updates as Database["public"]["Tables"]["profiles"]["Update"])
          .eq("user_id", userId);
      }
      return { ok: true };
    } catch {
      return { ok: true, localFallback: true };
    }
  });

export const addWater = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({ glasses: z.number().min(-50).max(100).default(1), day: z.string().optional() })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const day = data.day || getLocalDateString();
    try {
      const { error } = await context.supabase
        .from("water_logs")
        .insert({ user_id: context.userId, glasses: data.glasses, day });
      if (error) {
        return { ok: true, localFallback: true };
      }
      return { ok: true, localFallback: false };
    } catch {
      return { ok: true, localFallback: true };
    }
  });

export const logWeight = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({ weight_kg: z.number().min(25).max(400), day: z.string().optional() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const day = data.day || getLocalDateString();
    try {
      await context.supabase
        .from("weights")
        .insert({ user_id: context.userId, weight_kg: data.weight_kg, day });
      await context.supabase
        .from("profiles")
        .update({ weight_kg: data.weight_kg, updated_at: new Date().toISOString() })
        .eq("user_id", context.userId);
      return { ok: true, localFallback: false };
    } catch {
      return { ok: true, localFallback: true };
    }
  });

export const logSteps = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        steps: z.number().int().min(0).max(200000),
        day: z.string().optional(),
        distance_km: z.number().optional(),
        calories_burned: z.number().optional(),
        active_minutes: z.number().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const day = data.day || getLocalDateString();
    try {
      const { error } = await context.supabase.from("step_logs").upsert(
        {
          user_id: context.userId,
          day,
          steps: data.steps,
          distance_km: data.distance_km || 0,
          calories_burned: data.calories_burned || 0,
          active_minutes: data.active_minutes || 0,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,day" },
      );
      if (error) {
        return { ok: true, localFallback: true };
      }
      return { ok: true, localFallback: false };
    } catch {
      return { ok: true, localFallback: true };
    }
  });
