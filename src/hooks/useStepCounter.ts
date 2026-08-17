import { useState, useEffect, useCallback, useRef } from "react";
import { StepCounter, isNativeAndroid, type StepUpdateEvent } from "@/services/stepCounter";
import { LocalStore } from "@/lib/local-store";

export interface UseStepCounterOptions {
  todayStr?: string;
  weightKg?: number;
  heightCm?: number;
  targetSteps?: number;
  autoStart?: boolean;
}

export interface UseStepCounterReturn {
  steps: number;
  isTracking: boolean;
  isAvailable: boolean | null;
  sensorName: string;
  hasPermission: boolean | null;
  error: string | null;
  isNative: boolean;
  todayStr: string;
  strideMeters: number;
  distanceKm: string;
  caloriesBurned: string;
  activeMins: number;
  progressPct: number;
  remainingSteps: number;
  startTracking: () => Promise<boolean>;
  stopTracking: () => Promise<boolean>;
  requestPermission: () => Promise<boolean>;
  refreshSteps: () => Promise<number>;
  resetTodaySteps: () => Promise<void>;
  updateManualSteps: (newCount: number) => void;
}

export function useStepCounter(options: UseStepCounterOptions = {}): UseStepCounterReturn {
  const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayStr = options.todayStr || getTodayString();
  const weightKg = options.weightKg || 70;
  const heightCm = options.heightCm || 175;
  const targetSteps = options.targetSteps || 10000;
  const autoStart = options.autoStart !== false;

  const [steps, setSteps] = useState<number>(() => LocalStore.getSteps(todayStr));
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [sensorName, setSensorName] = useState<string>("");
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isNative = isNativeAndroid();

  const listenerHandleRef = useRef<{ remove: () => Promise<void> } | null>(null);

  // Sync with LocalStore when todayStr changes
  useEffect(() => {
    setSteps(LocalStore.getSteps(todayStr));
  }, [todayStr]);

  // Check sensor availability & permissions on mount
  useEffect(() => {
    let isMounted = true;

    async function checkSensorAndPermission() {
      try {
        const avail = await StepCounter.isStepSensorAvailable();
        if (!isMounted) return;
        setIsAvailable(avail.available);
        setSensorName(avail.sensorName || (avail.available ? "Hardware Step Counter" : ""));

        if (!avail.available && isNative) {
          setError("Hardware TYPE_STEP_COUNTER sensor is not available on this Android device.");
        }

        const perm = await StepCounter.checkPermission();
        if (!isMounted) return;
        setHasPermission(perm.granted);

        // Fetch current steps from native layer if available
        const current = await StepCounter.getCurrentStepCount();
        if (!isMounted) return;

        if (typeof current.steps === "number") {
          const syncedSteps = Math.max(current.steps, LocalStore.getSteps(todayStr));
          setSteps(syncedSteps);
          LocalStore.saveSteps(todayStr, syncedSteps, { weightKg, heightCm, targetSteps });
        }
        setIsTracking(current.isTracking);

        // If autoStart is requested and permission is granted, start tracking
        if (autoStart && perm.granted && avail.available && !current.isTracking) {
          try {
            await StepCounter.startStepTracking();
            setIsTracking(true);
          } catch (trackErr) {
            console.warn("[useStepCounter] autoStart error:", trackErr);
          }
        }
      } catch (err) {
        console.warn("[useStepCounter] Init error:", err);
        if (isMounted) {
          setIsAvailable(false);
          setHasPermission(false);
        }
      }
    }

    checkSensorAndPermission();

    return () => {
      isMounted = false;
    };
  }, [todayStr, weightKg, heightCm, targetSteps, autoStart, isNative]);

  // Subscribe to real-time step events from Android native StepCounterPlugin
  useEffect(() => {
    let isMounted = true;

    async function subscribeStepUpdates() {
      try {
        if (listenerHandleRef.current) {
          await listenerHandleRef.current.remove();
          listenerHandleRef.current = null;
        }

        const handle = await StepCounter.addListener("stepUpdate", (event: StepUpdateEvent) => {
          if (!isMounted) return;
          if (typeof event.steps === "number") {
            const sanitized = Math.max(0, Math.round(event.steps));
            setSteps(sanitized);
            setError(null);
            LocalStore.saveSteps(event.date || todayStr, sanitized, {
              weightKg,
              heightCm,
              targetSteps,
            });
          }
          if (typeof event.isTracking === "boolean") {
            setIsTracking(event.isTracking);
          }
        });

        if (isMounted) {
          listenerHandleRef.current = handle;
        } else {
          await handle.remove();
        }
      } catch (err) {
        console.warn("[useStepCounter] Failed to add stepUpdate listener:", err);
      }
    }

    subscribeStepUpdates();

    return () => {
      isMounted = false;
      if (listenerHandleRef.current) {
        listenerHandleRef.current.remove().catch(() => {});
        listenerHandleRef.current = null;
      }
    };
  }, [todayStr, weightKg, heightCm, targetSteps]);

  // Request native permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const res = await StepCounter.requestPermission();
      setHasPermission(res.granted);
      if (!res.granted) {
        setError("Activity recognition permission was denied.");
      } else {
        setError(null);
      }
      return res.granted;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      setHasPermission(false);
      return false;
    }
  }, []);

  // Start real-time native tracking
  const startTracking = useCallback(async (): Promise<boolean> => {
    try {
      if (hasPermission === false || hasPermission === null) {
        const granted = await requestPermission();
        if (!granted) return false;
      }

      const res = await StepCounter.startStepTracking();
      if (res.success) {
        setIsTracking(true);
        setError(null);
        if (typeof res.steps === "number") {
          setSteps(res.steps);
          LocalStore.saveSteps(todayStr, res.steps, { weightKg, heightCm, targetSteps });
        }
        return true;
      }
      return false;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      setIsTracking(false);
      return false;
    }
  }, [hasPermission, requestPermission, todayStr, weightKg, heightCm, targetSteps]);

  // Stop native tracking
  const stopTracking = useCallback(async (): Promise<boolean> => {
    try {
      const res = await StepCounter.stopStepTracking();
      if (res.success) {
        setIsTracking(false);
        return true;
      }
      return false;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      return false;
    }
  }, []);

  // Refresh current step count
  const refreshSteps = useCallback(async (): Promise<number> => {
    try {
      const res = await StepCounter.getCurrentStepCount();
      if (typeof res.steps === "number") {
        const synced = Math.max(res.steps, LocalStore.getSteps(todayStr));
        setSteps(synced);
        LocalStore.saveSteps(todayStr, synced, { weightKg, heightCm, targetSteps });
        return synced;
      }
    } catch (err) {
      console.warn("[useStepCounter] refreshSteps error:", err);
    }
    const current = LocalStore.getSteps(todayStr);
    setSteps(current);
    return current;
  }, [todayStr, weightKg, heightCm, targetSteps]);

  // Reset today's steps to 0
  const resetTodaySteps = useCallback(async (): Promise<void> => {
    try {
      await StepCounter.resetTodaySteps();
    } catch {
      // Fallback
    }
    setSteps(0);
    LocalStore.saveSteps(todayStr, 0, { weightKg, heightCm, targetSteps });
  }, [todayStr, weightKg, heightCm, targetSteps]);

  // Manual update for testing or user adjustment
  const updateManualSteps = useCallback(
    (newCount: number) => {
      const sanitized = Math.max(0, Math.round(newCount));
      setSteps(sanitized);
      LocalStore.saveSteps(todayStr, sanitized, { weightKg, heightCm, targetSteps });
    },
    [todayStr, weightKg, heightCm, targetSteps],
  );

  // User Profile Biometric Mathematics
  // Stride length ~ 41.4% of body height (in meters)
  const strideMeters = ((heightCm || 175) * 0.414) / 100;
  const distanceKm = ((steps * strideMeters) / 1000).toFixed(2);
  // Net energy expenditure per step based on body mass (MET calculation)
  const caloriesBurned = (steps * (weightKg || 70) * 0.0006125).toFixed(1);
  const activeMins = Math.round(steps / 100);
  const remainingSteps = Math.max(0, targetSteps - steps);
  const progressPct = Math.min(100, Math.round((steps / Math.max(1, targetSteps)) * 100));

  return {
    steps,
    isTracking,
    isAvailable,
    sensorName,
    hasPermission,
    error,
    isNative,
    todayStr,
    strideMeters,
    distanceKm,
    caloriesBurned,
    activeMins,
    progressPct,
    remainingSteps,
    startTracking,
    stopTracking,
    requestPermission,
    refreshSteps,
    resetTodaySteps,
    updateManualSteps,
  };
}
