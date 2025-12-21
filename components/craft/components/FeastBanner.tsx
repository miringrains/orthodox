'use client'

import { useNode } from '@craftjs/core'
import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SettingsAccordion } from '../controls/SettingsAccordion'
import { ColorPicker } from '../controls/ColorPicker'
import { useFontContext } from '../contexts/FontContext'

/**
 * Feast Banner Component
 * 
 * Displays the current feast day, saint, or liturgical observance.
 * A distinctively Orthodox element that connects the website to the
 * living liturgical calendar of the Church.
 * 
 * Layout options:
 * - Simple: Just the feast name
 * - With troparion: Feast name + troparian/kontakion text
 * - With icon: Space for feast icon alongside text
 */

interface FeastBannerProps {
  feastTitle?: string
  feastSubtitle?: string
  troparion?: string
  showTroparion?: boolean
  layout?: 'simple' | 'centered' | 'with-icon'
  backgroundColor?: string
  textColor?: string
  accentColor?: string
  padding?: number
}

export function FeastBanner({
  feastTitle = 'Today\'s Feast',
  feastSubtitle = '',
  troparion = '',
  showTroparion = false,
  layout = 'centered',
  backgroundColor = '#1a1a2e',
  textColor = '#f5f0e8',
  accentColor = '#d4af37',
  padding = 32,
}: FeastBannerProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  const globalFonts = useFontContext()
  // Feast banner uses heading font
  const effectiveHeadingFont = globalFonts.headingFont !== 'inherit' ? globalFonts.headingFont : undefined

  return (
    <div
      ref={(ref) => {
        if (ref) {
          connect(drag(ref))
        }
      }}
      className={`
        w-full
        ${isSelected ? 'ring-2 ring-primary' : ''}
      `}
      style={{
        backgroundColor,
        padding: `${padding}px`,
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Decorative top line */}
        <div 
          className="w-16 h-0.5 mx-auto mb-4"
          style={{ backgroundColor: accentColor }}
        />
        
        {/* Feast Title */}
        <h2 
          className="text-center text-2xl md:text-3xl font-bold mb-2"
          style={{ 
            color: textColor,
            fontFamily: effectiveHeadingFont,
          }}
        >
          {feastTitle}
        </h2>
        
        {/* Subtitle (e.g., date or type of feast) */}
        {feastSubtitle && (
          <p 
            className="text-center text-xs uppercase font-medium mb-4"
            style={{ 
              color: accentColor,
              letterSpacing: '0.15em',
            }}
          >
            {feastSubtitle}
          </p>
        )}
        
        {/* Troparion/Kontakion */}
        {showTroparion && troparion && (
          <div className="mt-6 pt-6 border-t" style={{ borderColor: `${accentColor}40` }}>
            <p 
              className="text-center italic leading-relaxed"
              style={{ 
                color: textColor,
                opacity: 0.9,
                fontFamily: effectiveHeadingFont,
              }}
            >
              "{troparion}"
            </p>
          </div>
        )}
        
        {/* Decorative bottom line */}
        <div 
          className="w-16 h-0.5 mx-auto mt-4"
          style={{ backgroundColor: accentColor }}
        />
      </div>
    </div>
  )
}

function FeastBannerSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }))

  return (
    <div className="divide-y divide-gray-100">
      <SettingsAccordion title="Content" defaultOpen>
        <div>
          <Label className="text-sm font-medium">Feast Title</Label>
          <Input
            value={props.feastTitle || ''}
            onChange={(e) => setProp((p: any) => (p.feastTitle = e.target.value))}
            placeholder="The Nativity of Christ"
            className="mt-1"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Subtitle</Label>
          <Input
            value={props.feastSubtitle || ''}
            onChange={(e) => setProp((p: any) => (p.feastSubtitle = e.target.value))}
            placeholder="December 25 • Great Feast"
            className="mt-1"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showTroparion"
            checked={props.showTroparion || false}
            onChange={(e) => setProp((p: any) => (p.showTroparion = e.target.checked))}
            className="rounded"
          />
          <Label htmlFor="showTroparion" className="text-sm">Show Troparion/Kontakion</Label>
        </div>

        {props.showTroparion && (
          <div>
            <Label className="text-sm font-medium">Troparion Text</Label>
            <Textarea
              value={props.troparion || ''}
              onChange={(e) => setProp((p: any) => (p.troparion = e.target.value))}
              placeholder="Thy Nativity, O Christ our God..."
              rows={4}
              className="mt-1"
            />
          </div>
        )}
      </SettingsAccordion>

      <SettingsAccordion title="Appearance">
        <ColorPicker
          label="Background Color"
          value={props.backgroundColor || '#1a1a2e'}
          onChange={(value) => setProp((p: any) => (p.backgroundColor = value))}
        />

        <ColorPicker
          label="Text Color"
          value={props.textColor || '#f5f0e8'}
          onChange={(value) => setProp((p: any) => (p.textColor = value))}
        />

        <ColorPicker
          label="Accent Color"
          value={props.accentColor || '#d4af37'}
          onChange={(value) => setProp((p: any) => (p.accentColor = value))}
        />
      </SettingsAccordion>

      <SettingsAccordion title="Layout">
        <div>
          <Label className="text-sm font-medium">Vertical Padding</Label>
          <div className="mt-2">
            <input
              type="range"
              min={16}
              max={80}
              value={props.padding || 32}
              onChange={(e) => setProp((p: any) => (p.padding = parseInt(e.target.value)))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>16px</span>
              <span className="font-medium text-gray-700">{props.padding || 32}px</span>
              <span>80px</span>
            </div>
          </div>
        </div>
      </SettingsAccordion>
    </div>
  )
}

FeastBanner.craft = {
  displayName: 'Feast Banner',
  props: {
    feastTitle: 'Today\'s Feast',
    feastSubtitle: '',
    troparion: '',
    showTroparion: false,
    layout: 'centered',
    backgroundColor: '#1a1a2e',
    textColor: '#f5f0e8',
    accentColor: '#d4af37',
    padding: 32,
  },
  related: {
    settings: FeastBannerSettings,
  },
}


