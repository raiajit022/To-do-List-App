"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Star, Pencil, Trash2 } from "lucide-react"
import type { Task } from "@/lib/tasks"

interface TaskItemProps {
  task: Task
  onComplete: (completed: boolean) => void
  onStar: (starred: boolean) => void
  onDelete: () => void
  onEdit: (title: string) => void
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
    if (isEditing && editedTitle.trim() !== task.title) {
      onEdit(editedTitle.trim())
    }
    setIsEditing(!isEditing)
  }

  return (
    <div className="group flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm hover:shadow">
      <Checkbox
        checked={task.is_completed}
        onCheckedChange={onComplete}
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
            <span className={task.is_completed ? 'line-through text-gray-400' : ''}>
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
          onClick={onDelete}
          className="text-red-500 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onStar(!task.is_starred)}
          className={task.is_starred ? 'text-yellow-400' : 'text-gray-400'}
        >
          <Star className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
} 