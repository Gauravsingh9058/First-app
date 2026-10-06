import { n as createServerFn } from "./server-BL6TnVUX.mjs";
import { t as createServerRpc } from "./createServerRpc-DQ_Jrc5r.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DFYPc8zw.mjs";
import { a as objectType, i as numberType, n as arrayType, o as stringType, r as enumType, t as anyType } from "../_libs/zod.mjs";
import { t as getLocalDateString } from "./date-utils-CMo_soRo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile.functions-b35Ibpdq.js
var getProfile_createServerFn_handler = createServerRpc({
	id: "9df9652da79c7ccc337ce62c64dcd11f1800a8eb6e0bd13747650358f67fe4e8",
	name: "getProfile",
	filename: "src/lib/profile.functions.ts"
}, (opts) => getProfile.__executeServer(opts));
var getProfile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(getProfile_createServerFn_handler, async ({ context }) => {
	const { supabase, userId } = context;
	try {
		const { data: profile, error: pErr } = await supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle();
		if (pErr && (pErr.message.includes("schema cache") || pErr.message.includes("relation") || pErr.code === "42P01")) return {
			profile: null,
			flags: [],
			localFallback: true
		};
		const { data: flags } = await supabase.from("user_medical_flags").select("flag").eq("user_id", userId);
		return {
			profile: profile ?? null,
			flags: (flags ?? []).map((f) => f.flag),
			localFallback: false
		};
	} catch {
		return {
			profile: null,
			flags: [],
			localFallback: true
		};
	}
});
var OnboardInput = objectType({
	display_name: stringType().min(1).max(60),
	gender: stringType().max(20).optional().nullable(),
	age: numberType().int().min(13).max(120),
	height_cm: numberType().min(80).max(260),
	weight_kg: numberType().min(25).max(400),
	goal_weight_kg: numberType().min(25).max(400),
	activity: enumType([
		"sedentary",
		"light",
		"moderate",
		"active",
		"very_active"
	]),
	goal: enumType([
		"fat_loss",
		"lean_bulk",
		"muscle_gain",
		"maintenance",
		"recomp"
	]),
	diet: enumType([
		"vegetarian",
		"vegan",
		"non_veg",
		"jain",
		"keto",
		"high_protein"
	]),
	flags: arrayType(stringType()).default([]),
	extended_data: anyType().optional()
});
var saveOnboarding_createServerFn_handler = createServerRpc({
	id: "282d34e2a091e6efe939130774d40d666c72e087301369a9aefeb6f20e7d85a6",
	name: "saveOnboarding",
	filename: "src/lib/profile.functions.ts"
}, (opts) => saveOnboarding.__executeServer(opts));
var saveOnboarding = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => OnboardInput.parse(d)).handler(saveOnboarding_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const isMale = (data.gender ?? "").toLowerCase().startsWith("m");
	const bmr = Math.round(10 * data.weight_kg + 6.25 * data.height_cm - 5 * data.age + (isMale ? 5 : -161));
	const tdee = Math.round(bmr * ({
		sedentary: 1.2,
		light: 1.375,
		moderate: 1.55,
		active: 1.725,
		very_active: 1.9
	}[data.activity] || 1.55));
	const calorieTarget = Math.round(tdee + ({
		fat_loss: -400,
		lean_bulk: 250,
		muscle_gain: 350,
		maintenance: 0,
		recomp: -150
	}[data.goal] || 0));
	const proteinTarget = Math.round(data.weight_kg * (data.goal === "muscle_gain" || data.goal === "lean_bulk" ? 2 : 1.6));
	const extendedData = data.extended_data && typeof data.extended_data === "object" ? data.extended_data : {};
	const waterGoalL = typeof extendedData?.water_goal_l === "number" ? Number(extendedData.water_goal_l) : 3.5;
	try {
		const { error } = await supabase.from("profiles").upsert({
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
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}, { onConflict: "user_id" });
		if (error && (error.message.includes("schema cache") || error.message.includes("relation") || error.code === "42P01")) return {
			ok: true,
			calorieTarget,
			proteinTarget,
			bmr,
			tdee,
			localFallback: true
		};
		if (error) console.warn("[saveOnboarding] profile upsert note:", error.message);
		try {
			await supabase.from("user_medical_flags").delete().eq("user_id", userId);
			if (data.flags.length > 0) {
				const allowedFlags = [
					"diabetes",
					"pcos",
					"hypertension",
					"fatty_liver",
					"kidney_disease",
					"food_allergy"
				];
				const validFlags = data.flags.filter((f) => allowedFlags.includes(f));
				if (validFlags.length > 0) await supabase.from("user_medical_flags").insert(validFlags.map((flag) => ({
					user_id: userId,
					flag
				})));
			}
		} catch {}
		return {
			ok: true,
			calorieTarget,
			proteinTarget,
			bmr,
			tdee,
			localFallback: false
		};
	} catch {
		return {
			ok: true,
			calorieTarget,
			proteinTarget,
			bmr,
			tdee,
			localFallback: true
		};
	}
});
var updateProfile_createServerFn_handler = createServerRpc({
	id: "d94d0b5402d88327ffc5615e3b5d2a6f5e7a519b2121a922cbe6da824cc59c6d",
	name: "updateProfile",
	filename: "src/lib/profile.functions.ts"
}, (opts) => updateProfile.__executeServer(opts));
var updateProfile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	water_goal_l: numberType().optional(),
	water_target_glasses: numberType().optional(),
	daily_calorie_target: numberType().optional(),
	protein_target_g: numberType().optional(),
	extended_data: anyType().optional(),
	display_name: stringType().optional(),
	weight_kg: numberType().optional(),
	goal_weight_kg: numberType().optional()
}).parse(d)).handler(updateProfile_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	try {
		const updates = { updated_at: (/* @__PURE__ */ new Date()).toISOString() };
		if (data.water_goal_l !== void 0) updates.water_goal_l = data.water_goal_l;
		if (data.water_target_glasses !== void 0) updates.water_target_glasses = data.water_target_glasses;
		if (data.daily_calorie_target !== void 0) updates.daily_calorie_target = data.daily_calorie_target;
		if (data.protein_target_g !== void 0) updates.protein_target_g = data.protein_target_g;
		if (data.extended_data !== void 0) updates.extended_data = data.extended_data;
		if (data.display_name !== void 0) updates.display_name = data.display_name;
		if (data.weight_kg !== void 0) updates.weight_kg = data.weight_kg;
		if (data.goal_weight_kg !== void 0) updates.goal_weight_kg = data.goal_weight_kg;
		if (Object.keys(updates).length > 0) await supabase.from("profiles").update(updates).eq("user_id", userId);
		return { ok: true };
	} catch {
		return {
			ok: true,
			localFallback: true
		};
	}
});
var addWater_createServerFn_handler = createServerRpc({
	id: "39a5efeeffc0cf696afa657172f363f074956036ccbedef0a6f0d3ccbb6d15cc",
	name: "addWater",
	filename: "src/lib/profile.functions.ts"
}, (opts) => addWater.__executeServer(opts));
var addWater = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	glasses: numberType().min(-50).max(100).default(1),
	day: stringType().optional()
}).parse(d)).handler(addWater_createServerFn_handler, async ({ data, context }) => {
	const day = data.day || getLocalDateString();
	try {
		const { error } = await context.supabase.from("water_logs").insert({
			user_id: context.userId,
			glasses: data.glasses,
			day
		});
		if (error) return {
			ok: true,
			localFallback: true
		};
		return {
			ok: true,
			localFallback: false
		};
	} catch {
		return {
			ok: true,
			localFallback: true
		};
	}
});
var logWeight_createServerFn_handler = createServerRpc({
	id: "8d53753a989d8afd07b09840dde0294c752c665e93a4d557c8152ea2e6dd4ece",
	name: "logWeight",
	filename: "src/lib/profile.functions.ts"
}, (opts) => logWeight.__executeServer(opts));
var logWeight = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	weight_kg: numberType().min(25).max(400),
	day: stringType().optional()
}).parse(d)).handler(logWeight_createServerFn_handler, async ({ data, context }) => {
	const day = data.day || getLocalDateString();
	try {
		await context.supabase.from("weights").insert({
			user_id: context.userId,
			weight_kg: data.weight_kg,
			day
		});
		await context.supabase.from("profiles").update({
			weight_kg: data.weight_kg,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("user_id", context.userId);
		return {
			ok: true,
			localFallback: false
		};
	} catch {
		return {
			ok: true,
			localFallback: true
		};
	}
});
var logSteps_createServerFn_handler = createServerRpc({
	id: "444e1bbbe8b635c3dae61783dd0a37aa0e76bc5a9024b7a20781c4652d3eab7c",
	name: "logSteps",
	filename: "src/lib/profile.functions.ts"
}, (opts) => logSteps.__executeServer(opts));
var logSteps = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	steps: numberType().int().min(0).max(2e5),
	day: stringType().optional(),
	distance_km: numberType().optional(),
	calories_burned: numberType().optional(),
	active_minutes: numberType().optional()
}).parse(d)).handler(logSteps_createServerFn_handler, async ({ data, context }) => {
	const day = data.day || getLocalDateString();
	try {
		const { error } = await context.supabase.from("step_logs").upsert({
			user_id: context.userId,
			day,
			steps: data.steps,
			distance_km: data.distance_km || 0,
			calories_burned: data.calories_burned || 0,
			active_minutes: data.active_minutes || 0,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}, { onConflict: "user_id,day" });
		if (error) return {
			ok: true,
			localFallback: true
		};
		return {
			ok: true,
			localFallback: false
		};
	} catch {
		return {
			ok: true,
			localFallback: true
		};
	}
});
//#endregion
export { addWater_createServerFn_handler, getProfile_createServerFn_handler, logSteps_createServerFn_handler, logWeight_createServerFn_handler, saveOnboarding_createServerFn_handler, updateProfile_createServerFn_handler };
