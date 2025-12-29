import { useState, useEffect, useCallback } from "react";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
};

const STORAGE_KEY = "jansaathi_chat_history";
const MAX_CONVERSATIONS = 20;

// Generate a unique ID
const generateId = () => `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Generate a title from the first user message
const generateTitle = (messages: Message[]): string => {
  const firstUserMessage = messages.find(m => m.role === "user");
  if (!firstUserMessage) return "New Conversation";
  
  const content = firstUserMessage.content;
  // Truncate to first 40 characters
  return content.length > 40 ? content.substring(0, 40) + "..." : content;
};

export function useChatHistory() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Load conversations from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Conversation[];
        setConversations(parsed);
        // Set the most recent conversation as active if exists
        if (parsed.length > 0) {
          setActiveConversationId(parsed[0].id);
        }
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  }, []);

  // Save conversations to localStorage whenever they change
  const saveConversations = useCallback((convs: Conversation[]) => {
    try {
      // Keep only the most recent conversations
      const toSave = convs.slice(0, MAX_CONVERSATIONS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (error) {
      console.error("Error saving chat history:", error);
    }
  }, []);

  // Get the active conversation
  const activeConversation = conversations.find(c => c.id === activeConversationId) || null;

  // Create a new conversation
  const createConversation = useCallback((): string => {
    const newConversation: Conversation = {
      id: generateId(),
      title: "New Conversation",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    setConversations(prev => {
      const updated = [newConversation, ...prev];
      saveConversations(updated);
      return updated;
    });
    
    setActiveConversationId(newConversation.id);
    return newConversation.id;
  }, [saveConversations]);

  // Update messages in the active conversation
  const updateMessages = useCallback((messages: Message[]) => {
    if (!activeConversationId) return;

    setConversations(prev => {
      const updated = prev.map(conv => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            messages,
            title: messages.length > 0 ? generateTitle(messages) : conv.title,
            updatedAt: Date.now(),
          };
        }
        return conv;
      });
      
      // Sort by most recent
      updated.sort((a, b) => b.updatedAt - a.updatedAt);
      saveConversations(updated);
      return updated;
    });
  }, [activeConversationId, saveConversations]);

  // Switch to a different conversation
  const switchConversation = useCallback((conversationId: string) => {
    setActiveConversationId(conversationId);
  }, []);

  // Delete a conversation
  const deleteConversation = useCallback((conversationId: string) => {
    setConversations(prev => {
      const updated = prev.filter(c => c.id !== conversationId);
      saveConversations(updated);
      
      // If we deleted the active conversation, switch to the next one
      if (conversationId === activeConversationId) {
        setActiveConversationId(updated.length > 0 ? updated[0].id : null);
      }
      
      return updated;
    });
  }, [activeConversationId, saveConversations]);

  // Clear all history
  const clearAllHistory = useCallback(() => {
    setConversations([]);
    setActiveConversationId(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    conversations,
    activeConversation,
    activeConversationId,
    createConversation,
    updateMessages,
    switchConversation,
    deleteConversation,
    clearAllHistory,
  };
}
