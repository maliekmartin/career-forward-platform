"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { demoCoach } from "@/lib/demo-data";

// Message type
export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
}

// Conversation type
export interface Conversation {
  id: string;
  type: "ai" | "coach";
  participant: {
    id: string;
    name: string;
    avatar: string;
    role: string;
    isOnline: boolean;
  };
  messages: Message[];
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
}

// Demo job seeker (current user for job seeker view)
export const currentJobSeeker = {
  id: "job-seeker-1",
  firstName: "Marcus",
  lastName: "Thompson",
  email: "marcus.thompson@email.com",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
};

// Career Forward AI Assistant
export const careerForwardAI = {
  id: "career-forward-ai",
  name: "Career Forward AI",
  avatar: "/career-forward-ai-avatar.png", // We'll use a fallback
  role: "AI Career Assistant",
  isOnline: true, // AI is always online
};

// Initial AI messages
const initialAIMessages: Message[] = [
  {
    id: "ai-msg-1",
    senderId: careerForwardAI.id,
    text: "Hey Marcus! 👋 I'm your Career Forward AI assistant. I'm here 24/7 to help with your job search journey.",
    timestamp: "Today, 9:00 AM",
    status: "read",
  },
  {
    id: "ai-msg-2",
    senderId: careerForwardAI.id,
    text: "I can help you with:\n• Resume tips and feedback\n• Interview preparation\n• Job search strategies\n• Career advice\n• Practice mock interviews\n\nWhat would you like to work on today?",
    timestamp: "Today, 9:00 AM",
    status: "read",
  },
];

// Initial coach messages (when connected)
const initialCoachMessages: Message[] = [
  {
    id: "coach-msg-1",
    senderId: demoCoach.id,
    text: "Hi Marcus! How's the job search going?",
    timestamp: "Yesterday, 2:30 PM",
    status: "read",
  },
  {
    id: "coach-msg-2",
    senderId: currentJobSeeker.id,
    text: "Hi Sarah! It's going well. I just submitted 3 more applications this week.",
    timestamp: "Yesterday, 3:15 PM",
    status: "read",
  },
  {
    id: "coach-msg-3",
    senderId: demoCoach.id,
    text: "That's fantastic! I can see your progress in the dashboard. You're really staying consistent.",
    timestamp: "Yesterday, 3:20 PM",
    status: "read",
  },
  {
    id: "coach-msg-4",
    senderId: currentJobSeeker.id,
    text: "Thanks! I'm trying to hit my goal of 10 applications this month.",
    timestamp: "Yesterday, 4:00 PM",
    status: "read",
  },
  {
    id: "coach-msg-5",
    senderId: demoCoach.id,
    text: "Great progress on your applications! Let's chat about interview prep.",
    timestamp: "2 min ago",
    status: "delivered",
  },
];

// Context type
interface JobSeekerMessagesContextType {
  conversations: Conversation[];
  totalUnreadCount: number;
  hasConnectedCoach: boolean;
  currentUser: typeof currentJobSeeker;
  sendMessage: (conversationId: string, text: string) => void;
  markAsRead: (conversationId: string) => void;
  getConversation: (conversationId: string) => Conversation | undefined;
}

const JobSeekerMessagesContext = createContext<JobSeekerMessagesContextType | null>(null);

export function useJobSeekerMessages() {
  const context = useContext(JobSeekerMessagesContext);
  if (!context) {
    throw new Error("useJobSeekerMessages must be used within JobSeekerMessagesProvider");
  }
  return context;
}

export function JobSeekerMessagesProvider({ children }: { children: ReactNode }) {
  // For demo: job seeker has a connected coach
  const hasConnectedCoach = true;

  // Initialize conversations
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const convos: Conversation[] = [
      // AI Assistant - always available
      {
        id: "ai-conversation",
        type: "ai",
        participant: {
          id: careerForwardAI.id,
          name: careerForwardAI.name,
          avatar: careerForwardAI.avatar,
          role: careerForwardAI.role,
          isOnline: true,
        },
        messages: initialAIMessages,
        unreadCount: 0,
        lastMessage: initialAIMessages[initialAIMessages.length - 1].text,
        lastMessageTime: initialAIMessages[initialAIMessages.length - 1].timestamp,
      },
    ];

    // Add coach conversation if connected
    if (hasConnectedCoach) {
      convos.push({
        id: "coach-conversation",
        type: "coach",
        participant: {
          id: demoCoach.id,
          name: `${demoCoach.firstName} ${demoCoach.lastName}`,
          avatar: demoCoach.avatar,
          role: "Career Coach",
          isOnline: true,
        },
        messages: initialCoachMessages,
        unreadCount: 1, // Coach has one unread message
        lastMessage: initialCoachMessages[initialCoachMessages.length - 1].text,
        lastMessageTime: initialCoachMessages[initialCoachMessages.length - 1].timestamp,
      });
    }

    return convos;
  });

  // Total unread count across all conversations
  const totalUnreadCount = conversations.reduce((acc, conv) => acc + conv.unreadCount, 0);

  // Get a specific conversation
  const getConversation = useCallback((conversationId: string) => {
    return conversations.find(c => c.id === conversationId);
  }, [conversations]);

  // Send a message to a conversation
  const sendMessage = useCallback((conversationId: string, text: string) => {
    if (!text.trim()) return;

    const now = new Date();
    const timestamp = `Today, ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentJobSeeker.id,
      text: text.trim(),
      timestamp,
      status: "sent",
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const updatedMessages = [...conv.messages, newMessage];
        return {
          ...conv,
          messages: updatedMessages,
          lastMessage: text.trim(),
          lastMessageTime: timestamp,
        };
      }
      return conv;
    }));

    // Simulate delivery
    setTimeout(() => {
      setConversations(prev => prev.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: conv.messages.map(m =>
              m.id === newMessage.id ? { ...m, status: "delivered" as const } : m
            ),
          };
        }
        return conv;
      }));
    }, 500);

    // If AI conversation, simulate AI response
    if (conversationId === "ai-conversation") {
      setTimeout(() => {
        const aiResponses = [
          "That's a great question! Let me help you with that.",
          "I'd be happy to assist you with your job search. Can you tell me more about what you're looking for?",
          "Based on your profile, here are some suggestions that might help...",
          "That's excellent progress! Keep up the momentum. Would you like me to help you prepare for interviews?",
          "I understand. Job searching can be challenging. Let's break this down into manageable steps.",
        ];
        const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];

        const aiMessage: Message = {
          id: `ai-msg-${Date.now()}`,
          senderId: careerForwardAI.id,
          text: randomResponse,
          timestamp: `Today, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
          status: "read",
        };

        setConversations(prev => prev.map(conv => {
          if (conv.id === "ai-conversation") {
            return {
              ...conv,
              messages: [...conv.messages, aiMessage],
              lastMessage: randomResponse,
              lastMessageTime: aiMessage.timestamp,
            };
          }
          return conv;
        }));
      }, 1500);
    }
  }, []);

  // Mark conversation as read
  const markAsRead = useCallback((conversationId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          unreadCount: 0,
          messages: conv.messages.map(m => ({ ...m, status: "read" as const })),
        };
      }
      return conv;
    }));
  }, []);

  return (
    <JobSeekerMessagesContext.Provider
      value={{
        conversations,
        totalUnreadCount,
        hasConnectedCoach,
        currentUser: currentJobSeeker,
        sendMessage,
        markAsRead,
        getConversation,
      }}
    >
      {children}
    </JobSeekerMessagesContext.Provider>
  );
}
