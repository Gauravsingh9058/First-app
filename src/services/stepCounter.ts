import { registerPlugin, Capacitor, type PluginListenerHandle } from "@capacitor/core";
import { LocalStore } from "@/lib/local-store";

export interface StepSensorAvailability {
  available: boolean;
  sensorName?: string;
  message?: string;
}

export interface StepPermissionResult {
  granted: boolean;
  status: "granted" | "denied" | "prompt";
}

export interface StepCountResult {
  steps: number;
  date: string;
  isTracking: boolean;
  isSensorAvailable?: boolean;
}

export interface StepTrackingResult {
  success: boolean;
  steps?: number;
  date?: string;
  isTracking?: boolean;
}

export interface DailyStepHistoryResult {
  history: Record<string, number>;
}

export interface StepUpdateEvent {
  steps: number;
  date: string;
  isTracking: boolean;
}

export interface StepCounterPlugin {
  isStepSensorAvailable(): Promise<StepSensorAvailability>;
  checkPermission(): Promise<StepPermissionResult>;
  requestPermission(): Promise<StepPermissionResult>;
  getCurrentStepCount(): Promise<StepCountResult>;
  startStepTracking(): Promise<StepTrackingResult>;
  stopStepTracking(): Promise<StepTrackingResult>;
  getDailyStepHistory(): Promise<DailyStepHistoryResult>;
  resetTodaySteps(): Promise<{ success: boolean; steps: number }>;
  addListener(
    eventName: "stepUpdate",
    listenerFunc: (event: StepUpdateEvent) => void,
  ): Promise<PluginListenerHandle>;
  removeAllListeners(): Promise<void>;
}

/**
 * Web Fallback Implementation
 * When running in a standard web browser where Android TYPE_STEP_COUNTER is absent,
 * gracefully reads from persistent LocalStore rather than generating fake or random numbers.
 */
class StepCounterWeb implements StepCounterPlugin {
  private isTrackingEnabled = false;
  private listeners: Array<(event: StepUpdateEvent) => void> = [];

  private getTodayString(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  async isStepSensorAvailable(): Promise<StepSensorAvailability> {
    // In web browsers, native hardware TYPE_STEP_COUNTER is not accessible directly
    return {
      available: false,
      sensorName: "Browser Web Mode",
      message:
        "Native hardware TYPE_STEP_COUNTER is available when running on an Android device via Capacitor.",
    };
  }

  async checkPermission(): Promise<StepPermissionResult> {
    if (typeof window === "undefined") {
      return { granted: false, status: "denied" };
    }
    const stored = localStorage.getItem("nutrilens_web_step_permission");
    const granted = stored === "granted";
    return {
      granted,
      status: granted ? "granted" : "prompt",
    };
  }

  async requestPermission(): Promise<StepPermissionResult> {
    if (typeof window === "undefined") {
      return { granted: false, status: "denied" };
    }
    localStorage.setItem("nutrilens_web_step_permission", "granted");
    return {
      granted: true,
      status: "granted",
    };
  }

  async getCurrentStepCount(): Promise<StepCountResult> {
    const today = this.getTodayString();
    const steps = LocalStore.getSteps(today);
    return {
      steps,
      date: today,
      isTracking: this.isTrackingEnabled,
      isSensorAvailable: false,
    };
  }

  async startStepTracking(): Promise<StepTrackingResult> {
    this.isTrackingEnabled = true;
    const today = this.getTodayString();
    const steps = LocalStore.getSteps(today);
    return {
      success: true,
      steps,
      date: today,
      isTracking: true,
    };
  }

  async stopStepTracking(): Promise<StepTrackingResult> {
    this.isTrackingEnabled = false;
    return {
      success: true,
      isTracking: false,
    };
  }

  async getDailyStepHistory(): Promise<DailyStepHistoryResult> {
    const today = this.getTodayString();
    const steps = LocalStore.getSteps(today);
    return {
      history: { [today]: steps },
    };
  }

  async resetTodaySteps(): Promise<{ success: boolean; steps: number }> {
    const today = this.getTodayString();
    LocalStore.saveSteps(today, 0);
    this.notifyStepUpdate(0);
    return {
      success: true,
      steps: 0,
    };
  }

  async addListener(
    eventName: "stepUpdate",
    listenerFunc: (event: StepUpdateEvent) => void,
  ): Promise<PluginListenerHandle> {
    if (eventName === "stepUpdate") {
      this.listeners.push(listenerFunc);
    }
    return {
      remove: async () => {
        this.listeners = this.listeners.filter((l) => l !== listenerFunc);
      },
    };
  }

  async removeAllListeners(): Promise<void> {
    this.listeners = [];
  }

  private notifyStepUpdate(steps: number) {
    const event: StepUpdateEvent = {
      steps,
      date: this.getTodayString(),
      isTracking: this.isTrackingEnabled,
    };
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch (err) {
        console.error("Error in step listener", err);
      }
    }
  }
}

export const StepCounter = registerPlugin<StepCounterPlugin>("StepCounter", {
  web: () => new StepCounterWeb(),
});

export const isNativeAndroid = () => {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === "android";
};
