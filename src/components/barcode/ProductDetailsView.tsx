import { useState } from "react";
import { FullProductAnalysis } from "@/types/barcode";
import { LocalStore } from "@/lib/local-store";
import { getLocalDateString } from "@/lib/date-utils";
import { toast } from "sonner";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Flame,
  ShieldAlert,
  Leaf,
  Plus,
  Scale,
  Award,
  Globe,
  Tag,
  ThumbsUp,
  Heart,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

interface ProductDetailsViewProps {
  product: FullProductAnalysis;
  onBack: () => void;
  onLogged?: () => void;
}

const PORTION_PRESETS = [25, 50, 75, 100, 150, 200, 250];

export function ProductDetailsView({ product, onBack, onLogged }: ProductDetailsViewProps) {
  const baseGrams = product.baseServingGrams || 100;
  const [selectedGrams, setSelectedGrams] = useState<number>(baseGrams);
  const [nutritionTab, setNutritionTab] = useState<"portion" | "per100g">("portion");

  const scale = selectedGrams / 100;

  // Scaled values for portion calculator with safe guards
  const calcNutrient = (per100g: number | undefined, decimals = 1) => {
    const val = (per100g ?? 0) * scale;
    const factor = Math.pow(10, decimals);
    return decimals === 0 ? Math.round(val) : Math.round(val * factor) / factor;
  };

  const currentCalories = calcNutrient(product.nutrition?.calories?.per100g, 0);
  const currentProtein = calcNutrient(product.nutrition?.protein?.per100g, 1);
  const currentCarbs = calcNutrient(product.nutrition?.carbs?.per100g, 1);
  const currentFat = calcNutrient(product.nutrition?.fat?.per100g, 1);
  const currentSugar = calcNutrient(product.nutrition?.sugar?.per100g, 1);
  const currentFiber = calcNutrient(product.nutrition?.fiber?.per100g, 1);
  const currentSodium = calcNutrient(product.nutrition?.sodium?.per100g, 0);
  const currentPotassium = calcNutrient(product.nutrition?.potassium?.per100g, 0);
  const currentCalcium = calcNutrient(product.nutrition?.calcium?.per100g, 0);
  const currentIron = calcNutrient(product.nutrition?.iron?.per100g, 1);
  const currentVitA = calcNutrient(product.nutrition?.vitaminA?.per100g, 0);
  const currentVitC = calcNutrient(product.nutrition?.vitaminC?.per100g, 1);
  const currentVitD = calcNutrient(product.nutrition?.vitaminD?.per100g, 1);
  const currentVitB12 = calcNutrient(product.nutrition?.vitaminB12?.per100g, 1);

  // Health Score Color
  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case "A+":
      case "A":
        return "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
      case "B":
        return "bg-lime-500/15 text-lime-500 border-lime-500/30";
      case "C":
        return "bg-amber-500/15 text-amber-500 border-amber-500/30";
      case "D":
        return "bg-orange-500/15 text-orange-500 border-orange-500/30";
      default:
        return "bg-rose-500/15 text-rose-500 border-rose-500/30";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "Safe":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />;
      case "Moderate":
        return <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />;
      default:
        return <XCircle className="h-4 w-4 text-rose-500 shrink-0" />;
    }
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case "Safe":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/30";
      case "Moderate":
        return "bg-amber-500/10 text-amber-500 border-amber-500/30";
      default:
        return "bg-rose-500/10 text-rose-500 border-rose-500/30";
    }
  };

  const handleLogMeal = () => {
    const eatenOn = getLocalDateString();
    const eatenAt = new Date().toISOString();

    LocalStore.addMeal({
      eaten_at: eatenAt,
      eaten_on: eatenOn,
      name: `${product.productName} (${selectedGrams}g)`,
      source: "barcode",
      serving_desc: `${selectedGrams}g portion - Barcode: ${product.barcode}`,
      calories: currentCalories,
      protein_g: currentProtein,
      carbs_g: currentCarbs,
      fat_g: currentFat,
      sugar_g: currentSugar,
      fiber_g: currentFiber,
      sodium_mg: currentSodium,
      potassium_mg: currentPotassium,
      calcium_mg: currentCalcium,
      iron_mg: currentIron,
      vit_a_ug: currentVitA,
      vit_d_ug: currentVitD,
      vit_b12_ug: currentVitB12,
      confidence: 0.98,
    });

    toast.success(`Logged ${product.productName} (${currentCalories} kcal) to daily food log!`);
    if (onLogged) onLogged();
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-3 duration-300">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-[18px] border border-border/80 bg-card/80 backdrop-blur-md px-4 py-2.5 text-xs font-bold text-foreground shadow-sm hover:bg-muted active:scale-95 transition"
        >
          <ArrowLeft className="h-4 w-4 text-primary" /> Scan Another Item
        </button>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary/10 px-3.5 py-1 text-[11px] font-mono font-bold text-primary border border-primary/20">
            {product.barcodeType}: {product.barcode}
          </span>
        </div>
      </div>

      {/* Main Hero Summary Card */}
      <div className="relative overflow-hidden rounded-[22px] border border-border/80 bg-card/80 backdrop-blur-xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {product.imageUrl ? (
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-[20px] bg-muted border border-border/60 shadow-lg">
              <img
                src={product.imageUrl}
                alt={product.productName}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="grid h-32 w-32 shrink-0 place-items-center rounded-[20px] bg-gradient-to-br from-primary/10 to-emerald-500/5 border border-primary/20 text-primary">
              <Flame className="h-10 w-10 text-primary animate-pulse" />
            </div>
          )}

          <div className="space-y-2.5 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-extrabold text-primary uppercase tracking-widest">
                {product.brand}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground flex items-center gap-1">
                <Globe className="h-3 w-3 text-primary" /> {product.countryOfOrigin}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground flex items-center gap-1">
                <Tag className="h-3 w-3" /> {product.category}
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-extrabold leading-tight text-foreground tracking-tight">
              {product.productName}
            </h2>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 font-display text-xs font-bold shadow-sm ${getGradeBadge(
                  product.healthGrade,
                )}`}
              >
                <Award className="h-4 w-4" /> Grade {product.healthGrade} ({product.healthScore}
                /100)
              </span>

              {product.isVeg ? (
                <span className="inline-flex items-center gap-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-400">
                  <Leaf className="h-3.5 w-3.5" /> Vegetarian
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-xl border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-[11px] font-bold text-rose-400">
                  Non-Veg
                </span>
              )}

              {product.isOrganic && (
                <span className="inline-flex items-center gap-1 rounded-xl border border-lime-500/30 bg-lime-500/10 px-2.5 py-1 text-[11px] font-bold text-lime-400">
                  Organic
                </span>
              )}

              {product.dietaryBadges?.map((badge, idx) => (
                <span
                  key={idx}
                  className="rounded-xl border border-border/80 bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendation Banner */}
        <div className="rounded-[18px] border border-primary/30 bg-primary/10 p-4 space-y-1.5 text-sm shadow-[0_0_20px_rgba(0,229,143,0.15)]">
          <div className="flex items-center gap-2 font-display text-xs font-extrabold uppercase tracking-wider text-primary">
            <Sparkles className="h-4 w-4" /> Nutritionist Verdict
          </div>
          <p className="text-xs sm:text-sm font-medium text-foreground leading-relaxed">
            {product.aiRecommendation}
          </p>
        </div>
      </div>

      {/* Portion Calculator & Interactive Scale */}
      <div className="rounded-[22px] border border-border/80 bg-card/80 backdrop-blur-xl p-6 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-extrabold text-foreground flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" /> Portion Calculator
            </h3>
            <p className="text-xs text-muted-foreground">
              Adjust portion weight to automatically recalculate calories & nutrients
            </p>
          </div>

          <div className="flex items-center rounded-2xl bg-muted/50 p-1 border border-border/80 shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setNutritionTab("portion")}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                nutritionTab === "portion"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              Calculated ({selectedGrams}g)
            </button>
            <button
              onClick={() => setNutritionTab("per100g")}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                nutritionTab === "per100g"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              Standard Per 100g
            </button>
          </div>
        </div>

        {/* Presets buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {PORTION_PRESETS.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGrams(g)}
              className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${
                selectedGrams === g
                  ? "bg-primary text-primary-foreground border-primary shadow-[0_0_12px_rgba(0,229,143,0.3)]"
                  : "border-border/80 bg-background/80 text-muted-foreground hover:bg-muted"
              }`}
            >
              {g}g
            </button>
          ))}
          <div className="flex items-center gap-2 border-l border-border/80 pl-3 ml-1">
            <input
              type="number"
              value={selectedGrams}
              onChange={(e) => setSelectedGrams(Math.max(1, Number(e.target.value) || 1))}
              className="w-16 rounded-xl border border-border/80 bg-background px-2.5 py-1 text-xs font-mono font-bold text-foreground outline-none focus:border-primary"
            />
            <span className="text-xs text-muted-foreground font-semibold">grams</span>
          </div>
        </div>

        {/* Dynamic Computed Key Macros Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="rounded-[18px] border border-border/80 bg-muted/20 p-4 text-center">
            <div className="text-xs font-bold text-muted-foreground flex items-center justify-center gap-1">
              <Flame className="h-3.5 w-3.5 text-amber-500" /> Calories
            </div>
            <div className="font-display text-2xl font-extrabold text-foreground mt-1">
              {nutritionTab === "portion" ? currentCalories : product.nutrition.calories.per100g}
            </div>
            <div className="text-[10px] text-muted-foreground font-mono">kcal</div>
          </div>

          <div className="rounded-[18px] border border-border/80 bg-muted/20 p-4 text-center">
            <div className="text-xs font-bold text-muted-foreground">Protein</div>
            <div className="font-display text-2xl font-extrabold text-rose-400 mt-1">
              {nutritionTab === "portion" ? currentProtein : product.nutrition.protein.per100g}g
            </div>
            <div className="text-[10px] text-muted-foreground font-mono">muscle synthesis</div>
          </div>

          <div className="rounded-[18px] border border-border/80 bg-muted/20 p-4 text-center">
            <div className="text-xs font-bold text-muted-foreground">Carbs / Sugar</div>
            <div className="font-display text-2xl font-extrabold text-amber-400 mt-1">
              {nutritionTab === "portion" ? currentCarbs : product.nutrition.carbs.per100g}g
            </div>
            <div className="text-[10px] text-muted-foreground font-mono">
              ({nutritionTab === "portion" ? currentSugar : product.nutrition.sugar.per100g}g sugar)
            </div>
          </div>

          <div className="rounded-[18px] border border-border/80 bg-muted/20 p-4 text-center">
            <div className="text-xs font-bold text-muted-foreground">Fat / Sodium</div>
            <div className="font-display text-2xl font-extrabold text-emerald-400 mt-1">
              {nutritionTab === "portion" ? currentFat : product.nutrition.fat.per100g}g
            </div>
            <div className="text-[10px] text-muted-foreground font-mono">
              ({nutritionTab === "portion" ? currentSodium : product.nutrition.sodium.per100g}mg
              sodium)
            </div>
          </div>
        </div>

        {/* Log Meal CTA */}
        <button
          onClick={handleLogMeal}
          className="w-full flex items-center justify-center gap-2 rounded-[18px] bg-primary px-6 py-4 font-display text-sm font-extrabold text-primary-foreground shadow-[0_0_25px_rgba(0,229,143,0.35)] hover:opacity-95 active:scale-[0.98] transition"
        >
          <Plus className="h-5 w-5" /> Log {product.productName} ({currentCalories} kcal) to Meal
          Log
        </button>
      </div>

      {/* Complete Nutrition Panel */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-4">
        <h3 className="font-display text-lg font-bold text-foreground">Complete Nutrition Panel</h3>
        <p className="text-xs text-muted-foreground">
          Detailed Breakdown per 100g and per serving ({product.servingSize || "1 portion"})
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/80 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <th className="py-2.5">Nutrient</th>
                <th className="py-2.5 text-right">Per 100g</th>
                <th className="py-2.5 text-right">Per Serving</th>
                <th className="py-2.5 text-right">Unit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-foreground text-xs font-medium">
              {Object.entries(product.nutrition).map(([key, info]) => {
                if (!info) return null;
                const formattedName = key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase());
                return (
                  <tr key={key} className="hover:bg-muted/30 transition">
                    <td className="py-2.5 capitalize font-semibold">{formattedName}</td>
                    <td className="py-2.5 text-right font-mono text-muted-foreground">
                      {info.per100g}
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold text-foreground">
                      {info.perServing}
                    </td>
                    <td className="py-2.5 text-right text-muted-foreground">{info.unit}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Health Analysis Narrative */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-3">
        <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-400" /> Health Analysis
        </h3>
        <p className="text-sm text-foreground leading-relaxed bg-muted/20 border border-border/60 rounded-2xl p-4">
          {product.aiHealthAnalysisText}
        </p>
      </div>

      {/* Ingredient Safety Analysis */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-rose-500" /> Ingredient Analysis & Risk Highlights
          </h3>
          <span className="text-xs text-muted-foreground font-mono">
            {product.ingredientsList?.length || 0} Ingredients Detected
          </span>
        </div>

        {product.ingredientRisks && product.ingredientRisks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {product.ingredientRisks.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-foreground flex items-center gap-2">
                    {getRiskIcon(item.riskLevel)} {item.name}
                  </span>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getRiskBadgeColor(item.riskLevel)}`}
                  >
                    {item.riskLevel}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-normal">{item.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            No harmful additives or high-risk artificial ingredients flagged.
          </p>
        )}

        {product.ingredientsList && product.ingredientsList.length > 0 && (
          <div className="pt-2">
            <div className="text-xs font-bold text-muted-foreground mb-1">
              Full Ingredients List:
            </div>
            <p className="text-xs text-muted-foreground/80 leading-relaxed bg-background p-3 rounded-xl border border-border/60">
              {product.ingredientsList.join(", ")}
            </p>
          </div>
        )}
      </div>

      {/* Personalized Profile Analysis */}
      {product.personalizedAnalysis && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-4">
          <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
            <ThumbsUp className="h-5 w-5 text-emerald-500" /> Personalized Profile Suitability
          </h3>
          <p className="text-xs text-muted-foreground">
            Evaluated against your active physical profile and dietary goals
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(product.personalizedAnalysis).map(([key, val]) => {
              if (!val) return null;
              const titleMap: Record<string, string> = {
                weightLoss: "Weight Loss Goal",
                muscleGain: "Muscle Building Goal",
                diabetes: "Blood Sugar & Diabetes Fit",
                heartHealth: "Cardiovascular Health",
                children: "Child Friendly",
                elderly: "Elderly Digestion Fit",
                dailyUse: "Daily Meal Plan Suitable",
              };
              return (
                <div
                  key={key}
                  className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-foreground">
                      {titleMap[key] || key}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        val.suitable
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-rose-500/10 text-rose-500"
                      }`}
                    >
                      {val.suitable ? "Suitable" : "Limit / Avoid"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{val.reason}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Healthier Alternatives */}
      {product.alternatives && product.alternatives.length > 0 && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-4">
          <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" /> Healthier Alternatives
          </h3>
          <p className="text-xs text-muted-foreground">
            Swap with higher rated options for better nutrition
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {product.alternatives.map((alt, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-background p-4 space-y-2 hover:border-primary/40 transition shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-primary">
                      {alt.brand}
                    </span>
                    <h4 className="font-bold text-sm text-foreground">{alt.name}</h4>
                  </div>
                  <span className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-500">
                    Score {alt.healthScore}/100
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
                  <span>{alt.calories} kcal</span>
                  <span>•</span>
                  <span>{alt.protein}g protein</span>
                  <span>•</span>
                  <span>{alt.estimatedPrice}</span>
                </div>

                <p className="text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-xl border border-border/40">
                  {alt.whyBetter}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
