import dagre from 'dagre'
import type { Node, Edge } from '@xyflow/react'
import type { ComponentGraph, PropDefinition } from '@/core/pages/CompGraphEditor/models/componentGraph'

export type FlowNodeData = {
  name: string
  props: PropDefinition[]
}

export type FlowElements = {
  nodes: Node<FlowNodeData>[]
  edges: Edge[]
}

const NODE_WIDTH = 250
const NODE_HEIGHT = 100

export const graphToFlowElements = (graph: ComponentGraph): FlowElements => {
  const nodes: Node<FlowNodeData>[] = graph.components.map((component) => ({
    id: component.id,
    type: 'componentNode',
    position: { x: 0, y: 0 },
    data: {
      name: component.name,
      props: component.props,
    },
  }))

  const edges: Edge[] = graph.components
    .filter((c) => c.parentId !== null)
    .map((component) => ({
      id: `${component.parentId}-${component.id}`,
      source: component.parentId!,
      target: component.id,
      type: 'smoothstep',
    }))

  if (nodes.length === 0) {
    return { nodes, edges }
  }

  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({ rankdir: 'TB', nodesep: 100, ranksep: 100 })

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT })
  })

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  dagre.layout(dagreGraph)

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
    }
  })

  return {
    nodes: layoutedNodes,
    edges,
  }
}
