import { Shield, CheckCircle, Lock } from "lucide-react";

export function TrustBadges() {
  const badges = [
    {
      icon: Shield,
      label: "Official Sources Only",
      color: "text-primary",
    },
    {
      icon: Lock,
      label: "Privacy Protected",
      color: "text-secondary",
    },
    {
      icon: CheckCircle,
      label: "Verified Information",
      color: "text-primary",
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-6 md:gap-10">
      {badges.map((badge) => (
        <div
          key={badge.label}
          className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-card border border-border shadow-sm"
        >
          <badge.icon className={`w-4 h-4 ${badge.color}`} />
          <span className="text-xs md:text-sm font-medium text-foreground">{badge.label}</span>
        </div>
      ))}
    </div>
  );
}
