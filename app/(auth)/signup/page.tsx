'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [parishName, setParishName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
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

      router.push('/admin/dashboard')
      router.refresh()
    } catch (err) {
      console.error('Signup error:', err)
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{step === 1 ? 'Create Account' : 'Tell Us About You'}</CardTitle>
        <CardDescription>
          {step === 1
            ? 'Enter your email and password to get started'
            : 'Complete your profile and parish information'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setStep(2)
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              Continue
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parishName">Parish Name</Label>
              <Input
                id="parishName"
                value={parishName}
                onChange={(e) => setParishName(e.target.value)}
                required
                disabled={loading}
                placeholder="e.g., Saint Elizabeth Orthodox Church"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                Back
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </div>
          </form>
        )}
        <div className="mt-4 text-center text-sm">
          <a href="/login" className="text-primary hover:underline">
            Already have an account? Sign in
          </a>
        </div>
      </CardContent>
    </Card>
  )
}

