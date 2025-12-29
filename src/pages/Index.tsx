import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { QuickPrompts } from "@/components/QuickPrompts";
import { TrustBadges } from "@/components/TrustBadges";
import { useChat } from "@/hooks/useChat";
import { Button } from "@/components/ui/button";
import { RotateCcw, MessageCircle } from "lucide-react";
import heroImage from "@/assets/hero-welfare.jpg";

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
  const { messages, isLoading, sendMessage, clearChat } = useChat(language);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const content = welcomeMessages[language] || welcomeMessages.en;

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
          <section className="relative overflow-hidden py-8 md:py-12">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src={heroImage}
                alt="Indian citizens receiving government welfare support"
                className="w-full h-full object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
            </div>

            <div className="container relative z-10">
              <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
                {/* Main Heading */}
                <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
                  {content.title}
                </h2>

                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                  {content.subtitle}
                </p>

                {/* Trust Badges */}
                <div className="pt-4">
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
              <div className="py-6 space-y-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <div className="flex items-center gap-2 justify-center text-muted-foreground">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Popular Categories</span>
                </div>
                <QuickPrompts onSelect={handleQuickPrompt} />
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
