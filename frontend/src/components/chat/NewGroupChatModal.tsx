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

const NewGroupChatModal = () => {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2 border text-purple-600 bg-white px-4 py-3 rounded-lg hover:bg-purple-50 transition">
            <Users className="w-5 h-5"/>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Thêm Nhóm </DialogTitle>
            <DialogDescription>
              
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Tên Nhóm</Label>
              <Input id="name-1" name="name" placeholder="nhóm " />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Mời thành viên</Label>
              <Input id="username-1" name="username" placeholder="user " />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Tạo nhóm </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
    
  )
}

export default NewGroupChatModal