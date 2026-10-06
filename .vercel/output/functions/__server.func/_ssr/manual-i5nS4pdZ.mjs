import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, i as useQueryClient, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as getLocalDateString } from "./date-utils-CMo_soRo.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $ as Leaf, Ft as Calculator, O as Sparkles, Q as LoaderCircle, Rt as Beef, V as Plus, c as Utensils, et as Layers, gt as Droplet, i as Wheat, nt as Info, t as Zap, ut as Flame, xt as CircleCheck, y as Trash2 } from "../_libs/lucide-react.mjs";
import { a as LocalStore, v as useServerFn } from "./router-BBaCA5Zn.mjs";
import { t as logMeal } from "./meals.functions-CIOqHbgr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/manual-i5nS4pdZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SAMPLE_PRESETS = [
	{
		name: "Paneer & Soya Bhurji",
		ingredients: [
			{
				id: "p1",
				name: "Paneer / Cottage Cheese",
				amount: "100g"
			},
			{
				id: "p2",
				name: "Soya Granules",
				amount: "50g"
			},
			{
				id: "p3",
				name: "Whole Wheat Chapati",
				amount: "2 pcs"
			},
			{
				id: "p4",
				name: "Mustard Oil",
				amount: "1 tsp"
			}
		]
	},
	{
		name: "Eggs & Toast Breakfast",
		ingredients: [
			{
				id: "e1",
				name: "Whole Eggs",
				amount: "3 pcs"
			},
			{
				id: "e2",
				name: "Whole Wheat Bread",
				amount: "2 slices"
			},
			{
				id: "e3",
				name: "Butter",
				amount: "1 tsp"
			}
		]
	},
	{
		name: "Oats & Peanut Butter Porridge",
		ingredients: [
			{
				id: "o1",
				name: "Rolled Oats",
				amount: "60g"
			},
			{
				id: "o2",
				name: "Whole Milk",
				amount: "250ml"
			},
			{
				id: "o3",
				name: "Peanut Butter",
				amount: "1 tbsp"
			},
			{
				id: "o4",
				name: "Banana",
				amount: "1 medium"
			}
		]
	},
	{
		name: "Chicken Rice Bowl",
		ingredients: [
			{
				id: "c1",
				name: "Chicken Breast (Grilled)",
				amount: "150g"
			},
			{
				id: "c2",
				name: "Cooked Basmati Rice",
				amount: "150g"
			},
			{
				id: "c3",
				name: "Steamed Broccoli",
				amount: "80g"
			},
			{
				id: "c4",
				name: "Olive Oil",
				amount: "1 tsp"
			}
		]
	}
];
function ManualPage() {
	const navigate = useNavigate();
	const qc = useQueryClient();
	const logFn = useServerFn(logMeal);
	const [f, setF] = (0, import_react.useState)({
		name: "",
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
		omega3_g: 0
	});
	const [ingredients, setIngredients] = (0, import_react.useState)([
		{
			id: "1",
			name: "Paneer / Cottage Cheese",
			amount: "100g"
		},
		{
			id: "2",
			name: "Whole Wheat Chapati",
			amount: "2 pcs"
		},
		{
			id: "3",
			name: "Mustard Oil",
			amount: "1 tsp"
		}
	]);
	const [isAnalyzing, setIsAnalyzing] = (0, import_react.useState)(false);
	const [analyzedResult, setAnalyzedResult] = (0, import_react.useState)(null);
	const addIngredientRow = () => {
		setIngredients((prev) => [...prev, {
			id: Date.now().toString(),
			name: "",
			amount: "100g"
		}]);
	};
	const removeIngredientRow = (id) => {
		if (ingredients.length <= 1) {
			toast.error("Please keep at least one ingredient.");
			return;
		}
		setIngredients((prev) => prev.filter((item) => item.id !== id));
	};
	const updateIngredient = (id, field, value) => {
		setIngredients((prev) => prev.map((item) => item.id === id ? {
			...item,
			[field]: value
		} : item));
	};
	const loadPreset = (preset) => {
		setF((prev) => ({
			...prev,
			name: preset.name
		}));
		setIngredients(preset.ingredients);
		setAnalyzedResult(null);
		toast.success(`Loaded "${preset.name}" preset! Click Analyze below.`);
	};
	const handleAnalyze = async () => {
		const validIngredients = ingredients.filter((i) => i.name.trim().length > 0);
		if (validIngredients.length === 0) {
			toast.error("Please add at least one ingredient name.");
			return;
		}
		setIsAnalyzing(true);
		try {
			const res = await fetch("/api/analyze-ingredients", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					mealName: f.name || "Custom Meal",
					ingredients: validIngredients
				})
			});
			if (!res.ok) {
				const errData = await res.json().catch(() => ({}));
				throw new Error(errData.error || `Server responded with ${res.status}`);
			}
			const data = await res.json();
			setAnalyzedResult(data);
			setF({
				name: f.name || data.mealName || "Custom Meal",
				calories: data.calories,
				protein_g: data.protein_g,
				carbs_g: data.carbs_g,
				fat_g: data.fat_g,
				fiber_g: data.fiber_g,
				sugar_g: data.sugar_g,
				sodium_mg: data.sodium_mg || 0,
				iron_mg: data.iron_mg || 0,
				calcium_mg: data.calcium_mg || 0,
				magnesium_mg: data.magnesium_mg || 0,
				potassium_mg: data.potassium_mg || 0,
				vit_a_ug: data.vit_a_ug || 0,
				vit_b12_ug: data.vit_b12_ug || 0,
				vit_d_ug: data.vit_d_ug || 0,
				omega3_g: data.omega3_g || 0
			});
			toast.success("Analysis completed! Macros and micros loaded.");
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Failed to analyze ingredients";
			toast.error(msg);
		} finally {
			setIsAnalyzing(false);
		}
	};
	const save = useMutation({
		mutationFn: async () => {
			const localDay = getLocalDateString();
			LocalStore.addMeal({
				name: f.name || "Custom Meal",
				source: "manual",
				calories: Number(f.calories),
				protein_g: Number(f.protein_g),
				carbs_g: Number(f.carbs_g),
				fat_g: Number(f.fat_g),
				fiber_g: Number(f.fiber_g),
				sugar_g: Number(f.sugar_g),
				sodium_mg: Number(f.sodium_mg || 0),
				iron_mg: Number(f.iron_mg || 0),
				calcium_mg: Number(f.calcium_mg || 0),
				magnesium_mg: Number(f.magnesium_mg || 0),
				potassium_mg: Number(f.potassium_mg || 0),
				vit_a_ug: Number(f.vit_a_ug || 0),
				vit_b12_ug: Number(f.vit_b12_ug || 0),
				vit_d_ug: Number(f.vit_d_ug || 0),
				omega3_g: Number(f.omega3_g || 0),
				eaten_at: (/* @__PURE__ */ new Date()).toISOString(),
				eaten_on: localDay
			});
			try {
				await logFn({ data: {
					...f,
					name: f.name || "Custom Meal",
					source: "manual",
					eaten_on: localDay
				} });
			} catch {}
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["today"] });
			toast.success("Meal logged to your daily tracker!");
			navigate({ to: "/home" });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to log meal")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl space-y-6 pb-20 animate-in fade-in duration-300",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 border-b border-border/80 pb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-extrabold text-emerald-400 w-fit shadow-[0_0_12px_rgba(0,229,143,0.15)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "h-3.5 w-3.5 text-primary" }), " Ingredient Nutrition System"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight",
						children: "Manual Meal & Ingredient Entry"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							"Add your meal ingredients with quantities, hit",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-primary",
								children: "Analyze"
							}),
							" to auto-calculate complete macros and micro-nutrients!"
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-3.5 w-3.5 text-amber-400" }), " Quick Preset Meal Examples"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: SAMPLE_PRESETS.map((preset) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => loadPreset(preset),
						className: "rounded-full border border-border/80 bg-card/60 hover:bg-emerald-500/10 hover:border-emerald-500/30 px-3.5 py-1.5 text-xs font-extrabold text-foreground hover:text-primary transition-all active:scale-95 shadow-sm",
						children: ["+ ", preset.name]
					}, preset.name))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[24px] border border-border/80 bg-card/60 dark:border-white/10 dark:bg-[#0C1722]/80 backdrop-blur-2xl p-5 shadow-xl space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-1.5",
						children: "Meal Title / Dish Name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: f.name,
						onChange: (e) => setF({
							...f,
							name: e.target.value
						}),
						className: "w-full rounded-[16px] border border-border/80 bg-background/80 px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary transition",
						placeholder: "e.g. Soya & Paneer Bhurji with Rotis"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3.5 pt-3 border-t border-border/60",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center justify-between gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs sm:text-sm font-extrabold uppercase tracking-wider text-primary flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Utensils, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ingredients & Quantities" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-muted-foreground font-medium",
									children: "Full ingredient names & amounts (e.g. 100g, 2 pcs, 1 cup)"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-3",
								children: ingredients.map((ing, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "group relative rounded-[20px] border border-border/80 bg-card/40 p-3 sm:p-3.5 shadow-sm hover:border-primary/40 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2.5 flex-1 min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-xl bg-emerald-500/15 text-xs sm:text-sm font-black text-primary shrink-0 shadow-xs",
												children: idx + 1
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "relative flex-1 min-w-0",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													value: ing.name,
													onChange: (e) => updateIngredient(ing.id, "name", e.target.value),
													placeholder: "Ingredient Name (e.g. Paneer / Cottage Cheese)",
													title: ing.name || "Ingredient Name",
													className: "w-full rounded-xl border border-border/70 bg-background/90 px-3.5 py-2.5 text-xs sm:text-sm font-semibold outline-none focus:border-primary focus:bg-background text-foreground placeholder:text-muted-foreground/60 transition-all"
												})
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 pl-9 sm:pl-0 sm:w-auto",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "relative flex-1 sm:w-36 md:w-44 shrink-0",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													value: ing.amount,
													onChange: (e) => updateIngredient(ing.id, "amount", e.target.value),
													placeholder: "Quantity (e.g. 100g, 2 pcs)",
													title: ing.amount || "Quantity",
													className: "w-full rounded-xl border border-border/70 bg-background/90 px-3.5 py-2.5 text-xs sm:text-sm font-semibold outline-none focus:border-primary focus:bg-background text-foreground placeholder:text-muted-foreground/60 transition-all"
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => removeIngredientRow(ing.id),
												className: "grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 active:scale-95 transition-all shrink-0 cursor-pointer",
												title: "Remove ingredient",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
											})]
										})]
									})
								}, ing.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-2 pt-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: addIngredientRow,
									className: "inline-flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-primary hover:bg-primary/20 active:scale-95 transition-all cursor-pointer shadow-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add Another Ingredient"]
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pt-3 border-t border-border/60",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: handleAnalyze,
							disabled: isAnalyzing,
							className: "flex w-full items-center justify-center gap-2 rounded-[20px] bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 px-6 py-3.5 text-sm font-extrabold text-slate-950 shadow-[0_0_25px_rgba(0,229,143,0.35)] hover:brightness-110 active:scale-95 transition-all duration-300 disabled:opacity-50 cursor-pointer",
							children: isAnalyzing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Analyzing Ingredients..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-slate-950 animate-pulse" }), " Analyze Ingredients & Calculate Macros/Micros"] })
						})
					})
				]
			}),
			analyzedResult && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[24px] border border-emerald-500/30 bg-card/70 backdrop-blur-xl p-6 shadow-[0_0_30px_rgba(0,229,143,0.15)] space-y-6 animate-in slide-in-from-bottom-4 duration-300",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-border/60 pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-base font-extrabold text-foreground",
								children: "Calculated Nutrition Breakdown"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-muted-foreground",
								children: [
									"Serving: ",
									analyzedResult.serving,
									" (~",
									analyzedResult.totalGrams,
									"g total weight)"
								]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-extrabold text-primary",
							children: "Verified"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[20px] border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 flex items-center justify-between shadow-lg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-12 w-12 place-items-center rounded-2xl bg-amber-500/20 text-amber-400 font-extrabold border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-6 w-6" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-extrabold uppercase tracking-wider text-amber-400",
								children: "Total Energy"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-display text-3xl font-extrabold text-foreground tabular-nums",
								children: [
									analyzedResult.calories,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-bold text-muted-foreground",
										children: "kcal"
									})
								]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-right text-xs text-muted-foreground font-semibold",
							children: "Ready to Log"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs font-extrabold uppercase tracking-wider text-primary flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-3.5 w-3.5" }), " Calculated Macronutrients"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3 sm:grid-cols-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-[18px] border border-emerald-500/30 bg-emerald-500/10 p-3 text-center shadow-md",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-center gap-1 text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Beef, { className: "h-3 w-3" }), " Protein"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-display text-xl font-extrabold text-emerald-400 tabular-nums mt-0.5",
										children: [analyzedResult.protein_g, "g"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-[18px] border border-blue-500/30 bg-blue-500/10 p-3 text-center shadow-md",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-center gap-1 text-[10px] font-extrabold text-blue-400 uppercase tracking-wider",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wheat, { className: "h-3 w-3" }), " Carbs"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-display text-xl font-extrabold text-blue-400 tabular-nums mt-0.5",
										children: [analyzedResult.carbs_g, "g"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-[18px] border border-purple-500/30 bg-purple-500/10 p-3 text-center shadow-md",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-center gap-1 text-[10px] font-extrabold text-purple-400 uppercase tracking-wider",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Droplet, { className: "h-3 w-3" }), " Fat"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-display text-xl font-extrabold text-purple-400 tabular-nums mt-0.5",
										children: [analyzedResult.fat_g, "g"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-[18px] border border-teal-500/30 bg-teal-500/10 p-3 text-center shadow-md",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-center gap-1 text-[10px] font-extrabold text-teal-400 uppercase tracking-wider",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "h-3 w-3" }), " Fiber"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-display text-xl font-extrabold text-teal-400 tabular-nums mt-0.5",
										children: [analyzedResult.fiber_g, "g"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-[18px] border border-rose-500/30 bg-rose-500/10 p-3 text-center col-span-2 sm:col-span-1 shadow-md",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] font-extrabold text-rose-400 uppercase tracking-wider",
										children: "Sugar"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-display text-xl font-extrabold text-rose-400 tabular-nums mt-0.5",
										children: [analyzedResult.sugar_g, "g"]
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 pt-2 border-t border-border/60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " Key Micronutrients Quantity"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-2.5 sm:grid-cols-3 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-[16px] bg-card/80 border border-border/70 p-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground uppercase font-bold block",
										children: "Sodium"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-extrabold text-foreground",
										children: [analyzedResult.sodium_mg, " mg"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-[16px] bg-card/80 border border-border/70 p-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground uppercase font-bold block",
										children: "Iron"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-extrabold text-foreground",
										children: [analyzedResult.iron_mg, " mg"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-[16px] bg-card/80 border border-border/70 p-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground uppercase font-bold block",
										children: "Calcium"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-extrabold text-foreground",
										children: [analyzedResult.calcium_mg, " mg"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-[16px] bg-card/80 border border-border/70 p-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground uppercase font-bold block",
										children: "Potassium"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-extrabold text-foreground",
										children: [analyzedResult.potassium_mg, " mg"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-[16px] bg-card/80 border border-border/70 p-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground uppercase font-bold block",
										children: "Magnesium"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-extrabold text-foreground",
										children: [analyzedResult.magnesium_mg, " mg"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-[16px] bg-card/80 border border-border/70 p-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground uppercase font-bold block",
										children: "Vit A / Vit B12"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-extrabold text-foreground",
										children: [
											analyzedResult.vit_a_ug,
											"µg / ",
											analyzedResult.vit_b12_ug,
											"µg"
										]
									})]
								})
							]
						})]
					}),
					analyzedResult.ingredientBreakdown && analyzedResult.ingredientBreakdown.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2.5 pt-3 border-t border-border/60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs sm:text-sm font-extrabold uppercase tracking-wider text-foreground flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-4 w-4 text-primary shrink-0" }), " Itemized Ingredient Macros Breakdown"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-[20px] border border-border/80 bg-background/60 overflow-hidden text-xs sm:text-sm shadow-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden sm:grid grid-cols-12 bg-muted/40 px-4 py-3 font-extrabold text-muted-foreground text-[10px] uppercase tracking-wider border-b border-border/60",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col-span-6",
										children: "Ingredient & Portion"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col-span-2 text-right",
										children: "Calories"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col-span-2 text-right",
										children: "Protein"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col-span-2 text-right",
										children: "Carbs / Fat"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "divide-y divide-border/60",
								children: analyzedResult.ingredientBreakdown.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 sm:px-4 sm:py-3 font-semibold text-foreground hover:bg-card/50 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col sm:hidden gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "font-extrabold text-foreground text-xs leading-snug break-words",
												children: [item.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "ml-1.5 inline-block text-[11px] font-semibold text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md",
													children: item.amount
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-black text-amber-500 text-xs shrink-0 bg-amber-500/10 px-2 py-0.5 rounded-md",
												children: [item.calories, " kcal"]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3 text-[11px] pt-1 border-t border-border/40 font-medium text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-emerald-400 font-extrabold",
													children: [
														"Protein: ",
														item.protein_g,
														"g"
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
													"Carbs: ",
													item.carbs_g,
													"g"
												] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
													"Fat: ",
													item.fat_g,
													"g"
												] })
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "hidden sm:grid grid-cols-12 items-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-span-6 break-words pr-3",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-extrabold text-foreground",
														children: item.name
													}),
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs text-muted-foreground font-normal bg-muted/50 px-2 py-0.5 rounded-md ml-1 inline-block",
														children: item.amount
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-span-2 text-right font-black text-amber-400",
												children: [item.calories, " kcal"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-span-2 text-right font-black text-emerald-400",
												children: [item.protein_g, "g"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-span-2 text-right text-xs text-muted-foreground font-mono",
												children: [
													item.carbs_g,
													"g / ",
													item.fat_g,
													"g"
												]
											})
										]
									})]
								}, idx))
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[24px] border border-border/80 bg-card/60 backdrop-blur-xl p-5 shadow-xl space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-border/60 pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs font-extrabold uppercase tracking-wider text-foreground flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "h-4 w-4 text-primary" }), " Meal Macro Values (Editable)"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-muted-foreground",
							children: "Auto-calculated. Adjust manually if needed."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-3 sm:grid-cols-3",
						children: [
							{
								key: "calories",
								label: "Calories (kcal)",
								color: "text-amber-400"
							},
							{
								key: "protein_g",
								label: "Protein (g)",
								color: "text-emerald-400"
							},
							{
								key: "carbs_g",
								label: "Carbs (g)",
								color: "text-blue-400"
							},
							{
								key: "fat_g",
								label: "Fat (g)",
								color: "text-purple-400"
							},
							{
								key: "fiber_g",
								label: "Fiber (g)",
								color: "text-teal-400"
							},
							{
								key: "sugar_g",
								label: "Sugar (g)",
								color: "text-rose-400"
							}
						].map(({ key, label, color }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `mb-1 text-[10px] uppercase font-extrabold tracking-wider ${color}`,
								children: label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								step: "0.1",
								value: f[key],
								onChange: (e) => setF({
									...f,
									[key]: Number(e.target.value)
								}),
								className: "w-full rounded-[14px] border border-border/80 bg-background/80 px-3 py-2.5 text-sm font-extrabold outline-none focus:border-primary text-foreground tabular-nums"
							})]
						}, key))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-3 border-t border-border/60 space-y-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " Key Micronutrients (Editable)"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-2.5 sm:grid-cols-4",
							children: [
								{
									key: "sodium_mg",
									label: "Sodium (mg)",
									color: "text-cyan-400"
								},
								{
									key: "potassium_mg",
									label: "Potassium (mg)",
									color: "text-sky-400"
								},
								{
									key: "calcium_mg",
									label: "Calcium (mg)",
									color: "text-indigo-400"
								},
								{
									key: "iron_mg",
									label: "Iron (mg)",
									color: "text-amber-400"
								},
								{
									key: "magnesium_mg",
									label: "Magnesium (mg)",
									color: "text-emerald-400"
								},
								{
									key: "vit_a_ug",
									label: "Vit A (µg)",
									color: "text-orange-400"
								},
								{
									key: "vit_b12_ug",
									label: "Vit B12 (µg)",
									color: "text-violet-400"
								},
								{
									key: "vit_d_ug",
									label: "Vit D (µg)",
									color: "text-yellow-400"
								}
							].map(({ key, label, color }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `mb-1 text-[10px] uppercase font-bold tracking-wider ${color}`,
									children: label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									step: "0.1",
									value: f[key],
									onChange: (e) => setF({
										...f,
										[key]: Number(e.target.value)
									}),
									className: "w-full rounded-[12px] border border-border/70 bg-background/70 px-2.5 py-2 text-xs font-bold outline-none focus:border-cyan-400 text-foreground tabular-nums"
								})]
							}, key))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => save.mutate(),
				disabled: save.isPending || !f.name || !f.calories,
				className: "flex w-full items-center justify-center gap-2 rounded-[20px] bg-primary px-6 py-4 text-base font-extrabold text-primary-foreground shadow-[0_0_25px_rgba(0,229,143,0.3)] hover:brightness-110 active:scale-95 transition-all duration-300 disabled:opacity-50 cursor-pointer",
				children: [save.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Utensils, { className: "h-5 w-5 text-slate-950" }), "Log Meal to Daily Tracker"]
			})
		]
	});
}
//#endregion
export { ManualPage as component };
