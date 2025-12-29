import { LanguageSelector } from "./LanguageSelector";
import { ThemeToggle } from "./ThemeToggle";
import { HandHeart, Home, HelpCircle, Mail } from "lucide-react";
import { Button } from "./ui/button";

interface HeaderProps {
  language: string;
  onLanguageChange: (lang: string) => void;
}

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    // If section doesn't exist, scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

export function Header({ language, onLanguageChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <button 
          onClick={() => scrollToSection('hero')}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-2xl gradient-hero flex items-center justify-center shadow-lg shadow-primary/25 transition-transform duration-300 group-hover:scale-105">
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
        </button>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => scrollToSection('hero')}
            className="text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            <Home className="w-4 h-4 mr-1.5" />
            Home
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => scrollToSection('categories')}
            className="text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            <HelpCircle className="w-4 h-4 mr-1.5" />
            Schemes
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => scrollToSection('footer')}
            className="text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            <Mail className="w-4 h-4 mr-1.5" />
            Contact
          </Button>
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-1 md:gap-2">
          <ThemeToggle />
          <LanguageSelector selected={language} onSelect={onLanguageChange} />
        </div>
      </div>
    </header>
  );
}