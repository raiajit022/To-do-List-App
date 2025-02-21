import { ProtectedRoute } from '@/components/auth/protected-route'

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>Protected Content</div>
    </ProtectedRoute>
  )
} 