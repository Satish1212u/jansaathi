import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { QuickPrompts } from "@/components/QuickPrompts";
import { TrustBadges } from "@/components/TrustBadges";
import { useChat } from "@/hooks/useChat";
import { Button } from "@/components/ui/button";
import { RotateCcw, MessageCircle, Sparkles } from "lucide-react";

const welcomeMessages: Record<string, { title: string; subtitle: string; prompt: string }> = {
  en: {
    title: "Find Government Schemes You Deserve",
    subtitle: "Tell me about yourself — your occupation, age, income, and location — and I'll find welfare schemes you're eligible for.",
    prompt: "Type your message or select a category below...",
  },
  hi: {
    title: "सरकारी योजनाएं खोजें जो आपके हक की हैं",
    subtitle: "मुझे अपने बारे में बताएं — आपका पेशा, उम्र, आय और स्थान — और मैं आपके लिए उपयुक्त कल्याण योजनाएं खोजूंगा।",
    prompt: "अपना संदेश लिखें या नीचे से श्रेणी चुनें...",
  },
  kn: {
    title: "ನಿಮಗೆ ಅರ್ಹವಾದ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ",
    subtitle: "ನಿಮ್ಮ ಬಗ್ಗೆ ಹೇಳಿ — ನಿಮ್ಮ ಉದ್ಯೋಗ, ವಯಸ್ಸು, ಆದಾಯ ಮತ್ತು ಸ್ಥಳ — ಮತ್ತು ನಾನು ನಿಮಗೆ ಅರ್ಹ ಕಲ್ಯಾಣ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕುತ್ತೇನೆ.",
    prompt: "ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಕೆಳಗಿನ ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ...",
  },
};

export default function Index() {
  const [language, setLanguage] = useState("en");
  const [scrollY, setScrollY] = useState(0);
  const { messages, isLoading, sendMessage, clearChat } = useChat(language);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const content = welcomeMessages[language] || welcomeMessages.en;

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleQuickPrompt = (message: string) => {
    sendMessage(message);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header language={language} onLanguageChange={setLanguage} />

      <main className="flex-1 flex flex-col">
        {/* Hero Section - Only show when no messages */}
        {messages.length === 0 && (
          <section id="hero" className="relative overflow-hidden py-12 md:py-20">
            {/* Parallax Decorative Elements */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <div 
                className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-fade-in transition-transform duration-100 ease-out" 
                style={{ 
                  animationDelay: '0.3s', 
                  animationDuration: '1s',
                  transform: `translate(${scrollY * 0.15}px, ${scrollY * 0.1}px)` 
                }} 
              />
              <div 
                className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-fade-in transition-transform duration-100 ease-out" 
                style={{ 
                  animationDelay: '0.5s', 
                  animationDuration: '1s',
                  transform: `translate(${scrollY * -0.12}px, ${scrollY * -0.08}px)` 
                }} 
              />
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/5 to-transparent rounded-full animate-fade-in transition-transform duration-100 ease-out" 
                style={{ 
                  animationDelay: '0.2s', 
                  animationDuration: '1.2s',
                  transform: `translate(calc(-50% + ${scrollY * 0.05}px), calc(-50% + ${scrollY * 0.15}px))` 
                }} 
              />
              {/* Additional floating elements for depth */}
              <div 
                className="absolute top-20 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-2xl animate-fade-in transition-transform duration-100 ease-out"
                style={{ 
                  animationDelay: '0.4s',
                  transform: `translateY(${scrollY * 0.25}px)` 
                }}
              />
              <div 
                className="absolute bottom-32 right-1/4 w-48 h-48 bg-secondary/5 rounded-full blur-2xl animate-fade-in transition-transform duration-100 ease-out"
                style={{ 
                  animationDelay: '0.6s',
                  transform: `translateY(${scrollY * -0.2}px)` 
                }}
              />
              <div 
                className="absolute top-1/3 right-20 w-24 h-24 bg-accent/10 rounded-full blur-xl animate-fade-in transition-transform duration-100 ease-out"
                style={{ 
                  animationDelay: '0.7s',
                  transform: `translate(${scrollY * -0.1}px, ${scrollY * 0.3}px)` 
                }}
              />
            </div>

            <div className="container relative z-10">
              <div className="max-w-3xl mx-auto text-center space-y-8">
                {/* Decorative Badge */}
                <div 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium opacity-0 animate-slide-up"
                  style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
                >
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  AI-Powered Welfare Discovery
                </div>

                {/* Main Heading */}
                <h2 
                  className="text-4xl md:text-6xl font-bold text-foreground leading-tight opacity-0 animate-slide-up"
                  style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
                >
                  <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                    {content.title.split(' ').slice(0, 2).join(' ')}
                  </span>
                  <br />
                  {content.title.split(' ').slice(2).join(' ')}
                </h2>

                <p 
                  className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed opacity-0 animate-slide-up"
                  style={{ animationDelay: '0.35s', animationFillMode: 'forwards' }}
                >
                  {content.subtitle}
                </p>

                {/* Trust Badges */}
                <div 
                  className="pt-6 opacity-0 animate-slide-up"
                  style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
                >
                  <TrustBadges />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Chat Area */}
        <section className="flex-1 flex flex-col">
          <div className="container flex-1 flex flex-col max-w-4xl py-4">
            {/* Messages */}
            {messages.length > 0 ? (
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-2">
                {messages.map((msg, i) => (
                  <ChatMessage
                    key={i}
                    role={msg.role}
                    content={msg.content}
                    isStreaming={isLoading && i === messages.length - 1 && msg.role === "assistant"}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              /* Quick Prompts - Only when no messages */
              <div id="categories" className="py-6 space-y-4">
                <div 
                  className="flex items-center gap-2 justify-center text-muted-foreground opacity-0 animate-slide-up"
                  style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Popular Categories</span>
                </div>
                <div 
                  className="opacity-0 animate-slide-up"
                  style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}
                >
                  <QuickPrompts onSelect={handleQuickPrompt} />
                </div>
              </div>
            )}

            {/* Clear Chat Button */}
            {messages.length > 0 && (
              <div className="flex justify-center mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearChat}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Start New Conversation
                </Button>
              </div>
            )}

            {/* Input Area */}
            <div className="sticky bottom-0 bg-background pt-2 pb-4 border-t border-border/50">
              <ChatInput
                onSend={sendMessage}
                isLoading={isLoading}
                placeholder={content.prompt}
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
