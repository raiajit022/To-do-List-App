'use client'

import { useEffect, useState, useMemo } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { TaskItem } from "@/components/tasks/task-item"
import { NewTaskDialog } from "@/components/tasks/new-task-dialog"
import { getUserTasks, updateTask, deleteTask, type Task } from "@/lib/tasks"
import { toast } from "sonner"
import { format } from "date-fns"
import { 
  Star, 
  CalendarDays, 
  CheckCircle2, 
  CircleUserRound, 
  LayoutGrid, 
  Zap 
} from "lucide-react"

// Define system tags with their icons
const SYSTEM_TAGS = {
  'My Day': { icon: Zap, color: 'text-blue-500' },
  'Important': { icon: Star, color: 'text-yellow-500' },
  'Personal': { icon: CircleUserRound, color: 'text-purple-500' },
  'All': { icon: LayoutGrid, color: 'text-gray-500' },
  'Completed': { icon: CheckCircle2, color: 'text-green-500' }
} as const

export default function DashboardPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState("My Day")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [customTags, setCustomTags] = useState<string[]>([])

  // Load tasks from Supabase
  useEffect(() => {
    async function loadTasks() {
      if (!user) return
      
      try {
        setIsLoading(true)
        const loadedTasks = await getUserTasks()
        console.log('Loaded tasks:', loadedTasks)
        setTasks(loadedTasks)
        
        // Extract custom tags from loaded tasks
        const newCustomTags = Array.from(
          new Set(
            loadedTasks
              .map(task => task.tag)
              .filter(tag => !(tag in SYSTEM_TAGS))
          )
        )
        setCustomTags(newCustomTags)
      } catch (error) {
        console.error("Error loading tasks:", error)
        toast.error("Failed to load tasks")
      } finally {
        setIsLoading(false)
      }
    }

    loadTasks()
  }, [user])

  // Calculate tag counts
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    
    // System tags
    Object.keys(SYSTEM_TAGS).forEach(tag => {
      if (tag === 'All') {
        counts[tag] = tasks.length
      } else if (tag === 'Important') {
        counts[tag] = tasks.filter(task => task.is_starred).length
      } else if (tag === 'Completed') {
        counts[tag] = tasks.filter(task => task.is_completed).length
      } else if (tag === 'My Day') {
        const today = new Date().toISOString().split('T')[0]
        counts[tag] = tasks.filter(task => task.date === today).length
      } else {
        counts[tag] = tasks.filter(task => task.tag === tag).length
      }
    })
    
    // Custom tags
    customTags.forEach(tag => {
      counts[tag] = tasks.filter(task => task.tag === tag).length
    })
    
    return counts
  }, [tasks, customTags])

  // Filter tasks based on search query, selected tag, and selected date
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase())
      const taskDate = task.date
      const selectedDateStr = selectedDate?.toISOString().split('T')[0]
      const matchesDate = !selectedDate || taskDate === selectedDateStr
      
      let matchesTag = true
      switch (selectedTag) {
        case 'All':
          matchesTag = true
          break
        case 'Important':
          matchesTag = task.is_starred
          break
        case 'Completed':
          matchesTag = task.is_completed
          break
        case 'My Day':
          const today = new Date().toISOString().split('T')[0]
          matchesTag = task.date === today
          break
        default:
          matchesTag = task.tag === selectedTag
      }

      return matchesSearch && matchesTag && matchesDate
    })
  }, [tasks, searchQuery, selectedTag, selectedDate])

  // Task handlers
  const handleTaskComplete = async (task: Task, completed: boolean) => {
    try {
      await updateTask(task.id, { is_completed: completed })
      setTasks(prev => 
        prev.map(t => t.id === task.id ? { ...t, is_completed: completed } : t)
      )
      toast.success(`Task marked as ${completed ? 'completed' : 'incomplete'}`)
    } catch (error) {
      console.error("Error updating task:", error)
      toast.error("Failed to update task")
    }
  }

  const handleTaskStar = async (task: Task, starred: boolean) => {
    try {
      await updateTask(task.id, { is_starred: starred })
      setTasks(prev => 
        prev.map(t => t.id === task.id ? { ...t, is_starred: starred } : t)
      )
      toast.success(`Task ${starred ? 'marked' : 'unmarked'} as important`)
    } catch (error) {
      console.error("Error updating task:", error)
      toast.error("Failed to update task")
    }
  }

  const handleTaskDelete = async (task: Task) => {
    try {
      await deleteTask(task.id)
      setTasks(prev => prev.filter(t => t.id !== task.id))
      toast.success("Task deleted")
    } catch (error) {
      console.error("Error deleting task:", error)
      toast.error("Failed to delete task")
    }
  }

  const handleTaskEdit = async (task: Task, newTitle: string) => {
    try {
      await updateTask(task.id, { title: newTitle })
      setTasks(prev => 
        prev.map(t => t.id === task.id ? { ...t, title: newTitle } : t)
      )
      toast.success("Task updated")
    } catch (error) {
      console.error("Error updating task:", error)
      toast.error("Failed to update task")
    }
  }

  const handleTaskCreated = async () => {
    if (!user) return
    
    try {
      const loadedTasks = await getUserTasks()
      setTasks(loadedTasks)
      
      // Update custom tags
      const newCustomTags = Array.from(
        new Set(
          loadedTasks
            .map(task => task.tag)
            .filter(tag => !(tag in SYSTEM_TAGS))
        )
      )
      setCustomTags(newCustomTags)
    } catch (error) {
      console.error("Error reloading tasks:", error)
      toast.error("Failed to reload tasks")
    }
  }

  if (!user) return null

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 p-4 border-r">
        <NewTaskDialog
          systemTags={Object.keys(SYSTEM_TAGS)}
          customTags={customTags}
          onTaskCreated={handleTaskCreated}
        />
        
        <nav className="mt-8 space-y-1">
          {Object.entries(SYSTEM_TAGS).map(([tag, { icon: Icon, color }]) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "ghost"}
              className={`w-full justify-start ${selectedTag === tag ? 'bg-gray-100' : ''}`}
              onClick={() => setSelectedTag(tag)}
            >
              <Icon className={`mr-2 h-4 w-4 ${color}`} />
              <span className="flex-1 text-left">{tag}</span>
              <span className="ml-auto text-xs text-gray-500">
                {tagCounts[tag] || 0}
              </span>
            </Button>
          ))}

          {customTags.length > 0 && (
            <>
              <div className="my-4 px-3">
                <h3 className="text-sm font-medium text-gray-500">Custom Tags</h3>
              </div>
              {customTags.map(tag => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? "default" : "ghost"}
                  className={`w-full justify-start ${selectedTag === tag ? 'bg-gray-100' : ''}`}
                  onClick={() => setSelectedTag(tag)}
                >
                  <LayoutGrid className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="flex-1 text-left">{tag}</span>
                  <span className="ml-auto text-xs text-gray-500">
                    {tagCounts[tag] || 0}
                  </span>
                </Button>
              ))}
            </>
          )}
        </nav>

        <div className="mt-8">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border bg-white"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              {selectedTag in SYSTEM_TAGS && (
                <div className="mr-2">
                  {(() => {
                    const TagIcon = SYSTEM_TAGS[selectedTag as keyof typeof SYSTEM_TAGS].icon
                    return (
                      <TagIcon 
                        className={`h-6 w-6 ${SYSTEM_TAGS[selectedTag as keyof typeof SYSTEM_TAGS].color}`} 
                      />
                    )
                  })()}
                </div>
              )}
              <h1 className="text-2xl font-bold">{selectedTag}</h1>
            </div>
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading tasks...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No tasks found
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onComplete={(completed) => handleTaskComplete(task, completed)}
                  onStar={(starred) => handleTaskStar(task, starred)}
                  onDelete={() => handleTaskDelete(task)}
                  onEdit={(newTitle) => handleTaskEdit(task, newTitle)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 