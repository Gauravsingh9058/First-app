import { supabase } from "@/integrations/supabase/client";
import { LocalStore, LocalProfile, LocalMeal } from "./local-store";

/**
 * Synchronizes a user's entire dataset (profile, meals, water, weights)
 * from Supabase tables into local memory/localStorage so that every login/re-login
 * seamlessly restores user state from where they left off before logout.
 */
export async function syncUserDataFromSupabase(userId: string): Promise<LocalProfile | null> {
  if (!userId) return null;

  try {
    // 1. Fetch User Profile from Supabase
    const { data: dbProfile, error: pErr } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    let updatedProfile: LocalProfile | null = null;

    if (dbProfile) {
      // Fetch user medical flags
      const { data: flags } = await supabase
        .from("user_medical_flags")
        .select("flag")
        .eq("user_id", userId);

      const healthFlags = (flags || []).map((f) => f.flag);

      const existingLocal = LocalStore.getProfile();

      updatedProfile = {
        user_id: userId,
        display_name: dbProfile.display_name || existingLocal?.display_name || "Nutri User",
        phone_number: existingLocal?.phone_number || "",
        mobile_verified: true,
        gender: dbProfile.gender || existingLocal?.gender || "male",
        age: dbProfile.age ?? existingLocal?.age ?? 25,
        height_cm: dbProfile.height_cm ?? existingLocal?.height_cm ?? 175,
        weight_kg: dbProfile.weight_kg ?? existingLocal?.weight_kg ?? 70,
        goal_weight_kg: dbProfile.goal_weight_kg ?? existingLocal?.goal_weight_kg ?? 68,
        activity: dbProfile.activity || existingLocal?.activity || "moderate",
        goal: dbProfile.goal || existingLocal?.goal || "fat_loss",
        diet: dbProfile.diet || existingLocal?.diet || "non_veg",
        daily_calorie_target:
          dbProfile.daily_calorie_target ?? existingLocal?.daily_calorie_target ?? 2000,
        protein_target_g: dbProfile.protein_target_g ?? existingLocal?.protein_target_g ?? 120,
        water_target_glasses:
          dbProfile.water_target_glasses ?? existingLocal?.water_target_glasses ?? 8,
        onboarded: Boolean(dbProfile.onboarded),
        extended_data: {
          ...(existingLocal?.extended_data || {}),
          health_flags:
            healthFlags.length > 0 ? healthFlags : existingLocal?.extended_data?.health_flags || [],
        },
      };

      LocalStore.saveProfile(updatedProfile);
    }

    // 2. Fetch User Meals from Supabase
    const { data: dbMeals } = await supabase
      .from("meals")
      .select("*, meal_micros(*)")
      .eq("user_id", userId)
      .order("eaten_at", { ascending: false })
      .limit(300);

    if (dbMeals && dbMeals.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formattedMeals: LocalMeal[] = dbMeals.map((m: any) => {
        const micros = Array.isArray(m.meal_micros) ? m.meal_micros[0] : m.meal_micros;
        return {
          id: m.id,
          user_id: userId,
          eaten_at: m.eaten_at,
          eaten_on: m.eaten_on || m.eaten_at.slice(0, 10),
          name: m.name,
          source: m.source || "manual",
          confidence: m.confidence,
          serving_desc: m.serving_desc,
          calories: m.calories || 0,
          protein_g: m.protein_g || 0,
          carbs_g: m.carbs_g || 0,
          fat_g: m.fat_g || 0,
          fiber_g: m.fiber_g || 0,
          sugar_g: m.sugar_g || 0,
          sodium_mg: m.sodium_mg || 0,
          iron_mg: micros?.iron_mg || 0,
          calcium_mg: micros?.calcium_mg || 0,
          magnesium_mg: micros?.magnesium_mg || 0,
          potassium_mg: micros?.potassium_mg || 0,
          vit_a_ug: micros?.vit_a_ug || 0,
          vit_b12_ug: micros?.vit_b12_ug || 0,
          vit_d_ug: micros?.vit_d_ug || 0,
          omega3_g: micros?.omega3_g || 0,
        };
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("nutrilens_local_meals_v3", JSON.stringify(formattedMeals));
      }
    }

    // 3. Fetch User Water Logs from Supabase
    const { data: dbWater } = await supabase
      .from("water_logs")
      .select("day, glasses")
      .eq("user_id", userId);

    if (dbWater && dbWater.length > 0) {
      const dayTotals: Record<string, number> = {};
      for (const item of dbWater) {
        dayTotals[item.day] = (dayTotals[item.day] || 0) + (item.glasses || 1);
      }
      for (const [day, total] of Object.entries(dayTotals)) {
        if (typeof window !== "undefined") {
          localStorage.setItem(`nutrilens_local_water_v3_${day}`, String(total));
        }
      }
    }

    return updatedProfile || LocalStore.getProfile();
  } catch (err) {
    console.warn("[syncUserDataFromSupabase] sync note:", err);
    return LocalStore.getProfile();
  }
}
