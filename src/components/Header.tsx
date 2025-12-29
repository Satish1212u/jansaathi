import { LanguageSelector } from "./LanguageSelector";
import { ThemeToggle } from "./ThemeToggle";
import { HandHeart } from "lucide-react";

interface HeaderProps {
  language: string;
  onLanguageChange: (lang: string) => void;
}

export function Header({ language, onLanguageChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl gradient-hero flex items-center justify-center shadow-lg shadow-primary/25">
            <HandHeart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              JanSaathi
            </h1>
            <p className="text-xs text-muted-foreground hidden md:block">
              Your Welfare Guide | जनसाथी
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 md:gap-2">
          <ThemeToggle />
          <LanguageSelector selected={language} onSelect={onLanguageChange} />
        </div>
      </div>
    </header>
  );
}
