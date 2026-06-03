import { useState, useEffect, useRef } from 'react'
import type { ComponentGraph, NodeColor, PropDefinition } from '@/core/pages/CompGraphEditor/models/componentGraph'
import { updateComponent } from '@/core/pages/CompGraphEditor/models/componentGraph'

type Props = {
  graph: ComponentGraph
  onGraphChange: (graph: ComponentGraph) => void
  editingComponentId?: string
}

export const useService = ({ graph, onGraphChange, editingComponentId }: Props) => {
  const [componentName, setComponentName] = useState('')
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<NodeColor | null>(null)
  const [memo, setMemo] = useState('')
  const [props, setProps] = useState<PropDefinition[]>([{ name: '', type: '' }])

  const graphRef = useRef(graph)
  graphRef.current = graph

  useEffect(() => {
    if (editingComponentId) {
      const component = graphRef.current.components.find((c) => c.id === editingComponentId)
      if (component) {
        setComponentName(component.name)
        setSelectedParentId(component.parentId)
        setSelectedColor(component.color ?? null)
        setMemo(component.memo ?? '')
        setProps(component.props.length > 0 ? component.props : [{ name: '', type: '' }])
      }
    } else {
      setComponentName('')
      setSelectedParentId(null)
      setSelectedColor(null)
      setMemo('')
      setProps([{ name: '', type: '' }])
    }
  }, [editingComponentId])

  const save = (overrides: {
    name?: string
    parentId?: string | null
    color?: NodeColor | null
    memo?: string
    props?: PropDefinition[]
  }) => {
    if (!editingComponentId) return
    const currentProps = overrides.props ?? props
    const filteredProps = currentProps.filter((p) => p.name.trim() !== '' && p.type.trim() !== '')
    onGraphChange(
      updateComponent(graphRef.current, editingComponentId, {
        name: overrides.name ?? componentName,
        props: filteredProps,
        parentId: overrides.parentId !== undefined ? overrides.parentId : selectedParentId,
        color: overrides.color !== undefined ? overrides.color : selectedColor,
        memo: (overrides.memo ?? memo).trim() || null,
      }),
    )
  }

  const handleSetComponentName = (name: string) => {
    setComponentName(name)
    save({ name })
  }

  const handleSetSelectedParentId = (parentId: string | null) => {
    setSelectedParentId(parentId)
    save({ parentId })
  }

  const handleSetSelectedColor = (color: NodeColor | null) => {
    setSelectedColor(color)
    save({ color })
  }

  const handleSetMemo = (memo: string) => {
    setMemo(memo)
    save({ memo })
  }

  const addPropField = () => {
    const updated = [...props, { name: '', type: '' }]
    setProps(updated)
    save({ props: updated })
  }

  const updateProp = (index: number, field: 'name' | 'type', value: string) => {
    const updated = [...props]
    updated[index] = { ...updated[index], [field]: value }
    setProps(updated)
    save({ props: updated })
  }

  const removeProp = (index: number) => {
    const updated = props.filter((_, i) => i !== index)
    setProps(updated)
    save({ props: updated })
  }

  return {
    componentName,
    setComponentName: handleSetComponentName,
    selectedParentId,
    setSelectedParentId: handleSetSelectedParentId,
    selectedColor,
    setSelectedColor: handleSetSelectedColor,
    memo,
    setMemo: handleSetMemo,
    props,
    addPropField,
    updateProp,
    removeProp,
    availableParents: graph.components,
  }
}
