'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = getSupabaseBrowser()
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      if (data?.session) {
        window.location.href = '/dashboard'
      } else {
        throw new Error('No session created after login')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-sky-100 to-blue-100 p-4">
      <div className="w-full max-w-sm space-y-8 rounded-2xl bg-white p-6 shadow-lg">
        <div className="space-y-2 text-center">
          <Icons.logo className="mx-auto h-12 w-12" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Sign in with email
          </h1>
          <p className="text-sm text-muted-foreground">
            Make a new doc to bring your words, data, and teams together. For free
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full"
              required
            />
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full"
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-500">
              {error}
            </div>
          )}

          <div className="text-right">
            <Button
              variant="link"
              className="px-0 font-normal"
              onClick={() => router.push('/forgot-password')}
              type="button"
            >
              Forgot password?
            </Button>
          </div>

          <Button
            type="submit"
            className={cn(
              "w-full bg-gray-900 text-white hover:bg-gray-800",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
            disabled={isLoading}
          >
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="text-center text-sm">
          Don't have an account?{' '}
          <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
            Sign up
          </Link>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">
              Or sign in with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            disabled={true}
            className="opacity-50 cursor-not-allowed"
          >
            <Icons.google className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            disabled={true}
            className="opacity-50 cursor-not-allowed"
          >
            <Icons.facebook className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            disabled={true}
            className="opacity-50 cursor-not-allowed"
          >
            <Icons.apple className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
} 