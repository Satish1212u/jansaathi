import { FileText, Users, IndianRupee, Building2 } from "lucide-react";

const stats = [
  {
    icon: FileText,
    value: "500+",
    label: "Government Schemes",
    description: "Central & State",
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: Users,
    value: "10L+",
    label: "Citizens Helped",
    description: "Across India",
    color: "from-teal-500 to-emerald-500",
  },
  {
    icon: IndianRupee,
    value: "₹50Cr+",
    label: "Benefits Unlocked",
    description: "For beneficiaries",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Building2,
    value: "28",
    label: "States Covered",
    description: "Pan-India reach",
    color: "from-purple-500 to-pink-500",
  },
];

export function Statistics() {
  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <div className="glass rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center group"
              >
                {/* Icon */}
                <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg mb-4 transition-transform duration-300 group-hover:scale-110`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                
                {/* Value */}
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                  {stat.value}
                </div>
                
                {/* Label */}
                <div className="font-medium text-foreground text-sm mb-1">
                  {stat.label}
                </div>
                
                {/* Description */}
                <div className="text-xs text-muted-foreground">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}