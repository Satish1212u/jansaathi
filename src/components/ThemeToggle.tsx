import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative w-10 h-10 rounded-full bg-muted/50"
      >
        <Sun className="h-5 w-5 text-muted-foreground" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative w-10 h-10 rounded-full bg-muted/50 hover:bg-muted transition-all duration-300 hover:scale-105 active:scale-95 group overflow-hidden"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Sun className={`h-5 w-5 absolute transition-all duration-500 ${
        theme === "dark" 
          ? "rotate-0 scale-100 text-warning" 
          : "rotate-90 scale-0 text-warning"
      }`} />
      <Moon className={`h-5 w-5 absolute transition-all duration-500 ${
        theme === "dark" 
          ? "-rotate-90 scale-0 text-primary" 
          : "rotate-0 scale-100 text-primary"
      }`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
