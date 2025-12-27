'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
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

    // Use window.location for reliable redirect after auth
    window.location.href = '/admin/dashboard'
  }

  return (
    <div className="w-full max-w-sm">
      {/* Card */}
      <div className="bg-white dark:bg-[#191919] border border-[#D1CEC8] dark:border-[#2F2F2F] rounded-md shadow-soft p-6">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-[#0B0B0B] dark:text-[#F3F2EE]">
            Sign In
          </h1>
          <p className="mt-1.5 text-sm text-[#6A6761] dark:text-[#A8A39A]">
            Enter your credentials to access your dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="rounded-md bg-[#F3E6E6] dark:bg-[#6F2D2D]/20 border border-[#6F2D2D]/30 p-3 text-sm text-[#6F2D2D]">
              {error}
            </div>
          )}
          
          <div className="space-y-1.5">
            <Label 
              htmlFor="email" 
              className="text-sm font-medium text-[#3A3A3A] dark:text-[#CFCAC2]"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="h-10 bg-white dark:bg-[#232323] border-[#D1CEC8] dark:border-[#2F2F2F] text-[#0B0B0B] dark:text-[#F3F2EE] placeholder:text-[#8C8881] focus:border-[#C9A227] focus:ring-[#C9A227]/35"
              placeholder="you@example.com"
            />
          </div>
          
          <div className="space-y-1.5">
            <Label 
              htmlFor="password"
              className="text-sm font-medium text-[#3A3A3A] dark:text-[#CFCAC2]"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="h-10 bg-white dark:bg-[#232323] border-[#D1CEC8] dark:border-[#2F2F2F] text-[#0B0B0B] dark:text-[#F3F2EE] placeholder:text-[#8C8881] focus:border-[#C9A227] focus:ring-[#C9A227]/35"
              placeholder="••••••••"
            />
          </div>
          
          <Button 
            type="submit" 
            variant="gold"
            className="w-full h-10" 
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        
        <div className="mt-5 pt-5 border-t border-[#D1CEC8] dark:border-[#2F2F2F] text-center">
          <p className="text-sm text-[#6A6761] dark:text-[#A8A39A]">
            Don&apos;t have an account?{' '}
            <a 
              href="/auth/signup" 
              className="text-[#0B0B0B] dark:text-[#F3F2EE] hover:text-[#C9A227] dark:hover:text-[#C9A227] font-medium transition-colors"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
