import { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SidebarItemProps {
  icon: LucideIcon
  label: string
  count?: number
  isActive?: boolean
  onClick?: () => void
  showDeleteOnHover?: boolean
  onDelete?: () => void
  onSelect?: () => void
}

export function SidebarItem({
  icon: Icon,
  label,
  count,
  isActive,
  onClick,
  showDeleteOnHover,
  onDelete,
  onSelect
}: SidebarItemProps) {
  return (
    <div className="group relative">
      <button
        onClick={() => {
          if (onClick) onClick()
          if (onSelect) onSelect()
        }}
        className={cn(
          "w-full flex items-center px-3 py-2 text-sm rounded-lg",
          isActive 
            ? "bg-blue-50 text-blue-600" 
            : "text-gray-700 hover:bg-gray-100"
        )}
      >
        <Icon className={cn(
          "h-4 w-4 mr-3",
          isActive ? "text-blue-600" : "text-gray-500"
        )} />
        <span className="flex-1 text-left">{label}</span>
        {count !== undefined && (
          <span className="text-xs text-gray-400">{count}</span>
        )}
      </button>
      {showDeleteOnHover && (
        <button
          onClick={onDelete}
          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded"
        >
          <svg className="h-4 w-4 text-gray-500" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
            />
          </svg>
        </button>
      )}
    </div>
  )
} 