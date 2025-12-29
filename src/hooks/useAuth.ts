import { useState, useEffect, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

// Validation schemas
export const emailSchema = z.string().trim().email("Please enter a valid email address");
export const passwordSchema = z.string().min(8, "Password must be at least 8 characters");
export const nameSchema = z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name is too long");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

// Password strength calculation
export function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak", color: "bg-destructive" };
  if (score <= 2) return { score, label: "Fair", color: "bg-warning" };
  if (score <= 3) return { score, label: "Good", color: "bg-info" };
  return { score, label: "Strong", color: "bg-success" };
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      // Validate input
      const result = loginSchema.safeParse({ email, password });
      if (!result.success) {
        const errorMessage = result.error.errors[0]?.message || "Invalid input";
        return { error: { message: errorMessage } };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: result.data.email,
        password: result.data.password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          return { error: { message: "Invalid email or password" } };
        }
        return { error: { message: error.message } };
      }

      toast.success("Welcome back!");
      return { error: null };
    } catch (err) {
      return { error: { message: "An unexpected error occurred" } };
    }
  }, []);

  const signUp = useCallback(async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    acceptTerms: boolean
  ) => {
    try {
      // Validate input
      const result = registerSchema.safeParse({ 
        name, 
        email, 
        password, 
        confirmPassword,
        acceptTerms 
      });
      
      if (!result.success) {
        const errorMessage = result.error.errors[0]?.message || "Invalid input";
        return { error: { message: errorMessage } };
      }

      const redirectUrl = `${window.location.origin}/`;

      const { error } = await supabase.auth.signUp({
        email: result.data.email,
        password: result.data.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: result.data.name,
          },
        },
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          return { error: { message: "An account with this email already exists" } };
        }
        return { error: { message: error.message } };
      }

      toast.success("Account created successfully!");
      return { error: null };
    } catch (err) {
      return { error: { message: "An unexpected error occurred" } };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const result = emailSchema.safeParse(email);
      if (!result.success) {
        return { error: { message: "Please enter a valid email address" } };
      }

      const { error } = await supabase.auth.resetPasswordForEmail(result.data, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { error: { message: error.message } };
      }

      toast.success("Password reset email sent!");
      return { error: null };
    } catch (err) {
      return { error: { message: "An unexpected error occurred" } };
    }
  }, []);

  return {
    user,
    session,
    isLoading,
    isAuthenticated: !!session,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
}
