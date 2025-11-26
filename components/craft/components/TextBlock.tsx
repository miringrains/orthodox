'use client'

import { useNode } from '@craftjs/core'
import React, { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useFontContext } from '../contexts/FontContext'
import { SettingsAccordion } from '../controls/SettingsAccordion'
import { ColorPicker } from '../controls/ColorPicker'

interface TextBlockProps {
  content?: string
  align?: 'left' | 'center' | 'right'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  textColor?: string
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold'
}

export function TextBlock({ 
  content, 
  align = 'left', 
  size = 'md',
  textColor = '',
  fontWeight = 'normal',
}: TextBlockProps) {
  const {
    connectors: { connect, drag },
    isSelected,
    actions: { setProp },
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))
  
  const globalFonts = useFontContext()

  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(content || '')

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-2xl',
  }

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }

  const handleBlur = () => {
    setProp((p: any) => (p.content = editContent))
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleBlur()
    }
    if (e.key === 'Escape') {
      setEditContent(content || '')
      setIsEditing(false)
    }
  }

  return (
    <div
      ref={(ref) => {
        if (ref) {
          connect(drag(ref))
        }
      }}
      className={`
        ${sizeClasses[size]} 
        ${alignClasses[align]} 
        ${weightClasses[fontWeight]}
        ${isSelected ? 'ring-2 ring-primary rounded' : ''}
        ${isSelected && !isEditing ? 'cursor-text' : ''}
      `}
      style={{
        fontFamily: globalFonts.fontFamily !== 'inherit' ? globalFonts.fontFamily : undefined,
        color: textColor || undefined,
      }}
      onDoubleClick={() => {
        if (isSelected) {
          setIsEditing(true)
          setEditContent(content || '')
        }
      }}
    >
      {isEditing && isSelected ? (
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full border-2 border-primary rounded p-2 focus:outline-none resize-none"
          autoFocus
          rows={Math.max(3, editContent.split('\n').length)}
          style={{
            fontFamily: globalFonts.fontFamily !== 'inherit' ? globalFonts.fontFamily : undefined,
            color: textColor || undefined,
          }}
        />
      ) : (
        <div className="whitespace-pre-wrap">
          {content || 'Double-click to edit text'}
        </div>
      )}
    </div>
  )
}

function TextBlockSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }))

  const alignOptions = [
    { label: 'Left', value: 'left' },
    { label: 'Center', value: 'center' },
    { label: 'Right', value: 'right' },
  ]

  const sizeOptions = [
    { label: 'SM', value: 'sm' },
    { label: 'MD', value: 'md' },
    { label: 'LG', value: 'lg' },
    { label: 'XL', value: 'xl' },
  ]

  const weightOptions = [
    { label: 'Normal', value: 'normal' },
    { label: 'Medium', value: 'medium' },
    { label: 'Semi', value: 'semibold' },
    { label: 'Bold', value: 'bold' },
  ]

  return (
    <div className="divide-y divide-gray-100">
      <SettingsAccordion title="Content" defaultOpen>
        <div>
          <Label className="text-sm font-medium">Text</Label>
          <Textarea
            value={props.content || ''}
            onChange={(e) => setProp((p: any) => (p.content = e.target.value))}
            rows={4}
            className="mt-1"
            placeholder="Enter your text..."
          />
          <p className="text-xs text-gray-500 mt-1">Or double-click the text to edit directly</p>
        </div>
      </SettingsAccordion>

      <SettingsAccordion title="Style" defaultOpen>
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
          <Label className="text-sm font-medium">Weight</Label>
          <div className="flex gap-2 mt-2">
            {weightOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setProp((p: any) => (p.fontWeight = option.value))}
                className={`flex-1 px-2 py-1.5 text-xs rounded-md border transition-colors ${
                  (props.fontWeight || 'normal') === option.value
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
                  (props.align || 'left') === option.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-white hover:bg-gray-50 border-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <ColorPicker
          label="Text Color"
          value={props.textColor || ''}
          onChange={(value) => setProp((p: any) => (p.textColor = value))}
          placeholder="inherit"
        />
      </SettingsAccordion>
    </div>
  )
}

TextBlock.craft = {
  displayName: 'Text Block',
  props: {
    content: 'Enter your text here',
    align: 'left',
    size: 'md',
    textColor: '',
    fontWeight: 'normal',
  },
  related: {
    settings: TextBlockSettings,
  },
}
