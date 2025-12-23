import { Paper, Title, Stack, Group, ActionIcon, Text, Badge } from '@mantine/core'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import type { ComponentGraph } from '@/core/pages/CompGraphEditor/models/componentGraph'

type Props = {
  graph: ComponentGraph
  onEdit: (componentId: string) => void
  onDelete: (componentId: string) => void
}

export const ComponentList = ({ graph, onEdit, onDelete }: Props) => {
  return (
    <Paper p="md" withBorder>
      <Stack>
        <Title order={3}>Component List</Title>

        {graph.components.length === 0 ? (
          <Text c="dimmed" size="sm">
            No components yet
          </Text>
        ) : (
          <Stack gap="xs">
            {graph.components.map((component) => (
              <Paper key={component.id} p="sm" withBorder>
                <Group justify="space-between">
                  <Stack gap={4}>
                    <Group gap="xs">
                      <Text fw={600}>{component.name}</Text>
                      {component.props.length > 0 && (
                        <Badge size="sm" variant="light">
                          {component.props.length} props
                        </Badge>
                      )}
                    </Group>
                    {component.parentId && (
                      <Text size="xs" c="dimmed">
                        Parent: {graph.components.find((c) => c.id === component.parentId)?.name}
                      </Text>
                    )}
                  </Stack>
                  <Group gap="xs">
                    <ActionIcon
                      variant="subtle"
                      color="blue"
                      onClick={() => onEdit(component.id)}
                    >
                      <IconEdit size={18} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => onDelete(component.id)}
                    >
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Group>
                </Group>
              </Paper>
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  )
}
