'use client'

import { useEditor } from '@craftjs/core'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Copy, Eye, EyeOff } from 'lucide-react'
import React from 'react'

export function SettingsPanel() {
  const { selected, actions, query } = useEditor((state, query) => {
    const [currentlySelectedNodeId] = query.getEvent('selected').last() || []
    let selected

    if (currentlySelectedNodeId) {
      try {
        // Use query.node() to get node data - this is the recommended way
        const nodeQuery = query.node(currentlySelectedNodeId)
        if (!nodeQuery) {
          return { selected: null }
        }
        
        const node = nodeQuery.get()
        if (!node || !node.data) {
          return { selected: null }
        }
        
        const nodeData = node.data as any
        
        // Craft.js stores component type in node.data.type
        // It can be a string or an object with resolvedName/name
        let componentType: string | undefined
        if (nodeData?.type) {
          if (typeof nodeData.type === 'string') {
            componentType = nodeData.type
          } else if (nodeData.type.resolvedName) {
            componentType = nodeData.type.resolvedName
          } else if (nodeData.type.name) {
            componentType = nodeData.type.name
          }
        }
        
        const resolver = state.options?.resolver || {}
        let Component: any = null
        
        // Try to resolve component by type name
        if (componentType) {
          Component = resolver[componentType]
        }
        
        // If not found, try iterating through resolver to find by function name
        if (!Component && componentType) {
          for (const [key, value] of Object.entries(resolver)) {
            const comp = value as any
            // Check if component name matches
            if (comp?.name === componentType || comp?.displayName === componentType) {
              Component = comp
              break
            }
            // Also check craft.displayName
            if (comp?.craft?.displayName === componentType) {
              Component = comp
              break
            }
          }
        }
        
        // Craft.js should automatically populate node.related from Component.craft.related
        // But we need to manually get it if not populated
        let settings = node?.related?.settings
        
        // If not in node.related, get from Component.craft.related.settings
        if (!settings && Component && typeof Component !== 'string') {
          const componentCraft = (Component as any)?.craft
          if (componentCraft?.related?.settings) {
            settings = componentCraft.related.settings
          }
        }
        
        // Debug logging - always log to help diagnose
        console.log('SettingsPanel Debug:', {
          nodeId: currentlySelectedNodeId,
          componentType,
          resolverKeys: Object.keys(resolver),
          hasComponent: !!Component,
          componentName: Component?.name || Component?.displayName || 'unknown',
          hasNodeRelated: !!node?.related,
          nodeRelatedSettings: !!node?.related?.settings,
          componentCraft: Component ? {
            hasCraft: !!(Component as any)?.craft,
            hasRelated: !!(Component as any)?.craft?.related,
            hasSettings: !!(Component as any)?.craft?.related?.settings,
            settingsType: typeof (Component as any)?.craft?.related?.settings,
          } : null,
          finalSettings: !!settings,
        })

        const displayName = Component && typeof Component !== 'string'
          ? (Component as any)?.craft?.displayName || nodeData?.displayName || nodeData?.name || componentType || 'Component'
          : nodeData?.displayName || nodeData?.name || componentType || 'Component'

        // Safely check if deletable with error handling
        let isDeletable = false
        try {
          isDeletable = nodeQuery.isDeletable()
        } catch (error) {
          console.warn('Error checking if node is deletable:', error)
          // Default to true for non-root nodes
          isDeletable = currentlySelectedNodeId !== 'ROOT'
        }

        selected = {
          id: currentlySelectedNodeId,
          name: displayName,
          settings: settings,
          componentType: componentType || 'unknown',
          isDeletable: isDeletable,
          isHidden: nodeData?.custom?.hidden || false,
        }
      } catch (error) {
        console.error('Error in SettingsPanel:', error)
        return { selected: null }
      }
    }

    return {
      selected,
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
