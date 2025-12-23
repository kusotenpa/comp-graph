import { Button, TextInput, Select, Stack, Group, ActionIcon, Title, Paper } from '@mantine/core'
import { IconPlus, IconTrash } from '@tabler/icons-react'
import { useService } from './service'
import type { ComponentGraph } from '@/core/pages/CompGraphEditor/models/componentGraph'

type Props = {
  graph: ComponentGraph
  onGraphChange: (graph: ComponentGraph) => void
  editingComponentId?: string
  onEditComplete?: () => void
}

export const ComponentForm = ({ graph, onGraphChange, editingComponentId, onEditComplete }: Props) => {
  const {
    componentName,
    setComponentName,
    selectedParentId,
    setSelectedParentId,
    props,
    addPropField,
    updateProp,
    removeProp,
    handleSubmit,
    handleCancel,
    availableParents,
  } = useService({ graph, onGraphChange, editingComponentId, onEditComplete })

  return (
    <Paper p="md" withBorder>
      <Stack>
        <Title order={3}>{editingComponentId ? 'Edit Component' : 'Add Component'}</Title>

        <TextInput
          label="Component Name"
          placeholder="Button"
          value={componentName}
          onChange={(e) => setComponentName(e.currentTarget.value)}
          required
        />

        <Select
          label="Parent Component"
          placeholder="None (Root)"
          value={selectedParentId}
          onChange={setSelectedParentId}
          data={availableParents.map((c) => ({ value: c.id, label: c.name }))}
          clearable
        />

        <Stack gap="xs">
          <Group justify="space-between">
            <Title order={5}>Props Definition</Title>
            <Button size="xs" leftSection={<IconPlus size={16} />} onClick={addPropField}>
              Add
            </Button>
          </Group>

          {props.map((prop, index) => (
            <Group key={index} gap="xs">
              <TextInput
                placeholder="propName"
                value={prop.name}
                onChange={(e) => updateProp(index, 'name', e.currentTarget.value)}
                style={{ flex: 1 }}
              />
              <TextInput
                placeholder="string"
                value={prop.type}
                onChange={(e) => updateProp(index, 'type', e.currentTarget.value)}
                style={{ flex: 1 }}
              />
              <ActionIcon color="red" variant="subtle" onClick={() => removeProp(index)}>
                <IconTrash size={18} />
              </ActionIcon>
            </Group>
          ))}
        </Stack>

        <Group>
          <Button onClick={handleSubmit} style={{ flex: 1 }}>
            {editingComponentId ? 'Update' : 'Add Component'}
          </Button>
          {editingComponentId && (
            <Button variant="default" onClick={handleCancel} style={{ flex: 1 }}>
              Cancel
            </Button>
          )}
        </Group>
      </Stack>
    </Paper>
  )
}
