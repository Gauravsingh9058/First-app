import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getSyncQueueFromSQLite, removeSyncQueueItemFromSQLite, getSQLiteDB } from "./sqlite-db";
import { Database } from "@/integrations/supabase/types";

export const NUTRILENS_DATA_CHANGED_EVENT = "nutrilens-data-changed";
export const NUTRILENS_SYNC_STATUS_EVENT = "nutrilens-sync-status";

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncedAt: string | null;
}

let syncStatusState: SyncStatus = {
  isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
  isSyncing: false,
  pendingCount: 0,
  lastSyncedAt: null,
};

export function notifyDataChanged() {
  if (typeof window !== "undefined") {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent(NUTRILENS_DATA_CHANGED_EVENT));
      updateSyncCount();
    }, 0);
  }
}

function updateSyncStatus(update: Partial<SyncStatus>) {
  syncStatusState = { ...syncStatusState, ...update };
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(NUTRILENS_SYNC_STATUS_EVENT, { detail: syncStatusState }));
  }
}

async function updateSyncCount() {
  try {
    const queue = await getSyncQueueFromSQLite();
    updateSyncStatus({ pendingCount: queue.length });
  } catch {
    // ignore
  }
}

export async function processSyncQueue(): Promise<void> {
  if (typeof window === "undefined") return;
  if (!navigator.onLine || syncStatusState.isSyncing) return;

  try {
    const queue = await getSyncQueueFromSQLite();
    if (queue.length === 0) {
      updateSyncStatus({ isSyncing: false, pendingCount: 0 });
      return;
    }

    updateSyncStatus({ isSyncing: true, pendingCount: queue.length });

    // Check auth session
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    for (const item of queue) {
      try {
        if (item.table_name === "meals") {
          if (item.action === "insert" || item.action === "upsert") {
            const meal = item.payload as Record<string, unknown>;
            if (userId) {
              await supabase.from("meals").upsert({
                id:
                  typeof meal.id === "string" && meal.id.startsWith("local-")
                    ? undefined
                    : (meal.id as string),
                user_id: userId,
                name: String(meal.name || ""),
                source: (meal.source as "manual" | "photo" | "barcode" | undefined) || "manual",
                confidence: meal.confidence ? Number(meal.confidence) : null,
                serving_desc: meal.serving_desc ? String(meal.serving_desc) : null,
                calories: Number(meal.calories || 0),
                protein_g: Number(meal.protein_g || 0),
                carbs_g: Number(meal.carbs_g || 0),
                fat_g: Number(meal.fat_g || 0),
                fiber_g: Number(meal.fiber_g || 0),
                sugar_g: Number(meal.sugar_g || 0),
                sodium_mg: Number(meal.sodium_mg || 0),
                eaten_at: String(meal.eaten_at || ""),
                eaten_on: String(meal.eaten_on || ""),
              });
            }
          } else if (item.action === "delete") {
            if (userId && !item.record_id.startsWith("local-")) {
              await supabase.from("meals").delete().eq("id", item.record_id);
            }
          }
        } else if (item.table_name === "profile") {
          if (userId) {
            const prof = item.payload as Record<string, unknown>;
            await supabase.from("profiles").upsert({
              user_id: userId,
              display_name: String(prof.display_name || ""),
              gender: String(prof.gender || "other"),
              age: Number(prof.age || 25),
              height_cm: Number(prof.height_cm || 170),
              weight_kg: Number(prof.weight_kg || 70),
              goal_weight_kg: Number(prof.goal_weight_kg || 70),
              activity:
                (prof.activity as Database["public"]["Enums"]["activity_level"]) || "moderate",
              goal: (prof.goal as Database["public"]["Enums"]["goal_type"]) || "maintenance",
              diet: (prof.diet as Database["public"]["Enums"]["diet_type"]) || "non_veg",
              daily_calorie_target: Number(prof.daily_calorie_target || 2000),
              protein_target_g: Number(prof.protein_target_g || 120),
              water_target_glasses: Number(prof.water_target_glasses || 8),
              onboarded: Boolean(prof.onboarded),
            });
          }
        } else if (item.table_name === "water_logs") {
          if (userId) {
            const { day, glasses } = item.payload as { day: string; glasses: number };
            await supabase.from("water_logs").upsert({
              user_id: userId,
              day,
              glasses,
            });
          }
        }

        // Successfully synced item, remove from queue
        await removeSyncQueueItemFromSQLite(item.id);
      } catch (itemErr) {
        console.warn("[SyncManager] Failed to sync queue item:", item.id, itemErr);
        // Continue processing other items if one fails
      }
    }

    const remaining = await getSyncQueueFromSQLite();
    updateSyncStatus({
      isSyncing: false,
      pendingCount: remaining.length,
      lastSyncedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("[SyncManager] Sync cycle note:", err);
    updateSyncStatus({ isSyncing: false });
  }
}

// Global initialization & event listeners
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    updateSyncStatus({ isOnline: true });
    processSyncQueue();
  });

  window.addEventListener("offline", () => {
    updateSyncStatus({ isOnline: false, isSyncing: false });
  });

  // Periodically check and initialize SQLite & Sync queue count
  getSQLiteDB().then(() => {
    updateSyncCount();
    if (navigator.onLine) {
      processSyncQueue();
    }
  });
}

// React Hook for connection and sync state
export function useSyncStatus(): SyncStatus {
  const [status, setStatus] = useState<SyncStatus>(syncStatusState);

  useEffect(() => {
    const handleStatusChange = (e: Event) => {
      const customEvent = e as CustomEvent<SyncStatus>;
      if (customEvent.detail) {
        setStatus(customEvent.detail);
      }
    };

    window.addEventListener(NUTRILENS_SYNC_STATUS_EVENT, handleStatusChange);
    updateSyncCount();

    return () => {
      window.removeEventListener(NUTRILENS_SYNC_STATUS_EVENT, handleStatusChange);
    };
  }, []);

  return status;
}
