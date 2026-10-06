import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { LocalStore } from "@/lib/local-store";
import { getLocalDateString } from "@/lib/date-utils";
import {
  Utensils,
  Sparkles,
  Flame,
  Dumbbell,
  Wheat,
  Leaf,
  Clock,
  Coins,
  Check,
  RefreshCw,
  Heart,
  FileText,
  ChevronDown,
  ChevronUp,
  Plus,
  Zap,
  Info,
  CheckCircle2,
  CalendarCheck,
  AlertCircle,
  ChefHat,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import type {
  MealGenerationResponse,
  MealOutput,
  FullDayPlanOutput,
} from "@/routes/api/generate-meal";

export const Route = createFileRoute("/_authenticated/meals")({
  head: () => ({ meta: [{ title: "AI Meal Generator — NutriLens" }] }),
  component: MealsPage,
});

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack", "Full Day Plan"] as const;
type MealTypeChoice = (typeof MEAL_TYPES)[number];

const DIET_TYPES = [
  { id: "Vegetarian", label: "Vegetarian" },
  { id: "Non-Vegetarian", label: "Non-Veg" },
  { id: "Vegan", label: "Vegan" },
  { id: "Eggetarian", label: "Eggetarian" },
  { id: "Custom", label: "Custom" },
] as const;

const CUISINE_OPTIONS = [
  "Any",
  "Indian",
  "Mediterranean",
  "Asian",
  "Mexican",
  "Continental",
  "American",
];
const BUDGET_OPTIONS = ["low", "medium", "high"];
const COOKING_TIME_OPTIONS = ["15 minutes", "30 minutes", "45 minutes", "60 minutes"];

// Client-side Session Cache for Generated Meals
const mealCache = new Map<string, MealGenerationResponse>();

export function MealsPage() {
  const profile = LocalStore.getProfile();

  // Targets from profile
  const calorieTarget = profile?.daily_calorie_target || 2000;
  const proteinTarget = profile?.protein_target_g || 120;
  // Estimate carbs & fat targets if not set explicitly
  const carbsTarget = Math.round((calorieTarget * 0.5) / 4);
  const fatTarget = Math.round((calorieTarget * 0.25) / 9);

  // Form State
  const [selectedMealType, setSelectedMealType] = useState<MealTypeChoice>("Lunch");
  const [selectedDiet, setSelectedDiet] = useState<string>(() => {
    const d = (profile?.diet || "Vegetarian").toLowerCase();
    if (d.includes("non")) return "Non-Vegetarian";
    if (d.includes("vegan")) return "Vegan";
    if (d.includes("eggetarian") || d.includes("egg")) return "Eggetarian";
    return "Vegetarian";
  });
  const [cuisine, setCuisine] = useState<string>("Any");
  const [availableIngredients, setAvailableIngredients] = useState<string>("");
  const [foodsToAvoid, setFoodsToAvoid] = useState<string>(() => {
    const ext = (profile?.extended_data as Record<string, unknown>) || {};
    const dislikes = Array.isArray(ext.disliked_foods) ? ext.disliked_foods : [];
    const allergies = Array.isArray(ext.allergies) ? ext.allergies : [];
    return [...dislikes, ...allergies].join(", ");
  });
  const [budget, setBudget] = useState<string>("medium");
  const [cookingTime, setCookingTime] = useState<string>("30 minutes");
  const [showOptionalPref, setShowOptionalPref] = useState<boolean>(false);

  // Result State
  const [generating, setGenerating] = useState<boolean>(false);
  const [regeneratingKey, setRegeneratingKey] = useState<string | null>(null);
  const [recentMealNames, setRecentMealNames] = useState<string[]>([]);
  const [mealResult, setMealResult] = useState<MealGenerationResponse | null>(null);
  const [addedMealIds, setAddedMealIds] = useState<Set<string>>(new Set());
  const [savedMealIds, setSavedMealIds] = useState<Set<string>>(new Set());

  // Modal State for "View Details"
  const [selectedDetailMeal, setSelectedDetailMeal] = useState<MealOutput | null>(null);

  // Check if cache key matches
  const getCacheKey = () => {
    return [
      selectedMealType,
      selectedDiet,
      calorieTarget,
      proteinTarget,
      cuisine,
      availableIngredients.trim(),
      foodsToAvoid.trim(),
      budget,
      cookingTime,
    ].join("::");
  };

  const handleGenerate = async (forceRegenerate = false, overrideDiet?: string) => {
    if (generating || regeneratingKey) return;

    const activeDiet = overrideDiet || selectedDiet;
    const cacheKey = [
      selectedMealType,
      activeDiet,
      calorieTarget,
      proteinTarget,
      cuisine,
      availableIngredients,
      foodsToAvoid,
      budget,
      cookingTime,
    ].join("::");

    if (!forceRegenerate && mealCache.has(cacheKey)) {
      setMealResult(mealCache.get(cacheKey)!);
      toast.info("Loaded meal plan from cache!");
      return;
    }

    if (forceRegenerate) {
      mealCache.delete(cacheKey);
    }

    setGenerating(true);
    setAddedMealIds(new Set());

    const currentDisplayedNames: string[] = [];
    if (mealResult) {
      if ("meals" in mealResult && Array.isArray(mealResult.meals)) {
        mealResult.meals.forEach((m) => {
          if (m && m.mealName) currentDisplayedNames.push(m.mealName);
        });
      } else if ("mealName" in mealResult && mealResult.mealName) {
        currentDisplayedNames.push(mealResult.mealName);
      }
    }
    const excludedMeals = Array.from(new Set([...currentDisplayedNames, ...recentMealNames]));

    try {
      const res = await fetch("/api/generate-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mealType: selectedMealType,
          diet: activeDiet,
          calorieTarget,
          proteinTarget,
          carbsTarget,
          fatTarget,
          goal: profile?.goal || "Maintenance",
          cuisine,
          availableIngredients,
          foodsToAvoid,
          budget,
          cookingTime,
          allergies: profile?.extended_data?.allergies || [],
          dislikes: profile?.extended_data?.disliked_foods || [],
          excludedMeals: forceRegenerate ? excludedMeals : [],
          regenerationId: forceRegenerate ? crypto.randomUUID() : "",
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data: MealGenerationResponse = await res.json();
      if (!forceRegenerate) {
        mealCache.set(cacheKey, data);
      }

      // Collect generated names to avoid duplicates
      if ("meals" in data && Array.isArray(data.meals)) {
        data.meals.forEach((m) => {
          if (m?.mealName) setRecentMealNames((prev) => [...prev, m.mealName]);
        });
      } else if ("mealName" in data && data.mealName) {
        setRecentMealNames((prev) => [...prev, data.mealName]);
      }

      setMealResult(data);
      toast.success(
        selectedMealType === "Full Day Plan"
          ? "🎉 Full-day personalized meal plan created!"
          : "✨ Personalized meal generated!",
      );
    } catch (e) {
      console.error("Meal Generation error:", e);
      toast.error("Unable to generate a meal right now. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  // Single meal card regeneration handler
  const handleRegenerateSingleMeal = async (targetMeal: MealOutput, mealIndex?: number) => {
    const cardKey =
      isFullDay && typeof mealIndex === "number" ? `full-${mealIndex}` : "single-meal";
    if (generating || regeneratingKey) return;

    setRegeneratingKey(cardKey);

    try {
      // Collect currently displayed meal names
      const currentDisplayedNames: string[] = [];
      if (mealResult) {
        if ("meals" in mealResult && Array.isArray(mealResult.meals)) {
          mealResult.meals.forEach((m) => {
            if (m && m.mealName) currentDisplayedNames.push(m.mealName);
          });
        } else if ("mealName" in mealResult && mealResult.mealName) {
          currentDisplayedNames.push(mealResult.mealName);
        }
      }

      const excludedMeals = Array.from(new Set([...currentDisplayedNames, ...recentMealNames]));

      // Calculate slot target calories and macros for slot
      let slotCalorieTarget = calorieTarget;
      let slotProteinTarget = proteinTarget;

      if (isFullDay) {
        const slotType = (targetMeal.mealType || "").toLowerCase();
        if (slotType.includes("breakfast")) {
          slotCalorieTarget = Math.round(calorieTarget * 0.25);
          slotProteinTarget = Math.round(proteinTarget * 0.25);
        } else if (slotType.includes("lunch")) {
          slotCalorieTarget = Math.round(calorieTarget * 0.35);
          slotProteinTarget = Math.round(proteinTarget * 0.35);
        } else if (slotType.includes("snack")) {
          slotCalorieTarget = Math.round(calorieTarget * 0.15);
          slotProteinTarget = Math.round(proteinTarget * 0.15);
        } else if (slotType.includes("dinner")) {
          slotCalorieTarget = Math.round(calorieTarget * 0.25);
          slotProteinTarget = Math.round(proteinTarget * 0.25);
        }
      }

      const res = await fetch("/api/generate-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mealType: targetMeal.mealType,
          currentMealName: targetMeal.mealName,
          excludedMeals,
          regenerationId: crypto.randomUUID(),
          diet: selectedDiet,
          calorieTarget: slotCalorieTarget,
          proteinTarget: slotProteinTarget,
          carbsTarget: Math.round(carbsTarget * 0.25),
          fatTarget: Math.round(fatTarget * 0.25),
          goal: profile?.goal || "Maintenance",
          cuisine,
          availableIngredients,
          foodsToAvoid,
          budget,
          cookingTime,
          allergies: profile?.extended_data?.allergies || [],
          dislikes: profile?.extended_data?.disliked_foods || [],
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const newMeal: MealOutput = await res.json();

      if (!newMeal || !newMeal.mealName || !newMeal.nutrition) {
        throw new Error("Invalid meal response");
      }

      setRecentMealNames((prev) => [...prev, newMeal.mealName]);

      if (isFullDay && mealResult && "meals" in mealResult && typeof mealIndex === "number") {
        const updatedMeals = [...mealResult.meals];
        updatedMeals[mealIndex] = newMeal;

        const newTotals = updatedMeals.reduce(
          (acc, m) => ({
            calories: acc.calories + (m.nutrition.calories || 0),
            protein: Number((acc.protein + (m.nutrition.protein || 0)).toFixed(1)),
            carbs: Number((acc.carbs + (m.nutrition.carbs || 0)).toFixed(1)),
            fat: Number((acc.fat + (m.nutrition.fat || 0)).toFixed(1)),
            fiber: Number((acc.fiber + (m.nutrition.fiber || 0)).toFixed(1)),
          }),
          { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
        );

        setMealResult({
          ...mealResult,
          dailyNutrition: {
            calories: Math.round(newTotals.calories),
            protein: Number(newTotals.protein.toFixed(1)),
            carbs: Number(newTotals.carbs.toFixed(1)),
            fat: Number(newTotals.fat.toFixed(1)),
            fiber: Number(newTotals.fiber.toFixed(1)),
          },
          meals: updatedMeals,
        });

        setAddedMealIds((prev) => {
          const copy = new Set(prev);
          copy.delete(cardKey);
          return copy;
        });

        toast.success(`✨ Regenerated ${targetMeal.mealType}: "${newMeal.mealName}"`);
      } else {
        setMealResult(newMeal);
        setAddedMealIds((prev) => {
          const copy = new Set(prev);
          copy.delete("single-meal");
          return copy;
        });
        toast.success(`✨ Regenerated meal: "${newMeal.mealName}"`);
      }
    } catch (e) {
      console.error("Single Meal Regeneration error:", e);
      toast.error("Unable to regenerate meal. Keeping current meal.");
    } finally {
      setRegeneratingKey(null);
    }
  };

  // Add single meal to Today's Meals
  const handleAddMealToToday = (meal: MealOutput, uniqueKey: string) => {
    const todayStr = getLocalDateString();
    LocalStore.addMeal({
      name: meal.mealName,
      source: "manual",
      serving_desc: `1 serving (${meal.prepTime || 15} min prep)`,
      calories: meal.nutrition.calories,
      protein_g: meal.nutrition.protein,
      carbs_g: meal.nutrition.carbs,
      fat_g: meal.nutrition.fat,
      fiber_g: meal.nutrition.fiber || 0,
      sugar_g: meal.nutrition.sugar || 0,
      sodium_mg: meal.nutrition.sodium_mg || 0,
      iron_mg: meal.nutrition.iron_mg || 0,
      calcium_mg: meal.nutrition.calcium_mg || 0,
      magnesium_mg: meal.nutrition.magnesium_mg || 0,
      potassium_mg: meal.nutrition.potassium_mg || 0,
      vit_a_ug: meal.nutrition.vit_a_ug || 0,
      vit_b12_ug: meal.nutrition.vit_b12_ug || 0,
      vit_d_ug: meal.nutrition.vit_d_ug || 0,
      omega3_g: meal.nutrition.omega3_g || 0,
      eaten_at: new Date().toISOString(),
      eaten_on: todayStr,
    });

    setAddedMealIds((prev) => new Set([...prev, uniqueKey]));
    toast.success(`✓ "${meal.mealName}" added to Today's Meals!`);
  };

  // Add entire full day plan to Today's Meals
  const handleAddFullDayToToday = (fullPlan: FullDayPlanOutput) => {
    const todayStr = getLocalDateString();
    const newKeys = new Set(addedMealIds);

    fullPlan.meals.forEach((m, idx) => {
      const key = `full-${idx}`;
      LocalStore.addMeal({
        name: m.mealName,
        source: "manual",
        serving_desc: `1 serving (${m.prepTime || 15} min prep)`,
        calories: m.nutrition.calories,
        protein_g: m.nutrition.protein,
        carbs_g: m.nutrition.carbs,
        fat_g: m.nutrition.fat,
        fiber_g: m.nutrition.fiber || 0,
        sugar_g: m.nutrition.sugar || 0,
        sodium_mg: m.nutrition.sodium_mg || 0,
        iron_mg: m.nutrition.iron_mg || 0,
        calcium_mg: m.nutrition.calcium_mg || 0,
        magnesium_mg: m.nutrition.magnesium_mg || 0,
        potassium_mg: m.nutrition.potassium_mg || 0,
        vit_a_ug: m.nutrition.vit_a_ug || 0,
        vit_b12_ug: m.nutrition.vit_b12_ug || 0,
        vit_d_ug: m.nutrition.vit_d_ug || 0,
        omega3_g: m.nutrition.omega3_g || 0,
        eaten_at: new Date().toISOString(),
        eaten_on: todayStr,
      });
      newKeys.add(key);
    });

    setAddedMealIds(newKeys);
    toast.success(`🎉 All ${fullPlan.meals.length} meals added to Today's Meals!`);
  };

  // Save meal to favorites
  const handleSaveMeal = (uniqueKey: string) => {
    if (savedMealIds.has(uniqueKey)) {
      setSavedMealIds((prev) => {
        const copy = new Set(prev);
        copy.delete(uniqueKey);
        return copy;
      });
      toast.info("Meal removed from saved favorites.");
    } else {
      setSavedMealIds((prev) => new Set([...prev, uniqueKey]));
      toast.success("♡ Meal saved to favorites!");
    }
  };

  const isFullDay = mealResult && "isFullDay" in mealResult;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Header Section */}
      <div className="relative rounded-[28px] border border-border/80 bg-card/60 dark:border-white/10 dark:bg-[#0C1722]/80 backdrop-blur-2xl p-6 shadow-xl overflow-hidden">
        {/* Glow accent */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.18)_0%,rgba(0,0,0,0)_70%)] blur-2xl" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-[#38BDF8] via-[#22D3EE] to-[#34D399] text-[#071018] shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                <ChefHat className="h-5 w-5" />
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground dark:text-white">
                AI Meal Generator
              </h1>
            </div>
            <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground dark:text-slate-300 font-medium max-w-xl">
              Create personalized, nutrient-dense meals calculated against your daily targets with a
              single tap.
            </p>
          </div>

          {/* Daily Macro Target Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-card/80 dark:bg-[#071018]/80 p-2.5 rounded-[20px] border border-border/60 dark:border-white/10 shrink-0">
            <div className="flex flex-col px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1">
                <Flame className="h-3 w-3" /> Calories
              </span>
              <span className="text-sm font-extrabold text-foreground dark:text-white">
                {calorieTarget}{" "}
                <span className="text-[10px] font-medium text-muted-foreground">kcal</span>
              </span>
            </div>

            <div className="flex flex-col px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1">
                <Dumbbell className="h-3 w-3" /> Protein
              </span>
              <span className="text-sm font-extrabold text-foreground dark:text-white">
                {proteinTarget}{" "}
                <span className="text-[10px] font-medium text-muted-foreground">g</span>
              </span>
            </div>

            <div className="flex flex-col px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/20">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-500 flex items-center gap-1">
                <Wheat className="h-3 w-3" /> Carbs
              </span>
              <span className="text-sm font-extrabold text-foreground dark:text-white">
                {carbsTarget}{" "}
                <span className="text-[10px] font-medium text-muted-foreground">g</span>
              </span>
            </div>

            <div className="flex flex-col px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-500 flex items-center gap-1">
                <Leaf className="h-3 w-3" /> Fat
              </span>
              <span className="text-sm font-extrabold text-foreground dark:text-white">
                {fatTarget} <span className="text-[10px] font-medium text-muted-foreground">g</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Generator Form Section */}
      <div className="rounded-[28px] border border-border/80 bg-card/60 dark:border-white/10 dark:bg-[#0C1722]/80 backdrop-blur-2xl p-5 sm:p-6 shadow-xl space-y-6">
        {/* 1. Meal Type Selection */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-muted-foreground dark:text-slate-300 flex items-center gap-1.5">
            <Utensils className="h-3.5 w-3.5 text-primary" />
            <span>Meal Type</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {MEAL_TYPES.map((type) => {
              const active = selectedMealType === type;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedMealType(type)}
                  className={`relative flex items-center justify-center gap-2 rounded-2xl py-3 px-3 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                    active
                      ? "bg-gradient-to-r from-[#38BDF8] to-[#34D399] text-[#071018] shadow-[0_0_20px_rgba(56,189,248,0.35)] scale-[1.02]"
                      : "bg-card/80 border border-border/80 text-muted-foreground hover:text-foreground dark:bg-[#071018]/60 dark:border-white/10 dark:hover:text-white"
                  }`}
                >
                  <span>{type}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Diet Type Selection */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-muted-foreground dark:text-slate-300 flex items-center gap-1.5">
            <Leaf className="h-3.5 w-3.5 text-emerald-400" />
            <span>{selectedMealType === "Full Day Plan" ? "Choose your diet:" : "Diet Type"}</span>
          </label>
          <div className="flex flex-wrap gap-2.5">
            {(selectedMealType === "Full Day Plan"
              ? [
                  { id: "Vegetarian", label: "🥗 Vegetarian" },
                  { id: "Non-Vegetarian", label: "🍗 Non-Vegetarian" },
                  { id: "Mixed", label: "🔄 Mixed" },
                ]
              : DIET_TYPES
            ).map((diet) => {
              const active = selectedDiet === diet.id;

              return (
                <button
                  key={diet.id}
                  onClick={() => {
                    const newDiet = diet.id;
                    setSelectedDiet(newDiet);
                    if (
                      selectedMealType === "Full Day Plan" &&
                      mealResult &&
                      isFullDay &&
                      newDiet !== selectedDiet
                    ) {
                      handleGenerate(true, newDiet);
                    }
                  }}
                  className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer ${
                    active
                      ? "bg-emerald-500 text-slate-950 shadow-[0_0_18px_rgba(16,185,129,0.4)] scale-105"
                      : "bg-card/80 border border-border/80 text-muted-foreground hover:text-foreground dark:bg-[#071018]/60 dark:border-white/10"
                  }`}
                >
                  {diet.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Optional Preferences Accordion */}
        <div className="border-t border-border/50 dark:border-white/10 pt-4">
          <button
            onClick={() => setShowOptionalPref(!showOptionalPref)}
            className="flex items-center justify-between w-full text-xs font-bold text-muted-foreground hover:text-foreground dark:text-slate-300 transition cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-sky-400" />
              <span>Optional Preferences (Cuisine, Ingredients, Budget, Time)</span>
            </span>
            {showOptionalPref ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          <AnimatePresence>
            {showOptionalPref && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 overflow-hidden"
              >
                {/* Cuisine */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground">
                    Preferred Cuisine
                  </label>
                  <select
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                    className="w-full rounded-xl border border-border/80 bg-card px-3 py-2 text-xs font-semibold text-foreground dark:bg-[#071018] dark:border-white/10 outline-none focus:border-primary"
                  >
                    {CUISINE_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Available Ingredients */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground">
                    Available Ingredients
                  </label>
                  <input
                    type="text"
                    value={availableIngredients}
                    onChange={(e) => setAvailableIngredients(e.target.value)}
                    placeholder="e.g., Paneer, oats, spinach"
                    className="w-full rounded-xl border border-border/80 bg-card px-3 py-2 text-xs font-medium text-foreground dark:bg-[#071018] dark:border-white/10 outline-none focus:border-primary placeholder:text-muted-foreground/60"
                  />
                </div>

                {/* Foods to Avoid */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground">
                    Foods to Avoid
                  </label>
                  <input
                    type="text"
                    value={foodsToAvoid}
                    onChange={(e) => setFoodsToAvoid(e.target.value)}
                    placeholder="e.g., Peanuts, mushrooms"
                    className="w-full rounded-xl border border-border/80 bg-card px-3 py-2 text-xs font-medium text-foreground dark:bg-[#071018] dark:border-white/10 outline-none focus:border-primary placeholder:text-muted-foreground/60"
                  />
                </div>

                {/* Budget */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground">Budget Tier</label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full rounded-xl border border-border/80 bg-card px-3 py-2 text-xs font-semibold text-foreground capitalize dark:bg-[#071018] dark:border-white/10 outline-none focus:border-primary"
                  >
                    {BUDGET_OPTIONS.map((b) => (
                      <option key={b} value={b}>
                        {b} Budget
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cooking Time */}
                <div className="space-y-1.5 sm:col-span-2 md:col-span-1">
                  <label className="text-[11px] font-bold text-muted-foreground">
                    Max Cooking Time
                  </label>
                  <select
                    value={cookingTime}
                    onChange={(e) => setCookingTime(e.target.value)}
                    className="w-full rounded-xl border border-border/80 bg-card px-3 py-2 text-xs font-semibold text-foreground dark:bg-[#071018] dark:border-white/10 outline-none focus:border-primary"
                  >
                    {COOKING_TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => handleGenerate(false)}
          disabled={generating}
          className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#38BDF8] via-[#22D3EE] to-[#34D399] py-4 text-sm sm:text-base font-black text-[#071018] shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:brightness-110 active:scale-[0.99] transition duration-200 disabled:opacity-50 cursor-pointer"
        >
          {generating ? (
            <>
              <RefreshCw className="h-5 w-5 animate-spin text-[#071018]" />
              <span>Creating your meal...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              <span>
                {selectedMealType === "Full Day Plan"
                  ? "✨ Generate Full Day Plan"
                  : "✨ Generate Meal"}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Generated Meal Result Display */}
      {mealResult && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-400">
          {/* Header for Full Day Plan */}
          {isFullDay ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[24px] border border-border/80 bg-gradient-to-r from-emerald-500/10 via-sky-500/10 to-teal-500/10 dark:border-white/10 p-5 backdrop-blur-xl">
                <div>
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="h-5 w-5 text-emerald-400" />
                    <h2 className="font-display text-xl font-extrabold text-foreground dark:text-white">
                      Full Day Personalized Plan
                    </h2>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    4 balanced meals engineered to hit your daily total target.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAddFullDayToToday(mealResult as FullDayPlanOutput)}
                    className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-md hover:bg-emerald-400 transition cursor-pointer"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Add Entire Day to Today's Meals</span>
                  </button>

                  <button
                    onClick={() => handleGenerate(true)}
                    disabled={generating}
                    className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-card px-3 py-2 text-xs font-bold text-foreground hover:bg-muted dark:border-white/10 transition cursor-pointer"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${generating ? "animate-spin" : ""}`} />
                    <span>Regenerate</span>
                  </button>
                </div>
              </div>

              {/* Full Day Daily Totals & Target Achievement Comparison Bar */}
              {(() => {
                const planData = mealResult as FullDayPlanOutput;
                const nut = planData.dailyNutrition;
                const dailyCost = planData.dailyCost || 220;
                const dailyBudget = planData.dailyBudget || 250;
                const calPct = Math.round((nut.calories / (calorieTarget || 1)) * 100);
                const proPct = Math.round((nut.protein / (proteinTarget || 1)) * 100);
                const carbPct = Math.round((nut.carbs / (carbsTarget || 1)) * 100);
                const fatPct = Math.round((nut.fat / (fatTarget || 1)) * 100);

                return (
                  <div className="rounded-3xl border border-border/80 bg-card/80 dark:bg-[#071018]/80 dark:border-white/10 p-5 space-y-4 backdrop-blur-xl shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 dark:border-white/10 pb-3">
                      <div>
                        <div className="text-xs font-black uppercase tracking-wider text-muted-foreground dark:text-slate-300 flex items-center gap-1.5">
                          <Flame className="h-4 w-4 text-amber-400" />
                          <span>Daily Target vs Your Plan</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Nutrition calculated strictly via local database and optimized to match
                          your profile targets.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full flex items-center gap-1">
                          <Coins className="h-3.5 w-3.5" />
                          <span>
                            Est. Cost: ₹{dailyCost} / ₹{dailyBudget} Budget
                          </span>
                        </div>
                        <div className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                          {selectedDiet} Diet Mode
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {/* Calories */}
                      <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-3.5 space-y-1">
                        <div className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                          Calories
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          TARGET:{" "}
                          <span className="font-bold text-foreground dark:text-slate-200">
                            {calorieTarget} kcal
                          </span>
                        </div>
                        <div className="text-sm font-black text-foreground dark:text-white">
                          PLAN: {nut.calories} kcal
                        </div>
                        <div className="text-xs font-extrabold text-amber-400 pt-1 border-t border-amber-500/10 flex justify-between items-center">
                          <span>Achieved</span>
                          <span>{calPct}%</span>
                        </div>
                      </div>

                      {/* Protein */}
                      <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-3.5 space-y-1">
                        <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                          Protein
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          TARGET:{" "}
                          <span className="font-bold text-foreground dark:text-slate-200">
                            {proteinTarget}g
                          </span>
                        </div>
                        <div className="text-sm font-black text-foreground dark:text-white">
                          PLAN: {nut.protein}g
                        </div>
                        <div className="text-xs font-extrabold text-emerald-400 pt-1 border-t border-emerald-500/10 flex justify-between items-center">
                          <span>Achieved</span>
                          <span>{proPct}%</span>
                        </div>
                      </div>

                      {/* Carbs */}
                      <div className="rounded-2xl border border-sky-500/25 bg-sky-500/5 p-3.5 space-y-1">
                        <div className="text-[10px] font-bold text-sky-500 uppercase tracking-wider">
                          Carbs
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          TARGET:{" "}
                          <span className="font-bold text-foreground dark:text-slate-200">
                            {carbsTarget}g
                          </span>
                        </div>
                        <div className="text-sm font-black text-foreground dark:text-white">
                          PLAN: {nut.carbs}g
                        </div>
                        <div className="text-xs font-extrabold text-sky-400 pt-1 border-t border-sky-500/10 flex justify-between items-center">
                          <span>Achieved</span>
                          <span>{carbPct}%</span>
                        </div>
                      </div>

                      {/* Fat */}
                      <div className="rounded-2xl border border-purple-500/25 bg-purple-500/5 p-3.5 space-y-1">
                        <div className="text-[10px] font-bold text-purple-500 uppercase tracking-wider">
                          Fat
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          TARGET:{" "}
                          <span className="font-bold text-foreground dark:text-slate-200">
                            {fatTarget}g
                          </span>
                        </div>
                        <div className="text-sm font-black text-foreground dark:text-white">
                          PLAN: {nut.fat}g
                        </div>
                        <div className="text-xs font-extrabold text-purple-400 pt-1 border-t border-purple-500/10 flex justify-between items-center">
                          <span>Achieved</span>
                          <span>{fatPct}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 4 Meal Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(mealResult as FullDayPlanOutput).meals.map((meal, idx) => (
                  <MealCard
                    key={`full-${idx}`}
                    meal={meal}
                    uniqueKey={`full-${idx}`}
                    isAdded={addedMealIds.has(`full-${idx}`)}
                    isSaved={savedMealIds.has(`full-${idx}`)}
                    onAdd={() => handleAddMealToToday(meal, `full-${idx}`)}
                    onRegenerate={() => handleRegenerateSingleMeal(meal, idx)}
                    onSave={() => handleSaveMeal(`full-${idx}`)}
                    onViewDetails={() => setSelectedDetailMeal(meal)}
                    isGenerating={generating}
                    isRegenerating={regeneratingKey === `full-${idx}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* Single Meal Display */
            <div className="max-w-3xl mx-auto">
              <MealCard
                meal={mealResult as MealOutput}
                uniqueKey="single-meal"
                isAdded={addedMealIds.has("single-meal")}
                isSaved={savedMealIds.has("single-meal")}
                onAdd={() => handleAddMealToToday(mealResult as MealOutput, "single-meal")}
                onRegenerate={() => handleRegenerateSingleMeal(mealResult as MealOutput)}
                onSave={() => handleSaveMeal("single-meal")}
                onViewDetails={() => setSelectedDetailMeal(mealResult as MealOutput)}
                isGenerating={generating}
                isRegenerating={regeneratingKey === "single-meal"}
              />
            </div>
          )}
        </div>
      )}

      {/* Detail Modal for Meal Breakdown */}
      <AnimatePresence>
        {selectedDetailMeal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-[28px] border border-border/80 bg-card p-6 shadow-2xl dark:border-white/10 dark:bg-[#0C1722] space-y-5"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <span className="rounded-full bg-primary/20 text-primary px-2.5 py-0.5 text-[10px] font-black uppercase">
                    {selectedDetailMeal.mealType}
                  </span>
                  <h3 className="font-display text-xl font-black text-foreground dark:text-white mt-1">
                    {selectedDetailMeal.mealName}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedDetailMeal(null)}
                  className="rounded-full p-2 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Nutrition Summary */}
              <div className="grid grid-cols-5 gap-2 bg-muted/40 dark:bg-[#071018]/60 p-3 rounded-2xl text-center">
                <div>
                  <div className="text-[10px] font-bold text-muted-foreground">Calories</div>
                  <div className="text-sm font-black text-foreground dark:text-white">
                    {selectedDetailMeal.nutrition.calories} <span className="text-[9px]">kcal</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-muted-foreground">Protein</div>
                  <div className="text-sm font-black text-emerald-400">
                    {selectedDetailMeal.nutrition.protein}g
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-muted-foreground">Carbs</div>
                  <div className="text-sm font-black text-sky-400">
                    {selectedDetailMeal.nutrition.carbs}g
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-muted-foreground">Fat</div>
                  <div className="text-sm font-black text-purple-400">
                    {selectedDetailMeal.nutrition.fat}g
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-muted-foreground">Fiber</div>
                  <div className="text-sm font-black text-teal-400">
                    {selectedDetailMeal.nutrition.fiber}g
                  </div>
                </div>
              </div>

              {/* Ingredients List */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Utensils className="h-3.5 w-3.5 text-primary" />
                  <span>Exact Ingredients</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedDetailMeal.ingredients.map((ing, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-xl border border-border/60 bg-card/60 dark:border-white/10 dark:bg-[#071018]/40 px-3 py-2 text-xs"
                    >
                      <span className="font-semibold text-foreground dark:text-slate-200">
                        {ing.name}
                      </span>
                      <span className="font-extrabold text-primary">
                        {ing.quantity} {ing.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-sky-400" />
                  <span>Cooking Instructions</span>
                </h4>
                <ol className="space-y-2 text-xs leading-relaxed text-muted-foreground dark:text-slate-300">
                  {selectedDetailMeal.instructions.map((step, idx) => (
                    <li key={idx} className="flex gap-2.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-black text-primary">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedDetailMeal(null)}
                  className="rounded-xl bg-primary text-primary-foreground px-5 py-2 text-xs font-bold hover:brightness-110 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Reusable Meal Card Component
function MealCard({
  meal,
  uniqueKey,
  isAdded,
  isSaved,
  onAdd,
  onRegenerate,
  onSave,
  onViewDetails,
  isGenerating,
  isRegenerating = false,
}: {
  meal: MealOutput;
  uniqueKey: string;
  isAdded: boolean;
  isSaved: boolean;
  onAdd: () => void;
  onRegenerate: () => void;
  onSave: () => void;
  onViewDetails: () => void;
  isGenerating: boolean;
  isRegenerating?: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-border/80 bg-card/80 dark:border-white/10 dark:bg-[#0C1722]/90 backdrop-blur-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
      {/* Overlay when regenerating this card */}
      {isRegenerating && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-card/85 dark:bg-[#0C1722]/85 backdrop-blur-md animate-in fade-in duration-200">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
          <span className="text-xs font-extrabold text-foreground tracking-wide">
            Regenerating {meal.mealType}...
          </span>
        </div>
      )}

      <div className="space-y-3">
        {/* Header Badges */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-gradient-to-r from-[#38BDF8] to-[#34D399] px-2.5 py-0.5 text-[9px] font-black uppercase text-[#071018]">
                🍽️ {meal.mealType}
              </span>
              {meal.isNutritionEstimated && (
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  Verified Local Nutrition
                </span>
              )}
            </div>
            <h3 className="font-display text-lg font-black tracking-tight text-foreground dark:text-white mt-1">
              {meal.mealName}
            </h3>
          </div>

          <button
            onClick={onSave}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              isSaved
                ? "bg-rose-500/20 border-rose-500/40 text-rose-500"
                : "border-border/60 bg-card/60 text-muted-foreground hover:text-foreground dark:border-white/10"
            }`}
            title="Save Meal"
          >
            <Heart className={`h-4 w-4 ${isSaved ? "fill-rose-500" : ""}`} />
          </button>
        </div>

        {/* Macro Pill Grid */}
        <div className="grid grid-cols-5 gap-1.5 bg-muted/30 dark:bg-[#071018]/60 p-2.5 rounded-2xl text-center">
          <div>
            <span className="text-[9px] font-bold text-amber-500 uppercase">Cal</span>
            <div className="text-xs font-extrabold text-foreground dark:text-white">
              {meal.nutrition.calories}
            </div>
          </div>
          <div>
            <span className="text-[9px] font-bold text-emerald-500 uppercase">Prot</span>
            <div className="text-xs font-extrabold text-emerald-400">{meal.nutrition.protein}g</div>
          </div>
          <div>
            <span className="text-[9px] font-bold text-sky-500 uppercase">Carb</span>
            <div className="text-xs font-extrabold text-sky-400">{meal.nutrition.carbs}g</div>
          </div>
          <div>
            <span className="text-[9px] font-bold text-purple-500 uppercase">Fat</span>
            <div className="text-xs font-extrabold text-purple-400">{meal.nutrition.fat}g</div>
          </div>
          <div>
            <span className="text-[9px] font-bold text-teal-500 uppercase">Fib</span>
            <div className="text-xs font-extrabold text-teal-400">{meal.nutrition.fiber}g</div>
          </div>
        </div>

        {/* Meta info bar */}
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1 font-medium">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-sky-400" />
            <span>Prep: {meal.prepTime || 15} mins</span>
          </span>
          <span className="flex items-center gap-1">
            <Coins className="h-3.5 w-3.5 text-amber-400" />
            <span>Cost: {meal.estimatedCost || "₹70"}</span>
          </span>
        </div>

        {/* Ingredients Summary */}
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
            Key Ingredients:
          </span>
          <p className="text-xs text-foreground/90 dark:text-slate-300 font-medium line-clamp-2">
            {meal.ingredients.map((i) => `${i.quantity}${i.unit} ${i.name}`).join(", ")}
          </p>
        </div>
      </div>

      {/* Buttons Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/50 dark:border-white/10">
        <button
          onClick={onAdd}
          disabled={isAdded}
          className={`flex items-center justify-center gap-1 rounded-xl py-2 px-2 text-xs font-bold transition cursor-pointer col-span-2 sm:col-span-1 ${
            isAdded
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md"
          }`}
        >
          {isAdded ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Added</span>
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" />
              <span>Add to Today</span>
            </>
          )}
        </button>

        <button
          onClick={onRegenerate}
          disabled={isGenerating || isRegenerating}
          className="flex items-center justify-center gap-1 rounded-xl border border-border/80 bg-card py-2 px-2 text-xs font-bold text-foreground hover:bg-muted dark:border-white/10 transition cursor-pointer disabled:opacity-50"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isRegenerating || isGenerating ? "animate-spin text-primary" : ""}`}
          />
          <span>{isRegenerating ? "Regenerating..." : "Regenerate"}</span>
        </button>

        <button
          onClick={onViewDetails}
          className="flex items-center justify-center gap-1 rounded-xl border border-border/80 bg-card py-2 px-2 text-xs font-bold text-foreground hover:bg-muted dark:border-white/10 transition cursor-pointer col-span-2 sm:col-span-2"
        >
          <FileText className="h-3.5 w-3.5 text-sky-400" />
          <span>View Details</span>
        </button>
      </div>
    </div>
  );
}
