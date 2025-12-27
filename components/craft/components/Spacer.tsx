'use client'

import { useNode } from '@craftjs/core'
import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface SpacerProps {
  height?: number
}

export function Spacer({ height = 40 }: SpacerProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  return (
    <div
      ref={(ref) => {
        if (ref) {
          connect(drag(ref))
        }
      }}
      className={`
        w-full
        ${isSelected ? 'ring-2 ring-primary rounded' : ''}
      `}
      style={{
        height: `${height}px`,
        minHeight: `${height}px`,
      }}
    />
  )
}

function SpacerSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }))

  return (
    <div className="space-y-4 p-4">
      <div>
        <Label>Height (px)</Label>
        <Input
          type="number"
          value={props.height || 40}
          onChange={(e) => setProp((props: any) => (props.height = parseInt(e.target.value) || 40))}
        />
      </div>
    </div>
  )
}

Spacer.craft = {
  displayName: 'Spacer',
  props: {
    height: 40,
  },
  related: {
    settings: SpacerSettings,
  },
}


