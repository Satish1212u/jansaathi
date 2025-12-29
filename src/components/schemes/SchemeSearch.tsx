import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SchemeSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function SchemeSearch({ value, onChange }: SchemeSearchProps) {
  return (
    <div className="relative max-w-2xl mx-auto">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search schemes by name, benefits, or sector..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-12 pr-12 h-12 text-base bg-card border-border/50 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/20"
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
          onClick={() => onChange("")}
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
