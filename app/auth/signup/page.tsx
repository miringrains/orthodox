'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [parishName, setParishName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError || !authData.user) {
        setError(authError?.message || 'Failed to create account')
        setLoading(false)
        return
      }

      // 2. Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          first_name: firstName,
          last_name: lastName,
        })

      if (profileError) {
        console.error('Profile creation error:', profileError)
        setError('Failed to create profile')
        setLoading(false)
        return
      }

      // 3. Create parish
      const slug = parishName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

      const { data: parish, error: parishError } = await supabase
        .from('parishes')
        .insert({
          name: parishName,
          slug,
        })
        .select()
        .single()

      if (parishError || !parish) {
        console.error('Parish creation error:', parishError)
        setError('Failed to create parish')
        setLoading(false)
        return
      }

      // 4. Create parish membership (admin role)
      const { error: membershipError } = await supabase
        .from('parish_users')
        .insert({
          parish_id: parish.id,
          user_id: authData.user.id,
          role: 'admin',
        })

      if (membershipError) {
        console.error('Membership creation error:', membershipError)
        setError('Failed to create membership')
        setLoading(false)
        return
      }

      // 5. Auto-create HOME page with default template
      const { error: pageError } = await supabase
        .from('pages')
        .insert({
          parish_id: parish.id,
          title: 'Home',
          slug: 'home',
          kind: 'HOME',
        builder_enabled: true,
        builder_schema: null, // Will be set when user picks template
      })

      if (pageError) {
        console.error('Home page creation error:', pageError)
        // Non-fatal - continue to onboarding
      }

      // Redirect to onboarding flow
      window.location.href = '/onboarding/questions'
    } catch (err) {
      console.error('Signup error:', err)
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl text-neutral-900 dark:text-neutral-100">
            {step === 1 ? 'Create your account' : 'Almost there'}
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            {step === 1
              ? 'Start your parish platform today'
              : 'Tell us about yourself and your parish'}
          </p>
        </div>

        {step === 1 ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setStep(2)
            }}
            className="space-y-5"
          >
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
                minLength={6}
                className="h-11"
                placeholder="Minimum 6 characters"
              />
            </div>
            
            <Button type="submit" className="w-full h-11" disabled={loading}>
              Continue
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm text-neutral-700 dark:text-neutral-300">
                  First name
                </Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  disabled={loading}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm text-neutral-700 dark:text-neutral-300">
                  Last name
                </Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  disabled={loading}
                  className="h-11"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="parishName" className="text-sm text-neutral-700 dark:text-neutral-300">
                Parish name
              </Label>
              <Input
                id="parishName"
                value={parishName}
                onChange={(e) => setParishName(e.target.value)}
                required
                disabled={loading}
                placeholder="e.g., Saint Elizabeth Orthodox Church"
                className="h-11"
              />
            </div>
            
            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                className="flex-1 h-11"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button type="submit" className="flex-1 h-11" disabled={loading}>
                {loading ? 'Creating...' : 'Create Account'}
              </Button>
            </div>
          </form>
        )}
        
        <div className="mt-6 text-center">
          <p className="text-sm text-neutral-500">
            Already have an account?{' '}
            <Link 
              href="/auth/login" 
              className="text-neutral-900 dark:text-neutral-100 hover:text-gold-600 dark:hover:text-gold-400 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
