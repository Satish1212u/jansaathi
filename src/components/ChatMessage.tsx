import { cn } from "@/lib/utils";
import { User, Sparkles } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export function ChatMessage({ role, content, isStreaming }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 animate-fade-in",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center shadow-sm",
          isUser ? "gradient-hero" : "bg-secondary"
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Sparkles className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Message Bubble */}
      <div
        className={cn(
          "max-w-[85%] md:max-w-[75%] px-4 py-3 rounded-2xl",
          isUser
            ? "glass rounded-tr-md"
            : "bg-card border border-border/50 rounded-tl-md shadow-sm"
        )}
      >
        <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
          {content}
          {isStreaming && (
            <span className="inline-block w-1.5 h-4 ml-1 bg-primary rounded-full animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
}