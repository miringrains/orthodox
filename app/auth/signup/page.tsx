'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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

  const inputClasses = "h-10 bg-white dark:bg-[#232323] border-[#D1CEC8] dark:border-[#2F2F2F] text-[#0B0B0B] dark:text-[#F3F2EE] placeholder:text-[#8C8881] focus:border-[#C9A227] focus:ring-[#C9A227]/35"
  const labelClasses = "text-sm font-medium text-[#3A3A3A] dark:text-[#CFCAC2]"

  return (
    <div className="w-full max-w-sm">
      {/* Card */}
      <div className="bg-white dark:bg-[#191919] border border-[#D1CEC8] dark:border-[#2F2F2F] rounded-md shadow-soft p-6">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-[#0B0B0B] dark:text-[#F3F2EE]">
            {step === 1 ? 'Create Account' : 'Tell Us About You'}
          </h1>
          <p className="mt-1.5 text-sm text-[#6A6761] dark:text-[#A8A39A]">
            {step === 1
              ? 'Enter your email and password to get started'
              : 'Complete your profile and parish information'}
          </p>
        </div>

        {step === 1 ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setStep(2)
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="email" className={labelClasses}>Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className={inputClasses}
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className={labelClasses}>Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
                className={inputClasses}
                placeholder="Minimum 6 characters"
              />
            </div>
            <Button 
              type="submit" 
              variant="gold"
              className="w-full h-10" 
              disabled={loading}
            >
              Continue
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="rounded-md bg-[#F3E6E6] dark:bg-[#6F2D2D]/20 border border-[#6F2D2D]/30 p-3 text-sm text-[#6F2D2D]">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="firstName" className={labelClasses}>First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                disabled={loading}
                className={inputClasses}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName" className={labelClasses}>Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                disabled={loading}
                className={inputClasses}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="parishName" className={labelClasses}>Parish Name</Label>
              <Input
                id="parishName"
                value={parishName}
                onChange={(e) => setParishName(e.target.value)}
                required
                disabled={loading}
                placeholder="e.g., Saint Elizabeth Orthodox Church"
                className={inputClasses}
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-10 bg-white dark:bg-[#232323] border-[#D1CEC8] dark:border-[#2F2F2F] text-[#3A3A3A] dark:text-[#CFCAC2] hover:bg-[#EEECE6] dark:hover:bg-[#2F2F2F]"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                Back
              </Button>
              <Button 
                type="submit" 
                variant="gold"
                className="flex-1 h-10" 
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Account'}
              </Button>
            </div>
          </form>
        )}
        
        <div className="mt-5 pt-5 border-t border-[#D1CEC8] dark:border-[#2F2F2F] text-center">
          <p className="text-sm text-[#6A6761] dark:text-[#A8A39A]">
            Already have an account?{' '}
            <a 
              href="/auth/login" 
              className="text-[#0B0B0B] dark:text-[#F3F2EE] hover:text-[#C9A227] dark:hover:text-[#C9A227] font-medium transition-colors"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
