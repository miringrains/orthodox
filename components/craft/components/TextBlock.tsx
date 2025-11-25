'use client'

import { useNode } from '@craftjs/core'
import React, { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ColorPicker } from '../controls/ColorPicker'
import { FontSelector } from '../controls/FontSelector'
import { SpacingControl } from '../controls/SpacingControl'
import { BorderControl } from '../controls/BorderControl'
import { ShadowControl } from '../controls/ShadowControl'
import { useFontContext } from '../contexts/FontContext'

interface TextBlockProps {
  content?: string
  align?: 'left' | 'center' | 'right'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fontFamily?: string
  fontSize?: string
  fontWeight?: string
  textColor?: string
  backgroundColor?: string
  useContainer?: boolean
  contentMaxWidth?: string
  padding?: { top: number; right: number; bottom: number; left: number }
  margin?: { top: number; right: number; bottom: number; left: number }
  borderRadius?: number
  borderWidth?: number
  borderColor?: string
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none'
  boxShadow?: string
}

export function TextBlock({ 
  content, 
  align, 
  size,
  fontFamily,
  fontSize,
  fontWeight,
  textColor,
  backgroundColor,
  useContainer = true,
  contentMaxWidth = '4xl',
  padding = { top: 0, right: 0, bottom: 0, left: 0 },
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
  borderRadius = 0,
  borderWidth = 0,
  borderColor = '#000000',
  borderStyle = 'solid',
  boxShadow,
}: TextBlockProps) {
  const {
    connectors: { connect, drag },
    isSelected,
    actions: { setProp },
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))
  
  // Use global font settings if component doesn't override
  const globalFonts = useFontContext()
  const effectiveFontFamily = fontFamily && fontFamily !== 'inherit' ? fontFamily : globalFonts.fontFamily
  const effectiveFontSize = fontSize || globalFonts.baseFontSize
  const effectiveFontWeight = fontWeight && fontWeight !== 'normal' ? fontWeight : globalFonts.baseFontWeight

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

  const paddingStyle = `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`
  const marginStyle = `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`
  const borderStyleStr = borderWidth > 0 ? `${borderWidth}px ${borderStyle} ${borderColor}` : 'none'

  const handleBlur = () => {
    setProp((props: any) => (props.content = editContent))
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
        ${sizeClasses[size || 'md']} 
        ${alignClasses[align || 'left']} 
        ${isSelected ? 'ring-2 ring-primary rounded' : ''}
        ${isSelected && !isEditing ? 'cursor-text' : ''}
      `}
      style={{
        fontFamily: effectiveFontFamily !== 'inherit' ? effectiveFontFamily : undefined,
        fontSize: effectiveFontSize,
        fontWeight: effectiveFontWeight,
        color: textColor || undefined,
        backgroundColor: backgroundColor || undefined,
        padding: paddingStyle,
        margin: marginStyle,
        borderRadius: `${borderRadius}px`,
        border: borderStyleStr,
        boxShadow: boxShadow || undefined,
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
            fontFamily: effectiveFontFamily !== 'inherit' ? effectiveFontFamily : undefined,
            fontSize: effectiveFontSize,
            fontWeight: effectiveFontWeight,
            color: textColor || undefined,
            backgroundColor: backgroundColor || undefined,
          }}
        />
      ) : (
        <div 
          className={`whitespace-pre-wrap ${useContainer ? 'mx-auto px-4 md:px-6' : ''}`}
          style={{
            fontFamily: effectiveFontFamily !== 'inherit' ? effectiveFontFamily : undefined,
            fontSize: effectiveFontSize,
            fontWeight: effectiveFontWeight,
            color: textColor || undefined,
            backgroundColor: backgroundColor || undefined,
            maxWidth: useContainer && contentMaxWidth !== 'full' 
              ? contentMaxWidth === 'sm' ? '640px'
              : contentMaxWidth === 'md' ? '768px'
              : contentMaxWidth === 'lg' ? '1024px'
              : contentMaxWidth === 'xl' ? '1280px'
              : contentMaxWidth === '2xl' ? '1536px'
              : contentMaxWidth === '3xl' ? '1920px'
              : contentMaxWidth === '4xl' ? '56rem'
              : undefined
              : '100%',
          }}
        >
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

  return (
    <div className="space-y-4 p-4">
      <div>
        <Label>Content</Label>
        <Textarea
          value={props.content || ''}
          onChange={(e) => setProp((props: any) => (props.content = e.target.value))}
          rows={6}
        />
      </div>
      <div>
        <Label>Alignment</Label>
        <Select
          value={props.align || 'left'}
          onValueChange={(value) => setProp((props: any) => (props.align = value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select alignment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Size</Label>
        <Select
          value={props.size || 'md'}
          onValueChange={(value) => setProp((props: any) => (props.size = value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sm">Small</SelectItem>
            <SelectItem value="md">Medium</SelectItem>
            <SelectItem value="lg">Large</SelectItem>
            <SelectItem value="xl">Extra Large</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <FontSelector
        label="Font Family"
        value={props.fontFamily || 'inherit'}
        onChange={(value) => setProp((props: any) => (props.fontFamily = value))}
      />

      <div>
        <Label>Font Size</Label>
        <input
          type="text"
          value={props.fontSize || ''}
          onChange={(e) => setProp((props: any) => (props.fontSize = e.target.value))}
          placeholder="e.g., 16px, 1rem, 1.2em"
          className="w-full mt-2 px-3 py-2 border rounded-md"
        />
      </div>

      <div>
        <Label>Font Weight</Label>
        <Select
          value={props.fontWeight || 'normal'}
          onValueChange={(value) => setProp((props: any) => (props.fontWeight = value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="bold">Bold</SelectItem>
            <SelectItem value="300">Light</SelectItem>
            <SelectItem value="400">Regular</SelectItem>
            <SelectItem value="500">Medium</SelectItem>
            <SelectItem value="600">Semi Bold</SelectItem>
            <SelectItem value="700">Bold</SelectItem>
            <SelectItem value="800">Extra Bold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ColorPicker
        label="Text Color"
        value={props.textColor || '#000000'}
        onChange={(value) => setProp((props: any) => (props.textColor = value))}
      />

      <div>
        <Label>Use Container</Label>
        <div className="flex items-center space-x-2 mt-2">
          <input
            type="checkbox"
            checked={props.useContainer !== false}
            onChange={(e) => setProp((props: any) => (props.useContainer = e.target.checked))}
            className="h-4 w-4"
          />
          <Label className="text-sm">Wrap in container with horizontal padding</Label>
        </div>
      </div>

      {props.useContainer !== false && (
        <div>
          <Label>Content Max Width</Label>
          <Select
            value={props.contentMaxWidth || '4xl'}
            onValueChange={(value) => setProp((props: any) => (props.contentMaxWidth = value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Full Width</SelectItem>
              <SelectItem value="sm">Small (640px)</SelectItem>
              <SelectItem value="md">Medium (768px)</SelectItem>
              <SelectItem value="lg">Large (1024px)</SelectItem>
              <SelectItem value="xl">XL (1280px)</SelectItem>
              <SelectItem value="2xl">2XL (1536px)</SelectItem>
              <SelectItem value="3xl">3XL (1920px)</SelectItem>
              <SelectItem value="4xl">4XL (max-w-4xl)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <ColorPicker
        label="Background Color"
        value={props.backgroundColor || ''}
        onChange={(value) => setProp((props: any) => (props.backgroundColor = value))}
        placeholder="Transparent"
      />

      <SpacingControl
        label="Padding"
        value={props.padding || { top: 0, right: 0, bottom: 0, left: 0 }}
        onChange={(value) => setProp((props: any) => (props.padding = value))}
      />

      <SpacingControl
        label="Margin"
        value={props.margin || { top: 0, right: 0, bottom: 0, left: 0 }}
        onChange={(value) => setProp((props: any) => (props.margin = value))}
      />

      <BorderControl
        borderRadius={props.borderRadius || 0}
        borderWidth={props.borderWidth || 0}
        borderColor={props.borderColor || '#000000'}
        borderStyle={props.borderStyle || 'solid'}
        onBorderRadiusChange={(value) => setProp((props: any) => (props.borderRadius = value))}
        onBorderWidthChange={(value) => setProp((props: any) => (props.borderWidth = value))}
        onBorderColorChange={(value) => setProp((props: any) => (props.borderColor = value))}
        onBorderStyleChange={(value) => setProp((props: any) => (props.borderStyle = value))}
      />

      <ShadowControl
        value={props.boxShadow || 'none'}
        onChange={(value) => setProp((props: any) => (props.boxShadow = value))}
      />
    </div>
  )
}

TextBlock.craft = {
  displayName: 'Text Block',
  props: {
    content: 'Enter your text here',
    align: 'left',
    size: 'md',
    fontFamily: 'inherit',
    fontSize: '',
    fontWeight: 'normal',
    textColor: '#000000',
    backgroundColor: '',
    useContainer: true,
    contentMaxWidth: '4xl',
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    borderRadius: 0,
    borderWidth: 0,
    borderColor: '#000000',
    borderStyle: 'solid',
    boxShadow: 'none',
  },
  related: {
    settings: TextBlockSettings,
  },
}
