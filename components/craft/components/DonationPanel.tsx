'use client'

import { useNode } from '@craftjs/core'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { DollarSign, Target, Loader2, Heart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ColorPicker } from '../controls/ColorPicker'
import { SettingsAccordion } from '../controls/SettingsAccordion'
import { useParishContext } from '../contexts/ParishContext'
import { createClient } from '@/lib/supabase/client'

interface Project {
  id: string
  title: string
  description: string | null
  goal_amount: number | null
  current_amount: number
  is_visible: boolean
}

interface DonationFund {
  id: string
  name: string
  description: string | null
  fund_type: string
  is_default: boolean
}

interface DonationPanelProps {
  title?: string
  description?: string
  mode?: 'simple' | 'projects' | 'funds'
  showProgressBars?: boolean
  maxItems?: number
  // Theme-aware colors
  textColor?: string
  mutedTextColor?: string
  accentColor?: string
  cardBackground?: string
  cardBorder?: string
}

export function DonationPanel({ 
  title, 
  description,
  mode = 'simple',
  showProgressBars = true,
  maxItems = 3,
  textColor = '',
  mutedTextColor = '',
  accentColor = '',
  cardBackground = '',
  cardBorder = '',
}: DonationPanelProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  const { parishId, parishSlug, isEditorMode } = useParishContext()
  const [projects, setProjects] = useState<Project[]>([])
  const [funds, setFunds] = useState<DonationFund[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch data based on mode
  useEffect(() => {
    async function fetchData() {
      if (!parishId || mode === 'simple') {
        setLoading(false)
        return
      }

      try {
        const supabase = createClient()

        if (mode === 'projects') {
          const { data, error: fetchError } = await supabase
            .from('projects')
            .select('*')
            .eq('parish_id', parishId)
            .eq('is_visible', true)
            .order('created_at', { ascending: false })
            .limit(maxItems)

          if (fetchError) throw fetchError
          setProjects(data || [])
        } else if (mode === 'funds') {
          const { data, error: fetchError } = await supabase
            .from('donation_funds')
            .select('*')
            .eq('parish_id', parishId)
            .order('is_default', { ascending: false })
            .limit(maxItems)

          if (fetchError) throw fetchError
          setFunds(data || [])
        }
      } catch (err) {
        console.error('Error fetching donation data:', err)
        setError('Failed to load donation options')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [parishId, mode, maxItems])

  // Calculate progress percentage
  const getProgress = (current: number, goal: number | null) => {
    if (!goal || goal <= 0) return 0
    return Math.min((current / goal) * 100, 100)
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const styles = {
    card: {
      backgroundColor: cardBackground || undefined,
      borderColor: cardBorder || undefined,
    },
    title: { color: textColor || 'inherit' },
    muted: {
      color: mutedTextColor || 'inherit',
      opacity: mutedTextColor ? 1 : 0.7,
    },
    accent: { color: accentColor || 'var(--gold-600)' },
  }

  // Giving link href
  const givingHref = parishSlug ? `/p/${parishSlug}/giving` : '/giving'

  return (
    <Card
      ref={(ref) => {
        if (ref) {
          connect(drag(ref))
        }
      }}
      className={`${isSelected ? 'ring-2 ring-primary' : ''}`}
      style={styles.card}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2" style={styles.title}>
          <DollarSign className="h-5 w-5" style={styles.accent} />
          {title || 'Support Our Parish'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {description && (
          <p className="mb-4" style={styles.muted}>
            {description}
          </p>
        )}

        {loading ? (
          <div className="flex items-center gap-2 py-4" style={styles.muted}>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        ) : error ? (
          <p className="text-sm text-red-500 mb-4">{error}</p>
        ) : mode === 'projects' && projects.length > 0 ? (
          <div className="space-y-4 mb-4">
            {projects.map((project) => {
              const progress = getProgress(project.current_amount, project.goal_amount)
              return (
                <div key={project.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm" style={styles.title}>
                      {project.title}
                    </span>
                    {project.goal_amount && (
                      <span className="text-xs" style={styles.muted}>
                        {formatCurrency(project.current_amount)} / {formatCurrency(project.goal_amount)}
                      </span>
                    )}
                  </div>
                  {project.description && (
                    <p className="text-xs line-clamp-2" style={styles.muted}>
                      {project.description}
                    </p>
                  )}
                  {showProgressBars && project.goal_amount && (
                    <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : mode === 'funds' && funds.length > 0 ? (
          <div className="space-y-2 mb-4">
            {funds.map((fund) => (
              <div 
                key={fund.id} 
                className="flex items-center justify-between p-3 rounded-lg bg-stone-50 border border-stone-200"
              >
                <div>
                  <span className="font-medium text-sm" style={styles.title}>
                    {fund.name}
                  </span>
                  {fund.is_default && (
                    <span className="ml-2 text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                      Default
                    </span>
                  )}
                  {fund.description && (
                    <p className="text-xs mt-0.5" style={styles.muted}>
                      {fund.description}
                    </p>
                  )}
                </div>
                <Heart className="h-4 w-4" style={styles.accent} />
              </div>
            ))}
          </div>
        ) : mode !== 'simple' && (
          <p className="text-sm py-2 mb-4" style={styles.muted}>
            {isEditorMode 
              ? `No ${mode} configured yet. Add ${mode} in the admin panel.`
              : 'No donation options available.'}
          </p>
        )}

        <Button asChild className="w-full">
          <Link href={givingHref}>
            <DollarSign className="h-4 w-4 mr-2" />
            Donate Now
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

function DonationPanelSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }))

  return (
    <div className="divide-y divide-gray-100">
      <SettingsAccordion title="Content" defaultOpen>
        <div>
          <Label>Title</Label>
          <Input
            value={props.title || ''}
            onChange={(e) => setProp((props: any) => (props.title = e.target.value))}
            className="mt-1"
            placeholder="Support Our Parish"
          />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea
            value={props.description || ''}
            onChange={(e) => setProp((props: any) => (props.description = e.target.value))}
            className="mt-1"
            placeholder="Your generosity helps us serve our community"
            rows={2}
          />
        </div>
        <div>
          <Label>Display Mode</Label>
          <div className="flex gap-2 mt-2">
            {['simple', 'projects', 'funds'].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setProp((p: any) => (p.mode = mode))}
                className={`flex-1 px-3 py-2 text-xs rounded-md border transition-colors capitalize ${
                  (props.mode || 'simple') === mode
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white hover:bg-stone-50 border-stone-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Simple: Just text and button. Projects: Show active fundraising projects with progress. Funds: Show available donation funds.
          </p>
        </div>
        {props.mode === 'projects' && (
          <div className="flex items-center space-x-2 mt-3">
            <input
              type="checkbox"
              id="showProgressBars"
              checked={props.showProgressBars !== false}
              onChange={(e) => setProp((props: any) => (props.showProgressBars = e.target.checked))}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="showProgressBars" className="text-sm">Show progress bars</Label>
          </div>
        )}
        {props.mode !== 'simple' && (
          <div>
            <Label>Max Items</Label>
            <Input
              type="number"
              value={props.maxItems || 3}
              onChange={(e) => setProp((props: any) => (props.maxItems = parseInt(e.target.value) || 3))}
              className="mt-1"
              min={1}
              max={6}
            />
          </div>
        )}
      </SettingsAccordion>

      <SettingsAccordion title="Colors">
        <p className="text-xs text-muted-foreground mb-3">
          Leave empty to use defaults
        </p>
        <ColorPicker
          label="Text Color"
          value={props.textColor || ''}
          onChange={(value) => setProp((props: any) => (props.textColor = value))}
          placeholder="Inherit"
        />
        <ColorPicker
          label="Muted Text"
          value={props.mutedTextColor || ''}
          onChange={(value) => setProp((props: any) => (props.mutedTextColor = value))}
          placeholder="Inherit"
        />
        <ColorPicker
          label="Accent Color"
          value={props.accentColor || ''}
          onChange={(value) => setProp((props: any) => (props.accentColor = value))}
          placeholder="Gold"
        />
        <ColorPicker
          label="Card Background"
          value={props.cardBackground || ''}
          onChange={(value) => setProp((props: any) => (props.cardBackground = value))}
          placeholder="Default"
        />
        <ColorPicker
          label="Card Border"
          value={props.cardBorder || ''}
          onChange={(value) => setProp((props: any) => (props.cardBorder = value))}
          placeholder="Default"
        />
      </SettingsAccordion>
    </div>
  )
}

DonationPanel.craft = {
  displayName: 'Donation Panel',
  props: {
    title: 'Support Our Parish',
    description: 'Your generosity helps us serve our community',
    mode: 'simple',
    showProgressBars: true,
    maxItems: 3,
    textColor: '',
    mutedTextColor: '',
    accentColor: '',
    cardBackground: '',
    cardBorder: '',
  },
  related: {
    settings: DonationPanelSettings,
  },
}
