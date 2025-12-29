import { ExternalLink, MapPin, Users, Briefcase, IndianRupee } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { Tables } from "@/integrations/supabase/types";

type Scheme = Tables<"schemes">;

interface SchemeCardProps {
  scheme: Scheme;
}

export function SchemeCard({ scheme }: SchemeCardProps) {
  const formatIncome = (income: number | null) => {
    if (!income) return null;
    if (income >= 100000) return `₹${(income / 100000).toFixed(income % 100000 === 0 ? 0 : 1)}L`;
    return `₹${income.toLocaleString("en-IN")}`;
  };

  return (
    <Card className="h-full flex flex-col glass border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group">
      <CardHeader className="pb-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <Badge 
            variant="secondary" 
            className="text-xs shrink-0"
          >
            {scheme.level}
          </Badge>
          {scheme.state && (
            <Badge variant="outline" className="text-xs">
              <MapPin className="w-3 h-3 mr-1" />
              {scheme.state}
            </Badge>
          )}
        </div>
        <h3 className="font-semibold text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {scheme.scheme_name}
        </h3>
      </CardHeader>

      <CardContent className="flex-1 space-y-3 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {scheme.benefits}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {scheme.category?.slice(0, 2).map((cat) => (
            <Badge key={cat} variant="outline" className="text-xs bg-primary/5">
              {cat}
            </Badge>
          ))}
          {scheme.category && scheme.category.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{scheme.category.length - 2}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          {scheme.sector && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Briefcase className="w-3.5 h-3.5 text-primary/70" />
              <span className="truncate">{scheme.sector}</span>
            </div>
          )}
          {scheme.gender && scheme.gender !== "All" && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="w-3.5 h-3.5 text-primary/70" />
              <span>{scheme.gender}</span>
            </div>
          )}
          {scheme.max_income && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <IndianRupee className="w-3.5 h-3.5 text-primary/70" />
              <span>≤ {formatIncome(scheme.max_income)}</span>
            </div>
          )}
          {(scheme.min_age || scheme.max_age) && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-3.5 h-3.5 text-primary/70 text-center font-medium">🎂</span>
              <span>
                {scheme.min_age || 0} - {scheme.max_age || "∞"} yrs
              </span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        {scheme.official_portal ? (
          <Button
            variant="outline"
            size="sm"
            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
            asChild
          >
            <a
              href={scheme.official_portal}
              target="_blank"
              rel="noopener noreferrer"
            >
              Apply Now
              <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </a>
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="w-full" disabled>
            No Portal Available
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
