import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, i as useQueryClient, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as getLocalDateString } from "./date-utils-CMo_soRo.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $ as Leaf, A as SlidersVertical, B as RefreshCw, C as Tag, F as Search, I as Scan, J as Minus, L as Scale, M as ShieldCheck, Mt as Calendar, N as ShieldAlert, O as Sparkles, Ot as Check, Q as LoaderCircle, St as CircleAlert, T as Star, Ut as ArrowLeft, V as Plus, Vt as Award, W as PenLine, _ as TrendingUp, a as VolumeX, b as ThumbsUp, ct as Globe, g as TriangleAlert, it as ImagePlus, jt as Camera, l as UtensilsCrossed, n as ZapOff, o as Volume2, p as Upload, r as X, rt as Image$1, s as Vibrate, t as Zap, ut as Flame, vt as Clock, wt as ChevronRight, xt as CircleCheck, y as Trash2, yt as CircleX, z as RotateCcw, zt as Barcode } from "../_libs/lucide-react.mjs";
import { a as LocalStore, v as useServerFn } from "./router-BBaCA5Zn.mjs";
import { t as logMeal } from "./meals.functions-CIOqHbgr.mjs";
import { n as Html5QrcodeSupportedFormats, t as Html5Qrcode } from "../_libs/html5-qrcode.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scan-CtVhGXf8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var HISTORY_KEY = "nutrilens_barcode_history_v2";
var SETTINGS_KEY = "nutrilens_barcode_settings_v2";
var OFFLINE_QUEUE_KEY = "nutrilens_pending_barcodes_v2";
var DEFAULT_BARCODE_SETTINGS = {
	autoFlash: false,
	autoScan: true,
	vibration: true,
	sound: true,
	continuousScan: false
};
var BarcodeStore = {
	getSettings() {
		if (typeof window === "undefined") return DEFAULT_BARCODE_SETTINGS;
		try {
			const raw = localStorage.getItem(SETTINGS_KEY);
			return raw ? {
				...DEFAULT_BARCODE_SETTINGS,
				...JSON.parse(raw)
			} : DEFAULT_BARCODE_SETTINGS;
		} catch {
			return DEFAULT_BARCODE_SETTINGS;
		}
	},
	saveSettings(settings) {
		if (typeof window === "undefined") return;
		try {
			localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
		} catch {}
	},
	getHistory() {
		if (typeof window === "undefined") return [];
		try {
			const raw = localStorage.getItem(HISTORY_KEY);
			return raw ? JSON.parse(raw) : [];
		} catch {
			return [];
		}
	},
	addScanToHistory(product) {
		const filtered = this.getHistory().filter((item) => item.barcode !== product.barcode);
		const newItem = {
			id: `scan-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
			barcode: product.barcode,
			scannedAt: (/* @__PURE__ */ new Date()).toISOString(),
			productName: product.productName,
			brand: product.brand,
			imageUrl: product.imageUrl,
			healthScore: product.healthScore ?? 70,
			healthGrade: product.healthGrade ?? "B",
			caloriesPerServing: Math.round(product.nutrition?.calories?.perServing ?? product.nutrition?.calories?.per100g ?? 0),
			isFavorite: false,
			fullData: product
		};
		const updated = [newItem, ...filtered].slice(0, 100);
		if (typeof window !== "undefined") try {
			localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
		} catch {}
		return newItem;
	},
	toggleFavorite(id) {
		const updated = this.getHistory().map((item) => item.id === id ? {
			...item,
			isFavorite: !item.isFavorite
		} : item);
		if (typeof window !== "undefined") try {
			localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
		} catch {}
		return updated;
	},
	deleteHistoryItem(id) {
		const updated = this.getHistory().filter((item) => item.id !== id);
		if (typeof window !== "undefined") try {
			localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
		} catch {}
		return updated;
	},
	clearHistory() {
		if (typeof window === "undefined") return;
		try {
			localStorage.removeItem(HISTORY_KEY);
		} catch {}
	},
	getOfflineQueue() {
		if (typeof window === "undefined") return [];
		try {
			const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
			return raw ? JSON.parse(raw) : [];
		} catch {
			return [];
		}
	},
	addOfflineScan(barcode) {
		const queue = this.getOfflineQueue();
		if (!queue.some((q) => q.barcode === barcode)) {
			queue.unshift({
				barcode,
				timestamp: (/* @__PURE__ */ new Date()).toISOString()
			});
			if (typeof window !== "undefined") try {
				localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
			} catch {}
		}
	},
	clearOfflineQueue() {
		if (typeof window === "undefined") return;
		try {
			localStorage.removeItem(OFFLINE_QUEUE_KEY);
		} catch {}
	},
	playSuccessSound() {
		if (typeof window === "undefined") return;
		try {
			const AudioCtx = window.AudioContext || window.webkitAudioContext;
			if (!AudioCtx) return;
			const ctx = new AudioCtx();
			const osc1 = ctx.createOscillator();
			const osc2 = ctx.createOscillator();
			const gain = ctx.createGain();
			osc1.type = "sine";
			osc2.type = "triangle";
			osc1.frequency.setValueAtTime(587.33, ctx.currentTime);
			osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + .12);
			osc2.frequency.setValueAtTime(880, ctx.currentTime);
			osc2.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + .15);
			gain.gain.setValueAtTime(.15, ctx.currentTime);
			gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .25);
			osc1.connect(gain);
			osc2.connect(gain);
			gain.connect(ctx.destination);
			osc1.start();
			osc2.start();
			osc1.stop(ctx.currentTime + .25);
			osc2.stop(ctx.currentTime + .25);
		} catch {}
	},
	triggerHaptic() {
		if (typeof window !== "undefined" && "vibrate" in navigator) try {
			navigator.vibrate([
				80,
				40,
				100
			]);
		} catch {}
	}
};
function BarcodeScannerViewport({ settings, onBarcodeDetected, onOpenManual, onOpenOcr, onOpenSettings }) {
	const [isScanning, setIsScanning] = (0, import_react.useState)(false);
	const [cameraError, setCameraError] = (0, import_react.useState)(null);
	const [isFlashOn, setIsFlashOn] = (0, import_react.useState)(false);
	const [hasFlash, setHasFlash] = (0, import_react.useState)(false);
	const [scanKey, setScanKey] = (0, import_react.useState)(0);
	const fileInputRef = (0, import_react.useRef)(null);
	const html5QrcodeRef = (0, import_react.useRef)(null);
	const lastScannedBarcodeRef = (0, import_react.useRef)(null);
	const onDetectedRef = (0, import_react.useRef)(onBarcodeDetected);
	(0, import_react.useEffect)(() => {
		onDetectedRef.current = onBarcodeDetected;
	}, [onBarcodeDetected]);
	const videoTrackRef = (0, import_react.useRef)(null);
	const containerId = "nutrilens-barcode-camera-reader";
	const handleRetryCamera = (0, import_react.useCallback)(() => {
		setCameraError(null);
		setScanKey((k) => k + 1);
	}, []);
	(0, import_react.useEffect)(() => {
		let isMounted = true;
		async function startCameraScanner() {
			try {
				setCameraError(null);
				setIsScanning(true);
				if (html5QrcodeRef.current) {
					try {
						if (html5QrcodeRef.current.isScanning) await html5QrcodeRef.current.stop();
						html5QrcodeRef.current.clear();
					} catch {}
					html5QrcodeRef.current = null;
				}
				if (!document.getElementById(containerId)) return;
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
						Html5QrcodeSupportedFormats.DATA_MATRIX
					],
					verbose: false
				});
				html5QrcodeRef.current = html5Qrcode;
				await html5Qrcode.start({ facingMode: "environment" }, {
					fps: 15,
					qrbox: {
						width: 280,
						height: 180
					},
					aspectRatio: 1
				}, (decodedText) => {
					if (!isMounted) return;
					const now = Date.now();
					if (lastScannedBarcodeRef.current && lastScannedBarcodeRef.current.code === decodedText && now - lastScannedBarcodeRef.current.time < 3e3) return;
					lastScannedBarcodeRef.current = {
						code: decodedText,
						time: now
					};
					onDetectedRef.current(decodedText);
					if (!settings.continuousScan) html5Qrcode.stop().catch(() => {});
				}, () => {});
				try {
					const videoElem = document.querySelector(`#${containerId} video`);
					if (videoElem && videoElem.srcObject) {
						const track = videoElem.srcObject.getVideoTracks()[0];
						if (track) {
							videoTrackRef.current = track;
							if ((track.getCapabilities?.() || {}).torch) {
								setHasFlash(true);
								if (settings.autoFlash) {
									track.applyConstraints({ advanced: [{ torch: true }] }).catch(() => {});
									setIsFlashOn(true);
								}
							}
						}
					}
				} catch {}
			} catch (err) {
				if (isMounted) {
					console.warn("Camera start error:", err);
					const errMsg = err instanceof Error ? err.message : "Could not access back camera. Please grant camera permissions or use manual barcode entry.";
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
					if (html5QrcodeRef.current.isScanning) html5QrcodeRef.current.stop().catch(() => {});
					html5QrcodeRef.current.clear();
				} catch {}
				html5QrcodeRef.current = null;
			}
			if (videoTrackRef.current) {
				try {
					videoTrackRef.current.stop();
				} catch {}
				videoTrackRef.current = null;
			}
		};
	}, [
		settings.autoFlash,
		settings.continuousScan,
		scanKey
	]);
	const toggleFlash = async () => {
		if (!videoTrackRef.current) return;
		try {
			const nextState = !isFlashOn;
			await videoTrackRef.current.applyConstraints({ advanced: [{ torch: nextState }] });
			setIsFlashOn(nextState);
		} catch {
			toast.error("Flash not supported on this device/browser");
		}
	};
	const handleFileUpload = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		try {
			const scanner = new Html5Qrcode("temp-file-scanner");
			const result = await scanner.scanFile(file, true);
			try {
				scanner.clear();
			} catch {}
			if (result) onBarcodeDetected(result);
		} catch {
			toast.error("Could not find barcode in uploaded image. Try Packaging OCR mode!");
			onOpenOcr();
		} finally {
			if (e.target) e.target.value = "";
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-300",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-12 w-12 place-items-center rounded-[20px] bg-gradient-to-br from-emerald-500/20 via-primary/10 to-teal-500/20 text-primary border border-primary/30 shadow-[0_0_20px_rgba(0,229,143,0.25)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-6 w-6 text-primary animate-pulse" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[11px] uppercase tracking-widest font-bold text-primary flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-2 w-2 rounded-full bg-primary animate-ping" }), "NutriLens Engine"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-2xl font-extrabold tracking-tight text-foreground",
							children: "Scan Barcode"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Point your camera at a food packaging barcode"
						})
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: onOpenSettings,
					className: "group relative flex items-center gap-2 rounded-[18px] border border-border/80 bg-card/80 backdrop-blur-md px-3.5 py-2.5 text-xs font-bold text-foreground shadow-lg hover:border-primary/50 hover:bg-card transition-all active:scale-95 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersVertical, { className: "h-4 w-4 text-primary group-hover:rotate-45 transition-transform duration-300" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: "Settings"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative overflow-hidden rounded-[22px] border-2 border-primary/30 bg-black/90 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.6)] aspect-[4/3] sm:aspect-[16/9] flex items-center justify-center transition-all duration-300 group hover:border-primary/50",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer pointer-events-none z-10" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						id: containerId,
						className: "w-full h-full object-cover"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						id: "temp-file-scanner",
						className: "hidden"
					}),
					cameraError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-0 bg-black/90 backdrop-blur-xl p-6 flex flex-col items-center justify-center text-center space-y-4 text-foreground z-20 border border-primary/20 rounded-[22px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-14 w-14 place-items-center rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-7 w-7" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-xl font-bold text-foreground",
								children: "Camera Unavailable"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground max-w-sm mt-1.5 leading-relaxed",
								children: cameraError
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2.5 justify-center pt-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: handleRetryCamera,
										className: "flex items-center gap-1.5 rounded-[16px] border border-primary/40 bg-primary/10 px-4 py-2.5 text-xs font-bold text-primary hover:bg-primary/20 active:scale-95 transition",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), "Retry Camera"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: onOpenManual,
										className: "rounded-[16px] bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-5 py-2.5 text-xs font-black text-slate-950 shadow-[0_0_20px_rgba(52,211,153,0.4)] hover:opacity-95 active:scale-95 transition",
										children: "Enter Barcode Manually"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: onOpenOcr,
										className: "rounded-[16px] border border-border/80 bg-card/80 backdrop-blur-md px-4 py-2.5 text-xs font-bold text-foreground hover:bg-muted active:scale-95 transition",
										children: "Packaging OCR"
									})
								]
							})
						]
					}),
					!cameraError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pointer-events-none absolute inset-0 flex items-center justify-center p-6 z-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative w-64 h-40 sm:w-80 sm:h-48 rounded-[20px] border border-primary/40 shadow-[0_0_30px_rgba(0,229,143,0.25)] bg-primary/5 backdrop-blur-[1px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-1.5 -left-1.5 w-7 h-7 border-t-4 border-l-4 border-primary rounded-tl-xl shadow-[0_0_12px_#00E58F] animate-pulse" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-1.5 -right-1.5 w-7 h-7 border-t-4 border-r-4 border-primary rounded-tr-xl shadow-[0_0_12px_#00E58F] animate-pulse" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-1.5 -left-1.5 w-7 h-7 border-b-4 border-l-4 border-primary rounded-bl-xl shadow-[0_0_12px_#00E58F] animate-pulse" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-1.5 -right-1.5 w-7 h-7 border-b-4 border-r-4 border-primary rounded-br-xl shadow-[0_0_12px_#00E58F] animate-pulse" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-2 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px_#00E58F] animate-laser-sweep rounded-full" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] uppercase font-mono tracking-widest text-primary animate-pulse",
										children: "Align Barcode Here"
									})
								})
							]
						})
					}),
					hasFlash && !cameraError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: toggleFlash,
						className: `absolute top-4 right-4 z-20 rounded-full p-3 backdrop-blur-xl border transition-all duration-300 active:scale-90 ${isFlashOn ? "bg-amber-400 text-black border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.6)] scale-105" : "bg-black/60 text-white border-white/20 hover:bg-black/80 hover:border-white/40"}`,
						children: isFlashOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-5 w-5 fill-black" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZapOff, { className: "h-5 w-5" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => fileInputRef.current?.click(),
						className: "group relative flex flex-col items-center justify-center gap-2 rounded-[22px] border border-border/80 bg-card/60 backdrop-blur-xl p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-card hover:shadow-[0_10px_25px_-5px_rgba(0,229,143,0.2)] active:scale-[0.97]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 place-items-center rounded-[14px] bg-gradient-to-br from-primary/20 to-emerald-500/10 text-primary border border-primary/20 group-hover:scale-110 transition-transform",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image$1, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-bold text-foreground",
							children: "Upload Image"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-muted-foreground mt-0.5",
							children: "Gallery / Photo"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: onOpenManual,
						className: "group relative flex flex-col items-center justify-center gap-2 rounded-[22px] border border-border/80 bg-card/60 backdrop-blur-xl p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/50 hover:bg-card hover:shadow-[0_10px_25px_-5px_rgba(245,158,11,0.2)] active:scale-[0.97]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 place-items-center rounded-[14px] bg-gradient-to-br from-amber-500/20 to-orange-500/10 text-amber-500 border border-amber-500/20 group-hover:scale-110 transition-transform",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-bold text-foreground",
							children: "Manual Code"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-muted-foreground mt-0.5",
							children: "Enter Numbers"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: onOpenOcr,
						className: "group relative flex flex-col items-center justify-center gap-2 rounded-[22px] border border-border/80 bg-card/60 backdrop-blur-xl p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/50 hover:bg-card hover:shadow-[0_10px_25px_-5px_rgba(168,85,247,0.2)] active:scale-[0.97]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 place-items-center rounded-[14px] bg-gradient-to-br from-purple-500/20 to-indigo-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-bold text-foreground",
							children: "Label OCR"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-muted-foreground mt-0.5",
							children: "Scan Nutrition"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileInputRef,
						type: "file",
						accept: "image/*",
						className: "hidden",
						onChange: handleFileUpload
					})
				]
			})
		]
	});
}
var PORTION_PRESETS = [
	25,
	50,
	75,
	100,
	150,
	200,
	250
];
function ProductDetailsView({ product, onBack, onLogged }) {
	const baseGrams = product.baseServingGrams || 100;
	const [selectedGrams, setSelectedGrams] = (0, import_react.useState)(baseGrams);
	const [nutritionTab, setNutritionTab] = (0, import_react.useState)("portion");
	const scale = selectedGrams / 100;
	const calcNutrient = (per100g, decimals = 1) => {
		const val = (per100g ?? 0) * scale;
		const factor = Math.pow(10, decimals);
		return decimals === 0 ? Math.round(val) : Math.round(val * factor) / factor;
	};
	const currentCalories = calcNutrient(product.nutrition?.calories?.per100g, 0);
	const currentProtein = calcNutrient(product.nutrition?.protein?.per100g, 1);
	const currentCarbs = calcNutrient(product.nutrition?.carbs?.per100g, 1);
	const currentFat = calcNutrient(product.nutrition?.fat?.per100g, 1);
	const currentSugar = calcNutrient(product.nutrition?.sugar?.per100g, 1);
	const currentFiber = calcNutrient(product.nutrition?.fiber?.per100g, 1);
	const currentSodium = calcNutrient(product.nutrition?.sodium?.per100g, 0);
	const currentPotassium = calcNutrient(product.nutrition?.potassium?.per100g, 0);
	const currentCalcium = calcNutrient(product.nutrition?.calcium?.per100g, 0);
	const currentIron = calcNutrient(product.nutrition?.iron?.per100g, 1);
	const currentVitA = calcNutrient(product.nutrition?.vitaminA?.per100g, 0);
	calcNutrient(product.nutrition?.vitaminC?.per100g, 1);
	const currentVitD = calcNutrient(product.nutrition?.vitaminD?.per100g, 1);
	const currentVitB12 = calcNutrient(product.nutrition?.vitaminB12?.per100g, 1);
	const getGradeBadge = (grade) => {
		switch (grade) {
			case "A+":
			case "A": return "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
			case "B": return "bg-lime-500/15 text-lime-500 border-lime-500/30";
			case "C": return "bg-amber-500/15 text-amber-500 border-amber-500/30";
			case "D": return "bg-orange-500/15 text-orange-500 border-orange-500/30";
			default: return "bg-rose-500/15 text-rose-500 border-rose-500/30";
		}
	};
	const getRiskIcon = (level) => {
		switch (level) {
			case "Safe": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-500 shrink-0" });
			case "Moderate": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-amber-500 shrink-0" });
			default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4 text-rose-500 shrink-0" });
		}
	};
	const getRiskBadgeColor = (level) => {
		switch (level) {
			case "Safe": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/30";
			case "Moderate": return "bg-amber-500/10 text-amber-500 border-amber-500/30";
			default: return "bg-rose-500/10 text-rose-500 border-rose-500/30";
		}
	};
	const handleLogMeal = () => {
		const eatenOn = getLocalDateString();
		const eatenAt = (/* @__PURE__ */ new Date()).toISOString();
		LocalStore.addMeal({
			eaten_at: eatenAt,
			eaten_on: eatenOn,
			name: `${product.productName} (${selectedGrams}g)`,
			source: "barcode",
			serving_desc: `${selectedGrams}g portion - Barcode: ${product.barcode}`,
			calories: currentCalories,
			protein_g: currentProtein,
			carbs_g: currentCarbs,
			fat_g: currentFat,
			sugar_g: currentSugar,
			fiber_g: currentFiber,
			sodium_mg: currentSodium,
			potassium_mg: currentPotassium,
			calcium_mg: currentCalcium,
			iron_mg: currentIron,
			vit_a_ug: currentVitA,
			vit_d_ug: currentVitD,
			vit_b12_ug: currentVitB12,
			confidence: .98
		});
		toast.success(`Logged ${product.productName} (${currentCalories} kcal) to daily food log!`);
		if (onLogged) onLogged();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-3 duration-300",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: onBack,
					className: "inline-flex items-center gap-2 rounded-[18px] border border-border/80 bg-card/80 backdrop-blur-md px-4 py-2.5 text-xs font-bold text-foreground shadow-sm hover:bg-muted active:scale-95 transition",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4 text-primary" }), " Scan Another Item"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "rounded-full bg-primary/10 px-3.5 py-1 text-[11px] font-mono font-bold text-primary border border-primary/20",
						children: [
							product.barcodeType,
							": ",
							product.barcode
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative overflow-hidden rounded-[22px] border border-border/80 bg-card/80 backdrop-blur-xl p-6 shadow-2xl space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row items-start sm:items-center gap-6",
					children: [product.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative h-32 w-32 shrink-0 overflow-hidden rounded-[20px] bg-muted border border-border/60 shadow-lg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: product.imageUrl,
							alt: product.productName,
							className: "h-full w-full object-cover"
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-32 w-32 shrink-0 place-items-center rounded-[20px] bg-gradient-to-br from-primary/10 to-emerald-500/5 border border-primary/20 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-10 w-10 text-primary animate-pulse" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2.5 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-extrabold text-primary uppercase tracking-widest",
										children: product.brand
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "•"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-3 w-3 text-primary" }),
											" ",
											product.countryOfOrigin
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "•"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-3 w-3" }),
											" ",
											product.category
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl sm:text-3xl font-extrabold leading-tight text-foreground tracking-tight",
								children: product.productName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2 pt-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 font-display text-xs font-bold shadow-sm ${getGradeBadge(product.healthGrade)}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-4 w-4" }),
											" Grade ",
											product.healthGrade,
											" (",
											product.healthScore,
											"/100)"
										]
									}),
									product.isVeg ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-400",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "h-3.5 w-3.5" }), " Vegetarian"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "inline-flex items-center gap-1 rounded-xl border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-[11px] font-bold text-rose-400",
										children: "Non-Veg"
									}),
									product.isOrganic && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "inline-flex items-center gap-1 rounded-xl border border-lime-500/30 bg-lime-500/10 px-2.5 py-1 text-[11px] font-bold text-lime-400",
										children: "Organic"
									}),
									product.dietaryBadges?.map((badge, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-xl border border-border/80 bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground",
										children: badge
									}, idx))
								]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[18px] border border-primary/30 bg-primary/10 p-4 space-y-1.5 text-sm shadow-[0_0_20px_rgba(0,229,143,0.15)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 font-display text-xs font-extrabold uppercase tracking-wider text-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }), " Nutritionist Verdict"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs sm:text-sm font-medium text-foreground leading-relaxed",
						children: product.aiRecommendation
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[22px] border border-border/80 bg-card/80 backdrop-blur-xl p-6 shadow-2xl space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-display text-lg font-extrabold text-foreground flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "h-5 w-5 text-primary" }), " Portion Calculator"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Adjust portion weight to automatically recalculate calories & nutrients"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center rounded-2xl bg-muted/50 p-1 border border-border/80 shrink-0 self-start sm:self-auto",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setNutritionTab("portion"),
								className: `rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${nutritionTab === "portion" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"}`,
								children: [
									"Calculated (",
									selectedGrams,
									"g)"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setNutritionTab("per100g"),
								className: `rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${nutritionTab === "per100g" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"}`,
								children: "Standard Per 100g"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [PORTION_PRESETS.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setSelectedGrams(g),
							className: `rounded-xl border px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${selectedGrams === g ? "bg-primary text-primary-foreground border-primary shadow-[0_0_12px_rgba(0,229,143,0.3)]" : "border-border/80 bg-background/80 text-muted-foreground hover:bg-muted"}`,
							children: [g, "g"]
						}, g)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 border-l border-border/80 pl-3 ml-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								value: selectedGrams,
								onChange: (e) => setSelectedGrams(Math.max(1, Number(e.target.value) || 1)),
								className: "w-16 rounded-xl border border-border/80 bg-background px-2.5 py-1 text-xs font-mono font-bold text-foreground outline-none focus:border-primary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground font-semibold",
								children: "grams"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-[18px] border border-border/80 bg-muted/20 p-4 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs font-bold text-muted-foreground flex items-center justify-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-3.5 w-3.5 text-amber-500" }), " Calories"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-display text-2xl font-extrabold text-foreground mt-1",
										children: nutritionTab === "portion" ? currentCalories : product.nutrition.calories.per100g
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-muted-foreground font-mono",
										children: "kcal"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-[18px] border border-border/80 bg-muted/20 p-4 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-bold text-muted-foreground",
										children: "Protein"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-display text-2xl font-extrabold text-rose-400 mt-1",
										children: [nutritionTab === "portion" ? currentProtein : product.nutrition.protein.per100g, "g"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-muted-foreground font-mono",
										children: "muscle synthesis"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-[18px] border border-border/80 bg-muted/20 p-4 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-bold text-muted-foreground",
										children: "Carbs / Sugar"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-display text-2xl font-extrabold text-amber-400 mt-1",
										children: [nutritionTab === "portion" ? currentCarbs : product.nutrition.carbs.per100g, "g"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-muted-foreground font-mono",
										children: [
											"(",
											nutritionTab === "portion" ? currentSugar : product.nutrition.sugar.per100g,
											"g sugar)"
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-[18px] border border-border/80 bg-muted/20 p-4 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-bold text-muted-foreground",
										children: "Fat / Sodium"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-display text-2xl font-extrabold text-emerald-400 mt-1",
										children: [nutritionTab === "portion" ? currentFat : product.nutrition.fat.per100g, "g"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-muted-foreground font-mono",
										children: [
											"(",
											nutritionTab === "portion" ? currentSodium : product.nutrition.sodium.per100g,
											"mg sodium)"
										]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleLogMeal,
						className: "w-full flex items-center justify-center gap-2 rounded-[18px] bg-primary px-6 py-4 font-display text-sm font-extrabold text-primary-foreground shadow-[0_0_25px_rgba(0,229,143,0.35)] hover:opacity-95 active:scale-[0.98] transition",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-5 w-5" }),
							" Log ",
							product.productName,
							" (",
							currentCalories,
							" kcal) to Meal Log"
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-border bg-card p-6 shadow-xl space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-lg font-bold text-foreground",
						children: "Complete Nutrition Panel"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							"Detailed Breakdown per 100g and per serving (",
							product.servingSize || "1 portion",
							")"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border/80 text-xs font-bold text-muted-foreground uppercase tracking-wider",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2.5",
										children: "Nutrient"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2.5 text-right",
										children: "Per 100g"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2.5 text-right",
										children: "Per Serving"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2.5 text-right",
										children: "Unit"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-border/40 text-foreground text-xs font-medium",
								children: Object.entries(product.nutrition).map(([key, info]) => {
									if (!info) return null;
									const formattedName = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "hover:bg-muted/30 transition",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-2.5 capitalize font-semibold",
												children: formattedName
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-2.5 text-right font-mono text-muted-foreground",
												children: info.per100g
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-2.5 text-right font-mono font-bold text-foreground",
												children: info.perServing
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-2.5 text-right text-muted-foreground",
												children: info.unit
											})
										]
									}, key);
								})
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-border bg-card p-6 shadow-xl space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "font-display text-lg font-bold text-foreground flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5 text-amber-400" }), " Health Analysis"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-foreground leading-relaxed bg-muted/20 border border-border/60 rounded-2xl p-4",
					children: product.aiHealthAnalysisText
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-border bg-card p-6 shadow-xl space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-display text-lg font-bold text-foreground flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-5 w-5 text-rose-500" }), " Ingredient Analysis & Risk Highlights"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground font-mono",
							children: [product.ingredientsList?.length || 0, " Ingredients Detected"]
						})]
					}),
					product.ingredientRisks && product.ingredientRisks.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
						children: product.ingredientRisks.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-sm text-foreground flex items-center gap-2",
									children: [
										getRiskIcon(item.riskLevel),
										" ",
										item.name
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getRiskBadgeColor(item.riskLevel)}`,
									children: item.riskLevel
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground leading-normal",
								children: item.description
							})]
						}, idx))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground italic",
						children: "No harmful additives or high-risk artificial ingredients flagged."
					}),
					product.ingredientsList && product.ingredientsList.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-bold text-muted-foreground mb-1",
							children: "Full Ingredients List:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground/80 leading-relaxed bg-background p-3 rounded-xl border border-border/60",
							children: product.ingredientsList.join(", ")
						})]
					})
				]
			}),
			product.personalizedAnalysis && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-border bg-card p-6 shadow-xl space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-display text-lg font-bold text-foreground flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsUp, { className: "h-5 w-5 text-emerald-500" }), " Personalized Profile Suitability"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Evaluated against your active physical profile and dietary goals"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
						children: Object.entries(product.personalizedAnalysis).map(([key, val]) => {
							if (!val) return null;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-xs text-foreground",
										children: {
											weightLoss: "Weight Loss Goal",
											muscleGain: "Muscle Building Goal",
											diabetes: "Blood Sugar & Diabetes Fit",
											heartHealth: "Cardiovascular Health",
											children: "Child Friendly",
											elderly: "Elderly Digestion Fit",
											dailyUse: "Daily Meal Plan Suitable"
										}[key] || key
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `rounded-full px-2.5 py-0.5 text-[10px] font-bold ${val.suitable ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`,
										children: val.suitable ? "Suitable" : "Limit / Avoid"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: val.reason
								})]
							}, key);
						})
					})
				]
			}),
			product.alternatives && product.alternatives.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-border bg-card p-6 shadow-xl space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-display text-lg font-bold text-foreground flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-5 w-5 text-primary" }), " Healthier Alternatives"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Swap with higher rated options for better nutrition"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
						children: product.alternatives.map((alt, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-background p-4 space-y-2 hover:border-primary/40 transition shadow-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold uppercase text-primary",
										children: alt.brand
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "font-bold text-sm text-foreground",
										children: alt.name
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-500",
										children: [
											"Score ",
											alt.healthScore,
											"/100"
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 text-xs text-muted-foreground font-mono",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [alt.calories, " kcal"] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [alt.protein, "g protein"] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: alt.estimatedPrice })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-xl border border-border/40",
									children: alt.whyBetter
								})
							]
						}, idx))
					})
				]
			})
		]
	});
}
function ScanHistoryView({ onSelectScan }) {
	const [history, setHistory] = (0, import_react.useState)(() => BarcodeStore.getHistory());
	const [search, setSearch] = (0, import_react.useState)("");
	const [onlyFavorites, setOnlyFavorites] = (0, import_react.useState)(false);
	const [showClearConfirm, setShowClearConfirm] = (0, import_react.useState)(false);
	const handleToggleFavorite = (e, id) => {
		e.stopPropagation();
		const updated = BarcodeStore.toggleFavorite(id);
		setHistory(updated);
		toast.success("Updated favorite");
	};
	const handleDelete = (e, id) => {
		e.stopPropagation();
		const updated = BarcodeStore.deleteHistoryItem(id);
		setHistory(updated);
		toast.success("Scan deleted from history");
	};
	const handleClearAll = () => {
		BarcodeStore.clearHistory();
		setHistory([]);
		setShowClearConfirm(false);
		toast.success("Scan history cleared");
	};
	const filtered = history.filter((item) => {
		const matchesSearch = item.productName.toLowerCase().includes(search.toLowerCase()) || item.brand.toLowerCase().includes(search.toLowerCase()) || item.barcode.includes(search);
		const matchesFav = onlyFavorites ? item.isFavorite : true;
		return matchesSearch && matchesFav;
	});
	if (history.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[22px] border border-border/80 bg-card/60 backdrop-blur-xl p-8 text-center space-y-4 shadow-xl animate-in fade-in duration-300",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid h-16 w-16 place-items-center rounded-[20px] bg-gradient-to-br from-primary/20 via-emerald-500/10 to-teal-500/20 text-primary border border-primary/30 shadow-[0_0_25px_rgba(0,229,143,0.25)] mx-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Barcode, { className: "h-8 w-8 text-primary animate-pulse" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "font-display text-xl font-extrabold text-foreground",
			children: "No Scan History Yet"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground max-w-xs mx-auto mt-1.5 leading-relaxed",
			children: "Point your camera at food barcodes to build your personal scanned food history and health logs."
		})] })]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary border border-primary/20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Barcode, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg font-extrabold text-foreground",
							children: "Scan History"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "rounded-full bg-primary/10 border border-primary/20 px-3 py-0.5 text-xs font-mono font-bold text-primary",
							children: [filtered.length, " items"]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setOnlyFavorites(!onlyFavorites),
						className: `flex items-center gap-1.5 rounded-[14px] border px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${onlyFavorites ? "bg-amber-500/15 text-amber-400 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.25)]" : "border-border/80 bg-card/80 text-muted-foreground hover:bg-muted"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `h-3.5 w-3.5 ${onlyFavorites ? "fill-amber-400" : ""}` }), " Favorites"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setShowClearConfirm(true),
						className: "rounded-[14px] border border-border/80 bg-card/80 px-3 py-1.5 text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all active:scale-95",
						children: "Clear History"
					})]
				})]
			}),
			showClearConfirm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md rounded-[22px] border border-border/80 bg-card/90 backdrop-blur-xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-10 w-10 place-items-center rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-5 w-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-base font-bold text-foreground",
									children: "Clear Scan History?"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "This action cannot be undone"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setShowClearConfirm(false),
								className: "rounded-xl p-2 text-muted-foreground hover:bg-muted transition",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground leading-relaxed",
							children: [
								"Are you sure you want to permanently delete all ",
								history.length,
								" scanned products from your local history?"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-2.5 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowClearConfirm(false),
								className: "rounded-xl border border-border bg-background px-4 py-2 text-xs font-bold text-foreground hover:bg-muted active:scale-95 transition",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleClearAll,
								className: "flex items-center gap-1.5 rounded-xl bg-rose-500 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-rose-600 active:scale-95 transition",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), " Clear All History"]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					value: search,
					onChange: (e) => setSearch(e.target.value),
					placeholder: "Search scans by product name, brand or barcode...",
					className: "w-full rounded-[18px] border border-border/80 bg-card/60 backdrop-blur-xl pl-10 pr-4 py-3 text-xs font-medium outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/40 transition-all"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: filtered.map((item) => {
					const dateObj = new Date(item.scannedAt);
					const dateStr = dateObj.toLocaleDateString(void 0, {
						month: "short",
						day: "numeric"
					});
					const timeStr = dateObj.toLocaleTimeString(void 0, {
						hour: "2-digit",
						minute: "2-digit"
					});
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => onSelectScan(item),
						className: "group cursor-pointer rounded-[22px] border border-border/80 bg-card/60 backdrop-blur-xl p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-card hover:shadow-[0_10px_25px_-5px_rgba(0,229,143,0.15)] active:scale-[0.98] flex items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3.5 min-w-0",
							children: [item.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: item.imageUrl,
								alt: item.productName,
								className: "h-12 w-12 rounded-[16px] object-cover bg-muted border border-border/60 shrink-0"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-12 w-12 place-items-center rounded-[16px] bg-gradient-to-br from-primary/20 to-teal-500/10 text-primary font-extrabold text-xs border border-primary/20 shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Barcode, { className: "h-6 w-6" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1 min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold uppercase tracking-wider text-primary truncate",
											children: item.brand || "Brand"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] text-muted-foreground font-mono shrink-0",
											children: ["#", item.barcode]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "font-bold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors",
										children: item.productName
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground font-medium",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3 w-3 text-primary" }),
													" ",
													dateStr
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }),
													" ",
													timeStr
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-1 text-emerald-400 font-bold",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-3 w-3 text-amber-500" }),
													" ",
													item.caloriesPerServing,
													" kcal"
												]
											})
										]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5 shrink-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "hidden sm:inline-flex items-center gap-1 rounded-xl border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary shadow-[0_0_10px_rgba(0,229,143,0.15)]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-3.5 w-3.5 text-primary" }),
										" Grade ",
										item.healthGrade
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: (e) => handleToggleFavorite(e, item.id),
									className: "rounded-xl p-2 text-muted-foreground hover:bg-amber-500/10 hover:text-amber-400 transition",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `h-4 w-4 ${item.isFavorite ? "fill-amber-400 text-amber-400" : ""}` })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: (e) => handleDelete(e, item.id),
									className: "rounded-xl p-2 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-400 transition",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all" })
							]
						})]
					}, item.id);
				})
			})
		]
	});
}
function BarcodeSettingsModal({ isOpen, onClose, settings, onUpdateSettings }) {
	if (!isOpen) return null;
	const toggle = (key) => {
		onUpdateSettings({
			...settings,
			[key]: !settings[key]
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-6 text-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border/60 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-9 w-9 place-items-center rounded-2xl bg-primary/10 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersVertical, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg font-bold",
							children: "Scanner Settings"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Customize camera, sound & vibration feedback"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-2xl border border-border/80 bg-muted/20 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-bold text-foreground flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-emerald-500" }), " Auto Detect Barcode"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Detect barcode automatically without tapping capture button"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => toggle("autoScan"),
								className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.autoScan ? "bg-primary" : "bg-muted-foreground/30"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.autoScan ? "translate-x-6" : "translate-x-1"}` })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-2xl border border-border/80 bg-muted/20 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-bold text-foreground flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Vibrate, { className: "h-4 w-4 text-primary" }), " Haptic Vibration"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Vibrate phone on successful barcode detection"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => toggle("vibration"),
								className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.vibration ? "bg-primary" : "bg-muted-foreground/30"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.vibration ? "translate-x-6" : "translate-x-1"}` })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-2xl border border-border/80 bg-muted/20 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-bold text-foreground flex items-center gap-2",
									children: [
										settings.sound ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-4 w-4 text-amber-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "h-4 w-4 text-muted-foreground" }),
										" ",
										"Sound Chime"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Play a pleasant synth audio chime when product is found"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => toggle("sound"),
								className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.sound ? "bg-primary" : "bg-muted-foreground/30"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.sound ? "translate-x-6" : "translate-x-1"}` })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-2xl border border-border/80 bg-muted/20 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-bold text-foreground flex items-center gap-2",
									children: [
										settings.autoFlash ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-4 w-4 text-amber-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZapOff, { className: "h-4 w-4 text-muted-foreground" }),
										" ",
										"Torch Auto Flash"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Turn on camera torch light automatically in low light"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => toggle("autoFlash"),
								className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.autoFlash ? "bg-primary" : "bg-muted-foreground/30"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.autoFlash ? "translate-x-6" : "translate-x-1"}` })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-2xl border border-border/80 bg-muted/20 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-bold text-foreground flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 text-indigo-400" }), " Continuous Scan Mode"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Keep camera active after scanning to scan multiple items quickly"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => toggle("continuousScan"),
								className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.continuousScan ? "bg-primary" : "bg-muted-foreground/30"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.continuousScan ? "translate-x-6" : "translate-x-1"}` })
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "w-full rounded-2xl bg-primary px-5 py-3 font-display text-sm font-bold text-primary-foreground shadow-lg hover:opacity-90 active:scale-95 transition",
					children: "Save & Done"
				})
			]
		})
	});
}
var SAMPLE_BARCODES = [
	{
		label: "Nutella Hazelnut Spread",
		code: "301762042203"
	},
	{
		label: "Amul Taaza Milk",
		code: "8901058000000"
	},
	{
		label: "Quaker Rolled Oats",
		code: "8901491101820"
	},
	{
		label: "Britannia NutriChoice",
		code: "8901063141125"
	},
	{
		label: "Lay's Salted Chips",
		code: "8901491000826"
	},
	{
		label: "Maggi 2-Min Noodles",
		code: "8901058852302"
	},
	{
		label: "Parle-G Biscuits",
		code: "8901262010052"
	}
];
function BarcodeManualDialog({ isOpen, onClose, onSubmitBarcode }) {
	const [code, setCode] = (0, import_react.useState)("");
	if (!isOpen) return null;
	const handleSubmit = (e) => {
		e?.preventDefault();
		if (code.trim()) {
			onSubmitBarcode(code.trim());
			setCode("");
			onClose();
		}
	};
	const handleSelectSample = (sampleCode) => {
		onSubmitBarcode(sampleCode);
		onClose();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5 text-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border/60 pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-9 w-9 place-items-center rounded-2xl bg-primary/10 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg font-bold",
							children: "Manual Barcode Entry"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Type or paste EAN-13, EAN-8, or UPC code"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							autoFocus: true,
							value: code,
							onChange: (e) => setCode(e.target.value),
							placeholder: "e.g. 301762042203 or 8901058000000",
							className: "w-full rounded-2xl border border-border bg-background pl-10 pr-4 py-3 text-sm font-mono font-medium outline-none focus:border-primary transition"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "submit",
						disabled: !code.trim(),
						className: "w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-5 py-3 text-sm font-black text-slate-950 shadow-[0_0_20px_rgba(52,211,153,0.35)] hover:opacity-95 disabled:opacity-50 transition active:scale-[0.98]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scan, { className: "h-4 w-4" }), " Fetch Product Details"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2.5 pt-2 border-t border-border/60",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs font-semibold text-foreground flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 text-primary" }), " Test with Sample Barcodes:"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2 text-xs",
						children: SAMPLE_BARCODES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => handleSelectSample(item.code),
							className: "rounded-xl border border-border bg-muted/40 px-3 py-1.5 text-xs font-medium hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-3 w-3 text-muted-foreground" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] text-muted-foreground font-mono",
									children: [
										"(",
										item.code,
										")"
									]
								})
							]
						}, item.code))
					})]
				})
			]
		})
	});
}
function BarcodeOcrModal({ isOpen, onClose, onSubmitOcrImages }) {
	const [frontImg, setFrontImg] = (0, import_react.useState)(null);
	const [nutritionImg, setNutritionImg] = (0, import_react.useState)(null);
	const [ingredientImg, setIngredientImg] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const frontInputRef = (0, import_react.useRef)(null);
	const nutritionInputRef = (0, import_react.useRef)(null);
	const ingredientInputRef = (0, import_react.useRef)(null);
	if (!isOpen) return null;
	const handleImageRead = (file, setter) => {
		const reader = new FileReader();
		reader.onload = () => {
			if (typeof reader.result === "string") setter(reader.result);
		};
		reader.readAsDataURL(file);
	};
	const handleAnalyze = () => {
		const images = [
			frontImg,
			nutritionImg,
			ingredientImg
		].filter(Boolean);
		if (images.length === 0) {
			toast.error("Please upload at least one photo (Front package or Nutrition label)");
			return;
		}
		setLoading(true);
		onSubmitOcrImages(images);
		setLoading(false);
		onClose();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5 text-foreground max-h-[90vh] overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border/60 pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-9 w-9 place-items-center rounded-2xl bg-primary/10 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg font-bold",
							children: "Packaging & Label OCR"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Barcode not recognized? Upload packaging photos for instant estimation"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground leading-relaxed",
					children: "Snap clear photos of the product front label, nutrition table, or ingredient list. Our OCR engine reads the exact text to generate full nutrition facts."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => frontInputRef.current?.click(),
							className: "relative cursor-pointer rounded-2xl border-2 border-dashed border-border hover:border-primary/50 bg-muted/20 p-4 text-center transition flex flex-col items-center justify-center min-h-[120px]",
							children: [frontImg ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative w-full h-full min-h-[90px] flex items-center justify-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: frontImg,
									alt: "Front",
									className: "max-h-24 rounded-xl object-contain shadow-sm"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute top-0 right-0 bg-emerald-500 text-white rounded-full p-0.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" })
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "h-6 w-6 text-primary mx-auto" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-bold text-foreground",
										children: "1. Front Photo"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-muted-foreground",
										children: "Product Name & Brand"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: frontInputRef,
								type: "file",
								accept: "image/*",
								className: "hidden",
								onChange: (e) => e.target.files?.[0] && handleImageRead(e.target.files[0], setFrontImg)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => nutritionInputRef.current?.click(),
							className: "relative cursor-pointer rounded-2xl border-2 border-dashed border-border hover:border-primary/50 bg-muted/20 p-4 text-center transition flex flex-col items-center justify-center min-h-[120px]",
							children: [nutritionImg ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative w-full h-full min-h-[90px] flex items-center justify-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: nutritionImg,
									alt: "Nutrition Table",
									className: "max-h-24 rounded-xl object-contain shadow-sm"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute top-0 right-0 bg-emerald-500 text-white rounded-full p-0.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" })
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "h-6 w-6 text-primary mx-auto" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-bold text-foreground",
										children: "2. Nutrition Table"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-muted-foreground",
										children: "Calories & Macros"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: nutritionInputRef,
								type: "file",
								accept: "image/*",
								className: "hidden",
								onChange: (e) => e.target.files?.[0] && handleImageRead(e.target.files[0], setNutritionImg)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => ingredientInputRef.current?.click(),
							className: "relative cursor-pointer rounded-2xl border-2 border-dashed border-border hover:border-primary/50 bg-muted/20 p-4 text-center transition flex flex-col items-center justify-center min-h-[120px]",
							children: [ingredientImg ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative w-full h-full min-h-[90px] flex items-center justify-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: ingredientImg,
									alt: "Ingredients",
									className: "max-h-24 rounded-xl object-contain shadow-sm"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute top-0 right-0 bg-emerald-500 text-white rounded-full p-0.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" })
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "h-6 w-6 text-primary mx-auto" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-bold text-foreground",
										children: "3. Ingredients List"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-muted-foreground",
										children: "Additives & Palm Oil"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: ingredientInputRef,
								type: "file",
								accept: "image/*",
								className: "hidden",
								onChange: (e) => e.target.files?.[0] && handleImageRead(e.target.files[0], setIngredientImg)
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: handleAnalyze,
					disabled: loading || !frontImg && !nutritionImg && !ingredientImg,
					className: "w-full flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-lg hover:opacity-90 disabled:opacity-50 transition",
					children: [
						loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5" }),
						" ",
						"Run Packaging OCR"
					]
				})
			]
		})
	});
}
function BarcodeScannerContainer({ userGoal, weightKg }) {
	const [settings, setSettings] = (0, import_react.useState)(() => BarcodeStore.getSettings());
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [activeProduct, setActiveProduct] = (0, import_react.useState)(null);
	const [activeTab, setActiveTab] = (0, import_react.useState)("scan");
	const [isSettingsOpen, setIsSettingsOpen] = (0, import_react.useState)(false);
	const [isManualOpen, setIsManualOpen] = (0, import_react.useState)(false);
	const [isOcrOpen, setIsOcrOpen] = (0, import_react.useState)(false);
	const handleUpdateSettings = (newSettings) => {
		setSettings(newSettings);
		BarcodeStore.saveSettings(newSettings);
	};
	const fetchProductDetails = async (payload) => {
		setLoading(true);
		try {
			if (typeof window !== "undefined" && !navigator.onLine && payload.barcode) {
				BarcodeStore.addOfflineScan(payload.barcode);
				toast.info("Offline mode: Saved barcode locally. We will fetch full nutrition details once online!");
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
					userProfile
				})
			});
			if (!res.ok) {
				const errData = await res.json().catch(() => ({}));
				throw new Error(errData.error || "Failed to fetch product details.");
			}
			const data = await res.json();
			if (settings.sound) BarcodeStore.playSuccessSound();
			if (settings.vibration) BarcodeStore.triggerHaptic();
			BarcodeStore.addScanToHistory(data);
			setActiveProduct(data);
			toast.success(`Found product: ${data.productName}`);
		} catch (err) {
			console.error("Barcode fetch error:", err);
			const errMsg = err instanceof Error ? err.message : "Product not found. Try Packaging OCR mode!";
			toast.error(errMsg);
			setIsOcrOpen(true);
		} finally {
			setLoading(false);
		}
	};
	const handleBarcodeDetected = (barcode) => {
		if (loading) return;
		fetchProductDetails({ barcode });
	};
	const handleOcrImagesSubmitted = (images) => {
		if (loading) return;
		fetchProductDetails({ ocrImages: images });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-between",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 rounded-[22px] bg-card/60 backdrop-blur-xl border border-border/80 p-1.5 shadow-lg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setActiveTab("scan"),
						className: `relative rounded-[18px] px-4 py-2.5 text-xs font-extrabold transition-all duration-300 active:scale-95 ${activeTab === "scan" ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(0,229,143,0.4)]" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`,
						children: "Camera Scanner"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setActiveTab("history"),
						className: `relative rounded-[18px] px-4 py-2.5 text-xs font-extrabold transition-all duration-300 active:scale-95 ${activeTab === "history" ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(0,229,143,0.4)]" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`,
						children: "Scan History"
					})]
				})
			}),
			loading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-primary/30 bg-primary/5 p-8 text-center space-y-3 animate-pulse",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-12 w-12 place-items-center rounded-2xl bg-primary/20 text-primary mx-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-lg font-bold text-foreground",
						children: "Fetching Product Analysis..."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Querying database and computing personalized macros, health score, and ingredient risks..."
					})
				]
			}),
			!loading && activeProduct && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductDetailsView, {
				product: activeProduct,
				onBack: () => setActiveProduct(null),
				onLogged: () => setActiveProduct(null)
			}),
			!loading && !activeProduct && activeTab === "scan" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarcodeScannerViewport, {
				settings,
				onBarcodeDetected: handleBarcodeDetected,
				onOpenManual: () => setIsManualOpen(true),
				onOpenOcr: () => setIsOcrOpen(true),
				onOpenSettings: () => setIsSettingsOpen(true)
			}),
			!loading && !activeProduct && activeTab === "history" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanHistoryView, { onSelectScan: (item) => {
				setActiveProduct(item.fullData);
			} }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarcodeSettingsModal, {
				isOpen: isSettingsOpen,
				onClose: () => setIsSettingsOpen(false),
				settings,
				onUpdateSettings: handleUpdateSettings
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarcodeManualDialog, {
				isOpen: isManualOpen,
				onClose: () => setIsManualOpen(false),
				onSubmitBarcode: (code) => fetchProductDetails({ barcode: code })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarcodeOcrModal, {
				isOpen: isOcrOpen,
				onClose: () => setIsOcrOpen(false),
				onSubmitOcrImages: handleOcrImagesSubmitted
			})
		]
	});
}
async function compressImage(file, maxDimension = 1024, quality = .82) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const img = new Image();
			img.onload = () => {
				let width = img.width;
				let height = img.height;
				if (width > maxDimension || height > maxDimension) {
					if (width > height) {
						height = Math.round(height * maxDimension / width);
						width = maxDimension;
					} else {
						width = Math.round(width * maxDimension / height);
						height = maxDimension;
					}
				}
				const canvas = document.createElement("canvas");
				canvas.width = width;
				canvas.height = height;
				const ctx = canvas.getContext("2d");
				if (!ctx) {
					resolve(reader.result);
					return;
				}
				ctx.drawImage(img, 0, 0, width, height);
				resolve(canvas.toDataURL("image/jpeg", quality));
			};
			img.onerror = () => resolve(reader.result);
			img.src = reader.result;
		};
		reader.onerror = () => reject(/* @__PURE__ */ new Error("Failed to read image file"));
		reader.readAsDataURL(file);
	});
}
function ScanPage() {
	const navigate = useNavigate();
	const qc = useQueryClient();
	const fileRef = (0, import_react.useRef)(null);
	const [scanMode, setScanMode] = (0, import_react.useState)("barcode");
	const [imageUrl, setImageUrl] = (0, import_react.useState)(null);
	const [scanning, setScanning] = (0, import_react.useState)(false);
	const [result, setResult] = (0, import_react.useState)(null);
	const [baseResult, setBaseResult] = (0, import_react.useState)(null);
	const [grams, setGrams] = (0, import_react.useState)(200);
	const [showAdvanced, setShowAdvanced] = (0, import_react.useState)(false);
	const [componentsList, setComponentsList] = (0, import_react.useState)([]);
	const [isCustomizingIngredients, setIsCustomizingIngredients] = (0, import_react.useState)(false);
	const [isReanalyzingAI, setIsReanalyzingAI] = (0, import_react.useState)(false);
	const [isCustomized, setIsCustomized] = (0, import_react.useState)(false);
	const [newIngName, setNewIngName] = (0, import_react.useState)("");
	const [newIngQty, setNewIngQty] = (0, import_react.useState)(50);
	const [newIngUnit, setNewIngUnit] = (0, import_react.useState)("g");
	const logMealFn = useServerFn(logMeal);
	const syncTotalsFromComponents = (list) => {
		setIsCustomized(true);
		if (!result) return;
		if (list.length === 0) {
			setResult((prev) => prev ? {
				...prev,
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
				estimated_grams: 0,
				components: []
			} : null);
			setGrams(0);
			return;
		}
		let totalCalories = 0;
		let totalProtein = 0;
		let totalCarbs = 0;
		let totalFat = 0;
		let totalFiber = 0;
		let totalSugar = 0;
		let totalSodium = 0;
		let totalIron = 0;
		let totalCalcium = 0;
		let totalMagnesium = 0;
		let totalPotassium = 0;
		let totalVitA = 0;
		let totalVitB12 = 0;
		let totalVitD = 0;
		let totalOmega3 = 0;
		let totalWeightG = 0;
		for (const c of list) {
			totalCalories += c.calories || 0;
			totalProtein += c.protein_g || 0;
			totalCarbs += c.carbs_g || 0;
			totalFat += c.fat_g || 0;
			totalFiber += c.fiber_g || 0;
			totalSugar += c.sugar_g || 0;
			totalSodium += c.sodium_mg || 0;
			totalIron += c.iron_mg || 0;
			totalCalcium += c.calcium_mg || 0;
			totalMagnesium += c.magnesium_mg || 0;
			totalPotassium += c.potassium_mg || 0;
			totalVitA += c.vit_a_ug || 0;
			totalVitB12 += c.vit_b12_ug || 0;
			totalVitD += c.vit_d_ug || 0;
			totalOmega3 += c.omega3_g || 0;
			const gMultiplier = c.unit === "kg" ? 1e3 : c.unit === "tbsp" ? 15 : c.unit === "tsp" ? 5 : c.unit === "cup" ? 180 : 1;
			totalWeightG += Math.round((c.quantity || 0) * gMultiplier);
		}
		totalProtein = Math.round(totalProtein * 10) / 10;
		totalCarbs = Math.round(totalCarbs * 10) / 10;
		totalFat = Math.round(totalFat * 10) / 10;
		totalFiber = Math.round(totalFiber * 10) / 10;
		totalSugar = Math.round(totalSugar * 10) / 10;
		totalSodium = Math.round(totalSodium);
		totalIron = Math.round(totalIron * 10) / 10;
		totalCalcium = Math.round(totalCalcium);
		totalMagnesium = Math.round(totalMagnesium);
		totalPotassium = Math.round(totalPotassium);
		totalVitA = Math.round(totalVitA);
		totalVitB12 = Math.round(totalVitB12 * 10) / 10;
		totalVitD = Math.round(totalVitD * 10) / 10;
		totalOmega3 = Math.round(totalOmega3 * 100) / 100;
		if (totalCalories <= 0) totalCalories = Math.round(totalProtein * 4 + totalCarbs * 4 + totalFat * 9);
		setGrams(totalWeightG);
		setResult((prev) => {
			if (!prev) return null;
			return {
				...prev,
				estimated_grams: totalWeightG,
				calories: totalCalories,
				protein_g: totalProtein,
				carbs_g: totalCarbs,
				fat_g: totalFat,
				fiber_g: totalFiber,
				sugar_g: totalSugar,
				sodium_mg: totalSodium,
				iron_mg: totalIron,
				calcium_mg: totalCalcium,
				magnesium_mg: totalMagnesium,
				potassium_mg: totalPotassium,
				vit_a_ug: totalVitA,
				vit_b12_ug: totalVitB12,
				vit_d_ug: totalVitD,
				omega3_g: totalOmega3,
				components: list.map((c) => ({
					name: c.name,
					quantity: c.quantity,
					unit: c.unit,
					calories: c.calories,
					protein_g: c.protein_g,
					carbs_g: c.carbs_g,
					fat_g: c.fat_g,
					fiber_g: c.fiber_g,
					sugar_g: c.sugar_g,
					sodium_mg: c.sodium_mg,
					iron_mg: c.iron_mg,
					calcium_mg: c.calcium_mg,
					magnesium_mg: c.magnesium_mg,
					potassium_mg: c.potassium_mg,
					vit_a_ug: c.vit_a_ug,
					vit_b12_ug: c.vit_b12_ug,
					vit_d_ug: c.vit_d_ug,
					omega3_g: c.omega3_g
				}))
			};
		});
	};
	const handleComponentQuantityChange = (id, newQty) => {
		const safeQty = Math.max(1, newQty);
		setComponentsList((prev) => {
			const next = prev.map((c) => {
				if (c.id !== id) return c;
				const baseG = c.baseGrams > 0 ? c.baseGrams : 50;
				const ratio = safeQty / baseG;
				return {
					...c,
					quantity: safeQty,
					calories: Math.round((c.baseCalories || 0) * ratio),
					protein_g: Math.round((c.baseProtein || 0) * ratio * 10) / 10,
					carbs_g: Math.round((c.baseCarbs || 0) * ratio * 10) / 10,
					fat_g: Math.round((c.baseFat || 0) * ratio * 10) / 10,
					fiber_g: c.fiber_g ? Math.round(c.fiber_g * ratio * 10) / 10 : 0,
					sugar_g: c.sugar_g ? Math.round(c.sugar_g * ratio * 10) / 10 : 0,
					sodium_mg: c.sodium_mg ? Math.round(c.sodium_mg * ratio) : 0,
					iron_mg: c.iron_mg ? Math.round(c.iron_mg * ratio * 10) / 10 : 0,
					calcium_mg: c.calcium_mg ? Math.round(c.calcium_mg * ratio) : 0,
					magnesium_mg: c.magnesium_mg ? Math.round(c.magnesium_mg * ratio) : 0,
					potassium_mg: c.potassium_mg ? Math.round(c.potassium_mg * ratio) : 0
				};
			});
			syncTotalsFromComponents(next);
			return next;
		});
	};
	const handleComponentNameChange = (id, newName) => {
		setIsCustomized(true);
		setComponentsList((prev) => prev.map((c) => c.id === id ? {
			...c,
			name: newName
		} : c));
	};
	const handleComponentUnitChange = (id, newUnit) => {
		setIsCustomized(true);
		setComponentsList((prev) => {
			const next = prev.map((c) => c.id === id ? {
				...c,
				unit: newUnit
			} : c);
			syncTotalsFromComponents(next);
			return next;
		});
	};
	const handleDeleteComponent = (id) => {
		setComponentsList((prev) => {
			const target = prev.find((c) => c.id === id);
			const next = prev.filter((c) => c.id !== id);
			syncTotalsFromComponents(next);
			if (target) toast.info(`Removed ${target.name}`);
			return next;
		});
	};
	const handleAddComponent = (name, quantity, unit = "g") => {
		if (!name.trim()) {
			toast.error("Please enter an ingredient name");
			return;
		}
		const safeQty = Math.max(1, quantity);
		const lower = name.toLowerCase();
		let per100Cal = 120;
		let per100P = 4;
		let per100C = 15;
		let per100F = 3;
		let per100Fiber = 1.5;
		if (lower.includes("oil") || lower.includes("ghee") || lower.includes("butter")) {
			per100Cal = 884;
			per100P = 0;
			per100C = 0;
			per100F = 100;
			per100Fiber = 0;
		} else if (lower.includes("chicken") || lower.includes("turkey") || lower.includes("meat") || lower.includes("fish") || lower.includes("salmon")) {
			per100Cal = 165;
			per100P = 31;
			per100C = 0;
			per100F = 3.6;
			per100Fiber = 0;
		} else if (lower.includes("egg")) {
			per100Cal = 143;
			per100P = 12.6;
			per100C = .8;
			per100F = 9.5;
			per100Fiber = 0;
		} else if (lower.includes("paneer") || lower.includes("cheese")) {
			per100Cal = 265;
			per100P = 18.3;
			per100C = 3;
			per100F = 20.8;
			per100Fiber = 0;
		} else if (lower.includes("rice")) {
			per100Cal = 130;
			per100P = 2.7;
			per100C = 28.2;
			per100F = .3;
			per100Fiber = .4;
		} else if (lower.includes("roti") || lower.includes("bread") || lower.includes("chapati") || lower.includes("naan")) {
			per100Cal = 260;
			per100P = 8;
			per100C = 50;
			per100F = 3;
			per100Fiber = 6;
		} else if (lower.includes("broccoli") || lower.includes("spinach") || lower.includes("salad") || lower.includes("veggie") || lower.includes("cucumber") || lower.includes("tomato")) {
			per100Cal = 35;
			per100P = 2.5;
			per100C = 6;
			per100F = .4;
			per100Fiber = 2.5;
		} else if (lower.includes("potato")) {
			per100Cal = 86;
			per100P = 1.6;
			per100C = 20;
			per100F = .1;
			per100Fiber = 2.2;
		} else if (lower.includes("dal") || lower.includes("lentil") || lower.includes("chickpea") || lower.includes("chole") || lower.includes("rajma")) {
			per100Cal = 125;
			per100P = 8;
			per100C = 20;
			per100F = 1.5;
			per100Fiber = 5;
		} else if (lower.includes("curd") || lower.includes("yogurt") || lower.includes("dahi")) {
			per100Cal = 65;
			per100P = 3.5;
			per100C = 4.5;
			per100F = 3.5;
			per100Fiber = 0;
		}
		const factor = safeQty * (unit === "kg" ? 1e3 : unit === "tbsp" ? 15 : unit === "tsp" ? 5 : unit === "cup" ? 180 : 1) / 100;
		const cal = Math.round(per100Cal * factor);
		const p = Math.round(per100P * factor * 10) / 10;
		const c = Math.round(per100C * factor * 10) / 10;
		const f = Math.round(per100F * factor * 10) / 10;
		const fib = Math.round(per100Fiber * factor * 10) / 10;
		const newItem = {
			id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
			name: name.trim(),
			quantity: safeQty,
			unit,
			calories: cal,
			protein_g: p,
			carbs_g: c,
			fat_g: f,
			fiber_g: fib,
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
			baseGrams: safeQty,
			baseCalories: cal,
			baseProtein: p,
			baseCarbs: c,
			baseFat: f,
			isCustom: true
		};
		setComponentsList((prev) => {
			const next = [...prev, newItem];
			syncTotalsFromComponents(next);
			return next;
		});
		setNewIngName("");
		setNewIngQty(50);
		toast.success(`Added ${name.trim()} (${safeQty}${unit})`);
	};
	const handleReanalyzeWithAI = async () => {
		if (componentsList.length === 0) {
			toast.error("Add at least one ingredient to analyze");
			return;
		}
		try {
			setIsReanalyzingAI(true);
			const payload = {
				mealName: result?.name || "Custom Meal",
				ingredients: componentsList.map((c) => ({
					name: c.name,
					amount: `${c.quantity}${c.unit}`
				}))
			};
			const res = await fetch("/api/analyze-ingredients", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload)
			});
			if (!res.ok) throw new Error(`AI calculation failed (${res.status})`);
			const aiData = await res.json();
			if (Array.isArray(aiData.ingredientBreakdown)) setComponentsList((prev) => {
				return prev.map((comp, idx) => {
					const matched = aiData.ingredientBreakdown?.[idx] || aiData.ingredientBreakdown?.find((b) => b.name?.toLowerCase().includes(comp.name.toLowerCase()));
					if (matched) {
						const matchedCal = Number(matched.calories || comp.calories);
						const matchedP = Number(matched.protein_g || comp.protein_g);
						const matchedC = Number(matched.carbs_g || comp.carbs_g);
						const matchedF = Number(matched.fat_g || comp.fat_g);
						return {
							...comp,
							calories: matchedCal,
							protein_g: matchedP,
							carbs_g: matchedC,
							fat_g: matchedF,
							baseCalories: matchedCal,
							baseProtein: matchedP,
							baseCarbs: matchedC,
							baseFat: matchedF
						};
					}
					return comp;
				});
			});
			setResult((prev) => {
				if (!prev) return null;
				return {
					...prev,
					calories: Number(aiData.calories || prev.calories),
					protein_g: Number(aiData.protein_g || prev.protein_g),
					carbs_g: Number(aiData.carbs_g || prev.carbs_g),
					fat_g: Number(aiData.fat_g || prev.fat_g),
					fiber_g: Number(aiData.fiber_g ?? prev.fiber_g),
					sugar_g: Number(aiData.sugar_g ?? prev.sugar_g),
					sodium_mg: Number(aiData.sodium_mg ?? prev.sodium_mg),
					iron_mg: Number(aiData.iron_mg ?? prev.iron_mg),
					calcium_mg: Number(aiData.calcium_mg ?? prev.calcium_mg),
					magnesium_mg: Number(aiData.magnesium_mg ?? prev.magnesium_mg),
					potassium_mg: Number(aiData.potassium_mg ?? prev.potassium_mg),
					vit_a_ug: Number(aiData.vit_a_ug ?? prev.vit_a_ug),
					vit_b12_ug: Number(aiData.vit_b12_ug ?? prev.vit_b12_ug),
					vit_d_ug: Number(aiData.vit_d_ug ?? prev.vit_d_ug),
					omega3_g: Number(aiData.omega3_g ?? prev.omega3_g),
					estimated_grams: Number(aiData.totalGrams || prev.estimated_grams)
				};
			});
			if (aiData.totalGrams) setGrams(Number(aiData.totalGrams));
			toast.success("✨ Re-analyzed with Gemini! Accurate macros and micronutrients loaded.");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "AI re-analysis failed");
		} finally {
			setIsReanalyzingAI(false);
		}
	};
	const resetIngredientsToScan = () => {
		if (baseResult) {
			setResult(baseResult);
			setGrams(baseResult.estimated_grams || 200);
			const initialComponents = (baseResult.components || []).map((comp, idx) => ({
				id: `comp-${idx}`,
				name: comp.name,
				quantity: comp.quantity || 50,
				unit: comp.unit || "g",
				calories: comp.calories || 0,
				protein_g: comp.protein_g || 0,
				carbs_g: comp.carbs_g || 0,
				fat_g: comp.fat_g || 0,
				fiber_g: comp.fiber_g || 0,
				sugar_g: comp.sugar_g || 0,
				sodium_mg: comp.sodium_mg || 0,
				iron_mg: comp.iron_mg || 0,
				calcium_mg: comp.calcium_mg || 0,
				magnesium_mg: comp.magnesium_mg || 0,
				potassium_mg: comp.potassium_mg || 0,
				vit_a_ug: comp.vit_a_ug || 0,
				vit_b12_ug: comp.vit_b12_ug || 0,
				vit_d_ug: comp.vit_d_ug || 0,
				omega3_g: comp.omega3_g || 0,
				baseGrams: comp.quantity || 50,
				baseCalories: comp.calories || 0,
				baseProtein: comp.protein_g || 0,
				baseCarbs: comp.carbs_g || 0,
				baseFat: comp.fat_g || 0
			}));
			setComponentsList(initialComponents);
			setIsCustomized(false);
			toast.info("Reset ingredients to original scan detection.");
		}
	};
	const handleGramsChange = (newGramsVal) => {
		const newGrams = Math.max(1, newGramsVal);
		if (baseResult) {
			const factor = newGrams / (baseResult.estimated_grams || 200);
			const p = Math.round((baseResult.protein_g || 0) * factor * 10) / 10;
			const c = Math.round((baseResult.carbs_g || 0) * factor * 10) / 10;
			const f = Math.round((baseResult.fat_g || 0) * factor * 10) / 10;
			let cal = Math.round((baseResult.calories || 0) * factor);
			if (cal <= 0) cal = Math.round(p * 4 + c * 4 + f * 9);
			setResult({
				...baseResult,
				estimated_grams: newGrams,
				calories: cal,
				protein_g: p,
				carbs_g: c,
				fat_g: f,
				fiber_g: Math.round((baseResult.fiber_g || 0) * factor * 10) / 10,
				sugar_g: Math.round((baseResult.sugar_g || 0) * factor * 10) / 10,
				sodium_mg: Math.round((baseResult.sodium_mg || 0) * factor),
				iron_mg: Math.round((baseResult.iron_mg || 0) * factor * 10) / 10,
				calcium_mg: Math.round((baseResult.calcium_mg || 0) * factor),
				magnesium_mg: Math.round((baseResult.magnesium_mg || 0) * factor),
				potassium_mg: Math.round((baseResult.potassium_mg || 0) * factor),
				vit_a_ug: Math.round((baseResult.vit_a_ug || 0) * factor),
				vit_b12_ug: Math.round((baseResult.vit_b12_ug || 0) * factor * 10) / 10,
				vit_d_ug: Math.round((baseResult.vit_d_ug || 0) * factor * 10) / 10,
				omega3_g: Math.round((baseResult.omega3_g || 0) * factor * 100) / 100,
				components: baseResult.components?.map((comp) => ({
					...comp,
					quantity: Math.round((comp.quantity || 0) * factor),
					calories: comp.calories ? Math.round(comp.calories * factor) : void 0,
					protein_g: comp.protein_g ? Math.round(comp.protein_g * factor * 10) / 10 : void 0,
					carbs_g: comp.carbs_g ? Math.round(comp.carbs_g * factor * 10) / 10 : void 0,
					fat_g: comp.fat_g ? Math.round(comp.fat_g * factor * 10) / 10 : void 0
				}))
			});
			setComponentsList((prev) => prev.map((comp) => ({
				...comp,
				quantity: Math.round((comp.baseGrams || 50) * factor),
				calories: Math.round((comp.baseCalories || 0) * factor),
				protein_g: Math.round((comp.baseProtein || 0) * factor * 10) / 10,
				carbs_g: Math.round((comp.baseCarbs || 0) * factor * 10) / 10,
				fat_g: Math.round((comp.baseFat || 0) * factor * 10) / 10
			})));
		}
		setGrams(newGrams);
	};
	const handleNutrientChange = (key, val) => {
		if (!result) return;
		const safeVal = Math.max(0, val);
		const next = {
			...result,
			[key]: safeVal
		};
		if (key === "protein_g" || key === "carbs_g" || key === "fat_g") {
			const p = key === "protein_g" ? safeVal : next.protein_g || 0;
			const c = key === "carbs_g" ? safeVal : next.carbs_g || 0;
			const f = key === "fat_g" ? safeVal : next.fat_g || 0;
			next.calories = Math.round(p * 4 + c * 4 + f * 9);
		}
		setResult(next);
	};
	const onFile = async (file) => {
		if (!file.type.startsWith("image/")) {
			toast.error("Pick an image file");
			return;
		}
		if (file.size > 15728640) {
			toast.error("Image must be under 15MB");
			return;
		}
		try {
			setScanning(true);
			setResult(null);
			setComponentsList([]);
			setIsCustomized(false);
			setIsCustomizingIngredients(false);
			const compressedDataUrl = await compressImage(file);
			setImageUrl(compressedDataUrl);
			const res = await fetch("/api/scan", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ imageDataUrl: compressedDataUrl })
			});
			const isJson = (res.headers.get("content-type") || "").includes("application/json");
			if (!res.ok) {
				let errorMsg = `Scan failed (${res.status})`;
				if (isJson) {
					const err = await res.json().catch(() => null);
					if (err && typeof err === "object" && "error" in err) errorMsg = String(err.error);
				} else {
					const text = await res.text().catch(() => "");
					if (text && !text.trim().startsWith("<")) errorMsg = text.slice(0, 150);
					else if (res.status === 413) errorMsg = "Image is too large. Please upload a smaller image.";
					else errorMsg = `Server error (${res.status}). Please try again later.`;
				}
				throw new Error(errorMsg);
			}
			if (!isJson) {
				const text = await res.text().catch(() => "");
				console.error("Non-JSON response from /api/scan:", text.slice(0, 500));
				throw new Error("Received an invalid response from the server. Please try again.");
			}
			const data = await res.json();
			setResult(data);
			setBaseResult(data);
			setGrams(data.estimated_grams || 200);
			const initialComponents = (data.components || []).map((comp, idx) => ({
				id: `comp-${idx}-${Date.now()}`,
				name: comp.name,
				quantity: comp.quantity || 50,
				unit: comp.unit || "g",
				calories: comp.calories || Math.round((comp.quantity || 50) * 1.5),
				protein_g: comp.protein_g || 0,
				carbs_g: comp.carbs_g || 0,
				fat_g: comp.fat_g || 0,
				fiber_g: comp.fiber_g || 0,
				sugar_g: comp.sugar_g || 0,
				sodium_mg: comp.sodium_mg || 0,
				iron_mg: comp.iron_mg || 0,
				calcium_mg: comp.calcium_mg || 0,
				magnesium_mg: comp.magnesium_mg || 0,
				potassium_mg: comp.potassium_mg || 0,
				vit_a_ug: comp.vit_a_ug || 0,
				vit_b12_ug: comp.vit_b12_ug || 0,
				vit_d_ug: comp.vit_d_ug || 0,
				omega3_g: comp.omega3_g || 0,
				baseGrams: comp.quantity || 50,
				baseCalories: comp.calories || Math.round((comp.quantity || 50) * 1.5),
				baseProtein: comp.protein_g || 0,
				baseCarbs: comp.carbs_g || 0,
				baseFat: comp.fat_g || 0
			}));
			setComponentsList(initialComponents);
			if (data.confidence < .4) toast.warning(`Low confidence (${Math.round(data.confidence * 100)}%) — please verify before saving.`);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Scan failed");
		} finally {
			setScanning(false);
		}
	};
	const save = useMutation({
		mutationFn: () => {
			if (!result) throw new Error("No result");
			const servingDesc = `${grams}g (${result.serving || "1 serving"})`;
			const localDay = getLocalDateString();
			return logMealFn({ data: {
				name: result.name,
				source: "photo",
				confidence: result.confidence,
				serving_desc: servingDesc,
				calories: result.calories,
				protein_g: result.protein_g,
				carbs_g: result.carbs_g,
				fat_g: result.fat_g,
				fiber_g: result.fiber_g || 0,
				sugar_g: result.sugar_g || 0,
				sodium_mg: result.sodium_mg || 0,
				iron_mg: result.iron_mg || 0,
				calcium_mg: result.calcium_mg || 0,
				magnesium_mg: result.magnesium_mg || 0,
				potassium_mg: result.potassium_mg || 0,
				vit_a_ug: result.vit_a_ug || 0,
				vit_b12_ug: result.vit_b12_ug || 0,
				vit_d_ug: result.vit_d_ug || 0,
				omega3_g: result.omega3_g || 0,
				raw_model_response: result.raw ?? null,
				eaten_on: localDay
			} });
		},
		onSuccess: () => {
			if (result) {
				const localDay = getLocalDateString();
				LocalStore.addMeal({
					name: result.name,
					source: "photo",
					confidence: result.confidence,
					serving_desc: `${grams}g (${result.serving || "1 serving"})`,
					calories: result.calories,
					protein_g: result.protein_g,
					carbs_g: result.carbs_g,
					fat_g: result.fat_g,
					fiber_g: result.fiber_g || 0,
					sugar_g: result.sugar_g || 0,
					sodium_mg: result.sodium_mg || 0,
					iron_mg: result.iron_mg || 0,
					calcium_mg: result.calcium_mg || 0,
					magnesium_mg: result.magnesium_mg || 0,
					potassium_mg: result.potassium_mg || 0,
					vit_a_ug: result.vit_a_ug || 0,
					vit_b12_ug: result.vit_b12_ug || 0,
					vit_d_ug: result.vit_d_ug || 0,
					omega3_g: result.omega3_g || 0,
					eaten_at: (/* @__PURE__ */ new Date()).toISOString(),
					eaten_on: localDay
				});
			}
			qc.invalidateQueries({ queryKey: ["today"] });
			qc.invalidateQueries({ queryKey: ["calendar"] });
			toast.success("Meal logged");
			navigate({ to: "/home" });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Failed")
	});
	const reset = () => {
		setImageUrl(null);
		setResult(null);
		setBaseResult(null);
		setComponentsList([]);
		setIsCustomized(false);
		setIsCustomizingIngredients(false);
		setGrams(200);
		setShowAdvanced(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-20 animate-in fade-in duration-300",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-[11px] font-bold uppercase tracking-widest text-primary flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " Food Identification & Scanning"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-0.5",
					children: "Food & Barcode Scanner"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center rounded-[22px] bg-card/80 backdrop-blur-xl p-1.5 border border-border/80 shadow-lg shrink-0 self-start md:self-auto overflow-x-auto max-w-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							setScanMode("barcode");
							reset();
						},
						className: `flex items-center gap-2 rounded-[18px] px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-black transition-all duration-300 active:scale-95 shrink-0 ${scanMode === "barcode" ? "bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(52,211,153,0.4)]" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Barcode, { className: "h-4 w-4" }), "Barcode Scanner"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setScanMode("photo"),
						className: `flex items-center gap-2 rounded-[18px] px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-black transition-all duration-300 active:scale-95 shrink-0 ${scanMode === "photo" ? "bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(52,211,153,0.4)]" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UtensilsCrossed, { className: "h-4 w-4" }), "Meal Scanner"]
					})]
				})]
			}),
			scanMode === "barcode" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarcodeScannerContainer, {}),
			scanMode === "photo" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300",
				children: [
					!imageUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => fileRef.current?.click(),
							className: "group relative flex min-h-[200px] sm:min-h-[220px] flex-col items-center justify-center gap-2.5 overflow-hidden rounded-[24px] border-2 border-emerald-500/40 bg-gradient-to-br from-cyan-950/90 via-teal-950/90 to-slate-900 dark:from-[#0C1722] dark:via-[#0F2130] dark:to-[#071018] text-white shadow-[0_10px_30px_rgba(52,211,153,0.2)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-[0_15px_35px_rgba(52,211,153,0.35)] active:scale-[0.98] p-6 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-ambient-breathing absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "pointer-events-none absolute inset-x-4 top-0 bottom-0 opacity-25",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-laser-sweep absolute left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-[0_0_15px_#34D399]" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "animate-camera-pulse relative z-10 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 border border-emerald-300/50 backdrop-blur-md shadow-[0_0_25px_rgba(52,211,153,0.5)] group-hover:scale-110 transition-transform",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-8 w-8 text-slate-950" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "relative z-10 font-display text-lg font-black text-white",
									children: "Take or upload meal photo"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "relative z-10 text-xs text-emerald-300/90 font-bold",
									children: "Instant Macro Analysis (JPG/PNG)"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => navigate({ to: "/manual" }),
								className: "flex flex-1 items-center justify-center gap-2.5 rounded-[24px] bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 text-white font-extrabold shadow-[0_10px_25px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_30px_rgba(16,185,129,0.45)] hover:-translate-y-0.5 active:scale-[0.97] transition-all p-6 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-5 w-5 text-white" }), " Enter manually"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-[24px] border border-border/80 bg-card/90 dark:bg-[#0C1722]/80 backdrop-blur-2xl p-5 text-xs text-muted-foreground leading-relaxed shadow-lg",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mb-2 h-4 w-4 text-emerald-500 animate-pulse" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-foreground",
										children: "Pro Tip:"
									}),
									" A clean, top-down shot with the whole plate visible gives the most accurate macro estimate."
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileRef,
						type: "file",
						accept: "image/*",
						capture: "environment",
						className: "hidden",
						onChange: (e) => e.target.files?.[0] && onFile(e.target.files[0])
					}),
					imageUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 animate-in fade-in duration-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative overflow-hidden rounded-[22px] border-2 border-primary/30 bg-black shadow-2xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: imageUrl,
									alt: "scanned",
									className: "aspect-[4/3] w-full object-cover"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: reset,
									className: "absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/70 text-white backdrop-blur-md hover:bg-black transition active:scale-95",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
								}),
								scanning && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm text-white",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2.5 rounded-full bg-black/80 border border-primary/40 px-5 py-2.5 text-xs font-bold shadow-[0_0_20px_rgba(0,229,143,0.3)]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-primary" }), " Identifying food & computing macros…"]
									})
								})
							]
						}), result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-[22px] border-2 border-primary/30 bg-card/80 dark:border-white/10 dark:bg-[#0C1722]/80 backdrop-blur-2xl p-6 shadow-2xl space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-start justify-between gap-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "w-full",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-2 mb-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "inline-flex items-center gap-1.5 rounded-full bg-primary/15 border border-primary/30 px-3 py-1 text-xs font-bold text-primary shadow-[0_0_12px_rgba(0,229,143,0.2)]",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " Identified Meal"]
												}), result.diet_type && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: `inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-extrabold border ${result.diet_type === "VEGETARIAN" ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" : "bg-rose-500/15 border-rose-500/30 text-rose-400"}`,
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-current" }), result.diet_type === "VEGETARIAN" ? "Vegetarian" : "Non-Vegetarian"]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: result.name,
												onChange: (e) => setResult({
													...result,
													name: e.target.value
												}),
												className: "w-full bg-transparent font-display text-2xl font-extrabold text-foreground outline-none border-b border-transparent focus:border-primary transition"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-1 text-xs text-muted-foreground font-mono",
												children: [
													"Serving: ",
													result.serving || "1 serving",
													" · Confidence",
													" ",
													Math.round(result.confidence * 100),
													"%"
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-4 rounded-[20px] border border-cyan-500/30 bg-card/90 dark:bg-[#081522]/90 p-4 sm:p-5 space-y-4 shadow-lg backdrop-blur-md",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex flex-wrap items-center justify-between gap-2.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-2",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UtensilsCrossed, { className: "h-4 w-4" }), " Detected Ingredients & Portions"]
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																	className: "rounded-full bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 text-[11px] font-bold text-cyan-300",
																	children: [
																		componentsList.length,
																		" items · ",
																		grams,
																		"g"
																	]
																}),
																isCustomized && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "rounded-full bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-extrabold text-amber-400 animate-pulse",
																	children: "Customized"
																})
															]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-2",
															children: [isCustomized && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
																type: "button",
																onClick: resetIngredientsToScan,
																className: "inline-flex items-center gap-1 text-[11px] font-bold text-muted-foreground hover:text-rose-400 transition",
																title: "Reset back to original scan",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3 w-3" }), " Reset Scan"]
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																onClick: () => setIsCustomizingIngredients(!isCustomizingIngredients),
																className: `inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all active:scale-95 ${isCustomizingIngredients ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]" : "bg-muted hover:bg-muted/80 text-foreground border border-border/70"}`,
																children: isCustomizingIngredients ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), " Done Editing"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-3.5 w-3.5 text-cyan-400" }), " Customize Ingredients"] })
															})]
														})]
													}),
													!isCustomizingIngredients && componentsList.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "flex flex-wrap gap-2 pt-1",
														children: componentsList.map((comp) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
															type: "button",
															onClick: () => setIsCustomizingIngredients(true),
															className: "group inline-flex items-center gap-1.5 rounded-xl bg-background/80 hover:bg-muted/90 border border-border/80 px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:border-cyan-500/50 hover:scale-[1.02]",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "font-bold",
																	children: comp.name
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																	className: "text-cyan-400 font-mono text-[11px]",
																	children: [comp.quantity, comp.unit || "g"]
																}),
																comp.calories ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																	className: "text-muted-foreground font-mono text-[10px]",
																	children: [
																		"· ",
																		comp.calories,
																		" kcal"
																	]
																}) : null,
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-0.5" })
															]
														}, comp.id))
													}),
													isCustomizingIngredients && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-3 pt-1 animate-in fade-in duration-200",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "text-[11px] text-muted-foreground",
																children: "Adjust portion weights, rename or remove items, and add missing sides or oils to match your exact meal:"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "space-y-2 max-h-[380px] overflow-y-auto pr-1",
																children: componentsList.map((comp) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl bg-background/90 border border-border/70 p-3 hover:border-cyan-500/40 transition",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																		className: "flex-1 min-w-[140px]",
																		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																			type: "text",
																			value: comp.name,
																			onChange: (e) => handleComponentNameChange(comp.id, e.target.value),
																			placeholder: "Ingredient name",
																			className: "w-full bg-transparent text-xs font-extrabold text-foreground outline-none border-b border-transparent focus:border-cyan-400 transition"
																		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																			className: "text-[10px] font-mono text-muted-foreground mt-0.5 flex items-center gap-2",
																			children: [
																				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [comp.calories || 0, " kcal"] }),
																				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
																				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																					className: "text-rose-400",
																					children: [comp.protein_g || 0, "g P"]
																				}),
																				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
																				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																					className: "text-amber-400",
																					children: [comp.carbs_g || 0, "g C"]
																				}),
																				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
																				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																					className: "text-emerald-400",
																					children: [comp.fat_g || 0, "g F"]
																				})
																			]
																		})]
																	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																		className: "flex items-center gap-2 shrink-0",
																		children: [
																			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																				className: "flex items-center rounded-lg border border-border/80 bg-muted/40 p-0.5",
																				children: [
																					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																						type: "button",
																						onClick: () => handleComponentQuantityChange(comp.id, Math.max(1, comp.quantity - (comp.unit === "g" ? 10 : 1))),
																						className: "grid h-7 w-7 place-items-center rounded-md hover:bg-background active:scale-95 text-foreground",
																						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3.5 w-3.5" })
																					}),
																					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																						type: "number",
																						min: 1,
																						max: 5e3,
																						value: comp.quantity,
																						onChange: (e) => handleComponentQuantityChange(comp.id, Number(e.target.value)),
																						className: "w-14 bg-transparent text-center text-xs font-extrabold text-foreground outline-none tabular-nums"
																					}),
																					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																						type: "button",
																						onClick: () => handleComponentQuantityChange(comp.id, comp.quantity + (comp.unit === "g" ? 10 : 1)),
																						className: "grid h-7 w-7 place-items-center rounded-md hover:bg-background active:scale-95 text-foreground",
																						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" })
																					})
																				]
																			}),
																			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
																				value: comp.unit || "g",
																				onChange: (e) => handleComponentUnitChange(comp.id, e.target.value),
																				className: "rounded-lg border border-border/80 bg-muted/40 px-2 py-1.5 text-xs font-bold text-foreground outline-none",
																				children: [
																					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																						value: "g",
																						children: "g"
																					}),
																					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																						value: "pcs",
																						children: "pcs"
																					}),
																					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																						value: "tbsp",
																						children: "tbsp"
																					}),
																					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																						value: "tsp",
																						children: "tsp"
																					}),
																					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																						value: "ml",
																						children: "ml"
																					}),
																					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																						value: "cup",
																						children: "cup"
																					}),
																					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																						value: "slice",
																						children: "slice"
																					})
																				]
																			}),
																			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																				type: "button",
																				onClick: () => handleDeleteComponent(comp.id),
																				className: "grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-rose-500/20 hover:text-rose-400 active:scale-95 transition",
																				title: "Remove ingredient",
																				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
																			})
																		]
																	})]
																}, comp.id))
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "rounded-xl border border-dashed border-cyan-500/40 bg-cyan-950/20 dark:bg-[#071926]/40 p-3 space-y-2.5",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																		className: "text-[11px] font-bold text-cyan-400 flex items-center gap-1.5",
																		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Add Another Ingredient / Side"]
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																		className: "flex flex-wrap items-center gap-2",
																		children: [
																			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																				type: "text",
																				value: newIngName,
																				onChange: (e) => setNewIngName(e.target.value),
																				onKeyDown: (e) => {
																					if (e.key === "Enter") {
																						e.preventDefault();
																						handleAddComponent(newIngName, newIngQty, newIngUnit);
																					}
																				},
																				placeholder: "e.g. Cooking Oil, Brown Rice, Butter...",
																				className: "flex-1 min-w-[160px] rounded-lg border border-border/80 bg-background px-3 py-1.5 text-xs font-bold text-foreground outline-none focus:border-cyan-400"
																			}),
																			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																				type: "number",
																				min: 1,
																				value: newIngQty,
																				onChange: (e) => setNewIngQty(Number(e.target.value)),
																				className: "w-20 rounded-lg border border-border/80 bg-background px-2.5 py-1.5 text-xs font-bold text-foreground outline-none focus:border-cyan-400 tabular-nums text-center"
																			}),
																			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
																				value: newIngUnit,
																				onChange: (e) => setNewIngUnit(e.target.value),
																				className: "rounded-lg border border-border/80 bg-background px-2.5 py-1.5 text-xs font-bold text-foreground outline-none",
																				children: [
																					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																						value: "g",
																						children: "g"
																					}),
																					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																						value: "pcs",
																						children: "pcs"
																					}),
																					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																						value: "tbsp",
																						children: "tbsp"
																					}),
																					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																						value: "tsp",
																						children: "tsp"
																					}),
																					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																						value: "ml",
																						children: "ml"
																					}),
																					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																						value: "cup",
																						children: "cup"
																					}),
																					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																						value: "slice",
																						children: "slice"
																					})
																				]
																			}),
																			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																				type: "button",
																				onClick: () => handleAddComponent(newIngName, newIngQty, newIngUnit),
																				className: "rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3 py-1.5 text-xs font-extrabold active:scale-95 transition",
																				children: "+ Add"
																			})
																		]
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																		className: "flex flex-wrap items-center gap-1.5 pt-1",
																		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																			className: "text-[10px] text-muted-foreground font-bold",
																			children: "Quick Add:"
																		}), [
																			{
																				name: "Cooking Oil",
																				qty: 5,
																				unit: "g"
																			},
																			{
																				name: "White Rice",
																				qty: 100,
																				unit: "g"
																			},
																			{
																				name: "Whole Egg",
																				qty: 1,
																				unit: "pcs"
																			},
																			{
																				name: "Fresh Salad",
																				qty: 50,
																				unit: "g"
																			},
																			{
																				name: "Roti / Chapati",
																				qty: 1,
																				unit: "pcs"
																			},
																			{
																				name: "Curd / Yogurt",
																				qty: 100,
																				unit: "g"
																			}
																		].map((chip) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
																			type: "button",
																			onClick: () => handleAddComponent(chip.name, chip.qty, chip.unit),
																			className: "rounded-lg bg-background/80 hover:bg-cyan-950/40 border border-border/60 hover:border-cyan-400/50 px-2 py-0.5 text-[10px] font-bold text-foreground transition active:scale-95",
																			children: [
																				"+ ",
																				chip.name,
																				" (",
																				chip.qty,
																				chip.unit,
																				")"
																			]
																		}, chip.name))]
																	})
																]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "text-[11px] text-muted-foreground",
																	children: "Calculations update live. Use AI Re-analyze for deep biochemical precision."
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																	type: "button",
																	onClick: handleReanalyzeWithAI,
																	disabled: isReanalyzingAI || componentsList.length === 0,
																	className: "inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-3.5 py-1.5 text-xs font-extrabold text-slate-950 shadow-[0_0_15px_rgba(52,211,153,0.3)] hover:opacity-95 active:scale-95 transition disabled:opacity-50",
																	children: isReanalyzingAI ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }), " Calibrating with Gemini…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " ✨ Recalculate with AI"] })
																})]
															})
														]
													})
												]
											})
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-[18px] bg-muted/40 p-5 border border-border/80",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-bold text-foreground mb-2",
											children: "⚖️ How many grams did you add?"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative flex-1 max-w-[180px]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													min: 1,
													max: 5e3,
													value: grams,
													onChange: (e) => handleGramsChange(Number(e.target.value)),
													className: "w-full rounded-[14px] border-2 border-primary bg-background px-4 py-2.5 font-display text-2xl font-extrabold text-primary outline-none focus:ring-2 focus:ring-primary/30 tabular-nums"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "absolute right-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground text-xs",
													children: "g"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted-foreground",
												children: "Enter the exact weight from your scale or pick below:"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-3 flex flex-wrap gap-2",
											children: [
												50,
												100,
												150,
												200,
												250,
												300,
												400,
												500
											].map((val) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => handleGramsChange(val),
												className: `rounded-xl px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${grams === val ? "bg-primary text-primary-foreground shadow-[0_0_12px_rgba(0,229,143,0.3)]" : "bg-background text-foreground border border-border/80 hover:bg-muted"}`,
												children: [val, "g"]
											}, val))
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-4 gap-3 bg-card/60 backdrop-blur-md rounded-[18px] p-4 border border-border/80 shadow-md",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-center",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[10px] uppercase tracking-wider text-muted-foreground font-bold",
													children: "Calories"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-display text-xl font-extrabold text-foreground mt-0.5",
													children: result.calories
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[10px] text-muted-foreground font-mono",
													children: "kcal"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-center border-l border-border/60",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[10px] uppercase tracking-wider text-muted-foreground font-bold",
													children: "Protein"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-display text-xl font-extrabold text-rose-400 mt-0.5",
													children: result.protein_g
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[10px] text-muted-foreground font-mono",
													children: "g"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-center border-l border-border/60",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[10px] uppercase tracking-wider text-muted-foreground font-bold",
													children: "Carbs"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-display text-xl font-extrabold text-amber-400 mt-0.5",
													children: result.carbs_g
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[10px] text-muted-foreground font-mono",
													children: "g"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-center border-l border-border/60",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[10px] uppercase tracking-wider text-muted-foreground font-bold",
													children: "Fat"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-display text-xl font-extrabold text-emerald-400 mt-0.5",
													children: result.fat_g
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[10px] text-muted-foreground font-mono",
													children: "g"
												})
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-[18px] border border-cyan-500/30 bg-cyan-950/10 dark:bg-[#071926]/60 p-3.5 space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " Key Micronutrients & Fiber (Calculated)"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-xl bg-background/60 border border-border/60 p-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-muted-foreground uppercase font-bold block",
													children: "Fiber"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-extrabold text-teal-400",
													children: [result.fiber_g || 0, "g"]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-xl bg-background/60 border border-border/60 p-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-muted-foreground uppercase font-bold block",
													children: "Sodium"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-extrabold text-foreground",
													children: [result.sodium_mg || 0, "mg"]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-xl bg-background/60 border border-border/60 p-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-muted-foreground uppercase font-bold block",
													children: "Potassium"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-extrabold text-foreground",
													children: [result.potassium_mg || 0, "mg"]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-xl bg-background/60 border border-border/60 p-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-muted-foreground uppercase font-bold block",
													children: "Calcium"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-extrabold text-foreground",
													children: [result.calcium_mg || 0, "mg"]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-xl bg-background/60 border border-border/60 p-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-muted-foreground uppercase font-bold block",
													children: "Iron"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-extrabold text-amber-400",
													children: [result.iron_mg || 0, "mg"]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-xl bg-background/60 border border-border/60 p-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-muted-foreground uppercase font-bold block",
													children: "Magnesium"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-extrabold text-foreground",
													children: [result.magnesium_mg || 0, "mg"]
												})]
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-3 pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: reset,
										className: "rounded-[16px] border border-border/80 bg-background px-5 py-3 text-sm font-bold text-foreground hover:bg-muted active:scale-95 transition",
										children: "Discard"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => save.mutate(),
										disabled: save.isPending,
										className: "flex flex-1 items-center justify-center gap-2 rounded-[16px] bg-primary px-6 py-3.5 font-display text-base font-extrabold text-primary-foreground shadow-[0_0_25px_rgba(0,229,143,0.3)] hover:opacity-95 active:scale-[0.98] transition disabled:opacity-50",
										children: [
											save.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }),
											"Log Meal (",
											result.calories,
											" kcal)"
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-t border-border/80 pt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setShowAdvanced(!showAdvanced),
										className: "text-xs font-bold text-muted-foreground hover:text-foreground underline underline-offset-4",
										children: showAdvanced ? "▲ Hide manual nutrient adjustments" : "▼ Advanced: Customize macros & micronutrients manually"
									}), showAdvanced && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 space-y-4 animate-in fade-in duration-200",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] font-bold uppercase tracking-wider text-primary mb-2",
											children: "Core Macronutrients"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6",
											children: [
												[
													"Calories",
													"calories",
													"kcal"
												],
												[
													"Protein",
													"protein_g",
													"g"
												],
												[
													"Carbs",
													"carbs_g",
													"g"
												],
												[
													"Fat",
													"fat_g",
													"g"
												],
												[
													"Fiber",
													"fiber_g",
													"g"
												],
												[
													"Sugar",
													"sugar_g",
													"g"
												]
											].map(([label, key, unit]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block rounded-[16px] border border-border/80 bg-background/80 p-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[10px] uppercase tracking-widest font-bold text-muted-foreground",
													children: label
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-1 flex items-baseline gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "number",
														step: key === "calories" ? "1" : "0.1",
														value: result[key] ?? 0,
														onChange: (e) => handleNutrientChange(key, Number(e.target.value)),
														className: "w-full bg-transparent font-display text-lg font-bold text-foreground outline-none tabular-nums"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs text-muted-foreground font-mono",
														children: unit
													})]
												})]
											}, key))
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] font-bold uppercase tracking-wider text-primary mb-2",
											children: "Micronutrients & Minerals"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
											children: [
												[
													"Sodium",
													"sodium_mg",
													"mg"
												],
												[
													"Potassium",
													"potassium_mg",
													"mg"
												],
												[
													"Calcium",
													"calcium_mg",
													"mg"
												],
												[
													"Magnesium",
													"magnesium_mg",
													"mg"
												],
												[
													"Iron",
													"iron_mg",
													"mg"
												],
												[
													"Vitamin A",
													"vit_a_ug",
													"mcg"
												],
												[
													"Vitamin B12",
													"vit_b12_ug",
													"mcg"
												],
												[
													"Vitamin D",
													"vit_d_ug",
													"mcg"
												],
												[
													"Omega-3",
													"omega3_g",
													"g"
												]
											].map(([label, key, unit]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block rounded-[16px] border border-border/80 bg-background/80 p-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[10px] uppercase tracking-widest font-bold text-muted-foreground",
													children: label
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-1 flex items-baseline gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "number",
														step: key.includes("mg") || key.includes("ug") ? key.includes("iron") || key.includes("vit_b12") || key.includes("vit_d") ? "0.1" : "1" : "0.01",
														value: result[key] ?? 0,
														onChange: (e) => handleNutrientChange(key, Number(e.target.value)),
														className: "w-full bg-transparent font-display text-lg font-bold text-foreground outline-none tabular-nums"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs text-muted-foreground font-mono",
														children: unit
													})]
												})]
											}, key))
										})] })]
									})]
								})
							]
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { ScanPage as component };
