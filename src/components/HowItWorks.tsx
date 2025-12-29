import { MessageSquare, Search, FileCheck } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    number: "01",
    title: "Tell Us About Yourself",
    description: "Share your occupation, age, income, location, and other details through our simple chat interface.",
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: Search,
    number: "02",
    title: "AI Finds Matching Schemes",
    description: "Our AI analyzes 500+ central and state government schemes to find ones you're eligible for.",
    color: "from-teal-500 to-emerald-500",
  },
  {
    icon: FileCheck,
    number: "03",
    title: "Get Complete Guidance",
    description: "Receive detailed information about benefits, required documents, and step-by-step application process.",
    color: "from-orange-500 to-amber-500",
  },
];

export function HowItWorks() {
  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <div className="text-center mb-10">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Simple Process
          </span>
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mt-2">
            How It Works
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative group"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-border to-transparent" />
              )}
              
              <div className="glass rounded-2xl p-6 text-center hover-lift h-full">
                {/* Step number */}
                <div className="text-xs font-bold text-muted-foreground/50 mb-3">
                  STEP {step.number}
                </div>
                
                {/* Icon */}
                <div className={`w-14 h-14 mx-auto rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg mb-4 transition-transform duration-300 group-hover:scale-110`}>
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                
                {/* Title */}
                <h4 className="font-semibold text-foreground mb-2">
                  {step.title}
                </h4>
                
                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}