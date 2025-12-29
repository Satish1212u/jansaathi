-- Add explicit SELECT policy that denies all public read access to newsletter subscribers
-- This makes the security posture explicit rather than relying on default deny behavior
CREATE POLICY "No public read access to subscribers"
ON public.newsletter_subscribers
FOR SELECT
USING (false);