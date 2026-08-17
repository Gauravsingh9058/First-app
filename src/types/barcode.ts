export interface NutrientInfo {
  per100g: number;
  perServing: number;
  unit: string;
}

export interface IngredientRiskItem {
  name: string;
  category:
    | "Added Sugar"
    | "Palm Oil"
    | "Artificial Colors"
    | "Artificial Flavours"
    | "MSG"
    | "High Sodium"
    | "High Fat"
    | "Sweeteners"
    | "Preservatives"
    | "Other";
  riskLevel: "Safe" | "Moderate" | "Avoid";
  description: string;
}

export interface PersonalizedSuitability {
  weightLoss: { suitable: boolean; reason: string };
  muscleGain: { suitable: boolean; reason: string };
  diabetes: { suitable: boolean; reason: string };
  heartHealth: { suitable: boolean; reason: string };
  children: { suitable: boolean; reason: string };
  elderly: { suitable: boolean; reason: string };
  dailyUse: { suitable: boolean; reason: string };
}

export interface HealthierAlternative {
  name: string;
  brand: string;
  healthScore: number;
  calories: number;
  protein: number;
  estimatedPrice: string;
  whyBetter: string;
  imageUrl?: string;
}

export interface FullProductAnalysis {
  barcode: string;
  barcodeType: string; // e.g. EAN-13, UPC-A, Code128
  productName: string;
  brand: string;
  category: string;
  countryOfOrigin: string;
  netWeight: string;
  servingSize: string;
  baseServingGrams: number;
  imageUrl: string | null;

  isVeg: boolean;
  isOrganic: boolean;
  dietaryBadges: string[]; // e.g. Vegan, Gluten-Free, Keto

  healthScore: number; // 0 - 100
  healthGrade: "A+" | "A" | "B" | "C" | "D" | "E";

  aiRecommendation: string;
  aiHealthAnalysisText: string;

  // Complete Nutrition Map
  nutrition: {
    calories: NutrientInfo;
    protein: NutrientInfo;
    carbs: NutrientInfo;
    fat: NutrientInfo;
    sugar: NutrientInfo;
    fiber: NutrientInfo;
    saturatedFat: NutrientInfo;
    transFat: NutrientInfo;
    sodium: NutrientInfo;
    potassium: NutrientInfo;
    calcium: NutrientInfo;
    iron: NutrientInfo;
    vitaminA: NutrientInfo;
    vitaminC: NutrientInfo;
    vitaminD: NutrientInfo;
    vitaminB12: NutrientInfo;
    cholesterol: NutrientInfo;
  };

  ingredientsList: string[];
  ingredientRisks: IngredientRiskItem[];

  personalizedAnalysis: PersonalizedSuitability;
  alternatives: HealthierAlternative[];
}

export interface ScanHistoryItem {
  id: string;
  barcode: string;
  scannedAt: string; // ISO date
  productName: string;
  brand: string;
  imageUrl: string | null;
  healthScore: number;
  healthGrade: "A+" | "A" | "B" | "C" | "D" | "E";
  caloriesPerServing: number;
  isFavorite: boolean;
  fullData: FullProductAnalysis;
}

export interface BarcodeSettings {
  autoFlash: boolean;
  autoScan: boolean;
  vibration: boolean;
  sound: boolean;
  continuousScan: boolean;
}

export interface PendingOfflineScan {
  barcode: string;
  timestamp: string;
}
