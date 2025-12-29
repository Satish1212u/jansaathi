import { ArrowDown, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

interface CTABannerProps {
  onStartChat?: () => void;
}

export function CTABanner({ onStartChat }: CTABannerProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  const scrollToChat = () => {
    const chatInput = document.querySelector('textarea');
    if (chatInput) {
      chatInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      chatInput.focus();
    }
    onStartChat?.();
  };

  return (
    <section ref={ref} className="py-12 md:py-16">
      <div className="container">
        <div className={cn(
          "relative overflow-hidden rounded-3xl gradient-hero p-8 md:p-12 text-center transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
        )}>
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h3 className={cn(
              "text-2xl md:text-3xl lg:text-4xl font-bold text-white transition-all duration-500 delay-200",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              Ready to Discover Your Benefits?
            </h3>
            
            <p className={cn(
              "text-white/80 text-base md:text-lg max-w-lg mx-auto transition-all duration-500 delay-300",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              Start a conversation now and find out which government schemes you and your family are eligible for.
            </p>
            
            <div className={cn(
              "flex flex-col sm:flex-row gap-4 justify-center items-center pt-2 transition-all duration-500 delay-400",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              <Button
                onClick={scrollToChat}
                size="lg"
                className="bg-white text-primary hover:bg-white/90 shadow-xl gap-2 px-8"
              >
                <MessageCircle className="w-5 h-5" />
                Start Chatting Now
              </Button>
              
              <button
                onClick={scrollToChat}
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
              >
                <ArrowDown className="w-4 h-4 animate-bounce" />
                Scroll to chat
              </button>
            </div>
            
            <p className={cn(
              "text-white/60 text-xs pt-4 transition-all duration-500 delay-500",
              isVisible ? "opacity-100" : "opacity-0"
            )}>
              Free to use • No registration required • Available in 11 Indian languages
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}