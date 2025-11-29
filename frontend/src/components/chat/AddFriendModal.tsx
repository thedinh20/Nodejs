import { Button } from "../ui/button"
import { UserPlus } from "lucide-react"
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
// import { Label } from "@/components/ui/label"
import { useState, useRef } from "react"
import { searchUsers } from "@/services/userService"
import { sendFriendRequest } from '@/services/friendService'
import type { User } from "@/types/user"
import { toast } from "sonner"
import axios from 'axios'
import { useChatStore } from '@/stores/useChatStroe';

const AddFriendModal = () => {
  const [searchKey, setSearchKey] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [greeting, setGreeting] = useState("")
  const [sending, setSending] = useState(false)
  const [open, setOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { fetchFriendRequests } = useChatStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchKey(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!value) {
      setUsers([])
      setShowDropdown(false)
      return
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const result = await searchUsers(value)
        setUsers(result)
        setShowDropdown(true)
      } catch {
        setUsers([])
        setShowDropdown(false)
      } finally {
        setLoading(false)
      }
    }, 400)
  }

  const handleUserSelect = (user: User) => {
    setSelectedUser(user)
    setShowDropdown(false)
    setSearchKey(user.displayName)
  }

  const handleSendRequest = async () => {
    if (!selectedUser) return
    setSending(true)
    try {
      await sendFriendRequest(selectedUser._id, greeting)
      toast.success("Gửi lời mời kết bạn thành công!")
      fetchFriendRequests();
      setOpen(false)
      setTimeout(() => handleDialogClose(), 300)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Gửi lời mời thất bại")
      } else {
        toast.error("Gửi lời mời thất bại")
      }
    } finally {
      setSending(false)
    }
  }

  const handleDialogClose = () => {
    setSelectedUser(null)
    setGreeting("")
    setSearchKey("")
    setUsers([])
    setShowDropdown(false)
    // setOpen(false) // Don't redundantly close modal here
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Remove form wrapper */}
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 border text-purple-600 bg-white px-3 py-2 rounded-lg hover:bg-purple-50 transition">
          <UserPlus className="w-5 h-5"/>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Kết Bạn</DialogTitle>
          <DialogDescription>
            Tìm qua user
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3 relative">
            {/* <Label htmlFor="name-1">Tên</Label> */}
            <Input id="name-1" name="name" placeholder="Go ten user vao day... " value={searchKey} onChange={handleInputChange} autoComplete="off" disabled={!!selectedUser} />
            {showDropdown && (
              <div className="absolute left-0 right-0 top-full z-10 bg-white border rounded shadow mt-1 max-h-60 overflow-auto">
                {loading ? (
                  <div className="p-2 text-center text-gray-500 text-sm">Đang tìm...</div>
                ) : users.length === 0 ? (
                  <div className="p-2 text-center text-gray-500 text-sm">Không tìm thấy người dùng</div>
                ) : (
                  users.map(user => (
                    <div key={user._id} className="p-2 hover:bg-purple-50 cursor-pointer flex items-center gap-2" onClick={() => handleUserSelect(user)}>
                      {/* Optionally show avatar here */}
                      <span className="font-medium">{user.displayName}</span>
                      <span className="text-xs text-gray-500">@{user.username}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          {selectedUser && (
            <div className="grid gap-2">
              <label htmlFor="greeting" className="text-sm font-medium">Gửi lời chào</label>
              <Input id="greeting" name="greeting" placeholder="Nhập lời chào..." value={greeting} onChange={e => setGreeting(e.target.value)} autoFocus />
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button" onClick={handleDialogClose}>Cancel</Button>
          </DialogClose>
          <Button onClick={handleSendRequest} disabled={!selectedUser || sending}>{sending ? 'Đang gửi...' : 'Thêm'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddFriendModal
