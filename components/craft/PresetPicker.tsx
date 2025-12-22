'use client'

import { useState, useEffect } from 'react'
import { useNode, useEditor } from '@craftjs/core'
import { Button } from '@/components/ui/button'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription 
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sparkles, Save, Check, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getPresetsForComponent, type ComponentPreset } from '@/lib/presets/default-presets'

interface PresetPickerProps {
  componentType: string
  parishId?: string
}

export function PresetPicker({ componentType, parishId }: PresetPickerProps) {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }))
  
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [customPresets, setCustomPresets] = useState<ComponentPreset[]>([])
  const [loading, setLoading] = useState(false)
  const [applied, setApplied] = useState<string | null>(null)

  // Get default presets for this component type
  const defaultPresets = getPresetsForComponent(componentType)

  // Fetch custom presets from database
  useEffect(() => {
    if (!parishId) return

    async function fetchCustomPresets() {
      // Cast to any to bypass type checking for new table not in generated types
      const { data } = await (supabase as any)
        .from('component_presets')
        .select('*')
        .eq('component_type', componentType)
        .or(`parish_id.eq.${parishId},is_global.eq.true`)
        .order('name')

      if (data) {
        setCustomPresets(data.map(p => ({
          id: p.id,
          name: p.name,
          componentType: p.component_type,
          props: p.props,
          isGlobal: p.is_global,
        })))
      }
    }

    fetchCustomPresets()
  }, [parishId, componentType, supabase])

  const applyPreset = (preset: ComponentPreset) => {
    // Apply preset props to current component
    setProp((currentProps: any) => {
      Object.entries(preset.props).forEach(([key, value]) => {
        currentProps[key] = value
      })
    })
    setApplied(preset.id)
    setTimeout(() => {
      setApplied(null)
      setOpen(false)
    }, 500)
  }

  const allPresets = [...defaultPresets, ...customPresets]

  if (allPresets.length === 0) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <Sparkles className="h-4 w-4 mr-2" />
          Apply Preset
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Apply Preset</DialogTitle>
          <DialogDescription>
            Choose a preset to quickly configure this component
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {defaultPresets.length > 0 && (
            <>
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                Built-in Presets
              </Label>
              <div className="grid gap-2">
                {defaultPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset)}
                    className="flex items-center justify-between p-3 text-left border rounded-lg hover:bg-muted transition-colors"
                  >
                    <span className="font-medium text-sm">{preset.name}</span>
                    {applied === preset.id && (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}

          {customPresets.length > 0 && (
            <>
              <Label className="text-xs text-muted-foreground uppercase tracking-wide mt-4 block">
                Custom Presets
              </Label>
              <div className="grid gap-2">
                {customPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset)}
                    className="flex items-center justify-between p-3 text-left border rounded-lg hover:bg-muted transition-colors"
                  >
                    <span className="font-medium text-sm">{preset.name}</span>
                    {applied === preset.id && (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface SavePresetButtonProps {
  componentType: string
  parishId?: string
}

export function SavePresetButton({ componentType, parishId }: SavePresetButtonProps) {
  const { props } = useNode((node) => ({
    props: node.data.props,
  }))
  
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Please enter a name')
      return
    }
    if (!parishId) {
      setError('Parish ID not available')
      return
    }

    setSaving(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      // Cast to any to bypass type checking for new table not in generated types
      const { error: insertError } = await (supabase as any)
        .from('component_presets')
        .insert({
          parish_id: parishId,
          name: name.trim(),
          component_type: componentType,
          props: props,
          is_global: false,
          created_by: user?.id,
        })

      if (insertError) throw insertError

      setOpen(false)
      setName('')
    } catch (err: any) {
      console.error('Error saving preset:', err)
      setError(err.message || 'Failed to save preset')
    } finally {
      setSaving(false)
    }
  }

  if (!parishId) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Save as Preset
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Save as Preset</DialogTitle>
          <DialogDescription>
            Save the current settings as a reusable preset
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Preset Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., My Custom Hero Style"
              className="mt-1"
            />
          </div>
          
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          
          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Preset
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

