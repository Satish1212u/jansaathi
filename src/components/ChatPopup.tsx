import { useState, useEffect, useRef } from "react";
import { X, MessageCircle, Minimize2, Maximize2, Sparkles, History, Plus, Trash2, ChevronLeft, LogIn, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/ChatInput";
import { ChatMessage } from "@/components/ChatMessage";
import { useChatWithHistory } from "@/hooks/useChatWithHistory";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
  language?: string;
  onOpenAuth?: (mode: "login" | "register") => void;
}

const welcomeMessage = {
  role: "assistant" as const,
  content: "Namaste! 🙏 I'm your JanSaathi assistant. I can help you discover government welfare schemes you might be eligible for. Tell me about yourself - your age, occupation, income, and location - and I'll find the right schemes for you!"
};

export function ChatPopup({ isOpen, onClose, language = "en", onOpenAuth }: ChatPopupProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const {
    messages,
    isLoading,
    sendMessage,
    startNewConversation,
    conversations,
    activeConversationId,
    switchConversation,
    deleteConversation,
    clearAllHistory,
  } = useChatWithHistory(language);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const userDisplayName = user?.user_metadata?.full_name || user?.email?.split("@")[0];

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
        if (showHistory) {
          setShowHistory(false);
        } else {
          onClose();
        }
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, showHistory]);

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

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleSelectConversation = (id: string) => {
    switchConversation(id);
    setShowHistory(false);
  };

  const handleNewChat = () => {
    startNewConversation();
    setShowHistory(false);
  };

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
        className={cn(
          "fixed z-50 flex flex-col bg-background border border-border shadow-2xl transition-all duration-300 ease-out overflow-hidden",
          isExpanded 
            ? "inset-4 md:inset-8 rounded-2xl" 
            : "bottom-4 right-4 w-[calc(100%-2rem)] sm:w-[400px] h-[550px] sm:h-[600px] rounded-2xl",
          isOpen ? "animate-slide-up opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 gradient-hero rounded-t-2xl flex-shrink-0">
          <div className="flex items-center gap-3">
            {showHistory ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowHistory(false)}
                className="h-9 w-9 text-white/80 hover:text-white hover:bg-white/10"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            ) : (
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-white text-sm">
                {showHistory ? "Chat History" : "JanSaathi"}
              </h3>
              <p className="text-xs text-white/70">
                {showHistory 
                  ? `${conversations.length} conversation${conversations.length !== 1 ? 's' : ''}`
                  : "Your welfare scheme assistant"
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {!showHistory && (
              <>
                {/* Auth Button */}
                {isAuthenticated ? (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/10 mr-1">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                      <User className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs text-white/90 max-w-[60px] truncate hidden sm:inline">
                      {userDisplayName}
                    </span>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onClose();
                      onOpenAuth?.("login");
                    }}
                    className="h-7 px-2 text-xs text-white/80 hover:text-white hover:bg-white/10 gap-1"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Login</span>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowHistory(true)}
                  className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10"
                  title="Chat history"
                >
                  <History className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={startNewConversation}
                  className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10"
                  title="New conversation"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </>
            )}
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

        {/* History Panel */}
        {showHistory ? (
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1">
              <div className="p-3 space-y-2">
                {conversations.length === 0 ? (
                  <div className="text-center py-12">
                    <History className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-sm text-muted-foreground">No conversations yet</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">Start chatting to see your history here</p>
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <div
                      key={conv.id}
                      className={cn(
                        "group flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all",
                        "hover:bg-muted/50 border border-transparent hover:border-border/50",
                        conv.id === activeConversationId && "bg-primary/5 border-primary/20"
                      )}
                      onClick={() => handleSelectConversation(conv.id)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate text-foreground">
                          {conv.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDate(conv.updatedAt)} · {conv.messages.length} messages
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConversation(conv.id);
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
            
            {conversations.length > 0 && (
              <div className="p-3 border-t border-border/50">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={clearAllHistory}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All History
                </Button>
              </div>
            )}
          </div>
        ) : (
          <>
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
              <div className="px-4 pb-2 flex-shrink-0">
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
            <div className="p-4 border-t border-border/50 bg-card/50 flex-shrink-0">
              <ChatInput
                onSend={sendMessage}
                isLoading={isLoading}
                placeholder="Ask about government schemes..."
              />
            </div>
          </>
        )}
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
