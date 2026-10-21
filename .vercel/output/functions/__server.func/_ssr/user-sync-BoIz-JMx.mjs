import { t as supabase } from "./client-gnngM_Y9.mjs";
import { a as LocalStore } from "./router-BBaCA5Zn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/user-sync-BoIz-JMx.js
/**
* Synchronizes a user's entire dataset (profile, meals, water, weights, steps)
* from Supabase tables into account-scoped local memory/localStorage so that every login/re-login
* seamlessly restores user state from where they left off before logout.
*/
async function syncUserDataFromSupabase(userId) {
	if (!userId) return null;
	try {
		LocalStore.setAccount(userId);
		const { data: dbProfile } = await supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle();
		let updatedProfile = null;
		if (dbProfile) {
			const { data: flags } = await supabase.from("user_medical_flags").select("flag").eq("user_id", userId);
			const healthFlags = (flags || []).map((f) => f.flag);
			const existingLocal = LocalStore.getProfile();
			const extendedData = dbProfile.extended_data && typeof dbProfile.extended_data === "object" ? dbProfile.extended_data : existingLocal?.extended_data || {};
			updatedProfile = {
				user_id: userId,
				display_name: dbProfile.display_name || existingLocal?.display_name || "Nutri User",
				phone_number: existingLocal?.phone_number || "",
				mobile_verified: true,
				gender: dbProfile.gender || existingLocal?.gender || "male",
				age: dbProfile.age ?? existingLocal?.age ?? 25,
				height_cm: dbProfile.height_cm ? Number(dbProfile.height_cm) : existingLocal?.height_cm ?? 175,
				weight_kg: dbProfile.weight_kg ? Number(dbProfile.weight_kg) : existingLocal?.weight_kg ?? 70,
				goal_weight_kg: dbProfile.goal_weight_kg ? Number(dbProfile.goal_weight_kg) : existingLocal?.goal_weight_kg ?? 68,
				activity: dbProfile.activity || existingLocal?.activity || "moderate",
				goal: dbProfile.goal || existingLocal?.goal || "fat_loss",
				diet: dbProfile.diet || existingLocal?.diet || "non_veg",
				daily_calorie_target: dbProfile.daily_calorie_target ?? existingLocal?.daily_calorie_target ?? 2e3,
				protein_target_g: dbProfile.protein_target_g ?? existingLocal?.protein_target_g ?? 120,
				water_target_glasses: dbProfile.water_target_glasses ?? existingLocal?.water_target_glasses ?? 8,
				water_goal_l: dbProfile.water_goal_l ? Number(dbProfile.water_goal_l) : existingLocal?.water_goal_l ?? 3.5,
				onboarded: Boolean(dbProfile.onboarded),
				extended_data: {
					...extendedData,
					health_flags: healthFlags.length > 0 ? healthFlags : extendedData.health_flags || []
				}
			};
			LocalStore.saveProfile(updatedProfile);
		}
		const { data: dbMeals } = await supabase.from("meals").select("*, meal_micros(*)").eq("user_id", userId).order("eaten_at", { ascending: false }).limit(500);
		if (dbMeals && dbMeals.length > 0) {
			const formattedMeals = dbMeals.map((m) => {
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
					calories: Number(m.calories || 0),
					protein_g: Number(m.protein_g || 0),
					carbs_g: Number(m.carbs_g || 0),
					fat_g: Number(m.fat_g || 0),
					fiber_g: Number(m.fiber_g || 0),
					sugar_g: Number(m.sugar_g || 0),
					sodium_mg: Number(m.sodium_mg || 0),
					iron_mg: Number(micros?.iron_mg || 0),
					calcium_mg: Number(micros?.calcium_mg || 0),
					magnesium_mg: Number(micros?.magnesium_mg || 0),
					potassium_mg: Number(micros?.potassium_mg || 0),
					vit_a_ug: Number(micros?.vit_a_ug || 0),
					vit_b12_ug: Number(micros?.vit_b12_ug || 0),
					vit_d_ug: Number(micros?.vit_d_ug || 0),
					omega3_g: Number(micros?.omega3_g || 0)
				};
			});
			LocalStore.setMeals(formattedMeals);
		}
		const { data: dbWater } = await supabase.from("water_logs").select("day, glasses").eq("user_id", userId);
		if (dbWater && dbWater.length > 0) {
			const dayTotals = {};
			for (const item of dbWater) dayTotals[item.day] = (dayTotals[item.day] || 0) + (item.glasses || 1);
			for (const [day, total] of Object.entries(dayTotals)) LocalStore.setWater(day, total);
		}
		try {
			const { data: dbSteps } = await supabase.from("step_logs").select("day, steps, distance_km, calories_burned, active_minutes").eq("user_id", userId);
			if (dbSteps && dbSteps.length > 0) {
				for (const item of dbSteps) if (item.day && typeof item.steps === "number") LocalStore.saveSteps(item.day, item.steps);
			}
		} catch {}
		return updatedProfile || LocalStore.getProfile();
	} catch (err) {
		console.warn("[syncUserDataFromSupabase] sync note:", err);
		return LocalStore.getProfile();
	}
}
//#endregion
export { syncUserDataFromSupabase as t };
