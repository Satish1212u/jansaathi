import { Sprout, GraduationCap, Heart, Home, Users, Briefcase, LucideIcon } from "lucide-react";

const prompts: { icon: LucideIcon; label: string; message: string; color: string }[] = [
  {
    icon: Sprout,
    label: "Farmer Schemes",
    message: "I am a farmer with small landholding. What schemes am I eligible for?",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: GraduationCap,
    label: "Student Scholarships",
    message: "I am a student from a low-income family. What scholarships can I apply for?",
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: Heart,
    label: "Health Insurance",
    message: "What health insurance schemes are available for my family?",
    color: "from-rose-500 to-pink-500",
  },
  {
    icon: Home,
    label: "Housing Schemes",
    message: "I need help with housing. What government schemes can help me?",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Users,
    label: "Women & Child",
    message: "What schemes are available for women and girl children?",
    color: "from-purple-500 to-violet-500",
  },
  {
    icon: Briefcase,
    label: "Employment",
    message: "I am unemployed and looking for work. What schemes can help me?",
    color: "from-cyan-500 to-blue-500",
  },
];

interface QuickPromptsProps {
  onSelect: (message: string) => void;
}

export function QuickPrompts({ onSelect }: QuickPromptsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {prompts.map((prompt, index) => (
        <button
          key={prompt.label}
          onClick={() => onSelect(prompt.message)}
          className="group relative glass rounded-xl p-4 hover:shadow-lg transition-all duration-300 text-left overflow-hidden hover-lift opacity-0 animate-slide-up active:scale-[0.98]"
          style={{ 
            animationDelay: `${0.8 + index * 0.06}s`, 
            animationFillMode: 'forwards' 
          }}
        >
          <div className="flex flex-col items-center gap-3 text-center relative z-10">
            {/* Icon with gradient background */}
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${prompt.color} flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110`}>
              <prompt.icon className="w-6 h-6 text-white" />
            </div>
            
            {/* Label */}
            <span className="text-sm font-medium text-foreground">
              {prompt.label}
            </span>
          </div>

          {/* Hover glow effect */}
          <div className={`absolute inset-0 bg-gradient-to-br ${prompt.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl`} />
        </button>
      ))}
    </div>
  );
}