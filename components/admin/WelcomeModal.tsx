'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Upload, X, ArrowLeft } from 'lucide-react'

interface WelcomeModalProps {
  parishId: string
  parishName: string
  isOpen: boolean
  onClose: () => void
}

export function WelcomeModal({ parishId, parishName, isOpen, onClose }: WelcomeModalProps) {
  const supabase = createClient()
  const [step, setStep] = useState(0)
  const [needsDomain, setNeedsDomain] = useState<boolean | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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
          needs_domain: needsDomain,
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader className="space-y-3">
          <DialogTitle className="font-display text-2xl text-center">
            Welcome to {parishName}
          </DialogTitle>
          <DialogDescription className="text-center text-neutral-500">
            Let&apos;s personalize your experience
          </DialogDescription>
        </DialogHeader>

        {step === 0 && (
          <div className="space-y-4 pt-2">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
              Do you need a custom domain for your website?
            </p>
            
            <div className="grid gap-2">
              <button
                onClick={() => { setNeedsDomain(true); setStep(1); }}
                className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-left transition-all hover:bg-neutral-100 dark:hover:bg-neutral-700 group"
              >
                <div className="font-medium text-neutral-900 dark:text-neutral-100">Yes, I need a domain</div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Help me set up a custom address</div>
              </button>
              
              <button
                onClick={() => { setNeedsDomain(false); setStep(1); }}
                className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-left transition-all hover:bg-neutral-100 dark:hover:bg-neutral-700 group"
              >
                <div className="font-medium text-neutral-900 dark:text-neutral-100">I already have one</div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">I&apos;ll connect my existing domain</div>
              </button>
              
              <button
                onClick={() => { setNeedsDomain(null); setStep(1); }}
                className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-left transition-all hover:bg-neutral-100 dark:hover:bg-neutral-700 group"
              >
                <div className="font-medium text-neutral-900 dark:text-neutral-100">Decide later</div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">I&apos;ll figure this out later</div>
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6 pt-2">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
              Upload your parish logo <span className="text-neutral-400">(optional)</span>
            </p>
            
            {logoPreview ? (
              <div className="relative w-28 h-28 mx-auto">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="w-full h-full object-contain rounded-xl bg-neutral-50 dark:bg-neutral-800"
                />
                <button
                  onClick={removeLogo}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-full flex items-center justify-center hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <Label
                htmlFor="logo-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-xl cursor-pointer hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all"
              >
                <Upload className="h-6 w-6 text-neutral-400 mb-2" />
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Click to upload</span>
                <span className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">PNG, JPG, or SVG</span>
                <Input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </Label>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                variant="ghost"
                onClick={() => setStep(0)}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleComplete}
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Saving...' : 'Continue'}
              </Button>
            </div>
            
            <button
              onClick={handleSkip}
              disabled={loading}
              className="w-full text-sm text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
            >
              Skip for now
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
