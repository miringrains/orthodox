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
      selected = {
        id: currentlySelectedNodeId,
        name: nodeData?.displayName || nodeData?.name || 'Component',
        settings: nodeData?.related?.settings,
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
          <div>
            <Label>Component: {selected.name}</Label>
          </div>
          {selected.settings && React.createElement(selected.settings)}
          {selected.isDeletable && (
            <Button
              variant="destructive"
              onClick={() => {
                actions.delete(selected.id)
              }}
            >
              Delete
            </Button>
          )}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-8">
          <p>Select a component to edit its settings</p>
        </div>
      )}
    </div>
  )
}

