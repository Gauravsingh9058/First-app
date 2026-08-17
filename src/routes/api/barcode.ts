import { createFileRoute } from "@tanstack/react-router";
import { getGeminiApiKey, gatewayChatCompletion } from "@/lib/ai-gateway.server";
import { GoogleGenAI } from "@google/genai";
import { FullProductAnalysis, NutrientInfo, IngredientRiskItem } from "@/types/barcode";

// Catalog of known fallback products for instant response
const BUILTIN_BARCODE_CATALOG: Record<string, Partial<FullProductAnalysis>> = {
  "301762042203": {
    barcode: "301762042203",
    barcodeType: "EAN-13",
    productName: "Nutella Hazelnut Spread with Cocoa",
    brand: "Ferrero",
    category: "Spreads & Sweet Toppings",
    countryOfOrigin: "Italy / Global",
    netWeight: "350g",
    servingSize: "15g (1 tbsp)",
    baseServingGrams: 15,
    imageUrl:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
    isVeg: true,
    isOrganic: false,
    dietaryBadges: ["Vegetarian", "Contains Nuts"],
    healthScore: 32,
    healthGrade: "D",
    aiRecommendation:
      "High in added sugar and palm oil. Enjoy in strict moderation as an occasional treat.",
    aiHealthAnalysisText:
      "Nutella contains over 55% sugar by weight alongside palm oil. While delicious, a single serving delivers 8.5g of sugar. It offers minimal protein or fiber.",
    nutrition: {
      calories: { per100g: 539, perServing: 81, unit: "kcal" },
      protein: { per100g: 6.3, perServing: 0.9, unit: "g" },
      carbs: { per100g: 57.5, perServing: 8.6, unit: "g" },
      fat: { per100g: 30.9, perServing: 4.6, unit: "g" },
      sugar: { per100g: 56.3, perServing: 8.4, unit: "g" },
      fiber: { per100g: 3.4, perServing: 0.5, unit: "g" },
      saturatedFat: { per100g: 10.6, perServing: 1.6, unit: "g" },
      transFat: { per100g: 0.1, perServing: 0, unit: "g" },
      sodium: { per100g: 42, perServing: 6, unit: "mg" },
      potassium: { per100g: 410, perServing: 62, unit: "mg" },
      calcium: { per100g: 114, perServing: 17, unit: "mg" },
      iron: { per100g: 2.1, perServing: 0.3, unit: "mg" },
      vitaminA: { per100g: 0, perServing: 0, unit: "mcg" },
      vitaminC: { per100g: 0, perServing: 0, unit: "mg" },
      vitaminD: { per100g: 0, perServing: 0, unit: "mcg" },
      vitaminB12: { per100g: 0, perServing: 0, unit: "mcg" },
      cholesterol: { per100g: 0, perServing: 0, unit: "mg" },
    },
    ingredientsList: [
      "Sugar",
      "Palm Oil",
      "Hazelnuts (13%)",
      "Skimmed Milk Powder (8.7%)",
      "Fat-Reduced Cocoa (7.4%)",
      "Emulsifier (Lecithins - Soya)",
      "Vanillin",
    ],
  },
  "8901058000000": {
    barcode: "8901058000000",
    barcodeType: "EAN-13",
    productName: "Amul Taaza Toned Milk",
    brand: "Amul",
    category: "Dairy & Milk",
    countryOfOrigin: "India",
    netWeight: "500ml",
    servingSize: "200ml (1 Glass)",
    baseServingGrams: 200,
    imageUrl:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80",
    isVeg: true,
    isOrganic: false,
    dietaryBadges: ["Vegetarian", "High Protein", "Calcium Rich"],
    healthScore: 88,
    healthGrade: "A",
    aiRecommendation:
      "Excellent source of high-quality protein and essential calcium. Ideal for daily fitness nutrition.",
    aiHealthAnalysisText:
      "Toned milk provides balanced macronutrients with 3% fat. Rich in natural bioavailable calcium, Vitamin D, and Vitamin B12, supporting bone density and muscle synthesis.",
    nutrition: {
      calories: { per100g: 58, perServing: 116, unit: "kcal" },
      protein: { per100g: 3.2, perServing: 6.4, unit: "g" },
      carbs: { per100g: 4.7, perServing: 9.4, unit: "g" },
      fat: { per100g: 3.0, perServing: 6.0, unit: "g" },
      sugar: { per100g: 4.7, perServing: 9.4, unit: "g" },
      fiber: { per100g: 0, perServing: 0, unit: "g" },
      saturatedFat: { per100g: 1.9, perServing: 3.8, unit: "g" },
      transFat: { per100g: 0, perServing: 0, unit: "g" },
      sodium: { per100g: 50, perServing: 100, unit: "mg" },
      potassium: { per100g: 140, perServing: 280, unit: "mg" },
      calcium: { per100g: 120, perServing: 240, unit: "mg" },
      iron: { per100g: 0.1, perServing: 0.2, unit: "mg" },
      vitaminA: { per100g: 35, perServing: 70, unit: "mcg" },
      vitaminC: { per100g: 1.0, perServing: 2.0, unit: "mg" },
      vitaminD: { per100g: 0.5, perServing: 1.0, unit: "mcg" },
      vitaminB12: { per100g: 0.4, perServing: 0.8, unit: "mcg" },
      cholesterol: { per100g: 8, perServing: 16, unit: "mg" },
    },
    ingredientsList: ["Pasteurized Toned Milk", "Vitamin A", "Vitamin D2"],
  },
  "8901491101820": {
    barcode: "8901491101820",
    barcodeType: "EAN-13",
    productName: "Quaker Rolled Oats 100% Whole Grain",
    brand: "Quaker",
    category: "Breakfast Cereals & Oats",
    countryOfOrigin: "India / USA",
    netWeight: "1kg",
    servingSize: "40g (1/2 Cup)",
    baseServingGrams: 40,
    imageUrl:
      "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=400&q=80",
    isVeg: true,
    isOrganic: true,
    dietaryBadges: ["Vegetarian", "High Fiber", "Whole Grain", "Heart Healthy"],
    healthScore: 95,
    healthGrade: "A+",
    aiRecommendation:
      "Outstanding daily complex carb choice. High beta-glucan soluble fiber lowers cholesterol and stabilizes insulin.",
    aiHealthAnalysisText:
      "100% whole grain oats provide sustained energy release with zero added sugar and rich dietary fiber. Perfect for weight loss, endurance training, and cardiovascular wellness.",
    nutrition: {
      calories: { per100g: 389, perServing: 156, unit: "kcal" },
      protein: { per100g: 13.0, perServing: 5.2, unit: "g" },
      carbs: { per100g: 66.0, perServing: 26.4, unit: "g" },
      fat: { per100g: 7.5, perServing: 3.0, unit: "g" },
      sugar: { per100g: 1.0, perServing: 0.4, unit: "g" },
      fiber: { per100g: 10.5, perServing: 4.2, unit: "g" },
      saturatedFat: { per100g: 1.4, perServing: 0.6, unit: "g" },
      transFat: { per100g: 0, perServing: 0, unit: "g" },
      sodium: { per100g: 6, perServing: 2, unit: "mg" },
      potassium: { per100g: 350, perServing: 140, unit: "mg" },
      calcium: { per100g: 54, perServing: 22, unit: "mg" },
      iron: { per100g: 4.7, perServing: 1.9, unit: "mg" },
      vitaminA: { per100g: 0, perServing: 0, unit: "mcg" },
      vitaminC: { per100g: 0, perServing: 0, unit: "mg" },
      vitaminD: { per100g: 0, perServing: 0, unit: "mcg" },
      vitaminB12: { per100g: 0, perServing: 0, unit: "mcg" },
      cholesterol: { per100g: 0, perServing: 0, unit: "mg" },
    },
    ingredientsList: ["100% Whole Grain Rolled Oats"],
  },
  "8901063141125": {
    barcode: "8901063141125",
    barcodeType: "EAN-13",
    productName: "Britannia NutriChoice Digestive Biscuits",
    brand: "Britannia",
    category: "Biscuits & Snacks",
    countryOfOrigin: "India",
    netWeight: "100g",
    servingSize: "25g (2 Biscuits)",
    baseServingGrams: 25,
    imageUrl:
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80",
    isVeg: true,
    isOrganic: false,
    dietaryBadges: ["Vegetarian", "Dietary Fiber"],
    healthScore: 62,
    healthGrade: "C",
    aiRecommendation:
      "Better than standard cream biscuits, but still contains refined wheat flour and palm fat. Limit to 2 biscuits.",
    aiHealthAnalysisText:
      "NutriChoice digestive biscuits contain whole wheat flour and wheat bran, providing decent fiber, but also include palm oil and added sugars. Pair with tea mindfully.",
    nutrition: {
      calories: { per100g: 478, perServing: 120, unit: "kcal" },
      protein: { per100g: 8.0, perServing: 2.0, unit: "g" },
      carbs: { per100g: 68.0, perServing: 17.0, unit: "g" },
      fat: { per100g: 20.0, perServing: 5.0, unit: "g" },
      sugar: { per100g: 14.5, perServing: 3.6, unit: "g" },
      fiber: { per100g: 6.0, perServing: 1.5, unit: "g" },
      saturatedFat: { per100g: 9.0, perServing: 2.3, unit: "g" },
      transFat: { per100g: 0, perServing: 0, unit: "g" },
      sodium: { per100g: 380, perServing: 95, unit: "mg" },
      potassium: { per100g: 180, perServing: 45, unit: "mg" },
      calcium: { per100g: 40, perServing: 10, unit: "mg" },
      iron: { per100g: 2.5, perServing: 0.6, unit: "mg" },
      vitaminA: { per100g: 0, perServing: 0, unit: "mcg" },
      vitaminC: { per100g: 0, perServing: 0, unit: "mg" },
      vitaminD: { per100g: 0, perServing: 0, unit: "mcg" },
      vitaminB12: { per100g: 0, perServing: 0, unit: "mcg" },
      cholesterol: { per100g: 0, perServing: 0, unit: "mg" },
    },
    ingredientsList: [
      "Wheat Flour (Atta)",
      "Refined Wheat Flour (Maida)",
      "Refined Palm Oil",
      "Sugar",
      "Wheat Bran (5.5%)",
      "Liquid Glucose",
      "Milk Solids",
    ],
  },
  "8901491000826": {
    barcode: "8901491000826",
    barcodeType: "EAN-13",
    productName: "Lay's Classic Salted Potato Chips",
    brand: "Lay's",
    category: "Chips & Crisps",
    countryOfOrigin: "India / USA",
    netWeight: "50g",
    servingSize: "30g (approx. 15 chips)",
    baseServingGrams: 30,
    imageUrl:
      "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80",
    isVeg: true,
    isOrganic: false,
    dietaryBadges: ["Vegetarian"],
    healthScore: 38,
    healthGrade: "D",
    aiRecommendation:
      "High in sodium and saturated fats from palmolein oil. Consume sparingly as a cheat snack.",
    aiHealthAnalysisText:
      "Deep fried potato chips with concentrated sodium and high caloric density. Rapid digestion spike with low satiety value.",
    nutrition: {
      calories: { per100g: 544, perServing: 163, unit: "kcal" },
      protein: { per100g: 7.0, perServing: 2.1, unit: "g" },
      carbs: { per100g: 52.0, perServing: 15.6, unit: "g" },
      fat: { per100g: 34.0, perServing: 10.2, unit: "g" },
      sugar: { per100g: 1.0, perServing: 0.3, unit: "g" },
      fiber: { per100g: 3.5, perServing: 1.1, unit: "g" },
      saturatedFat: { per100g: 14.0, perServing: 4.2, unit: "g" },
      transFat: { per100g: 0.1, perServing: 0, unit: "g" },
      sodium: { per100g: 560, perServing: 168, unit: "mg" },
      potassium: { per100g: 1200, perServing: 360, unit: "mg" },
      calcium: { per100g: 24, perServing: 7, unit: "mg" },
      iron: { per100g: 1.6, perServing: 0.5, unit: "mg" },
      vitaminA: { per100g: 0, perServing: 0, unit: "mcg" },
      vitaminC: { per100g: 15.0, perServing: 4.5, unit: "mg" },
      vitaminD: { per100g: 0, perServing: 0, unit: "mcg" },
      vitaminB12: { per100g: 0, perServing: 0, unit: "mcg" },
      cholesterol: { per100g: 0, perServing: 0, unit: "mg" },
    },
    ingredientsList: ["Potato", "Edible Vegetable Oil (Palmolein)", "Iodized Salt (1.5%)"],
  },
  "8901058852302": {
    barcode: "8901058852302",
    barcodeType: "EAN-13",
    productName: "Maggi 2-Minute Masala Noodles",
    brand: "Nestle Maggi",
    category: "Instant Noodles",
    countryOfOrigin: "India",
    netWeight: "70g",
    servingSize: "70g (1 Pack)",
    baseServingGrams: 70,
    imageUrl:
      "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=400&q=80",
    isVeg: true,
    isOrganic: false,
    dietaryBadges: ["Vegetarian"],
    healthScore: 42,
    healthGrade: "D",
    aiRecommendation:
      "High sodium content (over 60% daily limit) and refined flour (Maida). Add fresh vegetables and lean protein if eating.",
    aiHealthAnalysisText:
      "Instant noodles made with refined wheat flour and palmolein oil. Contains sodium tripolyphosphate and flavor enhancers. Not recommended for daily fitness regimes.",
    nutrition: {
      calories: { per100g: 427, perServing: 299, unit: "kcal" },
      protein: { per100g: 8.0, perServing: 5.6, unit: "g" },
      carbs: { per100g: 63.5, perServing: 44.5, unit: "g" },
      fat: { per100g: 15.7, perServing: 11.0, unit: "g" },
      sugar: { per100g: 2.2, perServing: 1.5, unit: "g" },
      fiber: { per100g: 3.6, perServing: 2.5, unit: "g" },
      saturatedFat: { per100g: 6.8, perServing: 4.8, unit: "g" },
      transFat: { per100g: 0.1, perServing: 0.1, unit: "g" },
      sodium: { per100g: 1200, perServing: 840, unit: "mg" },
      potassium: { per100g: 150, perServing: 105, unit: "mg" },
      calcium: { per100g: 140, perServing: 98, unit: "mg" },
      iron: { per100g: 3.7, perServing: 2.6, unit: "mg" },
      vitaminA: { per100g: 0, perServing: 0, unit: "mcg" },
      vitaminC: { per100g: 0, perServing: 0, unit: "mg" },
      vitaminD: { per100g: 0, perServing: 0, unit: "mcg" },
      vitaminB12: { per100g: 0, perServing: 0, unit: "mcg" },
      cholesterol: { per100g: 0, perServing: 0, unit: "mg" },
    },
    ingredientsList: [
      "Refined Wheat Flour (Maida)",
      "Palm Oil",
      "Salt",
      "Wheat Gluten",
      "Mineral (Calcium Carbonate)",
      "Hydrolysed Groundnut Protein",
      "Mixed Spices (Coriander, Turmeric, Cumin, Chilli)",
    ],
  },
  "8901262010052": {
    barcode: "8901262010052",
    barcodeType: "EAN-13",
    productName: "Parle-G Glucose Biscuits",
    brand: "Parle",
    category: "Biscuits",
    countryOfOrigin: "India",
    netWeight: "80g",
    servingSize: "20g (4 Biscuits)",
    baseServingGrams: 20,
    imageUrl:
      "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=400&q=80",
    isVeg: true,
    isOrganic: false,
    dietaryBadges: ["Vegetarian", "Quick Energy"],
    healthScore: 50,
    healthGrade: "C",
    aiRecommendation:
      "Provides quick glucose energy, but high in inverted sugar syrup and refined flour.",
    aiHealthAnalysisText:
      "Classic energy biscuit made with wheat flour, sugar, and vegetable oil. Suitable for quick workout energy, but watch portion size due to sugar content.",
    nutrition: {
      calories: { per100g: 454, perServing: 91, unit: "kcal" },
      protein: { per100g: 6.5, perServing: 1.3, unit: "g" },
      carbs: { per100g: 78.2, perServing: 15.6, unit: "g" },
      fat: { per100g: 13.0, perServing: 2.6, unit: "g" },
      sugar: { per100g: 26.5, perServing: 5.3, unit: "g" },
      fiber: { per100g: 1.8, perServing: 0.4, unit: "g" },
      saturatedFat: { per100g: 5.5, perServing: 1.1, unit: "g" },
      transFat: { per100g: 0, perServing: 0, unit: "g" },
      sodium: { per100g: 270, perServing: 54, unit: "mg" },
      potassium: { per100g: 90, perServing: 18, unit: "mg" },
      calcium: { per100g: 35, perServing: 7, unit: "mg" },
      iron: { per100g: 1.8, perServing: 0.4, unit: "mg" },
      vitaminA: { per100g: 0, perServing: 0, unit: "mcg" },
      vitaminC: { per100g: 0, perServing: 0, unit: "mg" },
      vitaminD: { per100g: 0, perServing: 0, unit: "mcg" },
      vitaminB12: { per100g: 0, perServing: 0, unit: "mcg" },
      cholesterol: { per100g: 0, perServing: 0, unit: "mg" },
    },
    ingredientsList: [
      "Wheat Flour (68%)",
      "Sugar (26%)",
      "Refined Palm Oil",
      "Invert Sugar Syrup",
      "Milk Solids",
      "Salt",
      "Raising Agents",
    ],
  },
};

const SYSTEM_PROMPT = `You are NutriLens AI's Senior Food Scientist, Clinical Nutritionist, and Barcode Database Expert.
Your job is to generate accurate, detailed, and structured nutritional, ingredient safety, and personalized health analysis for a food product based on barcode data, product name, or uploaded nutrition label photos.

Return ONLY a valid JSON object matching this structure (no markdown, no wrapped text, pure JSON):
{
  "barcode": "string",
  "barcodeType": "EAN-13 | UPC-A | UPC-E | Code128 | QR",
  "productName": "string",
  "brand": "string",
  "category": "string",
  "countryOfOrigin": "string",
  "netWeight": "string",
  "servingSize": "string",
  "baseServingGrams": 100,
  "imageUrl": "string or null",
  "isVeg": true,
  "isOrganic": false,
  "dietaryBadges": ["Vegetarian", "High Protein"],
  "healthScore": 85,
  "healthGrade": "A+ | A | B | C | D | E",
  "aiRecommendation": "Short actionable recommendation (1-2 sentences)",
  "aiHealthAnalysisText": "Detailed health breakdown paragraph (3-4 sentences explaining impact on blood sugar, heart, digestion, and fitness goals)",
  "nutrition": {
    "calories": { "per100g": 350, "perServing": 140, "unit": "kcal" },
    "protein": { "per100g": 12, "perServing": 4.8, "unit": "g" },
    "carbs": { "per100g": 60, "perServing": 24, "unit": "g" },
    "fat": { "per100g": 8, "perServing": 3.2, "unit": "g" },
    "sugar": { "per100g": 5, "perServing": 2, "unit": "g" },
    "fiber": { "per100g": 8, "perServing": 3.2, "unit": "g" },
    "saturatedFat": { "per100g": 2, "perServing": 0.8, "unit": "g" },
    "transFat": { "per100g": 0, "perServing": 0, "unit": "g" },
    "sodium": { "per100g": 300, "perServing": 120, "unit": "mg" },
    "potassium": { "per100g": 250, "perServing": 100, "unit": "mg" },
    "calcium": { "per100g": 100, "perServing": 40, "unit": "mg" },
    "iron": { "per100g": 3, "perServing": 1.2, "unit": "mg" },
    "vitaminA": { "per100g": 150, "perServing": 60, "unit": "mcg" },
    "vitaminC": { "per100g": 10, "perServing": 4, "unit": "mg" },
    "vitaminD": { "per100g": 2, "perServing": 0.8, "unit": "mcg" },
    "vitaminB12": { "per100g": 0.5, "perServing": 0.2, "unit": "mcg" },
    "cholesterol": { "per100g": 0, "perServing": 0, "unit": "mg" }
  },
  "ingredientsList": ["Ingredient 1", "Ingredient 2"],
  "ingredientRisks": [
    {
      "name": "Palm Oil / Added Sugar / MSG / Artificial Flavor",
      "category": "Added Sugar | Palm Oil | Artificial Colors | Artificial Flavours | MSG | High Sodium | High Fat | Sweeteners | Preservatives",
      "riskLevel": "Safe | Moderate | Avoid",
      "description": "Short explanation of why this ingredient has this risk level"
    }
  ],
  "personalizedAnalysis": {
    "weightLoss": { "suitable": true, "reason": "High fiber and low calorie density support fat loss deficit" },
    "muscleGain": { "suitable": true, "reason": "Provides quality amino acids for recovery" },
    "diabetes": { "suitable": false, "reason": "Contains rapid digestion sugars that may spike blood glucose" },
    "heartHealth": { "suitable": true, "reason": "Low saturated fat and zero trans-fats promote arterial health" },
    "children": { "suitable": true, "reason": "Contains natural nutrients without harmful additives" },
    "elderly": { "suitable": true, "reason": "Easy to digest and rich in calcium" },
    "dailyUse": { "suitable": true, "reason": "Clean ingredient profile suitable for everyday meal plans" }
  },
  "alternatives": [
    {
      "name": "Healthier Alternative Name",
      "brand": "Brand Name",
      "healthScore": 92,
      "calories": 180,
      "protein": 15,
      "estimatedPrice": "$3.50",
      "whyBetter": "Contains zero palm oil, 80% less sugar, and twice the protein content."
    }
  ]
}`;

// Fetch product from OpenFoodFacts API with timeout
async function fetchOpenFoodFacts(barcode: string) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`, {
      headers: { "User-Agent": "NutriLensAI - Barcode Scanner - Web App" },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = (await res.json()) as { status?: number; product?: Record<string, unknown> };
    if (data.status === 1 && data.product) {
      return data.product;
    }
    return null;
  } catch (err) {
    console.warn("OpenFoodFacts fetch error/timeout:", err);
    return null;
  }
}

// Convert raw OpenFoodFacts JSON directly to FullProductAnalysis if AI is unreachable
function buildAnalysisFromOpenFoodFacts(
  barcode: string,
  off: Record<string, unknown>,
): FullProductAnalysis {
  const nutriments = (off.nutriments as Record<string, unknown>) || {};
  const servingSizeStr = String(off.serving_size || off.serving_quantity || "100g");
  const servingGrams = parseFloat(servingSizeStr) || 100;
  const ratio = servingGrams / 100;

  const getRawNum = (key100g: string, fallbackKey?: string): number => {
    const val100g = nutriments[key100g] ?? (fallbackKey ? nutriments[fallbackKey] : undefined);
    const num = parseFloat(String(val100g));
    return isNaN(num) ? 0 : num;
  };

  const createMacroGram = (key100g: string, fallbackKey?: string): NutrientInfo => {
    const p100 = Math.round(getRawNum(key100g, fallbackKey) * 10) / 10;
    const pServing = Math.round(p100 * ratio * 10) / 10;
    return { per100g: p100, perServing: pServing, unit: "g" };
  };

  const createSodiumMg = (): NutrientInfo => {
    const rawSod = getRawNum("sodium_100g", "sodium");
    const rawSalt = getRawNum("salt_100g", "salt");
    let sodMg = 0;
    if (rawSod > 0) {
      // If rawSod <= 10 (stored as grams in OpenFoodFacts), convert to mg
      sodMg = rawSod <= 10 ? rawSod * 1000 : rawSod;
    } else if (rawSalt > 0) {
      sodMg = (rawSalt / 2.5) * 1000;
    }
    const p100 = Math.round(sodMg);
    return { per100g: p100, perServing: Math.round(p100 * ratio), unit: "mg" };
  };

  const createMineralMg = (key100g: string, fallbackKey?: string): NutrientInfo => {
    const raw = getRawNum(key100g, fallbackKey);
    const mg = raw > 0 && raw < 10 ? Math.round(raw * 1000) : Math.round(raw);
    return { per100g: mg, perServing: Math.round(mg * ratio), unit: "mg" };
  };

  const createIronMg = (key100g: string, fallbackKey?: string): NutrientInfo => {
    const raw = getRawNum(key100g, fallbackKey);
    const mg = raw > 0 && raw < 1 ? Number((raw * 1000).toFixed(1)) : Number(raw.toFixed(1));
    return { per100g: mg, perServing: Number((mg * ratio).toFixed(1)), unit: "mg" };
  };

  const createVitaminMcg = (key100g: string, fallbackKey?: string): NutrientInfo => {
    const raw = getRawNum(key100g, fallbackKey);
    let mcg = raw;
    if (raw > 0 && raw < 0.001) {
      mcg = raw * 1000000;
    } else if (raw > 0 && raw < 1) {
      mcg = raw * 1000;
    }
    const p100 = Math.round(mcg * 10) / 10;
    return { per100g: p100, perServing: Math.round(p100 * ratio * 10) / 10, unit: "mcg" };
  };

  const createVitaminMg = (key100g: string, fallbackKey?: string): NutrientInfo => {
    const raw = getRawNum(key100g, fallbackKey);
    const mg = raw > 0 && raw < 1 ? Number((raw * 1000).toFixed(1)) : Number(raw.toFixed(1));
    return { per100g: mg, perServing: Number((mg * ratio).toFixed(1)), unit: "mg" };
  };

  let cal100g = Math.round(
    getRawNum("energy-kcal_100g") ||
      getRawNum("energy-kcal") ||
      (getRawNum("energy_100g") || 0) / 4.184,
  );

  const proG = createMacroGram("proteins_100g", "proteins").per100g;
  const carbG = createMacroGram("carbohydrates_100g", "carbohydrates").per100g;
  const fatG = createMacroGram("fat_100g", "fat").per100g;
  const atwaterKcal = Math.round(proG * 4 + carbG * 4 + fatG * 9);

  if (cal100g <= 0 || (atwaterKcal > 10 && Math.abs(cal100g - atwaterKcal) > atwaterKcal * 0.5)) {
    cal100g = atwaterKcal;
  }

  const nutriscore = String(off.nutriscore_grade || "").toLowerCase();
  let healthGrade: "A+" | "A" | "B" | "C" | "D" | "E" = "B";
  let healthScore = 70;
  if (nutriscore === "a") {
    healthGrade = "A";
    healthScore = 90;
  } else if (nutriscore === "b") {
    healthGrade = "B";
    healthScore = 75;
  } else if (nutriscore === "c") {
    healthGrade = "C";
    healthScore = 55;
  } else if (nutriscore === "d") {
    healthGrade = "D";
    healthScore = 40;
  } else if (nutriscore === "e") {
    healthGrade = "E";
    healthScore = 25;
  }

  const ingredientsText = String(off.ingredients_text || off.ingredients_text_en || "");
  const ingredientsList = ingredientsText
    ? ingredientsText
        .split(/[,;\n]/)
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 20)
    : [];

  const ingredientRisks: IngredientRiskItem[] = [];
  const lowerIng = ingredientsText.toLowerCase();
  if (lowerIng.includes("palm oil") || lowerIng.includes("palmolein")) {
    ingredientRisks.push({
      name: "Palm Oil / Palmolein",
      category: "Palm Oil",
      riskLevel: "Moderate",
      description:
        "High in saturated fatty acids which may raise LDL cholesterol if consumed regularly.",
    });
  }
  const sugars100g = createMacroGram("sugars_100g", "sugars").per100g;
  if (sugars100g > 15) {
    ingredientRisks.push({
      name: "High Added Sugar",
      category: "Added Sugar",
      riskLevel: "Avoid",
      description: `Contains ${sugars100g}g sugar per 100g. May cause glucose spikes.`,
    });
  }
  const sodiumVal = createSodiumMg().per100g;
  if (sodiumVal > 600) {
    ingredientRisks.push({
      name: "High Sodium Content",
      category: "High Sodium",
      riskLevel: "Moderate",
      description: `Elevated sodium levels (${sodiumVal}mg per 100g). Monitor intake.`,
    });
  }

  const isVeg = !(
    lowerIng.includes("meat") ||
    lowerIng.includes("chicken") ||
    lowerIng.includes("beef") ||
    lowerIng.includes("fish") ||
    lowerIng.includes("gelatin")
  );

  return {
    barcode,
    barcodeType: barcode.length === 12 ? "UPC-A" : "EAN-13",
    productName: String(off.product_name || off.product_name_en || "Scanned Food Product"),
    brand: String(off.brands || "Food Brand"),
    category: String(off.categories || "Packaged Foods"),
    countryOfOrigin: String(off.countries || "International"),
    netWeight: String(off.quantity || `${servingGrams}g`),
    servingSize: servingSizeStr,
    baseServingGrams: servingGrams,
    imageUrl: (off.image_url as string) || (off.image_front_url as string) || null,
    isVeg,
    isOrganic: lowerIng.includes("organic") || lowerIng.includes("bio"),
    dietaryBadges: isVeg ? ["Vegetarian"] : ["Non-Vegetarian"],
    healthScore,
    healthGrade,
    aiRecommendation:
      healthScore >= 75
        ? "Nutritious option with favorable macro balance. Suitable for everyday nutrition."
        : "Moderate nutritional quality. Enjoy mindfully within your daily caloric budget.",
    aiHealthAnalysisText: `This item provides ${cal100g} kcal and ${proG}g protein per 100g. Sourced directly from OpenFoodFacts verified food database.`,
    nutrition: {
      calories: { per100g: cal100g, perServing: Math.round(cal100g * ratio), unit: "kcal" },
      protein: { per100g: proG, perServing: Math.round(proG * ratio * 10) / 10, unit: "g" },
      carbs: { per100g: carbG, perServing: Math.round(carbG * ratio * 10) / 10, unit: "g" },
      fat: { per100g: fatG, perServing: Math.round(fatG * ratio * 10) / 10, unit: "g" },
      sugar: createMacroGram("sugars_100g", "sugars"),
      fiber: createMacroGram("fiber_100g", "fiber"),
      saturatedFat: createMacroGram("saturated-fat_100g", "saturated-fat"),
      transFat: createMacroGram("trans-fat_100g", "trans-fat"),
      sodium: createSodiumMg(),
      potassium: createMineralMg("potassium_100g", "potassium"),
      calcium: createMineralMg("calcium_100g", "calcium"),
      iron: createIronMg("iron_100g", "iron"),
      vitaminA: createVitaminMcg("vitamin-a_100g", "vitamin-a"),
      vitaminC: createVitaminMg("vitamin-c_100g", "vitamin-c"),
      vitaminD: createVitaminMcg("vitamin-d_100g", "vitamin-d"),
      vitaminB12: createVitaminMcg("vitamin-b12_100g", "vitamin-b12"),
      cholesterol: createMineralMg("cholesterol_100g", "cholesterol"),
    },
    ingredientsList,
    ingredientRisks,
    personalizedAnalysis: {
      weightLoss: {
        suitable: cal100g < 250,
        reason:
          cal100g < 250 ? "Moderate caloric density." : "High caloric density, control portions.",
      },
      muscleGain: {
        suitable: proG >= 10,
        reason: proG >= 10 ? "Provides good dietary protein." : "Low protein content.",
      },
      diabetes: {
        suitable: sugars100g < 5,
        reason:
          sugars100g < 5
            ? "Low simple sugar content."
            : "Contains sugars that may impact glycemic load.",
      },
      heartHealth: {
        suitable: fatG < 10,
        reason: fatG < 10 ? "Low fat profile." : "Moderate fat profile.",
      },
      children: {
        suitable: ingredientRisks.length === 0,
        reason: "Nutrient profile evaluated for growing children.",
      },
      elderly: {
        suitable: true,
        reason: "Standard digestion profile.",
      },
      dailyUse: {
        suitable: healthScore >= 60,
        reason:
          healthScore >= 60
            ? "Balanced profile for regular consumption."
            : "Best consumed occasionally.",
      },
    },
    alternatives: [],
  };
}

export const Route = createFileRoute("/api/barcode")({
  server: {
    handlers: {
      GET: () => {
        return Response.json(
          { error: "Method Not Allowed. Please send a POST request with barcode or OCR images." },
          { status: 405 },
        );
      },
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { barcode, ocrImages, userProfile } = body || {};

          let offProduct: Record<string, unknown> | null = null;
          const cleanBarcode = barcode ? String(barcode).trim() : "";

          // 1. Try OpenFoodFacts if barcode provided
          if (cleanBarcode) {
            offProduct = await fetchOpenFoodFacts(cleanBarcode);
          }

          // 2. Check built-in local catalog fallback
          const builtinMatch = BUILTIN_BARCODE_CATALOG[cleanBarcode];

          // 3. Prepare Gemini AI prompt context
          const apiKey = getGeminiApiKey();

          const contentsParts: Array<{
            inlineData?: { data: string; mimeType: string };
            text?: string;
          }> = [];

          let userContextPrompt = "";
          if (userProfile) {
            userContextPrompt = `\nUser Profile Context for Personalized Analysis:
- Age: ${userProfile.age || 28}, Gender: ${userProfile.gender || "male"}
- Height: ${userProfile.height_cm || 175}cm, Weight: ${userProfile.weight_kg || 70}kg
- Fitness Goal: ${userProfile.goal || "weight_loss"}
- BMI: ${userProfile.extended_data?.bmi || "22.8"}
- BMR: ${userProfile.extended_data?.bmr || "1650"} kcal, TDEE: ${userProfile.extended_data?.tdee || "2200"} kcal
- Health Flags / Allergies: ${userProfile.extended_data?.allergies?.join(", ") || "None"}
`;
          }

          if (ocrImages && Array.isArray(ocrImages) && ocrImages.length > 0) {
            for (const imgBase64 of ocrImages) {
              const base64Data = imgBase64.replace(/^data:image\/\w+;base64,/, "");
              contentsParts.push({
                inlineData: {
                  data: base64Data,
                  mimeType: "image/jpeg",
                },
              });
            }
            contentsParts.push({
              text: `Analyze these nutrition label / ingredient / product packaging photos using AI OCR. Extract or estimate full nutrition details, product name, brand, ingredient risks, and health scores.${userContextPrompt}`,
            });
          } else {
            let offText = "";
            if (offProduct) {
              offText = `\nOpenFoodFacts Live Data:
- Product Name: ${String(offProduct.product_name || offProduct.product_name_en || "")}
- Brand: ${String(offProduct.brands || "")}
- Categories: ${String(offProduct.categories || "")}
- Ingredients: ${String(offProduct.ingredients_text || "")}
- Nutriments 100g: ${JSON.stringify(offProduct.nutriments || {})}
- Image: ${String(offProduct.image_url || offProduct.image_front_url || "")}
- Nutriscore: ${String(offProduct.nutriscore_grade || "")}
`;
            }

            let builtinText = "";
            if (builtinMatch) {
              builtinText = `\nBuilt-in Catalog Hint: ${JSON.stringify(builtinMatch)}`;
            }

            contentsParts.push({
              text: `Product Barcode: ${cleanBarcode || "Unknown"}
${offText}
${builtinText}
${userContextPrompt}

Analyze this product thoroughly. Ensure exact values for calories, protein, carbs, fat, sugar, fiber, sodium, potassium, calcium, iron, vitamins, ingredient risks, health grade (A+ to E), health score (0-100), and custom profile suitability. Return JSON strictly matching requested schema.`,
            });
          }

          let content = "{}";

          // Method A: Direct GoogleGenAI SDK
          if (apiKey) {
            try {
              const ai = new GoogleGenAI({
                apiKey,
                httpOptions: { headers: { "User-Agent": "aistudio-build" } },
              });

              const candidateModels = [
                "gemini-2.5-flash",
                "gemini-flash-latest",
                "gemini-2.5-pro",
                "gemini-3.7-flash",
                "gemini-3.1-flash-lite",
              ];
              for (const modelName of candidateModels) {
                try {
                  const response = await ai.models.generateContent({
                    model: modelName,
                    contents: { parts: contentsParts },
                    config: {
                      systemInstruction: SYSTEM_PROMPT,
                      responseMimeType: "application/json",
                      temperature: 0.2,
                    },
                  });
                  if (response && response.text) {
                    content = response.text;
                    break;
                  }
                } catch (err) {
                  const msg = err instanceof Error ? err.message : String(err);
                  const isCapacityError =
                    msg.includes("503") ||
                    msg.includes("429") ||
                    msg.includes("UNAVAILABLE") ||
                    msg.includes("high demand");
                  if (isCapacityError) {
                    console.info(
                      `[/api/barcode] Model ${modelName} is at capacity. Transitioning to next model...`,
                    );
                  } else {
                    console.warn(`[/api/barcode] Model ${modelName} notice:`, msg);
                  }
                }
                if (content !== "{}") break;
              }
            } catch (aiInitErr) {
              console.warn("[/api/barcode] GoogleGenAI init error:", aiInitErr);
            }
          }

          // Method B: Lovable AI Gateway Fallback (if direct Gemini is unavailable/failed)
          if (content === "{}" && process.env.LOVABLE_API_KEY) {
            try {
              const promptText = contentsParts
                .map((p) => p.text)
                .filter(Boolean)
                .join("\n\n");
              const completion = (await gatewayChatCompletion({
                model: "google/gemini-2.5-flash",
                messages: [
                  { role: "system", content: SYSTEM_PROMPT },
                  {
                    role: "user",
                    content: promptText || "Analyze food barcode and provide JSON nutrition facts.",
                  },
                ],
                response_format: { type: "json_object" },
              })) as { choices?: Array<{ message?: { content?: string } }> };

              if (completion?.choices?.[0]?.message?.content) {
                content = completion.choices[0].message.content;
              }
            } catch (gwErr) {
              console.warn("[/api/barcode] Gateway fallback error:", gwErr);
            }
          }

          // Method C: If AI unavailable or returned empty, check OpenFoodFacts / Builtin
          if (content === "{}" || !content) {
            if (offProduct && cleanBarcode) {
              const directOffAnalysis = buildAnalysisFromOpenFoodFacts(cleanBarcode, offProduct);
              return Response.json(directOffAnalysis);
            }
            if (builtinMatch) {
              return Response.json(builtinMatch);
            }
            return Response.json(
              {
                error:
                  "Could not locate product details. Please try packaging OCR mode or enter barcode manually.",
              },
              { status: 404 },
            );
          }

          let parsed: FullProductAnalysis;
          try {
            parsed = JSON.parse(content);
          } catch {
            if (offProduct && cleanBarcode) {
              return Response.json(buildAnalysisFromOpenFoodFacts(cleanBarcode, offProduct));
            }
            if (builtinMatch) {
              return Response.json(builtinMatch);
            }
            return Response.json(
              { error: "Failed to parse product analysis output." },
              { status: 500 },
            );
          }

          // Ensure fallback defaults if model skipped any sub-field
          if (!parsed.barcode) parsed.barcode = cleanBarcode || "0000000000000";
          if (!parsed.barcodeType)
            parsed.barcodeType = cleanBarcode.length === 12 ? "UPC-A" : "EAN-13";
          if (!parsed.productName)
            parsed.productName =
              builtinMatch?.productName ||
              (offProduct?.product_name as string) ||
              "Scanned Food Item";
          if (!parsed.brand)
            parsed.brand = builtinMatch?.brand || (offProduct?.brands as string) || "Generic Brand";
          if (!parsed.healthScore) parsed.healthScore = builtinMatch?.healthScore || 70;
          if (!parsed.healthGrade) parsed.healthGrade = builtinMatch?.healthGrade || "B";

          // Ensure nutrition object is complete and valid with calibrated numbers
          const cleanNutrient = (
            raw: Partial<NutrientInfo> | undefined,
            defaultPer100g: number,
            unit: string,
            roundDecimals: number = 1,
          ): NutrientInfo => {
            const num100 =
              typeof raw?.per100g === "number" && !isNaN(raw.per100g)
                ? raw.per100g
                : defaultPer100g;
            const factor = Math.pow(10, roundDecimals);
            const p100 =
              roundDecimals === 0 ? Math.round(num100) : Math.round(num100 * factor) / factor;
            const numServing =
              typeof raw?.perServing === "number" && !isNaN(raw.perServing) ? raw.perServing : p100;
            const pServing =
              roundDecimals === 0
                ? Math.round(numServing)
                : Math.round(numServing * factor) / factor;
            return {
              per100g: Math.max(0, p100),
              perServing: Math.max(0, pServing),
              unit: raw?.unit || unit,
            };
          };

          const rawNut = parsed.nutrition || ({} as Partial<FullProductAnalysis["nutrition"]>);
          const pProtein = cleanNutrient(rawNut.protein, 5, "g", 1);
          const pCarbs = cleanNutrient(rawNut.carbs, 20, "g", 1);
          const pFat = cleanNutrient(rawNut.fat, 5, "g", 1);

          let pCalories = cleanNutrient(rawNut.calories, 150, "kcal", 0);
          const atwaterKcal = Math.round(
            pProtein.per100g * 4 + pCarbs.per100g * 4 + pFat.per100g * 9,
          );
          if (
            pCalories.per100g <= 0 ||
            (atwaterKcal > 10 && Math.abs(pCalories.per100g - atwaterKcal) > atwaterKcal * 0.5)
          ) {
            pCalories = {
              per100g: atwaterKcal,
              perServing: Math.round(
                pProtein.perServing * 4 + pCarbs.perServing * 4 + pFat.perServing * 9,
              ),
              unit: "kcal",
            };
          }

          parsed.nutrition = {
            calories: pCalories,
            protein: pProtein,
            carbs: pCarbs,
            fat: pFat,
            sugar: cleanNutrient(rawNut.sugar, 5, "g", 1),
            fiber: cleanNutrient(rawNut.fiber, 2, "g", 1),
            saturatedFat: cleanNutrient(rawNut.saturatedFat, 1, "g", 1),
            transFat: cleanNutrient(rawNut.transFat, 0, "g", 1),
            sodium: cleanNutrient(rawNut.sodium, 150, "mg", 0),
            potassium: cleanNutrient(rawNut.potassium, 100, "mg", 0),
            calcium: cleanNutrient(rawNut.calcium, 50, "mg", 0),
            iron: cleanNutrient(rawNut.iron, 1, "mg", 1),
            vitaminA: cleanNutrient(rawNut.vitaminA, 0, "mcg", 0),
            vitaminC: cleanNutrient(rawNut.vitaminC, 0, "mg", 1),
            vitaminD: cleanNutrient(rawNut.vitaminD, 0, "mcg", 1),
            vitaminB12: cleanNutrient(rawNut.vitaminB12, 0, "mcg", 1),
            cholesterol: cleanNutrient(rawNut.cholesterol, 0, "mg", 0),
          };

          return Response.json(parsed);
        } catch (error) {
          console.error("[/api/barcode] Server error:", error);
          return Response.json(
            { error: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 500 },
          );
        }
      },
    },
  },
});
