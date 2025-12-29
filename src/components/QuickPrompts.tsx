import { Sprout, GraduationCap, Heart, Home, Users, Briefcase, LucideIcon } from "lucide-react";

const prompts: { icon: LucideIcon; label: string; message: string; iconBg: string; iconColor: string; hoverBorder: string }[] = [
  {
    icon: Sprout,
    label: "Farmer Schemes",
    message: "I am a farmer with small landholding. What schemes am I eligible for?",
    iconBg: "bg-emerald-500/10 group-hover:bg-emerald-500",
    iconColor: "text-emerald-600 group-hover:text-white",
    hoverBorder: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
  },
  {
    icon: GraduationCap,
    label: "Student Scholarships",
    message: "I am a student from a low-income family. What scholarships can I apply for?",
    iconBg: "bg-blue-500/10 group-hover:bg-blue-500",
    iconColor: "text-blue-600 group-hover:text-white",
    hoverBorder: "hover:border-blue-500/50 hover:shadow-blue-500/10",
  },
  {
    icon: Heart,
    label: "Health Insurance",
    message: "What health insurance schemes are available for my family?",
    iconBg: "bg-rose-500/10 group-hover:bg-rose-500",
    iconColor: "text-rose-600 group-hover:text-white",
    hoverBorder: "hover:border-rose-500/50 hover:shadow-rose-500/10",
  },
  {
    icon: Home,
    label: "Housing Schemes",
    message: "I need help with housing. What government schemes can help me?",
    iconBg: "bg-amber-500/10 group-hover:bg-amber-500",
    iconColor: "text-amber-600 group-hover:text-white",
    hoverBorder: "hover:border-amber-500/50 hover:shadow-amber-500/10",
  },
  {
    icon: Users,
    label: "Women & Child",
    message: "What schemes are available for women and girl children?",
    iconBg: "bg-purple-500/10 group-hover:bg-purple-500",
    iconColor: "text-purple-600 group-hover:text-white",
    hoverBorder: "hover:border-purple-500/50 hover:shadow-purple-500/10",
  },
  {
    icon: Briefcase,
    label: "Employment",
    message: "I am unemployed and looking for work. What schemes can help me?",
    iconBg: "bg-cyan-500/10 group-hover:bg-cyan-500",
    iconColor: "text-cyan-600 group-hover:text-white",
    hoverBorder: "hover:border-cyan-500/50 hover:shadow-cyan-500/10",
  },
];

interface QuickPromptsProps {
  onSelect: (message: string) => void;
}

export function QuickPrompts({ onSelect }: QuickPromptsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {prompts.map((prompt, index) => (
        <button
          key={prompt.label}
          onClick={() => onSelect(prompt.message)}
          className={`group relative bg-card rounded-2xl p-5 border border-border shadow-sm hover:shadow-xl transition-all duration-500 ease-out text-left overflow-hidden hover:-translate-y-1 active:scale-[0.98] ${prompt.hoverBorder}`}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Shine effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
          </div>
          
          <div className="relative flex flex-col items-center gap-3 text-center">
            {/* Icon with animated background */}
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg ${prompt.iconBg}`}>
              <prompt.icon className={`w-7 h-7 transition-all duration-500 ${prompt.iconColor}`} />
            </div>
            
            {/* Label with underline animation */}
            <span className="text-sm font-semibold text-foreground relative">
              {prompt.label}
              <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-primary group-hover:w-full group-hover:left-0 transition-all duration-300 rounded-full" />
            </span>
          </div>

          {/* Corner accent */}
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary/5 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500" />
        </button>
      ))}
    </div>
  );
}
