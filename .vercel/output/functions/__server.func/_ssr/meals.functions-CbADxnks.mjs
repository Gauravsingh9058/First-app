import { n as createServerFn } from "./server-BL6TnVUX.mjs";
import { t as createServerRpc } from "./createServerRpc-DQ_Jrc5r.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DFYPc8zw.mjs";
import { a as objectType, i as numberType, o as stringType, r as enumType, t as anyType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/meals.functions-CbADxnks.js
var MealInput = objectType({
	name: stringType().min(1).max(120),
	source: enumType([
		"photo",
		"manual",
		"barcode"
	]).default("manual"),
	confidence: numberType().min(0).max(1).nullable().optional(),
	serving_desc: stringType().max(120).optional().nullable(),
	calories: numberType().min(0).max(1e4),
	protein_g: numberType().min(0).max(1e3).default(0),
	carbs_g: numberType().min(0).max(1e3).default(0),
	fat_g: numberType().min(0).max(1e3).default(0),
	fiber_g: numberType().min(0).max(500).default(0),
	sugar_g: numberType().min(0).max(1e3).default(0),
	sodium_mg: numberType().min(0).max(2e4).default(0),
	iron_mg: numberType().min(0).default(0),
	calcium_mg: numberType().min(0).default(0),
	magnesium_mg: numberType().min(0).default(0),
	potassium_mg: numberType().min(0).default(0),
	vit_a_ug: numberType().min(0).default(0),
	vit_b12_ug: numberType().min(0).default(0),
	vit_d_ug: numberType().min(0).default(0),
	omega3_g: numberType().min(0).default(0),
	raw_model_response: anyType().optional().nullable(),
	eaten_at: stringType().datetime().optional(),
	eaten_on: stringType().optional()
});
async function syncDailyRollup(supabase, userId, day) {
	try {
		const { data: meals } = await supabase.from("meals").select("id, calories, protein_g, carbs_g, fat_g, fiber_g, sugar_g, sodium_mg").eq("user_id", userId).eq("eaten_on", day);
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
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			});
			return;
		}
		const mealIds = mealList.map((m) => m.id);
		const { data: micros } = await supabase.from("meal_micros").select("*").in("meal_id", mealIds);
		const microMap = /* @__PURE__ */ new Map();
		for (const mic of micros ?? []) microMap.set(mic.meal_id, mic);
		let cals = 0, pro = 0, carb = 0, fat = 0, fib = 0, sug = 0, sod = 0;
		let iron = 0, calc = 0, mag = 0, pot = 0, vitA = 0, vitB12 = 0, vitD = 0, o3 = 0;
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
		const score = Math.min(100, Math.round((cals > 0 ? 40 : 0) + Math.min(30, pro / 100 * 30) + Math.min(15, fib / 25 * 15) + Math.min(15, iron + calc + mag + pot > 0 ? 15 : 0)));
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
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		});
	} catch (e) {
		console.warn("[syncDailyRollup] error:", e);
	}
}
var logMeal_createServerFn_handler = createServerRpc({
	id: "20d2f10e3e826873d79db5a646b5bc68c0946b7b0d1019627e0e9c2db0e6ffe3",
	name: "logMeal",
	filename: "src/lib/meals.functions.ts"
}, (opts) => logMeal.__executeServer(opts));
var logMeal = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => MealInput.parse(d)).handler(logMeal_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const eatenAt = data.eaten_at ?? (/* @__PURE__ */ new Date()).toISOString();
	const eatenOn = data.eaten_on ?? eatenAt.slice(0, 10);
	try {
		const { data: meal, error } = await supabase.from("meals").insert({
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
			eaten_on: eatenOn
		}).select("id").single();
		if (error && (error.message.includes("schema cache") || error.message.includes("relation") || error.code === "42P01")) return {
			id: `local-${Date.now()}`,
			localFallback: true
		};
		if (error) {
			console.warn("[logMeal] insert note:", error.message);
			return {
				id: `local-${Date.now()}`,
				localFallback: true
			};
		}
		if (data.iron_mg || data.calcium_mg || data.magnesium_mg || data.potassium_mg || data.vit_a_ug || data.vit_b12_ug || data.vit_d_ug || data.omega3_g) try {
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
				omega3_g: data.omega3_g
			});
		} catch {}
		await syncDailyRollup(supabase, userId, eatenOn);
		return {
			id: meal.id,
			localFallback: false
		};
	} catch {
		return {
			id: `local-${Date.now()}`,
			localFallback: true
		};
	}
});
var deleteMeal_createServerFn_handler = createServerRpc({
	id: "a0e375e8c7f5aee24d9b537bd76361fb27815801b41872dc8f2082060c11a93e",
	name: "deleteMeal",
	filename: "src/lib/meals.functions.ts"
}, (opts) => deleteMeal.__executeServer(opts));
var deleteMeal = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid().or(stringType()) }).parse(d)).handler(deleteMeal_createServerFn_handler, async ({ data, context }) => {
	try {
		if (data.id.startsWith("local-")) return {
			ok: true,
			localFallback: true
		};
		const { data: targetMeal } = await context.supabase.from("meals").select("eaten_on").eq("id", data.id).maybeSingle();
		const { error } = await context.supabase.from("meals").delete().eq("id", data.id);
		if (error) return {
			ok: true,
			localFallback: true
		};
		if (targetMeal?.eaten_on) await syncDailyRollup(context.supabase, context.userId, targetMeal.eaten_on);
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
var listMealsOnDay_createServerFn_handler = createServerRpc({
	id: "3578ea90663b33524187434a3e78e628c573a31e4ab7b29a098bb93765b5e85e",
	name: "listMealsOnDay",
	filename: "src/lib/meals.functions.ts"
}, (opts) => listMealsOnDay.__executeServer(opts));
var listMealsOnDay = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ day: stringType() }).parse(d)).handler(listMealsOnDay_createServerFn_handler, async ({ data, context }) => {
	try {
		const { data: meals, error } = await context.supabase.from("meals").select("id,name,eaten_at,eaten_on,source,confidence,serving_desc,calories,protein_g,carbs_g,fat_g,fiber_g,sugar_g,sodium_mg,meal_micros(*)").eq("eaten_on", data.day).order("eaten_at", { ascending: true });
		if (error) return {
			meals: [],
			localFallback: true
		};
		return {
			meals: meals ?? [],
			localFallback: false
		};
	} catch {
		return {
			meals: [],
			localFallback: true
		};
	}
});
//#endregion
export { deleteMeal_createServerFn_handler, listMealsOnDay_createServerFn_handler, logMeal_createServerFn_handler };
