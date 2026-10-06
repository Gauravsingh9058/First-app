import { getAllUSDAIngredientsFromSQLite, USDAIngredient, RecipeIngredient } from "./recipe-db";

export interface ParsedIngredient {
  originalText: string;
  normalizedName: string;
  quantity: number;
  unit: string;
  weightInGrams: number;
  usdaMatch: USDAIngredient | null;
  isUnmatched: boolean;
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
  estimatedCost: number;
}

export interface CalculatedRecipeNutrition {
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
  estimatedCost: number;
  parsedIngredients: RecipeIngredient[];
  unmatchedIngredientsCount: number;
}

/**
 * Normalizes unit string to standard unit and gram multiplier using the exact formula
 */
export function normalizeUnitAndQuantity(
  qty: number,
  unitStr: string,
  usdaMatch?: USDAIngredient | null,
): { quantity: number; unit: string; grams: number } {
  const safeQty = Math.max(0, qty);
  const u = (unitStr || "g").trim().toLowerCase();

  if (u.startsWith("g") || u === "gram" || u === "grams") {
    return { quantity: safeQty, unit: "g", grams: safeQty };
  }
  if (u === "kg" || u === "kilogram" || u === "kilograms") {
    return { quantity: safeQty, unit: "kg", grams: safeQty * 1000 };
  }
  if (u === "ml" || u === "milliliter" || u === "milliliters") {
    return { quantity: safeQty, unit: "ml", grams: safeQty }; // 1ml ~ 1g
  }
  if (u === "l" || u === "liter" || u === "liters") {
    return { quantity: safeQty, unit: "L", grams: safeQty * 1000 };
  }
  if (u === "tbsp" || u === "tablespoon" || u === "tablespoons") {
    return { quantity: safeQty, unit: "tbsp", grams: safeQty * 15 };
  }
  if (u === "tsp" || u === "teaspoon" || u === "teaspoons") {
    return { quantity: safeQty, unit: "tsp", grams: safeQty * 5 };
  }
  if (u === "cup" || u === "cups") {
    return { quantity: safeQty, unit: "cup", grams: safeQty * 180 };
  }
  if (u === "scoop" || u === "scoops") {
    const gramMultiplier =
      usdaMatch?.unit_grams && usdaMatch.unit_grams > 1 ? usdaMatch.unit_grams : 30;
    return { quantity: safeQty, unit: "scoop", grams: safeQty * gramMultiplier };
  }
  if (u === "slice" || u === "slices") {
    const gramMultiplier =
      usdaMatch?.unit_grams && usdaMatch.unit_grams > 1 ? usdaMatch.unit_grams : 30;
    return { quantity: safeQty, unit: "slice", grams: safeQty * gramMultiplier };
  }
  if (
    u === "piece" ||
    u === "pieces" ||
    u === "pcs" ||
    u === "pc" ||
    u === "whole" ||
    u === "egg" ||
    u === "eggs"
  ) {
    const gramMultiplier =
      usdaMatch?.unit_grams && usdaMatch.unit_grams > 1 ? usdaMatch.unit_grams : 50;
    return { quantity: safeQty, unit: "piece", grams: safeQty * gramMultiplier };
  }
  if (u === "roti" || u === "chapati" || u === "rotis" || u === "chapatis") {
    const gramMultiplier =
      usdaMatch?.unit_grams && usdaMatch.unit_grams > 1 ? usdaMatch.unit_grams : 40;
    return { quantity: safeQty, unit: "piece", grams: safeQty * gramMultiplier };
  }

  // Default fallback: if unit unrecognized, treat numeric value directly as grams
  return { quantity: safeQty, unit: u || "g", grams: safeQty };
}

let cachedUsdaList: USDAIngredient[] | null = null;
const ingredientMatchCache = new Map<string, USDAIngredient | null>();

export function clearNutritionEngineCache(): void {
  cachedUsdaList = null;
  ingredientMatchCache.clear();
}

/**
 * Clean ingredient search term to extract core food name
 */
export function cleanIngredientSearchTerm(text: string): string {
  if (!text) return "";
  let s = text.toLowerCase().trim();
  // Strip leading numbers and units e.g. "150g", "180 g", "2 pcs", "1/2 cup", "1.5 tbsp"
  s = s
    .replace(
      /^[\d\s/.-]+(g|gram|grams|kg|ml|l|piece|pieces|pcs|pc|cup|cups|tbsp|tsp|slice|slices|scoop|scoops|whole|egg|eggs|roti|rotis|chapati|chapatis)?\b/gi,
      "",
    )
    .trim();
  // Remove punctuation
  s = s
    .replace(/[()[\].,-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return s;
}

/**
 * Parse raw ingredient input string or object into core foodName, quantity, and unit
 */
export function parseIngredientInput(
  item: string | { name: string; quantity?: number; unit?: string },
): { foodName: string; quantity: number; unit: string; rawText: string } {
  let rawText = typeof item === "string" ? item : item.name || "";
  const explicitQty =
    typeof item === "object" &&
    typeof item.quantity === "number" &&
    !isNaN(item.quantity) &&
    item.quantity > 0
      ? item.quantity
      : undefined;
  const explicitUnit = typeof item === "object" && item.unit ? item.unit : undefined;

  rawText = rawText.trim();
  if (!rawText) {
    return { foodName: "", quantity: 0, unit: "g", rawText: "" };
  }

  // Check if string starts with numeric quantity e.g. "150g Chicken breast", "2 piece Whole Eggs", "1.5 cup milk"
  const match = rawText.match(/^\s*([\d]+(?:[./\s]\d+)?)\s*([a-zA-Z]+)?\b(?:\s+(.*))?$/i);

  if (match && match[1]) {
    const parsedQtyStr = match[1].trim();
    let parsedQty = 1;
    if (parsedQtyStr.includes("/")) {
      const parts = parsedQtyStr.split("/");
      parsedQty = parseFloat(parts[0]) / parseFloat(parts[1]);
    } else {
      parsedQty = parseFloat(parsedQtyStr);
    }
    if (isNaN(parsedQty) || parsedQty <= 0) parsedQty = 1;

    const parsedUnitStr = (match[2] || "").trim().toLowerCase();
    const remainingName = (match[3] || "").trim();

    const knownUnits = [
      "g",
      "gram",
      "grams",
      "kg",
      "kilogram",
      "kilograms",
      "ml",
      "milliliter",
      "milliliters",
      "l",
      "liter",
      "liters",
      "piece",
      "pieces",
      "pcs",
      "pc",
      "whole",
      "egg",
      "eggs",
      "slice",
      "slices",
      "roti",
      "rotis",
      "chapati",
      "chapatis",
      "cup",
      "cups",
      "tbsp",
      "tsp",
      "scoop",
      "scoops",
    ];

    if (knownUnits.includes(parsedUnitStr)) {
      return {
        foodName: remainingName || rawText,
        quantity: parsedQty,
        unit: parsedUnitStr,
        rawText,
      };
    } else {
      const combinedFoodName = [parsedUnitStr, remainingName].filter(Boolean).join(" ");
      return {
        foodName: combinedFoodName || rawText,
        quantity: parsedQty,
        unit: explicitUnit || "piece",
        rawText,
      };
    }
  }

  return {
    foodName: rawText,
    quantity: explicitQty && explicitQty > 0 ? explicitQty : 1,
    unit: explicitUnit || "g",
    rawText,
  };
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Match an ingredient name against local USDA database using strict exact/alias/prep-state scoring.
 */
export function matchUSDAIngredient(
  ingredientName: string,
  usdaList: USDAIngredient[],
): USDAIngredient | null {
  const cleanSearchTerm = cleanIngredientSearchTerm(ingredientName);
  if (!cleanSearchTerm) return null;

  if (ingredientMatchCache.has(cleanSearchTerm)) {
    return ingredientMatchCache.get(cleanSearchTerm) || null;
  }

  let bestMatch: USDAIngredient | null = null;
  let highestScore = -100;

  const searchTermHasCooked =
    /\b(cooked|steamed|boiled|grilled|roasted|seared|baked|fried)\b/i.test(ingredientName);
  const searchTermHasRaw = /\b(raw|uncooked|fresh)\b/i.test(ingredientName);
  const isCompoundDish =
    /\b(curry|gravy|biryani|masala|tikka|bhurji|makhani|korma|soup|stew|burger|pizza|sandwich|fried rice|pulao|salad|dosa|idli|paratha|naan|samosa|pasta|noodles|chai|coffee)\b/i.test(
      cleanSearchTerm,
    );

  for (const item of usdaList) {
    const itemNameLower = item.name.toLowerCase();
    const itemCleanName = cleanIngredientSearchTerm(item.name);
    let itemScore = 0;

    // Check exact name match
    if (itemNameLower === cleanSearchTerm || itemCleanName === cleanSearchTerm) {
      itemScore = 100;
    } else {
      // Check exact alias matches first
      for (const alias of item.aliases) {
        const aliasLower = alias.toLowerCase().trim();
        if (aliasLower === cleanSearchTerm) {
          itemScore = Math.max(itemScore, 98);
          break;
        }
      }

      // If not exact alias match, test whole-word boundaries
      if (itemScore === 0) {
        for (const alias of item.aliases) {
          const aliasLower = alias.toLowerCase().trim();
          if (aliasLower.length < 3) continue;

          const aliasRegex = new RegExp(`(^|\\s)${escapeRegExp(aliasLower)}(\\s|$)`, "i");
          if (aliasRegex.test(cleanSearchTerm)) {
            // Whole word alias matched
            const lengthRatio =
              aliasLower.length / Math.max(aliasLower.length, cleanSearchTerm.length);
            const subScore = 70 + Math.round(lengthRatio * 20);
            itemScore = Math.max(itemScore, subScore);
          } else {
            const searchRegex = new RegExp(`(^|\\s)${escapeRegExp(cleanSearchTerm)}(\\s|$)`, "i");
            if (searchRegex.test(aliasLower)) {
              const lengthRatio = cleanSearchTerm.length / aliasLower.length;
              const subScore = 65 + Math.round(lengthRatio * 20);
              itemScore = Math.max(itemScore, subScore);
            }
          }
        }
      }
    }

    if (itemScore === 0) {
      // Word boundary overlap
      const searchWords = cleanSearchTerm.split(/\s+/).filter((w) => w.length > 2);
      let matchedWordCount = 0;
      for (const word of searchWords) {
        const wordRegex = new RegExp(`(^|\\s)${escapeRegExp(word)}(\\s|$)`, "i");
        if (
          wordRegex.test(itemNameLower) ||
          item.aliases.some((a) => wordRegex.test(a.toLowerCase()))
        ) {
          matchedWordCount++;
        }
      }
      if (searchWords.length > 0) {
        const wordRatio = matchedWordCount / searchWords.length;
        if (wordRatio >= 0.5) {
          itemScore = Math.round(wordRatio * 55);
        }
      }
    }

    // Penalize matching raw ingredients if user searched a compound prepared dish
    if (isCompoundDish) {
      const itemIsCompound =
        /\b(curry|gravy|biryani|masala|tikka|bhurji|makhani|korma|soup|stew|burger|pizza|sandwich|fried rice|pulao|salad|dosa|idli|paratha|naan|samosa|pasta|noodles|chai|coffee)\b/i.test(
          itemNameLower,
        ) ||
        item.aliases.some((a) =>
          /\b(curry|gravy|biryani|masala|tikka|bhurji|makhani|korma|soup|stew|burger|pizza|sandwich|fried rice|pulao|salad|dosa|idli|paratha|naan|samosa|pasta|noodles|chai|coffee)\b/i.test(
            a,
          ),
        );
      if (
        !itemIsCompound &&
        (item.id === "usda-28" ||
          item.id === "usda-20" ||
          item.id === "usda-1" ||
          item.id === "usda-3")
      ) {
        // e.g. "Butter", "Cooking oil", "Chicken Breast Raw"
        itemScore -= 50;
      }
    }

    if (itemScore < 35) continue;

    // Prep state adjustment (cooked vs raw)
    const itemHasCooked =
      /\b(cooked|steamed|boiled|grilled|roasted|seared|baked|fried)\b/i.test(itemNameLower) ||
      item.aliases.some((a) => /\b(cooked|steamed|boiled|grilled)\b/i.test(a));
    const itemHasRaw =
      /\b(raw|uncooked)\b/i.test(itemNameLower) ||
      item.aliases.some((a) => /\b(raw|uncooked)\b/i.test(a));

    if (searchTermHasCooked && itemHasCooked) itemScore += 10;
    if (searchTermHasRaw && itemHasRaw) itemScore += 10;
    if (searchTermHasCooked && itemHasRaw) itemScore -= 25;
    if (searchTermHasRaw && itemHasCooked) itemScore -= 25;

    if (itemScore > highestScore) {
      highestScore = itemScore;
      bestMatch = item;
    }
  }

  const finalMatch = highestScore >= 45 ? bestMatch : null;
  ingredientMatchCache.set(cleanSearchTerm, finalMatch);
  return finalMatch;
}

/**
 * Local USDA Nutrition Engine:
 * Calculates nutrition deterministically using the USDA database formula:
 * nutrient_for_quantity = (nutrient_per_100g / 100) * quantity_in_grams
 *
 * Unmatched ingredients are NOT assigned guessed numbers; they are labeled "Unmatched ingredient"
 * with zero nutrition so the AI never invents macros.
 */
export async function calculateRecipeNutritionLocally(
  rawIngredients: Array<{ name: string; quantity?: number; unit?: string } | string>,
): Promise<CalculatedRecipeNutrition> {
  if (!cachedUsdaList) {
    cachedUsdaList = await getAllUSDAIngredientsFromSQLite();
  }
  const usdaList = cachedUsdaList;

  let totCal = 0;
  let totPro = 0;
  let totCarb = 0;
  let totFat = 0;
  let totFib = 0;
  let totSug = 0;
  let totSod = 0;
  let totIron = 0;
  let totCalc = 0;
  let totMag = 0;
  let totPot = 0;
  let totVitA = 0;
  let totVitB12 = 0;
  let totVitD = 0;
  let totOmega3 = 0;
  let totCost = 0;
  let unmatchedCount = 0;

  const recipeIngredients: RecipeIngredient[] = [];

  for (const rawItem of rawIngredients) {
    const parsed = parseIngredientInput(rawItem);
    const rawName = parsed.rawText;
    const foodSearchTerm = parsed.foodName;

    const usdaMatch = matchUSDAIngredient(foodSearchTerm || rawName, usdaList);
    const { quantity, unit, grams } = normalizeUnitAndQuantity(
      parsed.quantity,
      parsed.unit,
      usdaMatch,
    );

    let cal = 0;
    let pro = 0;
    let carb = 0;
    let fat = 0;
    let fib = 0;
    let sug = 0;
    let sod = 0;
    let iron = 0;
    let calc = 0;
    let mag = 0;
    let pot = 0;
    let vitA = 0;
    let vitB12 = 0;
    let vitD = 0;
    let o3 = 0;
    let cost = 0;

    let normalizedName = "";

    if (usdaMatch) {
      // Standard USDA Formula: nutrient_for_quantity = (nutrient_per_100g / 100) * quantity_in_grams
      const factor = grams / 100;
      cal = Math.round(usdaMatch.calories_per_100g * factor);
      pro = Number((usdaMatch.protein_per_100g * factor).toFixed(1));
      carb = Number((usdaMatch.carbs_per_100g * factor).toFixed(1));
      fat = Number((usdaMatch.fat_per_100g * factor).toFixed(1));
      fib = Number((usdaMatch.fiber_per_100g * factor).toFixed(1));
      sug = Number((usdaMatch.sugar_per_100g * factor).toFixed(1));
      sod = Math.round(usdaMatch.sodium_per_100g * factor);
      iron = Number((usdaMatch.iron_per_100g * factor).toFixed(1));
      calc = Math.round(usdaMatch.calcium_per_100g * factor);
      mag = Math.round(usdaMatch.magnesium_per_100g * factor);
      pot = Math.round(usdaMatch.potassium_per_100g * factor);
      vitA = Math.round(usdaMatch.vit_a_per_100g * factor);
      vitB12 = Number((usdaMatch.vit_b12_per_100g * factor).toFixed(1));
      vitD = Number((usdaMatch.vit_d_per_100g * factor).toFixed(1));
      o3 = Number((usdaMatch.omega3_per_100g * factor).toFixed(2));
      cost = Math.round(usdaMatch.avg_cost_per_100g * factor);
      normalizedName = usdaMatch.name;
    } else {
      unmatchedCount++;
      normalizedName = `Unmatched ingredient (${rawName})`;
      cal = 0;
      pro = 0;
      carb = 0;
      fat = 0;
      fib = 0;
      sug = 0;
      sod = 0;
      iron = 0;
      calc = 0;
      mag = 0;
      pot = 0;
      vitA = 0;
      vitB12 = 0;
      vitD = 0;
      o3 = 0;
      cost = 0;
    }

    totCal += cal;
    totPro += pro;
    totCarb += carb;
    totFat += fat;
    totFib += fib;
    totSug += sug;
    totSod += sod;
    totIron += iron;
    totCalc += calc;
    totMag += mag;
    totPot += pot;
    totVitA += vitA;
    totVitB12 += vitB12;
    totVitD += vitD;
    totOmega3 += o3;
    totCost += cost;

    recipeIngredients.push({
      name: rawName,
      normalized_name: normalizedName,
      quantity,
      unit,
      estimated_cost: cost,
      calories: cal,
      protein_g: pro,
      carbs_g: carb,
      fat_g: fat,
      fiber_g: fib,
      sugar_g: sug,
    });
  }

  const matchedFoods = recipeIngredients.map((i) => i.normalized_name);
  const finalNutrition = {
    calories: Math.round(totCal),
    protein: Number(totPro.toFixed(1)),
    carbs: Number(totCarb.toFixed(1)),
    fat: Number(totFat.toFixed(1)),
    fiber: Number(totFib.toFixed(1)),
  };

  if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
    console.log("MEAL calculation:");
    console.log("INGREDIENTS:", rawIngredients);
    console.log("MATCHED FOODS:", matchedFoods);
    console.log("INGREDIENT NUTRITION:", recipeIngredients);
    console.log("FINAL NUTRITION:", finalNutrition);
  }

  return {
    calories: Math.round(totCal),
    protein_g: Number(totPro.toFixed(1)),
    carbs_g: Number(totCarb.toFixed(1)),
    fat_g: Number(totFat.toFixed(1)),
    fiber_g: Number(totFib.toFixed(1)),
    sugar_g: Number(totSug.toFixed(1)),
    sodium_mg: Math.round(totSod),
    iron_mg: Number(totIron.toFixed(1)),
    calcium_mg: Math.round(totCalc),
    magnesium_mg: Math.round(totMag),
    potassium_mg: Math.round(totPot),
    vit_a_ug: Math.round(totVitA),
    vit_b12_ug: Number(totVitB12.toFixed(1)),
    vit_d_ug: Number(totVitD.toFixed(1)),
    omega3_g: Number(totOmega3.toFixed(2)),
    estimatedCost: Math.max(0, Math.round(totCost)),
    parsedIngredients: recipeIngredients,
    unmatchedIngredientsCount: unmatchedCount,
  };
}

/**
 * Verification test runner for nutrition calculations:
 * Tests 50% serving, 200% serving, ingredient weight change, and unmatched ingredients.
 */
export async function runNutritionEngineVerificationTests(): Promise<{
  success: boolean;
  testResults: Array<{ name: string; passed: boolean; details: string }>;
}> {
  const results: Array<{ name: string; passed: boolean; details: string }> = [];

  // Base Meal: 150g cooked chicken breast, 180g cooked white rice, 70g steamed broccoli
  const baseIngredients = [
    { name: "cooked chicken breast", quantity: 150, unit: "g" },
    { name: "cooked white rice", quantity: 180, unit: "g" },
    { name: "steamed broccoli", quantity: 70, unit: "g" },
  ];

  const baseCalculated = await calculateRecipeNutritionLocally(baseIngredients);

  // Test 1: Base Meal calculation accuracy
  const expectedBaseCals = Math.round(150 * 1.65 + 180 * 1.3 + 70 * 0.34); // 247.5 + 234 + 23.8 = 505 kcal
  const t1Passed = Math.abs(baseCalculated.calories - expectedBaseCals) <= 2;
  results.push({
    name: "Test 1: Base Meal Math",
    passed: t1Passed,
    details: `Expected ~${expectedBaseCals} kcal, got ${baseCalculated.calories} kcal. Protein: ${baseCalculated.protein_g}g, Carbs: ${baseCalculated.carbs_g}g, Fat: ${baseCalculated.fat_g}g`,
  });

  // Test 2: 50% Serving size scaling
  const halfIngredients = baseIngredients.map((ing) => ({
    ...ing,
    quantity: ing.quantity * 0.5,
  }));
  const halfCalculated = await calculateRecipeNutritionLocally(halfIngredients);
  const expectedHalfCals = Math.round(baseCalculated.calories * 0.5);
  const t2Passed = Math.abs(halfCalculated.calories - expectedHalfCals) <= 2;
  results.push({
    name: "Test 2: 50% Serving Proportional Scaling",
    passed: t2Passed,
    details: `50% serving produced ${halfCalculated.calories} kcal (expected ${expectedHalfCals} kcal, 50% of original ${baseCalculated.calories} kcal)`,
  });

  // Test 3: 2x Serving size scaling
  const doubleIngredients = baseIngredients.map((ing) => ({
    ...ing,
    quantity: ing.quantity * 2,
  }));
  const doubleCalculated = await calculateRecipeNutritionLocally(doubleIngredients);
  const expectedDoubleCals = Math.round(baseCalculated.calories * 2);
  const t3Passed = Math.abs(doubleCalculated.calories - expectedDoubleCals) <= 3;
  results.push({
    name: "Test 3: 2x Serving Proportional Scaling",
    passed: t3Passed,
    details: `2x serving produced ${doubleCalculated.calories} kcal (expected ${expectedDoubleCals} kcal, 2x of original ${baseCalculated.calories} kcal)`,
  });

  // Test 4: Single ingredient weight change (increase broccoli from 70g to 140g)
  const modifiedBroccoliIngs = [
    { name: "cooked chicken breast", quantity: 150, unit: "g" },
    { name: "cooked white rice", quantity: 180, unit: "g" },
    { name: "steamed broccoli", quantity: 140, unit: "g" }, // doubled broccoli (+70g = +24 kcal)
  ];
  const modCalculated = await calculateRecipeNutritionLocally(modifiedBroccoliIngs);
  const expectedBroccoliDiff = Math.round(70 * 0.34); // ~24 kcal
  const actualDiff = modCalculated.calories - baseCalculated.calories;
  const t4Passed = Math.abs(actualDiff - expectedBroccoliDiff) <= 2;
  results.push({
    name: "Test 4: Single Ingredient Weight Modification",
    passed: t4Passed,
    details: `Doubling broccoli from 70g to 140g increased calories by ${actualDiff} kcal (expected +${expectedBroccoliDiff} kcal)`,
  });

  // Test 5: Unmatched ingredient handling
  const unmatchedIngs = [
    { name: "cooked chicken breast", quantity: 150, unit: "g" },
    { name: "Unknown Space Mineral XYZ", quantity: 100, unit: "g" },
  ];
  const unmatchedCalc = await calculateRecipeNutritionLocally(unmatchedIngs);
  const unmatchedItem = unmatchedCalc.parsedIngredients.find((i) =>
    i.name.includes("Unknown Space Mineral"),
  );
  const t5Passed =
    Boolean(unmatchedItem?.normalized_name?.startsWith("Unmatched ingredient")) &&
    unmatchedItem?.calories === 0;
  results.push({
    name: "Test 5: Unmatched Ingredient Handling (No Guessed Macros)",
    passed: t5Passed,
    details: `Unmatched ingredient normalized to "${unmatchedItem?.normalized_name}" with ${unmatchedItem?.calories} kcal`,
  });

  const allPassed = results.every((r) => r.passed);
  return { success: allPassed, testResults: results };
}
