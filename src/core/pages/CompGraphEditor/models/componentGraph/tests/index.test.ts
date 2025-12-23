import { describe, it, expect } from 'vitest'
import type { ComponentNode, ComponentGraph } from '../types'
import { addComponent, updateComponent, deleteComponent, addProp, removeProp } from '../index'

describe('componentGraph model', () => {
  describe('addComponent', () => {
    it('should add a new component to an empty graph', () => {
      const graph: ComponentGraph = { components: [] }
      const newComponent: ComponentNode = {
        id: '1',
        name: 'Button',
        props: [],
        parentId: null,
      }

      const result = addComponent(graph, newComponent)

      expect(result.components).toHaveLength(1)
      expect(result.components[0]).toEqual(newComponent)
    })

    it('should add a component with a parent', () => {
      const parent: ComponentNode = {
        id: '1',
        name: 'Container',
        props: [],
        parentId: null,
      }
      const graph: ComponentGraph = { components: [parent] }

      const child: ComponentNode = {
        id: '2',
        name: 'Button',
        props: [],
        parentId: '1',
      }

      const result = addComponent(graph, child)

      expect(result.components).toHaveLength(2)
      expect(result.components[1].parentId).toBe('1')
    })
  })

  describe('updateComponent', () => {
    it('should update component name', () => {
      const component: ComponentNode = {
        id: '1',
        name: 'Button',
        props: [],
        parentId: null,
      }
      const graph: ComponentGraph = { components: [component] }

      const result = updateComponent(graph, '1', { name: 'CustomButton' })

      expect(result.components[0].name).toBe('CustomButton')
    })

    it('should update component parent', () => {
      const parent: ComponentNode = {
        id: '1',
        name: 'Container',
        props: [],
        parentId: null,
      }
      const child: ComponentNode = {
        id: '2',
        name: 'Button',
        props: [],
        parentId: null,
      }
      const graph: ComponentGraph = { components: [parent, child] }

      const result = updateComponent(graph, '2', { parentId: '1' })

      expect(result.components[1].parentId).toBe('1')
    })
  })

  describe('deleteComponent', () => {
    it('should delete a component', () => {
      const component: ComponentNode = {
        id: '1',
        name: 'Button',
        props: [],
        parentId: null,
      }
      const graph: ComponentGraph = { components: [component] }

      const result = deleteComponent(graph, '1')

      expect(result.components).toHaveLength(0)
    })

    it('should delete a component and update children parentId to null', () => {
      const parent: ComponentNode = {
        id: '1',
        name: 'Container',
        props: [],
        parentId: null,
      }
      const child: ComponentNode = {
        id: '2',
        name: 'Button',
        props: [],
        parentId: '1',
      }
      const graph: ComponentGraph = { components: [parent, child] }

      const result = deleteComponent(graph, '1')

      expect(result.components).toHaveLength(1)
      expect(result.components[0].id).toBe('2')
      expect(result.components[0].parentId).toBeNull()
    })
  })

  describe('addProp', () => {
    it('should add a prop to a component', () => {
      const component: ComponentNode = {
        id: '1',
        name: 'Button',
        props: [],
        parentId: null,
      }
      const graph: ComponentGraph = { components: [component] }

      const result = addProp(graph, '1', { name: 'onClick', type: '() => void' })

      expect(result.components[0].props).toHaveLength(1)
      expect(result.components[0].props[0]).toEqual({ name: 'onClick', type: '() => void' })
    })

    it('should add multiple props to a component', () => {
      const component: ComponentNode = {
        id: '1',
        name: 'Button',
        props: [{ name: 'onClick', type: '() => void' }],
        parentId: null,
      }
      const graph: ComponentGraph = { components: [component] }

      const result = addProp(graph, '1', { name: 'disabled', type: 'boolean' })

      expect(result.components[0].props).toHaveLength(2)
    })
  })

  describe('removeProp', () => {
    it('should remove a prop from a component', () => {
      const component: ComponentNode = {
        id: '1',
        name: 'Button',
        props: [
          { name: 'onClick', type: '() => void' },
          { name: 'disabled', type: 'boolean' },
        ],
        parentId: null,
      }
      const graph: ComponentGraph = { components: [component] }

      const result = removeProp(graph, '1', 'onClick')

      expect(result.components[0].props).toHaveLength(1)
      expect(result.components[0].props[0].name).toBe('disabled')
    })
  })
})
