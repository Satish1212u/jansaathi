-- Add database-level email validation constraints for defense in depth
ALTER TABLE public.newsletter_subscribers 
ADD CONSTRAINT valid_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');

ALTER TABLE public.newsletter_subscribers 
ADD CONSTRAINT email_max_length 
CHECK (length(email) <= 254);