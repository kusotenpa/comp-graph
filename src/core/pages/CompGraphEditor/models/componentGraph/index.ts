import type { ComponentGraph, ComponentNode, PropDefinition } from './types'

export type { ComponentGraph, ComponentNode, PropDefinition } from './types'

export const addComponent = (
  graph: ComponentGraph,
  component: ComponentNode,
): ComponentGraph => {
  return {
    ...graph,
    components: [...graph.components, component],
  }
}

export const updateComponent = (
  graph: ComponentGraph,
  componentId: string,
  updates: Partial<Omit<ComponentNode, 'id'>>,
): ComponentGraph => {
  return {
    ...graph,
    components: graph.components.map((c) =>
      c.id === componentId ? { ...c, ...updates } : c,
    ),
  }
}

export const deleteComponent = (
  graph: ComponentGraph,
  componentId: string,
): ComponentGraph => {
  return {
    ...graph,
    components: graph.components
      .filter((c) => c.id !== componentId)
      .map((c) => (c.parentId === componentId ? { ...c, parentId: null } : c)),
  }
}

export const addProp = (
  graph: ComponentGraph,
  componentId: string,
  prop: PropDefinition,
): ComponentGraph => {
  return {
    ...graph,
    components: graph.components.map((c) =>
      c.id === componentId ? { ...c, props: [...c.props, prop] } : c,
    ),
  }
}

export const removeProp = (
  graph: ComponentGraph,
  componentId: string,
  propName: string,
): ComponentGraph => {
  return {
    ...graph,
    components: graph.components.map((c) =>
      c.id === componentId
        ? { ...c, props: c.props.filter((p) => p.name !== propName) }
        : c,
    ),
  }
}
