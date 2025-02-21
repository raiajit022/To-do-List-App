import { Bell, Settings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserProfileProps {
  compact?: boolean
}

export default function UserProfile({ compact = false }: UserProfileProps) {
  if (compact) {
    return (
      <>
        <button className="rounded-full p-2 hover:bg-blue-100 text-blue-600">
          <Bell className="h-5 w-5" />
        </button>
        <button className="rounded-full p-2 hover:bg-blue-100 text-blue-600">
          <Settings className="h-5 w-5" />
        </button>
        <Avatar>
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </>
    )
  }

  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">John Doe</div>
          <div className="text-sm text-muted-foreground">john@example.com</div>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="rounded-full p-2 hover:bg-blue-100 text-blue-600">
          <Bell className="h-5 w-5" />
        </button>
        <button className="rounded-full p-2 hover:bg-blue-100 text-blue-600">
          <Settings className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

