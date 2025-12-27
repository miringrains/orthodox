'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { ChevronRight, ChevronLeft, Users, Globe, MapPin, Sparkles, Monitor } from 'lucide-react'

interface OnboardingAnswers {
  parishSize?: 'small' | 'medium' | 'large'
  languages?: string[]
  location?: string
  priorityFeatures?: string[]
  websiteStatus?: 'have' | 'need' | 'unsure'
}

const sizeOptions = [
  { value: 'small', label: 'Small', description: 'Under 100 members', icon: Users },
  { value: 'medium', label: 'Medium', description: '100-500 members', icon: Users },
  { value: 'large', label: 'Large', description: '500+ members', icon: Users },
]

const languageOptions = [
  'English',
  'Greek',
  'Russian',
  'Arabic',
  'Romanian',
  'Serbian',
  'Bulgarian',
  'Ukrainian',
  'Other',
]

const featureOptions = [
  { id: 'website', label: 'Parish Website' },
  { id: 'donations', label: 'Online Donations' },
  { id: 'calendar', label: 'Event Calendar' },
  { id: 'sermons', label: 'Sermon Archive' },
  { id: 'members', label: 'Member Portal' },
  { id: 'livestream', label: 'Livestream' },
]

const websiteOptions = [
  { value: 'have', label: 'We have a website', description: 'Looking to improve or migrate' },
  { value: 'need', label: 'We need a website', description: 'Starting fresh' },
  { value: 'unsure', label: 'Not sure yet', description: 'Still deciding' },
]

export default function QuestionsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [subStep, setSubStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [parishId, setParishId] = useState<string | null>(null)
  
  const [answers, setAnswers] = useState<OnboardingAnswers>({
    parishSize: undefined,
    languages: [],
    location: '',
    priorityFeatures: [],
    websiteStatus: undefined,
  })

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
        
        // Load existing answers if any
        const { data: parish } = await supabase
          .from('parishes')
          .select('onboarding_answers')
          .eq('id', membership.parish_id)
          .single()
        
        if (parish?.onboarding_answers && typeof parish.onboarding_answers === 'object') {
          setAnswers(parish.onboarding_answers as OnboardingAnswers)
        }
      }
    }
    fetchParish()
  }, [supabase, router])

  const saveAnswers = async () => {
    if (!parishId) return
    
    await supabase
      .from('parishes')
      .update({ onboarding_answers: answers as unknown as Record<string, unknown> })
      .eq('id', parishId)
  }

  const handleNext = async () => {
    await saveAnswers()
    
    if (subStep < 4) {
      setSubStep(subStep + 1)
    } else {
      setLoading(true)
      router.push('/onboarding/plan')
    }
  }

  const handleBack = () => {
    if (subStep > 0) {
      setSubStep(subStep - 1)
    }
  }

  const canProceed = () => {
    switch (subStep) {
      case 0: return !!answers.parishSize
      case 1: return (answers.languages?.length ?? 0) > 0
      case 2: return true // Location is optional
      case 3: return (answers.priorityFeatures?.length ?? 0) > 0
      case 4: return !!answers.websiteStatus
      default: return false
    }
  }

  const renderSubStep = () => {
    switch (subStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-[#0B0B0B]">How large is your parish?</h2>
              <p className="mt-2 text-[#6A6761]">This helps us recommend the right features</p>
            </div>
            <div className="grid gap-3">
              {sizeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setAnswers({ ...answers, parishSize: option.value as OnboardingAnswers['parishSize'] })}
                  className={`
                    flex items-center gap-4 p-4 rounded-lg border-2 text-left transition-all
                    ${answers.parishSize === option.value
                      ? 'border-[#C9A227] bg-[#F4EBD3]'
                      : 'border-[#D1CEC8] bg-white hover:border-[#C9A227]/50'
                    }
                  `}
                >
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    ${answers.parishSize === option.value ? 'bg-[#C9A227] text-white' : 'bg-[#EEECE6] text-[#6A6761]'}
                  `}>
                    <option.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#0B0B0B]">{option.label}</div>
                    <div className="text-sm text-[#6A6761]">{option.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )
      
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#EEECE6] mb-4">
                <Globe className="h-6 w-6 text-[#6A6761]" />
              </div>
              <h2 className="text-2xl font-semibold text-[#0B0B0B]">What languages do you use?</h2>
              <p className="mt-2 text-[#6A6761]">Select all that apply</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {languageOptions.map((lang) => (
                <label
                  key={lang}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
                    ${answers.languages?.includes(lang)
                      ? 'border-[#C9A227] bg-[#F4EBD3]'
                      : 'border-[#D1CEC8] bg-white hover:border-[#C9A227]/50'
                    }
                  `}
                >
                  <Checkbox
                    checked={answers.languages?.includes(lang) ?? false}
                    onCheckedChange={(checked) => {
                      const current = answers.languages ?? []
                      if (checked) {
                        setAnswers({ ...answers, languages: [...current, lang] })
                      } else {
                        setAnswers({ ...answers, languages: current.filter(l => l !== lang) })
                      }
                    }}
                  />
                  <span className="text-[#0B0B0B]">{lang}</span>
                </label>
              ))}
            </div>
          </div>
        )
      
      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#EEECE6] mb-4">
                <MapPin className="h-6 w-6 text-[#6A6761]" />
              </div>
              <h2 className="text-2xl font-semibold text-[#0B0B0B]">Where is your parish located?</h2>
              <p className="mt-2 text-[#6A6761]">City, State/Province, Country (optional)</p>
            </div>
            <input
              type="text"
              value={answers.location ?? ''}
              onChange={(e) => setAnswers({ ...answers, location: e.target.value })}
              placeholder="e.g., Chicago, Illinois, USA"
              className="w-full h-12 px-4 rounded-lg border-2 border-[#D1CEC8] bg-white text-[#0B0B0B] placeholder:text-[#8C8881] focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/20"
            />
          </div>
        )
      
      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#EEECE6] mb-4">
                <Sparkles className="h-6 w-6 text-[#6A6761]" />
              </div>
              <h2 className="text-2xl font-semibold text-[#0B0B0B]">What features matter most?</h2>
              <p className="mt-2 text-[#6A6761]">Select all that you&apos;re interested in</p>
            </div>
            <div className="grid gap-3">
              {featureOptions.map((feature) => (
                <label
                  key={feature.id}
                  className={`
                    flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${answers.priorityFeatures?.includes(feature.id)
                      ? 'border-[#C9A227] bg-[#F4EBD3]'
                      : 'border-[#D1CEC8] bg-white hover:border-[#C9A227]/50'
                    }
                  `}
                >
                  <Checkbox
                    checked={answers.priorityFeatures?.includes(feature.id) ?? false}
                    onCheckedChange={(checked) => {
                      const current = answers.priorityFeatures ?? []
                      if (checked) {
                        setAnswers({ ...answers, priorityFeatures: [...current, feature.id] })
                      } else {
                        setAnswers({ ...answers, priorityFeatures: current.filter(f => f !== feature.id) })
                      }
                    }}
                  />
                  <span className="font-medium text-[#0B0B0B]">{feature.label}</span>
                </label>
              ))}
            </div>
          </div>
        )
      
      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#EEECE6] mb-4">
                <Monitor className="h-6 w-6 text-[#6A6761]" />
              </div>
              <h2 className="text-2xl font-semibold text-[#0B0B0B]">Current website situation?</h2>
              <p className="mt-2 text-[#6A6761]">This helps us understand your starting point</p>
            </div>
            <div className="grid gap-3">
              {websiteOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setAnswers({ ...answers, websiteStatus: option.value as OnboardingAnswers['websiteStatus'] })}
                  className={`
                    p-4 rounded-lg border-2 text-left transition-all
                    ${answers.websiteStatus === option.value
                      ? 'border-[#C9A227] bg-[#F4EBD3]'
                      : 'border-[#D1CEC8] bg-white hover:border-[#C9A227]/50'
                    }
                  `}
                >
                  <div className="font-semibold text-[#0B0B0B]">{option.label}</div>
                  <div className="text-sm text-[#6A6761]">{option.description}</div>
                </button>
              ))}
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-xl border border-[#D1CEC8] shadow-soft p-6 md:p-8">
      {/* Sub-step progress */}
      <div className="flex gap-1.5 mb-8">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= subStep ? 'bg-[#C9A227]' : 'bg-[#EEECE6]'
            }`}
          />
        ))}
      </div>

      {renderSubStep()}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8 pt-6 border-t border-[#EEECE6]">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={subStep === 0}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          variant="gold"
          onClick={handleNext}
          disabled={!canProceed() || loading}
          className="gap-2"
        >
          {subStep === 4 ? 'Continue to Plans' : 'Next'}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

