-- Drop the existing permissive INSERT policy
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;

-- Create a new policy requiring authentication for newsletter subscriptions
CREATE POLICY "Authenticated users can subscribe to newsletter"
ON public.newsletter_subscribers
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Also add a policy allowing users to view their own subscription
CREATE POLICY "Users can view their own subscription"
ON public.newsletter_subscribers
FOR SELECT
TO authenticated
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));