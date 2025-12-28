import { Button } from "@/components/ui/button";
import { Sprout, GraduationCap, Heart, Home, Users, Briefcase } from "lucide-react";

const prompts = [
  {
    icon: Sprout,
    label: "Farmer Schemes",
    message: "I am a farmer with small landholding. What schemes am I eligible for?",
  },
  {
    icon: GraduationCap,
    label: "Student Scholarships",
    message: "I am a student from a low-income family. What scholarships can I apply for?",
  },
  {
    icon: Heart,
    label: "Health Insurance",
    message: "What health insurance schemes are available for my family?",
  },
  {
    icon: Home,
    label: "Housing Schemes",
    message: "I need help with housing. What government schemes can help me?",
  },
  {
    icon: Users,
    label: "Women & Child",
    message: "What schemes are available for women and girl children?",
  },
  {
    icon: Briefcase,
    label: "Employment",
    message: "I am unemployed and looking for work. What schemes can help me?",
  },
];

interface QuickPromptsProps {
  onSelect: (message: string) => void;
}

export function QuickPrompts({ onSelect }: QuickPromptsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {prompts.map((prompt) => (
        <Button
          key={prompt.label}
          variant="outline"
          className="h-auto py-4 px-4 flex flex-col gap-2 items-center justify-center text-center hover:border-primary hover:bg-primary/5 transition-all group"
          onClick={() => onSelect(prompt.message)}
        >
          <prompt.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium">{prompt.label}</span>
        </Button>
      ))}
    </div>
  );
}
