import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { GoogleGenAI, Type } from "@google/genai";
import { getGeminiApiKey } from "./ai-gateway.server";

const RecipeGenInput = z.object({
  mealType: z.enum(["Breakfast", "Lunch", "Dinner", "Snack"]),
  dietType: z.enum(["veg", "non_veg", "eggetarian", "vegan", "both"]).default("both"),
  goal: z.string().default("Maintenance"),
  budgetLimit: z.number().default(100),
  allergies: z.array(z.string()).default([]),
  dislikedFoods: z.array(z.string()).default([]),
  likedFoods: z.array(z.string()).default([]),
  count: z.number().min(1).max(3).default(2),
});

export interface AIRawRecipeResponse {
  name: string;
  diet_type: "veg" | "non_veg" | "eggetarian" | "vegan";
  ingredients: Array<{ name: string; quantity: number; unit: string; estimated_cost?: number }>;
  steps: string[];
  prep_minutes: number;
  estimated_cost?: number;
  cuisine: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
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
}

export interface AIRecipeFunctionResult {
  recipes: AIRawRecipeResponse[];
  isFallbackToLocal: boolean;
  geminiRequestMs?: number;
  geminiParseMs?: number;
}

export const generateAIRecipes = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => RecipeGenInput.parse(data))
  .handler(async ({ data }): Promise<AIRecipeFunctionResult> => {
    const apiKey = getGeminiApiKey();

    if (!apiKey) {
      console.warn(
        "[RecipeFunctions] No valid GEMINI_API_KEY found. Returning offline fallback flag.",
      );
      return { recipes: [], isFallbackToLocal: true, geminiRequestMs: 0, geminiParseMs: 0 };
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { "User-Agent": "aistudio-build" } },
      });
      const prompt = `You are a professional chef creating delicious, personalized recipes.
Generate ${data.count} distinct ${data.mealType} recipes matching these constraints:
- Diet Type: ${data.dietType}
- User Goal: ${data.goal}
- Allergies to STRICTLY AVOID: ${data.allergies.length ? data.allergies.join(", ") : "None"}
- Disliked ingredients to AVOID: ${data.dislikedFoods.length ? data.dislikedFoods.join(", ") : "None"}
- Preferred ingredients to INCLUDE: ${data.likedFoods.length ? data.likedFoods.join(", ") : "Healthy balanced options"}

STRICT REQUIREMENTS:
1. Ingredients: Provide 4 to 6 specific, real ingredients with realistic quantities & units (g, ml, piece, tbsp).
2. Steps: Provide 4 to 6 clear step-by-step cooking instructions.
3. Cost: Estimated realistic cost in INR (₹) per serving.

Return ONLY a valid JSON array of objects adhering strictly to this format:
[
  {
    "name": "High Protein Paneer & Quinoa Bowl",
    "diet_type": "${data.dietType === "both" ? "veg" : data.dietType}",
    "prep_minutes": 20,
    "cuisine": "Indian",
    "difficulty": "Easy",
    "estimated_cost": 65,
    "tags": ["High Protein", "Clean Eating"],
    "ingredients": [
      { "name": "Fresh Cottage Cheese (Paneer)", "quantity": 120, "unit": "g" },
      { "name": "Cooked Quinoa", "quantity": 100, "unit": "g" },
      { "name": "Steamed Broccoli & Peppers", "quantity": 80, "unit": "g" },
      { "name": "Greek Yogurt Dressing", "quantity": 40, "unit": "g" }
    ],
    "steps": [
      "Dice paneer into small cubes and toss with spices.",
      "Lightly pan-sear paneer until golden.",
      "Assemble cooked quinoa, paneer, and vegetables in a bowl.",
      "Drizzle with dressing and serve warm."
    ]
  }
]`;

      const geminiStart = performance.now();
      const candidateModels = ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.7-flash"];
      let response = null;

      for (const modelName of candidateModels) {
        try {
          response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              systemInstruction:
                "You are a fast, precise chef. Output appetizing recipes as JSON strictly following the prompt schema.",
              temperature: 0.7,
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    diet_type: { type: Type.STRING },
                    prep_minutes: { type: Type.NUMBER },
                    cuisine: { type: Type.STRING },
                    difficulty: { type: Type.STRING },
                    estimated_cost: { type: Type.NUMBER },
                    tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                    ingredients: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          quantity: { type: Type.NUMBER },
                          unit: { type: Type.STRING },
                          estimated_cost: { type: Type.NUMBER },
                        },
                        required: ["name", "quantity", "unit"],
                      },
                    },
                    steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: [
                    "name",
                    "diet_type",
                    "prep_minutes",
                    "cuisine",
                    "difficulty",
                    "ingredients",
                    "steps",
                  ],
                },
              },
            },
          });
          if (response && response.text) break;
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          const isCapacityError =
            msg.includes("503") ||
            msg.includes("429") ||
            msg.includes("UNAVAILABLE") ||
            msg.includes("high demand");
          if (isCapacityError) {
            console.info(
              `[RecipeFunctions] Model ${modelName} is at capacity. Transitioning to next model...`,
            );
          } else {
            console.warn(`[RecipeFunctions] Model ${modelName} notice:`, msg);
          }
        }
        if (response && response.text) break;
      }
      const geminiRequestMs = Math.round(performance.now() - geminiStart);

      const parseStart = performance.now();
      let rawText = response?.text || "[]";
      // Clean up markdown code block formatting and control characters
      rawText = rawText
        .replace(/^```(json)?\s*/i, "")
        .replace(/```\s*$/, "")
        .trim();

      let parsed: AIRawRecipeResponse[] = [];
      try {
        parsed = JSON.parse(rawText) as AIRawRecipeResponse[];
      } catch {
        // Attempt JSON repair for trailing commas or minor syntax flaws
        try {
          const cleanedText = rawText.replace(/,\s*([\]}])/g, "$1"); // strip trailing commas
          parsed = JSON.parse(cleanedText) as AIRawRecipeResponse[];
        } catch (jsonErr2) {
          console.warn("[RecipeFunctions] JSON repair fallback parsing failed:", jsonErr2);
          const arrayMatch = rawText.match(/\[\s*\{[\s\S]*\}\s*\]/);
          if (arrayMatch) {
            try {
              parsed = JSON.parse(
                arrayMatch[0].replace(/,\s*([\]}])/g, "$1"),
              ) as AIRawRecipeResponse[];
            } catch {
              parsed = [];
            }
          }
        }
      }
      const geminiParseMs = Math.round(performance.now() - parseStart);

      console.log(
        `[Gemini Server Performance] Request: ${geminiRequestMs}ms | Response Parsing: ${geminiParseMs}ms`,
      );

      return {
        recipes: Array.isArray(parsed) ? parsed : [],
        isFallbackToLocal: false,
        geminiRequestMs,
        geminiParseMs,
      };
    } catch (err) {
      console.error("[RecipeFunctions] Error generating recipes with Gemini:", err);
      return { recipes: [], isFallbackToLocal: true, geminiRequestMs: 0, geminiParseMs: 0 };
    }
  });
