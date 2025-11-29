import { useRef, useCallback, useEffect } from "react";
import { useChatStore } from "@/stores/useChatStroe";
import ChatWelcomeScreen from "./ChatWelcomeScreen";
import MessageItem from "./MessageItem";


const ChatWindowBody = () => {
  const {activeConversationId, conversations, messages: allMessages, fetchMessages, messageLoading} = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const messages = allMessages[activeConversationId!]?.items ?? [];
  const hasMore = allMessages[activeConversationId!]?.hasMore;
  const selectedConvo = conversations.find((c) => c._id === activeConversationId);

  // Auto scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length, activeConversationId]);

  // Infinity scroll: khi cuộn lên đầu sẽ gọi fetchMessages
  const handleScroll = useCallback(async () => {
    if (!scrollRef.current || messageLoading || !hasMore) return;
    if (scrollRef.current.scrollTop === 0) {
      await fetchMessages(activeConversationId!);
    }
  }, [fetchMessages, activeConversationId, messageLoading, hasMore]);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    node.addEventListener('scroll', handleScroll);
    return () => node.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if(!selectedConvo) {
    return <ChatWelcomeScreen/>;
  }

  if(!messages?.length) {
    return (
        <div className="flex h-full items-center justify-center text-muted-foreground"
        > Chua co tin nhan nao trong cuoc tro chuyen nay</div>
    )
  }

  return (
    <div className="p-4 bg-primary-foreground h-full flex flex-col overflow-hidden">
        <div
          ref={scrollRef}
          className="flex flex-col-reverse overflow-y-auto overflow-x-hidden beatifull-scrollbar h-full"
        >
            {messages.map((message, index) => (
                <MessageItem
                  key={message._id ?? index}
                  message={message}
                  index={index}
                  messages={messages}
                  selectedConvo={selectedConvo}
                  lastMessageStatus="delivered"
                />
            ))}
            {messageLoading && (
              <div className="w-full text-center text-xs text-muted-foreground py-2">Đang tải thêm...</div>
            )}
        </div>
    </div>
  )
}

export default ChatWindowBody