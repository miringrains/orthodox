'use client'

import { Element, useNode } from '@craftjs/core'
import React from 'react'

interface DropZoneProps {
  id: string
  minHeight?: number
  placeholder?: string
  className?: string
}

/**
 * A styled drop zone wrapper for Craft.js canvas elements.
 * Shows a visible placeholder when empty to indicate where components can be dropped.
 */
export function DropZone({ 
  id, 
  minHeight = 80, 
  placeholder = 'Drop components here',
  className = '',
}: DropZoneProps) {
  return (
    <Element
      is={DropZoneContent}
      canvas
      id={id}
      minHeight={minHeight}
      placeholder={placeholder}
      className={className}
    />
  )
}

interface DropZoneContentProps {
  minHeight?: number
  placeholder?: string
  className?: string
  children?: React.ReactNode
}

/**
 * Inner content component that detects if it has children
 * and shows appropriate empty state styling.
 */
export function DropZoneContent({ 
  minHeight = 80, 
  placeholder = 'Drop components here',
  className = '',
  children,
}: DropZoneContentProps) {
  const {
    connectors: { connect },
    id,
  } = useNode((state) => ({
    id: state.id,
  }))

  // Check if we have actual children (not just whitespace/comments)
  const hasChildren = React.Children.count(children) > 0

  return (
    <div
      ref={(ref) => {
        if (ref) connect(ref)
      }}
      className={`
        relative
        ${!hasChildren ? 'border-2 border-dashed border-gray-300 rounded-lg' : ''}
        ${className}
      `}
      style={{
        minHeight: !hasChildren ? `${minHeight}px` : undefined,
      }}
    >
      {!hasChildren && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-sm text-gray-400 select-none">
            {placeholder}
          </span>
        </div>
      )}
      {children}
    </div>
  )
}

// Craft.js configuration for the drop zone content
DropZoneContent.craft = {
  displayName: 'DropZone',
  props: {
    minHeight: 80,
    placeholder: 'Drop components here',
    className: '',
  },
}

