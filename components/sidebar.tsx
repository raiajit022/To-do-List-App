import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import NavMenu from "./nav-menu"
import TagList from "./tag-list"

export default function Sidebar() {
  return (
    <div className="w-[250px] p-4 flex flex-col gap-4 bg-white">
      <div className="flex items-center gap-2 px-2">
        <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold">TM</div>
        <span className="font-semibold text-blue-600">Task Management</span>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search" className="pl-9" />
      </div>
      <NavMenu />
      <TagList />
    </div>
  )
}

