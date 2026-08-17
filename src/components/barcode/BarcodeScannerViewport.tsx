import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { BarcodeSettings } from "@/types/barcode";
import {
  Camera,
  Zap,
  ZapOff,
  Image,
  Search,
  Sparkles,
  Sliders,
  Volume2,
  VolumeX,
  Vibrate,
  Loader2,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

interface BarcodeScannerViewportProps {
  settings: BarcodeSettings;
  onBarcodeDetected: (barcode: string) => void;
  onOpenManual: () => void;
  onOpenOcr: () => void;
  onOpenSettings: () => void;
}

export function BarcodeScannerViewport({
  settings,
  onBarcodeDetected,
  onOpenManual,
  onOpenOcr,
  onOpenSettings,
}: BarcodeScannerViewportProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [hasFlash, setHasFlash] = useState(false);
  const [scanKey, setScanKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const html5QrcodeRef = useRef<Html5Qrcode | null>(null);
  const lastScannedBarcodeRef = useRef<{ code: string; time: number } | null>(null);

  const onDetectedRef = useRef(onBarcodeDetected);
  useEffect(() => {
    onDetectedRef.current = onBarcodeDetected;
  }, [onBarcodeDetected]);

  const videoTrackRef = useRef<MediaStreamTrack | null>(null);
  const containerId = "nutrilens-barcode-camera-reader";

  const handleRetryCamera = useCallback(() => {
    setCameraError(null);
    setScanKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function startCameraScanner() {
      try {
        setCameraError(null);
        setIsScanning(true);

        // Clean up prior scanner instance if present
        if (html5QrcodeRef.current) {
          try {
            if (html5QrcodeRef.current.isScanning) {
              await html5QrcodeRef.current.stop();
            }
            html5QrcodeRef.current.clear();
          } catch {
            // silent ignore
          }
          html5QrcodeRef.current = null;
        }

        const element = document.getElementById(containerId);
        if (!element) return;

        const html5Qrcode = new Html5Qrcode(containerId, {
          formatsToSupport: [
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.CODE_93,
            Html5QrcodeSupportedFormats.ITF,
            Html5QrcodeSupportedFormats.QR_CODE,
            Html5QrcodeSupportedFormats.DATA_MATRIX,
          ],
          verbose: false,
        });

        html5QrcodeRef.current = html5Qrcode;

        const config = {
          fps: 15,
          qrbox: { width: 280, height: 180 },
          aspectRatio: 1.0,
        };

        await html5Qrcode.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            if (!isMounted) return;
            const now = Date.now();
            // Debounce same barcode within 3 seconds to avoid duplicate triggers
            if (
              lastScannedBarcodeRef.current &&
              lastScannedBarcodeRef.current.code === decodedText &&
              now - lastScannedBarcodeRef.current.time < 3000
            ) {
              return;
            }
            lastScannedBarcodeRef.current = { code: decodedText, time: now };
            onDetectedRef.current(decodedText);
            if (!settings.continuousScan) {
              // Pause camera until user returns
              html5Qrcode.stop().catch(() => {});
            }
          },
          () => {
            // frame decode miss (silent)
          },
        );

        // Check if torch/flash is supported on active video track
        try {
          const videoElem = document.querySelector(`#${containerId} video`) as HTMLVideoElement;
          if (videoElem && videoElem.srcObject) {
            const stream = videoElem.srcObject as MediaStream;
            const track = stream.getVideoTracks()[0];
            if (track) {
              videoTrackRef.current = track;
              const capabilities = (track.getCapabilities?.() as Record<string, unknown>) || {};
              if (capabilities.torch) {
                setHasFlash(true);
                if (settings.autoFlash) {
                  track
                    .applyConstraints({ advanced: [{ torch: true }] } as MediaTrackConstraints)
                    .catch(() => {});
                  setIsFlashOn(true);
                }
              }
            }
          }
        } catch {
          // torch check fallback
        }
      } catch (err: unknown) {
        if (isMounted) {
          console.warn("Camera start error:", err);
          const errMsg =
            err instanceof Error
              ? err.message
              : "Could not access back camera. Please grant camera permissions or use manual barcode entry.";
          setCameraError(errMsg);
          setIsScanning(false);
        }
      }
    }

    startCameraScanner();

    return () => {
      isMounted = false;
      if (html5QrcodeRef.current) {
        try {
          if (html5QrcodeRef.current.isScanning) {
            html5QrcodeRef.current.stop().catch(() => {});
          }
          html5QrcodeRef.current.clear();
        } catch {
          // ignore cleanup error
        }
        html5QrcodeRef.current = null;
      }
      if (videoTrackRef.current) {
        try {
          videoTrackRef.current.stop();
        } catch {
          // ignore
        }
        videoTrackRef.current = null;
      }
    };
  }, [settings.autoFlash, settings.continuousScan, scanKey]);

  const toggleFlash = async () => {
    if (!videoTrackRef.current) return;
    try {
      const nextState = !isFlashOn;
      await videoTrackRef.current.applyConstraints({
        advanced: [{ torch: nextState }],
      } as MediaTrackConstraints);
      setIsFlashOn(nextState);
    } catch {
      toast.error("Flash not supported on this device/browser");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const scanner = new Html5Qrcode("temp-file-scanner");
      const result = await scanner.scanFile(file, true);
      try {
        scanner.clear();
      } catch {
        // silent
      }
      if (result) {
        onBarcodeDetected(result);
      }
    } catch {
      toast.error("Could not find barcode in uploaded image. Try Packaging OCR mode!");
      onOpenOcr();
    } finally {
      if (e.target) {
        e.target.value = "";
      }
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-300">
      {/* Scan Header Section */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-[20px] bg-gradient-to-br from-emerald-500/20 via-primary/10 to-teal-500/20 text-primary border border-primary/30 shadow-[0_0_20px_rgba(0,229,143,0.25)]">
            <Camera className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-widest font-bold text-primary flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-primary animate-ping" />
              NutriLens Engine
            </div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
              Scan Barcode
            </h1>
            <p className="text-xs text-muted-foreground">
              Point your camera at a food packaging barcode
            </p>
          </div>
        </div>

        {/* Floating Settings Button */}
        <button
          onClick={onOpenSettings}
          className="group relative flex items-center gap-2 rounded-[18px] border border-border/80 bg-card/80 backdrop-blur-md px-3.5 py-2.5 text-xs font-bold text-foreground shadow-lg hover:border-primary/50 hover:bg-card transition-all active:scale-95 shrink-0"
        >
          <Sliders className="h-4 w-4 text-primary group-hover:rotate-45 transition-transform duration-300" />
          <span className="hidden sm:inline">Settings</span>
        </button>
      </div>

      {/* Main Scanner Viewport Glass Card */}
      <div className="relative overflow-hidden rounded-[22px] border-2 border-primary/30 bg-black/90 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.6)] aspect-[4/3] sm:aspect-[16/9] flex items-center justify-center transition-all duration-300 group hover:border-primary/50">
        {/* Subtle glass shimmer reflection */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer pointer-events-none z-10" />

        {/* Live Camera Element */}
        <div id={containerId} className="w-full h-full object-cover" />
        <div id="temp-file-scanner" className="hidden" />

        {/* Camera Permission / Error Banner */}
        {cameraError && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl p-6 flex flex-col items-center justify-center text-center space-y-4 text-foreground z-20 border border-primary/20 rounded-[22px]">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
              <AlertCircle className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-foreground">Camera Unavailable</h3>
              <p className="text-xs text-muted-foreground max-w-sm mt-1.5 leading-relaxed">
                {cameraError}
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5 justify-center pt-2">
              <button
                onClick={handleRetryCamera}
                className="flex items-center gap-1.5 rounded-[16px] border border-primary/40 bg-primary/10 px-4 py-2.5 text-xs font-bold text-primary hover:bg-primary/20 active:scale-95 transition"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Retry Camera
              </button>
              <button
                onClick={onOpenManual}
                className="rounded-[16px] bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-5 py-2.5 text-xs font-black text-slate-950 shadow-[0_0_20px_rgba(52,211,153,0.4)] hover:opacity-95 active:scale-95 transition"
              >
                Enter Barcode Manually
              </button>
              <button
                onClick={onOpenOcr}
                className="rounded-[16px] border border-border/80 bg-card/80 backdrop-blur-md px-4 py-2.5 text-xs font-bold text-foreground hover:bg-muted active:scale-95 transition"
              >
                Packaging OCR
              </button>
            </div>
          </div>
        )}

        {/* Overlay Scanner Frame with Corners & Laser Line */}
        {!cameraError && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6 z-10">
            <div className="relative w-64 h-40 sm:w-80 sm:h-48 rounded-[20px] border border-primary/40 shadow-[0_0_30px_rgba(0,229,143,0.25)] bg-primary/5 backdrop-blur-[1px]">
              {/* Corner Accents with pulsing glow */}
              <div className="absolute -top-1.5 -left-1.5 w-7 h-7 border-t-4 border-l-4 border-primary rounded-tl-xl shadow-[0_0_12px_#00E58F] animate-pulse" />
              <div className="absolute -top-1.5 -right-1.5 w-7 h-7 border-t-4 border-r-4 border-primary rounded-tr-xl shadow-[0_0_12px_#00E58F] animate-pulse" />
              <div className="absolute -bottom-1.5 -left-1.5 w-7 h-7 border-b-4 border-l-4 border-primary rounded-bl-xl shadow-[0_0_12px_#00E58F] animate-pulse" />
              <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 border-b-4 border-r-4 border-primary rounded-br-xl shadow-[0_0_12px_#00E58F] animate-pulse" />

              {/* Animated Laser Line moving top to bottom */}
              <div className="absolute inset-x-2 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px_#00E58F] animate-laser-sweep rounded-full" />

              {/* Scanning particles background hint */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                <span className="text-[10px] uppercase font-mono tracking-widest text-primary animate-pulse">
                  Align Barcode Here
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Flash Torch Floating Toggle */}
        {hasFlash && !cameraError && (
          <button
            onClick={toggleFlash}
            className={`absolute top-4 right-4 z-20 rounded-full p-3 backdrop-blur-xl border transition-all duration-300 active:scale-90 ${
              isFlashOn
                ? "bg-amber-400 text-black border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.6)] scale-105"
                : "bg-black/60 text-white border-white/20 hover:bg-black/80 hover:border-white/40"
            }`}
          >
            {isFlashOn ? <Zap className="h-5 w-5 fill-black" /> : <ZapOff className="h-5 w-5" />}
          </button>
        )}
      </div>

      {/* Manual Entry & Action Cards Section */}
      <div className="grid grid-cols-3 gap-3">
        {/* Upload Image Card */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="group relative flex flex-col items-center justify-center gap-2 rounded-[22px] border border-border/80 bg-card/60 backdrop-blur-xl p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-card hover:shadow-[0_10px_25px_-5px_rgba(0,229,143,0.2)] active:scale-[0.97]"
        >
          <div className="grid h-10 w-10 place-items-center rounded-[14px] bg-gradient-to-br from-primary/20 to-emerald-500/10 text-primary border border-primary/20 group-hover:scale-110 transition-transform">
            <Image className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-foreground">Upload Image</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">Gallery / Photo</div>
          </div>
        </button>

        {/* Manual Code Card */}
        <button
          onClick={onOpenManual}
          className="group relative flex flex-col items-center justify-center gap-2 rounded-[22px] border border-border/80 bg-card/60 backdrop-blur-xl p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/50 hover:bg-card hover:shadow-[0_10px_25px_-5px_rgba(245,158,11,0.2)] active:scale-[0.97]"
        >
          <div className="grid h-10 w-10 place-items-center rounded-[14px] bg-gradient-to-br from-amber-500/20 to-orange-500/10 text-amber-500 border border-amber-500/20 group-hover:scale-110 transition-transform">
            <Search className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-foreground">Manual Code</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">Enter Numbers</div>
          </div>
        </button>

        {/* AI Label OCR Card */}
        <button
          onClick={onOpenOcr}
          className="group relative flex flex-col items-center justify-center gap-2 rounded-[22px] border border-border/80 bg-card/60 backdrop-blur-xl p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/50 hover:bg-card hover:shadow-[0_10px_25px_-5px_rgba(168,85,247,0.2)] active:scale-[0.97]"
        >
          <div className="grid h-10 w-10 place-items-center rounded-[14px] bg-gradient-to-br from-purple-500/20 to-indigo-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-foreground">Label OCR</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">Scan Nutrition</div>
          </div>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>
    </div>
  );
}
