'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { PlanCard } from '@/components/onboarding/PlanCard'
import { ChevronRight, ChevronLeft } from 'lucide-react'

interface OnboardingAnswers {
  priorityFeatures?: string[]
}

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 'Free',
    period: 'month',
    description: 'Essential tools to get your parish online',
    features: [
      'Basic parish website',
      'Event calendar',
      'Announcement posts',
      'Mobile responsive design',
      'Community support',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '$29',
    period: 'month',
    description: 'Everything in Starter, plus more power',
    features: [
      'Custom domain support',
      'Online donations',
      'Sermon archive',
      'Schedule management',
      'Email notifications',
      'Priority support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$79',
    period: 'month',
    description: 'Full-featured platform for growing parishes',
    features: [
      'Everything in Growth',
      'Member portal',
      'Livestream integration',
      'Advanced analytics',
      'Multiple admin users',
      'API access',
      'Dedicated support',
    ],
  },
]

export default function PlanPage() {
  const router = useRouter()
  const supabase = createClient()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [recommendedPlan, setRecommendedPlan] = useState<string>('growth')
  const [loading, setLoading] = useState(false)
  const [parishId, setParishId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchParish() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data: membership } = await supabase
        .from('parish_users')
        .select('parish_id')
        .eq('user_id', user.id)
        .single()

      if (membership) {
        setParishId(membership.parish_id)
        
        // Load existing selection and answers (using any cast since types not regenerated)
        const { data: parish } = await (supabase as any)
          .from('parishes')
          .select('selected_plan, onboarding_answers')
          .eq('id', membership.parish_id)
          .single()
        
        if (parish?.selected_plan) {
          setSelectedPlan(parish.selected_plan)
        }
        
        // Determine recommendation based on answers
        if (parish?.onboarding_answers) {
          const answers = parish.onboarding_answers as OnboardingAnswers
          const featureCount = answers.priorityFeatures?.length ?? 0
          
          if (featureCount >= 5) {
            setRecommendedPlan('pro')
          } else if (featureCount >= 3) {
            setRecommendedPlan('growth')
          } else {
            setRecommendedPlan('starter')
          }
        }
      }
    }
    fetchParish()
  }, [supabase, router])

  const handleContinue = async () => {
    if (!parishId || !selectedPlan) return
    
    setLoading(true)
    
    await (supabase as any)
      .from('parishes')
      .update({ selected_plan: selectedPlan })
      .eq('id', parishId)
    
    router.push('/onboarding/addons')
  }

  const handleBack = () => {
    router.push('/onboarding/questions')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-[#0B0B0B]">Choose your plan</h1>
        <p className="mt-2 text-[#6A6761]">
          Select the plan that best fits your parish&apos;s needs. You can change this later.
        </p>
      </div>

      {/* Plan cards */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            name={plan.name}
            price={plan.price}
            period={plan.period}
            description={plan.description}
            features={plan.features}
            isRecommended={plan.id === recommendedPlan}
            isSelected={selectedPlan === plan.id}
            onSelect={() => setSelectedPlan(plan.id)}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          variant="gold"
          onClick={handleContinue}
          disabled={!selectedPlan || loading}
          className="gap-2"
        >
          {loading ? 'Saving...' : 'Continue to Add-ons'}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

