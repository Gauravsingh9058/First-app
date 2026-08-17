import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@/lib/async-storage";
import { Recipe } from "@/lib/recipe-db";

const CACHE_PREFIX = "@nutrilens_cached_meal_v1_";
const DEFAULT_CACHE_KEY = "@nutrilens_last_generated_meal";

export interface MealCacheParams {
  mealType?: string;
  selectedGoal?: string;
  preferredDiet?: string;
  budgetLimit?: number;
  maxPrepMinutes?: number;
  cuisine?: string;
  targetCalories?: number;
}

export interface CachedMealPayload<T = Recipe | Recipe[] | Record<string, unknown>> {
  data: T;
  timestamp: number;
  paramsHash: string;
  dateString: string;
}

/**
 * React Hook that uses `AsyncStorage` to cache the last generated meal(s) to prevent redundant processing.
 */
export function useCachedGeneratedMeal<T = Recipe | Recipe[] | Record<string, unknown>>(
  params?: MealCacheParams,
  cacheTTLMs: number = 24 * 60 * 60 * 1000, // 24 hours default TTL
) {
  const [cachedMeal, setCachedMealState] = useState<T | null>(null);
  const [isCacheLoading, setIsCacheLoading] = useState<boolean>(true);
  const [lastSavedTime, setLastSavedTime] = useState<number | null>(null);

  // Generate deterministic hash string for params
  const generateParamsHash = useCallback((p?: MealCacheParams): string => {
    if (!p) return "default";
    return `${p.mealType || "any"}_${p.selectedGoal || "any"}_${p.preferredDiet || "any"}_${p.budgetLimit || 0}_${p.maxPrepMinutes || 0}_${p.cuisine || "any"}_${p.targetCalories || 0}`;
  }, []);

  const currentHash = generateParamsHash(params);
  const storageKey = `${CACHE_PREFIX}${currentHash}`;

  // Load cached meal from AsyncStorage
  const loadCachedMeal = useCallback(async () => {
    setIsCacheLoading(true);
    try {
      const raw = await AsyncStorage.getItem(storageKey);
      const fallbackRaw = !raw ? await AsyncStorage.getItem(DEFAULT_CACHE_KEY) : null;
      const targetRaw = raw || fallbackRaw;

      if (targetRaw) {
        const payload: CachedMealPayload<T> = JSON.parse(targetRaw);
        const age = Date.now() - payload.timestamp;

        if (age <= cacheTTLMs) {
          setCachedMealState(payload.data);
          setLastSavedTime(payload.timestamp);
        } else {
          // Expired cache
          await AsyncStorage.removeItem(storageKey);
          setCachedMealState(null);
        }
      } else {
        setCachedMealState(null);
      }
    } catch (err) {
      console.warn("[useCachedGeneratedMeal] Failed to read cache from AsyncStorage:", err);
      setCachedMealState(null);
    } finally {
      setIsCacheLoading(false);
    }
  }, [storageKey, cacheTTLMs]);

  useEffect(() => {
    loadCachedMeal();
  }, [loadCachedMeal]);

  // Save generated meal to AsyncStorage
  const saveGeneratedMeal = useCallback(
    async (data: T, customParams?: MealCacheParams) => {
      try {
        const pHash = customParams ? generateParamsHash(customParams) : currentHash;
        const key = `${CACHE_PREFIX}${pHash}`;
        const payload: CachedMealPayload<T> = {
          data,
          timestamp: Date.now(),
          paramsHash: pHash,
          dateString: new Date().toISOString(),
        };

        const jsonStr = JSON.stringify(payload);
        await AsyncStorage.setItem(key, jsonStr);
        await AsyncStorage.setItem(DEFAULT_CACHE_KEY, jsonStr);

        setCachedMealState(data);
        setLastSavedTime(payload.timestamp);
        console.log(
          "[useCachedGeneratedMeal] Cached generated meal to prevent redundant processing.",
        );
      } catch (err) {
        console.warn("[useCachedGeneratedMeal] Error caching meal to AsyncStorage:", err);
      }
    },
    [currentHash, generateParamsHash],
  );

  // Clear meal cache
  const clearMealCache = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(storageKey);
      await AsyncStorage.removeItem(DEFAULT_CACHE_KEY);
      setCachedMealState(null);
      setLastSavedTime(null);
    } catch (err) {
      console.warn("[useCachedGeneratedMeal] Error clearing cache:", err);
    }
  }, [storageKey]);

  return {
    cachedMeal,
    isCacheLoading,
    lastSavedTime,
    saveGeneratedMeal,
    clearMealCache,
    reloadCache: loadCachedMeal,
  };
}

export default useCachedGeneratedMeal;
