'use client'

import { useNode } from '@craftjs/core'
import React, { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ColorPicker } from '../controls/ColorPicker'
import { FontSelector } from '../controls/FontSelector'
import { SpacingControl } from '../controls/SpacingControl'
import { BorderControl } from '../controls/BorderControl'
import { ShadowControl } from '../controls/ShadowControl'

interface HeadingProps {
  text?: string
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  align?: 'left' | 'center' | 'right'
  fontFamily?: string
  fontSize?: string
  fontWeight?: string
  textColor?: string
  backgroundColor?: string
  padding?: { top: number; right: number; bottom: number; left: number }
  margin?: { top: number; right: number; bottom: number; left: number }
  borderRadius?: number
  borderWidth?: number
  borderColor?: string
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none'
  boxShadow?: string
  lineHeight?: string
  letterSpacing?: string
}

export function Heading({
  text,
  level = 'h1',
  align = 'left',
  fontFamily,
  fontSize,
  fontWeight,
  textColor,
  backgroundColor,
  padding = { top: 0, right: 0, bottom: 0, left: 0 },
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
  borderRadius = 0,
  borderWidth = 0,
  borderColor = '#000000',
  borderStyle = 'solid',
  boxShadow,
  lineHeight,
  letterSpacing,
}: HeadingProps) {
  const {
    connectors: { connect, drag },
    isSelected,
    actions: { setProp },
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(text || '')

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  const defaultSizes = {
    h1: 'text-4xl md:text-5xl',
    h2: 'text-3xl md:text-4xl',
    h3: 'text-2xl md:text-3xl',
    h4: 'text-xl md:text-2xl',
    h5: 'text-lg md:text-xl',
    h6: 'text-base md:text-lg',
  }

  const paddingStyle = `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`
  const marginStyle = `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`
  const borderStyleStr = borderWidth > 0 ? `${borderWidth}px ${borderStyle} ${borderColor}` : 'none'

  const handleBlur = () => {
    setProp((props: any) => (props.text = editText))
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleBlur()
    }
    if (e.key === 'Escape') {
      setEditText(text || '')
      setIsEditing(false)
    }
  }

  const Tag = level

  return (
    <Tag
      ref={(ref) => {
        if (ref) {
          connect(drag(ref))
        }
      }}
      className={`
        ${defaultSizes[level]}
        ${alignClasses[align]}
        ${isSelected ? 'ring-2 ring-primary rounded' : ''}
        ${isSelected && !isEditing ? 'cursor-text' : ''}
      `}
      style={{
        fontFamily: fontFamily || undefined,
        fontSize: fontSize || undefined,
        fontWeight: fontWeight || undefined,
        color: textColor || undefined,
        backgroundColor: backgroundColor || undefined,
        padding: paddingStyle,
        margin: marginStyle,
        borderRadius: `${borderRadius}px`,
        border: borderStyleStr,
        boxShadow: boxShadow || undefined,
        lineHeight: lineHeight || undefined,
        letterSpacing: letterSpacing || undefined,
      }}
      onDoubleClick={() => {
        if (isSelected) {
          setIsEditing(true)
          setEditText(text || '')
        }
      }}
    >
      {isEditing && isSelected ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full border-2 border-primary rounded p-2 focus:outline-none"
          autoFocus
        />
      ) : (
        text || `Heading ${level.toUpperCase()}`
      )}
    </Tag>
  )
}

function HeadingSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }))

  return (
    <div className="space-y-4 p-4">
      <div>
        <Label>Text</Label>
        <Input
          value={props.text || ''}
          onChange={(e) => setProp((props: any) => (props.text = e.target.value))}
        />
      </div>

      <div>
        <Label>Heading Level</Label>
        <Select
          value={props.level || 'h1'}
          onValueChange={(value) => setProp((props: any) => (props.level = value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="h1">H1</SelectItem>
            <SelectItem value="h2">H2</SelectItem>
            <SelectItem value="h3">H3</SelectItem>
            <SelectItem value="h4">H4</SelectItem>
            <SelectItem value="h5">H5</SelectItem>
            <SelectItem value="h6">H6</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Alignment</Label>
        <Select
          value={props.align || 'left'}
          onValueChange={(value) => setProp((props: any) => (props.align = value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
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
        <Input
          type="text"
          value={props.fontSize || ''}
          onChange={(e) => setProp((props: any) => (props.fontSize = e.target.value))}
          placeholder="e.g., 32px, 2rem, 2em"
        />
      </div>

      <div>
        <Label>Font Weight</Label>
        <Select
          value={props.fontWeight || 'bold'}
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

      <div>
        <Label>Line Height</Label>
        <Input
          type="text"
          value={props.lineHeight || ''}
          onChange={(e) => setProp((props: any) => (props.lineHeight = e.target.value))}
          placeholder="e.g., 1.5, 1.2em, 24px"
        />
      </div>

      <div>
        <Label>Letter Spacing</Label>
        <Input
          type="text"
          value={props.letterSpacing || ''}
          onChange={(e) => setProp((props: any) => (props.letterSpacing = e.target.value))}
          placeholder="e.g., 0.05em, 1px"
        />
      </div>

      <ColorPicker
        label="Text Color"
        value={props.textColor || '#000000'}
        onChange={(value) => setProp((props: any) => (props.textColor = value))}
      />

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

Heading.craft = {
  displayName: 'Heading',
  props: {
    text: 'Heading Text',
    level: 'h1',
    align: 'left',
    fontFamily: 'inherit',
    fontSize: '',
    fontWeight: 'bold',
    textColor: '#000000',
    backgroundColor: '',
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    borderRadius: 0,
    borderWidth: 0,
    borderColor: '#000000',
    borderStyle: 'solid',
    boxShadow: 'none',
    lineHeight: '',
    letterSpacing: '',
  },
  related: {
    settings: HeadingSettings,
  },
}

