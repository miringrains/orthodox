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
      
      // Craft.js stores settings in node.related.settings
      // If not found there, get from Component.craft.related.settings
      let settings = node?.related?.settings
      
      // If not in node.related, get from component definition
      if (!settings && Component && typeof Component !== 'string') {
        const componentCraft = (Component as any)?.craft
        settings = componentCraft?.related?.settings
      }

      const displayName = Component && typeof Component !== 'string'
        ? (Component as any)?.craft?.displayName || nodeData?.displayName || nodeData?.name || 'Component'
        : nodeData?.displayName || nodeData?.name || 'Component'

      selected = {
        id: currentlySelectedNodeId,
        name: displayName,
        settings: settings,
        componentType: componentType,
        hasComponent: !!Component,
        hasCraft: !!(Component && typeof Component !== 'string' && (Component as any)?.craft),
        hasRelated: !!(Component && typeof Component !== 'string' && (Component as any)?.craft?.related),
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
            <div className="text-sm text-muted-foreground py-4 space-y-2">
              <p className="font-medium">No settings available for this component</p>
              <div className="text-xs space-y-1 bg-gray-100 p-3 rounded">
                <p><strong>Component:</strong> {selected.name}</p>
                <p><strong>Type:</strong> {selected.componentType || 'unknown'}</p>
                <p><strong>Has Component:</strong> {selected.hasComponent ? 'Yes' : 'No'}</p>
                <p><strong>Has Craft:</strong> {selected.hasCraft ? 'Yes' : 'No'}</p>
                <p><strong>Has Related:</strong> {selected.hasRelated ? 'Yes' : 'No'}</p>
                <p><strong>Settings Function:</strong> {selected.settings ? 'Found' : 'Not found'}</p>
              </div>
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
