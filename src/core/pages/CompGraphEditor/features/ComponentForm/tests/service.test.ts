import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useService } from '../service'
import type { ComponentGraph } from '@/core/pages/CompGraphEditor/models/componentGraph'

describe('ComponentForm service', () => {
  it('should initialize with empty form state', () => {
    const graph: ComponentGraph = { components: [] }
    const { result } = renderHook(() => useService({ graph, onGraphChange: () => {} }))

    expect(result.current.componentName).toBe('')
    expect(result.current.selectedParentId).toBeNull()
    expect(result.current.props).toEqual([{ name: '', type: '' }])
  })

  it('should update component name', () => {
    const graph: ComponentGraph = { components: [] }
    const { result } = renderHook(() => useService({ graph, onGraphChange: () => {} }))

    act(() => {
      result.current.setComponentName('Button')
    })

    expect(result.current.componentName).toBe('Button')
  })

  it('should add a new prop', () => {
    const graph: ComponentGraph = { components: [] }
    const { result } = renderHook(() => useService({ graph, onGraphChange: () => {} }))

    act(() => {
      result.current.addPropField()
    })

    expect(result.current.props).toHaveLength(2)
    expect(result.current.props[0]).toEqual({ name: '', type: '' })
    expect(result.current.props[1]).toEqual({ name: '', type: '' })
  })

  it('should update prop name and type', () => {
    const graph: ComponentGraph = { components: [] }
    const { result } = renderHook(() => useService({ graph, onGraphChange: () => {} }))

    act(() => {
      result.current.updateProp(0, 'name', 'onClick')
    })

    act(() => {
      result.current.updateProp(0, 'type', '() => void')
    })

    expect(result.current.props[0]).toEqual({ name: 'onClick', type: '() => void' })
  })

  it('should remove a prop', () => {
    const graph: ComponentGraph = { components: [] }
    const { result } = renderHook(() => useService({ graph, onGraphChange: () => {} }))

    expect(result.current.props).toHaveLength(1)

    act(() => {
      result.current.addPropField()
    })

    expect(result.current.props).toHaveLength(2)

    act(() => {
      result.current.removeProp(0)
    })

    expect(result.current.props).toHaveLength(1)
  })

  it('should call onGraphChange when adding a component', () => {
    const graph: ComponentGraph = { components: [] }
    let updatedGraph: ComponentGraph | null = null
    const { result } = renderHook(() =>
      useService({
        graph,
        onGraphChange: (g) => {
          updatedGraph = g
        },
      }),
    )

    act(() => {
      result.current.setComponentName('Button')
    })

    act(() => {
      result.current.updateProp(0, 'name', 'onClick')
    })

    act(() => {
      result.current.updateProp(0, 'type', '() => void')
    })

    act(() => {
      result.current.handleSubmit()
    })

    expect(updatedGraph).not.toBeNull()
    const resultGraph = updatedGraph as ComponentGraph
    expect(resultGraph.components).toHaveLength(1)
    expect(resultGraph.components[0].name).toBe('Button')
    expect(resultGraph.components[0].props).toEqual([{ name: 'onClick', type: '() => void' }])
  })

  it('should reset form after submit', () => {
    const graph: ComponentGraph = { components: [] }
    const { result } = renderHook(() => useService({ graph, onGraphChange: () => {} }))

    act(() => {
      result.current.setComponentName('Button')
      result.current.updateProp(0, 'name', 'onClick')
      result.current.updateProp(0, 'type', 'string')
    })

    act(() => {
      result.current.handleSubmit()
    })

    expect(result.current.componentName).toBe('')
    expect(result.current.props).toEqual([{ name: '', type: '' }])
    expect(result.current.selectedParentId).toBeNull()
  })

  it('should set parent component', () => {
    const graph: ComponentGraph = {
      components: [
        {
          id: '1',
          name: 'Container',
          props: [],
          parentId: null,
        },
      ],
    }
    const { result } = renderHook(() => useService({ graph, onGraphChange: () => {} }))

    act(() => {
      result.current.setSelectedParentId('1')
    })

    expect(result.current.selectedParentId).toBe('1')
  })

  it('should not submit if component name is empty', () => {
    const graph: ComponentGraph = { components: [] }
    let callCount = 0
    const { result } = renderHook(() =>
      useService({
        graph,
        onGraphChange: () => {
          callCount++
        },
      }),
    )

    act(() => {
      result.current.handleSubmit()
    })

    expect(callCount).toBe(0)
  })

  describe('edit mode', () => {
    it('should load component data when editingComponentId is provided', () => {
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
      const { result } = renderHook(() =>
        useService({ graph, onGraphChange: () => {}, editingComponentId: '1' }),
      )

      expect(result.current.componentName).toBe('Button')
      expect(result.current.props).toEqual([{ name: 'onClick', type: '() => void' }])
    })

    it('should update existing component on submit when editing', () => {
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
      let updatedGraph: ComponentGraph | null = null
      const { result } = renderHook(() =>
        useService({
          graph,
          onGraphChange: (g) => {
            updatedGraph = g
          },
          editingComponentId: '1',
        }),
      )

      act(() => {
        result.current.setComponentName('CustomButton')
      })

      act(() => {
        result.current.handleSubmit()
      })

      expect(updatedGraph).not.toBeNull()
      const resultGraph = updatedGraph as ComponentGraph
      expect(resultGraph.components).toHaveLength(1)
      expect(resultGraph.components[0].id).toBe('1')
      expect(resultGraph.components[0].name).toBe('CustomButton')
    })

    it('should call onEditComplete after update', () => {
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
      let editCompleted = false
      const { result } = renderHook(() =>
        useService({
          graph,
          onGraphChange: () => {},
          editingComponentId: '1',
          onEditComplete: () => {
            editCompleted = true
          },
        }),
      )

      act(() => {
        result.current.handleSubmit()
      })

      expect(editCompleted).toBe(true)
    })

    it('should call onEditComplete when canceling edit', () => {
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
      let editCompleted = false
      const { result } = renderHook(() =>
        useService({
          graph,
          onGraphChange: () => {},
          editingComponentId: '1',
          onEditComplete: () => {
            editCompleted = true
          },
        }),
      )

      act(() => {
        result.current.handleCancel()
      })

      expect(editCompleted).toBe(true)
    })

    it('should reset form when canceling edit', () => {
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
      const { result } = renderHook(() =>
        useService({
          graph,
          onGraphChange: () => {},
          editingComponentId: '1',
          onEditComplete: () => {},
        }),
      )

      expect(result.current.componentName).toBe('Button')

      act(() => {
        result.current.handleCancel()
      })

      expect(result.current.componentName).toBe('')
      expect(result.current.props).toEqual([{ name: '', type: '' }])
      expect(result.current.selectedParentId).toBeNull()
    })
  })
})
