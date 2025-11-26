'use client'

import { useNode, useEditor } from '@craftjs/core'
import React from 'react'

interface ColumnCanvasProps {
  children?: React.ReactNode
}

/**
 * A canvas element that can receive dropped components.
 * Shows a placeholder when empty and editor is enabled.
 */
export function ColumnCanvas({ children }: ColumnCanvasProps) {
  const { connectors: { connect } } = useNode()
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }))
  
  const hasChildren = React.Children.count(children) > 0
  
  return (
    <div
      ref={(ref) => {
        if (ref) connect(ref)
      }}
      className={`min-h-[80px] ${!hasChildren && enabled ? 'border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center' : ''}`}
    >
      {!hasChildren && enabled ? (
        <span className="text-sm text-gray-400 select-none pointer-events-none">Drop here</span>
      ) : (
        children
      )}
    </div>
  )
}

ColumnCanvas.craft = {
  displayName: 'Column',
  rules: {
    canDrag: () => false,
  },
}

