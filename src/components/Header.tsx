import { Link, useLocation } from "react-router-dom";
import { LanguageSelector } from "./LanguageSelector";
import { ThemeToggle } from "./ThemeToggle";
import logo from "@/assets/logo.jpg";

interface HeaderProps {
  language?: string;
  onLanguageChange?: (lang: string) => void;
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export function Header({ language = "en", onLanguageChange }: HeaderProps) {
  const location = useLocation();
  const isHome = location.pathname === "/";

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
            <LanguageSelector selected={language} onSelect={onLanguageChange} />
          )}
        </div>
      </div>
    </header>
  );
}