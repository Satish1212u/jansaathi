import { Shield, CheckCircle, Lock } from "lucide-react";

export function TrustBadges() {
  const badges = [
    { icon: Shield, label: "Official Sources" },
    { icon: Lock, label: "Privacy Protected" },
    { icon: CheckCircle, label: "Verified Info" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {badges.map((badge, index) => (
        <div
          key={badge.label}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-muted-foreground opacity-0 animate-scale-in"
          style={{ 
            animationDelay: `${0.5 + index * 0.08}s`, 
            animationFillMode: 'forwards' 
          }}
        >
          <badge.icon className="w-3.5 h-3.5 text-primary" />
          <span>{badge.label}</span>
        </div>
      ))}
    </div>
  );
}