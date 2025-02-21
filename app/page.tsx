"use client"

import { Menu } from "lucide-react"
import { useState } from "react"
import TaskList from "@/components/task-list"
import Sidebar from "@/components/sidebar"
import Calendar from "@/components/calendar"
import UserProfile from "@/components/user-profile"
import NewTaskButton from "@/components/new-task-button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Page() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Layout */}
      <div className="flex flex-col w-full md:hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="p-2 hover:bg-accent rounded-lg">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[300px]">
              <Sidebar />
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-4">
            <UserProfile compact />
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">My Day</h1>
              <p className="text-muted-foreground">December 2022</p>
            </div>
            <div className="flex justify-center">
              <NewTaskButton />
            </div>
            <TaskList />
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <main className="hidden md:flex flex-1 overflow-auto border-l">
        <div className="flex">
          <div className="flex-1 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-blue-600">My Day</h1>
                <p className="text-sm text-muted-foreground">December 2022</p>
              </div>
              <NewTaskButton />
            </div>
            <TaskList />
          </div>
          <div className="w-[400px] border-l p-6 bg-slate-50">
            <UserProfile />
            <Calendar />
          </div>
        </div>
      </main>
    </div>
  )
}

