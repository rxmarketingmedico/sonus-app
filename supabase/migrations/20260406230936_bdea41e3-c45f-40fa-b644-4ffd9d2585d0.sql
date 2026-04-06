
CREATE TABLE public.purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  event text NOT NULL,
  hotmart_transaction text,
  plan text NOT NULL DEFAULT 'pro',
  status text NOT NULL DEFAULT 'active',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_purchases_email ON public.purchases (email);

ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage purchases"
ON public.purchases
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Users can read their own purchases"
ON public.purchases
FOR SELECT
TO authenticated
USING (lower(email) = lower(auth.email()));

CREATE OR REPLACE FUNCTION public.set_plan_on_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  buyer_email text;
  purchase_status text;
BEGIN
  SELECT email, status INTO buyer_email, purchase_status
  FROM public.purchases
  WHERE lower(email) = lower((SELECT au.email FROM auth.users au WHERE au.id = NEW.id))
  AND status = 'active'
  LIMIT 1;

  IF buyer_email IS NOT NULL THEN
    NEW.plan := 'pro';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_created_set_plan
BEFORE INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_plan_on_signup();
