
-- Enums
CREATE TYPE public.goal_type AS ENUM ('fat_loss','lean_bulk','muscle_gain','maintenance','recomp');
CREATE TYPE public.diet_type AS ENUM ('vegetarian','vegan','non_veg','jain','keto','high_protein');
CREATE TYPE public.activity_level AS ENUM ('sedentary','light','moderate','active','very_active');
CREATE TYPE public.meal_source AS ENUM ('photo','manual','barcode');
CREATE TYPE public.medical_flag AS ENUM ('diabetes','pcos','hypertension','fatty_liver','kidney_disease','food_allergy');

-- profiles
CREATE TABLE public.profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  gender TEXT,
  age INT,
  height_cm NUMERIC,
  weight_kg NUMERIC,
  goal_weight_kg NUMERIC,
  activity public.activity_level,
  goal public.goal_type,
  diet public.diet_type,
  daily_calorie_target INT DEFAULT 2000,
  protein_target_g INT DEFAULT 120,
  water_target_glasses INT DEFAULT 8,
  onboarded BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile" ON public.profiles FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- medical flags (normalized)
CREATE TABLE public.user_medical_flags (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  flag public.medical_flag NOT NULL,
  PRIMARY KEY (user_id, flag)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_medical_flags TO authenticated;
GRANT ALL ON public.user_medical_flags TO service_role;
ALTER TABLE public.user_medical_flags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own flags" ON public.user_medical_flags FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- meals
CREATE TABLE public.meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  eaten_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  eaten_on DATE NOT NULL DEFAULT (now() AT TIME ZONE 'UTC')::DATE,
  name TEXT NOT NULL,
  source public.meal_source NOT NULL DEFAULT 'manual',
  confidence NUMERIC,
  serving_desc TEXT,
  calories NUMERIC NOT NULL DEFAULT 0,
  protein_g NUMERIC NOT NULL DEFAULT 0,
  carbs_g NUMERIC NOT NULL DEFAULT 0,
  fat_g NUMERIC NOT NULL DEFAULT 0,
  fiber_g NUMERIC NOT NULL DEFAULT 0,
  sugar_g NUMERIC NOT NULL DEFAULT 0,
  sodium_mg NUMERIC NOT NULL DEFAULT 0,
  raw_model_response JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX meals_user_date_idx ON public.meals(user_id, eaten_on);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.meals TO authenticated;
GRANT ALL ON public.meals TO service_role;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own meals" ON public.meals FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- meal_micros (1:1 with meals)
CREATE TABLE public.meal_micros (
  meal_id UUID PRIMARY KEY REFERENCES public.meals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  iron_mg NUMERIC NOT NULL DEFAULT 0,
  calcium_mg NUMERIC NOT NULL DEFAULT 0,
  magnesium_mg NUMERIC NOT NULL DEFAULT 0,
  potassium_mg NUMERIC NOT NULL DEFAULT 0,
  vit_a_ug NUMERIC NOT NULL DEFAULT 0,
  vit_b12_ug NUMERIC NOT NULL DEFAULT 0,
  vit_d_ug NUMERIC NOT NULL DEFAULT 0,
  omega3_g NUMERIC NOT NULL DEFAULT 0
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.meal_micros TO authenticated;
GRANT ALL ON public.meal_micros TO service_role;
ALTER TABLE public.meal_micros ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own micros" ON public.meal_micros FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- daily_rollup (precomputed)
CREATE TABLE public.daily_rollup (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day DATE NOT NULL,
  calories NUMERIC NOT NULL DEFAULT 0,
  protein_g NUMERIC NOT NULL DEFAULT 0,
  carbs_g NUMERIC NOT NULL DEFAULT 0,
  fat_g NUMERIC NOT NULL DEFAULT 0,
  fiber_g NUMERIC NOT NULL DEFAULT 0,
  sugar_g NUMERIC NOT NULL DEFAULT 0,
  sodium_mg NUMERIC NOT NULL DEFAULT 0,
  iron_mg NUMERIC NOT NULL DEFAULT 0,
  calcium_mg NUMERIC NOT NULL DEFAULT 0,
  magnesium_mg NUMERIC NOT NULL DEFAULT 0,
  potassium_mg NUMERIC NOT NULL DEFAULT 0,
  vit_a_ug NUMERIC NOT NULL DEFAULT 0,
  vit_b12_ug NUMERIC NOT NULL DEFAULT 0,
  vit_d_ug NUMERIC NOT NULL DEFAULT 0,
  omega3_g NUMERIC NOT NULL DEFAULT 0,
  water_glasses INT NOT NULL DEFAULT 0,
  meal_count INT NOT NULL DEFAULT 0,
  score INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, day)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_rollup TO authenticated;
GRANT ALL ON public.daily_rollup TO service_role;
ALTER TABLE public.daily_rollup ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own rollup" ON public.daily_rollup FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- water logs
CREATE TABLE public.water_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day DATE NOT NULL DEFAULT (now() AT TIME ZONE 'UTC')::DATE,
  glasses INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX water_user_day_idx ON public.water_logs(user_id, day);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.water_logs TO authenticated;
GRANT ALL ON public.water_logs TO service_role;
ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own water" ON public.water_logs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- weights
CREATE TABLE public.weights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day DATE NOT NULL DEFAULT (now() AT TIME ZONE 'UTC')::DATE,
  weight_kg NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX weights_user_day_idx ON public.weights(user_id, day);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.weights TO authenticated;
GRANT ALL ON public.weights TO service_role;
ALTER TABLE public.weights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own weights" ON public.weights FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ai chats
CREATE TABLE public.ai_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  retrieved JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ai_chats_user_idx ON public.ai_chats(user_id, created_at);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_chats TO authenticated;
GRANT ALL ON public.ai_chats TO service_role;
ALTER TABLE public.ai_chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own chats" ON public.ai_chats FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Score computation (simple, transparent): proximity to calorie target + protein hit + fiber + 8 micros adequacy
-- Recompute rollup function
CREATE OR REPLACE FUNCTION public.recompute_daily_rollup(p_user UUID, p_day DATE)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_target INT;
  v_protein_target INT;
  v_cal_score INT;
  v_protein_score INT;
  v_micro_score INT;
  v_count INT;
BEGIN
  SELECT COALESCE(daily_calorie_target,2000), COALESCE(protein_target_g,120)
    INTO v_target, v_protein_target FROM public.profiles WHERE user_id = p_user;
  IF v_target IS NULL THEN v_target := 2000; END IF;
  IF v_protein_target IS NULL THEN v_protein_target := 120; END IF;

  INSERT INTO public.daily_rollup AS r (
    user_id, day,
    calories, protein_g, carbs_g, fat_g, fiber_g, sugar_g, sodium_mg,
    iron_mg, calcium_mg, magnesium_mg, potassium_mg, vit_a_ug, vit_b12_ug, vit_d_ug, omega3_g,
    water_glasses, meal_count, score, updated_at
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
    meal_count = EXCLUDED.meal_count,
    updated_at = now();

  -- Compute score: 40% calorie proximity, 25% protein, 35% micro adequacy (avg %RDA capped 100, 8 nutrients)
  UPDATE public.daily_rollup r SET score = LEAST(100, GREATEST(0, (
    -- calorie proximity (0-40): 40 when within 10% of target, 0 when >50% off
    (CASE WHEN r.calories = 0 THEN 0
          ELSE GREATEST(0, 40 - (ABS(r.calories - v_target) / GREATEST(v_target,1) * 100))::INT END)
    +
    -- protein (0-25): linear up to target
    LEAST(25, ((r.protein_g / GREATEST(v_protein_target,1)) * 25)::INT)
    +
    -- micros (0-35): avg of 8 micro %RDA (capped 100%) * 35
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

-- Trigger function on meals/micros/water
CREATE OR REPLACE FUNCTION public.trg_recompute_rollup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID;
  v_day DATE;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_user := OLD.user_id;
    IF TG_TABLE_NAME = 'meals' THEN v_day := OLD.eaten_on;
    ELSIF TG_TABLE_NAME = 'water_logs' THEN v_day := OLD.day;
    ELSIF TG_TABLE_NAME = 'meal_micros' THEN
      SELECT eaten_on INTO v_day FROM public.meals WHERE id = OLD.meal_id;
    END IF;
  ELSE
    v_user := NEW.user_id;
    IF TG_TABLE_NAME = 'meals' THEN v_day := NEW.eaten_on;
    ELSIF TG_TABLE_NAME = 'water_logs' THEN v_day := NEW.day;
    ELSIF TG_TABLE_NAME = 'meal_micros' THEN
      SELECT eaten_on INTO v_day FROM public.meals WHERE id = NEW.meal_id;
    END IF;
  END IF;
  IF v_user IS NOT NULL AND v_day IS NOT NULL THEN
    PERFORM public.recompute_daily_rollup(v_user, v_day);
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER meals_rollup AFTER INSERT OR UPDATE OR DELETE ON public.meals
FOR EACH ROW EXECUTE FUNCTION public.trg_recompute_rollup();
CREATE TRIGGER micros_rollup AFTER INSERT OR UPDATE OR DELETE ON public.meal_micros
FOR EACH ROW EXECUTE FUNCTION public.trg_recompute_rollup();
CREATE TRIGGER water_rollup AFTER INSERT OR UPDATE OR DELETE ON public.water_logs
FOR EACH ROW EXECUTE FUNCTION public.trg_recompute_rollup();

-- Auto-create profile on new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email,'@',1)))
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at touch on profiles
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
CREATE TRIGGER profiles_touch BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
