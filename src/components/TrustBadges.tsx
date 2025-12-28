import { Shield, CheckCircle, Lock } from "lucide-react";

export function TrustBadges() {
  const badges = [
    {
      icon: Shield,
      label: "Official Sources Only",
      description: "Data from myScheme.gov.in",
    },
    {
      icon: Lock,
      label: "Privacy Protected",
      description: "We never ask for sensitive details",
    },
    {
      icon: CheckCircle,
      label: "Verified Information",
      description: "Updated government data",
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-8">
      {badges.map((badge) => (
        <div
          key={badge.label}
          className="flex items-center gap-2 text-muted-foreground"
        >
          <badge.icon className="w-4 h-4 text-secondary" />
          <span className="text-xs md:text-sm font-medium">{badge.label}</span>
        </div>
      ))}
    </div>
  );
}
