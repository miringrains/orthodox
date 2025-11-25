'use client'

import { useNode } from '@craftjs/core'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface TextBlockProps {
  content?: string
  align?: 'left' | 'center' | 'right'
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function TextBlock({ content, align, size }: TextBlockProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

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
        ${isSelected ? 'ring-2 ring-primary' : ''}
      `}
    >
      <div className="whitespace-pre-wrap max-w-4xl mx-auto">
        {content || 'Enter your text here'}
      </div>
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
        />
      </div>
      <div>
        <Label>Alignment</Label>
        <select
          value={props.align || 'left'}
          onChange={(e) => setProp((props: any) => (props.align = e.target.value))}
          className="w-full p-2 border rounded"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
      <div>
        <Label>Size</Label>
        <select
          value={props.size || 'md'}
          onChange={(e) => setProp((props: any) => (props.size = e.target.value))}
          className="w-full p-2 border rounded"
        >
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
          <option value="xl">Extra Large</option>
        </select>
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
