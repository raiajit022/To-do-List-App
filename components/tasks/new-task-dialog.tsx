"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define available system tags
const SYSTEM_TAGS = [
  'My Day',
  'Important',
  'Personal',
  'All',
  'Completed',
  'Assigned to me'
]

interface NewTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (task: {
    title: string
    date: string
    time: string
    tag: string
    isCompleted: boolean
    isStarred: boolean
  }) => void
  existingTags: string[]
  onAddTag: (tag: string) => void
}

export function NewTaskDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  existingTags,
  onAddTag 
}: NewTaskDialogProps) {
  const [title, setTitle] = React.useState("")
  const [date, setDate] = React.useState<Date>(new Date())
  const [time, setTime] = React.useState(format(new Date(), "HH:mm"))
  const [tag, setTag] = React.useState("My Day")
  const [newTag, setNewTag] = React.useState("")

  // Combine system tags and custom tags, ensuring no duplicates
  const allTags = React.useMemo(() => {
    const systemTags = ['My Day', 'Important', 'Personal', 'All', 'Completed', 'Assigned to me']
    return [...systemTags, ...existingTags.filter(tag => !systemTags.includes(tag))]
  }, [existingTags])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    // Determine the final tag
    let finalTag = tag
    if (newTag.trim()) {
      finalTag = newTag.trim()
      // Only add to custom tags if it's not a system tag
      if (!SYSTEM_TAGS.includes(finalTag)) {
        onAddTag(finalTag)
      }
    }

    onSubmit({
      title: title.trim(),
      date: format(date, "yyyy-MM-dd"),
      time,
      tag: finalTag,
      isCompleted: false,
      isStarred: finalTag === 'Important'
    })

    // Reset form
    setTitle("")
    setDate(new Date())
    setTime(format(new Date(), "HH:mm"))
    setTag("My Day")
    setNewTag("")
    onOpenChange(false)
  }

  // Fix the calendar onSelect handler
  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className="h-12 text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label>Date & Time</Label>
            <div className="flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[240px] h-12 justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-[130px] h-12 pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tag</Label>
            <div className="flex space-x-2">
              <Select value={tag} onValueChange={setTag}>
                <SelectTrigger className="w-[240px] h-12">
                  <SelectValue placeholder="Select a tag" />
                </SelectTrigger>
                <SelectContent>
                  {allTags.map((tagOption) => (
                    <SelectItem key={tagOption} value={tagOption}>
                      {tagOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Or add new tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="h-12"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full h-12 text-lg bg-black hover:bg-gray-800">
              Add Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 