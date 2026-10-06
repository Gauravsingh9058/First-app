import { n as createServerFn } from "./server-BL6TnVUX.mjs";
import { t as createServerRpc } from "./createServerRpc-DQ_Jrc5r.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DFYPc8zw.mjs";
import { i as RDA, t as DEFICIENCY_CUTOFF } from "./nutrition-BAeM0OEM.mjs";
import { a as objectType, i as numberType, o as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analytics.functions-5aGd-ldo.js
var getToday_createServerFn_handler = createServerRpc({
	id: "1cbf8a0f9f623dc13b75beb6122e2e15858c04d8d42029281d33306714eccc47",
	name: "getToday",
	filename: "src/lib/analytics.functions.ts"
}, (opts) => getToday.__executeServer(opts));
var getToday = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ day: stringType().optional() }).optional().parse(d)).handler(getToday_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const day = data?.day || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	try {
		const [{ data: rollup }, { data: profile }, { data: meals }] = await Promise.all([
			supabase.from("daily_rollup").select("*").eq("user_id", userId).eq("day", day).maybeSingle(),
			supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
			supabase.from("meals").select("id,name,eaten_at,calories,protein_g,carbs_g,fat_g,fiber_g,sugar_g,sodium_mg,serving_desc").eq("user_id", userId).eq("eaten_on", day).order("eaten_at", { ascending: false })
		]);
		return {
			day,
			rollup: rollup ?? null,
			profile: profile ?? null,
			meals: meals ?? [],
			localFallback: false
		};
	} catch {
		return {
			day,
			rollup: null,
			profile: null,
			meals: [],
			localFallback: true
		};
	}
});
var getMacroTrend_createServerFn_handler = createServerRpc({
	id: "82f4a259e2fd72d4112656d4b0039806a854dad601378dade95e9e6ff99e31b9",
	name: "getMacroTrend",
	filename: "src/lib/analytics.functions.ts"
}, (opts) => getMacroTrend.__executeServer(opts));
var getMacroTrend = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ days: numberType().int().min(7).max(90).default(30) }).parse(d)).handler(getMacroTrend_createServerFn_handler, async ({ data, context }) => {
	const start = /* @__PURE__ */ new Date();
	start.setUTCDate(start.getUTCDate() - data.days + 1);
	const since = start.toISOString().slice(0, 10);
	try {
		const { data: rows, error } = await context.supabase.from("daily_rollup").select("day,calories,protein_g,carbs_g,fat_g,fiber_g,score").eq("user_id", context.userId).gte("day", since).order("day", { ascending: true });
		if (error) return [];
		return rows ?? [];
	} catch {
		return [];
	}
});
var getMicroTrend_createServerFn_handler = createServerRpc({
	id: "1c7be8f31749f0daa6b669a41f7eb998f1fb10b9ee48252723603da612058f96",
	name: "getMicroTrend",
	filename: "src/lib/analytics.functions.ts"
}, (opts) => getMicroTrend.__executeServer(opts));
var getMicroTrend = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ days: numberType().int().min(7).max(90).default(30) }).parse(d)).handler(getMicroTrend_createServerFn_handler, async ({ data, context }) => {
	const start = /* @__PURE__ */ new Date();
	start.setUTCDate(start.getUTCDate() - data.days + 1);
	const since = start.toISOString().slice(0, 10);
	try {
		const { data: rows, error } = await context.supabase.from("daily_rollup").select("day,iron_mg,calcium_mg,magnesium_mg,potassium_mg,vit_a_ug,vit_b12_ug,vit_d_ug,omega3_g,meal_count").eq("user_id", context.userId).gte("day", since).order("day", { ascending: true });
		if (error) return {
			rows: [],
			deficiencies: []
		};
		const rowsArr = rows ?? [];
		return {
			rows: rowsArr,
			deficiencies: Object.keys(RDA).map((nut) => {
				const cutoff = RDA[nut] * DEFICIENCY_CUTOFF;
				const loggedDays = rowsArr.filter((r) => (r.meal_count ?? 0) > 0);
				return {
					nutrient: nut,
					lowDays: loggedDays.filter((r) => Number(r[nut] ?? 0) < cutoff).length,
					totalDays: loggedDays.length
				};
			})
		};
	} catch {
		return {
			rows: [],
			deficiencies: []
		};
	}
});
var getCalendarRange_createServerFn_handler = createServerRpc({
	id: "703e20a28f714e0ad85913e0cae738b793cdce1a7fdc3249cc8945bdfed345d4",
	name: "getCalendarRange",
	filename: "src/lib/analytics.functions.ts"
}, (opts) => getCalendarRange.__executeServer(opts));
var getCalendarRange = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ days: numberType().int().min(1).max(3650).default(365) }).parse(d)).handler(getCalendarRange_createServerFn_handler, async ({ data, context }) => {
	const start = /* @__PURE__ */ new Date();
	start.setUTCDate(start.getUTCDate() - data.days + 1);
	const since = start.toISOString().slice(0, 10);
	try {
		const { data: rows, error } = await context.supabase.from("daily_rollup").select("*").eq("user_id", context.userId).gte("day", since).order("day", { ascending: true });
		if (error) return [];
		return rows ?? [];
	} catch {
		return [];
	}
});
var getDay_createServerFn_handler = createServerRpc({
	id: "64efa13b12c16399a0833a3ed85f51077ae0d3852423eeab698741acd4523bb0",
	name: "getDay",
	filename: "src/lib/analytics.functions.ts"
}, (opts) => getDay.__executeServer(opts));
var getDay = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ day: stringType() }).parse(d)).handler(getDay_createServerFn_handler, async ({ data, context }) => {
	try {
		const [{ data: rollup }, { data: meals }, { data: profile }] = await Promise.all([
			context.supabase.from("daily_rollup").select("*").eq("user_id", context.userId).eq("day", data.day).maybeSingle(),
			context.supabase.from("meals").select("*, meal_micros(*)").eq("user_id", context.userId).eq("eaten_on", data.day).order("eaten_at", { ascending: true }),
			context.supabase.from("profiles").select("daily_calorie_target, protein_target_g, water_target_glasses").eq("user_id", context.userId).maybeSingle()
		]);
		return {
			day: data.day,
			rollup: rollup ?? null,
			meals: meals ?? [],
			profile: profile ?? null
		};
	} catch {
		return {
			day: data.day,
			rollup: null,
			meals: [],
			profile: null
		};
	}
});
var getWeightTrend_createServerFn_handler = createServerRpc({
	id: "9ff9b67c25935704982c975305b72e1051b011df64741995e9111e1e6fed34ee",
	name: "getWeightTrend",
	filename: "src/lib/analytics.functions.ts"
}, (opts) => getWeightTrend.__executeServer(opts));
var getWeightTrend = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ days: numberType().int().min(7).max(365).default(60) }).parse(d)).handler(getWeightTrend_createServerFn_handler, async ({ data, context }) => {
	const start = /* @__PURE__ */ new Date();
	start.setUTCDate(start.getUTCDate() - data.days + 1);
	const since = start.toISOString().slice(0, 10);
	try {
		const { data: rows, error } = await context.supabase.from("weights").select("day,weight_kg").eq("user_id", context.userId).gte("day", since).order("day", { ascending: true });
		if (error) return [];
		return rows ?? [];
	} catch {
		return [];
	}
});
//#endregion
export { getCalendarRange_createServerFn_handler, getDay_createServerFn_handler, getMacroTrend_createServerFn_handler, getMicroTrend_createServerFn_handler, getToday_createServerFn_handler, getWeightTrend_createServerFn_handler };
