import { getSQLiteDB, persistDatabase } from "./sqlite-db";
import type { Database } from "sql.js";

export interface RecipeIngredient {
  id?: string;
  recipe_id?: string;
  name: string;
  normalized_name?: string;
  quantity: number;
  unit: string;
  estimated_cost: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g?: number;
  sugar_g?: number;
}

export interface RecipeStep {
  id?: string;
  recipe_id?: string;
  step_number: number;
  instruction: string;
}

export interface Recipe {
  id: string;
  name: string;
  meal_type: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  diet_type: "veg" | "non_veg" | "eggetarian" | "vegan";
  goal: string;
  cost_amount: number;
  currency: string;
  prep_minutes: number;
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
  cuisine: string;
  difficulty: "Easy" | "Medium" | "Hard";
  created_by: "system" | "ai" | "user";
  source: string;
  rating?: number;
  rating_count?: number;
  is_favorite?: boolean;
  image_url?: string;
  created_at: string;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  tags: string[];
  goals: string[];
}

export interface USDAIngredient {
  id: string;
  name: string;
  aliases: string[];
  default_unit: string;
  unit_grams: number;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g: number;
  sugar_per_100g: number;
  sodium_per_100g: number;
  iron_per_100g: number;
  calcium_per_100g: number;
  magnesium_per_100g: number;
  potassium_per_100g: number;
  vit_a_per_100g: number;
  vit_b12_per_100g: number;
  vit_d_per_100g: number;
  omega3_per_100g: number;
  avg_cost_per_100g: number; // in INR / local currency unit
}

let recipeDbInitPromise: Promise<Database | null> | null = null;

/**
 * Ensure all Recipe & USDA tables in SQLite are initialized and seeded before queries run
 */
export async function ensureRecipeDatabase(): Promise<Database | null> {
  if (recipeDbInitPromise) {
    return recipeDbInitPromise;
  }

  recipeDbInitPromise = (async () => {
    const db = await getSQLiteDB();
    if (!db) return null;

    try {
      db.run(`
        CREATE TABLE IF NOT EXISTS recipes (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          meal_type TEXT NOT NULL,
          diet_type TEXT NOT NULL,
          goal TEXT NOT NULL,
          cost_amount REAL DEFAULT 0,
          currency TEXT DEFAULT '₹',
          prep_minutes INTEGER DEFAULT 15,
          calories REAL DEFAULT 0,
          protein_g REAL DEFAULT 0,
          carbs_g REAL DEFAULT 0,
          fat_g REAL DEFAULT 0,
          fiber_g REAL DEFAULT 0,
          sugar_g REAL DEFAULT 0,
          sodium_mg REAL DEFAULT 0,
          iron_mg REAL DEFAULT 0,
          calcium_mg REAL DEFAULT 0,
          magnesium_mg REAL DEFAULT 0,
          potassium_mg REAL DEFAULT 0,
          vit_a_ug REAL DEFAULT 0,
          vit_b12_ug REAL DEFAULT 0,
          vit_d_ug REAL DEFAULT 0,
          omega3_g REAL DEFAULT 0,
          cuisine TEXT DEFAULT 'Indian',
          difficulty TEXT DEFAULT 'Easy',
          created_by TEXT DEFAULT 'system',
          source TEXT DEFAULT 'local_db',
          image_url TEXT,
          created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS recipe_ingredients (
          id TEXT PRIMARY KEY,
          recipe_id TEXT NOT NULL,
          name TEXT NOT NULL,
          normalized_name TEXT,
          quantity REAL DEFAULT 1,
          unit TEXT DEFAULT 'g',
          estimated_cost REAL DEFAULT 0,
          calories REAL DEFAULT 0,
          protein_g REAL DEFAULT 0,
          carbs_g REAL DEFAULT 0,
          fat_g REAL DEFAULT 0,
          fiber_g REAL DEFAULT 0,
          sugar_g REAL DEFAULT 0,
          FOREIGN KEY(recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS recipe_steps (
          id TEXT PRIMARY KEY,
          recipe_id TEXT NOT NULL,
          step_number INTEGER NOT NULL,
          instruction TEXT NOT NULL,
          FOREIGN KEY(recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS recipe_tags (
          id TEXT PRIMARY KEY,
          recipe_id TEXT NOT NULL,
          tag TEXT NOT NULL,
          FOREIGN KEY(recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS recipe_goals (
          id TEXT PRIMARY KEY,
          recipe_id TEXT NOT NULL,
          goal TEXT NOT NULL,
          FOREIGN KEY(recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS recipe_ratings (
          id TEXT PRIMARY KEY,
          recipe_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          rating INTEGER CHECK(rating >= 1 AND rating <= 5),
          created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS recipe_history (
          id TEXT PRIMARY KEY,
          recipe_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          action TEXT NOT NULL,
          timestamp TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS favorite_recipes (
          id TEXT PRIMARY KEY,
          recipe_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          added_at TEXT NOT NULL,
          UNIQUE(recipe_id, user_id)
        );

        CREATE TABLE IF NOT EXISTS recent_recipes (
          id TEXT PRIMARY KEY,
          recipe_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          viewed_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS generated_meals (
          id TEXT PRIMARY KEY,
          meal_name TEXT NOT NULL,
          meal_type TEXT NOT NULL,
          diet_type TEXT NOT NULL,
          ingredients TEXT NOT NULL,
          normalized_ingredients TEXT NOT NULL,
          instructions TEXT NOT NULL,
          calories REAL DEFAULT 0,
          protein REAL DEFAULT 0,
          carbs REAL DEFAULT 0,
          fat REAL DEFAULT 0,
          fiber REAL DEFAULT 0,
          micronutrients TEXT,
          prep_time INTEGER DEFAULT 15,
          estimated_cost TEXT DEFAULT '₹60',
          nutrition_verified INTEGER DEFAULT 1,
          created_at TEXT NOT NULL,
          usage_count INTEGER DEFAULT 1,
          last_used_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS user_meal_history (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          meal_id TEXT NOT NULL,
          meal_name TEXT NOT NULL,
          meal_type TEXT NOT NULL,
          shown_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS usda_ingredients (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          aliases TEXT NOT NULL, -- JSON array of string aliases
          default_unit TEXT DEFAULT 'g',
          unit_grams REAL DEFAULT 1,
          calories_per_100g REAL DEFAULT 0,
          protein_per_100g REAL DEFAULT 0,
          carbs_per_100g REAL DEFAULT 0,
          fat_per_100g REAL DEFAULT 0,
          fiber_per_100g REAL DEFAULT 0,
          sugar_per_100g REAL DEFAULT 0,
          sodium_per_100g REAL DEFAULT 0,
          iron_per_100g REAL DEFAULT 0,
          calcium_per_100g REAL DEFAULT 0,
          magnesium_per_100g REAL DEFAULT 0,
          potassium_per_100g REAL DEFAULT 0,
          vit_a_per_100g REAL DEFAULT 0,
          vit_b12_per_100g REAL DEFAULT 0,
          vit_d_per_100g REAL DEFAULT 0,
          omega3_per_100g REAL DEFAULT 0,
          avg_cost_per_100g REAL DEFAULT 10
        );

        CREATE INDEX IF NOT EXISTS idx_recipes_meal_diet ON recipes(meal_type, diet_type);
        CREATE INDEX IF NOT EXISTS idx_recipes_cost_prep ON recipes(cost_amount, prep_minutes);
        CREATE INDEX IF NOT EXISTS idx_recipes_goal ON recipes(goal);
        CREATE INDEX IF NOT EXISTS idx_recipes_cuisine ON recipes(cuisine);
        CREATE INDEX IF NOT EXISTS idx_recipes_cal_pro ON recipes(calories, protein_g);
        CREATE INDEX IF NOT EXISTS idx_recipes_diet ON recipes(diet_type);
        CREATE INDEX IF NOT EXISTS idx_recipes_meal ON recipes(meal_type);
      `);

      await seedUSDAIngredientsIfEmptyInternal(db);
      await seedCuratedRecipesIfEmptyInternal(db);

      persistDatabase(db);
      return db;
    } catch (err) {
      console.error("[RecipeDB] Error initializing tables:", err);
      recipeDbInitPromise = null;
      return null;
    }
  })();

  return recipeDbInitPromise;
}

/**
 * Initialize all Recipe & USDA tables in SQLite
 */
export async function initRecipeDatabase(): Promise<void> {
  await ensureRecipeDatabase();
}

export const USDA_SEEDS: USDAIngredient[] = [
  {
    id: "usda-1",
    name: "Rolled Oats",
    aliases: ["oats", "rolled oats", "oatmeal", "quaker oats", "oat flakes", "porridge oats"],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 389,
    protein_per_100g: 16.9,
    carbs_per_100g: 66.3,
    fat_per_100g: 6.9,
    fiber_per_100g: 10.6,
    sugar_per_100g: 0.9,
    sodium_per_100g: 2,
    iron_per_100g: 4.7,
    calcium_per_100g: 54,
    magnesium_per_100g: 177,
    potassium_per_100g: 429,
    vit_a_per_100g: 0,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0.1,
    avg_cost_per_100g: 15,
  },
  {
    id: "usda-2",
    name: "Soya Granules / Chunks",
    aliases: ["soya granules", "soya chunks", "soy protein", "soy nuggets", "mealmaker"],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 345,
    protein_per_100g: 52.0,
    carbs_per_100g: 33.0,
    fat_per_100g: 0.5,
    fiber_per_100g: 13.0,
    sugar_per_100g: 2.0,
    sodium_per_100g: 10,
    iron_per_100g: 20.0,
    calcium_per_100g: 350,
    magnesium_per_100g: 220,
    potassium_per_100g: 1400,
    vit_a_per_100g: 0,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0,
    avg_cost_per_100g: 18,
  },
  {
    id: "usda-3",
    name: "Cottage Cheese / Paneer",
    aliases: ["paneer", "cottage cheese", "low fat paneer", "fresh paneer"],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 265,
    protein_per_100g: 18.3,
    carbs_per_100g: 1.2,
    fat_per_100g: 20.8,
    fiber_per_100g: 0,
    sugar_per_100g: 1.2,
    sodium_per_100g: 18,
    iron_per_100g: 0.2,
    calcium_per_100g: 480,
    magnesium_per_100g: 12,
    potassium_per_100g: 80,
    vit_a_per_100g: 30,
    vit_b12_per_100g: 0.8,
    vit_d_per_100g: 0.5,
    omega3_per_100g: 0.1,
    avg_cost_per_100g: 35,
  },
  {
    id: "usda-4",
    name: "Whole Egg, cooked",
    aliases: [
      "egg",
      "eggs",
      "whole egg",
      "whole eggs",
      "boiled egg",
      "scrambled egg",
      "cooked egg",
      "poached egg",
      "fried egg",
    ],
    default_unit: "piece",
    unit_grams: 50,
    calories_per_100g: 155,
    protein_per_100g: 12.6,
    carbs_per_100g: 1.1,
    fat_per_100g: 10.6,
    fiber_per_100g: 0,
    sugar_per_100g: 0.6,
    sodium_per_100g: 124,
    iron_per_100g: 1.8,
    calcium_per_100g: 50,
    magnesium_per_100g: 12,
    potassium_per_100g: 126,
    vit_a_per_100g: 160,
    vit_b12_per_100g: 0.9,
    vit_d_per_100g: 2.0,
    omega3_per_100g: 0.1,
    avg_cost_per_100g: 14,
  },
  {
    id: "usda-5",
    name: "Chicken Breast, cooked",
    aliases: [
      "cooked chicken breast",
      "chicken breast",
      "cooked chicken",
      "grilled chicken",
      "boneless chicken",
      "chicken",
      "chicken mince",
      "chicken breast boneless skinless",
    ],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 165,
    protein_per_100g: 31.0,
    carbs_per_100g: 0,
    fat_per_100g: 3.6,
    fiber_per_100g: 0,
    sugar_per_100g: 0,
    sodium_per_100g: 74,
    iron_per_100g: 1.0,
    calcium_per_100g: 15,
    magnesium_per_100g: 29,
    potassium_per_100g: 256,
    vit_a_per_100g: 6,
    vit_b12_per_100g: 0.3,
    vit_d_per_100g: 0.1,
    omega3_per_100g: 0.05,
    avg_cost_per_100g: 28,
  },
  {
    id: "usda-5b",
    name: "Chicken Breast, raw",
    aliases: ["raw chicken breast", "raw chicken", "raw boneless chicken"],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 120,
    protein_per_100g: 22.5,
    carbs_per_100g: 0,
    fat_per_100g: 2.6,
    fiber_per_100g: 0,
    sugar_per_100g: 0,
    sodium_per_100g: 65,
    iron_per_100g: 0.9,
    calcium_per_100g: 11,
    magnesium_per_100g: 25,
    potassium_per_100g: 220,
    vit_a_per_100g: 5,
    vit_b12_per_100g: 0.2,
    vit_d_per_100g: 0.1,
    omega3_per_100g: 0.04,
    avg_cost_per_100g: 25,
  },
  {
    id: "usda-6",
    name: "Milk (Toned / Low Fat)",
    aliases: ["milk", "toned milk", "cow milk", "skimmed milk", "whole milk"],
    default_unit: "ml",
    unit_grams: 1,
    calories_per_100g: 58,
    protein_per_100g: 3.4,
    carbs_per_100g: 4.8,
    fat_per_100g: 3.1,
    fiber_per_100g: 0,
    sugar_per_100g: 5.0,
    sodium_per_100g: 44,
    iron_per_100g: 0.03,
    calcium_per_100g: 120,
    magnesium_per_100g: 11,
    potassium_per_100g: 150,
    vit_a_per_100g: 46,
    vit_b12_per_100g: 0.45,
    vit_d_per_100g: 1.2,
    omega3_per_100g: 0.05,
    avg_cost_per_100g: 6,
  },
  {
    id: "usda-7",
    name: "White Rice, cooked",
    aliases: [
      "cooked rice",
      "cooked white rice",
      "rice",
      "white rice",
      "basmati rice",
      "steamed rice",
      "cooked basmati rice",
    ],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 130,
    protein_per_100g: 2.7,
    carbs_per_100g: 28.0,
    fat_per_100g: 0.3,
    fiber_per_100g: 0.4,
    sugar_per_100g: 0.1,
    sodium_per_100g: 1,
    iron_per_100g: 0.2,
    calcium_per_100g: 10,
    magnesium_per_100g: 12,
    potassium_per_100g: 35,
    vit_a_per_100g: 0,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0,
    avg_cost_per_100g: 5,
  },
  {
    id: "usda-8",
    name: "Yellow Lentils / Toor Dal, cooked",
    aliases: [
      "dal",
      "cooked dal",
      "toor dal",
      "yellow lentils",
      "moong dal",
      "masoor dal",
      "lentils",
      "cooked lentils",
    ],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 116,
    protein_per_100g: 9.0,
    carbs_per_100g: 20.0,
    fat_per_100g: 0.4,
    fiber_per_100g: 4.8,
    sugar_per_100g: 0.8,
    sodium_per_100g: 12,
    iron_per_100g: 1.8,
    calcium_per_100g: 28,
    magnesium_per_100g: 38,
    potassium_per_100g: 360,
    vit_a_per_100g: 0,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0,
    avg_cost_per_100g: 8,
  },
  {
    id: "usda-9",
    name: "Whole Wheat Roti / Chapati",
    aliases: [
      "roti",
      "rotis",
      "chapati",
      "chapatis",
      "wheat flour",
      "atta",
      "whole wheat roti",
      "phulka",
    ],
    default_unit: "piece",
    unit_grams: 40,
    calories_per_100g: 250,
    protein_per_100g: 9.0,
    carbs_per_100g: 48.0,
    fat_per_100g: 2.5,
    fiber_per_100g: 7.0,
    sugar_per_100g: 1.0,
    sodium_per_100g: 5,
    iron_per_100g: 3.5,
    calcium_per_100g: 30,
    magnesium_per_100g: 80,
    potassium_per_100g: 250,
    vit_a_per_100g: 0,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0,
    avg_cost_per_100g: 8,
  },
  {
    id: "usda-10",
    name: "Peanut Butter",
    aliases: ["peanut butter", "peanuts", "roasted peanuts"],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 588,
    protein_per_100g: 25.0,
    carbs_per_100g: 20.0,
    fat_per_100g: 50.0,
    fiber_per_100g: 6.0,
    sugar_per_100g: 9.0,
    sodium_per_100g: 400,
    iron_per_100g: 1.9,
    calcium_per_100g: 43,
    magnesium_per_100g: 150,
    potassium_per_100g: 650,
    vit_a_per_100g: 0,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0,
    avg_cost_per_100g: 25,
  },
  {
    id: "usda-11",
    name: "Fresh Banana",
    aliases: ["banana", "bananas", "ripe banana", "fresh banana"],
    default_unit: "piece",
    unit_grams: 100,
    calories_per_100g: 89,
    protein_per_100g: 1.1,
    carbs_per_100g: 22.8,
    fat_per_100g: 0.3,
    fiber_per_100g: 2.6,
    sugar_per_100g: 12.2,
    sodium_per_100g: 1,
    iron_per_100g: 0.3,
    calcium_per_100g: 5,
    magnesium_per_100g: 27,
    potassium_per_100g: 358,
    vit_a_per_100g: 64,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0,
    avg_cost_per_100g: 5,
  },
  {
    id: "usda-12",
    name: "Curd / Dahi / Greek Yogurt",
    aliases: ["curd", "dahi", "yogurt", "greek yogurt"],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 61,
    protein_per_100g: 3.5,
    carbs_per_100g: 4.7,
    fat_per_100g: 3.3,
    fiber_per_100g: 0,
    sugar_per_100g: 4.7,
    sodium_per_100g: 46,
    iron_per_100g: 0.1,
    calcium_per_100g: 121,
    magnesium_per_100g: 12,
    potassium_per_100g: 155,
    vit_a_per_100g: 27,
    vit_b12_per_100g: 0.4,
    vit_d_per_100g: 0.1,
    omega3_per_100g: 0,
    avg_cost_per_100g: 8,
  },
  {
    id: "usda-13",
    name: "Chickpeas / Chana, cooked",
    aliases: [
      "chana",
      "cooked chickpeas",
      "chickpeas",
      "white chana",
      "black chana",
      "kabuli chana",
      "boiled chana",
    ],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 164,
    protein_per_100g: 8.9,
    carbs_per_100g: 27.4,
    fat_per_100g: 2.6,
    fiber_per_100g: 7.6,
    sugar_per_100g: 4.8,
    sodium_per_100g: 24,
    iron_per_100g: 2.9,
    calcium_per_100g: 49,
    magnesium_per_100g: 48,
    potassium_per_100g: 291,
    vit_a_per_100g: 27,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0.05,
    avg_cost_per_100g: 8,
  },
  {
    id: "usda-14",
    name: "Spinach / Palak",
    aliases: ["spinach", "palak", "green spinach", "steamed spinach", "sautéed spinach"],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 23,
    protein_per_100g: 2.9,
    carbs_per_100g: 3.6,
    fat_per_100g: 0.4,
    fiber_per_100g: 2.2,
    sugar_per_100g: 0.4,
    sodium_per_100g: 79,
    iron_per_100g: 2.7,
    calcium_per_100g: 99,
    magnesium_per_100g: 79,
    potassium_per_100g: 558,
    vit_a_per_100g: 469,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0.1,
    avg_cost_per_100g: 6,
  },
  {
    id: "usda-15",
    name: "Whey Protein Powder",
    aliases: ["whey protein", "protein powder", "whey isolate", "whey concentrate"],
    default_unit: "scoop",
    unit_grams: 30,
    calories_per_100g: 380,
    protein_per_100g: 80.0,
    carbs_per_100g: 5.0,
    fat_per_100g: 3.0,
    fiber_per_100g: 1.0,
    sugar_per_100g: 2.0,
    sodium_per_100g: 160,
    iron_per_100g: 1.2,
    calcium_per_100g: 400,
    magnesium_per_100g: 60,
    potassium_per_100g: 450,
    vit_a_per_100g: 0,
    vit_b12_per_100g: 1.0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0,
    avg_cost_per_100g: 100,
  },
  {
    id: "usda-16",
    name: "Sweet Potato, cooked",
    aliases: [
      "sweet potato",
      "sweet potatoes",
      "roasted sweet potato",
      "baked sweet potato",
      "cooked sweet potato",
      "yam",
      "shakarkandi",
    ],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 86,
    protein_per_100g: 1.6,
    carbs_per_100g: 20.1,
    fat_per_100g: 0.1,
    fiber_per_100g: 3.0,
    sugar_per_100g: 4.2,
    sodium_per_100g: 55,
    iron_per_100g: 0.6,
    calcium_per_100g: 30,
    magnesium_per_100g: 25,
    potassium_per_100g: 337,
    vit_a_per_100g: 709,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0,
    avg_cost_per_100g: 8,
  },
  {
    id: "usda-17",
    name: "Broccoli, steamed",
    aliases: ["steamed broccoli", "broccoli", "cooked broccoli", "roasted broccoli", "calabrese"],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 34,
    protein_per_100g: 2.8,
    carbs_per_100g: 6.6,
    fat_per_100g: 0.4,
    fiber_per_100g: 2.6,
    sugar_per_100g: 1.7,
    sodium_per_100g: 33,
    iron_per_100g: 0.7,
    calcium_per_100g: 47,
    magnesium_per_100g: 21,
    potassium_per_100g: 316,
    vit_a_per_100g: 31,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0.1,
    avg_cost_per_100g: 12,
  },
  {
    id: "usda-18",
    name: "Olive Oil / Cooking Oil / Ghee / Butter",
    aliases: [
      "cooking oil",
      "olive oil",
      "oil",
      "ghee",
      "vegetable oil",
      "mustard oil",
      "butter",
      "sunflower oil",
    ],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 884,
    protein_per_100g: 0,
    carbs_per_100g: 0,
    fat_per_100g: 100.0,
    fiber_per_100g: 0,
    sugar_per_100g: 0,
    sodium_per_100g: 2,
    iron_per_100g: 0.5,
    calcium_per_100g: 1,
    magnesium_per_100g: 0,
    potassium_per_100g: 1,
    vit_a_per_100g: 0,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0.8,
    avg_cost_per_100g: 25,
  },
  {
    id: "usda-19",
    name: "Avocado",
    aliases: ["avocado", "raw avocado", "guacamole", "avocados"],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 160,
    protein_per_100g: 2.0,
    carbs_per_100g: 8.5,
    fat_per_100g: 14.7,
    fiber_per_100g: 6.7,
    sugar_per_100g: 0.7,
    sodium_per_100g: 7,
    iron_per_100g: 0.6,
    calcium_per_100g: 12,
    magnesium_per_100g: 29,
    potassium_per_100g: 485,
    vit_a_per_100g: 7,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0.1,
    avg_cost_per_100g: 35,
  },
  {
    id: "usda-20",
    name: "Potato, cooked",
    aliases: [
      "potato",
      "potatoes",
      "baked potato",
      "boiled potato",
      "mashed potato",
      "roasted potato",
      "alu",
      "aloo",
    ],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 93,
    protein_per_100g: 2.5,
    carbs_per_100g: 21.2,
    fat_per_100g: 0.1,
    fiber_per_100g: 2.2,
    sugar_per_100g: 1.2,
    sodium_per_100g: 10,
    iron_per_100g: 1.1,
    calcium_per_100g: 15,
    magnesium_per_100g: 28,
    potassium_per_100g: 535,
    vit_a_per_100g: 2,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0,
    avg_cost_per_100g: 5,
  },
  {
    id: "usda-21",
    name: "Brown Rice / Quinoa, cooked",
    aliases: ["brown rice", "cooked brown rice", "quinoa", "cooked quinoa", "wild rice"],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 112,
    protein_per_100g: 2.6,
    carbs_per_100g: 23.5,
    fat_per_100g: 0.9,
    fiber_per_100g: 1.8,
    sugar_per_100g: 0.4,
    sodium_per_100g: 5,
    iron_per_100g: 0.8,
    calcium_per_100g: 10,
    magnesium_per_100g: 43,
    potassium_per_100g: 83,
    vit_a_per_100g: 0,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0,
    avg_cost_per_100g: 12,
  },
  {
    id: "usda-22",
    name: "Salmon / Fish Fillet, cooked",
    aliases: [
      "salmon",
      "grilled salmon",
      "fish",
      "fish fillet",
      "tuna",
      "cod",
      "tilapia",
      "seared salmon",
      "cooked fish",
    ],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 206,
    protein_per_100g: 22.1,
    carbs_per_100g: 0,
    fat_per_100g: 12.3,
    fiber_per_100g: 0,
    sugar_per_100g: 0,
    sodium_per_100g: 61,
    iron_per_100g: 0.8,
    calcium_per_100g: 12,
    magnesium_per_100g: 29,
    potassium_per_100g: 363,
    vit_a_per_100g: 12,
    vit_b12_per_100g: 3.2,
    vit_d_per_100g: 11.0,
    omega3_per_100g: 2.1,
    avg_cost_per_100g: 60,
  },
  {
    id: "usda-23",
    name: "Almonds / Nuts",
    aliases: ["almonds", "nuts", "walnuts", "cashews", "mixed nuts", "badam"],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 579,
    protein_per_100g: 21.2,
    carbs_per_100g: 21.6,
    fat_per_100g: 49.9,
    fiber_per_100g: 12.5,
    sugar_per_100g: 4.4,
    sodium_per_100g: 1,
    iron_per_100g: 3.7,
    calcium_per_100g: 269,
    magnesium_per_100g: 270,
    potassium_per_100g: 733,
    vit_a_per_100g: 1,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0.1,
    avg_cost_per_100g: 80,
  },
  {
    id: "usda-24",
    name: "Whole Wheat Bread / Toast",
    aliases: ["whole wheat bread", "bread", "toast", "slice bread", "white bread", "slices bread"],
    default_unit: "slice",
    unit_grams: 30,
    calories_per_100g: 247,
    protein_per_100g: 13.0,
    carbs_per_100g: 41.0,
    fat_per_100g: 3.4,
    fiber_per_100g: 6.0,
    sugar_per_100g: 5.0,
    sodium_per_100g: 450,
    iron_per_100g: 2.5,
    calcium_per_100g: 100,
    magnesium_per_100g: 70,
    potassium_per_100g: 250,
    vit_a_per_100g: 0,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0.1,
    avg_cost_per_100g: 10,
  },
  {
    id: "usda-25",
    name: "Apple, raw",
    aliases: ["apple", "apples", "fresh apple", "raw apple"],
    default_unit: "piece",
    unit_grams: 150,
    calories_per_100g: 52,
    protein_per_100g: 0.3,
    carbs_per_100g: 13.8,
    fat_per_100g: 0.2,
    fiber_per_100g: 2.4,
    sugar_per_100g: 10.4,
    sodium_per_100g: 1,
    iron_per_100g: 0.1,
    calcium_per_100g: 6,
    magnesium_per_100g: 5,
    potassium_per_100g: 107,
    vit_a_per_100g: 3,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0,
    avg_cost_per_100g: 12,
  },
  {
    id: "usda-26",
    name: "Berries (Strawberries / Blueberries)",
    aliases: [
      "berries",
      "berry",
      "strawberries",
      "blueberries",
      "blackberries",
      "raspberries",
      "mixed berries",
    ],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 57,
    protein_per_100g: 0.7,
    carbs_per_100g: 14.0,
    fat_per_100g: 0.3,
    fiber_per_100g: 2.4,
    sugar_per_100g: 10.0,
    sodium_per_100g: 1,
    iron_per_100g: 0.4,
    calcium_per_100g: 16,
    magnesium_per_100g: 12,
    potassium_per_100g: 148,
    vit_a_per_100g: 2,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0.1,
    avg_cost_per_100g: 30,
  },
  {
    id: "usda-27",
    name: "Mixed Vegetables, cooked",
    aliases: [
      "mixed vegetables",
      "mixed veg",
      "mixed veggies",
      "sautéed vegetables",
      "steamed vegetables",
      "vegetables",
      "veggies",
    ],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 60,
    protein_per_100g: 2.5,
    carbs_per_100g: 11.0,
    fat_per_100g: 0.4,
    fiber_per_100g: 3.2,
    sugar_per_100g: 3.5,
    sodium_per_100g: 45,
    iron_per_100g: 0.8,
    calcium_per_100g: 35,
    magnesium_per_100g: 20,
    potassium_per_100g: 220,
    vit_a_per_100g: 120,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0,
    avg_cost_per_100g: 10,
  },
  {
    id: "usda-28",
    name: "Butter",
    aliases: ["butter", "salted butter", "unsalted butter", "makhan"],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 717,
    protein_per_100g: 0.9,
    carbs_per_100g: 0.1,
    fat_per_100g: 81.1,
    fiber_per_100g: 0,
    sugar_per_100g: 0.1,
    sodium_per_100g: 643,
    iron_per_100g: 0.02,
    calcium_per_100g: 24,
    magnesium_per_100g: 2,
    potassium_per_100g: 24,
    vit_a_per_100g: 684,
    vit_b12_per_100g: 0.2,
    vit_d_per_100g: 1.5,
    omega3_per_100g: 0.3,
    avg_cost_per_100g: 25,
  },
  {
    id: "usda-29",
    name: "Greek Yogurt",
    aliases: ["greek yogurt", "greek yoghurt", "plain greek yogurt", "hung curd"],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 97,
    protein_per_100g: 9.0,
    carbs_per_100g: 3.8,
    fat_per_100g: 5.0,
    fiber_per_100g: 0,
    sugar_per_100g: 3.6,
    sodium_per_100g: 36,
    iron_per_100g: 0.1,
    calcium_per_100g: 100,
    magnesium_per_100g: 11,
    potassium_per_100g: 141,
    vit_a_per_100g: 25,
    vit_b12_per_100g: 0.5,
    vit_d_per_100g: 0,
    omega3_per_100g: 0.1,
    avg_cost_per_100g: 20,
  },
  {
    id: "usda-30",
    name: "Egg White, cooked",
    aliases: [
      "egg white",
      "egg whites",
      "boiled egg white",
      "boiled egg whites",
      "cooked egg white",
      "scrambled egg whites",
    ],
    default_unit: "piece",
    unit_grams: 33,
    calories_per_100g: 52,
    protein_per_100g: 11.0,
    carbs_per_100g: 0.7,
    fat_per_100g: 0.2,
    fiber_per_100g: 0,
    sugar_per_100g: 0.7,
    sodium_per_100g: 166,
    iron_per_100g: 0.1,
    calcium_per_100g: 7,
    magnesium_per_100g: 11,
    potassium_per_100g: 163,
    vit_a_per_100g: 0,
    vit_b12_per_100g: 0.1,
    vit_d_per_100g: 0,
    omega3_per_100g: 0,
    avg_cost_per_100g: 12,
  },
  {
    id: "usda-31",
    name: "Tofu (Firm / Soy Paneer)",
    aliases: ["tofu", "firm tofu", "soy paneer", "silken tofu", "organic tofu", "bean curd"],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 76,
    protein_per_100g: 8.1,
    carbs_per_100g: 1.9,
    fat_per_100g: 4.8,
    fiber_per_100g: 0.9,
    sugar_per_100g: 0.5,
    sodium_per_100g: 7,
    iron_per_100g: 5.4,
    calcium_per_100g: 350,
    magnesium_per_100g: 30,
    potassium_per_100g: 121,
    vit_a_per_100g: 0,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0.6,
    avg_cost_per_100g: 22,
  },
  {
    id: "usda-32",
    name: "Rajma / Red Kidney Beans, cooked",
    aliases: [
      "rajma",
      "cooked rajma",
      "kidney beans",
      "red kidney beans",
      "boiled rajma",
      "rajma masala",
      "rajma curry",
    ],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 127,
    protein_per_100g: 8.7,
    carbs_per_100g: 22.8,
    fat_per_100g: 0.5,
    fiber_per_100g: 6.4,
    sugar_per_100g: 0.3,
    sodium_per_100g: 2,
    iron_per_100g: 2.9,
    calcium_per_100g: 28,
    magnesium_per_100g: 45,
    potassium_per_100g: 405,
    vit_a_per_100g: 0,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0.1,
    avg_cost_per_100g: 10,
  },
  {
    id: "usda-33",
    name: "Dal Makhani, cooked",
    aliases: ["dal makhani", "dal makhni", "black dal", "maa ki dal", "creamy dal"],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 145,
    protein_per_100g: 5.5,
    carbs_per_100g: 16.0,
    fat_per_100g: 6.8,
    fiber_per_100g: 4.2,
    sugar_per_100g: 1.0,
    sodium_per_100g: 340,
    iron_per_100g: 1.9,
    calcium_per_100g: 45,
    magnesium_per_100g: 32,
    potassium_per_100g: 280,
    vit_a_per_100g: 35,
    vit_b12_per_100g: 0.1,
    vit_d_per_100g: 0.1,
    omega3_per_100g: 0.05,
    avg_cost_per_100g: 14,
  },
  {
    id: "usda-34",
    name: "Paneer Butter Masala / Makhani",
    aliases: [
      "paneer butter masala",
      "paneer makhani",
      "shahi paneer",
      "paneer curry",
      "kadai paneer",
      "paneer tikka masala",
    ],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 185,
    protein_per_100g: 8.5,
    carbs_per_100g: 7.0,
    fat_per_100g: 13.5,
    fiber_per_100g: 1.5,
    sugar_per_100g: 3.0,
    sodium_per_100g: 380,
    iron_per_100g: 0.8,
    calcium_per_100g: 210,
    magnesium_per_100g: 18,
    potassium_per_100g: 170,
    vit_a_per_100g: 85,
    vit_b12_per_100g: 0.4,
    vit_d_per_100g: 0.2,
    omega3_per_100g: 0.1,
    avg_cost_per_100g: 25,
  },
  {
    id: "usda-35",
    name: "Butter Chicken / Chicken Tikka Masala",
    aliases: [
      "butter chicken",
      "murgh makhani",
      "chicken tikka masala",
      "chicken curry",
      "kadai chicken",
    ],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 175,
    protein_per_100g: 14.5,
    carbs_per_100g: 5.5,
    fat_per_100g: 10.5,
    fiber_per_100g: 1.2,
    sugar_per_100g: 2.5,
    sodium_per_100g: 420,
    iron_per_100g: 1.2,
    calcium_per_100g: 35,
    magnesium_per_100g: 22,
    potassium_per_100g: 240,
    vit_a_per_100g: 60,
    vit_b12_per_100g: 0.3,
    vit_d_per_100g: 0.1,
    omega3_per_100g: 0.08,
    avg_cost_per_100g: 30,
  },
  {
    id: "usda-36",
    name: "Chicken Biryani",
    aliases: ["chicken biryani", "biryani", "murgh biryani", "hyderabadi biryani", "dum biryani"],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 165,
    protein_per_100g: 9.5,
    carbs_per_100g: 20.0,
    fat_per_100g: 5.2,
    fiber_per_100g: 1.1,
    sugar_per_100g: 0.5,
    sodium_per_100g: 310,
    iron_per_100g: 1.1,
    calcium_per_100g: 22,
    magnesium_per_100g: 19,
    potassium_per_100g: 160,
    vit_a_per_100g: 15,
    vit_b12_per_100g: 0.2,
    vit_d_per_100g: 0.05,
    omega3_per_100g: 0.04,
    avg_cost_per_100g: 25,
  },
  {
    id: "usda-37",
    name: "Vegetable Biryani / Pulao",
    aliases: ["veg biryani", "vegetable biryani", "veg pulao", "pulao", "peas pulao"],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 140,
    protein_per_100g: 3.5,
    carbs_per_100g: 24.0,
    fat_per_100g: 3.2,
    fiber_per_100g: 2.0,
    sugar_per_100g: 1.2,
    sodium_per_100g: 260,
    iron_per_100g: 0.9,
    calcium_per_100g: 25,
    magnesium_per_100g: 18,
    potassium_per_100g: 140,
    vit_a_per_100g: 45,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0.02,
    avg_cost_per_100g: 15,
  },
  {
    id: "usda-38",
    name: "Egg Bhurji / Scrambled Eggs with onions",
    aliases: [
      "egg bhurji",
      "anda bhurji",
      "scrambled eggs with onions",
      "egg masala",
      "anda masala",
    ],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 165,
    protein_per_100g: 11.2,
    carbs_per_100g: 3.5,
    fat_per_100g: 11.8,
    fiber_per_100g: 0.8,
    sugar_per_100g: 1.5,
    sodium_per_100g: 310,
    iron_per_100g: 1.9,
    calcium_per_100g: 58,
    magnesium_per_100g: 16,
    potassium_per_100g: 175,
    vit_a_per_100g: 140,
    vit_b12_per_100g: 0.8,
    vit_d_per_100g: 1.8,
    omega3_per_100g: 0.1,
    avg_cost_per_100g: 16,
  },
  {
    id: "usda-39",
    name: "Egg Curry",
    aliases: ["egg curry", "anda curry", "boiled egg curry", "egg gravy"],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 145,
    protein_per_100g: 8.5,
    carbs_per_100g: 4.5,
    fat_per_100g: 10.2,
    fiber_per_100g: 1.0,
    sugar_per_100g: 1.8,
    sodium_per_100g: 340,
    iron_per_100g: 1.6,
    calcium_per_100g: 45,
    magnesium_per_100g: 15,
    potassium_per_100g: 165,
    vit_a_per_100g: 110,
    vit_b12_per_100g: 0.6,
    vit_d_per_100g: 1.2,
    omega3_per_100g: 0.08,
    avg_cost_per_100g: 18,
  },
  {
    id: "usda-40",
    name: "Chole / Chana Masala, cooked",
    aliases: ["chole", "chana masala", "chhole", "punjabi chole", "cooked chana masala"],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 140,
    protein_per_100g: 6.8,
    carbs_per_100g: 19.5,
    fat_per_100g: 4.2,
    fiber_per_100g: 5.5,
    sugar_per_100g: 2.2,
    sodium_per_100g: 350,
    iron_per_100g: 2.4,
    calcium_per_100g: 48,
    magnesium_per_100g: 42,
    potassium_per_100g: 260,
    vit_a_per_100g: 30,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0.05,
    avg_cost_per_100g: 12,
  },
  {
    id: "usda-41",
    name: "Plain Paratha / Aloo Paratha",
    aliases: ["paratha", "parathas", "plain paratha", "aloo paratha", "parantha"],
    default_unit: "piece",
    unit_grams: 70,
    calories_per_100g: 280,
    protein_per_100g: 6.5,
    carbs_per_100g: 42.0,
    fat_per_100g: 9.8,
    fiber_per_100g: 4.5,
    sugar_per_100g: 1.2,
    sodium_per_100g: 220,
    iron_per_100g: 2.2,
    calcium_per_100g: 25,
    magnesium_per_100g: 45,
    potassium_per_100g: 190,
    vit_a_per_100g: 10,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0.05,
    avg_cost_per_100g: 12,
  },
  {
    id: "usda-42",
    name: "Naan / Garlic Naan / Tandoori Roti",
    aliases: ["naan", "garlic naan", "butter naan", "tandoori roti", "tandoori naan"],
    default_unit: "piece",
    unit_grams: 80,
    calories_per_100g: 290,
    protein_per_100g: 8.5,
    carbs_per_100g: 50.0,
    fat_per_100g: 6.2,
    fiber_per_100g: 2.5,
    sugar_per_100g: 2.8,
    sodium_per_100g: 410,
    iron_per_100g: 2.0,
    calcium_per_100g: 60,
    magnesium_per_100g: 25,
    potassium_per_100g: 130,
    vit_a_per_100g: 15,
    vit_b12_per_100g: 0.1,
    vit_d_per_100g: 0,
    omega3_per_100g: 0.02,
    avg_cost_per_100g: 15,
  },
  {
    id: "usda-43",
    name: "Poha, cooked",
    aliases: ["poha", "cooked poha", "kanda poha", "flattened rice", "batata poha", "chivda"],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 130,
    protein_per_100g: 2.6,
    carbs_per_100g: 26.5,
    fat_per_100g: 1.8,
    fiber_per_100g: 1.5,
    sugar_per_100g: 1.0,
    sodium_per_100g: 180,
    iron_per_100g: 2.8,
    calcium_per_100g: 15,
    magnesium_per_100g: 20,
    potassium_per_100g: 95,
    vit_a_per_100g: 12,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0.02,
    avg_cost_per_100g: 8,
  },
  {
    id: "usda-44",
    name: "Upma, cooked",
    aliases: ["upma", "rava upma", "sooji upma", "semolina upma"],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 135,
    protein_per_100g: 3.2,
    carbs_per_100g: 24.0,
    fat_per_100g: 3.0,
    fiber_per_100g: 1.4,
    sugar_per_100g: 0.8,
    sodium_per_100g: 210,
    iron_per_100g: 1.2,
    calcium_per_100g: 18,
    magnesium_per_100g: 15,
    potassium_per_100g: 85,
    vit_a_per_100g: 8,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0.02,
    avg_cost_per_100g: 8,
  },
  {
    id: "usda-45",
    name: "Idli (Steamed Rice-Lentil Cake)",
    aliases: ["idli", "idlis", "steamed idli", "rice idli"],
    default_unit: "piece",
    unit_grams: 50,
    calories_per_100g: 130,
    protein_per_100g: 4.2,
    carbs_per_100g: 27.5,
    fat_per_100g: 0.4,
    fiber_per_100g: 1.5,
    sugar_per_100g: 0.2,
    sodium_per_100g: 140,
    iron_per_100g: 0.8,
    calcium_per_100g: 15,
    magnesium_per_100g: 22,
    potassium_per_100g: 80,
    vit_a_per_100g: 0,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0,
    avg_cost_per_100g: 10,
  },
  {
    id: "usda-46",
    name: "Dosa (Plain / Masala Dosa)",
    aliases: ["dosa", "masala dosa", "plain dosa", "crispy dosa", "ghee roast dosa"],
    default_unit: "piece",
    unit_grams: 100,
    calories_per_100g: 170,
    protein_per_100g: 3.9,
    carbs_per_100g: 29.0,
    fat_per_100g: 4.5,
    fiber_per_100g: 1.8,
    sugar_per_100g: 0.5,
    sodium_per_100g: 230,
    iron_per_100g: 1.1,
    calcium_per_100g: 20,
    magnesium_per_100g: 25,
    potassium_per_100g: 110,
    vit_a_per_100g: 5,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0.02,
    avg_cost_per_100g: 12,
  },
  {
    id: "usda-47",
    name: "Samosa",
    aliases: ["samosa", "samosas", "aloo samosa", "fried samosa", "punjabi samosa"],
    default_unit: "piece",
    unit_grams: 75,
    calories_per_100g: 260,
    protein_per_100g: 4.5,
    carbs_per_100g: 32.0,
    fat_per_100g: 13.0,
    fiber_per_100g: 2.8,
    sugar_per_100g: 1.5,
    sodium_per_100g: 420,
    iron_per_100g: 1.6,
    calcium_per_100g: 22,
    magnesium_per_100g: 28,
    potassium_per_100g: 210,
    vit_a_per_100g: 8,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0.1,
    avg_cost_per_100g: 15,
  },
  {
    id: "usda-48",
    name: "Pasta / Spaghetti, cooked with tomato sauce",
    aliases: [
      "pasta",
      "spaghetti",
      "penne pasta",
      "cooked pasta",
      "pasta with sauce",
      "macaroni",
      "red sauce pasta",
    ],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 130,
    protein_per_100g: 4.8,
    carbs_per_100g: 24.5,
    fat_per_100g: 1.5,
    fiber_per_100g: 2.0,
    sugar_per_100g: 2.5,
    sodium_per_100g: 260,
    iron_per_100g: 1.2,
    calcium_per_100g: 18,
    magnesium_per_100g: 24,
    potassium_per_100g: 210,
    vit_a_per_100g: 18,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0.02,
    avg_cost_per_100g: 15,
  },
  {
    id: "usda-49",
    name: "Noodles / Hakka Noodles / Chowmein",
    aliases: ["noodles", "hakka noodles", "veg noodles", "chowmein", "ramen", "fried noodles"],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 155,
    protein_per_100g: 4.2,
    carbs_per_100g: 26.0,
    fat_per_100g: 3.8,
    fiber_per_100g: 1.8,
    sugar_per_100g: 1.2,
    sodium_per_100g: 390,
    iron_per_100g: 1.0,
    calcium_per_100g: 16,
    magnesium_per_100g: 18,
    potassium_per_100g: 120,
    vit_a_per_100g: 12,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0.03,
    avg_cost_per_100g: 14,
  },
  {
    id: "usda-50",
    name: "Pizza (Cheese / Veggie Slice)",
    aliases: ["pizza", "pizza slice", "cheese pizza", "margherita pizza", "veggie pizza"],
    default_unit: "slice",
    unit_grams: 100,
    calories_per_100g: 266,
    protein_per_100g: 11.5,
    carbs_per_100g: 33.0,
    fat_per_100g: 10.2,
    fiber_per_100g: 2.3,
    sugar_per_100g: 3.6,
    sodium_per_100g: 590,
    iron_per_100g: 2.2,
    calcium_per_100g: 190,
    magnesium_per_100g: 24,
    potassium_per_100g: 172,
    vit_a_per_100g: 80,
    vit_b12_per_100g: 0.6,
    vit_d_per_100g: 0.2,
    omega3_per_100g: 0.1,
    avg_cost_per_100g: 35,
  },
  {
    id: "usda-51",
    name: "Burger / Veg / Chicken Burger",
    aliases: ["burger", "cheeseburger", "chicken burger", "veg burger", "hamburger"],
    default_unit: "piece",
    unit_grams: 150,
    calories_per_100g: 250,
    protein_per_100g: 13.0,
    carbs_per_100g: 24.0,
    fat_per_100g: 11.5,
    fiber_per_100g: 1.8,
    sugar_per_100g: 4.2,
    sodium_per_100g: 480,
    iron_per_100g: 2.3,
    calcium_per_100g: 110,
    magnesium_per_100g: 22,
    potassium_per_100g: 230,
    vit_a_per_100g: 40,
    vit_b12_per_100g: 0.8,
    vit_d_per_100g: 0.2,
    omega3_per_100g: 0.1,
    avg_cost_per_100g: 30,
  },
  {
    id: "usda-52",
    name: "French Fries",
    aliases: ["french fries", "fries", "potato fries", "chips fries", "finger chips"],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 312,
    protein_per_100g: 3.4,
    carbs_per_100g: 41.4,
    fat_per_100g: 15.0,
    fiber_per_100g: 3.8,
    sugar_per_100g: 0.3,
    sodium_per_100g: 210,
    iron_per_100g: 0.8,
    calcium_per_100g: 18,
    magnesium_per_100g: 35,
    potassium_per_100g: 579,
    vit_a_per_100g: 0,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0.1,
    avg_cost_per_100g: 20,
  },
  {
    id: "usda-53",
    name: "Sandwich (Veg / Chicken Grilled)",
    aliases: ["sandwich", "grilled sandwich", "veg sandwich", "chicken sandwich", "club sandwich"],
    default_unit: "piece",
    unit_grams: 140,
    calories_per_100g: 210,
    protein_per_100g: 8.5,
    carbs_per_100g: 26.0,
    fat_per_100g: 8.2,
    fiber_per_100g: 2.8,
    sugar_per_100g: 3.2,
    sodium_per_100g: 380,
    iron_per_100g: 1.8,
    calcium_per_100g: 85,
    magnesium_per_100g: 28,
    potassium_per_100g: 180,
    vit_a_per_100g: 35,
    vit_b12_per_100g: 0.3,
    vit_d_per_100g: 0.1,
    omega3_per_100g: 0.08,
    avg_cost_per_100g: 22,
  },
  {
    id: "usda-54",
    name: "Tuna (Canned in water)",
    aliases: ["tuna", "canned tuna", "tuna in water", "tuna fish"],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 116,
    protein_per_100g: 25.5,
    carbs_per_100g: 0,
    fat_per_100g: 0.8,
    fiber_per_100g: 0,
    sugar_per_100g: 0,
    sodium_per_100g: 330,
    iron_per_100g: 1.3,
    calcium_per_100g: 11,
    magnesium_per_100g: 28,
    potassium_per_100g: 237,
    vit_a_per_100g: 18,
    vit_b12_per_100g: 2.8,
    vit_d_per_100g: 1.7,
    omega3_per_100g: 0.3,
    avg_cost_per_100g: 50,
  },
  {
    id: "usda-55",
    name: "Prawns / Shrimp, cooked",
    aliases: ["prawns", "shrimp", "cooked prawns", "cooked shrimp", "grilled shrimp", "jhinga"],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 99,
    protein_per_100g: 24.0,
    carbs_per_100g: 0.2,
    fat_per_100g: 0.3,
    fiber_per_100g: 0,
    sugar_per_100g: 0,
    sodium_per_100g: 111,
    iron_per_100g: 0.5,
    calcium_per_100g: 70,
    magnesium_per_100g: 39,
    potassium_per_100g: 259,
    vit_a_per_100g: 54,
    vit_b12_per_100g: 1.2,
    vit_d_per_100g: 0.1,
    omega3_per_100g: 0.4,
    avg_cost_per_100g: 65,
  },
  {
    id: "usda-56",
    name: "Cheese (Cheddar / Mozzarella / Processed)",
    aliases: ["cheese", "cheddar", "mozzarella", "cheese slice", "processed cheese", "parmesan"],
    default_unit: "slice",
    unit_grams: 20,
    calories_per_100g: 350,
    protein_per_100g: 23.0,
    carbs_per_100g: 2.5,
    fat_per_100g: 28.0,
    fiber_per_100g: 0,
    sugar_per_100g: 0.5,
    sodium_per_100g: 650,
    iron_per_100g: 0.4,
    calcium_per_100g: 720,
    magnesium_per_100g: 28,
    potassium_per_100g: 98,
    vit_a_per_100g: 260,
    vit_b12_per_100g: 1.5,
    vit_d_per_100g: 0.6,
    omega3_per_100g: 0.4,
    avg_cost_per_100g: 45,
  },
  {
    id: "usda-57",
    name: "Chia Seeds",
    aliases: ["chia seeds", "chia", "sabja seeds", "basil seeds"],
    default_unit: "tbsp",
    unit_grams: 12,
    calories_per_100g: 486,
    protein_per_100g: 16.5,
    carbs_per_100g: 42.1,
    fat_per_100g: 30.7,
    fiber_per_100g: 34.4,
    sugar_per_100g: 0,
    sodium_per_100g: 16,
    iron_per_100g: 7.7,
    calcium_per_100g: 631,
    magnesium_per_100g: 335,
    potassium_per_100g: 407,
    vit_a_per_100g: 54,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 17.8,
    avg_cost_per_100g: 50,
  },
  {
    id: "usda-58",
    name: "Flax Seeds",
    aliases: ["flax seeds", "flaxseed", "alsi", "flax"],
    default_unit: "tbsp",
    unit_grams: 10,
    calories_per_100g: 534,
    protein_per_100g: 18.3,
    carbs_per_100g: 28.9,
    fat_per_100g: 42.2,
    fiber_per_100g: 27.3,
    sugar_per_100g: 1.5,
    sodium_per_100g: 30,
    iron_per_100g: 5.7,
    calcium_per_100g: 255,
    magnesium_per_100g: 392,
    potassium_per_100g: 813,
    vit_a_per_100g: 0,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 22.8,
    avg_cost_per_100g: 35,
  },
  {
    id: "usda-59",
    name: "Walnuts",
    aliases: ["walnuts", "akhrot", "walnut pieces"],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 654,
    protein_per_100g: 15.2,
    carbs_per_100g: 13.7,
    fat_per_100g: 65.2,
    fiber_per_100g: 6.7,
    sugar_per_100g: 2.6,
    sodium_per_100g: 2,
    iron_per_100g: 2.9,
    calcium_per_100g: 98,
    magnesium_per_100g: 158,
    potassium_per_100g: 441,
    vit_a_per_100g: 20,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 9.1,
    avg_cost_per_100g: 90,
  },
  {
    id: "usda-60",
    name: "Cashews",
    aliases: ["cashews", "cashew nuts", "kaju", "roasted cashews"],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 553,
    protein_per_100g: 18.2,
    carbs_per_100g: 30.2,
    fat_per_100g: 43.8,
    fiber_per_100g: 3.3,
    sugar_per_100g: 5.9,
    sodium_per_100g: 12,
    iron_per_100g: 6.7,
    calcium_per_100g: 37,
    magnesium_per_100g: 292,
    potassium_per_100g: 660,
    vit_a_per_100g: 0,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0.1,
    avg_cost_per_100g: 85,
  },
  {
    id: "usda-61",
    name: "Mango, fresh",
    aliases: ["mango", "fresh mango", "ripe mango", "aam", "mango slices"],
    default_unit: "piece",
    unit_grams: 150,
    calories_per_100g: 60,
    protein_per_100g: 0.8,
    carbs_per_100g: 15.0,
    fat_per_100g: 0.4,
    fiber_per_100g: 1.6,
    sugar_per_100g: 13.7,
    sodium_per_100g: 1,
    iron_per_100g: 0.2,
    calcium_per_100g: 11,
    magnesium_per_100g: 10,
    potassium_per_100g: 168,
    vit_a_per_100g: 54,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0.04,
    avg_cost_per_100g: 15,
  },
  {
    id: "usda-62",
    name: "Orange / Citrus Fruit",
    aliases: ["orange", "oranges", "santra", "mosambi", "tangerine", "clementine", "citrus"],
    default_unit: "piece",
    unit_grams: 130,
    calories_per_100g: 47,
    protein_per_100g: 0.9,
    carbs_per_100g: 11.8,
    fat_per_100g: 0.1,
    fiber_per_100g: 2.4,
    sugar_per_100g: 9.4,
    sodium_per_100g: 0,
    iron_per_100g: 0.1,
    calcium_per_100g: 40,
    magnesium_per_100g: 10,
    potassium_per_100g: 181,
    vit_a_per_100g: 11,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0.01,
    avg_cost_per_100g: 10,
  },
  {
    id: "usda-63",
    name: "Papaya, fresh",
    aliases: ["papaya", "fresh papaya", "ripe papaya", "papita"],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 43,
    protein_per_100g: 0.5,
    carbs_per_100g: 10.8,
    fat_per_100g: 0.3,
    fiber_per_100g: 1.7,
    sugar_per_100g: 7.8,
    sodium_per_100g: 8,
    iron_per_100g: 0.3,
    calcium_per_100g: 20,
    magnesium_per_100g: 21,
    potassium_per_100g: 182,
    vit_a_per_100g: 47,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0.02,
    avg_cost_per_100g: 8,
  },
  {
    id: "usda-64",
    name: "Watermelon",
    aliases: ["watermelon", "fresh watermelon", "tarbooz"],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 30,
    protein_per_100g: 0.6,
    carbs_per_100g: 7.6,
    fat_per_100g: 0.2,
    fiber_per_100g: 0.4,
    sugar_per_100g: 6.2,
    sodium_per_100g: 1,
    iron_per_100g: 0.2,
    calcium_per_100g: 7,
    magnesium_per_100g: 10,
    potassium_per_100g: 112,
    vit_a_per_100g: 28,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0.01,
    avg_cost_per_100g: 6,
  },
  {
    id: "usda-65",
    name: "Cucumber",
    aliases: ["cucumber", "cucumbers", "kheera", "kakdi", "raw cucumber"],
    default_unit: "piece",
    unit_grams: 100,
    calories_per_100g: 15,
    protein_per_100g: 0.7,
    carbs_per_100g: 3.6,
    fat_per_100g: 0.1,
    fiber_per_100g: 0.5,
    sugar_per_100g: 1.7,
    sodium_per_100g: 2,
    iron_per_100g: 0.3,
    calcium_per_100g: 16,
    magnesium_per_100g: 13,
    potassium_per_100g: 147,
    vit_a_per_100g: 5,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0,
    avg_cost_per_100g: 4,
  },
  {
    id: "usda-66",
    name: "Tomato, fresh",
    aliases: ["tomato", "tomatoes", "tamatar", "fresh tomato", "cherry tomatoes"],
    default_unit: "piece",
    unit_grams: 90,
    calories_per_100g: 18,
    protein_per_100g: 0.9,
    carbs_per_100g: 3.9,
    fat_per_100g: 0.2,
    fiber_per_100g: 1.2,
    sugar_per_100g: 2.6,
    sodium_per_100g: 5,
    iron_per_100g: 0.3,
    calcium_per_100g: 10,
    magnesium_per_100g: 11,
    potassium_per_100g: 237,
    vit_a_per_100g: 42,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0,
    avg_cost_per_100g: 5,
  },
  {
    id: "usda-67",
    name: "Onion, fresh",
    aliases: ["onion", "onions", "pyaz", "red onion", "white onion", "chopped onion"],
    default_unit: "piece",
    unit_grams: 80,
    calories_per_100g: 40,
    protein_per_100g: 1.1,
    carbs_per_100g: 9.3,
    fat_per_100g: 0.1,
    fiber_per_100g: 1.7,
    sugar_per_100g: 4.2,
    sodium_per_100g: 4,
    iron_per_100g: 0.2,
    calcium_per_100g: 23,
    magnesium_per_100g: 10,
    potassium_per_100g: 146,
    vit_a_per_100g: 0,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0,
    avg_cost_per_100g: 4,
  },
  {
    id: "usda-68",
    name: "Cauliflower / Gobi, cooked",
    aliases: ["cauliflower", "gobi", "cooked cauliflower", "steamed cauliflower", "aloo gobi"],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 25,
    protein_per_100g: 1.9,
    carbs_per_100g: 5.0,
    fat_per_100g: 0.3,
    fiber_per_100g: 2.0,
    sugar_per_100g: 1.9,
    sodium_per_100g: 30,
    iron_per_100g: 0.4,
    calcium_per_100g: 22,
    magnesium_per_100g: 15,
    potassium_per_100g: 299,
    vit_a_per_100g: 0,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0.04,
    avg_cost_per_100g: 6,
  },
  {
    id: "usda-69",
    name: "Green Peas / Matar, cooked",
    aliases: ["green peas", "peas", "matar", "cooked peas", "boiled peas"],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 84,
    protein_per_100g: 5.4,
    carbs_per_100g: 15.6,
    fat_per_100g: 0.4,
    fiber_per_100g: 5.5,
    sugar_per_100g: 5.7,
    sodium_per_100g: 5,
    iron_per_100g: 1.5,
    calcium_per_100g: 25,
    magnesium_per_100g: 33,
    potassium_per_100g: 244,
    vit_a_per_100g: 38,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0.03,
    avg_cost_per_100g: 10,
  },
  {
    id: "usda-70",
    name: "Mushroom (Button), cooked",
    aliases: ["mushroom", "mushrooms", "button mushroom", "cooked mushroom", "grilled mushrooms"],
    default_unit: "g",
    unit_grams: 1,
    calories_per_100g: 28,
    protein_per_100g: 3.1,
    carbs_per_100g: 4.1,
    fat_per_100g: 0.5,
    fiber_per_100g: 1.5,
    sugar_per_100g: 1.8,
    sodium_per_100g: 4,
    iron_per_100g: 0.5,
    calcium_per_100g: 3,
    magnesium_per_100g: 12,
    potassium_per_100g: 356,
    vit_a_per_100g: 0,
    vit_b12_per_100g: 0.04,
    vit_d_per_100g: 0.2,
    omega3_per_100g: 0,
    avg_cost_per_100g: 15,
  },
  {
    id: "usda-71",
    name: "Tea / Chai with Milk and Sugar",
    aliases: ["chai", "tea", "milk tea", "indian tea", "masala chai", "cup of tea"],
    default_unit: "cup",
    unit_grams: 150,
    calories_per_100g: 45,
    protein_per_100g: 1.8,
    carbs_per_100g: 5.5,
    fat_per_100g: 1.7,
    fiber_per_100g: 0,
    sugar_per_100g: 5.0,
    sodium_per_100g: 25,
    iron_per_100g: 0.1,
    calcium_per_100g: 65,
    magnesium_per_100g: 8,
    potassium_per_100g: 85,
    vit_a_per_100g: 20,
    vit_b12_per_100g: 0.2,
    vit_d_per_100g: 0.5,
    omega3_per_100g: 0.02,
    avg_cost_per_100g: 5,
  },
  {
    id: "usda-72",
    name: "Coffee with Milk",
    aliases: ["coffee", "latte", "cappuccino", "milk coffee", "hot coffee", "cold coffee"],
    default_unit: "cup",
    unit_grams: 150,
    calories_per_100g: 50,
    protein_per_100g: 2.2,
    carbs_per_100g: 5.8,
    fat_per_100g: 2.0,
    fiber_per_100g: 0,
    sugar_per_100g: 5.2,
    sodium_per_100g: 30,
    iron_per_100g: 0.1,
    calcium_per_100g: 75,
    magnesium_per_100g: 12,
    potassium_per_100g: 110,
    vit_a_per_100g: 22,
    vit_b12_per_100g: 0.3,
    vit_d_per_100g: 0.6,
    omega3_per_100g: 0.03,
    avg_cost_per_100g: 8,
  },
  {
    id: "usda-73",
    name: "Honey",
    aliases: ["honey", "raw honey", "pure honey", "shahad"],
    default_unit: "tbsp",
    unit_grams: 20,
    calories_per_100g: 304,
    protein_per_100g: 0.3,
    carbs_per_100g: 82.4,
    fat_per_100g: 0,
    fiber_per_100g: 0.2,
    sugar_per_100g: 82.1,
    sodium_per_100g: 4,
    iron_per_100g: 0.4,
    calcium_per_100g: 6,
    magnesium_per_100g: 2,
    potassium_per_100g: 52,
    vit_a_per_100g: 0,
    vit_b12_per_100g: 0,
    vit_d_per_100g: 0,
    omega3_per_100g: 0,
    avg_cost_per_100g: 30,
  },
  {
    id: "usda-74",
    name: "Dark Chocolate (70%+)",
    aliases: ["dark chocolate", "chocolate", "cocoa", "70% dark chocolate"],
    default_unit: "piece",
    unit_grams: 20,
    calories_per_100g: 598,
    protein_per_100g: 7.8,
    carbs_per_100g: 45.9,
    fat_per_100g: 42.6,
    fiber_per_100g: 10.9,
    sugar_per_100g: 24.0,
    sodium_per_100g: 20,
    iron_per_100g: 11.9,
    calcium_per_100g: 73,
    magnesium_per_100g: 228,
    potassium_per_100g: 715,
    vit_a_per_100g: 2,
    vit_b12_per_100g: 0.3,
    vit_d_per_100g: 0,
    omega3_per_100g: 0.1,
    avg_cost_per_100g: 60,
  },
];

/**
 * Seed USDA / Local Nutrition Database with standard foods, nutrients, and cost metrics
 */
async function seedUSDAIngredientsIfEmptyInternal(db: Database | null): Promise<void> {
  if (!db) return;

  try {
    for (const ing of USDA_SEEDS) {
      db.run(
        `INSERT OR REPLACE INTO usda_ingredients (
          id, name, aliases, default_unit, unit_grams,
          calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
          sugar_per_100g, sodium_per_100g, iron_per_100g, calcium_per_100g, magnesium_per_100g,
          potassium_per_100g, vit_a_per_100g, vit_b12_per_100g, vit_d_per_100g, omega3_per_100g, avg_cost_per_100g
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          ing.id,
          ing.name,
          JSON.stringify(ing.aliases),
          ing.default_unit,
          ing.unit_grams,
          ing.calories_per_100g,
          ing.protein_per_100g,
          ing.carbs_per_100g,
          ing.fat_per_100g,
          ing.fiber_per_100g,
          ing.sugar_per_100g,
          ing.sodium_per_100g,
          ing.iron_per_100g,
          ing.calcium_per_100g,
          ing.magnesium_per_100g,
          ing.potassium_per_100g,
          ing.vit_a_per_100g,
          ing.vit_b12_per_100g,
          ing.vit_d_per_100g,
          ing.omega3_per_100g,
          ing.avg_cost_per_100g,
        ],
      );
    }
  } catch (e) {
    console.error("[RecipeDB] Error seeding USDA ingredients:", e);
  }
}

/**
 * Seed initial curated recipes into SQLite if empty
 */
async function seedCuratedRecipesIfEmptyInternal(db: Database | null): Promise<void> {
  if (!db) return;

  try {
    const checkStmt = db.prepare(`SELECT COUNT(*) as cnt FROM recipes`);
    if (checkStmt.step()) {
      const row = checkStmt.getAsObject() as { cnt: number };
      checkStmt.free();
      if (row.cnt > 0) return; // Already seeded
    } else {
      checkStmt.free();
    }

    const curatedList: Recipe[] = [
      {
        id: "rec-b1",
        name: "High-Protein Soya Granules & Paneer Scramble",
        meal_type: "Breakfast",
        diet_type: "veg",
        goal: "Muscle Gain",
        cost_amount: 32,
        currency: "₹",
        prep_minutes: 12,
        calories: 420,
        protein_g: 38,
        carbs_g: 28,
        fat_g: 14,
        fiber_g: 8,
        sugar_g: 3,
        sodium_mg: 320,
        iron_mg: 8.5,
        calcium_mg: 380,
        magnesium_mg: 140,
        potassium_mg: 620,
        vit_a_ug: 40,
        vit_b12_ug: 0.6,
        vit_d_ug: 0.4,
        omega3_g: 0.2,
        cuisine: "Indian",
        difficulty: "Easy",
        created_by: "system",
        source: "local_db",
        created_at: new Date().toISOString(),
        ingredients: [
          {
            name: "Soya Granules",
            quantity: 50,
            unit: "g",
            estimated_cost: 9,
            calories: 172,
            protein_g: 26,
            carbs_g: 16,
            fat_g: 0.2,
          },
          {
            name: "Cottage Cheese / Paneer",
            quantity: 50,
            unit: "g",
            estimated_cost: 18,
            calories: 132,
            protein_g: 9,
            carbs_g: 1,
            fat_g: 10,
          },
          {
            name: "Whole Wheat Roti",
            quantity: 1,
            unit: "piece",
            estimated_cost: 5,
            calories: 100,
            protein_g: 3,
            carbs_g: 19,
            fat_g: 1,
          },
        ],
        steps: [
          {
            step_number: 1,
            instruction:
              "Soak 50g soya granules in boiling hot water for 5 minutes then drain thoroughly.",
          },
          {
            step_number: 2,
            instruction: "Saute chopped onions, green chilies, and tomatoes in 1 tsp oil.",
          },
          {
            step_number: 3,
            instruction:
              "Add drained soya granules, crumbled paneer, salt, turmeric, and garam masala.",
          },
          {
            step_number: 4,
            instruction: "Stir fry for 4 minutes until golden and serve hot with 1 roti.",
          },
        ],
        tags: ["High Protein", "Budget", "Vegetarian", "Quick"],
        goals: ["Muscle Gain", "Lean Bulk", "High Protein"],
      },
      {
        id: "rec-b2",
        name: "Boiled Egg White Salad with Roasted Chickpeas",
        meal_type: "Breakfast",
        diet_type: "eggetarian",
        goal: "Weight Loss",
        cost_amount: 28,
        currency: "₹",
        prep_minutes: 10,
        calories: 310,
        protein_g: 30,
        carbs_g: 26,
        fat_g: 6,
        fiber_g: 7,
        sugar_g: 2,
        sodium_mg: 280,
        iron_mg: 3.8,
        calcium_mg: 90,
        magnesium_mg: 60,
        potassium_mg: 450,
        vit_a_ug: 120,
        vit_b12_ug: 1.2,
        vit_d_ug: 1.5,
        omega3_g: 0.1,
        cuisine: "Indian",
        difficulty: "Easy",
        created_by: "system",
        source: "local_db",
        created_at: new Date().toISOString(),
        ingredients: [
          {
            name: "Whole Egg",
            quantity: 4,
            unit: "piece",
            estimated_cost: 24,
            calories: 200,
            protein_g: 24,
            carbs_g: 2,
            fat_g: 4,
          },
          {
            name: "Chickpeas / Chana",
            quantity: 30,
            unit: "g",
            estimated_cost: 4,
            calories: 110,
            protein_g: 6,
            carbs_g: 18,
            fat_g: 2,
          },
        ],
        steps: [
          {
            step_number: 1,
            instruction:
              "Boil 4 eggs for 10 minutes. Remove yolk from 3 eggs, keeping 1 whole egg.",
          },
          { step_number: 2, instruction: "Chop egg whites and 1 whole egg into bite-sized cubes." },
          {
            step_number: 3,
            instruction:
              "Mix with boiled/roasted chickpeas, cucumber, chat masala, and lemon juice.",
          },
        ],
        tags: ["Low Fat", "High Protein", "Weight Loss", "Keto Friendly"],
        goals: ["Weight Loss", "Fat Loss", "Keto", "High Protein"],
      },
      {
        id: "rec-l1",
        name: "Grilled Chicken Breast with Steamed Brown Rice & Dal",
        meal_type: "Lunch",
        diet_type: "non_veg",
        goal: "Lean Bulk",
        cost_amount: 65,
        currency: "₹",
        prep_minutes: 20,
        calories: 550,
        protein_g: 48,
        carbs_g: 58,
        fat_g: 9,
        fiber_g: 8,
        sugar_g: 2,
        sodium_mg: 410,
        iron_mg: 4.2,
        calcium_mg: 110,
        magnesium_mg: 130,
        potassium_mg: 780,
        vit_a_ug: 20,
        vit_b12_ug: 0.8,
        vit_d_ug: 0.2,
        omega3_g: 0.1,
        cuisine: "Indian",
        difficulty: "Medium",
        created_by: "system",
        source: "local_db",
        created_at: new Date().toISOString(),
        ingredients: [
          {
            name: "Chicken Breast Boneless Skinless",
            quantity: 150,
            unit: "g",
            estimated_cost: 42,
            calories: 247,
            protein_g: 46,
            carbs_g: 0,
            fat_g: 5,
          },
          {
            name: "White Rice / Basmati Rice",
            quantity: 150,
            unit: "g",
            estimated_cost: 12,
            calories: 195,
            protein_g: 4,
            carbs_g: 42,
            fat_g: 0.5,
          },
          {
            name: "Yellow Lentils / Toor Dal",
            quantity: 30,
            unit: "g",
            estimated_cost: 11,
            calories: 103,
            protein_g: 7,
            carbs_g: 18,
            fat_g: 0.5,
          },
        ],
        steps: [
          {
            step_number: 1,
            instruction:
              "Marinate chicken breast in yogurt, ginger-garlic paste, and cumin powder.",
          },
          {
            step_number: 2,
            instruction:
              "Pan sear or grill chicken for 6-7 minutes on each side until cooked through.",
          },
          { step_number: 3, instruction: "Serve with warm cooked rice and freshly tempered dal." },
        ],
        tags: ["High Protein", "Lean Bulk", "Gym Friendly"],
        goals: ["Lean Bulk", "Muscle Gain", "Maintenance"],
      },
      {
        id: "rec-l2",
        name: "Diabetic-Friendly Moong Dal Chilla with Palak & Curd",
        meal_type: "Lunch",
        diet_type: "veg",
        goal: "Diabetic",
        cost_amount: 25,
        currency: "₹",
        prep_minutes: 15,
        calories: 340,
        protein_g: 22,
        carbs_g: 42,
        fat_g: 8,
        fiber_g: 11,
        sugar_g: 3,
        sodium_mg: 290,
        iron_mg: 6.1,
        calcium_mg: 210,
        magnesium_mg: 150,
        potassium_mg: 820,
        vit_a_ug: 310,
        vit_b12_ug: 0.4,
        vit_d_ug: 0.1,
        omega3_g: 0.1,
        cuisine: "Indian",
        difficulty: "Easy",
        created_by: "system",
        source: "local_db",
        created_at: new Date().toISOString(),
        ingredients: [
          {
            name: "Yellow Lentils / Toor Dal",
            quantity: 60,
            unit: "g",
            estimated_cost: 11,
            calories: 205,
            protein_g: 13,
            carbs_g: 37,
            fat_g: 1,
          },
          {
            name: "Spinach / Palak",
            quantity: 50,
            unit: "g",
            estimated_cost: 6,
            calories: 12,
            protein_g: 1,
            carbs_g: 2,
            fat_g: 0.2,
          },
          {
            name: "Curd / Dahi / Greek Yogurt",
            quantity: 100,
            unit: "g",
            estimated_cost: 8,
            calories: 61,
            protein_g: 3.5,
            carbs_g: 4.7,
            fat_g: 3.3,
          },
        ],
        steps: [
          {
            step_number: 1,
            instruction:
              "Grind soaked moong dal with green chillies, ginger, and spinach into a batter.",
          },
          {
            step_number: 2,
            instruction:
              "Pour batter onto hot non-stick tawa and make crispy chillas using minimal oil.",
          },
          { step_number: 3, instruction: "Serve hot with low-fat fresh curd." },
        ],
        tags: ["Low GI", "Diabetic Friendly", "High Fiber", "Vegan Option"],
        goals: ["Diabetic", "Weight Loss", "Vegetarian"],
      },
      {
        id: "rec-s1",
        name: "Peanut Butter Oatmeal Shake with Banana",
        meal_type: "Snack",
        diet_type: "vegan",
        goal: "Muscle Gain",
        cost_amount: 30,
        currency: "₹",
        prep_minutes: 5,
        calories: 410,
        protein_g: 18,
        carbs_g: 54,
        fat_g: 14,
        fiber_g: 8,
        sugar_g: 16,
        sodium_mg: 110,
        iron_mg: 3.2,
        calcium_mg: 160,
        magnesium_mg: 130,
        potassium_mg: 680,
        vit_a_ug: 50,
        vit_b12_ug: 0,
        vit_d_ug: 0,
        omega3_g: 0.1,
        cuisine: "Global",
        difficulty: "Easy",
        created_by: "system",
        source: "local_db",
        created_at: new Date().toISOString(),
        ingredients: [
          {
            name: "Rolled Oats",
            quantity: 40,
            unit: "g",
            estimated_cost: 6,
            calories: 155,
            protein_g: 6,
            carbs_g: 26,
            fat_g: 2.8,
          },
          {
            name: "Peanut Butter",
            quantity: 20,
            unit: "g",
            estimated_cost: 8,
            calories: 118,
            protein_g: 5,
            carbs_g: 4,
            fat_g: 10,
          },
          {
            name: "Fresh Banana",
            quantity: 1,
            unit: "piece",
            estimated_cost: 5,
            calories: 89,
            protein_g: 1,
            carbs_g: 23,
            fat_g: 0.3,
          },
          {
            name: "Milk (Toned / Low Fat)",
            quantity: 150,
            unit: "ml",
            estimated_cost: 9,
            calories: 87,
            protein_g: 5,
            carbs_g: 7,
            fat_g: 4.6,
          },
        ],
        steps: [
          {
            step_number: 1,
            instruction: "Add oats, peanut butter, banana slices, and milk to blender jar.",
          },
          { step_number: 2, instruction: "Blend on high speed for 45 seconds until smooth." },
          { step_number: 3, instruction: "Pour into tall glass and enjoy immediately." },
        ],
        tags: ["Quick", "Vegan", "High Energy", "Pre-workout"],
        goals: ["Muscle Gain", "Lean Bulk", "Vegan"],
      },
      {
        id: "rec-d1",
        name: "Palak Paneer with 2 Whole Wheat Chapatis",
        meal_type: "Dinner",
        diet_type: "veg",
        goal: "Maintenance",
        cost_amount: 45,
        currency: "₹",
        prep_minutes: 20,
        calories: 460,
        protein_g: 24,
        carbs_g: 44,
        fat_g: 20,
        fiber_g: 9,
        sugar_g: 3,
        sodium_mg: 380,
        iron_mg: 6.4,
        calcium_mg: 520,
        magnesium_mg: 160,
        potassium_mg: 890,
        vit_a_ug: 520,
        vit_b12_ug: 0.8,
        vit_d_ug: 0.5,
        omega3_g: 0.2,
        cuisine: "Indian",
        difficulty: "Medium",
        created_by: "system",
        source: "local_db",
        created_at: new Date().toISOString(),
        ingredients: [
          {
            name: "Spinach / Palak",
            quantity: 150,
            unit: "g",
            estimated_cost: 9,
            calories: 35,
            protein_g: 4,
            carbs_g: 5,
            fat_g: 0.6,
          },
          {
            name: "Cottage Cheese / Paneer",
            quantity: 80,
            unit: "g",
            estimated_cost: 28,
            calories: 212,
            protein_g: 15,
            carbs_g: 1,
            fat_g: 16,
          },
          {
            name: "Whole Wheat Roti",
            quantity: 2,
            unit: "piece",
            estimated_cost: 10,
            calories: 200,
            protein_g: 6,
            carbs_g: 38,
            fat_g: 2,
          },
        ],
        steps: [
          {
            step_number: 1,
            instruction: "Blanch spinach in hot water for 2 minutes, then blend into smooth puree.",
          },
          {
            step_number: 2,
            instruction: "Saute cumin, ginger, garlic, onion, and spices in 1 tsp ghee.",
          },
          {
            step_number: 3,
            instruction: "Add spinach puree and paneer cubes. Simmer for 5 minutes.",
          },
          { step_number: 4, instruction: "Serve hot with 2 whole wheat rotis." },
        ],
        tags: ["High Calcium", "Balanced", "Comfort Food"],
        goals: ["Maintenance", "Vegetarian", "High Protein"],
      },
    ];

    for (const rec of curatedList) {
      await saveRecipeToSQLite(rec);
    }
  } catch (e) {
    console.error("[RecipeDB] Error seeding initial recipes:", e);
  }
}

/**
 * Save a complete recipe into SQLite
 */
export async function saveRecipeToSQLite(recipe: Recipe): Promise<void> {
  const db = await ensureRecipeDatabase();
  if (!db) return;

  try {
    db.run(
      `INSERT OR REPLACE INTO recipes (
        id, name, meal_type, diet_type, goal, cost_amount, currency, prep_minutes,
        calories, protein_g, carbs_g, fat_g, fiber_g, sugar_g, sodium_mg,
        iron_mg, calcium_mg, magnesium_mg, potassium_mg, vit_a_ug, vit_b12_ug, vit_d_ug, omega3_g,
        cuisine, difficulty, created_by, source, image_url, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        recipe.id,
        recipe.name,
        recipe.meal_type,
        recipe.diet_type,
        recipe.goal,
        recipe.cost_amount,
        recipe.currency || "₹",
        recipe.prep_minutes,
        recipe.calories,
        recipe.protein_g,
        recipe.carbs_g,
        recipe.fat_g,
        recipe.fiber_g || 0,
        recipe.sugar_g || 0,
        recipe.sodium_mg || 0,
        recipe.iron_mg || 0,
        recipe.calcium_mg || 0,
        recipe.magnesium_mg || 0,
        recipe.potassium_mg || 0,
        recipe.vit_a_ug || 0,
        recipe.vit_b12_ug || 0,
        recipe.vit_d_ug || 0,
        recipe.omega3_g || 0,
        recipe.cuisine || "Indian",
        recipe.difficulty || "Easy",
        recipe.created_by || "system",
        recipe.source || "local_db",
        recipe.image_url || null,
        recipe.created_at || new Date().toISOString(),
      ],
    );

    // Clear old sub-records if replacing
    db.run(`DELETE FROM recipe_ingredients WHERE recipe_id = ?`, [recipe.id]);
    db.run(`DELETE FROM recipe_steps WHERE recipe_id = ?`, [recipe.id]);
    db.run(`DELETE FROM recipe_tags WHERE recipe_id = ?`, [recipe.id]);
    db.run(`DELETE FROM recipe_goals WHERE recipe_id = ?`, [recipe.id]);

    // Insert ingredients
    for (const ing of recipe.ingredients || []) {
      const ingId = `ing-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      db.run(
        `INSERT INTO recipe_ingredients (id, recipe_id, name, normalized_name, quantity, unit, estimated_cost, calories, protein_g, carbs_g, fat_g, fiber_g, sugar_g)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          ingId,
          recipe.id,
          ing.name,
          ing.normalized_name || ing.name.toLowerCase(),
          ing.quantity,
          ing.unit,
          ing.estimated_cost,
          ing.calories,
          ing.protein_g,
          ing.carbs_g,
          ing.fat_g,
          ing.fiber_g || 0,
          ing.sugar_g || 0,
        ],
      );
    }

    // Insert steps
    for (const step of recipe.steps || []) {
      const stepId = `step-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      db.run(
        `INSERT INTO recipe_steps (id, recipe_id, step_number, instruction) VALUES (?, ?, ?, ?)`,
        [stepId, recipe.id, step.step_number, step.instruction],
      );
    }

    // Insert tags
    for (const tag of recipe.tags || []) {
      const tagId = `tag-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      db.run(`INSERT INTO recipe_tags (id, recipe_id, tag) VALUES (?, ?, ?)`, [
        tagId,
        recipe.id,
        tag,
      ]);
    }

    // Insert goals
    for (const g of recipe.goals || [recipe.goal]) {
      const gId = `goal-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      db.run(`INSERT INTO recipe_goals (id, recipe_id, goal) VALUES (?, ?, ?)`, [
        gId,
        recipe.id,
        g,
      ]);
    }

    persistDatabase(db);
  } catch (err) {
    console.error("[RecipeDB] Error saving recipe:", err);
  }
}

export interface CandidateFilterOptions {
  mealType?: string;
  dietType?: string;
  goal?: string;
  maxCost?: number;
  maxPrepMinutes?: number;
  cuisine?: string;
  limit?: number;
}

/**
 * Filter recipes using SQL indexes and parameters, returning only 20-50 candidate recipes
 */
export async function getFilteredCandidatesFromSQLite(
  filters: CandidateFilterOptions = {},
  userId = "local_user",
): Promise<Recipe[]> {
  const db = await ensureRecipeDatabase();
  if (!db) return [];

  const limit = filters.limit || 40;

  try {
    let query = `SELECT id, name, meal_type, diet_type, goal, cost_amount, currency, prep_minutes, calories, protein_g, carbs_g, fat_g, fiber_g, sugar_g, sodium_mg, iron_mg, calcium_mg, magnesium_mg, potassium_mg, vit_a_ug, vit_b12_ug, vit_d_ug, omega3_g, cuisine, difficulty, created_by, source, image_url, created_at FROM recipes WHERE 1=1`;
    const params: (string | number)[] = [];

    if (filters.mealType) {
      query += ` AND (meal_type = ? OR meal_type = 'All')`;
      params.push(filters.mealType);
    }

    if (filters.dietType && filters.dietType !== "both") {
      if (filters.dietType === "veg") {
        query += ` AND diet_type IN ('veg', 'vegan')`;
      } else if (filters.dietType === "vegan") {
        query += ` AND diet_type = 'vegan'`;
      } else if (filters.dietType === "eggetarian") {
        query += ` AND diet_type IN ('veg', 'vegan', 'eggetarian')`;
      } else if (filters.dietType === "non_veg") {
        query += ` AND diet_type IN ('non_veg', 'eggetarian', 'both')`;
      }
    }

    if (filters.maxCost && filters.maxCost > 0) {
      query += ` AND cost_amount <= ?`;
      params.push(Math.round(filters.maxCost * 1.5));
    }

    if (filters.maxPrepMinutes && filters.maxPrepMinutes > 0) {
      query += ` AND prep_minutes <= ?`;
      params.push(Math.round(filters.maxPrepMinutes * 1.5));
    }

    if (filters.cuisine && filters.cuisine !== "All") {
      query += ` AND (LOWER(cuisine) = LOWER(?) OR LOWER(cuisine) = 'indian')`;
      params.push(filters.cuisine);
    }

    query += ` ORDER BY created_at DESC LIMIT ?`;
    params.push(limit);

    const stmt = db.prepare(query);
    stmt.bind(params);
    const candidateRows: Record<string, unknown>[] = [];

    while (stmt.step()) {
      candidateRows.push(stmt.getAsObject() as Record<string, unknown>);
    }
    stmt.free();

    // Fallback if strict filter returned fewer than 5 candidates
    if (candidateRows.length < 5) {
      let fallbackQuery = `SELECT id, name, meal_type, diet_type, goal, cost_amount, currency, prep_minutes, calories, protein_g, carbs_g, fat_g, fiber_g, sugar_g, sodium_mg, iron_mg, calcium_mg, magnesium_mg, potassium_mg, vit_a_ug, vit_b12_ug, vit_d_ug, omega3_g, cuisine, difficulty, created_by, source, image_url, created_at FROM recipes WHERE 1=1`;
      const fallbackParams: (string | number)[] = [];
      if (filters.mealType) {
        fallbackQuery += ` AND (meal_type = ? OR meal_type = 'All')`;
        fallbackParams.push(filters.mealType);
      }
      fallbackQuery += ` ORDER BY created_at DESC LIMIT ?`;
      fallbackParams.push(limit);

      const fbStmt = db.prepare(fallbackQuery);
      fbStmt.bind(fallbackParams);
      const existingIds = new Set(candidateRows.map((r) => String(r.id)));
      while (fbStmt.step()) {
        const row = fbStmt.getAsObject() as Record<string, unknown>;
        if (!existingIds.has(String(row.id))) {
          candidateRows.push(row);
          existingIds.add(String(row.id));
        }
      }
      fbStmt.free();
    }

    // Final fallback: if still fewer than 5 candidates, fetch top recipes regardless of filters
    if (candidateRows.length < 5) {
      const allStmt = db.prepare(
        `SELECT id, name, meal_type, diet_type, goal, cost_amount, currency, prep_minutes, calories, protein_g, carbs_g, fat_g, fiber_g, sugar_g, sodium_mg, iron_mg, calcium_mg, magnesium_mg, potassium_mg, vit_a_ug, vit_b12_ug, vit_d_ug, omega3_g, cuisine, difficulty, created_by, source, image_url, created_at FROM recipes ORDER BY created_at DESC LIMIT ?`,
      );
      allStmt.bind([limit]);
      const existingIds = new Set(candidateRows.map((r) => String(r.id)));
      while (allStmt.step()) {
        const row = allStmt.getAsObject() as Record<string, unknown>;
        if (!existingIds.has(String(row.id))) {
          candidateRows.push(row);
          existingIds.add(String(row.id));
        }
      }
      allStmt.free();
    }

    // Hydrate all candidate recipes in 5 bulk queries instead of N*5 sequential prepare queries
    return hydrateRecipesInBulk(db, candidateRows, userId);
  } catch (err) {
    console.error("[RecipeDB] Error fetching candidates:", err);
    return [];
  }
}

/**
 * Hydrates recipe objects in bulk using vectorized SQL IN (...) queries.
 * Eliminates N*5 prepared statement overhead (200 queries -> 5 queries).
 */
export function hydrateRecipesInBulk(
  db: Database,
  candidateRows: Record<string, unknown>[],
  userId = "local_user",
): Recipe[] {
  if (!candidateRows.length) return [];

  const recipeIds = candidateRows.map((r) => String(r.id));
  const placeholders = recipeIds.map(() => "?").join(",");

  // 1. Bulk fetch ingredients
  const ingredientsMap = new Map<string, RecipeIngredient[]>();
  try {
    const ingStmt = db.prepare(
      `SELECT id, recipe_id, name, normalized_name, quantity, unit, estimated_cost, calories, protein_g, carbs_g, fat_g, fiber_g, sugar_g FROM recipe_ingredients WHERE recipe_id IN (${placeholders})`,
    );
    ingStmt.bind(recipeIds);
    while (ingStmt.step()) {
      const iRow = ingStmt.getAsObject() as Record<string, unknown>;
      const rId = String(iRow.recipe_id);
      if (!ingredientsMap.has(rId)) ingredientsMap.set(rId, []);
      ingredientsMap.get(rId)!.push({
        id: String(iRow.id),
        recipe_id: rId,
        name: String(iRow.name),
        normalized_name: String(iRow.normalized_name || ""),
        quantity: Number(iRow.quantity || 0),
        unit: String(iRow.unit || "g"),
        estimated_cost: Number(iRow.estimated_cost || 0),
        calories: Number(iRow.calories || 0),
        protein_g: Number(iRow.protein_g || 0),
        carbs_g: Number(iRow.carbs_g || 0),
        fat_g: Number(iRow.fat_g || 0),
        fiber_g: Number(iRow.fiber_g || 0),
        sugar_g: Number(iRow.sugar_g || 0),
      });
    }
    ingStmt.free();
  } catch (e) {
    console.error("[RecipeDB] Bulk ingredients query error:", e);
  }

  // 2. Bulk fetch steps
  const stepsMap = new Map<string, RecipeStep[]>();
  try {
    const stepStmt = db.prepare(
      `SELECT id, recipe_id, step_number, instruction FROM recipe_steps WHERE recipe_id IN (${placeholders}) ORDER BY step_number ASC`,
    );
    stepStmt.bind(recipeIds);
    while (stepStmt.step()) {
      const sRow = stepStmt.getAsObject() as Record<string, unknown>;
      const rId = String(sRow.recipe_id);
      if (!stepsMap.has(rId)) stepsMap.set(rId, []);
      stepsMap.get(rId)!.push({
        id: String(sRow.id),
        recipe_id: rId,
        step_number: Number(sRow.step_number || 1),
        instruction: String(sRow.instruction || ""),
      });
    }
    stepStmt.free();
  } catch (e) {
    console.error("[RecipeDB] Bulk steps query error:", e);
  }

  // 3. Bulk fetch tags
  const tagsMap = new Map<string, string[]>();
  try {
    const tagStmt = db.prepare(
      `SELECT recipe_id, tag FROM recipe_tags WHERE recipe_id IN (${placeholders})`,
    );
    tagStmt.bind(recipeIds);
    while (tagStmt.step()) {
      const tRow = tagStmt.getAsObject() as { recipe_id: string; tag: string };
      const rId = String(tRow.recipe_id);
      if (!tagsMap.has(rId)) tagsMap.set(rId, []);
      tagsMap.get(rId)!.push(String(tRow.tag));
    }
    tagStmt.free();
  } catch (e) {
    console.error("[RecipeDB] Bulk tags query error:", e);
  }

  // 4. Bulk fetch goals
  const goalsMap = new Map<string, string[]>();
  try {
    const goalStmt = db.prepare(
      `SELECT recipe_id, goal FROM recipe_goals WHERE recipe_id IN (${placeholders})`,
    );
    goalStmt.bind(recipeIds);
    while (goalStmt.step()) {
      const gRow = goalStmt.getAsObject() as { recipe_id: string; goal: string };
      const rId = String(gRow.recipe_id);
      if (!goalsMap.has(rId)) goalsMap.set(rId, []);
      goalsMap.get(rId)!.push(String(gRow.goal));
    }
    goalStmt.free();
  } catch (e) {
    console.error("[RecipeDB] Bulk goals query error:", e);
  }

  // 5. Bulk fetch favorites
  const favSet = new Set<string>();
  try {
    const favStmt = db.prepare(
      `SELECT recipe_id FROM favorite_recipes WHERE user_id = ? AND recipe_id IN (${placeholders})`,
    );
    favStmt.bind([userId, ...recipeIds]);
    while (favStmt.step()) {
      const fRow = favStmt.getAsObject() as { recipe_id: string };
      favSet.add(String(fRow.recipe_id));
    }
    favStmt.free();
  } catch (e) {
    console.error("[RecipeDB] Bulk favorites query error:", e);
  }

  return candidateRows.map((row) => {
    const recipeId = String(row.id);
    return {
      id: recipeId,
      name: String(row.name),
      meal_type: String(row.meal_type) as Recipe["meal_type"],
      diet_type: String(row.diet_type) as Recipe["diet_type"],
      goal: String(row.goal),
      cost_amount: Number(row.cost_amount || 0),
      currency: String(row.currency || "₹"),
      prep_minutes: Number(row.prep_minutes || 15),
      calories: Number(row.calories || 0),
      protein_g: Number(row.protein_g || 0),
      carbs_g: Number(row.carbs_g || 0),
      fat_g: Number(row.fat_g || 0),
      fiber_g: Number(row.fiber_g || 0),
      sugar_g: Number(row.sugar_g || 0),
      sodium_mg: Number(row.sodium_mg || 0),
      iron_mg: Number(row.iron_mg || 0),
      calcium_mg: Number(row.calcium_mg || 0),
      magnesium_mg: Number(row.magnesium_mg || 0),
      potassium_mg: Number(row.potassium_mg || 0),
      vit_a_ug: Number(row.vit_a_ug || 0),
      vit_b12_ug: Number(row.vit_b12_ug || 0),
      vit_d_ug: Number(row.vit_d_ug || 0),
      omega3_g: Number(row.omega3_g || 0),
      cuisine: String(row.cuisine || "Indian"),
      difficulty: String(row.difficulty || "Easy") as Recipe["difficulty"],
      created_by: String(row.created_by || "system") as Recipe["created_by"],
      source: String(row.source || "local_db"),
      image_url: row.image_url ? String(row.image_url) : undefined,
      is_favorite: favSet.has(recipeId),
      created_at: String(row.created_at || new Date().toISOString()),
      ingredients: ingredientsMap.get(recipeId) || [],
      steps: stepsMap.get(recipeId) || [],
      tags: tagsMap.get(recipeId) || [],
      goals: goalsMap.get(recipeId) || [],
    };
  });
}

/**
 * Fetch all recipes from SQLite with ingredients, steps, tags, and favorite status
 */
export async function getAllRecipesFromSQLite(userId = "local_user"): Promise<Recipe[]> {
  const db = await ensureRecipeDatabase();
  if (!db) return [];

  try {
    const stmt = db.prepare(`SELECT * FROM recipes ORDER BY created_at DESC`);
    const candidateRows: Record<string, unknown>[] = [];

    while (stmt.step()) {
      candidateRows.push(stmt.getAsObject() as Record<string, unknown>);
    }
    stmt.free();

    return hydrateRecipesInBulk(db, candidateRows, userId);
  } catch (err) {
    console.error("[RecipeDB] Error fetching recipes:", err);
    return [];
  }
}

/**
 * Toggle Favorite status for a recipe in SQLite
 */
export async function toggleFavoriteRecipeInSQLite(
  recipeId: string,
  userId = "local_user",
): Promise<boolean> {
  const db = await ensureRecipeDatabase();
  if (!db) return false;

  try {
    const check = db.prepare(`SELECT id FROM favorite_recipes WHERE recipe_id = ? AND user_id = ?`);
    check.bind([recipeId, userId]);
    const exists = check.step();
    check.free();

    if (exists) {
      db.run(`DELETE FROM favorite_recipes WHERE recipe_id = ? AND user_id = ?`, [
        recipeId,
        userId,
      ]);
      persistDatabase(db);
      return false;
    } else {
      const favId = `fav-${Date.now()}`;
      db.run(
        `INSERT INTO favorite_recipes (id, recipe_id, user_id, added_at) VALUES (?, ?, ?, ?)`,
        [favId, recipeId, userId, new Date().toISOString()],
      );
      persistDatabase(db);
      return true;
    }
  } catch (err) {
    console.error("[RecipeDB] Error toggling favorite:", err);
    return false;
  }
}

/**
 * Fetch all USDA ingredients for offline nutrition lookup
 */
export async function getAllUSDAIngredientsFromSQLite(): Promise<USDAIngredient[]> {
  try {
    const db = await ensureRecipeDatabase();
    if (db) {
      const stmt = db.prepare(`SELECT * FROM usda_ingredients`);
      const list: USDAIngredient[] = [];
      while (stmt.step()) {
        const row = stmt.getAsObject() as Record<string, unknown>;
        list.push({
          id: String(row.id),
          name: String(row.name),
          aliases: row.aliases ? JSON.parse(String(row.aliases)) : [],
          default_unit: String(row.default_unit || "g"),
          unit_grams: Number(row.unit_grams || 1),
          calories_per_100g: Number(row.calories_per_100g || 0),
          protein_per_100g: Number(row.protein_per_100g || 0),
          carbs_per_100g: Number(row.carbs_per_100g || 0),
          fat_per_100g: Number(row.fat_per_100g || 0),
          fiber_per_100g: Number(row.fiber_per_100g || 0),
          sugar_per_100g: Number(row.sugar_per_100g || 0),
          sodium_per_100g: Number(row.sodium_per_100g || 0),
          iron_per_100g: Number(row.iron_per_100g || 0),
          calcium_per_100g: Number(row.calcium_per_100g || 0),
          magnesium_per_100g: Number(row.magnesium_per_100g || 0),
          potassium_per_100g: Number(row.potassium_per_100g || 0),
          vit_a_per_100g: Number(row.vit_a_per_100g || 0),
          vit_b12_per_100g: Number(row.vit_b12_per_100g || 0),
          vit_d_per_100g: Number(row.vit_d_per_100g || 0),
          omega3_per_100g: Number(row.omega3_per_100g || 0),
          avg_cost_per_100g: Number(row.avg_cost_per_100g || 10),
        });
      }
      stmt.free();
      if (list.length > 0) return list;
    }
  } catch (err) {
    console.error("[RecipeDB] Error fetching USDA ingredients:", err);
  }
  return USDA_SEEDS;
}

// Trigger initial DB boot on module load asynchronously
if (typeof window !== "undefined") {
  ensureRecipeDatabase().catch(() => {});
}
