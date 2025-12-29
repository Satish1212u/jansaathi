import { LanguageSelector } from "./LanguageSelector";
import { ThemeToggle } from "./ThemeToggle";
import logo from "@/assets/logo.jpg";

interface HeaderProps {
  language: string;
  onLanguageChange: (lang: string) => void;
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export function Header({ language, onLanguageChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 glass border-b border-border/30">
      <div className="container flex items-center justify-between h-16 md:h-18">
        {/* Logo */}
        <button 
          onClick={scrollToTop}
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
        </button>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSelector selected={language} onSelect={onLanguageChange} />
        </div>
      </div>
    </header>
  );
}