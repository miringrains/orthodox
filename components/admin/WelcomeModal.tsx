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
import { Globe, Upload, X, Sparkles } from 'lucide-react'

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

      // Upload logo if provided
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

      // Update parish record
      await supabase
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
    
    await supabase
      .from('parishes')
      .update({ first_dashboard_visit: false })
      .eq('id', parishId)
    
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#F4EBD3] mx-auto mb-4">
            <Sparkles className="h-6 w-6 text-[#C9A227]" />
          </div>
          <DialogTitle className="text-center text-xl">
            Welcome to {parishName}!
          </DialogTitle>
          <DialogDescription className="text-center">
            A few quick questions to personalize your experience
          </DialogDescription>
        </DialogHeader>

        {step === 0 && (
          <div className="space-y-4 pt-4">
            <div className="text-center mb-4">
              <Globe className="h-8 w-8 text-[#6A6761] mx-auto mb-2" />
              <p className="text-sm text-[#3A3A3A]">Do you need a custom domain for your website?</p>
            </div>
            
            <div className="grid gap-3">
              <button
                onClick={() => { setNeedsDomain(true); setStep(1); }}
                className={`
                  p-4 rounded-lg border-2 text-left transition-all
                  border-[#D1CEC8] bg-white hover:border-[#C9A227]/50
                `}
              >
                <div className="font-medium text-[#0B0B0B]">Yes, I need a domain</div>
                <div className="text-sm text-[#6A6761]">Help me set up a custom address</div>
              </button>
              
              <button
                onClick={() => { setNeedsDomain(false); setStep(1); }}
                className={`
                  p-4 rounded-lg border-2 text-left transition-all
                  border-[#D1CEC8] bg-white hover:border-[#C9A227]/50
                `}
              >
                <div className="font-medium text-[#0B0B0B]">I already have one</div>
                <div className="text-sm text-[#6A6761]">I&apos;ll connect my existing domain</div>
              </button>
              
              <button
                onClick={() => { setNeedsDomain(null); setStep(1); }}
                className={`
                  p-4 rounded-lg border-2 text-left transition-all
                  border-[#D1CEC8] bg-white hover:border-[#C9A227]/50
                `}
              >
                <div className="font-medium text-[#0B0B0B]">Decide later</div>
                <div className="text-sm text-[#6A6761]">I&apos;ll figure this out later</div>
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4 pt-4">
            <div className="text-center mb-4">
              <Upload className="h-8 w-8 text-[#6A6761] mx-auto mb-2" />
              <p className="text-sm text-[#3A3A3A]">Upload your parish logo (optional)</p>
            </div>
            
            {logoPreview ? (
              <div className="relative w-32 h-32 mx-auto">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="w-full h-full object-contain rounded-lg border border-[#D1CEC8]"
                />
                <button
                  onClick={removeLogo}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-[#6F2D2D] text-white rounded-full flex items-center justify-center hover:bg-[#5A2424]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Label
                htmlFor="logo-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#D1CEC8] rounded-lg cursor-pointer hover:border-[#C9A227]/50 transition-colors"
              >
                <Upload className="h-8 w-8 text-[#8C8881] mb-2" />
                <span className="text-sm text-[#6A6761]">Click to upload</span>
                <span className="text-xs text-[#8C8881]">PNG, JPG, or SVG</span>
                <Input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </Label>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setStep(0)}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                variant="gold"
                onClick={handleComplete}
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Saving...' : 'Complete'}
              </Button>
            </div>
            
            <button
              onClick={handleSkip}
              disabled={loading}
              className="w-full text-sm text-[#6A6761] hover:text-[#0B0B0B] transition-colors"
            >
              Skip for now
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

