import { Users } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useRef } from "react"
import { searchUsers } from '@/services/userService';
import { chatService } from '@/services/chatService';
import { toast } from 'sonner';
import type { User } from '@/types/user';
import { useChatStore } from '@/stores/useChatStroe';

const NewGroupChatModal = () => {
  const [groupName, setGroupName] = useState("");
  const [memberKey, setMemberKey] = useState("");
  const [searching, setSearching] = useState(false);
  const [userOptions, setUserOptions] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const { fetchConversations, setActiveConversation } = useChatStore();

  const handleMemberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMemberKey(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value) {
      setUserOptions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const users = await searchUsers(value);
        // Loại bỏ user đã chọn
        setUserOptions(users.filter(u => !selectedUsers.some(su => su._id === u._id)));
      } catch {
        setUserOptions([]);
      } finally {
        setSearching(false);
      }
    }, 400);
  };

  const handleSelectUser = (user: User) => {
    setSelectedUsers(prev => [...prev, user]);
    setUserOptions([]);
    setMemberKey("");
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(prev => prev.filter(u => u._id !== userId));
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedUsers.length === 0) {
      toast.error("Vui lòng nhập tên nhóm và chọn thành viên!");
      return;
    }
    setCreating(true);
    try {
      const memberIds = selectedUsers.map(u => u._id);
      const conversation = await chatService.createGroupConversation(groupName, memberIds);
      toast.success("Tạo nhóm thành công!");
      setOpen(false);
      setGroupName("");
      setSelectedUsers([]);
      setMemberKey("");
      await fetchConversations();
      setActiveConversation(conversation._id);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Tạo nhóm thất bại!");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2 border text-purple-600 bg-white px-4 py-3 rounded-lg hover:bg-purple-50 transition">
            <Users className="w-5 h-5"/>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Thêm Nhóm </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Tên Nhóm</Label>
              <Input id="name-1" name="name" placeholder="Tên nhóm" value={groupName} onChange={e => setGroupName(e.target.value)} />
            </div>
            <div className="grid gap-3 relative">
              <Label htmlFor="username-1">Mời thành viên</Label>
              <Input id="username-1" name="username" placeholder="Thành viên " value={memberKey} onChange={handleMemberInput} autoComplete="off" />
              {userOptions.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-10 bg-white border rounded shadow mt-1 max-h-60 overflow-auto">
                  {searching ? (
                    <div className="p-2 text-center text-gray-500 text-sm">Đang tìm...</div>
                  ) : userOptions.length === 0 ? (
                    <div className="p-2 text-center text-gray-500 text-sm">Không tìm thấy người dùng</div>
                  ) : (
                    userOptions.map(user => (
                      <div key={user._id} className="p-2 hover:bg-purple-50 cursor-pointer flex items-center gap-2" onClick={() => handleSelectUser(user)}>
                        <span className="font-medium">{user.displayName}</span>
                        <span className="text-xs text-gray-500">@{user.username}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
              {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedUsers.map(user => (
                    <div key={user._id} className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-full text-sm">
                      <span>{user.displayName}</span>
                      <button type="button" className="ml-1 text-red-500 hover:text-red-700" onClick={() => handleRemoveUser(user._id)}>&times;</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>
            <Button type="button" disabled={creating} onClick={handleCreateGroup}>{creating ? 'Đang tạo...' : 'Tạo nhóm'}</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}

export default NewGroupChatModal