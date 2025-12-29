import { useState, KeyboardEvent, forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";

export interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}

export interface ChatInputHandle {
  focus: () => void;
}

function ChatInputComponent(
  { onSend, isLoading, placeholder, autoFocus }: ChatInputProps,
  ref: React.ForwardedRef<ChatInputHandle>
) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      textareaRef.current?.focus();
    }
  }));

  useEffect(() => {
    if (autoFocus) {
      textareaRef.current?.focus();
    }
  }, [autoFocus]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-2 items-end">
      <Textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || "Tell me about yourself to find eligible schemes..."}
        className="min-h-[48px] max-h-[120px] resize-none bg-background/50 border-border/50 focus:border-primary/50 rounded-xl text-sm"
        disabled={isLoading}
      />
      <Button
        onClick={handleSend}
        disabled={!input.trim() || isLoading}
        size="icon"
        className="h-12 w-12 rounded-xl gradient-hero border-0 shadow-md hover:shadow-lg transition-shadow"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
      </Button>
    </div>
  );
}

export const ChatInput = forwardRef<ChatInputHandle, ChatInputProps>(ChatInputComponent);
ChatInput.displayName = "ChatInput";