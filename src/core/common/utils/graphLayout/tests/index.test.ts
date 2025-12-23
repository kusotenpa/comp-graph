import { describe, it, expect } from 'vitest'
import type { ComponentGraph } from '@/core/pages/CompGraphEditor/models/componentGraph'
import { graphToFlowElements } from '../index'

describe('graphLayout utils', () => {
  describe('graphToFlowElements', () => {
    it('should convert empty graph to empty nodes and edges', () => {
      const graph: ComponentGraph = { components: [] }
      const { nodes, edges } = graphToFlowElements(graph)

      expect(nodes).toEqual([])
      expect(edges).toEqual([])
    })

    it('should convert single component to single node', () => {
      const graph: ComponentGraph = {
        components: [
          {
            id: '1',
            name: 'Button',
            props: [],
            parentId: null,
          },
        ],
      }
      const { nodes, edges } = graphToFlowElements(graph)

      expect(nodes).toHaveLength(1)
      expect(nodes[0].id).toBe('1')
      expect(nodes[0].data.name).toBe('Button')
      expect(nodes[0].position).toBeDefined()
      expect(edges).toEqual([])
    })

    it('should create edge between parent and child', () => {
      const graph: ComponentGraph = {
        components: [
          {
            id: '1',
            name: 'Container',
            props: [],
            parentId: null,
          },
          {
            id: '2',
            name: 'Button',
            props: [],
            parentId: '1',
          },
        ],
      }
      const { nodes, edges } = graphToFlowElements(graph)

      expect(nodes).toHaveLength(2)
      expect(edges).toHaveLength(1)
      expect(edges[0].source).toBe('1')
      expect(edges[0].target).toBe('2')
    })

    it('should handle multiple children', () => {
      const graph: ComponentGraph = {
        components: [
          {
            id: '1',
            name: 'Container',
            props: [],
            parentId: null,
          },
          {
            id: '2',
            name: 'Button',
            props: [],
            parentId: '1',
          },
          {
            id: '3',
            name: 'Input',
            props: [],
            parentId: '1',
          },
        ],
      }
      const { nodes, edges } = graphToFlowElements(graph)

      expect(nodes).toHaveLength(3)
      expect(edges).toHaveLength(2)
    })

    it('should include props in node data', () => {
      const graph: ComponentGraph = {
        components: [
          {
            id: '1',
            name: 'Button',
            props: [
              { name: 'onClick', type: '() => void' },
              { name: 'disabled', type: 'boolean' },
            ],
            parentId: null,
          },
        ],
      }
      const { nodes } = graphToFlowElements(graph)

      expect(nodes[0].data.props).toEqual([
        { name: 'onClick', type: '() => void' },
        { name: 'disabled', type: 'boolean' },
      ])
    })

    it('should apply dagre layout with proper positioning', () => {
      const graph: ComponentGraph = {
        components: [
          {
            id: '1',
            name: 'Root',
            props: [],
            parentId: null,
          },
          {
            id: '2',
            name: 'Child1',
            props: [],
            parentId: '1',
          },
          {
            id: '3',
            name: 'Child2',
            props: [],
            parentId: '1',
          },
        ],
      }
      const { nodes } = graphToFlowElements(graph)

      const rootNode = nodes.find((n) => n.id === '1')
      const child1Node = nodes.find((n) => n.id === '2')
      const child2Node = nodes.find((n) => n.id === '3')

      expect(rootNode?.position.y).toBeLessThan(child1Node?.position.y ?? 0)
      expect(rootNode?.position.y).toBeLessThan(child2Node?.position.y ?? 0)
    })
  })
})
