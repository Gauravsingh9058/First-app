/** Reference daily values (generic adult, not personalised). */
export const RDA = {
  iron_mg: 18,
  calcium_mg: 1000,
  magnesium_mg: 400,
  potassium_mg: 3500,
  vit_a_ug: 900,
  vit_b12_ug: 2.4,
  vit_d_ug: 20,
  omega3_g: 1.6,
} as const;

export const MICRO_LABELS: Record<keyof typeof RDA, string> = {
  iron_mg: "Iron",
  calcium_mg: "Calcium",
  magnesium_mg: "Magnesium",
  potassium_mg: "Potassium",
  vit_a_ug: "Vitamin A",
  vit_b12_ug: "Vitamin B12",
  vit_d_ug: "Vitamin D",
  omega3_g: "Omega-3",
};

export const MICRO_UNITS: Record<keyof typeof RDA, string> = {
  iron_mg: "mg",
  calcium_mg: "mg",
  magnesium_mg: "mg",
  potassium_mg: "mg",
  vit_a_ug: "µg",
  vit_b12_ug: "µg",
  vit_d_ug: "µg",
  omega3_g: "g",
};

export const DEFICIENCY_CUTOFF = 0.7;

export function scoreColor(score: number): string {
  if (score >= 75) return "var(--color-success)";
  if (score >= 50) return "var(--color-warning)";
  return "var(--color-destructive)";
}

export function todayISO(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}
