import {
  BarcodeSettings,
  ScanHistoryItem,
  PendingOfflineScan,
  FullProductAnalysis,
} from "@/types/barcode";

const HISTORY_KEY = "nutrilens_barcode_history_v2";
const SETTINGS_KEY = "nutrilens_barcode_settings_v2";
const OFFLINE_QUEUE_KEY = "nutrilens_pending_barcodes_v2";

export const DEFAULT_BARCODE_SETTINGS: BarcodeSettings = {
  autoFlash: false,
  autoScan: true,
  vibration: true,
  sound: true,
  continuousScan: false,
};

export const BarcodeStore = {
  // --- Settings ---
  getSettings(): BarcodeSettings {
    if (typeof window === "undefined") return DEFAULT_BARCODE_SETTINGS;
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      return raw ? { ...DEFAULT_BARCODE_SETTINGS, ...JSON.parse(raw) } : DEFAULT_BARCODE_SETTINGS;
    } catch {
      return DEFAULT_BARCODE_SETTINGS;
    }
  },

  saveSettings(settings: BarcodeSettings): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  },

  // --- History ---
  getHistory(): ScanHistoryItem[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  addScanToHistory(product: FullProductAnalysis): ScanHistoryItem {
    const history = this.getHistory();
    // Remove duplicates with same barcode
    const filtered = history.filter((item) => item.barcode !== product.barcode);

    const newItem: ScanHistoryItem = {
      id: `scan-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      barcode: product.barcode,
      scannedAt: new Date().toISOString(),
      productName: product.productName,
      brand: product.brand,
      imageUrl: product.imageUrl,
      healthScore: product.healthScore ?? 70,
      healthGrade: product.healthGrade ?? "B",
      caloriesPerServing: Math.round(
        product.nutrition?.calories?.perServing ?? product.nutrition?.calories?.per100g ?? 0,
      ),
      isFavorite: false,
      fullData: product,
    };

    const updated = [newItem, ...filtered].slice(0, 100);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
    return newItem;
  },

  toggleFavorite(id: string): ScanHistoryItem[] {
    const history = this.getHistory();
    const updated = history.map((item) =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item,
    );
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
    return updated;
  },

  deleteHistoryItem(id: string): ScanHistoryItem[] {
    const history = this.getHistory();
    const updated = history.filter((item) => item.id !== id);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
    return updated;
  },

  clearHistory(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch {
      // ignore
    }
  },

  // --- Offline Queue ---
  getOfflineQueue(): PendingOfflineScan[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  addOfflineScan(barcode: string): void {
    const queue = this.getOfflineQueue();
    if (!queue.some((q) => q.barcode === barcode)) {
      queue.unshift({ barcode, timestamp: new Date().toISOString() });
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
        } catch {
          // ignore
        }
      }
    }
  },

  clearOfflineQueue(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(OFFLINE_QUEUE_KEY);
    } catch {
      // ignore
    }
  },

  // --- Audio & Haptic Feedback ---
  playSuccessSound(): void {
    if (typeof window === "undefined") return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Dual pitch pleasant synth chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc2.type = "triangle";

      osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5

      osc2.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc2.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.15); // D6

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.25);
      osc2.stop(ctx.currentTime + 0.25);
    } catch {
      // AudioContext blocked or unsupported
    }
  },

  triggerHaptic(): void {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate([80, 40, 100]);
      } catch {
        // ignore
      }
    }
  },
};
