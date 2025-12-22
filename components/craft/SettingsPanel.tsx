'use client'

import { useEditor } from '@craftjs/core'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Copy, Eye, EyeOff } from 'lucide-react'
import React from 'react'
import { useParams } from 'next/navigation'
import { PresetPicker, SavePresetButton } from './PresetPicker'
import { getPresetsForComponent } from '@/lib/presets/default-presets'

// Components that support presets
const PRESET_COMPONENTS = ['HeroSection', 'Section', 'Divider', 'Navbar']

export function SettingsPanel() {
  const { selected, actions, query } = useEditor((state) => {
    // Use the correct Craft.js API: state.events.selected is an array
    const [currentNodeId] = state.events.selected || []
    
    if (!currentNodeId) {
      return { selected: null }
    }

    const node = state.nodes[currentNodeId]
    if (!node || !node.data) {
      return { selected: null }
    }

    // Get settings from node.related (Craft.js populates this automatically)
    // If not populated, get from resolver component
    let settings = node.related?.settings
    
    if (!settings) {
      // Try to get from resolver component
      const nodeData = node.data as any
      const componentType = nodeData?.type?.resolvedName || nodeData?.type
      const resolver = state.options?.resolver || {}
      const Component = componentType ? resolver[componentType] : null
      
      if (Component && typeof Component !== 'string') {
        const componentCraft = (Component as any)?.craft
        if (componentCraft?.related?.settings) {
          settings = componentCraft.related.settings
        }
      }
    }

    // Get display name
    const nodeData = node.data as any
    const componentType = nodeData?.type?.resolvedName || nodeData?.type
    const resolver = state.options?.resolver || {}
    const Component = componentType ? resolver[componentType] : null
    const displayName = Component && typeof Component !== 'string'
      ? (Component as any)?.craft?.displayName || nodeData?.displayName || nodeData?.name || componentType || 'Component'
      : nodeData?.displayName || nodeData?.name || componentType || 'Component'

    // Check if deletable (ROOT node is not deletable)
    const isDeletable = currentNodeId !== 'ROOT'

    return {
      selected: {
        id: currentNodeId,
        name: displayName,
        settings: settings,
        componentType: componentType || 'unknown',
        isDeletable: isDeletable,
        isHidden: nodeData?.custom?.hidden || false,
      },
    }
  })

  const handleDuplicate = () => {
    if (!selected) return
    try {
      // Serialize entire editor and extract node tree
      const serialized = query.serialize()
      const content = typeof serialized === 'string' ? JSON.parse(serialized) : serialized
      
      // Extract the node tree starting from selected.id
      const extractNodeTree = (nodeId: string, tree: any): any => {
        if (!tree || !tree[nodeId]) return null
        
        const node = tree[nodeId]
        const result: any = {
          type: node.type,
          props: { ...node.props },
          nodes: {},
          custom: { ...node.custom },
        }
        
        if (node.nodes && Array.isArray(node.nodes)) {
          node.nodes.forEach((childId: string) => {
            const childTree = extractNodeTree(childId, tree)
            if (childTree) {
              result.nodes[childId] = childTree
            }
          })
        }
        
        return result
      }
      
      // Find parent by searching through the tree
      const findParent = (tree: any, targetId: string, currentParent: string = 'ROOT'): string | null => {
        if (!tree || typeof tree !== 'object') return null
        
        for (const [id, node] of Object.entries(tree)) {
          if (id === targetId) return currentParent
          if (node && typeof node === 'object' && (node as any).nodes) {
            const found = findParent((node as any).nodes, targetId, id)
            if (found) return found
          }
        }
        return null
      }
      
      const nodeTree = extractNodeTree(selected.id, content)
      if (nodeTree) {
        const newNodeId = `node_${Date.now()}`
        const newTree: any = { [newNodeId]: nodeTree }
        
        const foundParent = findParent(content, selected.id)
        const parentId = foundParent || 'ROOT'
        
        actions.addNodeTree(newTree, parentId)
      }
    } catch (error) {
      console.error('Error duplicating component:', error)
    }
  }

  const handleToggleVisibility = () => {
    if (!selected) return
    const node = query.node(selected.id)
    const isHidden = node.get().data.custom?.hidden || false
    actions.setCustom(selected.id, (custom: any) => {
      custom.hidden = !isHidden
    })
  }

  // Get parish ID from URL params (if available)
  const params = useParams()
  const pageId = params?.id as string | undefined

  // Check if current component supports presets
  const hasPresets = selected && PRESET_COMPONENTS.includes(selected.componentType)
  const presetCount = hasPresets ? getPresetsForComponent(selected.componentType).length : 0

  return (
    <div className="p-4">
      {selected ? (
        <div className="space-y-4">
          <div className="border-b pb-2 flex items-center justify-between">
            <Label className="text-base font-semibold">{selected.name}</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleVisibility}
                title={selected.isHidden ? 'Show component' : 'Hide component'}
              >
                {selected.isHidden ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDuplicate}
                title="Duplicate component (Cmd/Ctrl+D)"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Preset Buttons - shown for components with presets */}
          {hasPresets && presetCount > 0 && (
            <div className="flex gap-2 pb-2 border-b">
              <div className="flex-1">
                <PresetPicker 
                  componentType={selected.componentType} 
                  parishId={pageId}
                />
              </div>
              <div className="flex-1">
                <SavePresetButton 
                  componentType={selected.componentType} 
                  parishId={pageId}
                />
              </div>
            </div>
          )}
          
          {selected.settings ? (
            <div className="space-y-4">
              {typeof selected.settings === 'function' 
                ? React.createElement(selected.settings)
                : selected.settings
              }
            </div>
          ) : (
            <div className="text-sm text-muted-foreground py-4 space-y-2">
              <p className="font-medium">No settings available for this component</p>
              <div className="text-xs space-y-1 bg-gray-100 p-3 rounded">
                <p><strong>Component:</strong> {selected.name}</p>
                <p><strong>Type:</strong> {selected.componentType || 'unknown'}</p>
                <p><strong>Settings Function:</strong> {selected.settings ? 'Found' : 'Not found'}</p>
                <p><strong>Debug:</strong> Check browser console for component resolution details</p>
              </div>
            </div>
          )}
          <div className="flex gap-2 pt-4 border-t">
            {selected.isDeletable && (
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => {
                  actions.delete(selected.id)
                }}
              >
                Delete Component
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-8">
          <p className="text-sm">Select a component to edit its settings</p>
        </div>
      )}
    </div>
  )
}
