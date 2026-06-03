import { Grid, Container, Title, Button, Group, Stack, ActionIcon } from '@mantine/core'
import { IconLink, IconSun, IconMoon, IconCheck } from '@tabler/icons-react'
import { useState, useRef } from 'react'
import { useService } from './service'
import { ComponentForm } from './features/ComponentForm'
import { ComponentList } from './features/ComponentList'
import { GraphVisualizer } from './features/GraphVisualizer'
import { addComponent, deleteComponent } from './models/componentGraph'
import { useColorScheme } from '@/core/common/utils/colorScheme'

export const CompGraphEditor = () => {
  const { graph, setGraph, copyShareUrl, copied, initialEditingId } = useService()
  const [editingComponentId, setEditingComponentId] = useState<string | undefined>(initialEditingId)
  const { colorScheme, toggleColorScheme } = useColorScheme()
  const sidebarRef = useRef<HTMLDivElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  const cleanupEmptyComponent = (currentGraph: typeof graph): typeof graph => {
    if (!editingComponentId) return currentGraph
    const current = currentGraph.components.find((c) => c.id === editingComponentId)
    if (current && !current.name.trim()) {
      return deleteComponent(currentGraph, editingComponentId)
    }
    return currentGraph
  }

  const handleEdit = (componentId: string) => {
    if (componentId === editingComponentId) return
    setGraph(cleanupEmptyComponent(graph))
    setEditingComponentId(componentId)
    sidebarRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = (componentId: string) => {
    const updatedGraph = deleteComponent(graph, componentId)
    setGraph(updatedGraph)
    if (editingComponentId === componentId) setEditingComponentId(undefined)
  }

  const handleAddComponent = () => {
    const newId = Date.now().toString()
    const cleanedGraph = cleanupEmptyComponent(graph)
    setGraph(addComponent(cleanedGraph, { id: newId, name: '', props: [], parentId: null, color: null, memo: null }))
    setEditingComponentId(newId)
    sidebarRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => nameInputRef.current?.focus(), 0)
  }

  const handleCanvasClick = () => {
    handleAddComponent()
  }

  return (
    <Container fluid h="100vh" p="md">
      <Grid h="100%">
        <Grid.Col span={12}>
          <Group justify="space-between">
            <Title order={1}>CompGraph</Title>
            <Group>
              <ActionIcon
                variant="default"
                size="lg"
                onClick={toggleColorScheme}
                title="Toggle color scheme"
              >
                {colorScheme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
              </ActionIcon>
              <Button
                leftSection={copied ? <IconCheck size={18} /> : <IconLink size={18} />}
                onClick={copyShareUrl}
                color={copied ? 'green' : undefined}
              >
                {copied ? 'Copied!' : 'Copy Share URL'}
              </Button>
            </Group>
          </Group>
        </Grid.Col>
        <Grid.Col span={4} style={{ height: 'calc(100vh - 100px)', overflow: 'auto' }} ref={sidebarRef}>
          <Stack>
            <ComponentForm
              graph={graph}
              onGraphChange={setGraph}
              editingComponentId={editingComponentId}
              nameInputRef={nameInputRef}
            />
            <ComponentList graph={graph} onEdit={handleEdit} onDelete={handleDelete} onAdd={handleAddComponent} />
          </Stack>
        </Grid.Col>
        <Grid.Col span={8} style={{ height: 'calc(100vh - 100px)' }}>
          <GraphVisualizer graph={graph} onNodeClick={handleEdit} onCanvasClick={handleCanvasClick} />
        </Grid.Col>
      </Grid>
    </Container>
  )
}
