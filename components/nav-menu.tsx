import { Calendar, Star, User, Box, CheckCircle, Users } from "lucide-react"

export default function NavMenu() {
  const menuItems = [
    { icon: Calendar, label: "My Day", count: 8 },
    { icon: Star, label: "Important" },
    { icon: User, label: "Personal", count: 4 },
    { icon: Box, label: "All", count: 56 },
    { icon: CheckCircle, label: "Completed", count: 10 },
    { icon: Users, label: "Assigned to me" },
  ]

  return (
    <nav className="space-y-1">
      {menuItems.map((item, i) => (
        <a key={i} href="#" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent">
          <item.icon className="h-4 w-4" />
          <span className="flex-1">{item.label}</span>
          {item.count && <span className="text-muted-foreground">{item.count}</span>}
        </a>
      ))}
    </nav>
  )
}

