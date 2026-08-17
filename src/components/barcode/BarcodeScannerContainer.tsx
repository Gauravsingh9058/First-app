import { useState, useEffect } from "react";
import { FullProductAnalysis, BarcodeSettings, ScanHistoryItem } from "@/types/barcode";
import { BarcodeStore } from "@/lib/barcode-store";
import { LocalStore } from "@/lib/local-store";
import { BarcodeScannerViewport } from "./BarcodeScannerViewport";
import { ProductDetailsView } from "./ProductDetailsView";
import { ScanHistoryView } from "./ScanHistoryView";
import { BarcodeSettingsModal } from "./BarcodeSettingsModal";
import { BarcodeManualDialog } from "./BarcodeManualDialog";
import { BarcodeOcrModal } from "./BarcodeOcrModal";
import { Loader2, Sparkles, WifiOff, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface BarcodeScannerContainerProps {
  userGoal?: string;
  weightKg?: number;
}

export function BarcodeScannerContainer({ userGoal, weightKg }: BarcodeScannerContainerProps) {
  const [settings, setSettings] = useState<BarcodeSettings>(() => BarcodeStore.getSettings());
  const [loading, setLoading] = useState(false);
  const [activeProduct, setActiveProduct] = useState<FullProductAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<"scan" | "history">("scan");

  // Dialog states
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isOcrOpen, setIsOcrOpen] = useState(false);

  // Sync settings when updated
  const handleUpdateSettings = (newSettings: BarcodeSettings) => {
    setSettings(newSettings);
    BarcodeStore.saveSettings(newSettings);
  };

  // Main barcode fetch dispatcher
  const fetchProductDetails = async (payload: { barcode?: string; ocrImages?: string[] }) => {
    setLoading(true);
    try {
      // Check offline mode
      if (typeof window !== "undefined" && !navigator.onLine && payload.barcode) {
        BarcodeStore.addOfflineScan(payload.barcode);
        toast.info(
          "Offline mode: Saved barcode locally. We will fetch full nutrition details once online!",
        );
        setLoading(false);
        return;
      }

      const userProfile = LocalStore.getProfile();

      const res = await fetch("/api/barcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barcode: payload.barcode,
          ocrImages: payload.ocrImages,
          userProfile,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to fetch product details.");
      }

      const data: FullProductAnalysis = await res.json();

      // Trigger Audio & Haptic Feedback
      if (settings.sound) {
        BarcodeStore.playSuccessSound();
      }
      if (settings.vibration) {
        BarcodeStore.triggerHaptic();
      }

      // Add to History
      BarcodeStore.addScanToHistory(data);

      setActiveProduct(data);
      toast.success(`Found product: ${data.productName}`);
    } catch (err: unknown) {
      console.error("Barcode fetch error:", err);
      const errMsg =
        err instanceof Error ? err.message : "Product not found. Try Packaging OCR mode!";
      toast.error(errMsg);
      setIsOcrOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBarcodeDetected = (barcode: string) => {
    if (loading) return;
    fetchProductDetails({ barcode });
  };

  const handleOcrImagesSubmitted = (images: string[]) => {
    if (loading) return;
    fetchProductDetails({ ocrImages: images });
  };

  return (
    <div className="space-y-6">
      {/* Tab Bar Switcher: Camera Scanner vs Scan History */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 rounded-[22px] bg-card/60 backdrop-blur-xl border border-border/80 p-1.5 shadow-lg">
          <button
            onClick={() => setActiveTab("scan")}
            className={`relative rounded-[18px] px-4 py-2.5 text-xs font-extrabold transition-all duration-300 active:scale-95 ${
              activeTab === "scan"
                ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(0,229,143,0.4)]"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            Camera Scanner
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`relative rounded-[18px] px-4 py-2.5 text-xs font-extrabold transition-all duration-300 active:scale-95 ${
              activeTab === "history"
                ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(0,229,143,0.4)]"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            Scan History
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="rounded-3xl border border-primary/30 bg-primary/5 p-8 text-center space-y-3 animate-pulse">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/20 text-primary mx-auto">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
          <h3 className="font-display text-lg font-bold text-foreground">
            Fetching Product Analysis...
          </h3>
          <p className="text-xs text-muted-foreground">
            Querying database and computing personalized macros, health score, and ingredient
            risks...
          </p>
        </div>
      )}

      {/* Product Details View */}
      {!loading && activeProduct && (
        <ProductDetailsView
          product={activeProduct}
          onBack={() => setActiveProduct(null)}
          onLogged={() => setActiveProduct(null)}
        />
      )}

      {/* Primary Scanner Viewport */}
      {!loading && !activeProduct && activeTab === "scan" && (
        <BarcodeScannerViewport
          settings={settings}
          onBarcodeDetected={handleBarcodeDetected}
          onOpenManual={() => setIsManualOpen(true)}
          onOpenOcr={() => setIsOcrOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      )}

      {/* History List View */}
      {!loading && !activeProduct && activeTab === "history" && (
        <ScanHistoryView
          onSelectScan={(item) => {
            setActiveProduct(item.fullData);
          }}
        />
      )}

      {/* Modals & Dialogs */}
      <BarcodeSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      <BarcodeManualDialog
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
        onSubmitBarcode={(code) => fetchProductDetails({ barcode: code })}
      />

      <BarcodeOcrModal
        isOpen={isOcrOpen}
        onClose={() => setIsOcrOpen(false)}
        onSubmitOcrImages={handleOcrImagesSubmitted}
      />
    </div>
  );
}
