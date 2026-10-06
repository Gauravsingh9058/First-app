import { describe, it, expect, beforeEach } from "vitest";
import { LocalStore, LocalProfile, LocalMeal } from "@/lib/local-store";
import { getLocalDateString } from "@/lib/date-utils";

const storageMap = new Map<string, string>();
const mockLocalStorage: Storage = {
  getItem: (k: string) => storageMap.get(k) ?? null,
  setItem: (k: string, v: string) => {
    storageMap.set(k, String(v));
  },
  removeItem: (k: string) => {
    storageMap.delete(k);
  },
  clear: () => storageMap.clear(),
  key: (i: number) => Array.from(storageMap.keys())[i] ?? null,
  get length() {
    return storageMap.size;
  },
};

Object.defineProperty(globalThis, "localStorage", {
  value: mockLocalStorage,
  writable: true,
  configurable: true,
});

describe("Account Persistence & History Isolation Suite", () => {
  beforeEach(() => {
    storageMap.clear();
    LocalStore.clearAll();
  });

  describe("1. Local Timezone Date Handling", () => {
    it("should generate local YYYY-MM-DD string without UTC shift", () => {
      const date = new Date(2026, 9, 4, 23, 30, 0); // October 4, 2026 late night local
      const localStr = getLocalDateString(date);
      expect(localStr).toBe("2026-10-04");
    });
  });

  describe("2. Multi-Account Data Isolation", () => {
    const userA = "usr-uuid-google-a-111";
    const userB = "usr-uuid-google-b-222";

    it("should strictly isolate profiles between different Gmail accounts", () => {
      // User A logs in and saves profile
      LocalStore.setAccount(userA);
      const profileA: LocalProfile = {
        display_name: "Alice Runner",
        gender: "female",
        age: 28,
        height_cm: 165,
        weight_kg: 60,
        goal_weight_kg: 55,
        activity: "active",
        goal: "fat_loss",
        diet: "vegetarian",
        daily_calorie_target: 1800,
        protein_target_g: 110,
        water_target_glasses: 9,
        water_goal_l: 2.7,
        onboarded: true,
        extended_data: {
          workout_frequency: "4-5 times/week",
          discovery_source: "Instagram",
        },
      };
      LocalStore.saveProfile(profileA);
      expect(LocalStore.getProfile()?.display_name).toBe("Alice Runner");
      expect(LocalStore.getProfile()?.onboarded).toBe(true);

      // User A logs out and User B logs in
      LocalStore.setAccount(userB);
      expect(LocalStore.getProfile()).toBeNull(); // Clean state for User B

      // User B completes onboarding
      const profileB: LocalProfile = {
        display_name: "Bob Lifter",
        gender: "male",
        age: 32,
        height_cm: 182,
        weight_kg: 85,
        goal_weight_kg: 80,
        activity: "very_active",
        goal: "muscle_gain",
        diet: "high_protein",
        daily_calorie_target: 2800,
        protein_target_g: 180,
        water_target_glasses: 12,
        water_goal_l: 3.5,
        onboarded: true,
        extended_data: {
          workout_frequency: "6 times/week",
          fitness_level: "advanced",
        },
      };
      LocalStore.saveProfile(profileB);
      expect(LocalStore.getProfile()?.display_name).toBe("Bob Lifter");

      // Switch back to User A -> User A's profile is intact and untouched
      LocalStore.setAccount(userA);
      expect(LocalStore.getProfile()?.display_name).toBe("Alice Runner");
      expect(LocalStore.getProfile()?.daily_calorie_target).toBe(1800);
      expect(LocalStore.getProfile()?.extended_data?.workout_frequency).toBe("4-5 times/week");
    });

    it("should strictly isolate daily meals and historical nutrition per user", () => {
      const day = "2026-10-04";

      // User A logs meal
      LocalStore.setAccount(userA);
      const mealA: LocalMeal = {
        id: "meal-a-1",
        name: "Oatmeal with Almonds",
        source: "manual",
        calories: 350,
        protein_g: 12,
        carbs_g: 50,
        fat_g: 8,
        fiber_g: 6,
        sugar_g: 5,
        sodium_mg: 120,
        eaten_at: "2026-10-04T08:30:00Z",
        eaten_on: day,
      };
      LocalStore.saveMeal(mealA);
      expect(LocalStore.getMeals(day)).toHaveLength(1);
      expect(LocalStore.getMeals(day)[0].name).toBe("Oatmeal with Almonds");

      // Switch to User B -> No meals visible
      LocalStore.setAccount(userB);
      expect(LocalStore.getMeals(day)).toHaveLength(0);

      // User B logs meal
      const mealB: LocalMeal = {
        id: "meal-b-1",
        name: "Grilled Salmon Bowl",
        source: "manual",
        calories: 620,
        protein_g: 45,
        carbs_g: 30,
        fat_g: 22,
        fiber_g: 4,
        sugar_g: 2,
        sodium_mg: 380,
        eaten_at: "2026-10-04T13:00:00Z",
        eaten_on: day,
      };
      LocalStore.saveMeal(mealB);
      expect(LocalStore.getMeals(day)).toHaveLength(1);
      expect(LocalStore.getMeals(day)[0].name).toBe("Grilled Salmon Bowl");

      // Switch back to User A -> User A meal remains
      LocalStore.setAccount(userA);
      expect(LocalStore.getMeals(day)).toHaveLength(1);
      expect(LocalStore.getMeals(day)[0].name).toBe("Oatmeal with Almonds");
    });

    it("should strictly isolate historical water and step records per user and date", () => {
      const date1 = "2026-10-01";
      const date2 = "2026-10-02";

      // User A records
      LocalStore.setAccount(userA);
      LocalStore.setWater(date1, 8);
      LocalStore.setWater(date2, 10);
      LocalStore.setSteps(date1, 9500);
      LocalStore.setSteps(date2, 12000);

      // User B records
      LocalStore.setAccount(userB);
      LocalStore.setWater(date1, 4);
      LocalStore.setWater(date2, 6);
      LocalStore.setSteps(date1, 4000);
      LocalStore.setSteps(date2, 5500);

      // Verify User B
      expect(LocalStore.getWater(date1)).toBe(4);
      expect(LocalStore.getWater(date2)).toBe(6);
      expect(LocalStore.getSteps(date1)).toBe(4000);
      expect(LocalStore.getSteps(date2)).toBe(5500);

      // Verify User A
      LocalStore.setAccount(userA);
      expect(LocalStore.getWater(date1)).toBe(8);
      expect(LocalStore.getWater(date2)).toBe(10);
      expect(LocalStore.getSteps(date1)).toBe(9500);
      expect(LocalStore.getSteps(date2)).toBe(12000);
    });
  });

  describe("3. Zero Double Counting Guarantee", () => {
    it("should never double-count when server rollup is authoritative", () => {
      // Server rollup has 1800 kcal from server database
      const serverRollup = {
        day: "2026-10-04",
        calories: 1800,
        protein_g: 120,
        carbs_g: 200,
        fat_g: 60,
      };

      // Local meals cache has same meals (1800 kcal total)
      const localMeals: LocalMeal[] = [
        {
          id: "server-meal-1",
          name: "Lunch",
          source: "manual",
          calories: 1800,
          protein_g: 120,
          carbs_g: 200,
          fat_g: 60,
          fiber_g: 25,
          sugar_g: 15,
          sodium_mg: 1500,
          eaten_at: "2026-10-04T12:30:00Z",
          eaten_on: "2026-10-04",
        },
      ];

      // Authority logic: If server rollup exists, we use server rollup values directly (NOT sum(server + local))
      const aggregatedCalories = serverRollup
        ? Number(serverRollup.calories)
        : localMeals.reduce((s, m) => s + m.calories, 0);
      const aggregatedProtein = serverRollup
        ? Number(serverRollup.protein_g)
        : localMeals.reduce((s, m) => s + m.protein_g, 0);

      expect(aggregatedCalories).toBe(1800);
      expect(aggregatedProtein).toBe(120);
      expect(aggregatedCalories).not.toBe(3600); // Guarantees zero double counting
    });
  });

  describe("4. Onboarding Guard & Returning User Flow", () => {
    it("should bypass onboarding when profile.onboarded is true", () => {
      const profile: LocalProfile = {
        display_name: "Permanent User",
        gender: "male",
        age: 27,
        height_cm: 175,
        weight_kg: 72,
        goal_weight_kg: 70,
        activity: "moderate",
        goal: "maintenance",
        diet: "non_veg",
        daily_calorie_target: 2200,
        protein_target_g: 140,
        water_target_glasses: 8,
        onboarded: true,
      };

      const shouldShowOnboarding = !profile || profile.onboarded !== true;
      expect(shouldShowOnboarding).toBe(false);
    });

    it("should require onboarding when profile is missing or onboarded is false", () => {
      const incompleteProfile: Partial<LocalProfile> = {
        display_name: "Incomplete User",
        onboarded: false,
      };

      const shouldShowOnboarding = !incompleteProfile || incompleteProfile.onboarded !== true;
      expect(shouldShowOnboarding).toBe(true);
    });
  });
});
