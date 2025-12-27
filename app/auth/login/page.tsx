'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    window.location.href = '/admin/dashboard'
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl text-neutral-900 dark:text-neutral-100">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Enter your credentials to continue
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-neutral-700 dark:text-neutral-300">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="h-11"
              placeholder="you@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm text-neutral-700 dark:text-neutral-300">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="h-11"
              placeholder="••••••••"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-11" 
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-neutral-500">
            Don&apos;t have an account?{' '}
            <Link 
              href="/auth/signup" 
              className="text-neutral-900 dark:text-neutral-100 hover:text-gold-600 dark:hover:text-gold-400 font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
