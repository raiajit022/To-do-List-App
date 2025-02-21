'use client'

import { useEffect } from 'react'
import { useAuth } from '@/components/providers/auth-provider'

export default function HomePage() {
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      window.location.href = user ? '/dashboard' : '/login'
    }
  }, [user, loading])

  return null
}

