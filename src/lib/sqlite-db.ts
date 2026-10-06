import type { Database } from "sql.js";
import { LocalMeal, LocalProfile } from "./local-store";
export type { LocalMeal, LocalProfile };

const SQLITE_STORAGE_KEY = "nutrilens_sqlite_db_v1";

let dbInstance: Database | null = null;
let isInitializing = false;
let initPromise: Promise<Database | null> | null = null;

// Helper to save SQLite binary DB buffer into localStorage/IndexedDB
export function persistDatabase(db: Database) {
  if (typeof window === "undefined") return;
  try {
    const data = db.export();
    // Convert Uint8Array to base64 safely in chunks to avoid call stack size exceeded
    const CHUNK_SIZE = 0x8000; // 32KB chunks
    let binary = "";
    for (let i = 0; i < data.length; i += CHUNK_SIZE) {
      const chunk = data.subarray(i, i + CHUNK_SIZE);
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }
    const base64 = btoa(binary);
    localStorage.setItem(SQLITE_STORAGE_KEY, base64);
  } catch (err) {
    console.warn("[SQLite] Persist error (quota or size):", err);
  }
}

// Helper to load binary DB buffer from localStorage
function loadPersistedDatabase(SQL: {
  Database: new (data: Uint8Array) => Database;
}): Database | null {
  if (typeof window === "undefined") return null;
  try {
    const base64 = localStorage.getItem(SQLITE_STORAGE_KEY);
    if (!base64) return null;
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new SQL.Database(bytes);
  } catch (err) {
    console.warn("[SQLite] Load persisted DB error:", err);
    return null;
  }
}

function isValidWasm(buffer: ArrayBuffer): boolean {
  if (!buffer || buffer.byteLength < 8) return false;
  const header = new Uint8Array(buffer, 0, 4);
  // WASM magic bytes: \0asm -> 0x00, 0x61, 0x73, 0x6d
  return header[0] === 0x00 && header[1] === 0x61 && header[2] === 0x73 && header[3] === 0x6d;
}

async function loadWasmBinary(): Promise<ArrayBuffer | null> {
  if (typeof window === "undefined") return null;
  let bundlerWasmUrl = "/sql-wasm.wasm";
  try {
    const mod = await import("sql.js/dist/sql-wasm.wasm?url");
    bundlerWasmUrl = mod.default || bundlerWasmUrl;
  } catch {
    // ignore
  }

  const urls = [
    bundlerWasmUrl,
    "/sql-wasm.wasm",
    "https://cdn.jsdelivr.net/npm/sql.js@1.14.1/dist/sql-wasm.wasm",
    "https://unpkg.com/sql.js@1.14.1/dist/sql-wasm.wasm",
    "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/sql-wasm.wasm",
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: "force-cache" });
      if (res.ok) {
        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("html") || contentType.includes("json")) {
          continue;
        }
        const buffer = await res.arrayBuffer();
        if (isValidWasm(buffer)) {
          return buffer;
        }
      }
    } catch {
      // try next URL
    }
  }
  return null;
}

export async function getSQLiteDB(): Promise<Database | null> {
  if (dbInstance) return dbInstance;
  if (typeof window === "undefined") return null;

  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      isInitializing = true;

      let initSqlJs: unknown;
      try {
        const mod = await import("sql.js");
        initSqlJs = mod.default || mod;
      } catch (err) {
        console.warn("[SQLite] Failed to dynamically load sql.js:", err);
        return null;
      }

      const getInitializer = () => {
        if (typeof initSqlJs === "function") return initSqlJs;
        const initObj = initSqlJs as unknown as { default?: typeof initSqlJs };
        if (typeof initObj?.default === "function") return initObj.default;
        return null;
      };

      const initFunc = getInitializer();
      if (!initFunc) {
        console.warn("[SQLite] initSqlJs function not available");
        return null;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let SQL: any;

      // Strategy 1: Load WASM binary as ArrayBuffer (most reliable across CORS/bundlers)
      const wasmBinary = await loadWasmBinary();
      if (wasmBinary) {
        try {
          SQL = await initFunc({ wasmBinary });
        } catch (wasmErr) {
          console.warn("[SQLite] initFunc with wasmBinary failed:", wasmErr);
        }
      }

      // Strategy 2: Fallback to locateFile with CDN URLs
      if (!SQL) {
        try {
          SQL = await initFunc({
            locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/sql.js@1.14.1/dist/${file}`,
          });
        } catch (urlErr) {
          console.warn("[SQLite] initFunc with locateFile failed:", urlErr);
          try {
            SQL = await initFunc({
              locateFile: (file: string) => `https://unpkg.com/sql.js@1.14.1/dist/${file}`,
            });
          } catch (cdnErr) {
            console.warn("[SQLite] CDN WASM init failed, trying unpkg:", cdnErr);
          }
        }
      }

      if (!SQL) {
        return null;
      }

      let db: Database | null = loadPersistedDatabase(SQL);

      if (!db) {
        db = new SQL.Database();
      }

      if (!db) return null;

      // Initialize Tables Schema
      db.run(`
        CREATE TABLE IF NOT EXISTS meals (
          id TEXT PRIMARY KEY,
          user_id TEXT,
          eaten_at TEXT,
          eaten_on TEXT,
          name TEXT,
          source TEXT,
          confidence REAL,
          serving_desc TEXT,
          calories REAL,
          protein_g REAL,
          carbs_g REAL,
          fat_g REAL,
          fiber_g REAL,
          sugar_g REAL,
          sodium_mg REAL,
          iron_mg REAL,
          calcium_mg REAL,
          magnesium_mg REAL,
          potassium_mg REAL,
          vit_a_ug REAL,
          vit_b12_ug REAL,
          vit_d_ug REAL,
          omega3_g REAL,
          synced INTEGER DEFAULT 0,
          updated_at TEXT
        );

        CREATE TABLE IF NOT EXISTS profile (
          user_id TEXT PRIMARY KEY,
          display_name TEXT,
          gender TEXT,
          age INTEGER,
          height_cm REAL,
          weight_kg REAL,
          goal_weight_kg REAL,
          activity TEXT,
          goal TEXT,
          diet TEXT,
          daily_calorie_target REAL,
          protein_target_g REAL,
          water_target_glasses REAL,
          extended_data TEXT,
          synced INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS water_logs (
          day TEXT PRIMARY KEY,
          glasses INTEGER,
          synced INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS steps_logs (
          day TEXT PRIMARY KEY,
          steps INTEGER DEFAULT 0,
          distance_km REAL DEFAULT 0,
          calories_burned REAL DEFAULT 0,
          active_minutes INTEGER DEFAULT 0,
          goal_completion REAL DEFAULT 0,
          last_updated TEXT,
          synced INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS daily_nutrition_summary (
          date TEXT PRIMARY KEY,
          total_calories REAL DEFAULT 0,
          total_protein REAL DEFAULT 0,
          total_carbs REAL DEFAULT 0,
          total_fat REAL DEFAULT 0,
          total_fiber REAL DEFAULT 0,
          total_sugar REAL DEFAULT 0,
          total_water REAL DEFAULT 0,
          vitamin_a REAL DEFAULT 0,
          vitamin_c REAL DEFAULT 0,
          vitamin_d REAL DEFAULT 0,
          vitamin_e REAL DEFAULT 0,
          vitamin_k REAL DEFAULT 0,
          vitamin_b1 REAL DEFAULT 0,
          vitamin_b2 REAL DEFAULT 0,
          vitamin_b3 REAL DEFAULT 0,
          vitamin_b5 REAL DEFAULT 0,
          vitamin_b6 REAL DEFAULT 0,
          vitamin_b7 REAL DEFAULT 0,
          vitamin_b9 REAL DEFAULT 0,
          vitamin_b12 REAL DEFAULT 0,
          calcium REAL DEFAULT 0,
          iron REAL DEFAULT 0,
          magnesium REAL DEFAULT 0,
          potassium REAL DEFAULT 0,
          sodium REAL DEFAULT 0,
          phosphorus REAL DEFAULT 0,
          zinc REAL DEFAULT 0,
          copper REAL DEFAULT 0,
          selenium REAL DEFAULT 0,
          manganese REAL DEFAULT 0,
          choline REAL DEFAULT 0,
          omega3 REAL DEFAULT 0,
          omega6 REAL DEFAULT 0,
          meal_count INTEGER DEFAULT 0,
          nutrition_score REAL DEFAULT 0,
          health_score REAL DEFAULT 0,
          goal_completion REAL DEFAULT 0,
          last_updated TEXT
        );

        CREATE TABLE IF NOT EXISTS sync_queue (
          id TEXT PRIMARY KEY,
          action TEXT,
          table_name TEXT,
          record_id TEXT,
          payload TEXT,
          created_at TEXT
        );
      `);

      dbInstance = db;
      persistDatabase(db);
      console.log("SQLite Database initialized successfully.");
      return db;
    } catch (err) {
      console.warn("[SQLite] Failed to load WASM SQLite, using local fallback store:", err);
      return null;
    } finally {
      isInitializing = false;
    }
  })();

  return initPromise;
}

// Synchronous / Async Helper Functions for SQLite operations

// In-memory caching for performance optimization
let inMemoryProfileCache: LocalProfile | null = null;
let inMemoryMealsDayCache: string | null = null;
let inMemoryMealsCache: LocalMeal[] | null = null;

export function invalidateProfileMemoryCache(): void {
  inMemoryProfileCache = null;
}

export function invalidateMealsMemoryCache(): void {
  inMemoryMealsDayCache = null;
  inMemoryMealsCache = null;
}

export async function saveMealToSQLite(meal: LocalMeal): Promise<void> {
  invalidateMealsMemoryCache();
  const db = await getSQLiteDB();
  if (!db) return;

  try {
    db.run(
      `INSERT OR REPLACE INTO meals (
        id, user_id, eaten_at, eaten_on, name, source, confidence, serving_desc,
        calories, protein_g, carbs_g, fat_g, fiber_g, sugar_g, sodium_mg,
        iron_mg, calcium_mg, magnesium_mg, potassium_mg, vit_a_ug, vit_b12_ug, vit_d_ug, omega3_g,
        synced, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)`,
      [
        meal.id,
        meal.user_id || "local_user",
        meal.eaten_at,
        meal.eaten_on,
        meal.name,
        meal.source || "manual",
        meal.confidence ?? null,
        meal.serving_desc ?? null,
        meal.calories,
        meal.protein_g,
        meal.carbs_g,
        meal.fat_g,
        meal.fiber_g,
        meal.sugar_g,
        meal.sodium_mg,
        meal.iron_mg ?? 0,
        meal.calcium_mg ?? 0,
        meal.magnesium_mg ?? 0,
        meal.potassium_mg ?? 0,
        meal.vit_a_ug ?? 0,
        meal.vit_b12_ug ?? 0,
        meal.vit_d_ug ?? 0,
        meal.omega3_g ?? 0,
        new Date().toISOString(),
      ],
    );

    // Queue for backend sync
    addToSyncQueue(db, "insert", "meals", meal.id, meal);
    persistDatabase(db);
  } catch (err) {
    console.error("[SQLite] Error saving meal:", err);
  }
}

export async function deleteMealFromSQLite(id: string): Promise<void> {
  invalidateMealsMemoryCache();
  const db = await getSQLiteDB();
  if (!db) return;

  try {
    db.run(`DELETE FROM meals WHERE id = ?`, [id]);
    addToSyncQueue(db, "delete", "meals", id, { id });
    persistDatabase(db);
  } catch (err) {
    console.error("[SQLite] Error deleting meal:", err);
  }
}

export async function getMealsFromSQLite(day?: string): Promise<LocalMeal[]> {
  if (day && inMemoryMealsDayCache === day && inMemoryMealsCache !== null) {
    return inMemoryMealsCache;
  }

  const db = await getSQLiteDB();
  if (!db) return [];

  try {
    let stmt;
    if (day) {
      stmt = db.prepare(`SELECT * FROM meals WHERE eaten_on = ? ORDER BY eaten_at DESC`);
      stmt.bind([day]);
    } else {
      stmt = db.prepare(`SELECT * FROM meals ORDER BY eaten_at DESC`);
    }

    const meals: LocalMeal[] = [];
    while (stmt.step()) {
      const row = stmt.getAsObject() as Record<string, unknown>;
      meals.push({
        id: String(row.id || ""),
        user_id: row.user_id ? String(row.user_id) : undefined,
        eaten_at: String(row.eaten_at || ""),
        eaten_on: String(row.eaten_on || ""),
        name: String(row.name || ""),
        source: (row.source as LocalMeal["source"]) || "manual",
        confidence: row.confidence ? Number(row.confidence) : undefined,
        serving_desc: row.serving_desc ? String(row.serving_desc) : null,
        calories: Number(row.calories || 0),
        protein_g: Number(row.protein_g || 0),
        carbs_g: Number(row.carbs_g || 0),
        fat_g: Number(row.fat_g || 0),
        fiber_g: Number(row.fiber_g || 0),
        sugar_g: Number(row.sugar_g || 0),
        sodium_mg: Number(row.sodium_mg || 0),
        iron_mg: Number(row.iron_mg || 0),
        calcium_mg: Number(row.calcium_mg || 0),
        magnesium_mg: Number(row.magnesium_mg || 0),
        potassium_mg: Number(row.potassium_mg || 0),
        vit_a_ug: Number(row.vit_a_ug || 0),
        vit_b12_ug: Number(row.vit_b12_ug || 0),
        vit_d_ug: Number(row.vit_d_ug || 0),
        omega3_g: Number(row.omega3_g || 0),
      });
    }
    stmt.free();

    if (day) {
      inMemoryMealsDayCache = day;
      inMemoryMealsCache = meals;
    }

    return meals;
  } catch (err) {
    console.error("[SQLite] Error fetching meals:", err);
    return [];
  }
}

export async function saveProfileToSQLite(profile: LocalProfile): Promise<void> {
  inMemoryProfileCache = profile;
  const db = await getSQLiteDB();
  if (!db) return;

  try {
    db.run(
      `INSERT OR REPLACE INTO profile (
        user_id, display_name, gender, age, height_cm, weight_kg, goal_weight_kg,
        activity, goal, diet, daily_calorie_target, protein_target_g, water_target_glasses,
        extended_data, synced
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      [
        profile.user_id || "local_user",
        profile.display_name,
        profile.gender,
        profile.age,
        profile.height_cm,
        profile.weight_kg,
        profile.goal_weight_kg,
        profile.activity,
        profile.goal,
        profile.diet,
        profile.daily_calorie_target,
        profile.protein_target_g,
        profile.water_target_glasses,
        JSON.stringify(profile.extended_data || {}),
      ],
    );

    addToSyncQueue(db, "upsert", "profile", profile.user_id || "local_user", profile);
    persistDatabase(db);
  } catch (err) {
    console.error("[SQLite] Error saving profile:", err);
  }
}

export async function getProfileFromSQLite(): Promise<LocalProfile | null> {
  if (inMemoryProfileCache !== null) {
    return inMemoryProfileCache;
  }

  const db = await getSQLiteDB();
  if (!db) return null;

  try {
    const stmt = db.prepare(`SELECT * FROM profile LIMIT 1`);
    if (stmt.step()) {
      const row = stmt.getAsObject() as Record<string, unknown>;
      stmt.free();
      const prof: LocalProfile = {
        user_id: row.user_id ? String(row.user_id) : undefined,
        display_name: String(row.display_name || ""),
        gender: String(row.gender || "other") as "male" | "female" | "other",
        age: Number(row.age || 25),
        height_cm: Number(row.height_cm || 170),
        weight_kg: Number(row.weight_kg || 70),
        goal_weight_kg: Number(row.goal_weight_kg || 70),
        activity: String(row.activity || "moderate"),
        goal: String(row.goal || "maintain"),
        diet: String(row.diet || "non_veg"),
        daily_calorie_target: Number(row.daily_calorie_target || 2000),
        protein_target_g: Number(row.protein_target_g || 120),
        water_target_glasses: Number(row.water_target_glasses || 8),
        onboarded: true,
        extended_data: row.extended_data ? JSON.parse(String(row.extended_data)) : {},
      };
      inMemoryProfileCache = prof;
      return prof;
    }
    stmt.free();
    return null;
  } catch (err) {
    console.error("[SQLite] Error getting profile:", err);
    return null;
  }
}

export async function saveWaterToSQLite(day: string, glasses: number): Promise<void> {
  const db = await getSQLiteDB();
  if (!db) return;

  try {
    db.run(`INSERT OR REPLACE INTO water_logs (day, glasses, synced) VALUES (?, ?, 0)`, [
      day,
      glasses,
    ]);
    addToSyncQueue(db, "upsert", "water_logs", day, { day, glasses });
    persistDatabase(db);
  } catch (err) {
    console.error("[SQLite] Error saving water log:", err);
  }
}

export interface DailyNutritionSummaryRecord {
  date: string;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  total_fiber: number;
  total_sugar: number;
  total_water: number;
  vitamin_a: number;
  vitamin_c: number;
  vitamin_d: number;
  vitamin_e: number;
  vitamin_k: number;
  vitamin_b1: number;
  vitamin_b2: number;
  vitamin_b3: number;
  vitamin_b5: number;
  vitamin_b6: number;
  vitamin_b7: number;
  vitamin_b9: number;
  vitamin_b12: number;
  calcium: number;
  iron: number;
  magnesium: number;
  potassium: number;
  sodium: number;
  phosphorus: number;
  zinc: number;
  copper: number;
  selenium: number;
  manganese: number;
  choline: number;
  omega3: number;
  omega6: number;
  meal_count: number;
  nutrition_score: number;
  health_score: number;
  goal_completion: number;
  last_updated: string;
}

export async function updateDailyNutritionSummaryInSQLite(
  day: string,
): Promise<DailyNutritionSummaryRecord | null> {
  const db = await getSQLiteDB();
  if (!db) return null;

  try {
    const meals = await getMealsFromSQLite(day);
    let glasses = 0;
    try {
      const stmt = db.prepare(`SELECT glasses FROM water_logs WHERE day = ?`);
      stmt.bind([day]);
      if (stmt.step()) {
        const row = stmt.getAsObject();
        glasses = Number(row.glasses || 0);
      }
      stmt.free();
    } catch {
      // water_logs lookup
    }

    const summary: DailyNutritionSummaryRecord = {
      date: day,
      total_calories: 0,
      total_protein: 0,
      total_carbs: 0,
      total_fat: 0,
      total_fiber: 0,
      total_sugar: 0,
      total_water: glasses,
      vitamin_a: 0,
      vitamin_c: 0,
      vitamin_d: 0,
      vitamin_e: 0,
      vitamin_k: 0,
      vitamin_b1: 0,
      vitamin_b2: 0,
      vitamin_b3: 0,
      vitamin_b5: 0,
      vitamin_b6: 0,
      vitamin_b7: 0,
      vitamin_b9: 0,
      vitamin_b12: 0,
      calcium: 0,
      iron: 0,
      magnesium: 0,
      potassium: 0,
      sodium: 0,
      phosphorus: 0,
      zinc: 0,
      copper: 0,
      selenium: 0,
      manganese: 0,
      choline: 0,
      omega3: 0,
      omega6: 0,
      meal_count: meals.length,
      nutrition_score: 0,
      health_score: 0,
      goal_completion: 0,
      last_updated: new Date().toISOString(),
    };

    for (const m of meals) {
      summary.total_calories += Number(m.calories || 0);
      summary.total_protein += Number(m.protein_g || 0);
      summary.total_carbs += Number(m.carbs_g || 0);
      summary.total_fat += Number(m.fat_g || 0);
      summary.total_fiber += Number(m.fiber_g || 0);
      summary.total_sugar += Number(m.sugar_g || 0);
      summary.sodium += Number(m.sodium_mg || 0);
      summary.iron += Number(m.iron_mg || 0);
      summary.calcium += Number(m.calcium_mg || 0);
      summary.magnesium += Number(m.magnesium_mg || 0);
      summary.potassium += Number(m.potassium_mg || 0);
      summary.vitamin_a += Number(m.vit_a_ug || 0);
      summary.vitamin_b12 += Number(m.vit_b12_ug || 0);
      summary.vitamin_d += Number(m.vit_d_ug || 0);
      summary.omega3 += Number(m.omega3_g || 0);
    }

    // Round values cleanly
    summary.total_calories = Math.round(summary.total_calories);
    summary.total_protein = Math.round(summary.total_protein);
    summary.total_carbs = Math.round(summary.total_carbs);
    summary.total_fat = Math.round(summary.total_fat);
    summary.total_fiber = Math.round(summary.total_fiber);
    summary.total_sugar = Math.round(summary.total_sugar);
    summary.sodium = Math.round(summary.sodium);

    // Fetch user calorie & protein targets to calculate scores
    let calorieTarget = 2000;
    let proteinTarget = 120;
    let waterTarget = 8;

    try {
      const pStmt = db.prepare(
        `SELECT daily_calorie_target, protein_target_g, water_target_glasses FROM profile LIMIT 1`,
      );
      if (pStmt.step()) {
        const row = pStmt.getAsObject();
        if (Number(row.daily_calorie_target) > 0) calorieTarget = Number(row.daily_calorie_target);
        if (Number(row.protein_target_g) > 0) proteinTarget = Number(row.protein_target_g);
        if (Number(row.water_target_glasses) > 0) waterTarget = Number(row.water_target_glasses);
      }
      pStmt.free();
    } catch {
      // default targets
    }

    // Goal Completion %
    summary.goal_completion =
      calorieTarget > 0 ? Math.round((summary.total_calories / calorieTarget) * 100) : 0;

    // Nutrition Score (0-100)
    const macroSubScore = Math.min(
      60,
      (summary.total_protein / proteinTarget) * 35 + (summary.total_fiber / 25) * 25,
    );
    const microSubScore = Math.min(
      40,
      (summary.iron / 18 +
        summary.calcium / 1000 +
        summary.vitamin_a / 900 +
        summary.vitamin_d / 20) *
        10,
    );
    summary.nutrition_score =
      summary.total_calories > 0 ? Math.min(100, Math.round(macroSubScore + microSubScore)) : 0;

    // Health Score (0-100)
    const waterPart = Math.min(20, (summary.total_water / waterTarget) * 20);
    const calAdherencePart =
      summary.total_calories > 0
        ? Math.max(0, 30 - Math.abs(100 - summary.goal_completion) * 0.3)
        : 0;
    summary.health_score =
      summary.total_calories > 0
        ? Math.min(100, Math.round(summary.nutrition_score * 0.5 + waterPart + calAdherencePart))
        : 0;

    // Save into SQLite
    db.run(
      `INSERT OR REPLACE INTO daily_nutrition_summary (
        date, total_calories, total_protein, total_carbs, total_fat, total_fiber, total_sugar, total_water,
        vitamin_a, vitamin_c, vitamin_d, vitamin_e, vitamin_k, vitamin_b1, vitamin_b2, vitamin_b3, vitamin_b5,
        vitamin_b6, vitamin_b7, vitamin_b9, vitamin_b12, calcium, iron, magnesium, potassium, sodium,
        phosphorus, zinc, copper, selenium, manganese, choline, omega3, omega6, meal_count, nutrition_score,
        health_score, goal_completion, last_updated
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        summary.date,
        summary.total_calories,
        summary.total_protein,
        summary.total_carbs,
        summary.total_fat,
        summary.total_fiber,
        summary.total_sugar,
        summary.total_water,
        summary.vitamin_a,
        summary.vitamin_c,
        summary.vitamin_d,
        summary.vitamin_e,
        summary.vitamin_k,
        summary.vitamin_b1,
        summary.vitamin_b2,
        summary.vitamin_b3,
        summary.vitamin_b5,
        summary.vitamin_b6,
        summary.vitamin_b7,
        summary.vitamin_b9,
        summary.vitamin_b12,
        summary.calcium,
        summary.iron,
        summary.magnesium,
        summary.potassium,
        summary.sodium,
        summary.phosphorus,
        summary.zinc,
        summary.copper,
        summary.selenium,
        summary.manganese,
        summary.choline,
        summary.omega3,
        summary.omega6,
        summary.meal_count,
        summary.nutrition_score,
        summary.health_score,
        summary.goal_completion,
        summary.last_updated,
      ],
    );

    persistDatabase(db);
    return summary;
  } catch (err) {
    console.error("[SQLite] Error updating daily nutrition summary:", err);
    return null;
  }
}

export async function getDailyNutritionSummaryFromSQLite(
  day: string,
): Promise<DailyNutritionSummaryRecord | null> {
  const db = await getSQLiteDB();
  if (!db) return null;

  try {
    const stmt = db.prepare(`SELECT * FROM daily_nutrition_summary WHERE date = ?`);
    stmt.bind([day]);
    if (stmt.step()) {
      const row = stmt.getAsObject() as unknown as DailyNutritionSummaryRecord;
      stmt.free();
      return row;
    }
    stmt.free();
    return null;
  } catch (err) {
    console.error("[SQLite] Error getting daily nutrition summary:", err);
    return null;
  }
}

export async function getAllDailyNutritionSummariesFromSQLite(): Promise<
  DailyNutritionSummaryRecord[]
> {
  const db = await getSQLiteDB();
  if (!db) return [];

  try {
    const stmt = db.prepare(`SELECT * FROM daily_nutrition_summary ORDER BY date DESC`);
    const results: DailyNutritionSummaryRecord[] = [];
    while (stmt.step()) {
      const row = stmt.getAsObject() as unknown as DailyNutritionSummaryRecord;
      results.push(row);
    }
    stmt.free();
    return results;
  } catch (err) {
    console.error("[SQLite] Error getting all daily nutrition summaries:", err);
    return [];
  }
}

export interface StepLogRecord {
  day: string;
  steps: number;
  distance_km: number;
  calories_burned: number;
  active_minutes: number;
  goal_completion: number;
  last_updated: string;
}

export async function saveStepsToSQLite(
  day: string,
  steps: number,
  distanceKm: number = 0,
  caloriesBurned: number = 0,
  activeMinutes: number = 0,
  goalCompletion: number = 0,
): Promise<void> {
  const db = await getSQLiteDB();
  if (!db) return;

  try {
    const lastUpdated = new Date().toISOString();
    db.run(
      `INSERT OR REPLACE INTO steps_logs (
        day, steps, distance_km, calories_burned, active_minutes, goal_completion, last_updated, synced
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
      [day, steps, distanceKm, caloriesBurned, activeMinutes, goalCompletion, lastUpdated],
    );
    persistDatabase(db);
  } catch (err) {
    console.error("[SQLite] Error saving steps log:", err);
  }
}

export async function getStepLogFromSQLite(day: string): Promise<StepLogRecord | null> {
  const db = await getSQLiteDB();
  if (!db) return null;

  try {
    const stmt = db.prepare(`SELECT * FROM steps_logs WHERE day = ?`);
    stmt.bind([day]);
    if (stmt.step()) {
      const row = stmt.getAsObject() as unknown as StepLogRecord;
      stmt.free();
      return row;
    }
    stmt.free();
    return null;
  } catch (err) {
    console.error("[SQLite] Error fetching step log for day:", err);
    return null;
  }
}

export async function getAllStepLogsFromSQLite(): Promise<StepLogRecord[]> {
  const db = await getSQLiteDB();
  if (!db) return [];

  try {
    const stmt = db.prepare(`SELECT * FROM steps_logs ORDER BY day DESC`);
    const results: StepLogRecord[] = [];
    while (stmt.step()) {
      const row = stmt.getAsObject() as unknown as StepLogRecord;
      results.push(row);
    }
    stmt.free();
    return results;
  } catch (err) {
    console.error("[SQLite] Error fetching all step logs:", err);
    return [];
  }
}

function addToSyncQueue(
  db: Database,
  action: string,
  tableName: string,
  recordId: string,
  payload: unknown,
) {
  try {
    const id = `queue-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    db.run(
      `INSERT INTO sync_queue (id, action, table_name, record_id, payload, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
      [id, action, tableName, recordId, JSON.stringify(payload), new Date().toISOString()],
    );
  } catch (err) {
    console.warn("[SQLite] Sync queue insert note:", err);
  }
}

export async function getSyncQueueFromSQLite(): Promise<
  Array<{
    id: string;
    action: string;
    table_name: string;
    record_id: string;
    payload: unknown;
    created_at: string;
  }>
> {
  const db = await getSQLiteDB();
  if (!db) return [];

  try {
    const stmt = db.prepare(`SELECT * FROM sync_queue ORDER BY created_at ASC`);
    const queue: Array<{
      id: string;
      action: string;
      table_name: string;
      record_id: string;
      payload: unknown;
      created_at: string;
    }> = [];
    while (stmt.step()) {
      const row = stmt.getAsObject() as Record<string, unknown>;
      queue.push({
        id: String(row.id || ""),
        action: String(row.action || ""),
        table_name: String(row.table_name || ""),
        record_id: String(row.record_id || ""),
        payload: row.payload ? JSON.parse(String(row.payload)) : null,
        created_at: String(row.created_at || ""),
      });
    }
    stmt.free();
    return queue;
  } catch (err) {
    console.error("[SQLite] Error reading sync queue:", err);
    return [];
  }
}

export async function removeSyncQueueItemFromSQLite(queueId: string): Promise<void> {
  const db = await getSQLiteDB();
  if (!db) return;

  try {
    db.run(`DELETE FROM sync_queue WHERE id = ?`, [queueId]);
    persistDatabase(db);
  } catch (err) {
    console.error("[SQLite] Error removing queue item:", err);
  }
}
