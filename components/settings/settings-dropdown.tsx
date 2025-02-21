"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Settings, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

interface SettingsDropdownProps {
  onSignOut: () => Promise<void>
}

export function SettingsDropdown({ onSignOut }: SettingsDropdownProps) {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push('/dashboard/account')}>
          Account Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onSignOut} className="text-red-600">
          <LogOut className="h-4 w-4 mr-2" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 