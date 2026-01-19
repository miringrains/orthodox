'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { 
  Upload, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Globe, 
  Palette, 
  Megaphone, 
  Calendar,
  CheckCircle2,
  Church,
  Loader2
} from 'lucide-react'

interface OnboardingWizardProps {
  parishId: string
  parishName: string
  isOpen: boolean
  onClose: () => void
}

type Goal = 'website' | 'announcements' | 'donations' | 'events' | 'community'

const GOALS: { id: Goal; label: string; description: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'website', label: 'Build a Website', description: 'Create a beautiful parish website', icon: Palette },
  { id: 'announcements', label: 'Share News', description: 'Post announcements and updates', icon: Megaphone },
  { id: 'donations', label: 'Accept Donations', description: 'Set up online giving', icon: Globe },
  { id: 'events', label: 'Manage Events', description: 'Schedule services and gatherings', icon: Calendar },
  { id: 'community', label: 'Coordinate Volunteers', description: 'Organize community needs', icon: Church },
]

export function OnboardingWizard({ parishId, parishName, isOpen, onClose }: OnboardingWizardProps) {
  const supabase = createClient()
  const [step, setStep] = useState(1)
  const [selectedGoals, setSelectedGoals] = useState<Goal[]>([])
  const [needsDomain, setNeedsDomain] = useState<'yes' | 'no' | 'later' | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const totalSteps = 4

  const toggleGoal = (goal: Goal) => {
    setSelectedGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    )
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setLogoFile(null)
    setLogoPreview(null)
  }

  const handleComplete = async () => {
    setLoading(true)

    try {
      let logoUrl = null

      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop()
        const fileName = `${parishId}/logo.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('parish-assets')
          .upload(fileName, logoFile, { upsert: true })

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('parish-assets')
            .getPublicUrl(fileName)
          logoUrl = publicUrl
        }
      }

      await (supabase as any)
        .from('parishes')
        .update({
          first_dashboard_visit: false,
          needs_domain: needsDomain === 'yes',
          onboarding_goals: selectedGoals,
          ...(logoUrl && { logo_url: logoUrl }),
        })
        .eq('id', parishId)

      onClose()
    } catch (error) {
      console.error('Error completing welcome setup:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = async () => {
    setLoading(true)
    
    await (supabase as any)
      .from('parishes')
      .update({ first_dashboard_visit: false })
      .eq('id', parishId)
    
    onClose()
  }

  const canProceed = () => {
    if (step === 1) return selectedGoals.length > 0
    if (step === 2) return needsDomain !== null
    return true
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden" showCloseButton={false}>
        {/* Progress bar */}
        <div className="h-1 bg-stone-100 dark:bg-neutral-800">
          <div 
            className="h-full bg-gold-500 transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        <div className="p-6">
          {/* Step 1: Goals */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gold-100 dark:bg-gold-500/20 flex items-center justify-center mx-auto mb-4">
                  <Church className="h-8 w-8 text-gold-600 dark:text-gold-400" />
                </div>
                <h2 className="font-display text-2xl text-stone-900 dark:text-neutral-100">
                  Welcome to {parishName}!
                </h2>
                <p className="text-stone-500 dark:text-neutral-400 mt-2">
                  What would you like to accomplish?
                </p>
              </div>

              <div className="grid gap-2">
                {GOALS.map((goal) => {
                  const isSelected = selectedGoals.includes(goal.id)
                  return (
                    <button
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id)}
                      className={`
                        flex items-center gap-4 p-4 rounded-xl text-left transition-all
                        ${isSelected 
                          ? 'bg-gold-50 dark:bg-gold-500/10 border-2 border-gold-400' 
                          : 'bg-stone-50 dark:bg-neutral-800 border-2 border-transparent hover:border-stone-200 dark:hover:border-neutral-600'
                        }
                      `}
                    >
                      <div className={`
                        w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                        ${isSelected 
                          ? 'bg-gold-500 text-white' 
                          : 'bg-stone-200 dark:bg-neutral-700 text-stone-500 dark:text-neutral-400'
                        }
                      `}>
                        <goal.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-stone-900 dark:text-neutral-100">
                          {goal.label}
                        </div>
                        <div className="text-sm text-stone-500 dark:text-neutral-400">
                          {goal.description}
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="h-5 w-5 text-gold-500" />
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={handleSkip}
                  disabled={loading}
                  className="text-sm text-stone-400 hover:text-stone-600 dark:hover:text-neutral-300 transition-colors"
                >
                  Skip setup
                </button>
                <Button 
                  onClick={() => setStep(2)} 
                  disabled={!canProceed()}
                >
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Domain */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="font-display text-2xl text-stone-900 dark:text-neutral-100">
                  Custom Domain
                </h2>
                <p className="text-stone-500 dark:text-neutral-400 mt-2">
                  Would you like a custom web address?
                </p>
              </div>

              <div className="grid gap-2">
                <button
                  onClick={() => setNeedsDomain('yes')}
                  className={`
                    p-4 rounded-xl text-left transition-all border-2
                    ${needsDomain === 'yes' 
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-400' 
                      : 'bg-stone-50 dark:bg-neutral-800 border-transparent hover:border-stone-200 dark:hover:border-neutral-600'
                    }
                  `}
                >
                  <div className="font-medium text-stone-900 dark:text-neutral-100">
                    Yes, I need a domain
                  </div>
                  <div className="text-sm text-stone-500 dark:text-neutral-400 mt-0.5">
                    Help me set up myparish.org or similar
                  </div>
                </button>
                
                <button
                  onClick={() => setNeedsDomain('no')}
                  className={`
                    p-4 rounded-xl text-left transition-all border-2
                    ${needsDomain === 'no' 
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-400' 
                      : 'bg-stone-50 dark:bg-neutral-800 border-transparent hover:border-stone-200 dark:hover:border-neutral-600'
                    }
                  `}
                >
                  <div className="font-medium text-stone-900 dark:text-neutral-100">
                    I have one already
                  </div>
                  <div className="text-sm text-stone-500 dark:text-neutral-400 mt-0.5">
                    I&apos;ll connect my existing domain
                  </div>
                </button>
                
                <button
                  onClick={() => setNeedsDomain('later')}
                  className={`
                    p-4 rounded-xl text-left transition-all border-2
                    ${needsDomain === 'later' 
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-400' 
                      : 'bg-stone-50 dark:bg-neutral-800 border-transparent hover:border-stone-200 dark:hover:border-neutral-600'
                    }
                  `}
                >
                  <div className="font-medium text-stone-900 dark:text-neutral-100">
                    Decide later
                  </div>
                  <div className="text-sm text-stone-500 dark:text-neutral-400 mt-0.5">
                    Use projectorthodox.com/p/your-parish for now
                  </div>
                </button>
              </div>

              <div className="flex justify-between items-center pt-4">
                <Button 
                  variant="ghost" 
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(3)} 
                  disabled={!canProceed()}
                >
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Logo */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                  <Palette className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="font-display text-2xl text-stone-900 dark:text-neutral-100">
                  Parish Logo
                </h2>
                <p className="text-stone-500 dark:text-neutral-400 mt-2">
                  Upload your logo (optional)
                </p>
              </div>

              {logoPreview ? (
                <div className="relative w-32 h-32 mx-auto">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-full h-full object-contain rounded-2xl bg-stone-50 dark:bg-neutral-800 border-2 border-stone-200 dark:border-neutral-700"
                  />
                  <button
                    onClick={removeLogo}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-stone-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-full flex items-center justify-center hover:bg-stone-700 dark:hover:bg-neutral-300 transition-colors shadow-lg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <Label
                  htmlFor="logo-upload"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-stone-200 dark:border-neutral-700 rounded-2xl cursor-pointer hover:border-stone-300 dark:hover:border-neutral-600 hover:bg-stone-50 dark:hover:bg-neutral-800/50 transition-all"
                >
                  <Upload className="h-8 w-8 text-stone-400 mb-3" />
                  <span className="text-sm font-medium text-stone-600 dark:text-neutral-300">
                    Click to upload
                  </span>
                  <span className="text-xs text-stone-400 dark:text-neutral-500 mt-1">
                    PNG, JPG, or SVG up to 2MB
                  </span>
                  <Input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </Label>
              )}

              <div className="flex justify-between items-center pt-4">
                <Button 
                  variant="ghost" 
                  onClick={() => setStep(2)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button onClick={() => setStep(4)}>
                  {logoPreview ? 'Continue' : 'Skip'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Complete */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="font-display text-2xl text-stone-900 dark:text-neutral-100">
                  You&apos;re All Set!
                </h2>
                <p className="text-stone-500 dark:text-neutral-400 mt-2">
                  Your parish dashboard is ready
                </p>
              </div>

              <div className="bg-stone-50 dark:bg-neutral-800 rounded-2xl p-6 space-y-4">
                <h3 className="font-medium text-stone-900 dark:text-neutral-100">
                  Recommended next steps:
                </h3>
                <div className="space-y-3">
                  {selectedGoals.includes('website') && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gold-100 dark:bg-gold-500/20 flex items-center justify-center">
                        <Palette className="h-4 w-4 text-gold-600 dark:text-gold-400" />
                      </div>
                      <span className="text-sm text-stone-600 dark:text-neutral-300">
                        Edit your website in the Page Builder
                      </span>
                    </div>
                  )}
                  {selectedGoals.includes('announcements') && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                        <Megaphone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm text-stone-600 dark:text-neutral-300">
                        Create your first announcement
                      </span>
                    </div>
                  )}
                  {selectedGoals.includes('events') && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-sm text-stone-600 dark:text-neutral-300">
                        Add your service schedule
                      </span>
                    </div>
                  )}
                  {selectedGoals.includes('donations') && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                        <Globe className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-sm text-stone-600 dark:text-neutral-300">
                        Connect a payment provider
                      </span>
                    </div>
                  )}
                  {(selectedGoals.length === 0 || selectedGoals.includes('community')) && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center">
                        <Church className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <span className="text-sm text-stone-600 dark:text-neutral-300">
                        Explore your dashboard
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <Button 
                  variant="ghost" 
                  onClick={() => setStep(3)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button 
                  onClick={handleComplete}
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step indicator dots */}
          <div className="flex justify-center gap-2 pt-6">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-2 h-2 rounded-full transition-all ${
                  s === step 
                    ? 'bg-gold-500 w-4' 
                    : s < step 
                      ? 'bg-gold-300 dark:bg-gold-600' 
                      : 'bg-stone-200 dark:bg-neutral-700'
                }`}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
