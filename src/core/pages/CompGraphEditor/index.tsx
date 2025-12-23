import { Grid, Container, Title, Button, Group, Stack, ActionIcon } from '@mantine/core'
import { IconLink, IconSun, IconMoon, IconCheck } from '@tabler/icons-react'
import { useState } from 'react'
import { useService } from './service'
import { ComponentForm } from './features/ComponentForm'
import { ComponentList } from './features/ComponentList'
import { GraphVisualizer } from './features/GraphVisualizer'
import { deleteComponent } from './models/componentGraph'
import { useColorScheme } from '@/core/common/utils/colorScheme'

export const CompGraphEditor = () => {
  const { graph, setGraph, copyShareUrl, copied } = useService()
  const [editingComponentId, setEditingComponentId] = useState<string | undefined>(undefined)
  const { colorScheme, toggleColorScheme } = useColorScheme()

  const handleEdit = (componentId: string) => {
    setEditingComponentId(componentId)
  }

  const handleDelete = (componentId: string) => {
    const updatedGraph = deleteComponent(graph, componentId)
    setGraph(updatedGraph)
  }

  const handleEditComplete = () => {
    setEditingComponentId(undefined)
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
        <Grid.Col span={4} style={{ height: 'calc(100vh - 100px)', overflow: 'auto' }}>
          <Stack>
            <ComponentForm
              graph={graph}
              onGraphChange={setGraph}
              editingComponentId={editingComponentId}
              onEditComplete={handleEditComplete}
            />
            <ComponentList graph={graph} onEdit={handleEdit} onDelete={handleDelete} />
          </Stack>
        </Grid.Col>
        <Grid.Col span={8} style={{ height: 'calc(100vh - 100px)' }}>
          <GraphVisualizer graph={graph} />
        </Grid.Col>
      </Grid>
    </Container>
  )
}
