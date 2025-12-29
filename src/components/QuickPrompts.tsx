import { Sprout, GraduationCap, Heart, Home, Users, Briefcase, LucideIcon } from "lucide-react";

const prompts: { icon: LucideIcon; label: string; message: string; color: string }[] = [
  {
    icon: Sprout,
    label: "Farmer Schemes",
    message: "I am a farmer with small landholding. What schemes am I eligible for?",
    color: "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400",
  },
  {
    icon: GraduationCap,
    label: "Student Scholarships",
    message: "I am a student from a low-income family. What scholarships can I apply for?",
    color: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
  },
  {
    icon: Heart,
    label: "Health Insurance",
    message: "What health insurance schemes are available for my family?",
    color: "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400",
  },
  {
    icon: Home,
    label: "Housing Schemes",
    message: "I need help with housing. What government schemes can help me?",
    color: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
  },
  {
    icon: Users,
    label: "Women & Child",
    message: "What schemes are available for women and girl children?",
    color: "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
  },
  {
    icon: Briefcase,
    label: "Employment",
    message: "I am unemployed and looking for work. What schemes can help me?",
    color: "bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400",
  },
];

interface QuickPromptsProps {
  onSelect: (message: string) => void;
}

export function QuickPrompts({ onSelect }: QuickPromptsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {prompts.map((prompt) => (
        <button
          key={prompt.label}
          onClick={() => onSelect(prompt.message)}
          className="group relative bg-card rounded-2xl p-5 border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 text-left overflow-hidden"
        >
          {/* Decorative gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative flex flex-col items-center gap-3 text-center">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${prompt.color} group-hover:scale-110 transition-transform duration-300`}>
              <prompt.icon className="w-6 h-6" />
            </div>
            <span className="text-sm font-semibold text-foreground">{prompt.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
