
REVOKE EXECUTE ON FUNCTION public.recompute_daily_rollup(UUID, DATE) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.trg_recompute_rollup() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
ALTER FUNCTION public.touch_updated_at() SET search_path = public;
