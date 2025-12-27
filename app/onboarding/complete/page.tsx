'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Check, ArrowRight, Sparkles } from 'lucide-react'

const planNames: Record<string, string> = {
  starter: 'Starter',
  growth: 'Growth',
  pro: 'Pro',
  free: 'Free',
}

const addonNames: Record<string, string> = {
  members: 'Member Portal',
  livestream: 'Livestream Embed',
  store: 'Online Store',
  analytics: 'Advanced Analytics',
  newsletter: 'Email Newsletter',
}

export default function CompletePage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [parishName, setParishName] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('free')
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])

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
        const { data: parish } = await supabase
          .from('parishes')
          .select('name, selected_plan, selected_addons')
          .eq('id', membership.parish_id)
          .single()
        
        if (parish) {
          setParishName(parish.name)
          setSelectedPlan(parish.selected_plan || 'free')
          setSelectedAddons(parish.selected_addons || [])
        }
      }
    }
    fetchParish()
  }, [supabase, router])

  const handleEnterDashboard = async () => {
    setLoading(true)
    
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
      await supabase
        .from('parishes')
        .update({ onboarding_completed: true })
        .eq('id', membership.parish_id)
    }
    
    // Use window.location for reliable redirect after updating
    window.location.href = '/admin/dashboard'
  }

  return (
    <div className="bg-white rounded-xl border border-[#D1CEC8] shadow-soft p-8 text-center">
      {/* Success icon */}
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E6F1EC] mb-6">
        <Sparkles className="h-8 w-8 text-[#1F4D3A]" />
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-semibold text-[#0B0B0B]">
        Your parish space is ready!
      </h1>
      <p className="mt-2 text-[#6A6761]">
        {parishName} is all set up and ready to go.
      </p>

      {/* Summary card */}
      <div className="mt-8 bg-[#F6F5F2] rounded-lg p-6 text-left">
        <h2 className="text-sm font-semibold text-[#6A6761] uppercase tracking-wide mb-4">
          Your Selection
        </h2>
        
        {/* Plan */}
        <div className="flex items-center justify-between py-3 border-b border-[#EEECE6]">
          <span className="text-[#3A3A3A]">Plan</span>
          <span className="font-semibold text-[#0B0B0B]">
            {planNames[selectedPlan] || selectedPlan}
          </span>
        </div>
        
        {/* Add-ons */}
        <div className="py-3">
          <span className="text-[#3A3A3A]">Add-ons</span>
          {selectedAddons.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {selectedAddons.map((addon) => (
                <li key={addon} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#1F4D3A]" />
                  <span className="text-sm text-[#0B0B0B]">
                    {addonNames[addon] || addon}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-[#6A6761]">No add-ons selected</p>
          )}
        </div>
      </div>

      {/* Note */}
      <p className="mt-6 text-sm text-[#6A6761]">
        You can change your plan and add-ons anytime from Settings.
      </p>

      {/* CTA */}
      <Button
        variant="gold"
        size="lg"
        onClick={handleEnterDashboard}
        disabled={loading}
        className="mt-8 gap-2"
      >
        {loading ? 'Entering...' : 'Enter Dashboard'}
        <ArrowRight className="h-5 w-5" />
      </Button>
    </div>
  )
}

