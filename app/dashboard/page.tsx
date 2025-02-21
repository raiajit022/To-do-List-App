'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { 
  PlusCircle, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Zap,
  AlertCircle,
  User,
  LayoutGrid,
  CheckCircle,
  Users
} from 'lucide-react'
import { format } from 'date-fns'
import { NewTaskDialog } from '@/components/tasks/new-task-dialog'
import { TaskItem } from '@/components/tasks/task-item'
import { SidebarItem } from '@/components/sidebar/sidebar-item'

const SYSTEM_TAGS = [
  'My Day',
  'Important',
  'Personal',
  'All',
  'Completed',
  'Assigned to me'
] as const

const favorites = [
  { icon: Zap, label: 'My Day' },
  { icon: AlertCircle, label: 'Important' },
  { icon: User, label: 'Personal' },
  { icon: LayoutGrid, label: 'All' },
  { icon: CheckCircle, label: 'Completed' },
  { icon: Users, label: 'Assigned to me' }
]

interface Task {
  id: string
  title: string
  tag: string
  date: string
  time: string
  isStarred: boolean
  isCompleted: boolean
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [date, setDate] = useState<Date>(new Date())
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTag, setSelectedTag] = useState('My Day')
  const [customTags, setCustomTags] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  // Calculate counts based on actual tasks
  const getTagCount = (tag: string) => {
    switch (tag) {
      case 'My Day':
        return tasks.filter(t => t.tag === 'My Day').length
      case 'Important':
        return tasks.filter(t => t.isStarred).length
      case 'Personal':
        return tasks.filter(t => t.tag === 'Personal').length
      case 'All':
        return tasks.length
      case 'Completed':
        return tasks.filter(t => t.isCompleted).length
      case 'Assigned to me':
        return tasks.filter(t => t.tag === 'Assigned to me').length
      default:
        return tasks.filter(t => t.tag === tag).length
    }
  }

  // Filter tasks based on search query, selected tag, and selected date
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.tag.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTag = 
      selectedTag === 'All' ? true :
      selectedTag === 'Completed' ? task.isCompleted :
      selectedTag === 'Important' ? task.isStarred :
      selectedTag === 'My Day' ? task.tag === 'My Day' :
      selectedTag === 'Personal' ? task.tag === 'Personal' :
      selectedTag === 'Assigned to me' ? task.tag === 'Assigned to me' :
      task.tag === selectedTag

    const taskDate = new Date(task.date)
    const matchesDate = selectedDate ? 
      taskDate.getFullYear() === selectedDate.getFullYear() &&
      taskDate.getMonth() === selectedDate.getMonth() &&
      taskDate.getDate() === selectedDate.getDate() : true

    return matchesSearch && matchesTag && matchesDate
  })

  const handleAddTask = (newTask: any) => {
    console.log('Adding new task:', newTask)
    const task: Task = {
      id: Math.random().toString(),
      title: newTask.title.trim(),
      tag: newTask.tag.trim(),
      date: newTask.date,
      time: newTask.time,
      isStarred: newTask.tag === 'Important',
      isCompleted: false
    }
    
    console.log('Creating task with tag:', task.tag) // Debug log
    setTasks(prevTasks => [...prevTasks, task])
    
    // Only add to custom tags if it's a new tag and not a system tag
    if (newTask.tag && 
        !SYSTEM_TAGS.includes(newTask.tag) && 
        !customTags.includes(newTask.tag)) {
      setCustomTags(prevTags => Array.from(new Set([...prevTags, newTask.tag])))
    }

    // After adding a task, switch to its tag view
    setSelectedTag(task.tag)
  }

  const handleDeleteTag = (tagToDelete: string) => {
    setCustomTags(customTags.filter(tag => tag !== tagToDelete))
    setTasks(tasks.map(task => 
      task.tag === tagToDelete ? { ...task, tag: 'My Day' } : task
    ))
  }

  const handleEditTask = (taskId: string, newTitle: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, title: newTitle } : task
    ))
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  const handleToggleComplete = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
    ))
  }

  const handleToggleStar = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, isStarred: !task.isStarred } : task
    ))
  }

  // Add useEffect to persist tasks to localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  // Add this useEffect to log tasks when they change
  useEffect(() => {
    console.log('Current tasks:', tasks)
    console.log('Selected tag:', selectedTag)
    console.log('Filtered tasks:', filteredTasks)
  }, [tasks, selectedTag, filteredTasks])

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="p-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-semibold">To-Do List</span>
          </div>
        </div>
        <nav className="mt-4 px-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
              Favorites
            </div>
            {favorites.map((item) => (
              <SidebarItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                count={getTagCount(item.label)}
                isActive={item.label === selectedTag}
                onSelect={() => setSelectedTag(item.label)}
              />
            ))}
          </div>
          {customTags.length > 0 && (
            <div className="mt-8 space-y-1">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
                Your own tags
              </div>
              {customTags.map((tag) => (
                <SidebarItem
                  key={tag}
                  icon={LayoutGrid}
                  label={tag}
                  count={getTagCount(tag)}
                  isActive={tag === selectedTag}
                  showDeleteOnHover
                  onDelete={() => handleDeleteTag(tag)}
                  onSelect={() => setSelectedTag(tag)}
                />
              ))}
            </div>
          )}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold">{selectedTag}</h2>
            <p className="text-sm text-gray-500">{format(date, 'MMMM yyyy')}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Input
              type="search"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
              icon={<Search className="h-4 w-4 text-gray-400" />}
            />
            <Button
              onClick={() => setIsNewTaskOpen(true)}
              className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
            >
              <PlusCircle className="h-4 w-4" />
              New task
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {filteredTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onComplete={handleToggleComplete}
              onStar={handleToggleStar}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
            />
          ))}
          {filteredTasks.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No tasks found. Click "New task" to create one.
            </div>
          )}
        </div>

        <NewTaskDialog
          open={isNewTaskOpen}
          onOpenChange={setIsNewTaskOpen}
          onSubmit={handleAddTask}
          existingTags={customTags}
          onAddTag={(tag) => setCustomTags([...customTags, tag])}
        />
      </div>

      {/* Calendar */}
      <div className="w-[400px] border-l bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Calendar</h3>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const prevMonth = new Date(selectedDate)
                prevMonth.setMonth(prevMonth.getMonth() - 1)
                setSelectedDate(prevMonth)
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const nextMonth = new Date(selectedDate)
                nextMonth.setMonth(nextMonth.getMonth() + 1)
                setSelectedDate(nextMonth)
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            if (date) {
              setSelectedDate(date)
              // If there are tasks on this date, update the selected tag to show them
              const tasksOnDate = tasks.filter(task => {
                const taskDate = new Date(task.date)
                return taskDate.getFullYear() === date.getFullYear() &&
                       taskDate.getMonth() === date.getMonth() &&
                       taskDate.getDate() === date.getDate()
              })
              if (tasksOnDate.length > 0) {
                setSelectedTag('All')
              }
            }
          }}
          className="rounded-md border"
        />
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Tasks on selected date:</h4>
          <div className="space-y-2">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <div key={task.id} className="text-sm text-gray-600">
                  • {task.title} at {task.time}
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No tasks scheduled</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 