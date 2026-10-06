-- NutriLens AI Migration: Permanent Account Profile + Historical Calendar & Steps
-- Migration: 20261004000000_persistent_profile_history.sql

-- 1. Extend profiles table with extended_data and water_goal_l
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS extended_data JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS water_goal_l NUMERIC;

-- 2. Extend daily_rollup table with steps
ALTER TABLE public.daily_rollup ADD COLUMN IF NOT EXISTS steps INT NOT NULL DEFAULT 0;

-- 3. Create step_logs table for permanent historical steps tracking
CREATE TABLE IF NOT EXISTS public.step_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day DATE NOT NULL DEFAULT (now() AT TIME ZONE 'UTC')::DATE,
  steps INT NOT NULL DEFAULT 0,
  distance_km NUMERIC NOT NULL DEFAULT 0,
  calories_burned NUMERIC NOT NULL DEFAULT 0,
  active_minutes INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT step_logs_user_day_unique UNIQUE (user_id, day)
);

CREATE INDEX IF NOT EXISTS step_logs_user_day_idx ON public.step_logs(user_id, day);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.step_logs TO authenticated;
GRANT ALL ON public.step_logs TO service_role;

ALTER TABLE public.step_logs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'step_logs' AND policyname = 'own steps'
  ) THEN
    CREATE POLICY "own steps" ON public.step_logs FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END
$$;

-- 4. Recompute rollup function update to integrate step_logs
CREATE OR REPLACE FUNCTION public.recompute_daily_rollup(p_user UUID, p_day DATE)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_target INT;
  v_protein_target INT;
  v_steps INT;
BEGIN
  SELECT COALESCE(daily_calorie_target,2000), COALESCE(protein_target_g,120)
    INTO v_target, v_protein_target FROM public.profiles WHERE user_id = p_user;
  IF v_target IS NULL THEN v_target := 2000; END IF;
  IF v_protein_target IS NULL THEN v_protein_target := 120; END IF;

  SELECT COALESCE(steps, 0) INTO v_steps FROM public.step_logs WHERE user_id = p_user AND day = p_day;
  IF v_steps IS NULL THEN v_steps := 0; END IF;

  INSERT INTO public.daily_rollup AS r (
    user_id, day,
    calories, protein_g, carbs_g, fat_g, fiber_g, sugar_g, sodium_mg,
    iron_mg, calcium_mg, magnesium_mg, potassium_mg, vit_a_ug, vit_b12_ug, vit_d_ug, omega3_g,
    water_glasses, steps, meal_count, score, updated_at
  )
  SELECT
    p_user, p_day,
    COALESCE(SUM(m.calories),0),
    COALESCE(SUM(m.protein_g),0),
    COALESCE(SUM(m.carbs_g),0),
    COALESCE(SUM(m.fat_g),0),
    COALESCE(SUM(m.fiber_g),0),
    COALESCE(SUM(m.sugar_g),0),
    COALESCE(SUM(m.sodium_mg),0),
    COALESCE(SUM(mm.iron_mg),0),
    COALESCE(SUM(mm.calcium_mg),0),
    COALESCE(SUM(mm.magnesium_mg),0),
    COALESCE(SUM(mm.potassium_mg),0),
    COALESCE(SUM(mm.vit_a_ug),0),
    COALESCE(SUM(mm.vit_b12_ug),0),
    COALESCE(SUM(mm.vit_d_ug),0),
    COALESCE(SUM(mm.omega3_g),0),
    (SELECT COALESCE(SUM(glasses),0) FROM public.water_logs WHERE user_id=p_user AND day=p_day),
    v_steps,
    COUNT(m.id)::INT,
    0,
    now()
  FROM public.meals m
  LEFT JOIN public.meal_micros mm ON mm.meal_id = m.id
  WHERE m.user_id = p_user AND m.eaten_on = p_day
  ON CONFLICT (user_id, day) DO UPDATE SET
    calories = EXCLUDED.calories,
    protein_g = EXCLUDED.protein_g,
    carbs_g = EXCLUDED.carbs_g,
    fat_g = EXCLUDED.fat_g,
    fiber_g = EXCLUDED.fiber_g,
    sugar_g = EXCLUDED.sugar_g,
    sodium_mg = EXCLUDED.sodium_mg,
    iron_mg = EXCLUDED.iron_mg,
    calcium_mg = EXCLUDED.calcium_mg,
    magnesium_mg = EXCLUDED.magnesium_mg,
    potassium_mg = EXCLUDED.potassium_mg,
    vit_a_ug = EXCLUDED.vit_a_ug,
    vit_b12_ug = EXCLUDED.vit_b12_ug,
    vit_d_ug = EXCLUDED.vit_d_ug,
    omega3_g = EXCLUDED.omega3_g,
    water_glasses = EXCLUDED.water_glasses,
    steps = GREATEST(r.steps, EXCLUDED.steps),
    meal_count = EXCLUDED.meal_count,
    updated_at = now();

  -- Compute score: 40% calorie proximity, 25% protein, 35% micro adequacy
  UPDATE public.daily_rollup r SET score = LEAST(100, GREATEST(0, (
    (CASE WHEN r.calories = 0 THEN 0
          ELSE GREATEST(0, 40 - (ABS(r.calories - v_target) / GREATEST(v_target,1) * 100))::INT END)
    +
    LEAST(25, ((r.protein_g / GREATEST(v_protein_target,1)) * 25)::INT)
    +
    ((
      LEAST(1.0, r.iron_mg / 18.0) +
      LEAST(1.0, r.calcium_mg / 1000.0) +
      LEAST(1.0, r.magnesium_mg / 400.0) +
      LEAST(1.0, r.potassium_mg / 3500.0) +
      LEAST(1.0, r.vit_a_ug / 900.0) +
      LEAST(1.0, r.vit_b12_ug / 2.4) +
      LEAST(1.0, r.vit_d_ug / 20.0) +
      LEAST(1.0, r.omega3_g / 1.6)
    ) / 8.0 * 35)::INT
  )))
  WHERE r.user_id = p_user AND r.day = p_day;
END;
$$;

-- 5. Trigger for step_logs
CREATE OR REPLACE FUNCTION public.trg_steps_rollup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM public.recompute_daily_rollup(OLD.user_id, OLD.day);
    RETURN OLD;
  ELSE
    PERFORM public.recompute_daily_rollup(NEW.user_id, NEW.day);
    RETURN NEW;
  END IF;
END;
$$;

DROP TRIGGER IF EXISTS step_logs_rollup ON public.step_logs;
CREATE TRIGGER step_logs_rollup AFTER INSERT OR UPDATE OR DELETE ON public.step_logs
FOR EACH ROW EXECUTE FUNCTION public.trg_steps_rollup();
