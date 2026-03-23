import { useState, useEffect, useRef } from 'react'
import type { ComponentGraph, NodeColor, PropDefinition } from '@/core/pages/CompGraphEditor/models/componentGraph'
import { addComponent, updateComponent } from '@/core/pages/CompGraphEditor/models/componentGraph'

type Props = {
  graph: ComponentGraph
  onGraphChange: (graph: ComponentGraph) => void
  editingComponentId?: string
  onEditComplete?: () => void
}

export const useService = ({ graph, onGraphChange, editingComponentId, onEditComplete }: Props) => {
  const [componentName, setComponentName] = useState('')
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<NodeColor | null>(null)
  const [memo, setMemo] = useState('')
  const [props, setProps] = useState<PropDefinition[]>([{ name: '', type: '' }])

  const graphRef = useRef(graph)
  graphRef.current = graph

  // 編集対象が切り替わった時だけフォームを同期する
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
    }
  }, [editingComponentId])

  // 編集中はフィールド変更をグラフに即時反映する
  const liveUpdate = (overrides: {
    name?: string
    parentId?: string | null
    color?: NodeColor | null
    memo?: string
    props?: PropDefinition[]
  }) => {
    if (!editingComponentId) return
    const name = overrides.name ?? componentName
    if (!name.trim()) return
    const currentProps = overrides.props ?? props
    const filteredProps = currentProps.filter((p) => p.name.trim() !== '' && p.type.trim() !== '')
    const updatedGraph = updateComponent(graphRef.current, editingComponentId, {
      name,
      props: filteredProps,
      parentId: overrides.parentId !== undefined ? overrides.parentId : selectedParentId,
      color: overrides.color !== undefined ? overrides.color : selectedColor,
      memo: (overrides.memo ?? memo).trim() || null,
    })
    onGraphChange(updatedGraph)
  }

  const handleSetComponentName = (name: string) => {
    setComponentName(name)
    liveUpdate({ name })
  }

  const handleSetSelectedParentId = (parentId: string | null) => {
    setSelectedParentId(parentId)
    liveUpdate({ parentId })
  }

  const handleSetSelectedColor = (color: NodeColor | null) => {
    setSelectedColor(color)
    liveUpdate({ color })
  }

  const handleSetMemo = (memo: string) => {
    setMemo(memo)
    liveUpdate({ memo })
  }

  const addPropField = () => {
    const updated = [...props, { name: '', type: '' }]
    setProps(updated)
    liveUpdate({ props: updated })
  }

  const updateProp = (index: number, field: 'name' | 'type', value: string) => {
    const updated = [...props]
    updated[index] = { ...updated[index], [field]: value }
    setProps(updated)
    liveUpdate({ props: updated })
  }

  const removeProp = (index: number) => {
    const updated = props.filter((_, i) => i !== index)
    setProps(updated)
    liveUpdate({ props: updated })
  }

  const handleSubmit = () => {
    if (!componentName.trim()) return

    const filteredProps = props.filter(
      (p) => p.name && p.name.trim() !== '' && p.type && p.type.trim() !== '',
    )
    const newComponent = {
      id: Date.now().toString(),
      name: componentName,
      props: filteredProps,
      parentId: selectedParentId,
      color: selectedColor,
      memo: memo.trim() || null,
    }
    onGraphChange(addComponent(graphRef.current, newComponent))
    setComponentName('')
    setSelectedParentId(null)
    setSelectedColor(null)
    setMemo('')
    setProps([{ name: '', type: '' }])
  }

  const handleCancel = () => {
    setComponentName('')
    setSelectedParentId(null)
    setSelectedColor(null)
    setMemo('')
    setProps([{ name: '', type: '' }])
    onEditComplete?.()
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
    handleSubmit,
    handleCancel,
    availableParents: graph.components,
  }
}
