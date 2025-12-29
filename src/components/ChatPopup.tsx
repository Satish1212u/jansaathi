import { useState, useEffect, useRef } from "react";
import { X, MessageCircle, Minimize2, Maximize2, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/ChatInput";
import { ChatMessage } from "@/components/ChatMessage";
import { useChat } from "@/hooks/useChat";
import { cn } from "@/lib/utils";

interface ChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
  language?: string;
}

const welcomeMessage = {
  role: "assistant" as const,
  content: "Namaste! 🙏 I'm your JanSaathi assistant. I can help you discover government welfare schemes you might be eligible for. Tell me about yourself - your age, occupation, income, and location - and I'll find the right schemes for you!"
};

export function ChatPopup({ isOpen, onClose, language = "en" }: ChatPopupProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { messages, isLoading, sendMessage, clearChat } = useChat(language);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when popup is open on mobile
  useEffect(() => {
    if (isOpen && isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isExpanded]);

  if (!isOpen) return null;

  const displayMessages = messages.length === 0 ? [welcomeMessage] : messages;

  return (
    <>
      {/* Backdrop for expanded mode */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fade-in"
          onClick={onClose}
        />
      )}
      
      {/* Chat Popup */}
      <div
        ref={containerRef}
        className={cn(
          "fixed z-50 flex flex-col bg-background border border-border shadow-2xl transition-all duration-300 ease-out",
          isExpanded 
            ? "inset-4 md:inset-8 rounded-2xl" 
            : "bottom-4 right-4 w-[calc(100%-2rem)] sm:w-[400px] h-[500px] sm:h-[550px] rounded-2xl",
          isOpen ? "animate-slide-up opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 gradient-hero rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">JanSaathi</h3>
              <p className="text-xs text-white/70">Your welfare scheme assistant</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={clearChat}
              className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10"
              title="New conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10 hidden sm:flex"
              title={isExpanded ? "Minimize" : "Expand"}
            >
              {isExpanded ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10"
              title="Close"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
          {displayMessages.map((message, index) => (
            <ChatMessage
              key={index}
              role={message.role}
              content={message.content}
              isStreaming={
                isLoading &&
                index === displayMessages.length - 1 &&
                message.role === "assistant"
              }
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompts for empty state */}
        {messages.length === 0 && (
          <div className="px-4 pb-2">
            <div className="flex flex-wrap gap-2">
              {[
                "I'm a farmer from UP",
                "Senior citizen benefits",
                "Schemes for women"
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-border/50 bg-card/50">
          <ChatInput
            onSend={sendMessage}
            isLoading={isLoading}
            placeholder="Ask about government schemes..."
          />
        </div>
      </div>
    </>
  );
}

// Floating Action Button Component
interface ChatFABProps {
  onClick: () => void;
  isOpen: boolean;
}

export function ChatFAB({ onClick, isOpen }: ChatFABProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-4 right-4 z-30 w-14 h-14 rounded-full gradient-hero shadow-xl",
        "flex items-center justify-center transition-all duration-300",
        "hover:shadow-glow hover:scale-105 active:scale-95",
        isOpen ? "opacity-0 pointer-events-none scale-75" : "opacity-100 scale-100"
      )}
      aria-label="Open chat"
    >
      <MessageCircle className="w-6 h-6 text-white" />
      
      {/* Pulse animation */}
      <span className="absolute inset-0 rounded-full gradient-hero animate-ping opacity-20" />
    </button>
  );
}
