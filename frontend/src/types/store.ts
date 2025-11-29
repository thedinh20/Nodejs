import type { Socket } from "socket.io-client";
import type { Conversation, Message } from "./chat";
import type { Friend, User } from "./user";

export interface AuthState {
    accessToken: string | null;
    user: User | null;
    loading: boolean;

    setAccessToken: (token: string | null) => void;

    clearState: () => void;

    signUp: (
        username: string, 
        password: string, 
        email: string, 
        firstName: string, 
        lastName: string
    ) => Promise<void>;

    signIn: (
        username: string, 
        password: string
    ) => Promise<void>;

    signOut: () => Promise<void>;
    fetchMe: () => Promise<void>;
    refresh: () => Promise<void>;
}

export interface ThemeState {
    isDark: boolean;
    toggleTheme: () => void;
    setTheme: (dark: boolean) => void;
}

export interface ChatState {
    conversations: Conversation[];
    messages: Record<string, {
        items: Message[];
        hasMore: boolean; // infinite scroll
        nextCursor: string | null; // phan trang
    }>; // key = conversationId, value = messages[]
    activeConversationId: string | null;
    convoLoading: boolean;
    messageLoading: boolean;
    reset: () => void;
    setActiveConversation: (id: string | null) => void;
    fetchConversations: () => Promise<void>;
    fetchMessages: (conversationId: string) => Promise<void>;
    sendDirectMessage: (
        recipientId: string,
        content: string,
        imgUrl?: string
    ) => Promise<void>;
    sendGroupMessage: (
        recipientId: string,
        content: string,
        imgUrl?: string
    ) => Promise<void>;

    // add message
    addMessage: (message: Message) => Promise<void>;
    // update convo 
    updateConversation: (Conversation: Conversation) => void;
    
}

export interface SocketState {
    socket: Socket | null;
    onlineUsers: string[];
    connectSocket: () => void;
    disconnectSocket: () => void;
}