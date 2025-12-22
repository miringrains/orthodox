'use client'

import { useNode } from '@craftjs/core'
import Link from 'next/link'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { SettingsAccordion } from '../controls/SettingsAccordion'
import { ColorPicker } from '../controls/ColorPicker'
import { getContrastTextColor } from '@/lib/color-utils'
import { useFontContext } from '../contexts/FontContext'
import { useAlignmentContext } from '../contexts/AlignmentContext'

interface ButtonBlockProps {
  text?: string
  url?: string
  variant?: 'solid' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  align?: 'left' | 'center' | 'right' | 'inherit'
  // Custom colors (solid variant)
  backgroundColor?: string
  textColor?: string
  // Border/outline settings
  borderColor?: string
}

export function ButtonBlock({ 
  text = 'Learn More', 
  url = '#', 
  variant = 'solid', 
  size = 'md', 
  fullWidth = false,
  align = 'inherit',
  backgroundColor = '#1a1a1a',
  textColor = '',
  borderColor = '',
}: ButtonBlockProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  const globalFonts = useFontContext()
  const effectiveFontFamily = globalFonts.buttonFont !== 'inherit' ? globalFonts.buttonFont : undefined
  
  // Inherit alignment from context if align is 'inherit'
  const alignmentContext = useAlignmentContext()
  const effectiveAlign = align === 'inherit' ? alignmentContext.align : align

  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }

  // Size classes with proper letter-spacing for buttons
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  }

  // Compute effective text color based on variant and background
  const effectiveTextColor = textColor || (
    variant === 'solid' 
      ? getContrastTextColor(backgroundColor) 
      : backgroundColor
  )

  const effectiveBorderColor = borderColor || backgroundColor

  // Build button styles
  const buttonStyles: React.CSSProperties = {
    fontFamily: effectiveFontFamily,
    fontWeight: 500,
    letterSpacing: '0.025em',
    borderRadius: '6px',
    transition: 'all 0.15s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    textDecoration: 'none',
  }

  if (variant === 'solid') {
    buttonStyles.backgroundColor = backgroundColor
    buttonStyles.color = effectiveTextColor
    buttonStyles.border = 'none'
  } else if (variant === 'outline') {
    buttonStyles.backgroundColor = 'transparent'
    buttonStyles.color = effectiveTextColor
    buttonStyles.border = `2px solid ${effectiveBorderColor}`
  } else if (variant === 'ghost') {
    buttonStyles.backgroundColor = 'transparent'
    buttonStyles.color = effectiveTextColor
    buttonStyles.border = 'none'
  }

  const buttonContent = (
    <span
      className={`${sizeClasses[size]} ${fullWidth ? 'w-full' : ''}`}
      style={buttonStyles}
    >
      {text}
    </span>
  )

  return (
    <div
      ref={(ref) => {
        if (ref) {
          connect(drag(ref))
        }
      }}
      className={`flex ${alignClasses[effectiveAlign]} ${isSelected ? 'ring-2 ring-primary rounded p-1' : ''}`}
    >
      {url && url !== '#' ? (
        <Link href={url} className={fullWidth ? 'w-full' : ''}>
          {buttonContent}
        </Link>
      ) : (
        buttonContent
      )}
    </div>
  )
}

function ButtonBlockSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }))

  const variantOptions = [
    { label: 'Solid', value: 'solid' },
    { label: 'Outline', value: 'outline' },
    { label: 'Ghost', value: 'ghost' },
  ]

  const sizeOptions = [
    { label: 'SM', value: 'sm' },
    { label: 'MD', value: 'md' },
    { label: 'LG', value: 'lg' },
  ]

  const alignOptions = [
    { label: 'Inherit', value: 'inherit' },
    { label: 'Left', value: 'left' },
    { label: 'Center', value: 'center' },
    { label: 'Right', value: 'right' },
  ]

  return (
    <div className="divide-y divide-gray-100">
      <SettingsAccordion title="Content" defaultOpen>
        <div>
          <Label className="text-sm font-medium">Button Text</Label>
          <Input
            value={props.text || ''}
            onChange={(e) => setProp((p: any) => (p.text = e.target.value))}
            className="mt-1"
            placeholder="Learn More"
          />
        </div>
        <div>
          <Label className="text-sm font-medium">Link URL</Label>
          <Input
            value={props.url || ''}
            onChange={(e) => setProp((p: any) => (p.url = e.target.value))}
            className="mt-1"
            placeholder="/contact or https://..."
          />
        </div>
      </SettingsAccordion>

      <SettingsAccordion title="Style" defaultOpen>
        <div>
          <Label className="text-sm font-medium">Variant</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {variantOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setProp((p: any) => (p.variant = option.value))}
                className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                  (props.variant || 'solid') === option.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-white hover:bg-gray-50 border-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Size</Label>
          <div className="flex gap-2 mt-2">
            {sizeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setProp((p: any) => (p.size = option.value))}
                className={`flex-1 px-2 py-1.5 text-xs rounded-md border transition-colors ${
                  (props.size || 'md') === option.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-white hover:bg-gray-50 border-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Alignment</Label>
          <div className="flex gap-2 mt-2">
            {alignOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setProp((p: any) => (p.align = option.value))}
                className={`flex-1 px-2 py-1.5 text-xs rounded-md border transition-colors ${
                  (props.align || 'inherit') === option.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-white hover:bg-gray-50 border-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="fullWidth"
            checked={props.fullWidth === true}
            onChange={(e) => setProp((p: any) => (p.fullWidth = e.target.checked))}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="fullWidth" className="text-sm">Full Width</Label>
        </div>
      </SettingsAccordion>

      <SettingsAccordion title="Colors">
        <ColorPicker
          label={props.variant === 'solid' ? 'Button Color' : 'Accent Color'}
          value={props.backgroundColor || '#1a1a1a'}
          onChange={(value) => setProp((p: any) => (p.backgroundColor = value))}
        />
        <p className="text-xs text-gray-500 mt-1">
          Text color auto-adjusts for contrast
        </p>

        {props.variant === 'outline' && (
          <ColorPicker
            label="Border Color"
            value={props.borderColor || ''}
            onChange={(value) => setProp((p: any) => (p.borderColor = value))}
            placeholder="Same as accent"
          />
        )}

        <ColorPicker
          label="Text Color Override"
          value={props.textColor || ''}
          onChange={(value) => setProp((p: any) => (p.textColor = value))}
          placeholder="Auto (contrast)"
        />
      </SettingsAccordion>
    </div>
  )
}

ButtonBlock.craft = {
  displayName: 'Button',
  props: {
    text: 'Learn More',
    url: '#',
    variant: 'solid',
    size: 'md',
    fullWidth: false,
    align: 'inherit',
    backgroundColor: '#1a1a1a',
    textColor: '',
    borderColor: '',
  },
  related: {
    settings: ButtonBlockSettings,
  },
}
