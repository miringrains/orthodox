'use client'

import { useEditor } from '@craftjs/core'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import React from 'react'

export function SettingsPanel() {
  const { selected, actions } = useEditor((state, query) => {
    const currentlySelectedNodeId = query.getEvent('selected').last()
    let selected

    if (currentlySelectedNodeId) {
      const node = state.nodes[currentlySelectedNodeId]
      const nodeData = node?.data as any
      
      // Get the component type - Craft.js stores it as type.resolvedName
      const componentType = nodeData?.type?.resolvedName || nodeData?.type
      const resolver = state.options?.resolver || {}
      const Component = resolver[componentType]
      
      // Get settings from component's craft.related.settings
      const settings = Component && typeof Component !== 'string'
        ? (Component as any)?.craft?.related?.settings
        : undefined

      const displayName = Component && typeof Component !== 'string'
        ? (Component as any)?.craft?.displayName || nodeData?.displayName || nodeData?.name || 'Component'
        : nodeData?.displayName || nodeData?.name || 'Component'

      selected = {
        id: currentlySelectedNodeId,
        name: displayName,
        settings: settings,
        isDeletable: query.node(currentlySelectedNodeId).isDeletable(),
      }
    }

    return {
      selected,
    }
  })

  return (
    <div className="p-4">
      {selected ? (
        <div className="space-y-4">
          <div className="border-b pb-2">
            <Label className="text-base font-semibold">{selected.name}</Label>
          </div>
          {selected.settings ? (
            React.createElement(selected.settings)
          ) : (
            <div className="text-sm text-muted-foreground py-4">
              <p>No settings available for this component</p>
              <p className="text-xs mt-2">Debug: Settings component not found</p>
            </div>
          )}
          {selected.isDeletable && (
            <Button
              variant="destructive"
              className="w-full mt-4"
              onClick={() => {
                actions.delete(selected.id)
              }}
            >
              Delete Component
            </Button>
          )}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-8">
          <p className="text-sm">Select a component to edit its settings</p>
        </div>
      )}
    </div>
  )
}
