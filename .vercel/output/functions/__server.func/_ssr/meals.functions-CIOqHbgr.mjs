import { n as createServerFn } from "./server-BL6TnVUX.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DFYPc8zw.mjs";
import { a as objectType, i as numberType, o as stringType, r as enumType, t as anyType } from "../_libs/zod.mjs";
import { _ as createSsrRpc } from "./router-BBaCA5Zn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/meals.functions-CIOqHbgr.js
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
var logMeal = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => MealInput.parse(d)).handler(createSsrRpc("20d2f10e3e826873d79db5a646b5bc68c0946b7b0d1019627e0e9c2db0e6ffe3"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid().or(stringType()) }).parse(d)).handler(createSsrRpc("a0e375e8c7f5aee24d9b537bd76361fb27815801b41872dc8f2082060c11a93e"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ day: stringType() }).parse(d)).handler(createSsrRpc("3578ea90663b33524187434a3e78e628c573a31e4ab7b29a098bb93765b5e85e"));
//#endregion
export { logMeal as t };
