import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { QuickPrompts } from "@/components/QuickPrompts";
import { TrustBadges } from "@/components/TrustBadges";
import { useChat } from "@/hooks/useChat";
import { Button } from "@/components/ui/button";
import { RotateCcw, Sparkles } from "lucide-react";

const welcomeMessages: Record<string, { title: string; subtitle: string; prompt: string }> = {
  en: {
    title: "Discover Government Schemes Made For You",
    subtitle: "Tell me about yourself — your occupation, age, income, and location — and I'll find welfare schemes you're eligible for.",
    prompt: "Describe your situation or ask about any scheme...",
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
    <div className="min-h-screen flex flex-col">
      <Header language={language} onLanguageChange={setLanguage} />

      <main className="flex-1 flex flex-col">
        {/* Hero Section - Only show when no messages */}
        {messages.length === 0 && (
          <section id="hero" className="relative overflow-hidden py-16 md:py-24">
            {/* Parallax Decorative Elements */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <div 
                className="absolute -top-32 -right-32 w-80 h-80 bg-primary/15 rounded-full blur-3xl animate-fade-in" 
                style={{ 
                  animationDuration: '1s',
                  transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.08}px)` 
                }} 
              />
              <div 
                className="absolute -bottom-32 -left-32 w-80 h-80 bg-secondary/15 rounded-full blur-3xl animate-fade-in" 
                style={{ 
                  animationDelay: '0.2s',
                  animationDuration: '1s',
                  transform: `translate(${scrollY * -0.08}px, ${scrollY * -0.05}px)` 
                }} 
              />
              <div 
                className="absolute top-1/4 right-1/4 w-40 h-40 bg-accent/10 rounded-full blur-2xl animate-float"
                style={{ animationDelay: '0.5s' }}
              />
            </div>

            <div className="container relative z-10">
              <div className="max-w-3xl mx-auto text-center space-y-8">
                {/* Decorative Badge */}
                <div 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium opacity-0 animate-slide-up"
                  style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-foreground">AI-Powered Welfare Discovery</span>
                </div>

                {/* Main Heading */}
                <h2 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight opacity-0 animate-slide-up"
                  style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
                >
                  <span className="gradient-text">
                    {content.title.split(' ').slice(0, 3).join(' ')}
                  </span>
                  <br />
                  <span className="text-foreground">
                    {content.title.split(' ').slice(3).join(' ')}
                  </span>
                </h2>

                <p 
                  className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed opacity-0 animate-slide-up"
                  style={{ animationDelay: '0.35s', animationFillMode: 'forwards' }}
                >
                  {content.subtitle}
                </p>

                {/* Trust Badges */}
                <div 
                  className="pt-4 opacity-0 animate-slide-up"
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
          <div className="container flex-1 flex flex-col max-w-3xl py-4">
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
              <div id="categories" className="py-6 space-y-6">
                <div 
                  className="text-center opacity-0 animate-slide-up"
                  style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
                >
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Quick Start
                  </span>
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
                  className="text-muted-foreground hover:text-foreground gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  New conversation
                </Button>
              </div>
            )}

            {/* Input Area */}
            <div className="sticky bottom-0 glass rounded-2xl p-3 mt-4">
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