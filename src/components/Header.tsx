import { LanguageSelector } from "./LanguageSelector";
import { HandHeart } from "lucide-react";

interface HeaderProps {
  language: string;
  onLanguageChange: (lang: string) => void;
}

export function Header({ language, onLanguageChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 glass border-b">
      <div className="container flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center shadow-glow">
            <HandHeart className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">
              JanSaathi
            </h1>
            <p className="text-xs text-muted-foreground hidden md:block">
              Your Welfare Guide | जनसाथी
            </p>
          </div>
        </div>

        {/* Language Selector */}
        <LanguageSelector selected={language} onSelect={onLanguageChange} />
      </div>
    </header>
  );
}
