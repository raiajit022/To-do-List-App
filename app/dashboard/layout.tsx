'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import { Home, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SettingsDropdown } from '@/components/settings/settings-dropdown'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DashboardLayoutProps {
  children: React.ReactNode
}

interface Notification {
  id: string
  taskId: string
  taskTitle: string
  dueDate: string
  dueTime: string
  isRead: boolean
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const router = useRouter()
  const { user, loading } = useAuth()
  const supabase = getSupabaseBrowser()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [profile, setProfile] = useState<{ full_name: string }>({ full_name: '' })

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/login'
    }
  }, [user, loading])

  useEffect(() => {
    const checkUpcomingTasks = () => {
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
      const now = new Date()
      const upcoming = tasks.filter((task: any) => {
        const taskDateTime = new Date(`${task.date}T${task.time}`)
        const timeDiff = taskDateTime.getTime() - now.getTime()
        // Create notification 30 minutes before task
        return timeDiff > 0 && timeDiff <= 30 * 60 * 1000
      })

      const newNotifications = upcoming.map((task: any) => ({
        id: Math.random().toString(),
        taskId: task.id,
        taskTitle: task.title,
        dueDate: task.date,
        dueTime: task.time,
        isRead: false
      }))

      setNotifications(prev => {
        const existing = prev.filter(n => 
          !newNotifications.some(nn => nn.taskId === n.taskId)
        )
        return [...existing, ...newNotifications]
      })
    }

    const interval = setInterval(checkUpcomingTasks, 60000) // Check every minute
    checkUpcomingTasks() // Initial check

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.isRead).length)
  }, [notifications])

  useEffect(() => {
    async function loadProfile() {
      if (!user?.id) return
      try {
        const { data } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()
        
        if (data) {
          setProfile(data)
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      }
    }
    loadProfile()
  }, [user, supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <span className="font-medium">
                {profile.full_name || 'Welcome'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/dashboard')}
              >
                <Home className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Bell className="h-4 w-4" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 rounded-full" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <DropdownMenuItem
                          key={notification.id}
                          className="flex flex-col items-start p-3"
                          onClick={() => {
                            setNotifications(prev =>
                              prev.map(n =>
                                n.id === notification.id ? { ...n, isRead: true } : n
                              )
                            )
                          }}
                        >
                          <div className="font-medium">{notification.taskTitle}</div>
                          <div className="text-sm text-gray-500">
                            Due at {notification.dueTime} on {notification.dueDate}
                          </div>
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <DropdownMenuItem disabled>
                        No notifications
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <SettingsDropdown onSignOut={handleSignOut} />
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="font-medium">{user.email?.split('@')[0]}</div>
                  <div className="text-gray-500 text-xs">{user.email}</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
} 