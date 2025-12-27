'use client'

import { useEditor } from '@craftjs/core'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Copy, Eye, EyeOff, Trash2 } from 'lucide-react'
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
          {/* Component header */}
          <div className="pb-3 border-b border-stone-200 flex items-center justify-between">
            <span className="text-[15px] font-semibold text-stone-900 tracking-tight">{selected.name}</span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleToggleVisibility}
                title={selected.isHidden ? 'Show component' : 'Hide component'}
                className="text-stone-400 hover:text-stone-700"
              >
                {selected.isHidden ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleDuplicate}
                title="Duplicate component"
                className="text-stone-400 hover:text-stone-700"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Preset Buttons - shown for components with presets */}
          {hasPresets && presetCount > 0 && (
            <div className="flex gap-2 pb-3 border-b border-stone-200">
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
            <div className="text-[13px] text-stone-500 py-6 space-y-3">
              <p className="font-medium text-stone-700">No settings available for this component</p>
              <div className="text-[11px] space-y-1.5 bg-stone-50 p-3 rounded-lg border border-stone-200">
                <p><span className="font-medium text-stone-600">Component:</span> {selected.name}</p>
                <p><span className="font-medium text-stone-600">Type:</span> {selected.componentType || 'unknown'}</p>
              </div>
            </div>
          )}
          
          {/* Delete button */}
          {selected.isDeletable && (
            <div className="pt-4 border-t border-stone-200">
              <Button
                variant="outline"
                className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                onClick={() => {
                  actions.delete(selected.id)
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Component
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
            <Eye className="h-5 w-5 text-stone-400" />
          </div>
          <p className="text-[13px] text-stone-500 tracking-wide">Select a component to edit its settings</p>
        </div>
      )}
    </div>
  )
}
