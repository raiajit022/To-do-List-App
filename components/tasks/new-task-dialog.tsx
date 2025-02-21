"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { createTask } from "@/lib/tasks"
import { toast } from "sonner"

interface NewTaskDialogProps {
  systemTags: string[]
  customTags: string[]
  onTaskCreated: () => void
}

export function NewTaskDialog({ systemTags, customTags, onTaskCreated }: NewTaskDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | undefined>()
  const [newTag, setNewTag] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    try {
      const finalTag = newTag.trim() || selectedTag
      if (!finalTag) {
        toast.error("Please select or enter a tag")
        return
      }

      const isImportant = finalTag === "Important"
      
      await createTask({
        title: title.trim(),
        tag: finalTag,
        date,
        time,
        is_starred: isImportant,
        is_completed: false
      })

      toast.success("Task created successfully")
      onTaskCreated()
      setOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error creating task:", error)
      toast.error("Failed to create task")
    }
  }

  const resetForm = () => {
    setTitle("")
    setSelectedTag(undefined)
    setNewTag("")
    setDate("")
    setTime("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="flex gap-2">
            <Select
              value={selectedTag}
              onValueChange={(value) => {
                setSelectedTag(value)
                setNewTag("")
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select tag" />
              </SelectTrigger>
              <SelectContent>
                {systemTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
                {customTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Or enter new tag"
              value={newTag}
              onChange={(e) => {
                setNewTag(e.target.value)
                setSelectedTag(undefined)
              }}
            />
          </div>
          <div className="flex gap-2">
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Task</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 