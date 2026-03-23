import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Paper } from '@mantine/core'
import { ComponentNode } from '@/core/pages/CompGraphEditor/ui/ComponentNode'
import type { ComponentGraph } from '@/core/pages/CompGraphEditor/models/componentGraph'
import { graphToFlowElements } from '@/core/common/utils/graphLayout'
import { useMemo } from 'react'

type Props = {
  graph: ComponentGraph
  onNodeClick?: (componentId: string) => void
}

const nodeTypes = {
  componentNode: ComponentNode,
}

export const GraphVisualizer = ({ graph, onNodeClick }: Props) => {
  const { nodes, edges } = useMemo(() => graphToFlowElements(graph), [graph])

  return (
    <Paper p={0} h="100%" withBorder>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={2}
        onNodeClick={onNodeClick ? (_e, node) => onNodeClick(node.id) : undefined}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </Paper>
  )
}
