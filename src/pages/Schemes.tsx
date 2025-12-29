import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SchemeFilters } from "@/components/schemes/SchemeFilters";
import { SchemeCard } from "@/components/schemes/SchemeCard";
import { SchemeSearch } from "@/components/schemes/SchemeSearch";
import { Loader2, FileSearch } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Scheme = Tables<"schemes">;

export interface SchemeFiltersState {
  search: string;
  category: string;
  state: string;
  sector: string;
  gender: string;
  maxIncome: string;
  ageRange: [number, number];
}

const initialFilters: SchemeFiltersState = {
  search: "",
  category: "",
  state: "",
  sector: "",
  gender: "",
  maxIncome: "",
  ageRange: [0, 100],
};

export default function Schemes() {
  const [filters, setFilters] = useState<SchemeFiltersState>(initialFilters);

  const { data: schemes, isLoading, error } = useQuery({
    queryKey: ["schemes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schemes")
        .select("*")
        .eq("is_active", true)
        .order("priority_score", { ascending: false });
      
      if (error) throw error;
      return data as Scheme[];
    },
  });

  const filteredSchemes = useMemo(() => {
    if (!schemes) return [];

    return schemes.filter((scheme) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          scheme.scheme_name.toLowerCase().includes(searchLower) ||
          scheme.benefits.toLowerCase().includes(searchLower) ||
          scheme.sector.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.category && scheme.category) {
        if (!scheme.category.includes(filters.category)) return false;
      }

      // State filter
      if (filters.state) {
        if (scheme.state !== filters.state && scheme.level !== "Central") return false;
      }

      // Sector filter
      if (filters.sector) {
        if (scheme.sector !== filters.sector) return false;
      }

      // Gender filter
      if (filters.gender) {
        if (scheme.gender && scheme.gender !== "All" && scheme.gender !== filters.gender) return false;
      }

      // Income filter
      if (filters.maxIncome) {
        const incomeLimit = parseInt(filters.maxIncome);
        if (scheme.max_income && scheme.max_income < incomeLimit) return false;
      }

      // Age filter
      if (filters.ageRange[0] > 0 || filters.ageRange[1] < 100) {
        const [minAge, maxAge] = filters.ageRange;
        if (scheme.min_age && scheme.min_age > maxAge) return false;
        if (scheme.max_age && scheme.max_age < minAge) return false;
      }

      return true;
    });
  }, [schemes, filters]);

  const uniqueCategories = useMemo(() => {
    if (!schemes) return [];
    const categories = new Set<string>();
    schemes.forEach((s) => s.category?.forEach((c) => categories.add(c)));
    return Array.from(categories).sort();
  }, [schemes]);

  const uniqueStates = useMemo(() => {
    if (!schemes) return [];
    const states = new Set<string>();
    schemes.forEach((s) => s.state && states.add(s.state));
    return Array.from(states).sort();
  }, [schemes]);

  const uniqueSectors = useMemo(() => {
    if (!schemes) return [];
    const sectors = new Set<string>();
    schemes.forEach((s) => sectors.add(s.sector));
    return Array.from(sectors).sort();
  }, [schemes]);

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold font-heading gradient-text">
              Explore Welfare Schemes
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Search and filter through government welfare schemes to find the ones you're eligible for.
            </p>
          </div>

          {/* Search Bar */}
          <SchemeSearch 
            value={filters.search}
            onChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
          />

          {/* Filters */}
          <SchemeFilters
            filters={filters}
            setFilters={setFilters}
            categories={uniqueCategories}
            states={uniqueStates}
            sectors={uniqueSectors}
            onReset={handleResetFilters}
          />

          {/* Results */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {isLoading ? "Loading..." : `${filteredSchemes.length} schemes found`}
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-destructive">Failed to load schemes. Please try again.</p>
              </div>
            ) : filteredSchemes.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <FileSearch className="w-16 h-16 mx-auto text-muted-foreground/50" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">No schemes found</p>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your filters or search terms.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredSchemes.map((scheme) => (
                  <SchemeCard key={scheme.id} scheme={scheme} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
