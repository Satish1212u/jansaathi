import { Link, useLocation } from "react-router-dom";
import { LanguageSelector } from "./LanguageSelector";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogIn, UserPlus, LogOut, User, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/logo.jpg";
import { useState } from "react";

interface HeaderProps {
  language?: string;
  onLanguageChange?: (lang: string) => void;
  onOpenAuth?: (mode: "login" | "register") => void;
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export function Header({ language = "en", onLanguageChange, onOpenAuth }: HeaderProps) {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { user, isAuthenticated, signOut, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userDisplayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/30">
      <div className="container flex items-center justify-between h-16 md:h-18">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link 
            to="/"
            onClick={isHome ? scrollToTop : undefined}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="relative">
              <img 
                src={logo} 
                alt="JanSaathi Logo" 
                className="w-10 h-10 rounded-xl object-contain bg-white shadow-md transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">
                JanSaathi
              </h1>
              <p className="text-[10px] text-muted-foreground tracking-wide hidden sm:block">
                AI Welfare Assistant
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                isHome
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              Home
            </Link>
            <Link
              to="/schemes"
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                location.pathname === "/schemes"
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              Explore Schemes
            </Link>
          </nav>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {onLanguageChange && (
            <div className="hidden sm:block">
              <LanguageSelector selected={language} onSelect={onLanguageChange} />
            </div>
          )}

          {/* Auth Buttons */}
          {!isLoading && (
            <>
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="gap-2 px-3 h-9 rounded-xl"
                    >
                      <div className="w-7 h-7 rounded-full gradient-hero flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="hidden sm:inline text-sm font-medium max-w-[100px] truncate">
                        {userDisplayName}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium truncate">{userDisplayName}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="w-4 h-4 mr-2" />
                        Profile Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onOpenAuth?.("login")}
                    className="gap-1.5 h-9 px-3 rounded-xl text-sm"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onOpenAuth?.("register")}
                    className="gap-1.5 h-9 px-4 rounded-xl gradient-hero text-white text-sm"
                  >
                    <UserPlus className="w-4 h-4" />
                    Register
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden h-9 w-9"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-border/30 bg-background/95 backdrop-blur-lg animate-fade-in">
          <div className="container py-4 space-y-4">
            {/* Mobile Navigation */}
            <nav className="flex flex-col gap-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isHome
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                Home
              </Link>
              <Link
                to="/schemes"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === "/schemes"
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                Explore Schemes
              </Link>
            </nav>

            {/* Mobile Language Selector */}
            {onLanguageChange && (
              <div className="px-1">
                <LanguageSelector selected={language} onSelect={onLanguageChange} />
              </div>
            )}

            {/* Mobile Auth Buttons */}
            {!isLoading && !isAuthenticated && (
              <div className="flex gap-2 pt-2 border-t border-border/30">
                <Button
                  variant="outline"
                  className="flex-1 gap-1.5 h-10 rounded-xl"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth?.("login");
                  }}
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Button>
                <Button
                  className="flex-1 gap-1.5 h-10 rounded-xl gradient-hero text-white"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth?.("register");
                  }}
                >
                  <UserPlus className="w-4 h-4" />
                  Register
                </Button>
              </div>
            )}

            {/* Mobile Sign Out */}
            {!isLoading && isAuthenticated && (
              <div className="pt-2 border-t border-border/30 space-y-2">
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{userDisplayName}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Profile Settings
                </Link>
                <Button
                  variant="outline"
                  className="w-full gap-2 h-10 rounded-xl text-destructive hover:text-destructive"
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
