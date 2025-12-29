import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useChatHistory, Message } from "./useChatHistory";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/welfare-chat`;

export function useChatWithHistory(language: string) {
  const {
    conversations,
    activeConversation,
    activeConversationId,
    createConversation,
    updateMessages,
    switchConversation,
    deleteConversation,
    clearAllHistory,
  } = useChatHistory();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Sync messages with active conversation
  useEffect(() => {
    if (activeConversation) {
      setMessages(activeConversation.messages);
    } else {
      setMessages([]);
    }
  }, [activeConversation]);

  // Update history whenever messages change
  useEffect(() => {
    if (activeConversationId && messages.length > 0) {
      updateMessages(messages);
    }
  }, [messages, activeConversationId, updateMessages]);

  const sendMessage = useCallback(async (input: string) => {
    // Create a new conversation if none exists
    let currentConvId = activeConversationId;
    if (!currentConvId) {
      currentConvId = createConversation();
    }

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    let assistantContent = "";

    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantContent }];
      });
    };

    try {
      const currentMessages = [...messages, userMsg];
      
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: currentMessages,
          language,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 429) {
          toast.error("Too many requests. Please wait a moment and try again.");
        } else if (response.status === 402) {
          toast.error("Service temporarily unavailable. Please try again later.");
        } else {
          toast.error(errorData.error || "Failed to get response. Please try again.");
        }
        
        setMessages((prev) => prev.slice(0, -1));
        setIsLoading(false);
        return;
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) updateAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Handle remaining buffer
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) updateAssistant(content);
          } catch {
            // Ignore
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to connect. Please check your internet connection.");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [messages, language, activeConversationId, createConversation]);

  const clearChat = useCallback(() => {
    setMessages([]);
    createConversation();
  }, [createConversation]);

  const startNewConversation = useCallback(() => {
    createConversation();
    setMessages([]);
  }, [createConversation]);

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    startNewConversation,
    conversations,
    activeConversationId,
    switchConversation,
    deleteConversation,
    clearAllHistory,
  };
}
