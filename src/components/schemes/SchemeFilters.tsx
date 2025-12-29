import { Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import type { SchemeFiltersState } from "@/pages/Schemes";

interface SchemeFiltersProps {
  filters: SchemeFiltersState;
  setFilters: React.Dispatch<React.SetStateAction<SchemeFiltersState>>;
  categories: string[];
  states: string[];
  sectors: string[];
  onReset: () => void;
}

const incomeOptions = [
  { value: "", label: "Any Income" },
  { value: "100000", label: "Up to ₹1 Lakh" },
  { value: "250000", label: "Up to ₹2.5 Lakh" },
  { value: "500000", label: "Up to ₹5 Lakh" },
  { value: "1000000", label: "Up to ₹10 Lakh" },
];

const genderOptions = [
  { value: "", label: "Any Gender" },
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "All", label: "All Genders" },
];

export function SchemeFilters({
  filters,
  setFilters,
  categories,
  states,
  sectors,
  onReset,
}: SchemeFiltersProps) {
  const hasActiveFilters =
    filters.category ||
    filters.state ||
    filters.sector ||
    filters.gender ||
    filters.maxIncome ||
    filters.ageRange[0] > 0 ||
    filters.ageRange[1] < 100;

  return (
    <div className="glass rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Filter className="w-4 h-4 text-primary" />
          <span>Filters</span>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Category Filter */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Category</Label>
          <Select
            value={filters.category}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, category: value === "all" ? "" : value }))
            }
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* State Filter */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">State</Label>
          <Select
            value={filters.state}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, state: value === "all" ? "" : value }))
            }
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="All States" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {states.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sector Filter */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Sector</Label>
          <Select
            value={filters.sector}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, sector: value === "all" ? "" : value }))
            }
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="All Sectors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
              {sectors.map((sector) => (
                <SelectItem key={sector} value={sector}>
                  {sector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Gender Filter */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Gender</Label>
          <Select
            value={filters.gender}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, gender: value === "all" ? "" : value }))
            }
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Any Gender" />
            </SelectTrigger>
            <SelectContent>
              {genderOptions.map((opt) => (
                <SelectItem key={opt.value || "all"} value={opt.value || "all"}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Income Filter */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Max Income</Label>
          <Select
            value={filters.maxIncome}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, maxIncome: value === "all" ? "" : value }))
            }
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Any Income" />
            </SelectTrigger>
            <SelectContent>
              {incomeOptions.map((opt) => (
                <SelectItem key={opt.value || "all"} value={opt.value || "all"}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Age Range Filter */}
        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <Label className="text-xs text-muted-foreground">
            Age: {filters.ageRange[0]} - {filters.ageRange[1]}
          </Label>
          <Slider
            value={filters.ageRange}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, ageRange: value as [number, number] }))
            }
            min={0}
            max={100}
            step={1}
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );
}
