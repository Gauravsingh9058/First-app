import { createFileRoute } from "@tanstack/react-router";
import { getGeminiApiKey } from "@/lib/ai-gateway.server";
import { GoogleGenAI } from "@google/genai";
import { calculateRecipeNutritionLocally } from "@/lib/nutrition-engine";

interface IngredientInput {
  name: string;
  amount?: string;
}

interface IngredientBreakdown {
  name: string;
  amount: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

interface AnalysisResponse {
  mealName: string;
  serving: string;
  totalGrams: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  sugar_g: number;
  sodium_mg: number;
  iron_mg: number;
  calcium_mg: number;
  magnesium_mg: number;
  potassium_mg: number;
  vit_a_ug: number;
  vit_b12_ug: number;
  vit_d_ug: number;
  omega3_g: number;
  ingredientBreakdown: IngredientBreakdown[];
}

const SYSTEM_PROMPT = `You are a world-class clinical nutrition scientist, biochemist, and food database calculator.
Analyze the provided list of ingredients and quantities to calculate exact, scientifically calibrated macronutrients and micronutrients.

STANDARD NUTRITION REFERENCE BENCHMARKS (per 100g edible portion):
- Cooked Chicken Breast: 165 kcal, 31g protein, 0g carbs, 3.6g fat, 74mg sodium, 256mg potassium, 1mg iron
- Paneer (Cottage Cheese): 265 kcal, 18.3g protein, 3g carbs, 20.8g fat, 480mg calcium, 18mg magnesium
- Boiled Whole Egg (1 large ~50g): 72 kcal, 6.3g protein, 0.4g carbs, 4.8g fat, 70mg sodium, 138mg potassium, 28mg calcium, 0.9mg iron, 1.1mcg Vit D, 0.6mcg Vit B12
- Boiled Egg White (1 large ~33g): 17 kcal, 3.6g protein, 0.2g carbs, 0.1g fat, 55mg sodium, 54mg potassium
- Cooked White Rice: 130 kcal, 2.7g protein, 28.2g carbs, 0.3g fat, 0.4g fiber
- Cooked Brown Rice: 112 kcal, 2.6g protein, 23.5g carbs, 0.9g fat, 1.8g fiber, 43mg magnesium
- Whole Wheat Roti / Chapati (1 medium ~35g): 104 kcal, 3.1g protein, 20g carbs, 1.2g fat, 3.2g fiber
- Cooked Yellow Lentils (Toor / Moong Dal): 116 kcal, 7.5g protein, 19.5g carbs, 0.8g fat, 4.2g fiber, 310mg potassium, 1.8mg iron
- Cooked Rajma (Kidney Beans): 127 kcal, 8.7g protein, 22.8g carbs, 0.5g fat, 6.4g fiber, 405mg potassium, 2.9mg iron
- Cooked Chickpeas (Chole): 140 kcal, 6.8g protein, 19.5g carbs, 4.2g fat, 5.5g fiber, 260mg potassium, 2.4mg iron
- Soya Chunks (dry, 100g): 345 kcal, 52g protein, 33g carbs, 0.5g fat, 13g fiber, 350mg calcium, 10mg iron
- Cooked Rolled Oats: 71 kcal, 2.5g protein, 12g carbs, 1.5g fat, 1.7g fiber (Beta-glucan)
- Olive / Mustard / Vegetable Oil (1 tbsp ~14g): 124 kcal, 0g pro, 0g carb, 14g fat
- Pure Desi Ghee / Butter (1 tbsp ~14g): 126 kcal, 0g pro, 0g carb, 14g fat (10g saturated fat)
- Milk (Toned 3% fat, 100ml): 58 kcal, 3.1g protein, 4.7g carbs, 3.0g fat, 120mg calcium, 0.4mcg Vit B12
- Greek Yogurt / Hung Curd: 97 kcal, 9g protein, 3.8g carbs, 5g fat, 100mg calcium, 141mg potassium
- Banana (1 medium ~118g): 105 kcal, 1.3g protein, 27g carbs, 0.3g fat, 3.1g fiber, 422mg potassium, 32mg magnesium
- Apple (1 medium ~150g): 78 kcal, 0.5g protein, 20.7g carbs, 0.3g fat, 3.6g fiber, 160mg potassium
- Almonds (100g): 579 kcal, 21.2g protein, 21.6g carbs, 49.9g fat, 12.5g fiber, 269mg calcium, 270mg magnesium
- Peanut Butter (2 tbsp ~32g): 188 kcal, 8g protein, 6g carbs, 16g fat, 2g fiber

Return ONLY a valid JSON object matching this schema (numbers, no units in values):
{
  "mealName": string,              // a clean title for the meal, e.g. "Paneer & Egg Scramble with Chapati"
  "serving": string,               // serving description, e.g. "1 bowl (~350g)"
  "totalGrams": number,            // estimated total weight in grams
  "calories": number,              // total energy in kcal (must equal sum of items)
  "protein_g": number,             // protein in grams
  "carbs_g": number,               // total carbohydrates in grams
  "fat_g": number,                 // total fats in grams
  "fiber_g": number,               // dietary fiber in grams
  "sugar_g": number,               // total sugars in grams
  "sodium_mg": number,             // sodium in mg
  "iron_mg": number,               // iron in mg
  "calcium_mg": number,            // calcium in mg
  "magnesium_mg": number,          // magnesium in mg
  "potassium_mg": number,          // potassium in mg
  "vit_a_ug": number,              // vitamin A in mcg
  "vit_b12_ug": number,            // vitamin B12 in mcg
  "vit_d_ug": number,              // vitamin D in mcg
  "omega3_g": number,              // omega-3 fatty acids in grams
  "ingredientBreakdown": [
    {
      "name": string,              // name of ingredient
      "amount": string,            // quantity, e.g. "100g" or "2 pcs"
      "calories": number,
      "protein_g": number,
      "carbs_g": number,
      "fat_g": number
    }
  ]
}

Ensure mathematical Atwater consistency: total calories should equal approximately (protein * 4) + (carbs * 4) + (fat * 9). All numbers must be non-negative.`;

export const Route = createFileRoute("/api/analyze-ingredients")({
  server: {
    handlers: {
      GET: () => {
        return Response.json(
          { error: "Method Not Allowed. Please send a POST request with ingredients list." },
          { status: 405 },
        );
      },
      POST: async ({ request }) => {
        try {
          const { mealName, ingredients } = (await request.json()) as {
            mealName?: string;
            ingredients?: IngredientInput[];
          };

          if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
            return Response.json(
              { error: "At least one ingredient with a name is required." },
              { status: 400 },
            );
          }

          const formattedIngredients = ingredients
            .map((i) => `${i.name.trim()} ${i.amount ? `(${i.amount.trim()})` : ""}`)
            .filter((str) => str.trim().length > 0);

          if (formattedIngredients.length === 0) {
            return Response.json({ error: "Ingredient names cannot be empty." }, { status: 400 });
          }

          const apiKey = getGeminiApiKey();

          if (apiKey) {
            try {
              const ai = new GoogleGenAI({
                apiKey,
                httpOptions: { headers: { "User-Agent": "aistudio-build" } },
              });

              const userPrompt = `Meal Name/Title: "${mealName || "Custom Meal"}"\nIngredients:\n${formattedIngredients.map((ing, idx) => `${idx + 1}. ${ing}`).join("\n")}\n\nAnalyze these ingredients and calculate all macros, micros, and itemized breakdowns. Return strictly JSON.`;

              const candidateModels = [
                "gemini-2.5-flash",
                "gemini-flash-latest",
                "gemini-2.5-pro",
                "gemini-3.7-flash",
                "gemini-3.1-flash-lite",
              ];
              let res = null;

              for (const modelName of candidateModels) {
                try {
                  res = await ai.models.generateContent({
                    model: modelName,
                    contents: userPrompt,
                    config: {
                      systemInstruction: SYSTEM_PROMPT,
                      responseMimeType: "application/json",
                      temperature: 0.1,
                    },
                  });
                  if (res && res.text) break;
                } catch (err: unknown) {
                  const msg = err instanceof Error ? err.message : String(err);
                  if (
                    msg.includes("401") ||
                    msg.includes("UNAUTHENTICATED") ||
                    msg.includes("invalid authentication")
                  ) {
                    break;
                  }
                  const isCapacityError =
                    msg.includes("503") ||
                    msg.includes("429") ||
                    msg.includes("UNAVAILABLE") ||
                    msg.includes("high demand");
                  if (isCapacityError) {
                    console.info(
                      `[/api/analyze-ingredients] Model ${modelName} is at capacity. Transitioning to next model...`,
                    );
                  } else {
                    console.warn(`[/api/analyze-ingredients] Model ${modelName} notice:`, msg);
                  }
                }
                if (res && res.text) break;
              }

              const text = res?.text || "{}";
              let parsed: Partial<AnalysisResponse> = {};
              try {
                parsed = JSON.parse(text);
              } catch {
                const m = text.match(/\{[\s\S]*\}/);
                if (m) parsed = JSON.parse(m[0]);
              }

              const num = (v: unknown) =>
                typeof v === "number" && isFinite(v) && v >= 0 ? Math.round(v * 10) / 10 : 0;

              // Cross-validate individual items with local USDA SQLite engine
              let rawIngs: Array<{ name: string; quantity: number; unit: string }> = [];
              let usdaNut: Awaited<ReturnType<typeof calculateRecipeNutritionLocally>> | null =
                null;
              try {
                rawIngs = ingredients.map((ing) => ({
                  name: ing.name,
                  quantity: parseFloat(ing.amount || "100") || 100,
                  unit: (ing.amount && ing.amount.replace(/[0-9.]/g, "").trim()) || "g",
                }));
                usdaNut = await calculateRecipeNutritionLocally(rawIngs);
              } catch (e) {
                console.warn("[/api/analyze-ingredients] Local USDA cross-validation warning:", e);
              }

              let totalPro = 0;
              let totalCarb = 0;
              let totalFat = 0;
              let totalFiber = 0;
              let totalSugar = 0;
              let totalSodium = 0;
              let totalIron = 0;
              let totalCalcium = 0;
              let totalMagnesium = 0;
              let totalPotassium = 0;
              let totalVitA = 0;
              let totalVitB12 = 0;
              let totalVitD = 0;
              let totalOmega3 = 0;

              const ingredientBreakdown: IngredientBreakdown[] = [];

              if (usdaNut && usdaNut.parsedIngredients.length > 0) {
                usdaNut.parsedIngredients.forEach((pIng, idx) => {
                  const origIng = ingredients[idx] || {
                    name: pIng.name,
                    amount: `${pIng.quantity}${pIng.unit}`,
                  };
                  const aiItem = Array.isArray(parsed.ingredientBreakdown)
                    ? parsed.ingredientBreakdown[idx]
                    : null;

                  if (pIng.normalized_name && !pIng.normalized_name.startsWith("Unmatched")) {
                    // Matched in USDA with verified database nutrients
                    const itemP = num(pIng.protein_g);
                    const itemC = num(pIng.carbs_g);
                    const itemF = num(pIng.fat_g);
                    const itemCals = Math.round(pIng.calories || itemP * 4 + itemC * 4 + itemF * 9);

                    totalPro += itemP;
                    totalCarb += itemC;
                    totalFat += itemF;
                    totalFiber += num(pIng.fiber_g);
                    totalSugar += num(pIng.sugar_g);
                    totalSodium += num(pIng.sodium_mg);
                    totalIron += num(pIng.iron_mg);
                    totalCalcium += num(pIng.calcium_mg);
                    totalMagnesium += num(pIng.magnesium_mg);
                    totalPotassium += num(pIng.potassium_mg);
                    totalVitA += num(pIng.vit_a_ug);
                    totalVitB12 += num(pIng.vit_b12_ug);
                    totalVitD += num(pIng.vit_d_ug);
                    totalOmega3 += num(pIng.omega3_g);

                    ingredientBreakdown.push({
                      name: pIng.name || origIng.name,
                      amount: origIng.amount || `${pIng.quantity}${pIng.unit || "g"}`,
                      calories: itemCals,
                      protein_g: itemP,
                      carbs_g: itemC,
                      fat_g: itemF,
                    });
                  } else {
                    // Fallback to AI item estimate
                    const itemP = aiItem ? num(aiItem.protein_g) : 5;
                    const itemC = aiItem ? num(aiItem.carbs_g) : 15;
                    const itemF = aiItem ? num(aiItem.fat_g) : 3;
                    const itemCals = aiItem
                      ? Math.round(aiItem.calories || itemP * 4 + itemC * 4 + itemF * 9)
                      : Math.round(itemP * 4 + itemC * 4 + itemF * 9);

                    totalPro += itemP;
                    totalCarb += itemC;
                    totalFat += itemF;

                    ingredientBreakdown.push({
                      name: origIng.name,
                      amount: origIng.amount || "1 portion",
                      calories: itemCals,
                      protein_g: itemP,
                      carbs_g: itemC,
                      fat_g: itemF,
                    });
                  }
                });
              } else {
                // Use parsed AI values
                totalPro = num(parsed.protein_g);
                totalCarb = num(parsed.carbs_g);
                totalFat = num(parsed.fat_g);
                totalFiber = num(parsed.fiber_g);
                totalSugar = num(parsed.sugar_g);
                totalSodium = num(parsed.sodium_mg);
                totalIron = num(parsed.iron_mg);
                totalCalcium = num(parsed.calcium_mg);
                totalMagnesium = num(parsed.magnesium_mg);
                totalPotassium = num(parsed.potassium_mg);
                totalVitA = num(parsed.vit_a_ug);
                totalVitB12 = num(parsed.vit_b12_ug);
                totalVitD = num(parsed.vit_d_ug);
                totalOmega3 = num(parsed.omega3_g);

                if (
                  Array.isArray(parsed.ingredientBreakdown) &&
                  parsed.ingredientBreakdown.length > 0
                ) {
                  parsed.ingredientBreakdown.forEach((item) => {
                    const ip = num(item.protein_g);
                    const ic = num(item.carbs_g);
                    const ifat = num(item.fat_g);
                    ingredientBreakdown.push({
                      name: item.name || "Item",
                      amount: item.amount || "1 portion",
                      calories: Math.round(ip * 4 + ic * 4 + ifat * 9),
                      protein_g: ip,
                      carbs_g: ic,
                      fat_g: ifat,
                    });
                  });
                }
              }

              // Top-level micro blending if AI provided richer details
              if (parsed.sodium_mg) totalSodium = Math.max(totalSodium, num(parsed.sodium_mg));
              if (parsed.calcium_mg) totalCalcium = Math.max(totalCalcium, num(parsed.calcium_mg));
              if (parsed.iron_mg) totalIron = Math.max(totalIron, num(parsed.iron_mg));
              if (parsed.potassium_mg)
                totalPotassium = Math.max(totalPotassium, num(parsed.potassium_mg));
              if (parsed.magnesium_mg)
                totalMagnesium = Math.max(totalMagnesium, num(parsed.magnesium_mg));
              if (parsed.vit_a_ug) totalVitA = Math.max(totalVitA, num(parsed.vit_a_ug));
              if (parsed.vit_b12_ug) totalVitB12 = Math.max(totalVitB12, num(parsed.vit_b12_ug));
              if (parsed.vit_d_ug) totalVitD = Math.max(totalVitD, num(parsed.vit_d_ug));
              if (parsed.omega3_g) totalOmega3 = Math.max(totalOmega3, num(parsed.omega3_g));
              if (parsed.fiber_g) totalFiber = Math.max(totalFiber, num(parsed.fiber_g));
              if (parsed.sugar_g) totalSugar = Math.max(totalSugar, num(parsed.sugar_g));

              totalPro = Math.max(0, Math.round(totalPro * 10) / 10);
              totalCarb = Math.max(0, Math.round(totalCarb * 10) / 10);
              totalFat = Math.max(0, Math.round(totalFat * 10) / 10);

              const computedCalories = Math.round(totalPro * 4 + totalCarb * 4 + totalFat * 9);

              const out: AnalysisResponse = {
                mealName: parsed.mealName || mealName || "Custom Meal",
                serving: parsed.serving || `${ingredients.length} ingredients`,
                totalGrams:
                  num(parsed.totalGrams) ||
                  ingredients.reduce((acc, i) => acc + (parseFloat(i.amount || "100") || 100), 0) ||
                  250,
                calories: computedCalories,
                protein_g: totalPro,
                carbs_g: totalCarb,
                fat_g: totalFat,
                fiber_g: Math.round(totalFiber * 10) / 10,
                sugar_g: Math.round(totalSugar * 10) / 10,
                sodium_mg: Math.round(totalSodium),
                iron_mg: Math.round(totalIron * 10) / 10,
                calcium_mg: Math.round(totalCalcium),
                magnesium_mg: Math.round(totalMagnesium),
                potassium_mg: Math.round(totalPotassium),
                vit_a_ug: Math.round(totalVitA),
                vit_b12_ug: Math.round(totalVitB12 * 10) / 10,
                vit_d_ug: Math.round(totalVitD * 10) / 10,
                omega3_g: Math.round(totalOmega3 * 100) / 100,
                ingredientBreakdown,
              };

              return Response.json(out);
            } catch (geminiErr) {
              console.warn(
                "[/api/analyze-ingredients] Gemini call failed, falling back to heuristic calculation:",
                geminiErr,
              );
            }
          }

          // Smart fallback estimation algorithm if AI API is unavailable
          const fallbackResult = estimateNutritionFallback(mealName, ingredients);
          return Response.json(fallbackResult);
        } catch (err) {
          const message = err instanceof Error ? err.message : "Unknown error";
          console.error("[/api/analyze-ingredients]", message);
          return Response.json({ error: message }, { status: 500 });
        }
      },
    },
  },
});

/** Heuristic nutrition database for common ingredients when Gemini API is unavailable */
function estimateNutritionFallback(
  mealName?: string,
  ingredients: IngredientInput[] = [],
): AnalysisResponse {
  let totalCals = 0;
  let totalProt = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalFiber = 0;
  let totalSugar = 0;
  let totalGrams = 0;

  const itemized: IngredientBreakdown[] = [];

  for (const item of ingredients) {
    const rawName = item.name.toLowerCase();
    const rawAmount = (item.amount || "100g").toLowerCase();

    // extract numeric multiplier
    let weightGrams = 100;
    const gMatch = rawAmount.match(/(\d+(?:\.\d+)?)\s*(g|gram|grams)/);
    const pcsMatch = rawAmount.match(
      /(\d+(?:\.\d+)?)\s*(pc|pcs|piece|pieces|egg|eggs|roti|rotis|chapati|chapatis|slice|slices)/,
    );
    const cupMatch = rawAmount.match(/(\d+(?:\.\d+)?)\s*(cup|cups|bowl|bowls)/);
    const tbspMatch = rawAmount.match(/(\d+(?:\.\d+)?)\s*(tbsp|tsp|spoon|spoons)/);

    if (gMatch) {
      weightGrams = parseFloat(gMatch[1]);
    } else if (pcsMatch) {
      const count = parseFloat(pcsMatch[1]);
      if (rawName.includes("egg")) weightGrams = count * 50;
      else if (rawName.includes("roti") || rawName.includes("chapati")) weightGrams = count * 35;
      else if (rawName.includes("bread") || rawName.includes("slice")) weightGrams = count * 30;
      else weightGrams = count * 60;
    } else if (cupMatch) {
      weightGrams = parseFloat(cupMatch[1]) * 150;
    } else if (tbspMatch) {
      weightGrams = parseFloat(tbspMatch[1]) * 15;
    }

    const factor = weightGrams / 100;

    // Per 100g database
    let c100 = 150,
      p100 = 5,
      carb100 = 20,
      f100 = 3,
      fib100 = 2,
      sug100 = 1;

    if (rawName.includes("paneer") || rawName.includes("cottage cheese")) {
      c100 = 265;
      p100 = 18;
      carb100 = 3;
      f100 = 20;
      fib100 = 0;
      sug100 = 2;
    } else if (rawName.includes("egg")) {
      c100 = 143;
      p100 = 13;
      carb100 = 1;
      f100 = 10;
      fib100 = 0;
      sug100 = 0.5;
    } else if (rawName.includes("chicken")) {
      c100 = 165;
      p100 = 31;
      carb100 = 0;
      f100 = 3.6;
      fib100 = 0;
      sug100 = 0;
    } else if (rawName.includes("soya") || rawName.includes("soy")) {
      c100 = 345;
      p100 = 52;
      carb100 = 33;
      f100 = 0.5;
      fib100 = 13;
      sug100 = 7;
    } else if (rawName.includes("rice")) {
      c100 = 130;
      p100 = 2.7;
      carb100 = 28;
      f100 = 0.3;
      fib100 = 0.4;
      sug100 = 0.1;
    } else if (
      rawName.includes("roti") ||
      rawName.includes("chapati") ||
      rawName.includes("wheat")
    ) {
      c100 = 264;
      p100 = 9;
      carb100 = 55;
      f100 = 1.5;
      fib100 = 8;
      sug100 = 1;
    } else if (rawName.includes("oats")) {
      c100 = 389;
      p100 = 17;
      carb100 = 66;
      f100 = 7;
      fib100 = 10;
      sug100 = 1;
    } else if (rawName.includes("peanut butter")) {
      c100 = 588;
      p100 = 25;
      carb100 = 20;
      f100 = 50;
      fib100 = 6;
      sug100 = 9;
    } else if (rawName.includes("milk")) {
      c100 = 60;
      p100 = 3.2;
      carb100 = 4.8;
      f100 = 3.2;
      fib100 = 0;
      sug100 = 5;
    } else if (rawName.includes("oil") || rawName.includes("butter") || rawName.includes("ghee")) {
      c100 = 884;
      p100 = 0;
      carb100 = 0;
      f100 = 100;
      fib100 = 0;
      sug100 = 0;
    } else if (
      rawName.includes("dal") ||
      rawName.includes("lentil") ||
      rawName.includes("chana") ||
      rawName.includes("rajma")
    ) {
      c100 = 116;
      p100 = 9;
      carb100 = 20;
      f100 = 0.4;
      fib100 = 8;
      sug100 = 1.8;
    } else if (rawName.includes("banana")) {
      c100 = 89;
      p100 = 1.1;
      carb100 = 23;
      f100 = 0.3;
      fib100 = 2.6;
      sug100 = 12;
    } else if (rawName.includes("curd") || rawName.includes("yogurt") || rawName.includes("dahi")) {
      c100 = 61;
      p100 = 3.5;
      carb100 = 4.7;
      f100 = 3.3;
      fib100 = 0;
      sug100 = 4.7;
    }

    const itemCal = Math.round(c100 * factor);
    const itemProt = Math.round(p100 * factor * 10) / 10;
    const itemCarb = Math.round(carb100 * factor * 10) / 10;
    const itemFat = Math.round(f100 * factor * 10) / 10;

    totalCals += itemCal;
    totalProt += itemProt;
    totalCarbs += itemCarb;
    totalFat += itemFat;
    totalFiber += Math.round(fib100 * factor * 10) / 10;
    totalSugar += Math.round(sug100 * factor * 10) / 10;
    totalGrams += weightGrams;

    itemized.push({
      name: item.name,
      amount: item.amount || `${Math.round(weightGrams)}g`,
      calories: itemCal,
      protein_g: itemProt,
      carbs_g: itemCarb,
      fat_g: itemFat,
    });
  }

  const r = (v: number) => Math.round(v * 10) / 10;

  return {
    mealName: mealName || "Custom Prepared Meal",
    serving: `${ingredients.length} ingredients (~${Math.round(totalGrams)}g)`,
    totalGrams: Math.round(totalGrams),
    calories: Math.round(totalCals),
    protein_g: r(totalProt),
    carbs_g: r(totalCarbs),
    fat_g: r(totalFat),
    fiber_g: r(totalFiber),
    sugar_g: r(totalSugar),
    sodium_mg: Math.round(totalGrams * 1.2),
    iron_mg: r(totalGrams * 0.015),
    calcium_mg: Math.round(totalGrams * 0.8),
    magnesium_mg: Math.round(totalGrams * 0.25),
    potassium_mg: Math.round(totalGrams * 1.5),
    vit_a_ug: Math.round(totalGrams * 0.4),
    vit_b12_ug: r(totalGrams * 0.003),
    vit_d_ug: r(totalGrams * 0.001),
    omega3_g: r(totalGrams * 0.002),
    ingredientBreakdown: itemized,
  };
}
