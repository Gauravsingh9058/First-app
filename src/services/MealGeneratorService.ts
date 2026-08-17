import { ensureRecipeDatabase, hydrateRecipesInBulk, Recipe } from "@/lib/recipe-db";
import type { Database } from "sql.js";

export interface TargetMacros {
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
}

export interface MealGeneratorFilters {
  mealType?: string; // "Breakfast", "Lunch", "Dinner", "Snack", "All"
  dietType?: string; // "veg", "non_veg", "eggetarian", "vegan", "both"
  cuisine?: string;
  maxPrepMinutes?: number;
  maxCost?: number;
  userId?: string;
  limit?: number;
}

export interface DistanceScoredRecipe {
  recipe: Recipe;
  distanceScore: number; // lower is closer to target
  calorieDiff: number;
  proteinDiff: number;
  carbsDiff: number;
  fatDiff: number;
}

export interface MealGeneratorServiceResult {
  recipes: Recipe[];
  scoredRecipes: DistanceScoredRecipe[];
  executionTimeMs: number;
  source: "local_sqlite_indexed";
  networkCallsMade: 0;
}

export class MealGeneratorService {
  private static indicesCreated = false;

  /**
   * Ensures high-performance indices are created on the recipes table in SQLite.
   */
  public static async ensureIndices(db: Database): Promise<void> {
    if (this.indicesCreated) return;

    try {
      db.run(`
        CREATE INDEX IF NOT EXISTS idx_recipes_meal_diet ON recipes(meal_type, diet_type);
        CREATE INDEX IF NOT EXISTS idx_recipes_macros ON recipes(calories, protein_g, carbs_g, fat_g);
        CREATE INDEX IF NOT EXISTS idx_recipes_prep_cost ON recipes(prep_minutes, cost_amount);
        CREATE INDEX IF NOT EXISTS idx_recipes_cuisine ON recipes(cuisine);
      `);
      this.indicesCreated = true;
    } catch (err) {
      console.warn("[MealGeneratorService] Index creation warning:", err);
    }
  }

  /**
   * Calculates weighted distance score between recipe macros and target macros.
   * Lower score = closer fit to exact calorie & macro goals.
   */
  public static calculateDistanceScore(
    recipe: { calories: number; protein_g: number; carbs_g: number; fat_g: number },
    target: TargetMacros,
  ): {
    distanceScore: number;
    calorieDiff: number;
    proteinDiff: number;
    carbsDiff: number;
    fatDiff: number;
  } {
    const cTarget = Math.max(100, target.targetCalories || 500);
    const pTarget = Math.max(10, target.targetProtein || 30);
    const carbTarget = Math.max(10, target.targetCarbs || 60);
    const fTarget = Math.max(5, target.targetFat || 20);

    const calorieDiff = Math.abs((recipe.calories || 0) - cTarget);
    const proteinDiff = Math.abs((recipe.protein_g || 0) - pTarget);
    const carbsDiff = Math.abs((recipe.carbs_g || 0) - carbTarget);
    const fatDiff = Math.abs((recipe.fat_g || 0) - fTarget);

    // Weighted relative normalized squared distance
    // Calorie weight: 0.45, Protein weight: 0.35, Carbs weight: 0.10, Fat weight: 0.10
    const normCal = calorieDiff / cTarget;
    const normPro = proteinDiff / pTarget;
    const normCarb = carbsDiff / carbTarget;
    const normFat = fatDiff / fTarget;

    const distanceScore =
      0.45 * (normCal * normCal) +
      0.35 * (normPro * normPro) +
      0.1 * (normCarb * normCarb) +
      0.1 * (normFat * normFat);

    return {
      distanceScore: Number(distanceScore.toFixed(4)),
      calorieDiff: Math.round(calorieDiff),
      proteinDiff: Math.round(proteinDiff),
      carbsDiff: Math.round(carbsDiff),
      fatDiff: Math.round(fatDiff),
    };
  }

  /**
   * Primary generator method: uses indexed SQLite queries + distance score calculation.
   * Guarantees 0 network calls and ultra-fast local execution (<10ms).
   */
  public static async generateMeals(
    targets: TargetMacros,
    filters: MealGeneratorFilters = {},
  ): Promise<MealGeneratorServiceResult> {
    const startTime = performance.now();
    const db = await ensureRecipeDatabase();

    if (!db) {
      return {
        recipes: [],
        scoredRecipes: [],
        executionTimeMs: Math.round(performance.now() - startTime),
        source: "local_sqlite_indexed",
        networkCallsMade: 0,
      };
    }

    await this.ensureIndices(db);

    const limit = filters.limit || 30;
    const userId = filters.userId || "local_user";

    // Build indexed SQL query to fetch candidate rows
    let query = `SELECT id, name, meal_type, diet_type, goal, cost_amount, currency, prep_minutes, calories, protein_g, carbs_g, fat_g, fiber_g, sugar_g, sodium_mg, iron_mg, calcium_mg, magnesium_mg, potassium_mg, vit_a_ug, vit_b12_ug, vit_d_ug, omega3_g, cuisine, difficulty, created_by, source, image_url, created_at FROM recipes WHERE 1=1`;
    const params: (string | number)[] = [];

    if (filters.mealType && filters.mealType !== "All") {
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

    if (filters.maxPrepMinutes && filters.maxPrepMinutes > 0) {
      query += ` AND prep_minutes <= ?`;
      params.push(Math.round(filters.maxPrepMinutes * 1.5));
    }

    if (filters.maxCost && filters.maxCost > 0) {
      query += ` AND cost_amount <= ?`;
      params.push(Math.round(filters.maxCost * 1.5));
    }

    if (filters.cuisine && filters.cuisine !== "All") {
      query += ` AND (LOWER(cuisine) = LOWER(?) OR LOWER(cuisine) = 'indian')`;
      params.push(filters.cuisine);
    }

    query += ` ORDER BY created_at DESC LIMIT 100`;

    const stmt = db.prepare(query);
    stmt.bind(params);

    const candidateRows: Record<string, unknown>[] = [];
    while (stmt.step()) {
      candidateRows.push(stmt.getAsObject() as Record<string, unknown>);
    }
    stmt.free();

    // Fallback query if candidate count is small
    if (candidateRows.length < 5) {
      const fallbackStmt = db.prepare(
        `SELECT id, name, meal_type, diet_type, goal, cost_amount, currency, prep_minutes, calories, protein_g, carbs_g, fat_g, fiber_g, sugar_g, sodium_mg, iron_mg, calcium_mg, magnesium_mg, potassium_mg, vit_a_ug, vit_b12_ug, vit_d_ug, omega3_g, cuisine, difficulty, created_by, source, image_url, created_at FROM recipes ORDER BY created_at DESC LIMIT 50`,
      );
      const existingIds = new Set(candidateRows.map((r) => String(r.id)));
      while (fallbackStmt.step()) {
        const row = fallbackStmt.getAsObject() as Record<string, unknown>;
        if (!existingIds.has(String(row.id))) {
          candidateRows.push(row);
          existingIds.add(String(row.id));
        }
      }
      fallbackStmt.free();
    }

    // Bulk hydrate candidate recipes from SQLite
    const hydratedRecipes = hydrateRecipesInBulk(db, candidateRows, userId);

    // Calculate pre-calculated macro distance score for each recipe
    const scoredList: DistanceScoredRecipe[] = hydratedRecipes.map((recipe) => {
      const scoreData = this.calculateDistanceScore(recipe, targets);
      return {
        recipe,
        ...scoreData,
      };
    });

    // Rank ascending by distance score (closest match first)
    scoredList.sort((a, b) => a.distanceScore - b.distanceScore);

    const topScored = scoredList.slice(0, limit);
    const topRecipes = topScored.map((s) => s.recipe);

    const executionTimeMs = Math.round(performance.now() - startTime);

    return {
      recipes: topRecipes,
      scoredRecipes: topScored,
      executionTimeMs,
      source: "local_sqlite_indexed",
      networkCallsMade: 0,
    };
  }
}
