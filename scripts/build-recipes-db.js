/**
 * Dev-time Data Acquisition & Build Script for Nutrilens AI
 *
 * RUNTIME ENV: Node.js (Dev machine / CI build pipeline only)
 * DO NOT bundle this file into or call it from the React Native runtime app!
 *
 * Usage: node scripts/build-recipes-db.js
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");
const { URL } = require("url");

// Directories
const RAW_DIR = path.join(__dirname, "..", "data", "raw");
const ASSETS_DIR = path.join(__dirname, "..", "assets");

// Google Drive File Configuration
const DRIVE_FILES = [
  {
    name: "recipes_indian.csv",
    id: "1fC-uzATsRLCiXH43hmqh0uSJsX38Naxa",
    dest: path.join(RAW_DIR, "recipes_indian.csv"),
    isCsv: true,
    cuisineDefault: "indian",
  },
  {
    name: "recipes_clean.csv",
    id: "11C0ScuK-b-LUk-AlWKnVGwk7rtdU0E4z",
    dest: path.join(RAW_DIR, "recipes_clean.csv"),
    isCsv: true,
    cuisineDefault: "global",
  },
  {
    name: "fooddata.db",
    id: "11WfVQDWH9enpm_q6FolXvCNSuRUThXXf",
    dest: path.join(RAW_DIR, "fooddata.db"),
    isCsv: false,
  },
];

// Ensure local directories exist
function ensureDirs() {
  if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });
  if (!fs.existsSync(ASSETS_DIR)) fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

/**
 * Downloads a file from Google Drive handling large-file confirmation tokens
 */
async function downloadFromDrive(fileId, destPath) {
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1024) {
    console.log(`[SKIP] File already downloaded: ${path.basename(destPath)}`);
    return;
  }

  console.log(`[DOWNLOADING] File ID ${fileId} -> ${path.basename(destPath)}...`);

  const baseUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

  return new Promise((resolve, reject) => {
    const request = (url, cookies = []) => {
      const parsedUrl = new URL(url);
      const options = {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Cookie: cookies.join("; "),
        },
      };

      const req = https.get(options, (res) => {
        // Collect cookies
        const newCookies = res.headers["set-cookie"]
          ? res.headers["set-cookie"].map((c) => c.split(";")[0])
          : cookies;

        // Follow redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          let redirectUrl = res.headers.location;
          if (!redirectUrl.startsWith("http")) {
            redirectUrl = `https://${parsedUrl.hostname}${redirectUrl}`;
          }
          return request(redirectUrl, newCookies);
        }

        // Check if virus scan confirmation interstitial is returned
        const contentType = res.headers["content-type"] || "";
        if (contentType.includes("text/html")) {
          let body = "";
          res.on("data", (chunk) => (body += chunk));
          res.on("end", () => {
            // Match confirmation code
            const confirmMatch =
              body.match(/confirm=([a-zA-Z0-9_]+)/) ||
              body.match(/name="confirm" value="([a-zA-Z0-9_]+)"/);
            if (confirmMatch && confirmMatch[1]) {
              const confirmToken = confirmMatch[1];
              const confirmUrl = `${baseUrl}&confirm=${confirmToken}`;
              console.log(`[CONFIRM] Handling Drive interstitial token: ${confirmToken}`);
              return request(confirmUrl, newCookies);
            } else {
              // Try direct confirm parameter
              const confirmUrl = `${baseUrl}&confirm=t`;
              return request(confirmUrl, newCookies);
            }
          });
          return;
        }

        // Stream file response to disk
        const fileStream = fs.createWriteStream(destPath);
        res.pipe(fileStream);

        fileStream.on("finish", () => {
          fileStream.close(() => {
            console.log(
              `[SUCCESS] Downloaded: ${path.basename(destPath)} (${fs.statSync(destPath).size} bytes)`,
            );
            resolve();
          });
        });

        fileStream.on("error", (err) => {
          fs.unlink(destPath, () => {});
          reject(err);
        });
      });

      req.on("error", reject);
    };

    request(baseUrl);
  });
}

// Portion & Weight conversions (Unit -> grams)
const UNIT_TO_GRAMS = {
  cup: 185,
  cups: 185,
  tbsp: 15,
  tablespoon: 15,
  tablespoons: 15,
  tsp: 5,
  teaspoon: 5,
  teaspoons: 5,
  g: 1,
  gram: 1,
  grams: 1,
  kg: 1000,
  oz: 28.35,
  ounce: 28.35,
  ounces: 28.35,
  lb: 453.6,
  pound: 453.6,
  pounds: 453.6,
  clove: 3,
  cloves: 3,
  pinch: 0.5,
  piece: 50,
  pieces: 50,
  slice: 30,
  slices: 30,
  handful: 25,
  can: 400,
  bunch: 100,
};

function parseIngredientGramWeight(ingredientStr) {
  if (!ingredientStr) return 100;
  const match = ingredientStr.match(/^([\d\.\/\s]+)\s*([a-zA-Z]+)?/);
  if (!match) return 100;

  let qty = 1;
  const rawQty = match[1].trim();
  if (rawQty.includes("/")) {
    const parts = rawQty.split("/");
    if (parts.length === 2 && parseFloat(parts[1]) !== 0) {
      qty = parseFloat(parts[0]) / parseFloat(parts[1]);
    }
  } else {
    qty = parseFloat(rawQty) || 1;
  }

  const unit = match[2] ? match[2].toLowerCase() : "";
  const gramPerUnit = UNIT_TO_GRAMS[unit] || 100;
  return Math.min(Math.max(qty * gramPerUnit, 5), 2000); // Clamped between 5g and 2000g
}

/**
 * Keyword Rule Definitions for Diet Classification
 */
const MEAT_KEYWORDS = [
  "chicken",
  "mutton",
  "lamb",
  "beef",
  "pork",
  "fish",
  "prawn",
  "prawns",
  "shrimp",
  "crab",
  "lobster",
  "salmon",
  "tuna",
  "anchovy",
  "meat",
  "bacon",
  "ham",
  "turkey",
  "duck",
  "seafood",
  "clam",
  "mussel",
  "squid",
  "octopus",
];

const EGG_KEYWORDS = ["egg", "eggs", "egg white", "egg yolk", "mayonnaise", "eggetarian"];

const DAIRY_KEYWORDS = [
  "milk",
  "paneer",
  "curd",
  "yogurt",
  "yoghurt",
  "ghee",
  "butter",
  "cheese",
  "cream",
  "whey",
  "buttermilk",
  "dahi",
  "makhana",
  "malai",
  "khoya",
  "condensed milk",
];

const ANIMAL_OTHER_KEYWORDS = ["honey", "gelatin", "lard", "tallow"];

/**
 * Infer Diet Type
 */
function inferDietType(ingredientsText, nerText) {
  const text = `${ingredientsText} ${nerText}`.toLowerCase();

  const hasMeat = MEAT_KEYWORDS.some((k) => new RegExp(`\\b${k}\\b`, "i").test(text));
  if (hasMeat) return "non_veg";

  const hasEgg = EGG_KEYWORDS.some((k) => new RegExp(`\\b${k}\\b`, "i").test(text));
  if (hasEgg) return "eggetarian";

  const hasDairy = DAIRY_KEYWORDS.some((k) => new RegExp(`\\b${k}\\b`, "i").test(text));
  const hasAnimalOther = ANIMAL_OTHER_KEYWORDS.some((k) =>
    new RegExp(`\\b${k}\\b`, "i").test(text),
  );

  if (hasDairy || hasAnimalOther) return "vegetarian";

  return "vegan"; // No animal products detected
}

/**
 * Infer Allergens
 */
const ALLERGEN_MAP = {
  peanut: ["peanut", "peanuts", "groundnut", "groundnuts"],
  tree_nuts: ["almond", "cashew", "walnut", "pistachio", "pecan", "hazelnut", "nut"],
  dairy: DAIRY_KEYWORDS,
  gluten: [
    "wheat",
    "maida",
    "atta",
    "flour",
    "barley",
    "rye",
    "bread",
    "pasta",
    "semolina",
    "rava",
    "sooji",
  ],
  soy: ["soy", "soya", "tofu", "edamame", "soy sauce"],
  shellfish: ["prawn", "prawns", "shrimp", "crab", "lobster", "clam", "mussel", "oyster"],
  sesame: ["sesame", "til", "tahini"],
};

function inferAllergens(ingredientsText, nerText) {
  const text = `${ingredientsText} ${nerText}`.toLowerCase();
  const detected = [];

  for (const [allergen, keywords] of Object.entries(ALLERGEN_MAP)) {
    if (keywords.some((k) => new RegExp(`\\b${k}\\b`, "i").test(text))) {
      detected.push(allergen);
    }
  }

  return detected.join(",");
}

/**
 * Infer Meal Type
 */
function inferMealType(title, ingredientsText) {
  const text = `${title} ${ingredientsText}`.toLowerCase();

  if (
    /\b(pancake|waffle|cereal|oatmeal|toast|omelet|dosa|idli|poha|paratha|upma|smoothie|scramble|breakfast)\b/i.test(
      text,
    )
  ) {
    return "breakfast";
  }
  if (
    /\b(tikki|pakora|samosa|chaat|cutlet|dip|chip|biscuit|muffin|popcorn|kabab|snack|cookie|cracker)\b/i.test(
      text,
    )
  ) {
    return "snack";
  }
  if (
    /\b(curry|biryani|rice|dal|pasta|soup|roast|stir fry|casserole|stew|wrap|taco|pizza|lunch|dinner|thali)\b/i.test(
      text,
    )
  ) {
    return "lunch"; // can double for dinner
  }

  return null; // any / unspecified
}

/**
 * Helper to safely parse python stringified list e.g. "['1 cup rice', '2 tbsp oil']"
 */
function parsePythonStringList(str) {
  if (!str) return [];
  try {
    // Attempt standard JSON parse first
    return JSON.parse(str);
  } catch (e) {
    try {
      // Replace single quotes with double quotes
      const normalized = str
        .replace(/'/g, '"')
        .replace(/None/g, "null")
        .replace(/True/g, "true")
        .replace(/False/g, "false");
      return JSON.parse(normalized);
    } catch (e2) {
      // Fallback regex match for comma separated quoted strings
      const matches = str.match(/(?:"|')([^"']+)(?:"|')/g);
      if (matches) {
        return matches.map((m) => m.replace(/^['"]|['"]$/g, "").trim());
      }
      return [str];
    }
  }
}

/**
 * MAIN EXECUTION (Step 0 + Step 1)
 */
async function main() {
  console.log("========================================================");
  console.log("NUTRILENS AI — OFFLINE RECIPE DATABASE BUILDER");
  console.log("========================================================\n");

  ensureDirs();

  // STEP 0: Acquire raw files
  for (const fileConf of DRIVE_FILES) {
    await downloadFromDrive(fileConf.id, fileConf.dest);
  }

  console.log("\n[STEP 1] Initializing SQLite Engine & Processing CSV Datasets...");

  // Initialize sql.js for Node.js build pipeline
  const initSqlJs = require("sql.js");
  const SQL = await initSqlJs();

  // Load fooddata.db
  const foodDataBuffer = fs.readFileSync(path.join(RAW_DIR, "fooddata.db"));
  const foodDb = new SQL.Database(foodDataBuffer);

  // Create target assets/recipes.db
  const targetDb = new SQL.Database();

  // Create `recipes` table schema
  targetDb.run(`
    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      cuisine TEXT,
      diet_type TEXT NOT NULL,
      meal_type TEXT,
      ingredients TEXT NOT NULL,
      directions TEXT NOT NULL,
      ingredient_count INTEGER,
      calories REAL NOT NULL,
      protein REAL NOT NULL,
      carbs REAL NOT NULL,
      fat REAL NOT NULL,
      fiber REAL DEFAULT 0,
      sugar REAL DEFAULT 0,
      sodium REAL DEFAULT 0,
      allergens TEXT,
      source TEXT,
      link TEXT,
      nutrition_confidence TEXT DEFAULT 'estimated'
    );

    CREATE INDEX IF NOT EXISTS idx_recipes_diet ON recipes(diet_type);
    CREATE INDEX IF NOT EXISTS idx_recipes_meal ON recipes(meal_type);
    CREATE INDEX IF NOT EXISTS idx_recipes_cuisine ON recipes(cuisine);
    CREATE INDEX IF NOT EXISTS idx_recipes_macros ON recipes(calories, protein);
  `);

  let totalProcessed = 0;
  let exactNutritionMatches = 0;
  let defaultNutritionFallbacks = 0;
  const dietCounts = { vegan: 0, vegetarian: 0, eggetarian: 0, non_veg: 0 };

  // Prepare SQLite insert statement
  const insertStmt = targetDb.prepare(`
    INSERT INTO recipes (
      title, cuisine, diet_type, meal_type, ingredients, directions,
      ingredient_count, calories, protein, carbs, fat, fiber, sugar, sodium,
      allergens, source, link, nutrition_confidence
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'estimated')
  `);

  // Helper to query nutrition from fooddata.db
  function getNutritionForNERItem(nerItem) {
    if (!nerItem) return null;
    const cleanKey = nerItem.trim().toLowerCase();

    // 1. Search search_dictionary first
    try {
      const dictRes = foodDb.exec(
        `SELECT f.calories, f.protein, f.carbs, f.fat, f.fiber, f.sugar, f.sodium 
         FROM search_dictionary s 
         JOIN foods f ON s.fdc_id = f.fdc_id 
         WHERE s.keyword = ? LIMIT 1`,
        [cleanKey],
      );
      if (dictRes.length > 0 && dictRes[0].values.length > 0) {
        const v = dictRes[0].values[0];
        return {
          calories: v[0],
          protein: v[1],
          carbs: v[2],
          fat: v[3],
          fiber: v[4],
          sugar: v[5],
          sodium: v[6],
        };
      }
    } catch (e) {}

    // 2. Fallback to LIKE query on foods description
    try {
      const foodsRes = foodDb.exec(
        `SELECT calories, protein, carbs, fat, fiber, sugar, sodium 
         FROM foods 
         WHERE description LIKE ? LIMIT 1`,
        [`%${cleanKey}%`],
      );
      if (foodsRes.length > 0 && foodsRes[0].values.length > 0) {
        const v = foodsRes[0].values[0];
        return {
          calories: v[0],
          protein: v[1],
          carbs: v[2],
          fat: v[3],
          fiber: v[4],
          sugar: v[5],
          sodium: v[6],
        };
      }
    } catch (e) {}

    return null;
  }

  // Simple CSV Parser handling quoted fields
  function parseCsvContent(content) {
    const lines = content.split(/\r?\n/);
    if (lines.length === 0) return [];

    const rows = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < content.length; i++) {
      const char = content[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "\n" && !inQuotes) {
        if (current.trim()) rows.push(current);
        current = "";
      } else {
        current += char;
      }
    }
    if (current.trim()) rows.push(current);

    return rows;
  }

  targetDb.run("BEGIN TRANSACTION;");

  for (const fileConf of DRIVE_FILES) {
    if (!fileConf.isCsv) continue;

    console.log(`\nProcessing ${fileConf.name}...`);
    const csvData = fs.readFileSync(fileConf.dest, "utf8");
    const rawLines = parseCsvContent(csvData);

    if (rawLines.length < 2) continue;

    // Header index mapping
    const header = rawLines[0].split(",").map((h) => h.replace(/^["']|["']$/g, "").trim());
    const titleIdx = header.indexOf("title");
    const ingIdx = header.indexOf("ingredients");
    const dirIdx = header.indexOf("directions");
    const nerIdx = header.indexOf("NER");
    const linkIdx = header.indexOf("link");
    const sourceIdx = header.indexOf("source");

    for (let i = 1; i < rawLines.length; i++) {
      const line = rawLines[i];
      // Regex CSV row splitter
      const cols = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(",");

      const title = cols[titleIdx] ? cols[titleIdx].replace(/^["']|["']$/g, "").trim() : "";
      if (!title || title === "title") continue;

      const rawIngredients = cols[ingIdx] ? cols[ingIdx].replace(/^["']|["']$/g, "").trim() : "[]";
      const rawDirections = cols[dirIdx] ? cols[dirIdx].replace(/^["']|["']$/g, "").trim() : "[]";
      const rawNer = cols[nerIdx] ? cols[nerIdx].replace(/^["']|["']$/g, "").trim() : "[]";
      const link = cols[linkIdx] ? cols[linkIdx].replace(/^["']|["']$/g, "").trim() : "";
      const source = cols[sourceIdx]
        ? cols[sourceIdx].replace(/^["']|["']$/g, "").trim()
        : fileConf.name;

      const nerList = parsePythonStringList(rawNer);
      const ingredientsList = parsePythonStringList(rawIngredients);
      const directionsList = parsePythonStringList(rawDirections);

      // Estimate nutrition by joining NER items with fooddata.db
      let totCal = 0,
        totPro = 0,
        totCarb = 0,
        totFat = 0,
        totFib = 0,
        totSug = 0,
        totSod = 0;
      let matchedCount = 0;

      for (let j = 0; j < nerList.length; j++) {
        const item = nerList[j];
        const ingRawStr = ingredientsList[j] || item;
        const gramWeight = parseIngredientGramWeight(ingRawStr);
        const scale = gramWeight / 100;

        const nut = getNutritionForNERItem(item);
        if (nut) {
          matchedCount++;
          totCal += (nut.calories || 0) * scale;
          totPro += (nut.protein || 0) * scale;
          totCarb += (nut.carbs || 0) * scale;
          totFat += (nut.fat || 0) * scale;
          totFib += (nut.fiber || 0) * scale;
          totSug += (nut.sugar || 0) * scale;
          totSod += (nut.sodium || 0) * scale;
        } else {
          // Fallback baseline estimation for unmapped ingredient
          totCal += 120 * scale;
          totPro += 4 * scale;
          totCarb += 15 * scale;
          totFat += 3 * scale;
        }
      }

      if (matchedCount > 0) exactNutritionMatches++;
      else defaultNutritionFallbacks++;

      // Reasonable per-meal sanity bounds
      const calories = Math.max(Math.min(Math.round(totCal), 1800), 120);
      const protein = Math.max(Math.min(Math.round(totPro), 120), 3);
      const carbs = Math.max(Math.min(Math.round(totCarb), 200), 5);
      const fat = Math.max(Math.min(Math.round(totFat), 100), 2);
      const fiber = Math.round(totFib * 10) / 10;
      const sugar = Math.round(totSug * 10) / 10;
      const sodium = Math.round(totSod);

      const dietType = inferDietType(rawIngredients, rawNer);
      dietCounts[dietType] = (dietCounts[dietType] || 0) + 1;

      const allergens = inferAllergens(rawIngredients, rawNer);
      const mealType = inferMealType(title, rawIngredients);

      insertStmt.run([
        title,
        fileConf.cuisineDefault,
        dietType,
        mealType,
        JSON.stringify(ingredientsList),
        JSON.stringify(directionsList),
        nerList.length || ingredientsList.length,
        calories,
        protein,
        carbs,
        fat,
        fiber,
        sugar,
        sodium,
        allergens,
        source,
        link,
      ]);

      totalProcessed++;
    }
  }

  targetDb.run("COMMIT;");

  // Save compiled sqlite binary to assets/recipes.db
  const binaryArray = targetDb.export();
  const targetPath = path.join(ASSETS_DIR, "recipes.db");
  fs.writeFileSync(targetPath, Buffer.from(binaryArray));

  console.log("\n========================================================");
  console.log("BUILD COMPLETE!");
  console.log(`- Bundled DB saved to: ${targetPath}`);
  console.log(`- Total Recipes Compiled: ${totalProcessed}`);
  console.log(`- Exact USDA Nutrition Matches: ${exactNutritionMatches}`);
  console.log(`- Baseline Fallbacks: ${defaultNutritionFallbacks}`);
  console.log("- Diet Type Distribution:", dietCounts);
  console.log("========================================================\n");
}

main().catch((err) => {
  console.error("Fatal Error during build:", err);
  process.exit(1);
});
