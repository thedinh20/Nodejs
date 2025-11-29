import api from "@/lib/axios";
import type { Message, ConversationResponse } from "@/types/chat";

interface FetchMessagesProps {
  message : Message[];
  cursor?: string;
}

const pagelimit = 50;

export const chatService = {
  async fetchConversations(): Promise<ConversationResponse> {
        const res = await api.get('/conversations');
        return res.data;
    },

  async fetchMessages(id: string, cursor?: string): Promise<FetchMessagesProps> {
    const res = await api.get(`/conversations/${id}/messages?limit=${pagelimit}&cursor=${cursor}`);
    return {message: res.data.messages, cursor: res.data.nextCursor  };
  },

  async sendDirectMessage(recipientId: string, content: string = "") {
    const res = await api.post("/messages/direct", {
      recipientId: recipientId, content: content,
    })

    return res.data.message
  },

  async sendGroupMessage(conversationId: string, content: string = "", imgUrl?: string) {
    const res = await api.post("/messages/group", {
      conversationId, content, imgUrl
    });
    return res.data.message;
  }
};