import { MessageCircle } from "lucide-react"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { getAllFriends } from '@/services/friendService';
import { chatService } from '@/services/chatService';
import { useChatStore } from '@/stores/useChatStroe';
import { toast } from 'sonner';
import type { Friend } from '@/types/user';

const CreateNewChat = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [open, setOpen] = useState(false);
  const { fetchConversations, setActiveConversation } = useChatStore();

  useEffect(() => {
    if (!friends.length) {
      setLoading(true);
      getAllFriends().then(f => setFriends(f)).finally(() => setLoading(false));
    }
  }, []);

  const handleSend = async () => {
    if (!selectedFriend || !message.trim()) return;
    setSending(true);
    try {
      const msg = await chatService.sendDirectMessage(selectedFriend._id, message);
      await fetchConversations();
      setActiveConversation(msg.conversationId);
      setMessage("");
      setSelectedFriend(null);
      setOpen(false); // Đóng modal ngay khi gửi thành công
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Gửi tin nhắn thất bại!');
    } finally {
      setSending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <Button className="w-full">
            <MessageCircle/>
              <>Tạo tin nhắn mới</>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Danh sách bạn bè</DialogTitle>
            <DialogDescription>
              {/* Có thể thêm mô tả ở đây */}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            {loading ? (
              <div className="text-center text-muted-foreground">Đang tải...</div>
            ) : friends.length === 0 ? (
              <div className="text-center text-muted-foreground">Bạn chưa có bạn bè nào.</div>
            ) : (
              <ul className="flex flex-col gap-1 max-h-64 overflow-y-auto overflow-x-hidden p-1 border rounded bg-background">
                {friends.map(friend => (
                  <li
                    key={friend._id}
                    className={`flex items-center gap-2 p-1 py-2 cursor-pointer rounded transition ${selectedFriend?._id === friend._id ? 'bg-primary/10 ring-2 ring-primary' : 'hover:bg-muted'}`}
                    onClick={() => setSelectedFriend(friend)}
                  >
                    {friend.avatarUrl ? (
                      <img src={friend.avatarUrl} alt={friend.displayName} className="w-8 h-8 rounded-full object-cover bg-muted" />
                    ) : (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-white font-bold uppercase">
                        {friend.displayName?.charAt(0) || friend.username?.charAt(0) || '?'}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium leading-tight">{friend.displayName}</span>
                      <span className="text-xs text-muted-foreground leading-tight">{friend.username}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {selectedFriend && (
              <div className="flex flex-col gap-2 mt-4">
                <div className="font-semibold">Nhắn cho <span className="text-primary">{selectedFriend.displayName}</span></div>
                <input
                  className="border border-input rounded px-3 py-2 h-11 outline-none focus:ring-2 focus:ring-primary bg-background"
                  placeholder="Soạn tin nhắn..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  disabled={sending}
                />
                <Button
                  type="button"
                  onClick={handleSend}
                  disabled={sending || !message.trim()}
                >{sending ? 'Đang gửi...' : 'Gửi'}</Button>
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            {/* <Button type="submit">Save changes</Button> */}
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>    
  )
}

export default CreateNewChat