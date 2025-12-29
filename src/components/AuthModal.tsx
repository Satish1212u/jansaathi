import { useState, useEffect, useRef, useCallback } from "react";
import { X, Eye, EyeOff, Mail, Lock, User, Loader2, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth, getPasswordStrength } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "register" | "forgot-password";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
}

export function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  // Field validation state
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  
  const { signIn, signUp, resetPassword, isAuthenticated } = useAuth();

  // Reset form when mode changes
  useEffect(() => {
    setError(null);
    setSuccessMessage(null);
    setTouched({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [mode]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setAcceptTerms(false);
      setError(null);
      setSuccessMessage(null);
      setTouched({});
      // Focus first input
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [isOpen, initialMode]);

  // Close modal on successful auth
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onClose();
    }
  }, [isAuthenticated, isOpen, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle click outside
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  // Validation helpers
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getFieldError = (field: string): string | null => {
    if (!touched[field]) return null;
    
    switch (field) {
      case "name":
        if (!name.trim()) return "Name is required";
        if (name.trim().length < 2) return "Name must be at least 2 characters";
        return null;
      case "email":
        if (!email.trim()) return "Email is required";
        if (!validateEmail(email)) return "Please enter a valid email";
        return null;
      case "password":
        if (!password) return "Password is required";
        if (mode === "register" && password.length < 8) return "Password must be at least 8 characters";
        return null;
      case "confirmPassword":
        if (!confirmPassword) return "Please confirm your password";
        if (password !== confirmPassword) return "Passwords don't match";
        return null;
      default:
        return null;
    }
  };

  const isFormValid = () => {
    if (mode === "forgot-password") {
      return email.trim() && validateEmail(email);
    }
    if (mode === "login") {
      return email.trim() && validateEmail(email) && password;
    }
    // Register
    return (
      name.trim().length >= 2 &&
      email.trim() &&
      validateEmail(email) &&
      password.length >= 8 &&
      password === confirmPassword &&
      acceptTerms
    );
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    
    if (!isFormValid()) {
      // Mark all fields as touched to show errors
      setTouched({
        name: true,
        email: true,
        password: true,
        confirmPassword: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "login") {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        }
      } else if (mode === "register") {
        const { error } = await signUp(name, email, password, confirmPassword, acceptTerms);
        if (error) {
          setError(error.message);
        }
      } else if (mode === "forgot-password") {
        const { error } = await resetPassword(email);
        if (error) {
          setError(error.message);
        } else {
          setSuccessMessage("Check your email for a password reset link");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />
      
      {/* Modal */}
      <div
        ref={modalRef}
        className={cn(
          "relative w-full bg-background rounded-2xl shadow-2xl border border-border overflow-hidden",
          "animate-scale-in transition-all duration-300",
          "max-w-md",
          // Mobile: bottom sheet style
          "max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:rounded-b-none max-sm:rounded-t-3xl max-sm:max-h-[90vh]"
        )}
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-border/50">
          {/* Drag indicator for mobile */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-border sm:hidden" />
          
          <div className="flex items-center justify-between">
            <div>
              <h2 id="auth-modal-title" className="text-xl font-bold text-foreground">
                {mode === "login" && "Welcome Back"}
                {mode === "register" && "Create Account"}
                {mode === "forgot-password" && "Reset Password"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {mode === "login" && "Sign in to continue to JanSaathi"}
                {mode === "register" && "Join JanSaathi to discover welfare schemes"}
                {mode === "forgot-password" && "We'll send you a reset link"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-sm:max-h-[70vh] max-sm:overflow-y-auto">
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success/20 text-success text-sm animate-fade-in">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Name Field (Register only) */}
          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  ref={firstInputRef}
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                  className={cn(
                    "pl-10 h-11 rounded-xl",
                    getFieldError("name") && "border-destructive focus-visible:ring-destructive"
                  )}
                  disabled={isSubmitting}
                  autoComplete="name"
                />
              </div>
              {getFieldError("name") && (
                <p className="text-xs text-destructive animate-fade-in">{getFieldError("name")}</p>
              )}
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                ref={mode !== "register" ? firstInputRef : undefined}
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                className={cn(
                  "pl-10 h-11 rounded-xl",
                  getFieldError("email") && "border-destructive focus-visible:ring-destructive"
                )}
                disabled={isSubmitting}
                autoComplete="email"
              />
            </div>
            {getFieldError("email") && (
              <p className="text-xs text-destructive animate-fade-in">{getFieldError("email")}</p>
            )}
          </div>

          {/* Password Field (Login & Register) */}
          {mode !== "forgot-password" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => setMode("forgot-password")}
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={mode === "register" ? "Min. 8 characters" : "Enter your password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                  className={cn(
                    "pl-10 pr-10 h-11 rounded-xl",
                    getFieldError("password") && "border-destructive focus-visible:ring-destructive"
                  )}
                  disabled={isSubmitting}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {getFieldError("password") && (
                <p className="text-xs text-destructive animate-fade-in">{getFieldError("password")}</p>
              )}
              
              {/* Password Strength Indicator (Register only) */}
              {mode === "register" && password && (
                <div className="space-y-1.5 animate-fade-in">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={cn(
                          "h-1 flex-1 rounded-full transition-colors",
                          level <= passwordStrength.score ? passwordStrength.color : "bg-muted"
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Password strength: <span className="font-medium">{passwordStrength.label}</span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Confirm Password (Register only) */}
          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, confirmPassword: true }))}
                  className={cn(
                    "pl-10 pr-10 h-11 rounded-xl",
                    getFieldError("confirmPassword") && "border-destructive focus-visible:ring-destructive"
                  )}
                  disabled={isSubmitting}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {getFieldError("confirmPassword") && (
                <p className="text-xs text-destructive animate-fade-in">{getFieldError("confirmPassword")}</p>
              )}
            </div>
          )}

          {/* Terms & Conditions (Register only) */}
          {mode === "register" && (
            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                className="mt-0.5"
                disabled={isSubmitting}
              />
              <Label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                I agree to the{" "}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </Label>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-11 rounded-xl gradient-hero text-white font-medium transition-all hover:opacity-90"
            disabled={!isFormValid() || isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {mode === "login" && "Sign In"}
                {mode === "register" && "Create Account"}
                {mode === "forgot-password" && "Send Reset Link"}
              </>
            )}
          </Button>

          {/* Mode Toggle */}
          <div className="text-center text-sm text-muted-foreground">
            {mode === "login" && (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="text-primary font-medium hover:underline"
                >
                  Register
                </button>
              </>
            )}
            {mode === "register" && (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-primary font-medium hover:underline"
                >
                  Sign In
                </button>
              </>
            )}
            {mode === "forgot-password" && (
              <>
                Remember your password?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-primary font-medium hover:underline"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
