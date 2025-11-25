'use client'

import { useNode } from '@craftjs/core'
import React, { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface TextBlockProps {
  content?: string
  align?: 'left' | 'center' | 'right'
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function TextBlock({ content, align, size }: TextBlockProps) {
  const {
    connectors: { connect, drag },
    isSelected,
    actions: { setProp },
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

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
        py-4 px-4
        ${isSelected ? 'ring-2 ring-primary rounded' : ''}
        ${isSelected && !isEditing ? 'cursor-text' : ''}
      `}
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
        />
      ) : (
        <div className="whitespace-pre-wrap max-w-4xl mx-auto">
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
    </div>
  )
}

TextBlock.craft = {
  displayName: 'Text Block',
  props: {
    content: 'Enter your text here',
    align: 'left',
    size: 'md',
  },
  related: {
    settings: TextBlockSettings,
  },
}
