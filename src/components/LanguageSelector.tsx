import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const languages = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिंदी" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
];

interface LanguageSelectorProps {
  selected: string;
  onSelect: (code: string) => void;
}

export function LanguageSelector({ selected, onSelect }: LanguageSelectorProps) {
  return (
    <div className="flex gap-2">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant={selected === lang.code ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(lang.code)}
          className={cn(
            "text-sm font-medium transition-all",
            selected === lang.code
              ? "gradient-hero border-0 text-primary-foreground"
              : "hover:border-primary hover:text-primary"
          )}
        >
          {lang.native}
        </Button>
      ))}
    </div>
  );
}
