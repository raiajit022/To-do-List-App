import { Star } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export default function TaskList() {
  const tasks = [
    {
      title: "Promotion banner",
      category: "GoPay",
      emoji: "👨‍💼",
      date: "Today",
      count: "0 of 4",
      starred: true,
    },
    {
      title: "Daily workout",
      category: "Personal",
      emoji: "🏃",
      date: "Today",
      starred: false,
    },
    {
      title: "Make Dribbble shoot",
      category: "Kretya Studio",
      emoji: "🏀",
      date: "Wednesday, Dec 28",
      starred: true,
    },
    {
      title: "Announcement of Kretya Design Challenge #1",
      category: "Kretya Studio",
      emoji: "📅",
      date: "Wednesday, Dec 28",
      starred: true,
    },
    {
      title: "Buy LED Strips",
      category: "Personal",
      emoji: "💡",
      date: "Thursday, Dec 29",
      starred: false,
    },
    {
      title: "Pull to refresh at promo discovery",
      category: "GoPay",
      emoji: "📱",
      date: "Friday, Dec 30",
      starred: false,
    },
    {
      title: "Edit video for social media",
      category: "Content Dump",
      emoji: "🎥",
      date: "Friday, Dec 30",
      starred: false,
    },
    {
      title: "Make mood-board for new office interior",
      category: "Content Dump",
      emoji: "🎨",
      date: "Friday, Dec 30",
      starred: false,
    },
  ]

  return (
    <div className="space-y-2">
      {tasks.map((task, i) => (
        <div key={i} className="flex items-center gap-4 rounded-lg border p-4 hover:bg-slate-50 bg-white">
          <Checkbox className="rounded-sm" />
          <div className="flex-1 min-w-0">
            <div className="font-medium flex items-center gap-2">
              <span className="text-xl">{task.emoji}</span>
              <span className="truncate">{task.title}</span>
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              {task.category} {task.count && `• ${task.count}`} • {task.date}
            </div>
          </div>
          {task.starred && <Star className="h-5 w-5 text-blue-500 fill-blue-500 flex-shrink-0" />}
        </div>
      ))}
    </div>
  )
}

