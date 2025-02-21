"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Star, Pencil, Trash2 } from "lucide-react"

interface Task {
  id: string
  title: string
  tag: string
  date: string
  time: string
  isStarred: boolean
  isCompleted: boolean
}

interface TaskItemProps {
  task: Task
  onComplete: (id: string) => void
  onStar: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, newTitle: string) => void
}

export function TaskItem({
  task,
  onComplete,
  onStar,
  onDelete,
  onEdit,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title)

  const handleEdit = () => {
    if (isEditing) {
      onEdit(task.id, editedTitle)
    }
    setIsEditing(!isEditing)
  }

  return (
    <div className="group flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm hover:shadow">
      <Checkbox
        checked={task.isCompleted}
        onCheckedChange={() => onComplete(task.id)}
      />
      <div className="flex-1">
        {isEditing ? (
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="h-7"
          />
        ) : (
          <div className="flex items-center space-x-2">
            <span className={task.isCompleted ? 'line-through text-gray-400' : ''}>
              {task.title}
            </span>
            <span className="text-xs text-gray-400">• {task.tag}</span>
          </div>
        )}
        <div className="text-xs text-gray-400">
          {task.date} {task.time && `at ${task.time}`}
        </div>
      </div>
      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEdit}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(task.id)}
          className="text-red-500 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onStar(task.id)}
          className={task.isStarred ? 'text-yellow-400' : 'text-gray-400'}
        >
          <Star className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
} 