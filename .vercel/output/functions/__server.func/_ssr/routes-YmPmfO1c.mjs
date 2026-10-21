import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { O as Sparkles, jt as Camera } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-YmPmfO1c.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Landing() {
	const navigate = useNavigate();
	const [phoneTab, setPhoneTab] = (0, import_react.useState)("camera");
	(0, import_react.useEffect)(() => {
		const timer = setInterval(() => {
			setPhoneTab((prev) => prev === "camera" ? "dashboard" : "camera");
		}, 3500);
		return () => clearInterval(timer);
	}, []);
	const handleGetStarted = () => {
		navigate({
			to: "/auth",
			search: { mode: "sign_up" }
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-screen flex-col items-center justify-between bg-[#071018] px-4 py-8 sm:py-12 text-white overflow-hidden selection:bg-[#38BDF8]/30",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-0 z-0 overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-[#38BDF8]/20 via-[#22D3EE]/15 to-[#34D399]/20 blur-[120px] animate-ambient-breathing" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "relative z-10 h-4 w-full" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 flex w-full max-w-sm flex-col items-center my-auto",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative w-[280px] sm:w-[310px] rounded-[42px] border-[7px] border-[#1F2937] bg-black p-2.5 shadow-[0_25px_60px_rgba(0,0,0,0.9)] transition-all duration-500",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute top-3.5 left-1/2 h-4 w-24 -translate-x-1/2 rounded-full bg-black z-30 flex items-center justify-end px-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-2 rounded-full bg-slate-800" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative h-[440px] sm:h-[480px] w-full overflow-hidden rounded-[32px] bg-[#0A0F17]",
							children: phoneTab === "camera" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative h-full w-full flex flex-col justify-between p-4 bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between pt-6 text-xs text-slate-300",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-md",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "w-3.5 h-3.5 text-[#38BDF8]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: "AI Camera"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-slate-400 font-mono",
											children: "1080p AI"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "relative my-auto flex flex-col items-center justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative w-52 h-44 rounded-2xl overflow-hidden border-2 border-emerald-400/60 shadow-2xl bg-slate-800 flex items-center justify-center group",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
													alt: "Healthy Meal",
													className: "w-full h-full object-cover"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-white" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-white" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-white" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-white" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "absolute bottom-3 bg-black/70 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 shadow-lg",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5 text-amber-400 fill-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Scan Food" })]
												})
											]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "pb-3 flex items-center justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-14 w-14 rounded-full border-2 border-white/80 p-1 flex items-center justify-center cursor-pointer",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-full rounded-full bg-white shadow-md active:scale-90 transition" })
										})
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative h-full w-full flex flex-col justify-between p-4 bg-[#F8FAFC] text-slate-900",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-6 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-6 w-6 rounded-lg bg-emerald-500 grid place-items-center text-white text-xs font-black",
												children: "N"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-black text-sm tracking-tight text-slate-900",
												children: "NutriLens AI"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-bold text-slate-500 bg-slate-200/80 px-2.5 py-0.5 rounded-full",
											children: "Today"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "my-auto bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center flex flex-col items-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-3xl font-black text-slate-900 tracking-tight",
												children: "2,199"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-bold text-slate-400 uppercase tracking-wider",
												children: "Cals Left"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-3 gap-2 w-full mt-4 pt-3 border-t border-slate-100",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "bg-slate-50 rounded-xl p-2 text-center",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-xs font-black text-slate-900 block",
															children: "161g"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[10px] font-bold text-slate-400",
															children: "Protein left"
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "bg-slate-50 rounded-xl p-2 text-center",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-xs font-black text-slate-900 block",
															children: "251g"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[10px] font-bold text-slate-400",
															children: "Carbs left"
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "bg-slate-50 rounded-xl p-2 text-center",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-xs font-black text-slate-900 block",
															children: "61g"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[10px] font-bold text-slate-400",
															children: "Fat left"
														})]
													})
												]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bg-slate-100/80 rounded-2xl p-3 text-left",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] font-bold text-slate-500 block mb-1",
											children: "Recently Eaten"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-slate-600 font-medium",
											children: "Start tracking today's meals by taking a quick picture."
										})]
									})
								]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setPhoneTab("camera"),
							className: `h-2 rounded-full transition-all ${phoneTab === "camera" ? "w-6 bg-[#38BDF8]" : "w-2 bg-slate-700"}`
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setPhoneTab("dashboard"),
							className: `h-2 rounded-full transition-all ${phoneTab === "dashboard" ? "w-6 bg-[#38BDF8]" : "w-2 bg-slate-700"}`
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "mt-6 text-2xl sm:text-3xl font-black text-center text-white tracking-tight",
						children: [
							"Calorie tracking ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							" made easy"
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 flex w-full max-w-sm flex-col items-center gap-3 mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: handleGetStarted,
					className: "w-full flex items-center justify-center gap-2 rounded-full bg-white text-slate-950 font-black text-base py-4 px-6 shadow-xl hover:bg-slate-100 active:scale-[0.98] transition-all cursor-pointer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Get Started" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/auth",
					search: { mode: "sign_in" },
					className: "text-xs font-semibold text-slate-400 hover:text-white transition-colors py-1",
					children: ["Already have an account? ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "underline font-bold text-white",
						children: "Sign in"
					})]
				})]
			})
		]
	});
}
//#endregion
export { Landing as component };
