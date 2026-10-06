import { Recipe } from "./recipe-db";
import { LocalProfile } from "./sqlite-db";

export interface UserMealContext {
  profile: LocalProfile | null;
  mealType: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  remainingCalories: number;
  remainingProtein: number;
  remainingCarbs?: number;
  remainingFat?: number;
  maxBudgetCost?: number;
  maxPrepMinutes?: number;
  preferredDiet?: "veg" | "non_veg" | "eggetarian" | "vegan" | "both";
  selectedGoal?: string;
  allergies?: string[];
  dislikedFoods?: string[];
  likedFoods?: string[];
}

export interface ScoredRecipe {
  recipe: Recipe;
  score: number; // 0 to 100+
  matchPercentage: number;
  scoreBreakdown: {
    calorieFit: number;
    proteinFit: number;
    goalFit: number;
    budgetFit: number;
    preferenceFit: number;
    ratingBonus: number;
    penalties: number;
    highlights: string[];
  };
}

/**
 * Score and rank a list of recipes according to user profile, targets, and constraints.
 */
export function rankRecipesForUser(recipes: Recipe[], context: UserMealContext): ScoredRecipe[] {
  const {
    profile,
    mealType,
    remainingCalories,
    remainingProtein,
    maxBudgetCost = 100,
    maxPrepMinutes = 30,
    preferredDiet = "both",
    selectedGoal = profile?.goal || "Maintenance",
    allergies = (Array.isArray((profile?.extended_data as Record<string, unknown>)?.allergies)
      ? ((profile?.extended_data as Record<string, unknown>).allergies as string[])
      : context.allergies || []) as string[],
    dislikedFoods = (Array.isArray(
      (profile?.extended_data as Record<string, unknown>)?.disliked_foods,
    )
      ? ((profile?.extended_data as Record<string, unknown>).disliked_foods as string[])
      : context.dislikedFoods || []) as string[],
    likedFoods = (Array.isArray((profile?.extended_data as Record<string, unknown>)?.liked_foods)
      ? ((profile?.extended_data as Record<string, unknown>).liked_foods as string[])
      : context.likedFoods || []) as string[],
  } = context;

  const userGoal = (selectedGoal || profile?.goal || "Maintenance").toLowerCase();
  const scoredList: ScoredRecipe[] = [];

  for (const recipe of recipes) {
    let score = 50; // Base score
    const highlights: string[] = [];

    let calorieFitScore = 0;
    let proteinFitScore = 0;
    let goalFitScore = 0;
    let budgetFitScore = 0;
    let prefFitScore = 0;
    let ratingBonus = 0;
    let penaltyDeduction = 0;

    // 1. MEAL TYPE FIT
    if (recipe.meal_type === mealType) {
      score += 10;
    } else {
      penaltyDeduction += 30; // Wrong meal type penalty
    }

    // 2. DIET & ALLERGY PREFERENCE
    const rDiet = recipe.diet_type;
    const recipeText =
      `${recipe.name} ${recipe.ingredients.map((i) => i.name).join(" ")} ${recipe.tags.join(" ")}`.toLowerCase();

    if (preferredDiet === "veg") {
      if (rDiet !== "veg" && rDiet !== "vegan") {
        penaltyDeduction += 500; // Strictly exclude non-veg & eggetarian for vegetarian
      } else if (/chicken|mutton|beef|pork|fish|egg|seafood/i.test(recipeText)) {
        penaltyDeduction += 500;
      }
    } else if (preferredDiet === "vegan") {
      if (rDiet !== "vegan") {
        penaltyDeduction += 500; // Strictly exclude non-vegan for vegan
      } else if (
        /paneer|cheese|milk|curd|dahi|ghee|butter|egg|chicken|mutton|fish|honey/i.test(recipeText)
      ) {
        penaltyDeduction += 500;
      }
    } else if (preferredDiet === "eggetarian") {
      if (rDiet === "non_veg") {
        penaltyDeduction += 500; // Strictly exclude meat/chicken for eggetarian
      } else if (/chicken|mutton|beef|pork|fish|seafood/i.test(recipeText)) {
        penaltyDeduction += 500;
      }
    } else if (
      preferredDiet === "non_veg" &&
      (rDiet === "non_veg" || /chicken|mutton|fish|egg/i.test(recipeText))
    ) {
      prefFitScore += 10;
    }

    // Check strict allergies
    for (const allergy of allergies) {
      if (allergy.trim() && recipeText.includes(allergy.toLowerCase().trim())) {
        penaltyDeduction += 500; // Strictly exclude allergic recipes
        highlights.push(`Contains Allergy Warning (${allergy})`);
      }
    }

    // Check disliked foods
    for (const disliked of dislikedFoods) {
      if (disliked.trim() && recipeText.includes(disliked.toLowerCase().trim())) {
        penaltyDeduction += 500; // Strictly exclude disliked foods
      }
    }

    // Check liked foods
    for (const liked of likedFoods) {
      if (liked.trim() && recipeText.includes(liked.toLowerCase().trim())) {
        prefFitScore += 15;
        highlights.push(`Contains Preferred Ingredient (${liked})`);
      }
    }

    // 3. CALORIE FIT (Target remaining calories delta)
    const targetCal = Math.max(150, remainingCalories > 0 ? remainingCalories : 500);
    const calDiff = Math.abs(recipe.calories - targetCal);
    const calRatio = calDiff / targetCal;

    if (calRatio <= 0.15) {
      calorieFitScore = 25;
      highlights.push(`Optimal Calories (${recipe.calories} kcal)`);
    } else if (calRatio <= 0.3) {
      calorieFitScore = 15;
    } else if (recipe.calories > targetCal * 1.4) {
      penaltyDeduction += 20; // Excess calories penalty
    }

    // 4. PROTEIN FIT
    const targetPro = Math.max(15, remainingProtein > 0 ? remainingProtein : 25);
    if (recipe.protein_g >= targetPro * 0.8) {
      proteinFitScore = 20;
      highlights.push(`High Protein Boost (+${recipe.protein_g}g)`);
    } else if (recipe.protein_g >= 20) {
      proteinFitScore = 12;
    }

    // 5. GOAL ALIGNMENT
    if (userGoal.includes("weight") || userGoal.includes("fat")) {
      if (recipe.calories <= 450 && recipe.protein_g >= 20) {
        goalFitScore += 20;
        highlights.push(`Fat Loss Friendly (${recipe.calories} kcal, ${recipe.protein_g}g Pro)`);
      }
    } else if (
      userGoal.includes("muscle") ||
      userGoal.includes("bulk") ||
      userGoal.includes("high protein")
    ) {
      if (recipe.protein_g >= 30) {
        goalFitScore += 20;
        highlights.push(`Muscle Building Target (${recipe.protein_g}g Protein)`);
      }
    } else if (userGoal.includes("diabetic")) {
      if (recipe.sugar_g <= 5 && recipe.carbs_g <= 45 && recipe.fiber_g >= 6) {
        goalFitScore += 20;
        highlights.push("Low GI & Diabetic Safe");
      }
    } else if (userGoal.includes("keto")) {
      if (recipe.carbs_g <= 15 && recipe.fat_g >= 15) {
        goalFitScore += 20;
        highlights.push("Strict Keto Macro Ratio");
      }
    } else {
      goalFitScore += 10;
    }

    // 6. BUDGET FIT
    if (recipe.cost_amount <= maxBudgetCost) {
      budgetFitScore = 15;
      highlights.push(`Budget Friendly (₹${recipe.cost_amount})`);
    } else {
      const overCost = recipe.cost_amount - maxBudgetCost;
      penaltyDeduction += Math.min(30, Math.round(overCost * 0.5));
    }

    // 7. PREPARATION TIME FIT
    if (recipe.prep_minutes <= maxPrepMinutes) {
      prefFitScore += 10;
      highlights.push(`Quick Prep (${recipe.prep_minutes} mins)`);
    } else {
      penaltyDeduction += 10;
    }

    // 8. RATING & FAVORITE BONUS
    if (recipe.is_favorite) {
      ratingBonus += 15;
      highlights.push("Saved Favorite Recipe");
    }
    if (recipe.rating && recipe.rating >= 4.5) {
      ratingBonus += 10;
    }

    // Calculate total score
    score =
      score +
      calorieFitScore +
      proteinFitScore +
      goalFitScore +
      budgetFitScore +
      prefFitScore +
      ratingBonus -
      penaltyDeduction;
    score = Math.max(0, Math.min(100, Math.round(score)));

    scoredList.push({
      recipe,
      score,
      matchPercentage: Math.max(10, Math.min(99, score)),
      scoreBreakdown: {
        calorieFit: calorieFitScore,
        proteinFit: proteinFitScore,
        goalFit: goalFitScore,
        budgetFit: budgetFitScore,
        preferenceFit: prefFitScore,
        ratingBonus,
        penalties: penaltyDeduction,
        highlights: Array.from(new Set(highlights)),
      },
    });
  }

  // Filter out recipes with severe allergy penalties (>400)
  const filtered = scoredList.filter((s) => s.scoreBreakdown.penalties < 400);

  // Sort descending by score
  const sorted = filtered.sort((a, b) => b.score - a.score);
  if (sorted.length > 0) return sorted;

  // Fallback to sorting all scored items
  return scoredList.sort((a, b) => b.score - a.score);
}
