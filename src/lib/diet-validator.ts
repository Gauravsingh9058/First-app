export type CanonicalDiet = "VEGETARIAN" | "NON_VEGETARIAN" | "MIXED";

export function normalizeDietType(dietStr?: unknown): CanonicalDiet {
  const s =
    typeof dietStr === "string"
      ? dietStr.toLowerCase().trim()
      : String(dietStr ?? "")
          .toLowerCase()
          .trim();
  if (s.includes("mixed") || s.includes("both")) {
    return "MIXED";
  }
  if (
    s.includes("non") ||
    s.includes("meat") ||
    s.includes("chicken") ||
    s.includes("fish") ||
    s.includes("eggetarian")
  ) {
    return "NON_VEGETARIAN";
  }
  return "VEGETARIAN";
}

const NON_VEG_KEYWORDS = [
  "chicken",
  "fish",
  "mutton",
  "lamb",
  "beef",
  "pork",
  "turkey",
  "seafood",
  "prawn",
  "prawns",
  "shrimp",
  "shrimps",
  "crab",
  "meat",
  "flesh",
  "salmon",
  "tuna",
  "cod",
  "bacon",
  "ham",
  "sausage",
  "duck",
  "anchovy",
  "squid",
  "lobster",
  "clam",
  "oyster",
  "octopus",
  "gelatin",
  "egg",
  "eggs",
  "egg white",
  "egg whites",
  "egg yolk",
  "egg yolks",
  "omelet",
  "omelette",
];

const NON_VEG_PROTEIN_KEYWORDS = [
  "chicken",
  "fish",
  "mutton",
  "lamb",
  "beef",
  "pork",
  "turkey",
  "seafood",
  "prawn",
  "prawns",
  "shrimp",
  "shrimps",
  "crab",
  "meat",
  "salmon",
  "tuna",
  "cod",
  "egg",
  "eggs",
  "egg white",
  "egg whites",
];

export interface MealDietValidationResult {
  valid: boolean;
  violations: string[];
  detectedDietType: "VEGETARIAN" | "NON_VEGETARIAN";
  containsNonVegProtein: boolean;
}

export function validateMealDiet(
  meal: { mealName?: string; mealType?: string; ingredients: Array<{ name: string } | string> },
  targetDiet: CanonicalDiet | string,
  options?: { isMainMeal?: boolean },
): MealDietValidationResult {
  const canonicalTarget = normalizeDietType(targetDiet);
  const violations: string[] = [];
  let nonVegCount = 0;
  let containsNonVegProtein = false;

  const rawIngredientsList = meal.ingredients.map((ing) =>
    typeof ing === "string" ? ing : ing.name || "",
  );

  // Check ingredients
  for (const rawIng of rawIngredientsList) {
    const ingLower = rawIng.toLowerCase();

    // Skip false positives e.g. eggplant
    if (/\beggplant\b/i.test(ingLower) || /\begg plants?\b/i.test(ingLower)) {
      continue;
    }

    for (const kw of NON_VEG_KEYWORDS) {
      const regex = new RegExp(`\\b${kw}\\b`, "i");
      if (regex.test(ingLower)) {
        nonVegCount++;
        violations.push(`Ingredient "${rawIng}" contains non-vegetarian item (${kw})`);
        break;
      }
    }

    for (const pk of NON_VEG_PROTEIN_KEYWORDS) {
      const regex = new RegExp(`\\b${pk}\\b`, "i");
      if (regex.test(ingLower)) {
        containsNonVegProtein = true;
        break;
      }
    }
  }

  // Also check meal name as secondary safety check
  const nameLower = (meal.mealName || "").toLowerCase();
  for (const kw of NON_VEG_KEYWORDS) {
    if (/\beggplant\b/i.test(nameLower)) continue;
    const regex = new RegExp(`\\b${kw}\\b`, "i");
    if (regex.test(nameLower)) {
      if (nonVegCount === 0) {
        nonVegCount++;
        violations.push(`Meal name "${meal.mealName}" mentions non-vegetarian item (${kw})`);
      }
      containsNonVegProtein = true;
      break;
    }
  }

  const detectedDietType: "VEGETARIAN" | "NON_VEGETARIAN" =
    nonVegCount > 0 ? "NON_VEGETARIAN" : "VEGETARIAN";

  if (canonicalTarget === "VEGETARIAN") {
    if (nonVegCount > 0) {
      return {
        valid: false,
        violations,
        detectedDietType,
        containsNonVegProtein,
      };
    }
    return {
      valid: true,
      violations: [],
      detectedDietType: "VEGETARIAN",
      containsNonVegProtein: false,
    };
  }

  if (canonicalTarget === "NON_VEGETARIAN") {
    if (options?.isMainMeal && !containsNonVegProtein) {
      return {
        valid: false,
        violations: [
          "Main meal in Non-Vegetarian plan must contain a non-vegetarian protein source",
        ],
        detectedDietType,
        containsNonVegProtein,
      };
    }
    return {
      valid: true,
      violations: [],
      detectedDietType,
      containsNonVegProtein,
    };
  }

  // MIXED mode
  return {
    valid: true,
    violations: [],
    detectedDietType,
    containsNonVegProtein,
  };
}

export function validateFullDayPlanDiet(
  meals: Array<{
    mealName?: string;
    mealType?: string;
    ingredients: Array<{ name: string } | string>;
  }>,
  targetDiet: CanonicalDiet | string,
): { valid: boolean; violations: string[]; vegMealCount: number; nonVegMealCount: number } {
  const canonicalTarget = normalizeDietType(targetDiet);
  const violations: string[] = [];
  let vegMealCount = 0;
  let nonVegMealCount = 0;

  for (const meal of meals) {
    const slotLower = (meal.mealType || "").toLowerCase();
    const isMainMeal =
      slotLower.includes("breakfast") ||
      slotLower.includes("lunch") ||
      slotLower.includes("dinner");

    const res = validateMealDiet(meal, canonicalTarget, { isMainMeal });
    if (!res.valid) {
      violations.push(...res.violations);
    }

    if (res.detectedDietType === "VEGETARIAN") {
      vegMealCount++;
    } else {
      nonVegMealCount++;
    }
  }

  if (canonicalTarget === "VEGETARIAN") {
    if (nonVegMealCount > 0) {
      return { valid: false, violations, vegMealCount, nonVegMealCount };
    }
    return { valid: true, violations: [], vegMealCount, nonVegMealCount };
  }

  if (canonicalTarget === "NON_VEGETARIAN") {
    if (violations.length > 0) {
      return { valid: false, violations, vegMealCount, nonVegMealCount };
    }
    return { valid: true, violations: [], vegMealCount, nonVegMealCount };
  }

  if (canonicalTarget === "MIXED") {
    if (vegMealCount < 1 || nonVegMealCount < 1) {
      return {
        valid: false,
        violations: [
          `MIXED mode requires at least 1 vegetarian meal and 1 non-vegetarian meal (got ${vegMealCount} veg, ${nonVegMealCount} non-veg)`,
        ],
        vegMealCount,
        nonVegMealCount,
      };
    }
    return { valid: violations.length === 0, violations, vegMealCount, nonVegMealCount };
  }

  return { valid: violations.length === 0, violations, vegMealCount, nonVegMealCount };
}
