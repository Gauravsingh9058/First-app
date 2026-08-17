import type { MealOutput, IngredientInput } from "@/routes/api/generate-meal";
import { calculateRecipeNutritionLocally } from "./nutrition-engine";
import { normalizeDietType, validateMealDiet, CanonicalDiet } from "./diet-validator";

export interface StoredMealItem {
  id: string;
  mealName: string;
  mealType: string; // "Breakfast", "Lunch", "Dinner", "Snack"
  dietType: string; // "Vegetarian", "Non-Vegetarian", "Eggetarian", "Vegan"
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
    preparation?: string;
    databaseFoodId?: string;
  }>;
  normalizedIngredients: string[];
  instructions: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  micronutrients?: {
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
  prepTime: number;
  estimatedCost: string | number;
  nutritionVerified: boolean; // calculated locally
  createdAt: string;
  usageCount: number;
  lastUsedAt: string;
  source?: "ai_generated" | "curated_library";
}

export interface MealLibrarySearchFilters {
  mealType: string;
  diet: string;
  calorieTarget: number;
  proteinTarget: number;
  carbsTarget?: number;
  fatTarget?: number;
  allergies?: string[];
  dislikes?: string[];
  foodsToAvoid?: string;
  excludedMeals?: string[];
  userId?: string;
}

export interface UserMealHistoryRecord {
  id: string;
  userId: string;
  mealId: string;
  mealName: string;
  mealType: string;
  shownAt: string;
}

// Global In-Memory Store for quick server-side access
const LIBRARY_STORE: Map<string, StoredMealItem> = new Map();
const USER_HISTORY_STORE: UserMealHistoryRecord[] = [];

// Helper to normalize ingredient names (remove cooking prefixes, units, etc.)
export function normalizeIngredientName(rawName: string): string {
  if (!rawName) return "";
  return rawName
    .toLowerCase()
    .replace(
      /\b(cooked|raw|boiled|steamed|grilled|roasted|seared|baked|fried|chopped|sliced|diced|fresh|organic|piece|pieces|g|ml|cup|cups|tbsp|tsp|gram|grams)\b/gi,
      "",
    )
    .replace(/[^a-z0-9\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Primary protein/carb identifier
function getPrimaryProteinAndCarb(normalizedIngs: string[]): { protein: string; carb: string } {
  const proteinKeywords = [
    "chicken",
    "paneer",
    "egg",
    "eggs",
    "dal",
    "lentil",
    "fish",
    "salmon",
    "tofu",
    "soya",
    "mutton",
    "chickpea",
    "rajma",
  ];
  const carbKeywords = [
    "rice",
    "roti",
    "bread",
    "oats",
    "quinoa",
    "potato",
    "sweet potato",
    "dosa",
    "idli",
    "pasta",
    "noodle",
  ];

  let protein = "none";
  let carb = "none";

  for (const ing of normalizedIngs) {
    if (protein === "none") {
      for (const pk of proteinKeywords) {
        if (ing.includes(pk)) {
          protein = pk;
          break;
        }
      }
    }
    if (carb === "none") {
      for (const ck of carbKeywords) {
        if (ing.includes(ck)) {
          carb = ck;
          break;
        }
      }
    }
  }

  return { protein, carb };
}

/**
 * Check if two meals are duplicate or substantially similar
 */
export function isDuplicateMeal(
  mealName: string,
  mealType: string,
  ingredients: IngredientInput[],
  existingItem: StoredMealItem,
): boolean {
  if (existingItem.mealType.toLowerCase() !== mealType.toLowerCase()) {
    return false;
  }

  // Exact name match
  const nameA = mealName.toLowerCase().replace(/[^a-z0-9]/gi, "");
  const nameB = existingItem.mealName.toLowerCase().replace(/[^a-z0-9]/gi, "");
  if (nameA === nameB && nameA.length > 3) {
    return true;
  }

  // Ingredient overlap check
  const normalizedNew = ingredients.map((i) => normalizeIngredientName(i.name)).filter(Boolean);
  const normalizedExist = existingItem.normalizedIngredients.filter(Boolean);

  if (normalizedNew.length === 0 || normalizedExist.length === 0) {
    return false;
  }

  const setA = new Set(normalizedNew);
  const setB = new Set(normalizedExist);

  let commonCount = 0;
  for (const item of setA) {
    if (setB.has(item) || Array.from(setB).some((b) => item.includes(b) || b.includes(item))) {
      commonCount++;
    }
  }

  const overlapRatioA = commonCount / setA.size;
  const overlapRatioB = commonCount / setB.size;

  if (overlapRatioA >= 0.8 && overlapRatioB >= 0.8) {
    return true;
  }

  // Primary protein & carb match check
  const pcA = getPrimaryProteinAndCarb(normalizedNew);
  const pcB = getPrimaryProteinAndCarb(normalizedExist);

  if (
    pcA.protein !== "none" &&
    pcA.protein === pcB.protein &&
    pcA.carb !== "none" &&
    pcA.carb === pcB.carb &&
    Math.abs(normalizedNew.length - normalizedExist.length) <= 1
  ) {
    return true;
  }

  return false;
}

/**
 * Validates whether a meal satisfies dietary restrictions and structure
 */
export function isValidMealForLibrary(meal: MealOutput, diet: string): boolean {
  if (!meal || !meal.mealName || !meal.mealType) return false;
  if (!Array.isArray(meal.ingredients) || meal.ingredients.length === 0) return false;

  for (const ing of meal.ingredients) {
    if (!ing.name || typeof ing.quantity !== "number" || isNaN(ing.quantity) || ing.quantity <= 0) {
      return false;
    }
  }

  if (!meal.nutrition || meal.nutrition.calories <= 0 || meal.nutrition.protein < 0) {
    return false;
  }

  const canonicalDiet = normalizeDietType(diet);
  const valRes = validateMealDiet(meal, canonicalDiet);
  if (!valRes.valid) return false;

  return true;
}

/**
 * Initial Curated Seed Meals to ensure the library starts rich & full
 */
const SEED_MEALS: Array<Omit<StoredMealItem, "id" | "createdAt" | "usageCount" | "lastUsedAt">> = [
  // BREAKFAST - Veg
  {
    mealName: "High Protein Paneer & Veggie Scramble with Whole Wheat Toast",
    mealType: "Breakfast",
    dietType: "Vegetarian",
    ingredients: [
      { name: "Cottage Cheese / Paneer", quantity: 150, unit: "g" },
      { name: "Whole Wheat Bread", quantity: 2, unit: "piece" },
      { name: "Spinach / Palak", quantity: 50, unit: "g" },
      { name: "Butter", quantity: 5, unit: "g" },
    ],
    normalizedIngredients: ["paneer", "whole wheat bread", "spinach", "butter"],
    instructions: [
      "Crumble paneer and sauté with spinach and turmeric.",
      "Serve warm alongside toasted whole wheat bread.",
    ],
    calories: 420,
    protein: 26.5,
    carbs: 32,
    fat: 20,
    fiber: 5,
    prepTime: 12,
    estimatedCost: "₹65",
    nutritionVerified: true,
    source: "curated_library",
  },
  {
    mealName: "Rolled Oats Porridge with Almonds, Chia & Honey",
    mealType: "Breakfast",
    dietType: "Vegetarian",
    ingredients: [
      { name: "Rolled Oats", quantity: 70, unit: "g" },
      { name: "Milk", quantity: 220, unit: "ml" },
      { name: "Almonds", quantity: 20, unit: "g" },
      { name: "Chia Seeds", quantity: 10, unit: "g" },
    ],
    normalizedIngredients: ["rolled oats", "milk", "almonds", "chia seeds"],
    instructions: [
      "Simmer oats in warm milk for 5-7 minutes.",
      "Stir in chia seeds and top with toasted almonds.",
    ],
    calories: 440,
    protein: 18.2,
    carbs: 58,
    fat: 15.5,
    fiber: 9,
    prepTime: 10,
    estimatedCost: "₹50",
    nutritionVerified: true,
    source: "curated_library",
  },
  // BREAKFAST - NonVeg / Eggetarian
  {
    mealName: "3-Egg Scramble with Spinach, Tomatoes & Whole Wheat Toast",
    mealType: "Breakfast",
    dietType: "Non-Vegetarian",
    ingredients: [
      { name: "Whole Egg, cooked", quantity: 3, unit: "piece" },
      { name: "Whole Wheat Bread", quantity: 2, unit: "piece" },
      { name: "Spinach / Palak", quantity: 40, unit: "g" },
      { name: "Butter", quantity: 5, unit: "g" },
    ],
    normalizedIngredients: ["egg", "whole wheat bread", "spinach", "butter"],
    instructions: [
      "Whisk eggs and scramble gently with spinach in butter.",
      "Serve with toasted bread.",
    ],
    calories: 380,
    protein: 24,
    carbs: 28,
    fat: 18,
    fiber: 4,
    prepTime: 10,
    estimatedCost: "₹55",
    nutritionVerified: true,
    source: "curated_library",
  },
  // LUNCH - Veg
  {
    mealName: "High Protein Paneer & Brown Rice Veggie Bowl",
    mealType: "Lunch",
    dietType: "Vegetarian",
    ingredients: [
      { name: "Cottage Cheese / Paneer", quantity: 160, unit: "g" },
      { name: "Brown Rice / Quinoa, cooked", quantity: 180, unit: "g" },
      { name: "Mixed Vegetables, cooked", quantity: 80, unit: "g" },
    ],
    normalizedIngredients: ["paneer", "brown rice", "mixed vegetables"],
    instructions: [
      "Pan sear paneer cubes in olive oil.",
      "Serve warm over steamed brown rice and mixed vegetables.",
    ],
    calories: 550,
    protein: 32,
    carbs: 52,
    fat: 22,
    fiber: 6.5,
    prepTime: 20,
    estimatedCost: "₹115",
    nutritionVerified: true,
    source: "curated_library",
  },
  {
    mealName: "Soya Chunks & Quinoa Power Salad Bowl",
    mealType: "Lunch",
    dietType: "Vegetarian",
    ingredients: [
      { name: "Soya Granules / Chunks", quantity: 80, unit: "g" },
      { name: "Brown Rice / Quinoa, cooked", quantity: 160, unit: "g" },
      { name: "Spinach / Palak", quantity: 70, unit: "g" },
    ],
    normalizedIngredients: ["soya chunks", "quinoa", "spinach"],
    instructions: ["Boil soya chunks and toss with warm cooked quinoa and sautéed spinach."],
    calories: 490,
    protein: 42,
    carbs: 56,
    fat: 8,
    fiber: 10,
    prepTime: 18,
    estimatedCost: "₹85",
    nutritionVerified: true,
    source: "curated_library",
  },
  // LUNCH - NonVeg
  {
    mealName: "Grilled Herb Chicken Breast with Steamed Rice & Broccoli",
    mealType: "Lunch",
    dietType: "Non-Vegetarian",
    ingredients: [
      { name: "Chicken Breast, cooked", quantity: 180, unit: "g" },
      { name: "White Rice, cooked", quantity: 180, unit: "g" },
      { name: "Broccoli, steamed", quantity: 80, unit: "g" },
    ],
    normalizedIngredients: ["chicken breast", "white rice", "broccoli"],
    instructions: [
      "Grill herb-marinated chicken breast until tender.",
      "Serve over steamed rice with broccoli.",
    ],
    calories: 520,
    protein: 48,
    carbs: 50,
    fat: 11,
    fiber: 4.5,
    prepTime: 20,
    estimatedCost: "₹130",
    nutritionVerified: true,
    source: "curated_library",
  },
  {
    mealName: "Lemon Garlic Salmon Fillet with Brown Rice & Sautéed Veggies",
    mealType: "Lunch",
    dietType: "Non-Vegetarian",
    ingredients: [
      { name: "Salmon / Fish Fillet, cooked", quantity: 160, unit: "g" },
      { name: "Brown Rice / Quinoa, cooked", quantity: 160, unit: "g" },
      { name: "Mixed Vegetables, cooked", quantity: 80, unit: "g" },
    ],
    normalizedIngredients: ["salmon", "brown rice", "mixed vegetables"],
    instructions: [
      "Pan-sear salmon in lemon butter.",
      "Serve alongside brown rice and mixed vegetables.",
    ],
    calories: 580,
    protein: 42,
    carbs: 46,
    fat: 22,
    fiber: 6,
    prepTime: 22,
    estimatedCost: "₹190",
    nutritionVerified: true,
    source: "curated_library",
  },
  // SNACK
  {
    mealName: "Greek Yogurt Berry Bowl with Crushed Almonds",
    mealType: "Snack",
    dietType: "Vegetarian",
    ingredients: [
      { name: "Greek Yogurt", quantity: 180, unit: "g" },
      { name: "Berries", quantity: 80, unit: "g" },
      { name: "Almonds", quantity: 15, unit: "g" },
    ],
    normalizedIngredients: ["greek yogurt", "berries", "almonds"],
    instructions: [
      "Combine thick Greek yogurt with fresh berries.",
      "Top with toasted crushed almonds.",
    ],
    calories: 250,
    protein: 19,
    carbs: 22,
    fat: 8.5,
    fiber: 4,
    prepTime: 5,
    estimatedCost: "₹60",
    nutritionVerified: true,
    source: "curated_library",
  },
  {
    mealName: "Spiced Roasted Chickpeas & Walnut Crunch",
    mealType: "Snack",
    dietType: "Vegan",
    ingredients: [
      { name: "Chickpeas / Chana, cooked", quantity: 120, unit: "g" },
      { name: "Walnuts / Akhrot", quantity: 20, unit: "g" },
    ],
    normalizedIngredients: ["chickpeas", "walnuts"],
    instructions: ["Dry roast chickpeas with chaat masala.", "Mix with raw walnuts."],
    calories: 280,
    protein: 13,
    carbs: 32,
    fat: 12,
    fiber: 7,
    prepTime: 8,
    estimatedCost: "₹45",
    nutritionVerified: true,
    source: "curated_library",
  },
  // DINNER - Veg
  {
    mealName: "Yellow Lentil Tadka Dal with 2 Whole Wheat Chapatis",
    mealType: "Dinner",
    dietType: "Vegetarian",
    ingredients: [
      { name: "Yellow Lentils / Toor Dal, cooked", quantity: 220, unit: "g" },
      { name: "Whole Wheat Roti / Chapati", quantity: 2, unit: "piece" },
      { name: "Spinach / Palak", quantity: 50, unit: "g" },
    ],
    normalizedIngredients: ["yellow lentils", "whole wheat roti", "spinach"],
    instructions: [
      "Simmer yellow lentils with cumin and garlic tadka.",
      "Serve hot with whole wheat chapatis.",
    ],
    calories: 460,
    protein: 21,
    carbs: 72,
    fat: 8,
    fiber: 11,
    prepTime: 25,
    estimatedCost: "₹75",
    nutritionVerified: true,
    source: "curated_library",
  },
  {
    mealName: "Palak Paneer Gravy with Whole Wheat Rotis",
    mealType: "Dinner",
    dietType: "Vegetarian",
    ingredients: [
      { name: "Cottage Cheese / Paneer", quantity: 140, unit: "g" },
      { name: "Spinach / Palak", quantity: 120, unit: "g" },
      { name: "Whole Wheat Roti / Chapati", quantity: 2, unit: "piece" },
    ],
    normalizedIngredients: ["paneer", "spinach", "whole wheat roti"],
    instructions: [
      "Puree blanched spinach with ginger and garlic.",
      "Fold in paneer cubes and serve hot with chapatis.",
    ],
    calories: 490,
    protein: 28,
    carbs: 48,
    fat: 21,
    fiber: 8,
    prepTime: 22,
    estimatedCost: "₹110",
    nutritionVerified: true,
    source: "curated_library",
  },
  // DINNER - NonVeg
  {
    mealName: "Aromatic Fish Curry with Whole Wheat Chapatis & Salad",
    mealType: "Dinner",
    dietType: "Non-Vegetarian",
    ingredients: [
      { name: "Salmon / Fish Fillet, cooked", quantity: 150, unit: "g" },
      { name: "Whole Wheat Roti / Chapati", quantity: 2, unit: "piece" },
      { name: "Mixed Vegetables, cooked", quantity: 60, unit: "g" },
    ],
    normalizedIngredients: ["fish fillet", "whole wheat roti", "mixed vegetables"],
    instructions: [
      "Simmer fish in spiced tomato-onion curry.",
      "Serve with warm chapatis and salad.",
    ],
    calories: 470,
    protein: 36,
    carbs: 44,
    fat: 14,
    fiber: 6,
    prepTime: 25,
    estimatedCost: "₹145",
    nutritionVerified: true,
    source: "curated_library",
  },
];

// Initialize seed meals into map
function initializeLibraryWithSeeds() {
  if (LIBRARY_STORE.size > 0) return;

  const now = new Date().toISOString();
  for (const seed of SEED_MEALS) {
    const id = `seed-${seed.mealType.toLowerCase()}-${seed.dietType.toLowerCase()}-${Math.random().toString(36).substring(2, 8)}`;
    LIBRARY_STORE.set(id, {
      ...seed,
      id,
      createdAt: now,
      usageCount: 1,
      lastUsedAt: now,
    });
  }
}

// Ensure library seeds are loaded on startup
initializeLibraryWithSeeds();

/**
 * Searches the reusable meal library for a compatible meal before calling AI
 */
export async function findMatchingMealFromLibrary(
  filters: MealLibrarySearchFilters,
): Promise<MealOutput | null> {
  initializeLibraryWithSeeds();

  const targetCal = filters.calorieTarget || 500;
  const targetPro = filters.proteinTarget || 30;

  const targetMealType = (filters.mealType || "").toLowerCase();
  const canonicalTargetDiet = normalizeDietType(filters.diet);

  const excluded = Array.isArray(filters.excludedMeals)
    ? filters.excludedMeals.map((m) => m.toLowerCase().trim()).filter(Boolean)
    : [];

  const forbiddenWords: string[] = [];
  if (Array.isArray(filters.allergies)) {
    filters.allergies.forEach((a) => forbiddenWords.push(a.toLowerCase().trim()));
  }
  if (Array.isArray(filters.dislikes)) {
    filters.dislikes.forEach((d) => forbiddenWords.push(d.toLowerCase().trim()));
  }
  if (filters.foodsToAvoid) {
    filters.foodsToAvoid.split(",").forEach((f) => forbiddenWords.push(f.toLowerCase().trim()));
  }

  // User recent history exclude
  const userId = filters.userId || "anonymous";
  const userRecentMealIds = USER_HISTORY_STORE.filter((h) => h.userId === userId)
    .slice(-10)
    .map((h) => h.mealId);

  const candidates: Array<{ item: StoredMealItem; score: number }> = [];

  for (const item of LIBRARY_STORE.values()) {
    // 1. Meal Type match
    if (
      targetMealType &&
      targetMealType !== "all" &&
      !targetMealType.includes("day") &&
      !targetMealType.includes("full")
    ) {
      if (item.mealType.toLowerCase() !== targetMealType) {
        continue;
      }
    }

    // 2. Strict Diet Validation check
    const isMainMeal =
      targetMealType.includes("breakfast") ||
      targetMealType.includes("lunch") ||
      targetMealType.includes("dinner");

    const convertedMealOutput = {
      mealName: item.mealName,
      mealType: item.mealType,
      ingredients: item.ingredients.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        unit: i.unit,
      })),
    };

    if (canonicalTargetDiet === "VEGETARIAN") {
      const val = validateMealDiet(convertedMealOutput, "VEGETARIAN");
      if (!val.valid) continue;
    } else if (canonicalTargetDiet === "NON_VEGETARIAN") {
      const val = validateMealDiet(convertedMealOutput, "NON_VEGETARIAN", { isMainMeal });
      if (!val.valid) continue;
    }

    // 3. Excluded meals & recent history
    const itemMealNameLower = item.mealName.toLowerCase();
    if (excluded.some((ex) => ex === itemMealNameLower || itemMealNameLower.includes(ex))) {
      continue;
    }
    if (userRecentMealIds.includes(item.id)) {
      continue;
    }

    // 4. Forbidden ingredient check
    const itemIngsStr = item.normalizedIngredients.join(" ") + " " + itemMealNameLower;
    const hasForbidden = forbiddenWords.some((fw) => fw.length > 2 && itemIngsStr.includes(fw));
    if (hasForbidden) {
      continue;
    }

    // 5. Macro distance score
    const normCal = Math.abs(item.calories - targetCal) / Math.max(100, targetCal);
    const normPro = Math.abs(item.protein - targetPro) / Math.max(10, targetPro);

    const distanceScore = 0.5 * (normCal * normCal) + 0.5 * (normPro * normPro);

    // Accept reasonably fitting meals (distanceScore < 0.45)
    if (distanceScore <= 0.45) {
      candidates.push({ item, score: distanceScore });
    }
  }

  if (candidates.length === 0) {
    return null;
  }

  // Sort candidates by score
  candidates.sort((a, b) => a.score - b.score);

  // Pick candidate (randomize among top 2 closest for variety)
  const topCount = Math.min(2, candidates.length);
  const selectedIndex = Math.floor(Math.random() * topCount);
  const selected = candidates[selectedIndex].item;

  // Update usage stats
  selected.usageCount += 1;
  selected.lastUsedAt = new Date().toISOString();
  LIBRARY_STORE.set(selected.id, selected);

  // Record history
  USER_HISTORY_STORE.push({
    id: crypto.randomUUID(),
    userId,
    mealId: selected.id,
    mealName: selected.mealName,
    mealType: selected.mealType,
    shownAt: new Date().toISOString(),
  });

  // Save to Supabase in background if available
  trySaveToSupabaseBackground(selected);

  // Return formatted MealOutput
  return {
    mealName: selected.mealName,
    mealType: selected.mealType,
    servings: 1,
    prepTime: selected.prepTime,
    estimatedCost: selected.estimatedCost,
    ingredients: selected.ingredients.map((i) => ({
      name: i.name,
      quantity: i.quantity,
      unit: i.unit,
    })),
    instructions: selected.instructions,
    nutrition: {
      calories: selected.calories,
      protein: selected.protein,
      carbs: selected.carbs,
      fat: selected.fat,
      fiber: selected.fiber,
      sugar: selected.micronutrients?.sugar,
      sodium_mg: selected.micronutrients?.sodium_mg,
      iron_mg: selected.micronutrients?.iron_mg,
      calcium_mg: selected.micronutrients?.calcium_mg,
      magnesium_mg: selected.micronutrients?.magnesium_mg,
      potassium_mg: selected.micronutrients?.potassium_mg,
      vit_a_ug: selected.micronutrients?.vit_a_ug,
      vit_b12_ug: selected.micronutrients?.vit_b12_ug,
      vit_d_ug: selected.micronutrients?.vit_d_ug,
      omega3_g: selected.micronutrients?.omega3_g,
    },
    isNutritionEstimated: selected.nutritionVerified,
  };
}

/**
 * Saves a newly generated meal to the persistent library
 */
export async function saveGeneratedMealToLibrary(
  meal: MealOutput,
  dietType: string,
  nutritionVerified: boolean,
): Promise<{ savedItem: StoredMealItem; isDuplicate: boolean }> {
  initializeLibraryWithSeeds();

  // 1. Validation check
  if (!isValidMealForLibrary(meal, dietType)) {
    throw new Error("Meal failed library validation checks.");
  }

  // 2. Duplicate Check
  for (const existingItem of LIBRARY_STORE.values()) {
    if (isDuplicateMeal(meal.mealName, meal.mealType, meal.ingredients, existingItem)) {
      existingItem.usageCount += 1;
      existingItem.lastUsedAt = new Date().toISOString();
      LIBRARY_STORE.set(existingItem.id, existingItem);
      trySaveToSupabaseBackground(existingItem);
      return { savedItem: existingItem, isDuplicate: true };
    }
  }

  // 3. Create new stored item
  const id = `gen-${crypto.randomUUID()}`;
  const now = new Date().toISOString();

  const normalizedIngredients = meal.ingredients
    .map((i) => normalizeIngredientName(i.name))
    .filter(Boolean);

  const newItem: StoredMealItem = {
    id,
    mealName: meal.mealName,
    mealType: meal.mealType,
    dietType: dietType || "Vegetarian",
    ingredients: meal.ingredients.map((i) => ({
      name: i.name,
      quantity: Number(i.quantity),
      unit: String(i.unit || "g"),
    })),
    normalizedIngredients,
    instructions: meal.instructions || ["Cook and combine ingredients."],
    calories: Math.round(meal.nutrition.calories),
    protein: Number(meal.nutrition.protein.toFixed(1)),
    carbs: Number(meal.nutrition.carbs.toFixed(1)),
    fat: Number(meal.nutrition.fat.toFixed(1)),
    fiber: Number(meal.nutrition.fiber.toFixed(1)),
    micronutrients: {
      sugar: meal.nutrition.sugar,
      sodium_mg: meal.nutrition.sodium_mg,
      iron_mg: meal.nutrition.iron_mg,
      calcium_mg: meal.nutrition.calcium_mg,
      magnesium_mg: meal.nutrition.magnesium_mg,
      potassium_mg: meal.nutrition.potassium_mg,
      vit_a_ug: meal.nutrition.vit_a_ug,
      vit_b12_ug: meal.nutrition.vit_b12_ug,
      vit_d_ug: meal.nutrition.vit_d_ug,
      omega3_g: meal.nutrition.omega3_g,
    },
    prepTime: meal.prepTime || 15,
    estimatedCost: meal.estimatedCost || "₹60",
    nutritionVerified,
    createdAt: now,
    usageCount: 1,
    lastUsedAt: now,
    source: "ai_generated",
  };

  LIBRARY_STORE.set(id, newItem);

  // Background save to Supabase
  trySaveToSupabaseBackground(newItem);

  return { savedItem: newItem, isDuplicate: false };
}

/**
 * Attempts background save to Supabase without blocking or failing user request
 */
async function trySaveToSupabaseBackground(item: StoredMealItem) {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (!supabaseAdmin) return;

    type SupabaseAdminLike = {
      from: (table: string) => {
        upsert: (data: unknown, opts?: { onConflict?: string }) => Promise<unknown>;
      };
    };

    await (supabaseAdmin as unknown as SupabaseAdminLike).from("generated_meals").upsert(
      {
        id: item.id,
        meal_name: item.mealName,
        meal_type: item.mealType,
        diet_type: item.dietType,
        ingredients: item.ingredients,
        normalized_ingredients: item.normalizedIngredients,
        instructions: item.instructions,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat,
        fiber: item.fiber,
        micronutrients: item.micronutrients,
        prep_time: item.prepTime,
        estimated_cost: String(item.estimatedCost),
        nutrition_verified: item.nutritionVerified,
        created_at: item.createdAt,
        usage_count: item.usageCount,
        last_used_at: item.lastUsedAt,
      },
      { onConflict: "id" },
    );
  } catch (err) {
    // Gracefully catch missing env or network failure
    console.info(
      "[GeneratedMealLibrary] Supabase save deferred/skipped:",
      err instanceof Error ? err.message : String(err),
    );
  }
}

/**
 * Returns current statistics of the generated meal library
 */
export function getMealLibraryStats() {
  initializeLibraryWithSeeds();
  const items = Array.from(LIBRARY_STORE.values());
  const totalCount = items.length;
  const aiGeneratedCount = items.filter((i) => i.source === "ai_generated").length;
  const totalReuses = items.reduce((sum, i) => sum + (i.usageCount - 1), 0);

  return {
    totalCount,
    aiGeneratedCount,
    totalReuses,
  };
}
