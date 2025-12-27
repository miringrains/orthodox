'use client'

import { useNode } from '@craftjs/core'
import { useState, useEffect } from 'react'
import { MapPin, Navigation, Loader2, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ColorPicker } from '../controls/ColorPicker'
import { SettingsAccordion } from '../controls/SettingsAccordion'
import { useParishContext } from '../contexts/ParishContext'
import { createClient } from '@/lib/supabase/client'

interface LocationData {
  address?: string
  city?: string
  state?: string
  zip?: string
  lat?: number
  lng?: number
}

interface LocationMapProps {
  title?: string
  showDirectionsButton?: boolean
  height?: number
  zoom?: number
  // Manual address override
  manualAddress?: string
  // Theme-aware colors
  textColor?: string
  mutedTextColor?: string
  accentColor?: string
  cardBackground?: string
  cardBorder?: string
}

export function LocationMap({ 
  title,
  showDirectionsButton = true,
  height = 300,
  zoom = 15,
  manualAddress = '',
  textColor = '',
  mutedTextColor = '',
  accentColor = '',
  cardBackground = '',
  cardBorder = '',
}: LocationMapProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  const { parishId, isEditorMode } = useParishContext()
  const [location, setLocation] = useState<LocationData | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch parish location
  useEffect(() => {
    async function fetchLocation() {
      if (!parishId) {
        setLoading(false)
        return
      }

      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('parishes')
          .select('location')
          .eq('id', parishId)
          .single()

        if (error) throw error
        setLocation(data?.location as LocationData || null)
      } catch (err) {
        console.error('Error fetching location:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLocation()
  }, [parishId])

  // Build full address string
  const getFullAddress = () => {
    if (manualAddress) return manualAddress
    if (!location) return ''
    
    const parts = []
    if (location.address) parts.push(location.address)
    if (location.city) parts.push(location.city)
    if (location.state) parts.push(location.state)
    if (location.zip) parts.push(location.zip)
    
    return parts.join(', ')
  }

  // Generate Google Maps embed URL
  const getEmbedUrl = () => {
    const address = getFullAddress()
    if (!address) return null
    
    const encodedAddress = encodeURIComponent(address)
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodedAddress}&zoom=${zoom}`
  }

  // Generate directions URL
  const getDirectionsUrl = () => {
    const address = getFullAddress()
    if (!address) return ''
    
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
  }

  const fullAddress = getFullAddress()
  const embedUrl = getEmbedUrl()

  const styles = {
    card: {
      backgroundColor: cardBackground || undefined,
      borderColor: cardBorder || undefined,
    },
    title: { color: textColor || 'inherit' },
    muted: { color: mutedTextColor || 'inherit', opacity: mutedTextColor ? 1 : 0.7 },
    accent: { color: accentColor || 'var(--gold-600)' },
  }

  return (
    <Card
      ref={(ref) => {
        if (ref) {
          connect(drag(ref))
        }
      }}
      className={`overflow-hidden ${isSelected ? 'ring-2 ring-primary' : ''}`}
      style={styles.card}
    >
      {title && (
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2" style={styles.title}>
            <MapPin className="h-5 w-5" style={styles.accent} />
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={title ? 'pt-2' : 'p-0'}>
        {loading ? (
          <div 
            className="flex items-center justify-center bg-stone-100"
            style={{ height: `${height}px` }}
          >
            <Loader2 className="h-6 w-6 animate-spin text-stone-400" />
          </div>
        ) : !fullAddress ? (
          <div 
            className="flex flex-col items-center justify-center bg-stone-100 text-center px-4"
            style={{ height: `${height}px`, ...styles.muted }}
          >
            <MapPin className="h-12 w-12 mb-3 opacity-50" />
            <p>
              {isEditorMode 
                ? 'No address configured. Add location in parish settings or enter a manual address below.'
                : 'Location not available.'}
            </p>
          </div>
        ) : (
          <div>
            {/* Map embed */}
            <div 
              className="w-full bg-stone-100"
              style={{ height: `${height}px` }}
            >
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-stone-500">
                  Unable to load map
                </div>
              )}
            </div>
            
            {/* Address and directions */}
            <div className="p-4">
              <p className="text-sm mb-3" style={styles.title}>
                {fullAddress}
              </p>
              {showDirectionsButton && (
                <Button variant="outline" size="sm" asChild>
                  <a 
                    href={getDirectionsUrl()} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Get Directions
                    <ExternalLink className="h-3 w-3 ml-2" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function LocationMapSettings() {
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
            placeholder="Leave empty to hide"
          />
        </div>
        <div>
          <Label>Manual Address Override</Label>
          <Textarea
            value={props.manualAddress || ''}
            onChange={(e) => setProp((props: any) => (props.manualAddress = e.target.value))}
            className="mt-1"
            placeholder="Leave empty to use parish location from settings"
            rows={2}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter a full address to override the parish location
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-3">
          <input
            type="checkbox"
            id="showDirectionsButton"
            checked={props.showDirectionsButton !== false}
            onChange={(e) => setProp((props: any) => (props.showDirectionsButton = e.target.checked))}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="showDirectionsButton" className="text-sm">Show "Get Directions" button</Label>
        </div>
      </SettingsAccordion>

      <SettingsAccordion title="Layout">
        <div>
          <Label>Map Height (px)</Label>
          <Input
            type="number"
            value={props.height || 300}
            onChange={(e) => setProp((props: any) => (props.height = parseInt(e.target.value) || 300))}
            className="mt-1"
            min={150}
            max={600}
          />
        </div>
        <div>
          <Label>Zoom Level</Label>
          <Input
            type="number"
            value={props.zoom || 15}
            onChange={(e) => setProp((props: any) => (props.zoom = parseInt(e.target.value) || 15))}
            className="mt-1"
            min={10}
            max={20}
          />
          <p className="text-xs text-muted-foreground mt-1">
            10 = City view, 15 = Street view, 20 = Building view
          </p>
        </div>
      </SettingsAccordion>

      <SettingsAccordion title="Colors">
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

LocationMap.craft = {
  displayName: 'Location Map',
  props: {
    title: 'Find Us',
    showDirectionsButton: true,
    height: 300,
    zoom: 15,
    manualAddress: '',
    textColor: '',
    mutedTextColor: '',
    accentColor: '',
    cardBackground: '',
    cardBorder: '',
  },
  related: {
    settings: LocationMapSettings,
  },
}

