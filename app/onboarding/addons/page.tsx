'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { AddonCard } from '@/components/onboarding/AddonCard'
import { ChevronRight, ChevronLeft, Users, Video, ShoppingBag, BarChart3, Mail } from 'lucide-react'

const addons = [
  {
    id: 'members',
    name: 'Member Portal',
    description: 'Private area for parishioners with directory, resources, and communication tools.',
    price: '+$15/month',
    icon: Users,
  },
  {
    id: 'livestream',
    name: 'Livestream Embed',
    description: 'Embed YouTube or Vimeo livestreams directly on your parish website.',
    price: '+$10/month',
    icon: Video,
  },
  {
    id: 'store',
    name: 'Online Store',
    description: 'Sell icons, books, candles and other items with integrated checkout.',
    price: '+$20/month',
    icon: ShoppingBag,
  },
  {
    id: 'analytics',
    name: 'Advanced Analytics',
    description: 'Detailed insights into donations, attendance, and website traffic.',
    price: '+$10/month',
    icon: BarChart3,
  },
  {
    id: 'newsletter',
    name: 'Email Newsletter',
    description: 'Send beautiful newsletters and announcements to your parishioners.',
    price: '+$15/month',
    icon: Mail,
  },
]

export default function AddonsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
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
        
        // Load existing selection
        const { data: parish } = await supabase
          .from('parishes')
          .select('selected_addons')
          .eq('id', membership.parish_id)
          .single()
        
        if (parish?.selected_addons) {
          setSelectedAddons(parish.selected_addons)
        }
      }
    }
    fetchParish()
  }, [supabase, router])

  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    )
  }

  const handleContinue = async () => {
    if (!parishId) return
    
    setLoading(true)
    
    await supabase
      .from('parishes')
      .update({ selected_addons: selectedAddons })
      .eq('id', parishId)
    
    router.push('/onboarding/complete')
  }

  const handleBack = () => {
    router.push('/onboarding/plan')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-[#0B0B0B]">Enhance with add-ons</h1>
        <p className="mt-2 text-[#6A6761]">
          Optional features to extend your parish platform. You can add these anytime.
        </p>
      </div>

      {/* Addon cards grid */}
      <div className="grid md:grid-cols-2 gap-4 mt-8">
        {addons.map((addon) => (
          <AddonCard
            key={addon.id}
            icon={addon.icon}
            name={addon.name}
            description={addon.description}
            price={addon.price}
            isSelected={selectedAddons.includes(addon.id)}
            onToggle={() => toggleAddon(addon.id)}
          />
        ))}
      </div>

      {/* Summary */}
      {selectedAddons.length > 0 && (
        <div className="bg-[#EEECE6] rounded-lg p-4 text-center">
          <span className="text-sm text-[#6A6761]">
            {selectedAddons.length} add-on{selectedAddons.length !== 1 ? 's' : ''} selected
          </span>
        </div>
      )}

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
          disabled={loading}
          className="gap-2"
        >
          {loading ? 'Saving...' : selectedAddons.length > 0 ? 'Continue' : 'Skip for now'}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

