import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const MealInput = z.object({
  name: z.string().min(1).max(120),
  source: z.enum(["photo", "manual", "barcode"]).default("manual"),
  confidence: z.number().min(0).max(1).nullable().optional(),
  serving_desc: z.string().max(120).optional().nullable(),
  calories: z.number().min(0).max(10000),
  protein_g: z.number().min(0).max(1000).default(0),
  carbs_g: z.number().min(0).max(1000).default(0),
  fat_g: z.number().min(0).max(1000).default(0),
  fiber_g: z.number().min(0).max(500).default(0),
  sugar_g: z.number().min(0).max(1000).default(0),
  sodium_mg: z.number().min(0).max(20000).default(0),
  iron_mg: z.number().min(0).default(0),
  calcium_mg: z.number().min(0).default(0),
  magnesium_mg: z.number().min(0).default(0),
  potassium_mg: z.number().min(0).default(0),
  vit_a_ug: z.number().min(0).default(0),
  vit_b12_ug: z.number().min(0).default(0),
  vit_d_ug: z.number().min(0).default(0),
  omega3_g: z.number().min(0).default(0),
  raw_model_response: z.any().optional().nullable(),
  eaten_at: z.string().datetime().optional(),
  eaten_on: z.string().optional(),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function syncDailyRollup(supabase: any, userId: string, day: string) {
  try {
    const { data: meals } = await supabase
      .from("meals")
      .select("id, calories, protein_g, carbs_g, fat_g, fiber_g, sugar_g, sodium_mg")
      .eq("user_id", userId)
      .eq("eaten_on", day);

    const mealList = meals ?? [];
    if (mealList.length === 0) {
      await supabase.from("daily_rollup").upsert({
        user_id: userId,
        day,
        calories: 0,
        protein_g: 0,
        carbs_g: 0,
        fat_g: 0,
        fiber_g: 0,
        sugar_g: 0,
        sodium_mg: 0,
        iron_mg: 0,
        calcium_mg: 0,
        magnesium_mg: 0,
        potassium_mg: 0,
        vit_a_ug: 0,
        vit_b12_ug: 0,
        vit_d_ug: 0,
        omega3_g: 0,
        meal_count: 0,
        score: 0,
        updated_at: new Date().toISOString(),
      });
      return;
    }

    const mealIds = mealList.map((m: { id: string }) => m.id);
    const { data: micros } = await supabase.from("meal_micros").select("*").in("meal_id", mealIds);

    const microMap = new Map<string, Record<string, unknown>>();
    for (const mic of (micros as Array<Record<string, unknown>>) ?? []) {
      microMap.set(mic.meal_id as string, mic);
    }

    let cals = 0,
      pro = 0,
      carb = 0,
      fat = 0,
      fib = 0,
      sug = 0,
      sod = 0;
    let iron = 0,
      calc = 0,
      mag = 0,
      pot = 0,
      vitA = 0,
      vitB12 = 0,
      vitD = 0,
      o3 = 0;

    for (const m of mealList) {
      cals += Number(m.calories || 0);
      pro += Number(m.protein_g || 0);
      carb += Number(m.carbs_g || 0);
      fat += Number(m.fat_g || 0);
      fib += Number(m.fiber_g || 0);
      sug += Number(m.sugar_g || 0);
      sod += Number(m.sodium_mg || 0);

      const mic = microMap.get(m.id);
      if (mic) {
        iron += Number(mic.iron_mg || 0);
        calc += Number(mic.calcium_mg || 0);
        mag += Number(mic.magnesium_mg || 0);
        pot += Number(mic.potassium_mg || 0);
        vitA += Number(mic.vit_a_ug || 0);
        vitB12 += Number(mic.vit_b12_ug || 0);
        vitD += Number(mic.vit_d_ug || 0);
        o3 += Number(mic.omega3_g || 0);
      }
    }

    const score = Math.min(
      100,
      Math.round(
        (cals > 0 ? 40 : 0) +
          Math.min(30, (pro / 100) * 30) +
          Math.min(15, (fib / 25) * 15) +
          Math.min(15, iron + calc + mag + pot > 0 ? 15 : 0),
      ),
    );

    await supabase.from("daily_rollup").upsert({
      user_id: userId,
      day,
      calories: Math.round(cals),
      protein_g: Math.round(pro),
      carbs_g: Math.round(carb),
      fat_g: Math.round(fat),
      fiber_g: Math.round(fib),
      sugar_g: Math.round(sug),
      sodium_mg: Math.round(sod),
      iron_mg: Number(iron.toFixed(1)),
      calcium_mg: Number(calc.toFixed(1)),
      magnesium_mg: Number(mag.toFixed(1)),
      potassium_mg: Number(pot.toFixed(1)),
      vit_a_ug: Number(vitA.toFixed(1)),
      vit_b12_ug: Number(vitB12.toFixed(1)),
      vit_d_ug: Number(vitD.toFixed(1)),
      omega3_g: Number(o3.toFixed(1)),
      meal_count: mealList.length,
      score,
      updated_at: new Date().toISOString(),
    });
  } catch (e) {
    console.warn("[syncDailyRollup] error:", e);
  }
}

export const logMeal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => MealInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const eatenAt = data.eaten_at ?? new Date().toISOString();
    const eatenOn = data.eaten_on ?? eatenAt.slice(0, 10);
    try {
      const { data: meal, error } = await supabase
        .from("meals")
        .insert({
          user_id: userId,
          name: data.name,
          source: data.source,
          confidence: data.confidence ?? null,
          serving_desc: data.serving_desc ?? null,
          calories: data.calories,
          protein_g: data.protein_g,
          carbs_g: data.carbs_g,
          fat_g: data.fat_g,
          fiber_g: data.fiber_g,
          sugar_g: data.sugar_g,
          sodium_mg: data.sodium_mg,
          raw_model_response: data.raw_model_response ?? null,
          eaten_at: eatenAt,
          eaten_on: eatenOn,
        })
        .select("id")
        .single();
      if (
        error &&
        (error.message.includes("schema cache") ||
          error.message.includes("relation") ||
          error.code === "42P01")
      ) {
        return { id: `local-${Date.now()}`, localFallback: true };
      }
      if (error) {
        console.warn("[logMeal] insert note:", error.message);
        return { id: `local-${Date.now()}`, localFallback: true };
      }

      const hasMicros =
        data.iron_mg ||
        data.calcium_mg ||
        data.magnesium_mg ||
        data.potassium_mg ||
        data.vit_a_ug ||
        data.vit_b12_ug ||
        data.vit_d_ug ||
        data.omega3_g;
      if (hasMicros) {
        try {
          await supabase.from("meal_micros").insert({
            meal_id: meal.id,
            user_id: userId,
            iron_mg: data.iron_mg,
            calcium_mg: data.calcium_mg,
            magnesium_mg: data.magnesium_mg,
            potassium_mg: data.potassium_mg,
            vit_a_ug: data.vit_a_ug,
            vit_b12_ug: data.vit_b12_ug,
            vit_d_ug: data.vit_d_ug,
            omega3_g: data.omega3_g,
          });
        } catch {
          // ignore micros error
        }
      }

      await syncDailyRollup(supabase, userId, eatenOn);
      return { id: meal.id, localFallback: false };
    } catch {
      return { id: `local-${Date.now()}`, localFallback: true };
    }
  });

export const deleteMeal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ id: z.string().uuid().or(z.string()) }).parse(d))
  .handler(async ({ data, context }) => {
    try {
      if (data.id.startsWith("local-")) return { ok: true, localFallback: true };
      const { data: targetMeal } = await context.supabase
        .from("meals")
        .select("eaten_on")
        .eq("id", data.id)
        .maybeSingle();

      const { error } = await context.supabase.from("meals").delete().eq("id", data.id);
      if (error) return { ok: true, localFallback: true };

      if (targetMeal?.eaten_on) {
        await syncDailyRollup(context.supabase, context.userId, targetMeal.eaten_on);
      }
      return { ok: true, localFallback: false };
    } catch {
      return { ok: true, localFallback: true };
    }
  });

export const listMealsOnDay = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ day: z.string() }).parse(d))
  .handler(async ({ data, context }) => {
    try {
      const { data: meals, error } = await context.supabase
        .from("meals")
        .select(
          "id,name,eaten_at,eaten_on,source,confidence,serving_desc,calories,protein_g,carbs_g,fat_g,fiber_g,sugar_g,sodium_mg,meal_micros(*)",
        )
        .eq("eaten_on", data.day)
        .order("eaten_at", { ascending: true });
      if (error) {
        return { meals: [], localFallback: true };
      }
      return { meals: meals ?? [], localFallback: false };
    } catch {
      return { meals: [], localFallback: true };
    }
  });
