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

const AddFriendModal = () => {
  
  return (
    <Dialog>
      <form>
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
            <div className="grid gap-3">
              {/* <Label htmlFor="name-1">Tên</Label> */}
              <Input id="name-1" name="name" placeholder="Go ten user vao day... " />
            </div>
            {/* <div className="grid gap-3">
              <Label htmlFor="username-1">Username</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </div> */}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogTrigger>
              <Button type="submit">Thêm</Button>
            </DialogTrigger>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
    
  )
}

export default AddFriendModal 

