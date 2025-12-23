import { describe, it, expect } from 'vitest'
import type { ComponentGraph } from '@/core/pages/CompGraphEditor/models/componentGraph'
import { compressGraph, decompressGraph } from '../index'

describe('urlPersistence utils', () => {
  describe('compressGraph', () => {
    it('should compress an empty graph', () => {
      const graph: ComponentGraph = { components: [] }
      const compressed = compressGraph(graph)

      expect(compressed).toBeTruthy()
      expect(typeof compressed).toBe('string')
    })

    it('should compress a graph with components', () => {
      const graph: ComponentGraph = {
        components: [
          {
            id: '1',
            name: 'Button',
            props: [{ name: 'onClick', type: '() => void' }],
            parentId: null,
          },
        ],
      }
      const compressed = compressGraph(graph)

      expect(compressed).toBeTruthy()
      expect(typeof compressed).toBe('string')
    })
  })

  describe('decompressGraph', () => {
    it('should decompress a compressed graph', () => {
      const original: ComponentGraph = {
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
          {
            id: '2',
            name: 'Container',
            props: [],
            parentId: null,
          },
        ],
      }

      const compressed = compressGraph(original)
      const decompressed = decompressGraph(compressed)

      expect(decompressed).toEqual(original)
    })

    it('should return null for invalid compressed data', () => {
      const result = decompressGraph('invalid-data')

      expect(result).toBeNull()
    })

    it('should return null for empty string', () => {
      const result = decompressGraph('')

      expect(result).toBeNull()
    })
  })

  describe('round-trip compression', () => {
    it('should maintain data integrity through compress-decompress cycle', () => {
      const graphs: ComponentGraph[] = [
        { components: [] },
        {
          components: [
            {
              id: '1',
              name: 'App',
              props: [],
              parentId: null,
            },
          ],
        },
        {
          components: [
            {
              id: '1',
              name: 'Container',
              props: [{ name: 'className', type: 'string' }],
              parentId: null,
            },
            {
              id: '2',
              name: 'Button',
              props: [
                { name: 'onClick', type: '() => void' },
                { name: 'disabled', type: 'boolean' },
              ],
              parentId: '1',
            },
            {
              id: '3',
              name: 'Input',
              props: [
                { name: 'value', type: 'string' },
                { name: 'onChange', type: '(e: Event) => void' },
              ],
              parentId: '1',
            },
          ],
        },
      ]

      graphs.forEach((graph) => {
        const compressed = compressGraph(graph)
        const decompressed = decompressGraph(compressed)
        expect(decompressed).toEqual(graph)
      })
    })
  })
})
