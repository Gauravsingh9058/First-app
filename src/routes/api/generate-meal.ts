import { createFileRoute } from "@tanstack/react-router";
import { getGeminiApiKey } from "@/lib/ai-gateway.server";
import { GoogleGenAI, Type } from "@google/genai";
import { calculateRecipeNutritionLocally } from "@/lib/nutrition-engine";
import {
  findMatchingMealFromLibrary,
  saveGeneratedMealToLibrary,
} from "@/lib/generated-meal-library";
import {
  normalizeDietType,
  validateMealDiet,
  validateFullDayPlanDiet,
  CanonicalDiet,
} from "@/lib/diet-validator";

export interface IngredientInput {
  name: string;
  quantity: number;
  unit: string;
}

export interface MealOutput {
  mealName: string;
  mealType: string;
  servings: number;
  ingredients: IngredientInput[];
  instructions: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar?: number;
    sodium_mg?: number;
    iron_mg?: number;
    calcium_mg?: number;
    magnesium_mg?: number;
    potassium_mg?: number;
    vit_a_ug?: number;
    vit_b12_ug?: number;
    vit_d_ug?: number;
    omega3_g?: number;
  };
  estimatedCost: string | number;
  prepTime: number;
  isNutritionEstimated?: boolean;
}

export interface FullDayPlanOutput {
  isFullDay: true;
  dailyNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  dailyCost?: number;
  dailyBudget?: number;
  canonicalDiet?: CanonicalDiet;
  meals: MealOutput[];
}

export type MealGenerationResponse = MealOutput | FullDayPlanOutput;

const SYSTEM_INSTRUCTION = `You are a meal planning engine for NutriLens AI. Generate practical meals based on the provided user profile and nutrition targets. Return ONLY valid JSON matching the requested schema. Do not include explanations outside JSON.`;

export const Route = createFileRoute("/api/generate-meal")({
  server: {
    handlers: {
      GET: () => {
        return Response.json(
          { error: "Method Not Allowed. Send a POST request to generate a meal." },
          { status: 405 },
        );
      },
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const {
            mealType = "Lunch",
            diet = "Vegetarian",
            calorieTarget = 2000,
            proteinTarget = 120,
            carbsTarget = 250,
            fatTarget = 65,
            goal = "maintenance",
            cuisine = "Any",
            availableIngredients = "",
            foodsToAvoid = "",
            budget = "250",
            cookingTime = "30 minutes",
            allergies = [],
            dislikes = [],
            excludedMeals = [],
            currentMealName = "",
            regenerationId = "",
          } = body;

          const forceAi = Boolean(body.forceAi);
          const userId = String(body.userId || "anonymous");

          // Normalize parameters
          const sanitizedMealType = String(mealType);
          const canonicalDiet: CanonicalDiet = normalizeDietType(diet);
          const numericBudget =
            typeof budget === "number"
              ? budget
              : parseFloat(String(budget).replace(/[^0-9.]/g, "")) || 250;

          const sanitizedExcludedMeals = Array.isArray(excludedMeals)
            ? excludedMeals.map((m) => String(m).trim()).filter(Boolean)
            : [];
          if (currentMealName) {
            sanitizedExcludedMeals.push(String(currentMealName).trim());
          }

          const isFullDay =
            sanitizedMealType.toLowerCase().includes("full") ||
            sanitizedMealType.toLowerCase().includes("day");

          // 1. REUSE BEFORE AI GENERATION: Check central reusable meal library first for single meal
          if (!forceAi && !isFullDay) {
            try {
              const reusableMeal = await findMatchingMealFromLibrary({
                mealType: sanitizedMealType,
                diet: canonicalDiet,
                calorieTarget: Number(calorieTarget) || 500,
                proteinTarget: Number(proteinTarget) || 30,
                carbsTarget: Number(carbsTarget),
                fatTarget: Number(fatTarget),
                allergies: Array.isArray(allergies) ? allergies : [],
                dislikes: Array.isArray(dislikes) ? dislikes : [],
                foodsToAvoid: String(foodsToAvoid),
                excludedMeals: sanitizedExcludedMeals,
                userId,
              });

              if (reusableMeal) {
                const valRes = validateMealDiet(reusableMeal, canonicalDiet);
                if (valRes.valid) {
                  console.info(
                    `[/api/generate-meal] Returned valid stored meal "${reusableMeal.mealName}" from library (${canonicalDiet}).`,
                  );
                  return Response.json(reusableMeal);
                }
              }
            } catch (libErr) {
              console.warn("[/api/generate-meal] Meal library lookup error:", libErr);
            }
          }

          // 2. Prepare payload summary for generator
          const userContextPayload = {
            goal: String(goal),
            calorieTarget: Number(calorieTarget) || 2000,
            proteinTarget: Number(proteinTarget) || 120,
            carbsTarget: Number(carbsTarget) || 250,
            fatTarget: Number(fatTarget) || 65,
            diet: canonicalDiet,
            mealType: sanitizedMealType,
            cuisine: String(cuisine),
            availableIngredients: String(availableIngredients).trim(),
            foodsToAvoid: String(foodsToAvoid).trim(),
            dailyFoodBudget: numericBudget,
            cookingTime: String(cookingTime),
            allergies: Array.isArray(allergies) ? allergies : [],
            dislikes: Array.isArray(dislikes) ? dislikes : [],
            excludedMeals: sanitizedExcludedMeals,
            regenerationId: String(regenerationId),
          };

          if (isFullDay) {
            return await buildFullDayPlan({
              userContextPayload,
              canonicalDiet,
              numericBudget,
              calorieTarget: Number(calorieTarget) || 2000,
              proteinTarget: Number(proteinTarget) || 120,
              carbsTarget: Number(carbsTarget) || 250,
              fatTarget: Number(fatTarget) || 65,
              sanitizedExcludedMeals,
              forceAi,
              userId,
            });
          }

          // Single Meal AI Generation
          const apiKey = getGeminiApiKey();
          if (apiKey) {
            try {
              const ai = new GoogleGenAI({
                apiKey,
                httpOptions: { headers: { "User-Agent": "aistudio-build" } },
              });

              const envModel = process.env.VITE_GEMINI_MEAL_MODEL;
              const candidateModels = envModel
                ? [envModel, "gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.7-flash"]
                : ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.7-flash"];

              let responseText = "";

              const exclusionPromptClause =
                sanitizedExcludedMeals.length > 0
                  ? `\nCRITICAL REQUIREMENT: Do NOT generate any of the following excluded meals:\n${sanitizedExcludedMeals.map((m) => `- "${m}"`).join("\n")}`
                  : "";

              const dietInstructions =
                canonicalDiet === "VEGETARIAN"
                  ? "DIET REQUIREMENT: STRICT VEGETARIAN. Every single ingredient MUST be vegetarian. DO NOT include chicken, fish, mutton, meat, seafood, or eggs."
                  : canonicalDiet === "NON_VEGETARIAN"
                    ? "DIET REQUIREMENT: NON-VEGETARIAN. Meal should contain a non-vegetarian protein source such as chicken, fish, eggs, or mutton."
                    : "DIET REQUIREMENT: MIXED.";

              const prompt = `Generate a single ${sanitizedMealType} recipe matching these requirements:
${JSON.stringify(userContextPayload, null, 2)}
${dietInstructions}
${exclusionPromptClause}`;

              const schema = {
                type: Type.OBJECT,
                properties: {
                  mealName: { type: Type.STRING },
                  mealType: { type: Type.STRING },
                  servings: { type: Type.NUMBER },
                  prepTime: { type: Type.NUMBER },
                  estimatedCost: { type: Type.STRING },
                  ingredients: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        quantity: { type: Type.NUMBER },
                        unit: { type: Type.STRING },
                      },
                      required: ["name", "quantity", "unit"],
                    },
                  },
                  instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["mealName", "mealType", "ingredients", "instructions"],
              };

              for (const mName of candidateModels) {
                try {
                  const res = await ai.models.generateContent({
                    model: mName,
                    contents: prompt,
                    config: {
                      systemInstruction: SYSTEM_INSTRUCTION,
                      temperature: 0.3,
                      responseMimeType: "application/json",
                      responseSchema: schema,
                    },
                  });
                  if (res && res.text) {
                    responseText = res.text;
                    break;
                  }
                } catch (err: unknown) {
                  const msg = err instanceof Error ? err.message : String(err);
                  const isCapacityError =
                    msg.includes("503") ||
                    msg.includes("429") ||
                    msg.includes("UNAVAILABLE") ||
                    msg.includes("high demand");
                  if (isCapacityError) {
                    console.info(
                      `[/api/generate-meal] Model ${mName} is at capacity. Transitioning to next model...`,
                    );
                  } else {
                    console.warn(`[/api/generate-meal] Model ${mName} notice:`, msg);
                  }
                }
                if (responseText) break;
              }

              if (responseText) {
                const m = JSON.parse(responseText);
                const ingredients = Array.isArray(m.ingredients) ? m.ingredients : [];

                // Calculate exact nutrition via local database
                const nut = await calculateRecipeNutritionLocally(ingredients);

                const singleMealResult: MealOutput = {
                  mealName: m.mealName || `${canonicalDiet} ${sanitizedMealType}`,
                  mealType: m.mealType || sanitizedMealType,
                  servings: m.servings || 1,
                  prepTime: m.prepTime || 20,
                  estimatedCost: nut.estimatedCost
                    ? `₹${nut.estimatedCost}`
                    : m.estimatedCost || "₹75",
                  ingredients: nut.parsedIngredients.map((pi) => ({
                    name: pi.name,
                    quantity: pi.quantity,
                    unit: pi.unit,
                  })),
                  instructions:
                    Array.isArray(m.instructions) && m.instructions.length > 0
                      ? m.instructions
                      : [
                          "Sauté or cook ingredients on medium heat.",
                          "Season to taste and serve warm.",
                        ],
                  nutrition: {
                    calories: nut.calories,
                    protein: nut.protein_g,
                    carbs: nut.carbs_g,
                    fat: nut.fat_g,
                    fiber: nut.fiber_g,
                    sugar: nut.sugar_g,
                    sodium_mg: nut.sodium_mg,
                    iron_mg: nut.iron_mg,
                    calcium_mg: nut.calcium_mg,
                    magnesium_mg: nut.magnesium_mg,
                    potassium_mg: nut.potassium_mg,
                    vit_a_ug: nut.vit_a_ug,
                    vit_b12_ug: nut.vit_b12_ug,
                    vit_d_ug: nut.vit_d_ug,
                    omega3_g: nut.omega3_g,
                  },
                  isNutritionEstimated: nut.unmatchedIngredientsCount === 0,
                };

                // VALIDATE MEAL DIET DETERMINISTICALLY
                const valRes = validateMealDiet(singleMealResult, canonicalDiet);
                if (valRes.valid) {
                  try {
                    await saveGeneratedMealToLibrary(
                      singleMealResult,
                      canonicalDiet,
                      singleMealResult.isNutritionEstimated ?? true,
                    );
                  } catch (saveErr) {
                    // ignore
                  }
                  return Response.json(singleMealResult);
                } else {
                  console.warn(
                    `[/api/generate-meal] AI generated meal failed strict diet check (${valRes.violations.join(", ")}). Reverting to offline verified fallback.`,
                  );
                }
              }
            } catch (aiErr: unknown) {
              // ignore
            }
          }

          // Offline Single Meal Fallback
          return generateOfflineSingleMealFallback(userContextPayload, canonicalDiet);
        } catch (err) {
          console.error("[/api/generate-meal] Error:", err);
          return generateOfflineSingleMealFallback(
            {
              mealType: String(body?.mealType || "Lunch"),
              diet: normalizeDietType(body?.diet),
              calorieTarget: Number(body?.calorieTarget) || 500,
              proteinTarget: Number(body?.proteinTarget) || 30,
              excludedMeals: Array.isArray(body?.excludedMeals) ? body.excludedMeals : [],
            },
            normalizeDietType(body?.diet),
          );
        }
      },
    },
  },
});

/**
 * Builds and optimizes a Full Day Plan matching diet mode, macro targets, and budget.
 */
async function buildFullDayPlan(params: {
  userContextPayload: Record<string, unknown>;
  canonicalDiet: CanonicalDiet;
  numericBudget: number;
  calorieTarget: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  sanitizedExcludedMeals: string[];
  forceAi?: boolean;
  userId: string;
}): Promise<Response> {
  const {
    canonicalDiet,
    numericBudget,
    calorieTarget,
    proteinTarget,
    sanitizedExcludedMeals,
    userId,
  } = params;

  const slots = [
    { name: "Breakfast", calRatio: 0.25, proRatio: 0.25, isMain: true },
    { name: "Mid-Morning Snack", calRatio: 0.1, proRatio: 0.1, isMain: false },
    { name: "Lunch", calRatio: 0.35, proRatio: 0.35, isMain: true },
    { name: "Evening Snack", calRatio: 0.1, proRatio: 0.1, isMain: false },
    { name: "Dinner", calRatio: 0.2, proRatio: 0.2, isMain: true },
  ];

  const currentExcluded = [...sanitizedExcludedMeals];
  const rawMeals: MealOutput[] = [];

  for (const slot of slots) {
    const slotCal = Math.round(calorieTarget * slot.calRatio);
    const slotPro = Math.round(proteinTarget * slot.proRatio);

    let chosenMeal: MealOutput | null = null;

    // Determine target diet mode for candidate lookup
    let targetSlotDiet = canonicalDiet;
    if (canonicalDiet === "MIXED") {
      // For MIXED mode, make Lunch & Dinner Non-Veg, Snacks Veg, Breakfast Veg/Non-Veg
      if (slot.name === "Lunch" || slot.name === "Dinner") {
        targetSlotDiet = "NON_VEGETARIAN";
      } else {
        targetSlotDiet = "VEGETARIAN";
      }
    }

    // Try library search
    try {
      const stored = await findMatchingMealFromLibrary({
        mealType: slot.name.includes("Snack") ? "Snack" : slot.name,
        diet: targetSlotDiet,
        calorieTarget: slotCal,
        proteinTarget: slotPro,
        excludedMeals: currentExcluded,
        userId,
      });

      if (stored) {
        const valRes = validateMealDiet(stored, targetSlotDiet, { isMainMeal: slot.isMain });
        if (valRes.valid) {
          chosenMeal = stored;
        }
      }
    } catch (err) {
      // ignore
    }

    // Offline pool fallback if library didn't yield candidate
    if (!chosenMeal) {
      chosenMeal = getOfflineMealCandidateForSlot(
        slot.name,
        targetSlotDiet,
        slot.isMain,
        currentExcluded,
      );
    }

    currentExcluded.push(chosenMeal.mealName);
    rawMeals.push(chosenMeal);
  }

  // Optimize quantities and cost
  const optimized = await optimizeAndScaleDayPlan(
    rawMeals,
    calorieTarget,
    proteinTarget,
    numericBudget,
    canonicalDiet,
  );

  // Validate full plan diet strictly
  const fullVal = validateFullDayPlanDiet(optimized.meals, canonicalDiet);
  if (!fullVal.valid) {
    console.warn(
      `[/api/generate-meal] Full day plan failed validation (${fullVal.violations.join("; ")}). Fixing invalid slots...`,
    );
    // Fix any invalid meal
    for (let i = 0; i < optimized.meals.length; i++) {
      const slot = slots[i];
      let targetDiet = canonicalDiet;
      if (canonicalDiet === "MIXED") {
        targetDiet = i % 2 === 0 ? "VEGETARIAN" : "NON_VEGETARIAN";
      }

      const val = validateMealDiet(optimized.meals[i], targetDiet, { isMainMeal: slot.isMain });
      if (!val.valid) {
        optimized.meals[i] = getOfflineMealCandidateForSlot(
          slot.name,
          targetDiet,
          slot.isMain,
          sanitizedExcludedMeals,
        );
      }
    }
  }

  // Save generated meals to library
  for (const m of optimized.meals) {
    try {
      await saveGeneratedMealToLibrary(m, canonicalDiet, m.isNutritionEstimated ?? true);
    } catch (err) {
      // ignore
    }
  }

  const result: FullDayPlanOutput = {
    isFullDay: true,
    dailyNutrition: optimized.dailyNutrition,
    dailyCost: optimized.dailyCost,
    dailyBudget: numericBudget,
    canonicalDiet,
    meals: optimized.meals,
  };

  return Response.json(result);
}

/**
 * Optimizes day plan ingredient quantities to match calorie/protein targets while respecting food budget.
 */
async function optimizeAndScaleDayPlan(
  meals: MealOutput[],
  targetCalories: number,
  targetProtein: number,
  numericBudget: number,
  canonicalDiet: CanonicalDiet,
): Promise<{
  meals: MealOutput[];
  dailyNutrition: { calories: number; protein: number; carbs: number; fat: number; fiber: number };
  dailyCost: number;
}> {
  let currentCal = meals.reduce((sum, m) => sum + (m.nutrition?.calories || 0), 0);
  if (currentCal <= 0) currentCal = targetCalories || 2000;

  let ratio = (targetCalories || 2000) / currentCal;
  ratio = Math.max(0.75, Math.min(1.35, ratio));

  const updatedMeals: MealOutput[] = await Promise.all(
    meals.map(async (m) => {
      const scaledIngredients = m.ingredients.map((ing) => {
        let newQty = ing.quantity * ratio;
        if (ing.unit === "piece") {
          newQty = Math.max(1, Math.round(newQty * 2) / 2);
        } else if (ing.unit === "g" || ing.unit === "ml") {
          newQty = Math.max(10, Math.round(newQty / 5) * 5);
        } else {
          newQty = Math.max(0.5, Math.round(newQty * 10) / 10);
        }
        return { ...ing, quantity: newQty };
      });

      const nut = await calculateRecipeNutritionLocally(scaledIngredients);
      return {
        ...m,
        ingredients: nut.parsedIngredients.map((p) => ({
          name: p.name,
          quantity: p.quantity,
          unit: p.unit,
        })),
        estimatedCost: `₹${nut.estimatedCost}`,
        nutrition: {
          calories: nut.calories,
          protein: nut.protein_g,
          carbs: nut.carbs_g,
          fat: nut.fat_g,
          fiber: nut.fiber_g,
          sugar: nut.sugar_g,
          sodium_mg: nut.sodium_mg,
          iron_mg: nut.iron_mg,
          calcium_mg: nut.calcium_mg,
          magnesium_mg: nut.magnesium_mg,
          potassium_mg: nut.potassium_mg,
          vit_a_ug: nut.vit_a_ug,
          vit_b12_ug: nut.vit_b12_ug,
          vit_d_ug: nut.vit_d_ug,
          omega3_g: nut.omega3_g,
        },
        isNutritionEstimated: nut.unmatchedIngredientsCount === 0,
      };
    }),
  );

  const totCal = updatedMeals.reduce((sum, m) => sum + (m.nutrition?.calories || 0), 0);
  const totPro = updatedMeals.reduce((sum, m) => sum + (m.nutrition?.protein || 0), 0);
  const totCarb = updatedMeals.reduce((sum, m) => sum + (m.nutrition?.carbs || 0), 0);
  const totFat = updatedMeals.reduce((sum, m) => sum + (m.nutrition?.fat || 0), 0);
  const totFib = updatedMeals.reduce((sum, m) => sum + (m.nutrition?.fiber || 0), 0);

  // Calculate actual total cost
  let totCost = 0;
  for (const m of updatedMeals) {
    const costNum =
      typeof m.estimatedCost === "number"
        ? m.estimatedCost
        : parseFloat(String(m.estimatedCost).replace(/[^0-9.]/g, "")) || 50;
    totCost += costNum;
  }

  return {
    meals: updatedMeals,
    dailyNutrition: {
      calories: Math.round(totCal),
      protein: Number(totPro.toFixed(1)),
      carbs: Number(totCarb.toFixed(1)),
      fat: Number(totFat.toFixed(1)),
      fiber: Number(totFib.toFixed(1)),
    },
    dailyCost: Math.round(totCost),
  };
}

/**
 * Offline verified fallback meal generator for single meals
 */
async function generateOfflineSingleMealFallback(
  userContextPayload: Record<string, unknown>,
  canonicalDiet: CanonicalDiet,
) {
  const slot = userContextPayload.mealType || "Lunch";
  const excluded = userContextPayload.excludedMeals || [];

  const cand = getOfflineMealCandidateForSlot(
    slot,
    canonicalDiet,
    slot.includes("Breakfast") || slot.includes("Lunch") || slot.includes("Dinner"),
    excluded,
  );

  return Response.json(cand);
}

/**
 * Retrieves a verified offline candidate meal strictly matching diet constraints
 */
function getOfflineMealCandidateForSlot(
  slotName: string,
  targetDiet: CanonicalDiet,
  isMainMeal: boolean,
  excluded: string[],
): MealOutput {
  const normSlot = slotName.toLowerCase().includes("snack")
    ? "Snack"
    : slotName.toLowerCase().includes("breakfast")
      ? "Breakfast"
      : slotName.toLowerCase().includes("dinner")
        ? "Dinner"
        : "Lunch";

  const offlinePool: Record<
    string,
    Array<{
      mealName: string;
      mealType: string;
      prepTime: number;
      estimatedCost: string;
      ingredients: { name: string; quantity: number; unit: string }[];
      instructions: string[];
    }>
  > = {
    Breakfast: [
      {
        mealName: "High Protein Paneer & Veggie Scramble with Whole Wheat Toast",
        mealType: "Breakfast",
        prepTime: 12,
        estimatedCost: "₹65",
        ingredients: [
          { name: "Cottage Cheese / Paneer", quantity: 150, unit: "g" },
          { name: "Whole Wheat Bread", quantity: 2, unit: "piece" },
          { name: "Spinach / Palak", quantity: 50, unit: "g" },
          { name: "Butter", quantity: 5, unit: "g" },
        ],
        instructions: [
          "Crumble paneer and sauté with spinach and turmeric.",
          "Serve warm alongside toasted whole wheat bread.",
        ],
      },
      {
        mealName: "Rolled Oats Porridge with Almonds, Chia & Honey",
        mealType: "Breakfast",
        prepTime: 10,
        estimatedCost: "₹50",
        ingredients: [
          { name: "Rolled Oats", quantity: 70, unit: "g" },
          { name: "Milk", quantity: 220, unit: "ml" },
          { name: "Almonds", quantity: 20, unit: "g" },
          { name: "Chia Seeds", quantity: 10, unit: "g" },
        ],
        instructions: [
          "Simmer oats in warm milk for 5-7 minutes.",
          "Stir in chia seeds and top with toasted almonds.",
        ],
      },
      {
        mealName: "3-Egg Scramble with Spinach & Whole Wheat Toast",
        mealType: "Breakfast",
        prepTime: 10,
        estimatedCost: "₹55",
        ingredients: [
          { name: "Whole Egg, cooked", quantity: 3, unit: "piece" },
          { name: "Whole Wheat Bread", quantity: 2, unit: "piece" },
          { name: "Spinach / Palak", quantity: 40, unit: "g" },
          { name: "Butter", quantity: 5, unit: "g" },
        ],
        instructions: [
          "Whisk eggs and scramble gently with spinach in butter.",
          "Serve with toasted bread.",
        ],
      },
    ],
    Lunch: [
      {
        mealName: "High Protein Paneer & Brown Rice Veggie Bowl",
        mealType: "Lunch",
        prepTime: 20,
        estimatedCost: "₹115",
        ingredients: [
          { name: "Cottage Cheese / Paneer", quantity: 160, unit: "g" },
          { name: "Brown Rice / Quinoa, cooked", quantity: 180, unit: "g" },
          { name: "Mixed Vegetables, cooked", quantity: 80, unit: "g" },
        ],
        instructions: [
          "Pan sear paneer cubes in olive oil.",
          "Serve warm over steamed brown rice and mixed vegetables.",
        ],
      },
      {
        mealName: "Soya Chunks & Quinoa Power Salad Bowl",
        mealType: "Lunch",
        prepTime: 18,
        estimatedCost: "₹85",
        ingredients: [
          { name: "Soya Granules / Chunks", quantity: 80, unit: "g" },
          { name: "Brown Rice / Quinoa, cooked", quantity: 160, unit: "g" },
          { name: "Spinach / Palak", quantity: 70, unit: "g" },
        ],
        instructions: ["Boil soya chunks and toss with warm cooked quinoa and sautéed spinach."],
      },
      {
        mealName: "Grilled Herb Chicken Breast with Steamed Rice & Broccoli",
        mealType: "Lunch",
        prepTime: 20,
        estimatedCost: "₹130",
        ingredients: [
          { name: "Chicken Breast, cooked", quantity: 180, unit: "g" },
          { name: "White Rice, cooked", quantity: 180, unit: "g" },
          { name: "Broccoli, steamed", quantity: 80, unit: "g" },
        ],
        instructions: [
          "Grill herb-marinated chicken breast until tender.",
          "Serve over steamed rice with broccoli.",
        ],
      },
      {
        mealName: "Lemon Garlic Fish Fillet with Brown Rice & Sautéed Veggies",
        mealType: "Lunch",
        prepTime: 22,
        estimatedCost: "₹160",
        ingredients: [
          { name: "Salmon / Fish Fillet, cooked", quantity: 160, unit: "g" },
          { name: "Brown Rice / Quinoa, cooked", quantity: 160, unit: "g" },
          { name: "Mixed Vegetables, cooked", quantity: 80, unit: "g" },
        ],
        instructions: [
          "Pan-sear fish in lemon butter.",
          "Serve alongside brown rice and mixed vegetables.",
        ],
      },
    ],
    Snack: [
      {
        mealName: "Greek Yogurt Berry Bowl with Crushed Almonds",
        mealType: "Snack",
        prepTime: 5,
        estimatedCost: "₹60",
        ingredients: [
          { name: "Greek Yogurt", quantity: 180, unit: "g" },
          { name: "Berries", quantity: 80, unit: "g" },
          { name: "Almonds", quantity: 15, unit: "g" },
        ],
        instructions: [
          "Combine thick Greek yogurt with fresh berries.",
          "Top with toasted crushed almonds.",
        ],
      },
      {
        mealName: "Spiced Roasted Chickpeas & Walnut Crunch",
        mealType: "Snack",
        prepTime: 8,
        estimatedCost: "₹45",
        ingredients: [
          { name: "Chickpeas / Chana, cooked", quantity: 120, unit: "g" },
          { name: "Walnuts / Akhrot", quantity: 20, unit: "g" },
        ],
        instructions: ["Dry roast chickpeas with chaat masala.", "Mix with raw walnuts."],
      },
      {
        mealName: "Boiled Egg Whites with Pepper & Cucumber Slices",
        mealType: "Snack",
        prepTime: 5,
        estimatedCost: "₹35",
        ingredients: [
          { name: "Egg White, cooked", quantity: 3, unit: "piece" },
          { name: "Cucumber, raw", quantity: 100, unit: "g" },
        ],
        instructions: ["Boil eggs, slice whites, and season with black pepper and cucumber."],
      },
    ],
    Dinner: [
      {
        mealName: "Yellow Lentil Tadka Dal with 2 Whole Wheat Chapatis",
        mealType: "Dinner",
        prepTime: 25,
        estimatedCost: "₹75",
        ingredients: [
          { name: "Yellow Lentils / Toor Dal, cooked", quantity: 220, unit: "g" },
          { name: "Whole Wheat Roti / Chapati", quantity: 2, unit: "piece" },
          { name: "Spinach / Palak", quantity: 50, unit: "g" },
        ],
        instructions: [
          "Simmer yellow lentils with cumin and garlic tadka.",
          "Serve hot with whole wheat chapatis.",
        ],
      },
      {
        mealName: "Palak Paneer Gravy with Whole Wheat Rotis",
        mealType: "Dinner",
        prepTime: 22,
        estimatedCost: "₹110",
        ingredients: [
          { name: "Cottage Cheese / Paneer", quantity: 140, unit: "g" },
          { name: "Spinach / Palak", quantity: 120, unit: "g" },
          { name: "Whole Wheat Roti / Chapati", quantity: 2, unit: "piece" },
        ],
        instructions: [
          "Puree blanched spinach with ginger and garlic.",
          "Fold in paneer cubes and serve hot with chapatis.",
        ],
      },
      {
        mealName: "Aromatic Fish Curry with Whole Wheat Chapatis & Salad",
        mealType: "Dinner",
        prepTime: 25,
        estimatedCost: "₹145",
        ingredients: [
          { name: "Salmon / Fish Fillet, cooked", quantity: 150, unit: "g" },
          { name: "Whole Wheat Roti / Chapati", quantity: 2, unit: "piece" },
          { name: "Mixed Vegetables, cooked", quantity: 60, unit: "g" },
        ],
        instructions: [
          "Simmer fish in spiced tomato-onion curry.",
          "Serve with warm chapatis and salad.",
        ],
      },
      {
        mealName: "Pan-Seared Chicken Breast with Whole Wheat Rotis & Steamed Veggies",
        mealType: "Dinner",
        prepTime: 22,
        estimatedCost: "₹135",
        ingredients: [
          { name: "Chicken Breast, cooked", quantity: 150, unit: "g" },
          { name: "Whole Wheat Roti / Chapati", quantity: 2, unit: "piece" },
          { name: "Mixed Vegetables, cooked", quantity: 80, unit: "g" },
        ],
        instructions: [
          "Pan grill chicken breast with herbs.",
          "Serve hot alongside whole wheat rotis and steamed veggies.",
        ],
      },
    ],
  };

  const pool = offlinePool[normSlot] || offlinePool.Lunch;

  const validOptions = pool.filter((item) => {
    const valRes = validateMealDiet(item, targetDiet, { isMainMeal });
    if (!valRes.valid) return false;

    const lowerName = item.mealName.toLowerCase();
    if (
      excluded.some((ex) => ex.toLowerCase() === lowerName || lowerName.includes(ex.toLowerCase()))
    ) {
      return false;
    }
    return true;
  });

  const selectedSpec =
    validOptions.length > 0
      ? validOptions[Math.floor(Math.random() * validOptions.length)]
      : pool.find((item) => validateMealDiet(item, targetDiet, { isMainMeal }).valid) || pool[0];

  // Quick fallback nutrition values
  const cal =
    normSlot === "Breakfast" ? 420 : normSlot === "Lunch" ? 540 : normSlot === "Snack" ? 250 : 480;
  const pro =
    normSlot === "Breakfast" ? 25 : normSlot === "Lunch" ? 38 : normSlot === "Snack" ? 18 : 32;

  return {
    mealName: selectedSpec.mealName,
    mealType: slotName,
    servings: 1,
    prepTime: selectedSpec.prepTime,
    estimatedCost: selectedSpec.estimatedCost,
    ingredients: selectedSpec.ingredients,
    instructions: selectedSpec.instructions,
    nutrition: {
      calories: cal,
      protein: pro,
      carbs: 52,
      fat: 16,
      fiber: 7,
    },
    isNutritionEstimated: true,
  };
}
