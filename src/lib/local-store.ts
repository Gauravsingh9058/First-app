import { getLocalDateString } from "./date-utils";
import {
  saveMealToSQLite,
  deleteMealFromSQLite,
  saveProfileToSQLite,
  saveWaterToSQLite,
  saveStepsToSQLite,
  updateDailyNutritionSummaryInSQLite,
} from "./sqlite-db";
import { notifyDataChanged } from "./sync-manager";

export interface LocalProfile {
  user_id?: string;
  display_name: string;
  phone_number?: string;
  mobile_verified?: boolean;
  gender: string;
  dob?: string;
  age: number;
  height_cm: number;
  weight_kg: number;
  goal_weight_kg: number;
  activity: string;
  goal: string;
  diet: string;
  daily_calorie_target: number;
  protein_target_g: number;
  water_target_glasses: number;
  onboarded: boolean;
  // Extended 13 categories
  extended_data?: {
    country?: string;
    timezone?: string;
    bmi?: number;
    body_fat_pct?: number;
    waist_cm?: number;
    hip_cm?: number;
    neck_cm?: number;
    chest_cm?: number;
    occupation?: string;
    sitting_hours?: number;
    exercise_days?: number;
    workout_type?: string;
    walking_habit?: string;
    sleep_time?: string;
    wake_time?: string;
    stress_level?: string;
    health_flags?: string[];
    allergies?: string[];
    favorite_foods?: string;
    hated_foods?: string;
    preferred_cuisine?: string;
    meal_frequency?: string;
    breakfast_time?: string;
    lunch_time?: string;
    dinner_time?: string;
    snacks_per_day?: number;
    fitness_goals?: string[];
    goal_timeline?: string;
    custom_goal_date?: string;
    current_water_l?: number;
    water_goal_l?: number;
    daily_steps?: number;
    workout_duration_min?: number;
    workout_intensity?: string;
    sports_played?: string;
    wearables?: {
      google_fit?: boolean;
      apple_health?: boolean;
      health_connect?: boolean;
      fitbit?: boolean;
      samsung_health?: boolean;
      sync_steps?: boolean;
      sync_calories?: boolean;
      sync_heart_rate?: boolean;
      sync_sleep?: boolean;
      sync_distance?: boolean;
      sync_workouts?: boolean;
    };
    blood_group?: string;
    blood_pressure?: string;
    resting_hr?: number;
    lab_reports_status?: string;
    current_medicines?: string;
    bmr?: number;
    tdee?: number;
  };
}

export interface LocalMeal {
  id: string;
  user_id?: string;
  eaten_at: string;
  eaten_on: string;
  name: string;
  source: "photo" | "manual" | "barcode";
  confidence?: number | null;
  serving_desc?: string | null;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  sugar_g: number;
  sodium_mg: number;
  iron_mg?: number;
  calcium_mg?: number;
  magnesium_mg?: number;
  potassium_mg?: number;
  vit_a_ug?: number;
  vit_b12_ug?: number;
  vit_d_ug?: number;
  omega3_g?: number;
}

const PROFILE_KEY = "nutrilens_local_profile_v3";
const MEALS_KEY = "nutrilens_local_meals_v3";
const WATER_KEY = "nutrilens_local_water_v3";
const STEPS_KEY = "nutrilens_local_steps_v3";

export const LocalStore = {
  getSteps(day: string): number {
    if (typeof window === "undefined") return 0;
    try {
      const raw = localStorage.getItem(`${STEPS_KEY}_${day}`);
      return raw ? Number(raw) : 0;
    } catch {
      return 0;
    }
  },

  saveSteps(
    day: string,
    steps: number,
    extraMetrics?: {
      weightKg?: number;
      heightCm?: number;
      targetSteps?: number;
    },
  ): number {
    if (typeof window === "undefined") return 0;
    try {
      const sanitized = Math.max(0, Math.round(steps));
      localStorage.setItem(`${STEPS_KEY}_${day}`, String(sanitized));

      const weight = extraMetrics?.weightKg || 70;
      const height = extraMetrics?.heightCm || 175;
      const target = extraMetrics?.targetSteps || 8000;

      // Accurate stride length in meters based on user height (height in cm * 0.414)
      const strideMeters = (height * 0.414) / 100;
      const distanceKm = Number(((sanitized * strideMeters) / 1000).toFixed(2));
      // Accurate MET-based walking calorie calculation (~0.0006125 * weight per step)
      const caloriesBurned = Number((sanitized * weight * 0.0006125).toFixed(1));
      const activeMinutes = Math.round(sanitized / 100);
      const goalCompletion = Math.min(100, Math.round((sanitized / Math.max(1, target)) * 100));

      // Store in SQLite
      saveStepsToSQLite(day, sanitized, distanceKm, caloriesBurned, activeMinutes, goalCompletion);

      notifyDataChanged();
      return sanitized;
    } catch {
      return 0;
    }
  },

  addSteps(day: string, increment: number): number {
    const current = this.getSteps(day);
    return this.saveSteps(day, current + increment);
  },
  getProfile(): LocalProfile | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as LocalProfile;
    } catch {
      return null;
    }
  },

  saveProfile(profile: LocalProfile): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      saveProfileToSQLite(profile);
      notifyDataChanged();
    } catch {
      // ignore quota exceeded
    }
  },

  getMeals(day?: string): LocalMeal[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(MEALS_KEY);
      const meals: LocalMeal[] = raw ? JSON.parse(raw) : [];
      if (day) {
        return meals.filter((m) => {
          if (m.eaten_on) return m.eaten_on === day;
          if (m.eaten_at) return getLocalDateString(new Date(m.eaten_at)) === day;
          return false;
        });
      }
      return meals;
    } catch {
      return [];
    }
  },

  addMeal(meal: Omit<LocalMeal, "id"> & { id?: string }): LocalMeal {
    const meals = this.getMeals();
    const eatenOn =
      meal.eaten_on ||
      (meal.eaten_at ? getLocalDateString(new Date(meal.eaten_at)) : getLocalDateString());
    const newMeal: LocalMeal = {
      ...meal,
      id: meal.id || `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      eaten_on: eatenOn,
    };
    const existingIndex = meals.findIndex((m) => m.id === newMeal.id);
    if (existingIndex >= 0) {
      meals[existingIndex] = newMeal;
    } else {
      meals.unshift(newMeal);
    }
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(MEALS_KEY, JSON.stringify(meals.slice(0, 500)));
        saveMealToSQLite(newMeal).then(() => {
          updateDailyNutritionSummaryInSQLite(eatenOn);
        });
        notifyDataChanged();
      } catch {
        // ignore
      }
    }
    return newMeal;
  },

  saveMeal(meal: Omit<LocalMeal, "id"> & { id?: string }): LocalMeal {
    return this.addMeal(meal);
  },

  deleteMeal(id: string): void {
    if (typeof window === "undefined") return;
    try {
      const targetMeal = this.getMeals().find((m) => m.id === id);
      const eatenOn = targetMeal?.eaten_on || getLocalDateString();
      const meals = this.getMeals().filter((m) => m.id !== id);
      localStorage.setItem(MEALS_KEY, JSON.stringify(meals));
      deleteMealFromSQLite(id).then(() => {
        updateDailyNutritionSummaryInSQLite(eatenOn);
      });
      notifyDataChanged();
    } catch {
      // ignore
    }
  },

  getWater(day: string): number {
    if (typeof window === "undefined") return 0;
    try {
      const raw = localStorage.getItem(`${WATER_KEY}_${day}`);
      return raw ? Number(raw) : 0;
    } catch {
      return 0;
    }
  },

  addWater(arg1: string | number, arg2?: string | number): number {
    if (typeof window === "undefined") return 0;
    try {
      let day: string;
      let glasses = 1;

      if (typeof arg1 === "number") {
        glasses = arg1;
        day = (arg2 as string) || getLocalDateString();
      } else {
        day = arg1 || getLocalDateString();
        glasses = typeof arg2 === "number" ? Number(arg2) || 1 : 1;
      }

      const cur = Math.max(0, Math.round((this.getWater(day) + glasses) * 100) / 100);
      localStorage.setItem(`${WATER_KEY}_${day}`, String(cur));
      saveWaterToSQLite(day, cur);
      updateDailyNutritionSummaryInSQLite(day);
      notifyDataChanged();
      return cur;
    } catch {
      return 0;
    }
  },

  setWater(day: string, totalGlasses: number): number {
    if (typeof window === "undefined") return 0;
    try {
      const cur = Math.max(0, Math.round((Number(totalGlasses) || 0) * 100) / 100);
      localStorage.setItem(`${WATER_KEY}_${day}`, String(cur));
      saveWaterToSQLite(day, cur);
      updateDailyNutritionSummaryInSQLite(day);
      notifyDataChanged();
      return cur;
    } catch {
      return 0;
    }
  },

  getDailySummary(dayStr: string) {
    const meals = this.getMeals(dayStr);
    const water = this.getWater(dayStr);
    const steps = this.getSteps(dayStr);

    if (meals.length === 0 && water === 0) {
      return {
        day: dayStr,
        hasData: false,
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
        water_glasses: 0,
        steps: steps,
        meal_count: 0,
        score: 0,
        meals: [],
      };
    }

    const totals = meals.reduce(
      (acc, m) => {
        acc.calories += Number(m.calories || 0);
        acc.protein_g += Number(m.protein_g || 0);
        acc.carbs_g += Number(m.carbs_g || 0);
        acc.fat_g += Number(m.fat_g || 0);
        acc.fiber_g += Number(m.fiber_g || 0);
        acc.sugar_g += Number(m.sugar_g || 0);
        acc.sodium_mg += Number(m.sodium_mg || 0);
        acc.iron_mg += Number(m.iron_mg || 0);
        acc.calcium_mg += Number(m.calcium_mg || 0);
        acc.magnesium_mg += Number(m.magnesium_mg || 0);
        acc.potassium_mg += Number(m.potassium_mg || 0);
        acc.vit_a_ug += Number(m.vit_a_ug || 0);
        acc.vit_b12_ug += Number(m.vit_b12_ug || 0);
        acc.vit_d_ug += Number(m.vit_d_ug || 0);
        acc.omega3_g += Number(m.omega3_g || 0);
        return acc;
      },
      {
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
      },
    );

    const score = Math.min(
      100,
      Math.round(
        (totals.calories > 0 ? 40 : 0) +
          Math.min(30, (totals.protein_g / 100) * 30) +
          Math.min(15, (totals.fiber_g / 25) * 15) +
          Math.min(15, totals.iron_mg + totals.calcium_mg + totals.magnesium_mg > 0 ? 15 : 0),
      ),
    );

    return {
      day: dayStr,
      hasData: true,
      calories: Math.round(totals.calories),
      protein_g: Math.round(totals.protein_g),
      carbs_g: Math.round(totals.carbs_g),
      fat_g: Math.round(totals.fat_g),
      fiber_g: Math.round(totals.fiber_g),
      sugar_g: Math.round(totals.sugar_g),
      sodium_mg: Math.round(totals.sodium_mg),
      iron_mg: Number(totals.iron_mg.toFixed(1)),
      calcium_mg: Number(totals.calcium_mg.toFixed(1)),
      magnesium_mg: Number(totals.magnesium_mg.toFixed(1)),
      potassium_mg: Number(totals.potassium_mg.toFixed(1)),
      vit_a_ug: Number(totals.vit_a_ug.toFixed(1)),
      vit_b12_ug: Number(totals.vit_b12_ug.toFixed(1)),
      vit_d_ug: Number(totals.vit_d_ug.toFixed(1)),
      omega3_g: Number(totals.omega3_g.toFixed(1)),
      water_glasses: water,
      steps: steps,
      meal_count: meals.length,
      score,
      meals,
    };
  },

  getAllLoggedDates(): string[] {
    const meals = this.getMeals();
    const dates = new Set<string>();
    for (const m of meals) {
      const d = m.eaten_on || (m.eaten_at ? getLocalDateString(new Date(m.eaten_at)) : "");
      if (d) dates.add(d);
    }
    if (typeof window !== "undefined") {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`${WATER_KEY}_`)) {
          const d = key.replace(`${WATER_KEY}_`, "");
          if (d) dates.add(d);
        }
      }
    }
    return Array.from(dates).sort().reverse();
  },

  clearAll(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(PROFILE_KEY);
      localStorage.removeItem(MEALS_KEY);
    } catch {
      // ignore
    }
  },
};
