import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिंदी" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
  { code: "or", label: "Odia", native: "ଓଡ଼ିଆ" },
];

interface LanguageSelectorProps {
  selected: string;
  onSelect: (code: string) => void;
}

export function LanguageSelector({ selected, onSelect }: LanguageSelectorProps) {
  const selectedLanguage = languages.find((lang) => lang.code === selected) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-background/50 border-border/50 hover:bg-background hover:border-primary/50"
        >
          <Languages className="w-4 h-4" />
          <span className="hidden sm:inline">{selectedLanguage.native}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => onSelect(lang.code)}
            className={
              selected === lang.code
                ? "bg-primary/10 text-primary font-medium"
                : ""
            }
          >
            <span className="flex-1">{lang.native}</span>
            <span className="text-xs text-muted-foreground">{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}