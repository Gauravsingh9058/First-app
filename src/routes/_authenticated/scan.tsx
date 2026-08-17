import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { logMeal } from "@/lib/meals.functions";
import { LocalStore } from "@/lib/local-store";
import { getLocalDateString } from "@/lib/date-utils";
import { useRef, useState } from "react";
import {
  Camera,
  Upload,
  Loader2,
  Sparkles,
  X,
  Barcode,
  UtensilsCrossed,
  Plus,
  Minus,
  Trash2,
  Edit3,
  RotateCcw,
  Check,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { BarcodeScannerContainer } from "@/components/barcode/BarcodeScannerContainer";

export const Route = createFileRoute("/_authenticated/scan")({
  head: () => ({ meta: [{ title: "Scan — NutriLens" }] }),
  component: ScanPage,
});

export interface MealComponentItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g?: number;
  sugar_g?: number;
  sodium_mg?: number;
  iron_mg?: number;
  calcium_mg?: number;
  magnesium_mg?: number;
  potassium_mg?: number;
  vit_a_ug?: number;
  vit_b12_ug?: number;
  vit_d_ug?: number;
  omega3_g?: number;
  baseGrams: number;
  baseCalories: number;
  baseProtein: number;
  baseCarbs: number;
  baseFat: number;
  isCustom?: boolean;
}

interface ScanResult {
  name: string;
  confidence: number;
  serving: string;
  estimated_grams?: number;
  diet_type?: "VEGETARIAN" | "NON_VEGETARIAN";
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
  components?: Array<{
    name: string;
    quantity: number;
    unit?: string;
    calories?: number;
    protein_g?: number;
    carbs_g?: number;
    fat_g?: number;
    fiber_g?: number;
    sugar_g?: number;
    sodium_mg?: number;
    iron_mg?: number;
    calcium_mg?: number;
    magnesium_mg?: number;
    potassium_mg?: number;
    vit_a_ug?: number;
    vit_b12_ug?: number;
    vit_d_ug?: number;
    omega3_g?: number;
  }>;
  raw?: unknown;
}

async function compressImage(file: File, maxDimension = 1024, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => resolve(reader.result as string);
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });
}

function ScanPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [scanMode, setScanMode] = useState<"barcode" | "photo">("barcode");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [baseResult, setBaseResult] = useState<ScanResult | null>(null);
  const [grams, setGrams] = useState<number>(200);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Ingredient customization states
  const [componentsList, setComponentsList] = useState<MealComponentItem[]>([]);
  const [isCustomizingIngredients, setIsCustomizingIngredients] = useState(false);
  const [isReanalyzingAI, setIsReanalyzingAI] = useState(false);
  const [isCustomized, setIsCustomized] = useState(false);
  const [newIngName, setNewIngName] = useState("");
  const [newIngQty, setNewIngQty] = useState(50);
  const [newIngUnit, setNewIngUnit] = useState("g");

  const logMealFn = useServerFn(logMeal);

  const syncTotalsFromComponents = (list: MealComponentItem[]) => {
    setIsCustomized(true);
    if (!result) return;
    if (list.length === 0) {
      setResult((prev) =>
        prev
          ? {
              ...prev,
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
              estimated_grams: 0,
              components: [],
            }
          : null,
      );
      setGrams(0);
      return;
    }

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalFiber = 0;
    let totalSugar = 0;
    let totalSodium = 0;
    let totalIron = 0;
    let totalCalcium = 0;
    let totalMagnesium = 0;
    let totalPotassium = 0;
    let totalVitA = 0;
    let totalVitB12 = 0;
    let totalVitD = 0;
    let totalOmega3 = 0;
    let totalWeightG = 0;

    for (const c of list) {
      totalCalories += c.calories || 0;
      totalProtein += c.protein_g || 0;
      totalCarbs += c.carbs_g || 0;
      totalFat += c.fat_g || 0;
      totalFiber += c.fiber_g || 0;
      totalSugar += c.sugar_g || 0;
      totalSodium += c.sodium_mg || 0;
      totalIron += c.iron_mg || 0;
      totalCalcium += c.calcium_mg || 0;
      totalMagnesium += c.magnesium_mg || 0;
      totalPotassium += c.potassium_mg || 0;
      totalVitA += c.vit_a_ug || 0;
      totalVitB12 += c.vit_b12_ug || 0;
      totalVitD += c.vit_d_ug || 0;
      totalOmega3 += c.omega3_g || 0;

      const gMultiplier =
        c.unit === "kg"
          ? 1000
          : c.unit === "tbsp"
            ? 15
            : c.unit === "tsp"
              ? 5
              : c.unit === "cup"
                ? 180
                : 1;
      totalWeightG += Math.round((c.quantity || 0) * gMultiplier);
    }

    totalProtein = Math.round(totalProtein * 10) / 10;
    totalCarbs = Math.round(totalCarbs * 10) / 10;
    totalFat = Math.round(totalFat * 10) / 10;
    totalFiber = Math.round(totalFiber * 10) / 10;
    totalSugar = Math.round(totalSugar * 10) / 10;
    totalSodium = Math.round(totalSodium);
    totalIron = Math.round(totalIron * 10) / 10;
    totalCalcium = Math.round(totalCalcium);
    totalMagnesium = Math.round(totalMagnesium);
    totalPotassium = Math.round(totalPotassium);
    totalVitA = Math.round(totalVitA);
    totalVitB12 = Math.round(totalVitB12 * 10) / 10;
    totalVitD = Math.round(totalVitD * 10) / 10;
    totalOmega3 = Math.round(totalOmega3 * 100) / 100;

    if (totalCalories <= 0) {
      totalCalories = Math.round(totalProtein * 4 + totalCarbs * 4 + totalFat * 9);
    }

    setGrams(totalWeightG);
    setResult((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        estimated_grams: totalWeightG,
        calories: totalCalories,
        protein_g: totalProtein,
        carbs_g: totalCarbs,
        fat_g: totalFat,
        fiber_g: totalFiber,
        sugar_g: totalSugar,
        sodium_mg: totalSodium,
        iron_mg: totalIron,
        calcium_mg: totalCalcium,
        magnesium_mg: totalMagnesium,
        potassium_mg: totalPotassium,
        vit_a_ug: totalVitA,
        vit_b12_ug: totalVitB12,
        vit_d_ug: totalVitD,
        omega3_g: totalOmega3,
        components: list.map((c) => ({
          name: c.name,
          quantity: c.quantity,
          unit: c.unit,
          calories: c.calories,
          protein_g: c.protein_g,
          carbs_g: c.carbs_g,
          fat_g: c.fat_g,
          fiber_g: c.fiber_g,
          sugar_g: c.sugar_g,
          sodium_mg: c.sodium_mg,
          iron_mg: c.iron_mg,
          calcium_mg: c.calcium_mg,
          magnesium_mg: c.magnesium_mg,
          potassium_mg: c.potassium_mg,
          vit_a_ug: c.vit_a_ug,
          vit_b12_ug: c.vit_b12_ug,
          vit_d_ug: c.vit_d_ug,
          omega3_g: c.omega3_g,
        })),
      };
    });
  };

  const handleComponentQuantityChange = (id: string, newQty: number) => {
    const safeQty = Math.max(1, newQty);
    setComponentsList((prev) => {
      const next = prev.map((c) => {
        if (c.id !== id) return c;
        const baseG = c.baseGrams > 0 ? c.baseGrams : 50;
        const ratio = safeQty / baseG;
        return {
          ...c,
          quantity: safeQty,
          calories: Math.round((c.baseCalories || 0) * ratio),
          protein_g: Math.round((c.baseProtein || 0) * ratio * 10) / 10,
          carbs_g: Math.round((c.baseCarbs || 0) * ratio * 10) / 10,
          fat_g: Math.round((c.baseFat || 0) * ratio * 10) / 10,
          fiber_g: c.fiber_g ? Math.round(c.fiber_g * ratio * 10) / 10 : 0,
          sugar_g: c.sugar_g ? Math.round(c.sugar_g * ratio * 10) / 10 : 0,
          sodium_mg: c.sodium_mg ? Math.round(c.sodium_mg * ratio) : 0,
          iron_mg: c.iron_mg ? Math.round(c.iron_mg * ratio * 10) / 10 : 0,
          calcium_mg: c.calcium_mg ? Math.round(c.calcium_mg * ratio) : 0,
          magnesium_mg: c.magnesium_mg ? Math.round(c.magnesium_mg * ratio) : 0,
          potassium_mg: c.potassium_mg ? Math.round(c.potassium_mg * ratio) : 0,
        };
      });
      syncTotalsFromComponents(next);
      return next;
    });
  };

  const handleComponentNameChange = (id: string, newName: string) => {
    setIsCustomized(true);
    setComponentsList((prev) => prev.map((c) => (c.id === id ? { ...c, name: newName } : c)));
  };

  const handleComponentUnitChange = (id: string, newUnit: string) => {
    setIsCustomized(true);
    setComponentsList((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, unit: newUnit } : c));
      syncTotalsFromComponents(next);
      return next;
    });
  };

  const handleDeleteComponent = (id: string) => {
    setComponentsList((prev) => {
      const target = prev.find((c) => c.id === id);
      const next = prev.filter((c) => c.id !== id);
      syncTotalsFromComponents(next);
      if (target) {
        toast.info(`Removed ${target.name}`);
      }
      return next;
    });
  };

  const handleAddComponent = (name: string, quantity: number, unit = "g") => {
    if (!name.trim()) {
      toast.error("Please enter an ingredient name");
      return;
    }
    const safeQty = Math.max(1, quantity);
    const lower = name.toLowerCase();

    // Standard nutritional calibration per 100g
    let per100Cal = 120;
    let per100P = 4;
    let per100C = 15;
    let per100F = 3;
    let per100Fiber = 1.5;

    if (lower.includes("oil") || lower.includes("ghee") || lower.includes("butter")) {
      per100Cal = 884;
      per100P = 0;
      per100C = 0;
      per100F = 100;
      per100Fiber = 0;
    } else if (
      lower.includes("chicken") ||
      lower.includes("turkey") ||
      lower.includes("meat") ||
      lower.includes("fish") ||
      lower.includes("salmon")
    ) {
      per100Cal = 165;
      per100P = 31;
      per100C = 0;
      per100F = 3.6;
      per100Fiber = 0;
    } else if (lower.includes("egg")) {
      per100Cal = 143;
      per100P = 12.6;
      per100C = 0.8;
      per100F = 9.5;
      per100Fiber = 0;
    } else if (lower.includes("paneer") || lower.includes("cheese")) {
      per100Cal = 265;
      per100P = 18.3;
      per100C = 3;
      per100F = 20.8;
      per100Fiber = 0;
    } else if (lower.includes("rice")) {
      per100Cal = 130;
      per100P = 2.7;
      per100C = 28.2;
      per100F = 0.3;
      per100Fiber = 0.4;
    } else if (
      lower.includes("roti") ||
      lower.includes("bread") ||
      lower.includes("chapati") ||
      lower.includes("naan")
    ) {
      per100Cal = 260;
      per100P = 8;
      per100C = 50;
      per100F = 3;
      per100Fiber = 6;
    } else if (
      lower.includes("broccoli") ||
      lower.includes("spinach") ||
      lower.includes("salad") ||
      lower.includes("veggie") ||
      lower.includes("cucumber") ||
      lower.includes("tomato")
    ) {
      per100Cal = 35;
      per100P = 2.5;
      per100C = 6;
      per100F = 0.4;
      per100Fiber = 2.5;
    } else if (lower.includes("potato")) {
      per100Cal = 86;
      per100P = 1.6;
      per100C = 20;
      per100F = 0.1;
      per100Fiber = 2.2;
    } else if (
      lower.includes("dal") ||
      lower.includes("lentil") ||
      lower.includes("chickpea") ||
      lower.includes("chole") ||
      lower.includes("rajma")
    ) {
      per100Cal = 125;
      per100P = 8;
      per100C = 20;
      per100F = 1.5;
      per100Fiber = 5;
    } else if (lower.includes("curd") || lower.includes("yogurt") || lower.includes("dahi")) {
      per100Cal = 65;
      per100P = 3.5;
      per100C = 4.5;
      per100F = 3.5;
      per100Fiber = 0;
    }

    const gMultiplier =
      unit === "kg" ? 1000 : unit === "tbsp" ? 15 : unit === "tsp" ? 5 : unit === "cup" ? 180 : 1;
    const factor = (safeQty * gMultiplier) / 100;
    const cal = Math.round(per100Cal * factor);
    const p = Math.round(per100P * factor * 10) / 10;
    const c = Math.round(per100C * factor * 10) / 10;
    const f = Math.round(per100F * factor * 10) / 10;
    const fib = Math.round(per100Fiber * factor * 10) / 10;

    const newItem: MealComponentItem = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      quantity: safeQty,
      unit,
      calories: cal,
      protein_g: p,
      carbs_g: c,
      fat_g: f,
      fiber_g: fib,
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
      baseGrams: safeQty,
      baseCalories: cal,
      baseProtein: p,
      baseCarbs: c,
      baseFat: f,
      isCustom: true,
    };

    setComponentsList((prev) => {
      const next = [...prev, newItem];
      syncTotalsFromComponents(next);
      return next;
    });

    setNewIngName("");
    setNewIngQty(50);
    toast.success(`Added ${name.trim()} (${safeQty}${unit})`);
  };

  const handleReanalyzeWithAI = async () => {
    if (componentsList.length === 0) {
      toast.error("Add at least one ingredient to analyze");
      return;
    }
    try {
      setIsReanalyzingAI(true);
      const payload = {
        mealName: result?.name || "Custom Meal",
        ingredients: componentsList.map((c) => ({
          name: c.name,
          amount: `${c.quantity}${c.unit}`,
        })),
      };

      const res = await fetch("/api/analyze-ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`AI calculation failed (${res.status})`);
      }

      const aiData = (await res.json()) as {
        mealName?: string;
        serving?: string;
        totalGrams?: number;
        calories?: number;
        protein_g?: number;
        carbs_g?: number;
        fat_g?: number;
        fiber_g?: number;
        sugar_g?: number;
        sodium_mg?: number;
        iron_mg?: number;
        calcium_mg?: number;
        magnesium_mg?: number;
        potassium_mg?: number;
        vit_a_ug?: number;
        vit_b12_ug?: number;
        vit_d_ug?: number;
        omega3_g?: number;
        ingredientBreakdown?: Array<{
          name: string;
          amount?: string;
          calories?: number;
          protein_g?: number;
          carbs_g?: number;
          fat_g?: number;
        }>;
      };

      if (Array.isArray(aiData.ingredientBreakdown)) {
        setComponentsList((prev) => {
          const updated = prev.map((comp, idx) => {
            const matched =
              aiData.ingredientBreakdown?.[idx] ||
              aiData.ingredientBreakdown?.find((b) =>
                b.name?.toLowerCase().includes(comp.name.toLowerCase()),
              );
            if (matched) {
              const matchedCal = Number(matched.calories || comp.calories);
              const matchedP = Number(matched.protein_g || comp.protein_g);
              const matchedC = Number(matched.carbs_g || comp.carbs_g);
              const matchedF = Number(matched.fat_g || comp.fat_g);
              return {
                ...comp,
                calories: matchedCal,
                protein_g: matchedP,
                carbs_g: matchedC,
                fat_g: matchedF,
                baseCalories: matchedCal,
                baseProtein: matchedP,
                baseCarbs: matchedC,
                baseFat: matchedF,
              };
            }
            return comp;
          });
          return updated;
        });
      }

      setResult((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          calories: Number(aiData.calories || prev.calories),
          protein_g: Number(aiData.protein_g || prev.protein_g),
          carbs_g: Number(aiData.carbs_g || prev.carbs_g),
          fat_g: Number(aiData.fat_g || prev.fat_g),
          fiber_g: Number(aiData.fiber_g ?? prev.fiber_g),
          sugar_g: Number(aiData.sugar_g ?? prev.sugar_g),
          sodium_mg: Number(aiData.sodium_mg ?? prev.sodium_mg),
          iron_mg: Number(aiData.iron_mg ?? prev.iron_mg),
          calcium_mg: Number(aiData.calcium_mg ?? prev.calcium_mg),
          magnesium_mg: Number(aiData.magnesium_mg ?? prev.magnesium_mg),
          potassium_mg: Number(aiData.potassium_mg ?? prev.potassium_mg),
          vit_a_ug: Number(aiData.vit_a_ug ?? prev.vit_a_ug),
          vit_b12_ug: Number(aiData.vit_b12_ug ?? prev.vit_b12_ug),
          vit_d_ug: Number(aiData.vit_d_ug ?? prev.vit_d_ug),
          omega3_g: Number(aiData.omega3_g ?? prev.omega3_g),
          estimated_grams: Number(aiData.totalGrams || prev.estimated_grams),
        };
      });

      if (aiData.totalGrams) {
        setGrams(Number(aiData.totalGrams));
      }

      toast.success("✨ Re-analyzed with Gemini! Accurate macros and micronutrients loaded.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "AI re-analysis failed");
    } finally {
      setIsReanalyzingAI(false);
    }
  };

  const resetIngredientsToScan = () => {
    if (baseResult) {
      setResult(baseResult);
      setGrams(baseResult.estimated_grams || 200);
      const initialComponents: MealComponentItem[] = (baseResult.components || []).map(
        (comp, idx) => ({
          id: `comp-${idx}`,
          name: comp.name,
          quantity: comp.quantity || 50,
          unit: comp.unit || "g",
          calories: comp.calories || 0,
          protein_g: comp.protein_g || 0,
          carbs_g: comp.carbs_g || 0,
          fat_g: comp.fat_g || 0,
          fiber_g: comp.fiber_g || 0,
          sugar_g: comp.sugar_g || 0,
          sodium_mg: comp.sodium_mg || 0,
          iron_mg: comp.iron_mg || 0,
          calcium_mg: comp.calcium_mg || 0,
          magnesium_mg: comp.magnesium_mg || 0,
          potassium_mg: comp.potassium_mg || 0,
          vit_a_ug: comp.vit_a_ug || 0,
          vit_b12_ug: comp.vit_b12_ug || 0,
          vit_d_ug: comp.vit_d_ug || 0,
          omega3_g: comp.omega3_g || 0,
          baseGrams: comp.quantity || 50,
          baseCalories: comp.calories || 0,
          baseProtein: comp.protein_g || 0,
          baseCarbs: comp.carbs_g || 0,
          baseFat: comp.fat_g || 0,
        }),
      );
      setComponentsList(initialComponents);
      setIsCustomized(false);
      toast.info("Reset ingredients to original scan detection.");
    }
  };

  const handleGramsChange = (newGramsVal: number) => {
    const newGrams = Math.max(1, newGramsVal);
    if (baseResult) {
      const baseGrams = baseResult.estimated_grams || 200;
      const factor = newGrams / baseGrams;
      const p = Math.round((baseResult.protein_g || 0) * factor * 10) / 10;
      const c = Math.round((baseResult.carbs_g || 0) * factor * 10) / 10;
      const f = Math.round((baseResult.fat_g || 0) * factor * 10) / 10;
      let cal = Math.round((baseResult.calories || 0) * factor);
      if (cal <= 0) {
        cal = Math.round(p * 4 + c * 4 + f * 9);
      }

      setResult({
        ...baseResult,
        estimated_grams: newGrams,
        calories: cal,
        protein_g: p,
        carbs_g: c,
        fat_g: f,
        fiber_g: Math.round((baseResult.fiber_g || 0) * factor * 10) / 10,
        sugar_g: Math.round((baseResult.sugar_g || 0) * factor * 10) / 10,
        sodium_mg: Math.round((baseResult.sodium_mg || 0) * factor),
        iron_mg: Math.round((baseResult.iron_mg || 0) * factor * 10) / 10,
        calcium_mg: Math.round((baseResult.calcium_mg || 0) * factor),
        magnesium_mg: Math.round((baseResult.magnesium_mg || 0) * factor),
        potassium_mg: Math.round((baseResult.potassium_mg || 0) * factor),
        vit_a_ug: Math.round((baseResult.vit_a_ug || 0) * factor),
        vit_b12_ug: Math.round((baseResult.vit_b12_ug || 0) * factor * 10) / 10,
        vit_d_ug: Math.round((baseResult.vit_d_ug || 0) * factor * 10) / 10,
        omega3_g: Math.round((baseResult.omega3_g || 0) * factor * 100) / 100,
        components: baseResult.components?.map((comp) => ({
          ...comp,
          quantity: Math.round((comp.quantity || 0) * factor),
          calories: comp.calories ? Math.round(comp.calories * factor) : undefined,
          protein_g: comp.protein_g ? Math.round(comp.protein_g * factor * 10) / 10 : undefined,
          carbs_g: comp.carbs_g ? Math.round(comp.carbs_g * factor * 10) / 10 : undefined,
          fat_g: comp.fat_g ? Math.round(comp.fat_g * factor * 10) / 10 : undefined,
        })),
      });

      // Update components list too
      setComponentsList((prev) =>
        prev.map((comp) => ({
          ...comp,
          quantity: Math.round((comp.baseGrams || 50) * factor),
          calories: Math.round((comp.baseCalories || 0) * factor),
          protein_g: Math.round((comp.baseProtein || 0) * factor * 10) / 10,
          carbs_g: Math.round((comp.baseCarbs || 0) * factor * 10) / 10,
          fat_g: Math.round((comp.baseFat || 0) * factor * 10) / 10,
        })),
      );
    }
    setGrams(newGrams);
  };

  const handleNutrientChange = (key: keyof ScanResult, val: number) => {
    if (!result) return;
    const safeVal = Math.max(0, val);
    const next = { ...result, [key]: safeVal };
    if (key === "protein_g" || key === "carbs_g" || key === "fat_g") {
      const p = key === "protein_g" ? safeVal : next.protein_g || 0;
      const c = key === "carbs_g" ? safeVal : next.carbs_g || 0;
      const f = key === "fat_g" ? safeVal : next.fat_g || 0;
      next.calories = Math.round(p * 4 + c * 4 + f * 9);
    }
    setResult(next);
  };

  const onFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Pick an image file");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      toast.error("Image must be under 15MB");
      return;
    }
    try {
      setScanning(true);
      setResult(null);
      setComponentsList([]);
      setIsCustomized(false);
      setIsCustomizingIngredients(false);
      const compressedDataUrl = await compressImage(file);
      setImageUrl(compressedDataUrl);

      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageDataUrl: compressedDataUrl }),
      });

      const contentType = res.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");

      if (!res.ok) {
        let errorMsg = `Scan failed (${res.status})`;
        if (isJson) {
          const err = await res.json().catch(() => null);
          if (err && typeof err === "object" && "error" in err) {
            errorMsg = String(err.error);
          }
        } else {
          const text = await res.text().catch(() => "");
          if (text && !text.trim().startsWith("<")) {
            errorMsg = text.slice(0, 150);
          } else if (res.status === 413) {
            errorMsg = "Image is too large. Please upload a smaller image.";
          } else {
            errorMsg = `Server error (${res.status}). Please try again later.`;
          }
        }
        throw new Error(errorMsg);
      }

      if (!isJson) {
        const text = await res.text().catch(() => "");
        console.error("Non-JSON response from /api/scan:", text.slice(0, 500));
        throw new Error("Received an invalid response from the server. Please try again.");
      }

      const data = (await res.json()) as ScanResult;
      setResult(data);
      setBaseResult(data);
      setGrams(data.estimated_grams || 200);

      // Populate editable ingredients list
      const initialComponents: MealComponentItem[] = (data.components || []).map((comp, idx) => ({
        id: `comp-${idx}-${Date.now()}`,
        name: comp.name,
        quantity: comp.quantity || 50,
        unit: comp.unit || "g",
        calories: comp.calories || Math.round((comp.quantity || 50) * 1.5),
        protein_g: comp.protein_g || 0,
        carbs_g: comp.carbs_g || 0,
        fat_g: comp.fat_g || 0,
        fiber_g: comp.fiber_g || 0,
        sugar_g: comp.sugar_g || 0,
        sodium_mg: comp.sodium_mg || 0,
        iron_mg: comp.iron_mg || 0,
        calcium_mg: comp.calcium_mg || 0,
        magnesium_mg: comp.magnesium_mg || 0,
        potassium_mg: comp.potassium_mg || 0,
        vit_a_ug: comp.vit_a_ug || 0,
        vit_b12_ug: comp.vit_b12_ug || 0,
        vit_d_ug: comp.vit_d_ug || 0,
        omega3_g: comp.omega3_g || 0,
        baseGrams: comp.quantity || 50,
        baseCalories: comp.calories || Math.round((comp.quantity || 50) * 1.5),
        baseProtein: comp.protein_g || 0,
        baseCarbs: comp.carbs_g || 0,
        baseFat: comp.fat_g || 0,
      }));
      setComponentsList(initialComponents);

      if (data.confidence < 0.4)
        toast.warning(
          `Low confidence (${Math.round(data.confidence * 100)}%) — please verify before saving.`,
        );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Scan failed");
    } finally {
      setScanning(false);
    }
  };

  const save = useMutation({
    mutationFn: () => {
      if (!result) throw new Error("No result");
      const servingDesc = `${grams}g (${result.serving || "1 serving"})`;
      const localDay = getLocalDateString();
      return logMealFn({
        data: {
          name: result.name,
          source: "photo",
          confidence: result.confidence,
          serving_desc: servingDesc,
          calories: result.calories,
          protein_g: result.protein_g,
          carbs_g: result.carbs_g,
          fat_g: result.fat_g,
          fiber_g: result.fiber_g || 0,
          sugar_g: result.sugar_g || 0,
          sodium_mg: result.sodium_mg || 0,
          iron_mg: result.iron_mg || 0,
          calcium_mg: result.calcium_mg || 0,
          magnesium_mg: result.magnesium_mg || 0,
          potassium_mg: result.potassium_mg || 0,
          vit_a_ug: result.vit_a_ug || 0,
          vit_b12_ug: result.vit_b12_ug || 0,
          vit_d_ug: result.vit_d_ug || 0,
          omega3_g: result.omega3_g || 0,
          raw_model_response: result.raw ?? null,
          eaten_on: localDay,
        },
      });
    },
    onSuccess: () => {
      if (result) {
        const localDay = getLocalDateString();
        LocalStore.addMeal({
          name: result.name,
          source: "photo",
          confidence: result.confidence,
          serving_desc: `${grams}g (${result.serving || "1 serving"})`,
          calories: result.calories,
          protein_g: result.protein_g,
          carbs_g: result.carbs_g,
          fat_g: result.fat_g,
          fiber_g: result.fiber_g || 0,
          sugar_g: result.sugar_g || 0,
          sodium_mg: result.sodium_mg || 0,
          iron_mg: result.iron_mg || 0,
          calcium_mg: result.calcium_mg || 0,
          magnesium_mg: result.magnesium_mg || 0,
          potassium_mg: result.potassium_mg || 0,
          vit_a_ug: result.vit_a_ug || 0,
          vit_b12_ug: result.vit_b12_ug || 0,
          vit_d_ug: result.vit_d_ug || 0,
          omega3_g: result.omega3_g || 0,
          eaten_at: new Date().toISOString(),
          eaten_on: localDay,
        });
      }
      qc.invalidateQueries({ queryKey: ["today"] });
      qc.invalidateQueries({ queryKey: ["calendar"] });
      toast.success("Meal logged");
      navigate({ to: "/home" });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const reset = () => {
    setImageUrl(null);
    setResult(null);
    setBaseResult(null);
    setComponentsList([]);
    setIsCustomized(false);
    setIsCustomizingIngredients(false);
    setGrams(200);
    setShowAdvanced(false);
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Top Header & Scan Mode Switcher Pills */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> Food Identification & Scanning
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-0.5">
            Food & Barcode Scanner
          </h1>
        </div>

        {/* Scan Mode Switcher Pills */}
        <div className="flex items-center rounded-[22px] bg-card/80 backdrop-blur-xl p-1.5 border border-border/80 shadow-lg shrink-0 self-start md:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => {
              setScanMode("barcode");
              reset();
            }}
            className={`flex items-center gap-2 rounded-[18px] px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-black transition-all duration-300 active:scale-95 shrink-0 ${
              scanMode === "barcode"
                ? "bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(52,211,153,0.4)]"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            <Barcode className="h-4 w-4" />
            Barcode Scanner
          </button>
          <button
            onClick={() => setScanMode("photo")}
            className={`flex items-center gap-2 rounded-[18px] px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-black transition-all duration-300 active:scale-95 shrink-0 ${
              scanMode === "photo"
                ? "bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(52,211,153,0.4)]"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            <UtensilsCrossed className="h-4 w-4" />
            Meal Scanner
          </button>
        </div>
      </div>

      {/* Barcode Scanner Mode */}
      {scanMode === "barcode" && <BarcodeScannerContainer />}

      {/* Meal Scanner Mode */}
      {scanMode === "photo" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
          {!imageUrl && (
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                onClick={() => fileRef.current?.click()}
                className="group relative flex min-h-[200px] sm:min-h-[220px] flex-col items-center justify-center gap-2.5 overflow-hidden rounded-[24px] border-2 border-emerald-500/40 bg-gradient-to-br from-cyan-950/90 via-teal-950/90 to-slate-900 dark:from-[#0C1722] dark:via-[#0F2130] dark:to-[#071018] text-white shadow-[0_10px_30px_rgba(52,211,153,0.2)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-[0_15px_35px_rgba(52,211,153,0.35)] active:scale-[0.98] p-6 text-center"
              >
                <div className="animate-ambient-breathing absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

                {/* Laser sweep overlay lines inside preview */}
                <div className="pointer-events-none absolute inset-x-4 top-0 bottom-0 opacity-25">
                  <div className="animate-laser-sweep absolute left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-[0_0_15px_#34D399]" />
                </div>

                <div className="animate-camera-pulse relative z-10 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 border border-emerald-300/50 backdrop-blur-md shadow-[0_0_25px_rgba(52,211,153,0.5)] group-hover:scale-110 transition-transform">
                  <Camera className="h-8 w-8 text-slate-950" />
                </div>
                <div className="relative z-10 font-display text-lg font-black text-white">
                  Take or upload meal photo
                </div>
                <div className="relative z-10 text-xs text-emerald-300/90 font-bold">
                  Instant Macro Analysis (JPG/PNG)
                </div>
              </button>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate({ to: "/manual" })}
                  className="flex flex-1 items-center justify-center gap-2.5 rounded-[24px] bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 text-white font-extrabold shadow-[0_10px_25px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_30px_rgba(16,185,129,0.45)] hover:-translate-y-0.5 active:scale-[0.97] transition-all p-6 text-sm"
                >
                  <Upload className="h-5 w-5 text-white" /> Enter manually
                </button>
                <div className="rounded-[24px] border border-border/80 bg-card/90 dark:bg-[#0C1722]/80 backdrop-blur-2xl p-5 text-xs text-muted-foreground leading-relaxed shadow-lg">
                  <Sparkles className="mb-2 h-4 w-4 text-emerald-500 animate-pulse" />
                  <span className="font-bold text-foreground">Pro Tip:</span> A clean, top-down shot
                  with the whole plate visible gives the most accurate macro estimate.
                </div>
              </div>
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
          />

          {imageUrl && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="relative overflow-hidden rounded-[22px] border-2 border-primary/30 bg-black shadow-2xl">
                <img src={imageUrl} alt="scanned" className="aspect-[4/3] w-full object-cover" />
                <button
                  onClick={reset}
                  className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/70 text-white backdrop-blur-md hover:bg-black transition active:scale-95"
                >
                  <X className="h-4 w-4" />
                </button>
                {scanning && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm text-white">
                    <div className="flex items-center gap-2.5 rounded-full bg-black/80 border border-primary/40 px-5 py-2.5 text-xs font-bold shadow-[0_0_20px_rgba(0,229,143,0.3)]">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" /> Identifying food &
                      computing macros…
                    </div>
                  </div>
                )}
              </div>

              {result && (
                <div className="rounded-[22px] border-2 border-primary/30 bg-card/80 dark:border-white/10 dark:bg-[#0C1722]/80 backdrop-blur-2xl p-6 shadow-2xl space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-full">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 border border-primary/30 px-3 py-1 text-xs font-bold text-primary shadow-[0_0_12px_rgba(0,229,143,0.2)]">
                          <Sparkles className="h-3.5 w-3.5" /> Identified Meal
                        </div>
                        {result.diet_type && (
                          <div
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-extrabold border ${
                              result.diet_type === "VEGETARIAN"
                                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                                : "bg-rose-500/15 border-rose-500/30 text-rose-400"
                            }`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {result.diet_type === "VEGETARIAN" ? "Vegetarian" : "Non-Vegetarian"}
                          </div>
                        )}
                      </div>
                      <input
                        value={result.name}
                        onChange={(e) => setResult({ ...result, name: e.target.value })}
                        className="w-full bg-transparent font-display text-2xl font-extrabold text-foreground outline-none border-b border-transparent focus:border-primary transition"
                      />
                      <div className="mt-1 text-xs text-muted-foreground font-mono">
                        Serving: {result.serving || "1 serving"} · Confidence{" "}
                        {Math.round(result.confidence * 100)}%
                      </div>

                      {/* Interactive Ingredients Section */}
                      <div className="mt-4 rounded-[20px] border border-cyan-500/30 bg-card/90 dark:bg-[#081522]/90 p-4 sm:p-5 space-y-4 shadow-lg backdrop-blur-md">
                        {/* Header with Title, Count badge, and Toggle / Action buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-2.5">
                          <div className="flex items-center gap-2">
                            <div className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                              <UtensilsCrossed className="h-4 w-4" /> Detected Ingredients &
                              Portions
                            </div>
                            <span className="rounded-full bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 text-[11px] font-bold text-cyan-300">
                              {componentsList.length} items · {grams}g
                            </span>
                            {isCustomized && (
                              <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-extrabold text-amber-400 animate-pulse">
                                Customized
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {isCustomized && (
                              <button
                                type="button"
                                onClick={resetIngredientsToScan}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-muted-foreground hover:text-rose-400 transition"
                                title="Reset back to original scan"
                              >
                                <RotateCcw className="h-3 w-3" /> Reset Scan
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setIsCustomizingIngredients(!isCustomizingIngredients)}
                              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all active:scale-95 ${
                                isCustomizingIngredients
                                  ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                                  : "bg-muted hover:bg-muted/80 text-foreground border border-border/70"
                              }`}
                            >
                              {isCustomizingIngredients ? (
                                <>
                                  <Check className="h-3.5 w-3.5" /> Done Editing
                                </>
                              ) : (
                                <>
                                  <Edit3 className="h-3.5 w-3.5 text-cyan-400" /> Customize
                                  Ingredients
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Pills preview when collapsed */}
                        {!isCustomizingIngredients && componentsList.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {componentsList.map((comp) => (
                              <button
                                key={comp.id}
                                type="button"
                                onClick={() => setIsCustomizingIngredients(true)}
                                className="group inline-flex items-center gap-1.5 rounded-xl bg-background/80 hover:bg-muted/90 border border-border/80 px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:border-cyan-500/50 hover:scale-[1.02]"
                              >
                                <span className="font-bold">{comp.name}</span>
                                <span className="text-cyan-400 font-mono text-[11px]">
                                  {comp.quantity}
                                  {comp.unit || "g"}
                                </span>
                                {comp.calories ? (
                                  <span className="text-muted-foreground font-mono text-[10px]">
                                    · {comp.calories} kcal
                                  </span>
                                ) : null}
                                <Edit3 className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-0.5" />
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Full Interactive Editor when expanded */}
                        {isCustomizingIngredients && (
                          <div className="space-y-3 pt-1 animate-in fade-in duration-200">
                            <div className="text-[11px] text-muted-foreground">
                              Adjust portion weights, rename or remove items, and add missing sides
                              or oils to match your exact meal:
                            </div>

                            {/* Ingredient Items Rows */}
                            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                              {componentsList.map((comp) => (
                                <div
                                  key={comp.id}
                                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl bg-background/90 border border-border/70 p-3 hover:border-cyan-500/40 transition"
                                >
                                  {/* Ingredient Name Input */}
                                  <div className="flex-1 min-w-[140px]">
                                    <input
                                      type="text"
                                      value={comp.name}
                                      onChange={(e) =>
                                        handleComponentNameChange(comp.id, e.target.value)
                                      }
                                      placeholder="Ingredient name"
                                      className="w-full bg-transparent text-xs font-extrabold text-foreground outline-none border-b border-transparent focus:border-cyan-400 transition"
                                    />
                                    <div className="text-[10px] font-mono text-muted-foreground mt-0.5 flex items-center gap-2">
                                      <span>{comp.calories || 0} kcal</span>
                                      <span>·</span>
                                      <span className="text-rose-400">
                                        {comp.protein_g || 0}g P
                                      </span>
                                      <span>·</span>
                                      <span className="text-amber-400">{comp.carbs_g || 0}g C</span>
                                      <span>·</span>
                                      <span className="text-emerald-400">{comp.fat_g || 0}g F</span>
                                    </div>
                                  </div>

                                  {/* Stepper Controls & Unit */}
                                  <div className="flex items-center gap-2 shrink-0">
                                    {/* Stepper */}
                                    <div className="flex items-center rounded-lg border border-border/80 bg-muted/40 p-0.5">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleComponentQuantityChange(
                                            comp.id,
                                            Math.max(
                                              1,
                                              comp.quantity - (comp.unit === "g" ? 10 : 1),
                                            ),
                                          )
                                        }
                                        className="grid h-7 w-7 place-items-center rounded-md hover:bg-background active:scale-95 text-foreground"
                                      >
                                        <Minus className="h-3.5 w-3.5" />
                                      </button>
                                      <input
                                        type="number"
                                        min={1}
                                        max={5000}
                                        value={comp.quantity}
                                        onChange={(e) =>
                                          handleComponentQuantityChange(
                                            comp.id,
                                            Number(e.target.value),
                                          )
                                        }
                                        className="w-14 bg-transparent text-center text-xs font-extrabold text-foreground outline-none tabular-nums"
                                      />
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleComponentQuantityChange(
                                            comp.id,
                                            comp.quantity + (comp.unit === "g" ? 10 : 1),
                                          )
                                        }
                                        className="grid h-7 w-7 place-items-center rounded-md hover:bg-background active:scale-95 text-foreground"
                                      >
                                        <Plus className="h-3.5 w-3.5" />
                                      </button>
                                    </div>

                                    {/* Unit Dropdown */}
                                    <select
                                      value={comp.unit || "g"}
                                      onChange={(e) =>
                                        handleComponentUnitChange(comp.id, e.target.value)
                                      }
                                      className="rounded-lg border border-border/80 bg-muted/40 px-2 py-1.5 text-xs font-bold text-foreground outline-none"
                                    >
                                      <option value="g">g</option>
                                      <option value="pcs">pcs</option>
                                      <option value="tbsp">tbsp</option>
                                      <option value="tsp">tsp</option>
                                      <option value="ml">ml</option>
                                      <option value="cup">cup</option>
                                      <option value="slice">slice</option>
                                    </select>

                                    {/* Delete Button */}
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteComponent(comp.id)}
                                      className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-rose-500/20 hover:text-rose-400 active:scale-95 transition"
                                      title="Remove ingredient"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Add New Ingredient Form */}
                            <div className="rounded-xl border border-dashed border-cyan-500/40 bg-cyan-950/20 dark:bg-[#071926]/40 p-3 space-y-2.5">
                              <div className="text-[11px] font-bold text-cyan-400 flex items-center gap-1.5">
                                <Plus className="h-3.5 w-3.5" /> Add Another Ingredient / Side
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                <input
                                  type="text"
                                  value={newIngName}
                                  onChange={(e) => setNewIngName(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      handleAddComponent(newIngName, newIngQty, newIngUnit);
                                    }
                                  }}
                                  placeholder="e.g. Cooking Oil, Brown Rice, Butter..."
                                  className="flex-1 min-w-[160px] rounded-lg border border-border/80 bg-background px-3 py-1.5 text-xs font-bold text-foreground outline-none focus:border-cyan-400"
                                />
                                <input
                                  type="number"
                                  min={1}
                                  value={newIngQty}
                                  onChange={(e) => setNewIngQty(Number(e.target.value))}
                                  className="w-20 rounded-lg border border-border/80 bg-background px-2.5 py-1.5 text-xs font-bold text-foreground outline-none focus:border-cyan-400 tabular-nums text-center"
                                />
                                <select
                                  value={newIngUnit}
                                  onChange={(e) => setNewIngUnit(e.target.value)}
                                  className="rounded-lg border border-border/80 bg-background px-2.5 py-1.5 text-xs font-bold text-foreground outline-none"
                                >
                                  <option value="g">g</option>
                                  <option value="pcs">pcs</option>
                                  <option value="tbsp">tbsp</option>
                                  <option value="tsp">tsp</option>
                                  <option value="ml">ml</option>
                                  <option value="cup">cup</option>
                                  <option value="slice">slice</option>
                                </select>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleAddComponent(newIngName, newIngQty, newIngUnit)
                                  }
                                  className="rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3 py-1.5 text-xs font-extrabold active:scale-95 transition"
                                >
                                  + Add
                                </button>
                              </div>

                              {/* Quick 1-Click Popular Add Chips */}
                              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                <span className="text-[10px] text-muted-foreground font-bold">
                                  Quick Add:
                                </span>
                                {[
                                  { name: "Cooking Oil", qty: 5, unit: "g" },
                                  { name: "White Rice", qty: 100, unit: "g" },
                                  { name: "Whole Egg", qty: 1, unit: "pcs" },
                                  { name: "Fresh Salad", qty: 50, unit: "g" },
                                  { name: "Roti / Chapati", qty: 1, unit: "pcs" },
                                  { name: "Curd / Yogurt", qty: 100, unit: "g" },
                                ].map((chip) => (
                                  <button
                                    key={chip.name}
                                    type="button"
                                    onClick={() =>
                                      handleAddComponent(chip.name, chip.qty, chip.unit)
                                    }
                                    className="rounded-lg bg-background/80 hover:bg-cyan-950/40 border border-border/60 hover:border-cyan-400/50 px-2 py-0.5 text-[10px] font-bold text-foreground transition active:scale-95"
                                  >
                                    + {chip.name} ({chip.qty}
                                    {chip.unit})
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Recalibrate with AI Bar */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60">
                              <div className="text-[11px] text-muted-foreground">
                                Calculations update live. Use AI Re-analyze for deep biochemical
                                precision.
                              </div>
                              <button
                                type="button"
                                onClick={handleReanalyzeWithAI}
                                disabled={isReanalyzingAI || componentsList.length === 0}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-3.5 py-1.5 text-xs font-extrabold text-slate-950 shadow-[0_0_15px_rgba(52,211,153,0.3)] hover:opacity-95 active:scale-95 transition disabled:opacity-50"
                              >
                                {isReanalyzingAI ? (
                                  <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Calibrating
                                    with Gemini…
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="h-3.5 w-3.5" /> ✨ Recalculate with AI
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Grams Input Box */}
                  <div className="rounded-[18px] bg-muted/40 p-5 border border-border/80">
                    <label className="block text-xs font-bold text-foreground mb-2">
                      ⚖️ How many grams did you add?
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1 max-w-[180px]">
                        <input
                          type="number"
                          min={1}
                          max={5000}
                          value={grams}
                          onChange={(e) => handleGramsChange(Number(e.target.value))}
                          className="w-full rounded-[14px] border-2 border-primary bg-background px-4 py-2.5 font-display text-2xl font-extrabold text-primary outline-none focus:ring-2 focus:ring-primary/30 tabular-nums"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground text-xs">
                          g
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Enter the exact weight from your scale or pick below:
                      </div>
                    </div>

                    {/* Quick Weight Pills */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {[50, 100, 150, 200, 250, 300, 400, 500].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleGramsChange(val)}
                          className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${
                            grams === val
                              ? "bg-primary text-primary-foreground shadow-[0_0_12px_rgba(0,229,143,0.3)]"
                              : "bg-background text-foreground border border-border/80 hover:bg-muted"
                          }`}
                        >
                          {val}g
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Scaled Nutrients Preview */}
                  <div className="grid grid-cols-4 gap-3 bg-card/60 backdrop-blur-md rounded-[18px] p-4 border border-border/80 shadow-md">
                    <div className="text-center">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                        Calories
                      </div>
                      <div className="font-display text-xl font-extrabold text-foreground mt-0.5">
                        {result.calories}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono">kcal</div>
                    </div>
                    <div className="text-center border-l border-border/60">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                        Protein
                      </div>
                      <div className="font-display text-xl font-extrabold text-rose-400 mt-0.5">
                        {result.protein_g}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono">g</div>
                    </div>
                    <div className="text-center border-l border-border/60">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                        Carbs
                      </div>
                      <div className="font-display text-xl font-extrabold text-amber-400 mt-0.5">
                        {result.carbs_g}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono">g</div>
                    </div>
                    <div className="text-center border-l border-border/60">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                        Fat
                      </div>
                      <div className="font-display text-xl font-extrabold text-emerald-400 mt-0.5">
                        {result.fat_g}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono">g</div>
                    </div>
                  </div>

                  {/* Prominent Key Micronutrients & Fiber Summary */}
                  <div className="rounded-[18px] border border-cyan-500/30 bg-cyan-950/10 dark:bg-[#071926]/60 p-3.5 space-y-2">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" /> Key Micronutrients & Fiber (Calculated)
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
                      <div className="rounded-xl bg-background/60 border border-border/60 p-2">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                          Fiber
                        </span>
                        <span className="font-extrabold text-teal-400">{result.fiber_g || 0}g</span>
                      </div>
                      <div className="rounded-xl bg-background/60 border border-border/60 p-2">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                          Sodium
                        </span>
                        <span className="font-extrabold text-foreground">
                          {result.sodium_mg || 0}mg
                        </span>
                      </div>
                      <div className="rounded-xl bg-background/60 border border-border/60 p-2">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                          Potassium
                        </span>
                        <span className="font-extrabold text-foreground">
                          {result.potassium_mg || 0}mg
                        </span>
                      </div>
                      <div className="rounded-xl bg-background/60 border border-border/60 p-2">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                          Calcium
                        </span>
                        <span className="font-extrabold text-foreground">
                          {result.calcium_mg || 0}mg
                        </span>
                      </div>
                      <div className="rounded-xl bg-background/60 border border-border/60 p-2">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                          Iron
                        </span>
                        <span className="font-extrabold text-amber-400">
                          {result.iron_mg || 0}mg
                        </span>
                      </div>
                      <div className="rounded-xl bg-background/60 border border-border/60 p-2">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                          Magnesium
                        </span>
                        <span className="font-extrabold text-foreground">
                          {result.magnesium_mg || 0}mg
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={reset}
                      className="rounded-[16px] border border-border/80 bg-background px-5 py-3 text-sm font-bold text-foreground hover:bg-muted active:scale-95 transition"
                    >
                      Discard
                    </button>
                    <button
                      onClick={() => save.mutate()}
                      disabled={save.isPending}
                      className="flex flex-1 items-center justify-center gap-2 rounded-[16px] bg-primary px-6 py-3.5 font-display text-base font-extrabold text-primary-foreground shadow-[0_0_25px_rgba(0,229,143,0.3)] hover:opacity-95 active:scale-[0.98] transition disabled:opacity-50"
                    >
                      {save.isPending && <Loader2 className="h-5 w-5 animate-spin" />}
                      Log Meal ({result.calories} kcal)
                    </button>
                  </div>

                  {/* Advanced Toggle */}
                  <div className="border-t border-border/80 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="text-xs font-bold text-muted-foreground hover:text-foreground underline underline-offset-4"
                    >
                      {showAdvanced
                        ? "▲ Hide manual nutrient adjustments"
                        : "▼ Advanced: Customize macros & micronutrients manually"}
                    </button>

                    {showAdvanced && (
                      <div className="mt-4 space-y-4 animate-in fade-in duration-200">
                        {/* Macronutrients */}
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-primary mb-2">
                            Core Macronutrients
                          </div>
                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
                            {(
                              [
                                ["Calories", "calories", "kcal"],
                                ["Protein", "protein_g", "g"],
                                ["Carbs", "carbs_g", "g"],
                                ["Fat", "fat_g", "g"],
                                ["Fiber", "fiber_g", "g"],
                                ["Sugar", "sugar_g", "g"],
                              ] as const
                            ).map(([label, key, unit]) => (
                              <label
                                key={key}
                                className="block rounded-[16px] border border-border/80 bg-background/80 p-3"
                              >
                                <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                                  {label}
                                </div>
                                <div className="mt-1 flex items-baseline gap-1">
                                  <input
                                    type="number"
                                    step={key === "calories" ? "1" : "0.1"}
                                    value={result[key] ?? 0}
                                    onChange={(e) =>
                                      handleNutrientChange(key, Number(e.target.value))
                                    }
                                    className="w-full bg-transparent font-display text-lg font-bold text-foreground outline-none tabular-nums"
                                  />
                                  <span className="text-xs text-muted-foreground font-mono">
                                    {unit}
                                  </span>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Micronutrients & Minerals */}
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-primary mb-2">
                            Micronutrients & Minerals
                          </div>
                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {(
                              [
                                ["Sodium", "sodium_mg", "mg"],
                                ["Potassium", "potassium_mg", "mg"],
                                ["Calcium", "calcium_mg", "mg"],
                                ["Magnesium", "magnesium_mg", "mg"],
                                ["Iron", "iron_mg", "mg"],
                                ["Vitamin A", "vit_a_ug", "mcg"],
                                ["Vitamin B12", "vit_b12_ug", "mcg"],
                                ["Vitamin D", "vit_d_ug", "mcg"],
                                ["Omega-3", "omega3_g", "g"],
                              ] as const
                            ).map(([label, key, unit]) => (
                              <label
                                key={key}
                                className="block rounded-[16px] border border-border/80 bg-background/80 p-3"
                              >
                                <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                                  {label}
                                </div>
                                <div className="mt-1 flex items-baseline gap-1">
                                  <input
                                    type="number"
                                    step={
                                      key.includes("mg") || key.includes("ug")
                                        ? key.includes("iron") ||
                                          key.includes("vit_b12") ||
                                          key.includes("vit_d")
                                          ? "0.1"
                                          : "1"
                                        : "0.01"
                                    }
                                    value={result[key] ?? 0}
                                    onChange={(e) =>
                                      handleNutrientChange(key, Number(e.target.value))
                                    }
                                    className="w-full bg-transparent font-display text-lg font-bold text-foreground outline-none tabular-nums"
                                  />
                                  <span className="text-xs text-muted-foreground font-mono">
                                    {unit}
                                  </span>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
