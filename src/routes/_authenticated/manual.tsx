import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { logMeal } from "@/lib/meals.functions";
import { LocalStore } from "@/lib/local-store";
import { getLocalDateString } from "@/lib/date-utils";
import { useState } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Trash2,
  Sparkles,
  Calculator,
  Flame,
  Beef,
  Wheat,
  Droplet,
  Leaf,
  CheckCircle2,
  Utensils,
  ChevronRight,
  Info,
  Layers,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/manual")({
  head: () => ({ meta: [{ title: "Manual Meal & Ingredient Analyzer — NutriLens" }] }),
  component: ManualPage,
});

interface IngredientRow {
  id: string;
  name: string;
  amount: string;
}

interface AnalysisResult {
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
  ingredientBreakdown?: Array<{
    name: string;
    amount: string;
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
  }>;
}

const SAMPLE_PRESETS = [
  {
    name: "Paneer & Soya Bhurji",
    ingredients: [
      { id: "p1", name: "Paneer / Cottage Cheese", amount: "100g" },
      { id: "p2", name: "Soya Granules", amount: "50g" },
      { id: "p3", name: "Whole Wheat Chapati", amount: "2 pcs" },
      { id: "p4", name: "Mustard Oil", amount: "1 tsp" },
    ],
  },
  {
    name: "Eggs & Toast Breakfast",
    ingredients: [
      { id: "e1", name: "Whole Eggs", amount: "3 pcs" },
      { id: "e2", name: "Whole Wheat Bread", amount: "2 slices" },
      { id: "e3", name: "Butter", amount: "1 tsp" },
    ],
  },
  {
    name: "Oats & Peanut Butter Porridge",
    ingredients: [
      { id: "o1", name: "Rolled Oats", amount: "60g" },
      { id: "o2", name: "Whole Milk", amount: "250ml" },
      { id: "o3", name: "Peanut Butter", amount: "1 tbsp" },
      { id: "o4", name: "Banana", amount: "1 medium" },
    ],
  },
  {
    name: "Chicken Rice Bowl",
    ingredients: [
      { id: "c1", name: "Chicken Breast (Grilled)", amount: "150g" },
      { id: "c2", name: "Cooked Basmati Rice", amount: "150g" },
      { id: "c3", name: "Steamed Broccoli", amount: "80g" },
      { id: "c4", name: "Olive Oil", amount: "1 tsp" },
    ],
  },
];

function ManualPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const logFn = useServerFn(logMeal);

  const [f, setF] = useState({
    name: "",
    calories: 0,
    protein_g: 0,
    carbs_g: 0,
    fat_g: 0,
    fiber_g: 0,
    sugar_g: 0,
    sodium_mg: 0,
    iron_mg: 0,
    calcium_mg: 0,
    magnesium_mg: 0,
    potassium_mg: 0,
    vit_a_ug: 0,
    vit_b12_ug: 0,
    vit_d_ug: 0,
    omega3_g: 0,
  });

  const [ingredients, setIngredients] = useState<IngredientRow[]>([
    { id: "1", name: "Paneer / Cottage Cheese", amount: "100g" },
    { id: "2", name: "Whole Wheat Chapati", amount: "2 pcs" },
    { id: "3", name: "Mustard Oil", amount: "1 tsp" },
  ]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedResult, setAnalyzedResult] = useState<AnalysisResult | null>(null);

  // Add new ingredient row
  const addIngredientRow = () => {
    setIngredients((prev) => [...prev, { id: Date.now().toString(), name: "", amount: "100g" }]);
  };

  // Remove ingredient row
  const removeIngredientRow = (id: string) => {
    if (ingredients.length <= 1) {
      toast.error("Please keep at least one ingredient.");
      return;
    }
    setIngredients((prev) => prev.filter((item) => item.id !== id));
  };

  // Update ingredient row
  const updateIngredient = (id: string, field: "name" | "amount", value: string) => {
    setIngredients((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  // Load Preset
  const loadPreset = (preset: (typeof SAMPLE_PRESETS)[0]) => {
    setF((prev) => ({ ...prev, name: preset.name }));
    setIngredients(preset.ingredients);
    setAnalyzedResult(null);
    toast.success(`Loaded "${preset.name}" preset! Click Analyze below.`);
  };

  // Analyze ingredients via backend endpoint
  const handleAnalyze = async () => {
    const validIngredients = ingredients.filter((i) => i.name.trim().length > 0);
    if (validIngredients.length === 0) {
      toast.error("Please add at least one ingredient name.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/analyze-ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mealName: f.name || "Custom Meal",
          ingredients: validIngredients,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with ${res.status}`);
      }

      const data: AnalysisResult = await res.json();
      setAnalyzedResult(data);

      // Automatically sync calculated values into form state
      setF({
        name: f.name || data.mealName || "Custom Meal",
        calories: data.calories,
        protein_g: data.protein_g,
        carbs_g: data.carbs_g,
        fat_g: data.fat_g,
        fiber_g: data.fiber_g,
        sugar_g: data.sugar_g,
        sodium_mg: data.sodium_mg || 0,
        iron_mg: data.iron_mg || 0,
        calcium_mg: data.calcium_mg || 0,
        magnesium_mg: data.magnesium_mg || 0,
        potassium_mg: data.potassium_mg || 0,
        vit_a_ug: data.vit_a_ug || 0,
        vit_b12_ug: data.vit_b12_ug || 0,
        vit_d_ug: data.vit_d_ug || 0,
        omega3_g: data.omega3_g || 0,
      });

      toast.success("Analysis completed! Macros and micros loaded.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to analyze ingredients";
      toast.error(msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Save meal mutation
  const save = useMutation({
    mutationFn: async () => {
      const localDay = getLocalDateString();
      LocalStore.addMeal({
        name: f.name || "Custom Meal",
        source: "manual",
        calories: Number(f.calories),
        protein_g: Number(f.protein_g),
        carbs_g: Number(f.carbs_g),
        fat_g: Number(f.fat_g),
        fiber_g: Number(f.fiber_g),
        sugar_g: Number(f.sugar_g),
        sodium_mg: Number(f.sodium_mg || 0),
        iron_mg: Number(f.iron_mg || 0),
        calcium_mg: Number(f.calcium_mg || 0),
        magnesium_mg: Number(f.magnesium_mg || 0),
        potassium_mg: Number(f.potassium_mg || 0),
        vit_a_ug: Number(f.vit_a_ug || 0),
        vit_b12_ug: Number(f.vit_b12_ug || 0),
        vit_d_ug: Number(f.vit_d_ug || 0),
        omega3_g: Number(f.omega3_g || 0),
        eaten_at: new Date().toISOString(),
        eaten_on: localDay,
      });
      try {
        await logFn({
          data: {
            ...f,
            name: f.name || "Custom Meal",
            source: "manual",
            eaten_on: localDay,
          },
        });
      } catch {
        // LocalStore fallback handled
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["today"] });
      toast.success("Meal logged to your daily tracker!");
      navigate({ to: "/home" });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to log meal"),
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-border/80 pb-4">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-extrabold text-emerald-400 w-fit shadow-[0_0_12px_rgba(0,229,143,0.15)]">
          <Calculator className="h-3.5 w-3.5 text-primary" /> Ingredient Nutrition System
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Manual Meal & Ingredient Entry
        </h1>
        <p className="text-xs text-muted-foreground">
          Add your meal ingredients with quantities, hit{" "}
          <strong className="text-primary">Analyze</strong> to auto-calculate complete macros and
          micro-nutrients!
        </p>
      </div>

      {/* Preset Chips */}
      <div className="space-y-2">
        <div className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-amber-400" /> Quick Preset Meal Examples
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => loadPreset(preset)}
              className="rounded-full border border-border/80 bg-card/60 hover:bg-emerald-500/10 hover:border-emerald-500/30 px-3.5 py-1.5 text-xs font-extrabold text-foreground hover:text-primary transition-all active:scale-95 shadow-sm"
            >
              + {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Meal Name Card */}
      <div className="rounded-[24px] border border-border/80 bg-card/60 dark:border-white/10 dark:bg-[#0C1722]/80 backdrop-blur-2xl p-5 shadow-xl space-y-4">
        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-1.5">
            Meal Title / Dish Name
          </label>
          <input
            value={f.name}
            onChange={(e) => setF({ ...f, name: e.target.value })}
            className="w-full rounded-[16px] border border-border/80 bg-background/80 px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
            placeholder="e.g. Soya & Paneer Bhurji with Rotis"
          />
        </div>

        {/* Ingredient Entry Section */}
        <div className="space-y-3.5 pt-3 border-t border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-primary flex items-center gap-2">
              <Utensils className="h-4 w-4 shrink-0" />
              <span>Ingredients & Quantities</span>
            </div>
            <span className="text-[11px] text-muted-foreground font-medium">
              Full ingredient names & amounts (e.g. 100g, 2 pcs, 1 cup)
            </span>
          </div>

          <div className="space-y-3">
            {ingredients.map((ing, idx) => (
              <div
                key={ing.id}
                className="group relative rounded-[20px] border border-border/80 bg-card/40 p-3 sm:p-3.5 shadow-sm hover:border-primary/40 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200"
              >
                {/* Responsive Layout:
                    On Mobile (< sm):
                    Two spacious rows:
                    Row 1: [Index Badge] + [Ingredient Name Input (Full width, min-w-0)]
                    Row 2: [Quantity Input (flex-1)] + [Delete Button]
                    
                    On Tablet/Desktop (sm: and up):
                    One horizontal row:
                    [Badge] + [Ingredient Name Input (~60-65% width)] + [Quantity Input (~25-30% width)] + [Delete Button]
                */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3">
                  {/* INGREDIENT NAME FIELD */}
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <span className="grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-xl bg-emerald-500/15 text-xs sm:text-sm font-black text-primary shrink-0 shadow-xs">
                      {idx + 1}
                    </span>

                    <div className="relative flex-1 min-w-0">
                      <input
                        value={ing.name}
                        onChange={(e) => updateIngredient(ing.id, "name", e.target.value)}
                        placeholder="Ingredient Name (e.g. Paneer / Cottage Cheese)"
                        title={ing.name || "Ingredient Name"}
                        className="w-full rounded-xl border border-border/70 bg-background/90 px-3.5 py-2.5 text-xs sm:text-sm font-semibold outline-none focus:border-primary focus:bg-background text-foreground placeholder:text-muted-foreground/60 transition-all"
                      />
                    </div>
                  </div>

                  {/* QUANTITY FIELD + DELETE BUTTON */}
                  <div className="flex items-center gap-2 pl-9 sm:pl-0 sm:w-auto">
                    <div className="relative flex-1 sm:w-36 md:w-44 shrink-0">
                      <input
                        value={ing.amount}
                        onChange={(e) => updateIngredient(ing.id, "amount", e.target.value)}
                        placeholder="Quantity (e.g. 100g, 2 pcs)"
                        title={ing.amount || "Quantity"}
                        className="w-full rounded-xl border border-border/70 bg-background/90 px-3.5 py-2.5 text-xs sm:text-sm font-semibold outline-none focus:border-primary focus:bg-background text-foreground placeholder:text-muted-foreground/60 transition-all"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeIngredientRow(ing.id)}
                      className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 active:scale-95 transition-all shrink-0 cursor-pointer"
                      title="Remove ingredient"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={addIngredientRow}
              className="inline-flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-primary hover:bg-primary/20 active:scale-95 transition-all cursor-pointer shadow-sm"
            >
              <Plus className="h-4 w-4" /> Add Another Ingredient
            </button>
          </div>
        </div>

        {/* Analyze Button */}
        <div className="pt-3 border-t border-border/60">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="flex w-full items-center justify-center gap-2 rounded-[20px] bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 px-6 py-3.5 text-sm font-extrabold text-slate-950 shadow-[0_0_25px_rgba(0,229,143,0.35)] hover:brightness-110 active:scale-95 transition-all duration-300 disabled:opacity-50 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Analyzing Ingredients...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-slate-950 animate-pulse" /> Analyze Ingredients &
                Calculate Macros/Micros
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analyzed Nutrition Output (Macros & Micros) */}
      {analyzedResult && (
        <div className="rounded-[24px] border border-emerald-500/30 bg-card/70 backdrop-blur-xl p-6 shadow-[0_0_30px_rgba(0,229,143,0.15)] space-y-6 animate-in slide-in-from-bottom-4 duration-300">
          {/* Header Badge */}
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
              <div>
                <h3 className="font-display text-base font-extrabold text-foreground">
                  Calculated Nutrition Breakdown
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Serving: {analyzedResult.serving} (~{analyzedResult.totalGrams}g total weight)
                </p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-extrabold text-primary">
              Verified
            </span>
          </div>

          {/* Hero Calories Banner */}
          <div className="rounded-[20px] border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-500/20 text-amber-400 font-extrabold border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Flame className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                  Total Energy
                </div>
                <div className="font-display text-3xl font-extrabold text-foreground tabular-nums">
                  {analyzedResult.calories}{" "}
                  <span className="text-sm font-bold text-muted-foreground">kcal</span>
                </div>
              </div>
            </div>
            <div className="text-right text-xs text-muted-foreground font-semibold">
              Ready to Log
            </div>
          </div>

          {/* Macronutrients Grid */}
          <div className="space-y-2">
            <div className="text-xs font-extrabold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5" /> Calculated Macronutrients
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              <div className="rounded-[18px] border border-emerald-500/30 bg-emerald-500/10 p-3 text-center shadow-md">
                <div className="flex items-center justify-center gap-1 text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider">
                  <Beef className="h-3 w-3" /> Protein
                </div>
                <div className="font-display text-xl font-extrabold text-emerald-400 tabular-nums mt-0.5">
                  {analyzedResult.protein_g}g
                </div>
              </div>

              <div className="rounded-[18px] border border-blue-500/30 bg-blue-500/10 p-3 text-center shadow-md">
                <div className="flex items-center justify-center gap-1 text-[10px] font-extrabold text-blue-400 uppercase tracking-wider">
                  <Wheat className="h-3 w-3" /> Carbs
                </div>
                <div className="font-display text-xl font-extrabold text-blue-400 tabular-nums mt-0.5">
                  {analyzedResult.carbs_g}g
                </div>
              </div>

              <div className="rounded-[18px] border border-purple-500/30 bg-purple-500/10 p-3 text-center shadow-md">
                <div className="flex items-center justify-center gap-1 text-[10px] font-extrabold text-purple-400 uppercase tracking-wider">
                  <Droplet className="h-3 w-3" /> Fat
                </div>
                <div className="font-display text-xl font-extrabold text-purple-400 tabular-nums mt-0.5">
                  {analyzedResult.fat_g}g
                </div>
              </div>

              <div className="rounded-[18px] border border-teal-500/30 bg-teal-500/10 p-3 text-center shadow-md">
                <div className="flex items-center justify-center gap-1 text-[10px] font-extrabold text-teal-400 uppercase tracking-wider">
                  <Leaf className="h-3 w-3" /> Fiber
                </div>
                <div className="font-display text-xl font-extrabold text-teal-400 tabular-nums mt-0.5">
                  {analyzedResult.fiber_g}g
                </div>
              </div>

              <div className="rounded-[18px] border border-rose-500/30 bg-rose-500/10 p-3 text-center col-span-2 sm:col-span-1 shadow-md">
                <div className="text-[10px] font-extrabold text-rose-400 uppercase tracking-wider">
                  Sugar
                </div>
                <div className="font-display text-xl font-extrabold text-rose-400 tabular-nums mt-0.5">
                  {analyzedResult.sugar_g}g
                </div>
              </div>
            </div>
          </div>

          {/* Key Micronutrients Section */}
          <div className="space-y-2 pt-2 border-t border-border/60">
            <div className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Key Micronutrients Quantity
            </div>
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-3 text-xs">
              <div className="rounded-[16px] bg-card/80 border border-border/70 p-2.5">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                  Sodium
                </span>
                <span className="font-extrabold text-foreground">
                  {analyzedResult.sodium_mg} mg
                </span>
              </div>

              <div className="rounded-[16px] bg-card/80 border border-border/70 p-2.5">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                  Iron
                </span>
                <span className="font-extrabold text-foreground">{analyzedResult.iron_mg} mg</span>
              </div>

              <div className="rounded-[16px] bg-card/80 border border-border/70 p-2.5">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                  Calcium
                </span>
                <span className="font-extrabold text-foreground">
                  {analyzedResult.calcium_mg} mg
                </span>
              </div>

              <div className="rounded-[16px] bg-card/80 border border-border/70 p-2.5">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                  Potassium
                </span>
                <span className="font-extrabold text-foreground">
                  {analyzedResult.potassium_mg} mg
                </span>
              </div>

              <div className="rounded-[16px] bg-card/80 border border-border/70 p-2.5">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                  Magnesium
                </span>
                <span className="font-extrabold text-foreground">
                  {analyzedResult.magnesium_mg} mg
                </span>
              </div>

              <div className="rounded-[16px] bg-card/80 border border-border/70 p-2.5">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                  Vit A / Vit B12
                </span>
                <span className="font-extrabold text-foreground">
                  {analyzedResult.vit_a_ug}µg / {analyzedResult.vit_b12_ug}µg
                </span>
              </div>
            </div>
          </div>

          {/* Itemized Per-Ingredient Macro Breakdown Table */}
          {analyzedResult.ingredientBreakdown && analyzedResult.ingredientBreakdown.length > 0 && (
            <div className="space-y-2.5 pt-3 border-t border-border/60">
              <div className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Info className="h-4 w-4 text-primary shrink-0" /> Itemized Ingredient Macros
                Breakdown
              </div>

              <div className="rounded-[20px] border border-border/80 bg-background/60 overflow-hidden text-xs sm:text-sm shadow-xs">
                {/* Desktop/Tablet Header */}
                <div className="hidden sm:grid grid-cols-12 bg-muted/40 px-4 py-3 font-extrabold text-muted-foreground text-[10px] uppercase tracking-wider border-b border-border/60">
                  <div className="col-span-6">Ingredient & Portion</div>
                  <div className="col-span-2 text-right">Calories</div>
                  <div className="col-span-2 text-right">Protein</div>
                  <div className="col-span-2 text-right">Carbs / Fat</div>
                </div>

                <div className="divide-y divide-border/60">
                  {analyzedResult.ingredientBreakdown.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 sm:px-4 sm:py-3 font-semibold text-foreground hover:bg-card/50 transition-colors"
                    >
                      {/* Mobile View: Stacked, full ingredient name visible */}
                      <div className="flex flex-col sm:hidden gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-extrabold text-foreground text-xs leading-snug break-words">
                            {item.name}
                            <span className="ml-1.5 inline-block text-[11px] font-semibold text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                              {item.amount}
                            </span>
                          </div>
                          <span className="font-black text-amber-500 text-xs shrink-0 bg-amber-500/10 px-2 py-0.5 rounded-md">
                            {item.calories} kcal
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] pt-1 border-t border-border/40 font-medium text-muted-foreground">
                          <span className="text-emerald-400 font-extrabold">
                            Protein: {item.protein_g}g
                          </span>
                          <span>•</span>
                          <span>Carbs: {item.carbs_g}g</span>
                          <span>•</span>
                          <span>Fat: {item.fat_g}g</span>
                        </div>
                      </div>

                      {/* Desktop / Tablet View */}
                      <div className="hidden sm:grid grid-cols-12 items-center">
                        <div className="col-span-6 break-words pr-3">
                          <span className="font-extrabold text-foreground">{item.name}</span>{" "}
                          <span className="text-xs text-muted-foreground font-normal bg-muted/50 px-2 py-0.5 rounded-md ml-1 inline-block">
                            {item.amount}
                          </span>
                        </div>
                        <div className="col-span-2 text-right font-black text-amber-400">
                          {item.calories} kcal
                        </div>
                        <div className="col-span-2 text-right font-black text-emerald-400">
                          {item.protein_g}g
                        </div>
                        <div className="col-span-2 text-right text-xs text-muted-foreground font-mono">
                          {item.carbs_g}g / {item.fat_g}g
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manual Review / Fine-Tuning Input Fields */}
      <div className="rounded-[24px] border border-border/80 bg-card/60 backdrop-blur-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-2">
          <div className="text-xs font-extrabold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <Calculator className="h-4 w-4 text-primary" /> Meal Macro Values (Editable)
          </div>
          <span className="text-[11px] text-muted-foreground">
            Auto-calculated. Adjust manually if needed.
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {(
            [
              { key: "calories", label: "Calories (kcal)", color: "text-amber-400" },
              { key: "protein_g", label: "Protein (g)", color: "text-emerald-400" },
              { key: "carbs_g", label: "Carbs (g)", color: "text-blue-400" },
              { key: "fat_g", label: "Fat (g)", color: "text-purple-400" },
              { key: "fiber_g", label: "Fiber (g)", color: "text-teal-400" },
              { key: "sugar_g", label: "Sugar (g)", color: "text-rose-400" },
            ] as const
          ).map(({ key, label, color }) => (
            <label key={key} className="block">
              <div className={`mb-1 text-[10px] uppercase font-extrabold tracking-wider ${color}`}>
                {label}
              </div>
              <input
                type="number"
                step="0.1"
                value={f[key]}
                onChange={(e) => setF({ ...f, [key]: Number(e.target.value) })}
                className="w-full rounded-[14px] border border-border/80 bg-background/80 px-3 py-2.5 text-sm font-extrabold outline-none focus:border-primary text-foreground tabular-nums"
              />
            </label>
          ))}
        </div>

        {/* Editable Micronutrients Grid */}
        <div className="pt-3 border-t border-border/60 space-y-2.5">
          <div className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> Key Micronutrients (Editable)
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {(
              [
                { key: "sodium_mg", label: "Sodium (mg)", color: "text-cyan-400" },
                { key: "potassium_mg", label: "Potassium (mg)", color: "text-sky-400" },
                { key: "calcium_mg", label: "Calcium (mg)", color: "text-indigo-400" },
                { key: "iron_mg", label: "Iron (mg)", color: "text-amber-400" },
                { key: "magnesium_mg", label: "Magnesium (mg)", color: "text-emerald-400" },
                { key: "vit_a_ug", label: "Vit A (µg)", color: "text-orange-400" },
                { key: "vit_b12_ug", label: "Vit B12 (µg)", color: "text-violet-400" },
                { key: "vit_d_ug", label: "Vit D (µg)", color: "text-yellow-400" },
              ] as const
            ).map(({ key, label, color }) => (
              <label key={key} className="block">
                <div className={`mb-1 text-[10px] uppercase font-bold tracking-wider ${color}`}>
                  {label}
                </div>
                <input
                  type="number"
                  step="0.1"
                  value={f[key]}
                  onChange={(e) => setF({ ...f, [key]: Number(e.target.value) })}
                  className="w-full rounded-[12px] border border-border/70 bg-background/70 px-2.5 py-2 text-xs font-bold outline-none focus:border-cyan-400 text-foreground tabular-nums"
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Submit / Log Meal Button */}
      <button
        type="button"
        onClick={() => save.mutate()}
        disabled={save.isPending || !f.name || !f.calories}
        className="flex w-full items-center justify-center gap-2 rounded-[20px] bg-primary px-6 py-4 text-base font-extrabold text-primary-foreground shadow-[0_0_25px_rgba(0,229,143,0.3)] hover:brightness-110 active:scale-95 transition-all duration-300 disabled:opacity-50 cursor-pointer"
      >
        {save.isPending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Utensils className="h-5 w-5 text-slate-950" />
        )}
        Log Meal to Daily Tracker
      </button>
    </div>
  );
}
