import { useState, useEffect } from 'react'
import type { ComponentGraph, PropDefinition } from '@/core/pages/CompGraphEditor/models/componentGraph'
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
  const [props, setProps] = useState<PropDefinition[]>([{ name: '', type: '' }])

  useEffect(() => {
    if (editingComponentId) {
      const component = graph.components.find((c) => c.id === editingComponentId)
      if (component) {
        setComponentName(component.name)
        setSelectedParentId(component.parentId)
        setProps(component.props.length > 0 ? component.props : [{ name: '', type: '' }])
      }
    }
  }, [editingComponentId, graph])

  const addPropField = () => {
    setProps([...props, { name: '', type: '' }])
  }

  const updateProp = (index: number, field: 'name' | 'type', value: string) => {
    const updated = [...props]
    updated[index] = { ...updated[index], [field]: value }
    setProps(updated)
  }

  const removeProp = (index: number) => {
    setProps(props.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (!componentName.trim()) {
      return
    }

    const filteredProps = props.filter(
      (p) => p.name && p.name.trim() !== '' && p.type && p.type.trim() !== '',
    )

    let updatedGraph: ComponentGraph

    if (editingComponentId) {
      updatedGraph = updateComponent(graph, editingComponentId, {
        name: componentName,
        props: filteredProps,
        parentId: selectedParentId,
      })
      onEditComplete?.()
    } else {
      const newComponent = {
        id: Date.now().toString(),
        name: componentName,
        props: filteredProps,
        parentId: selectedParentId,
      }
      updatedGraph = addComponent(graph, newComponent)
    }

    onGraphChange(updatedGraph)

    if (!editingComponentId) {
      setComponentName('')
      setSelectedParentId(null)
      setProps([{ name: '', type: '' }])
    }
  }

  const handleCancel = () => {
    setComponentName('')
    setSelectedParentId(null)
    setProps([{ name: '', type: '' }])
    onEditComplete?.()
  }

  return {
    componentName,
    setComponentName,
    selectedParentId,
    setSelectedParentId,
    props,
    addPropField,
    updateProp,
    removeProp,
    handleSubmit,
    handleCancel,
    availableParents: graph.components,
  }
}
