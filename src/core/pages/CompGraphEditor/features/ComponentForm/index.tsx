import { Button, TextInput, Textarea, Select, Stack, Group, ActionIcon, Title, Paper, ColorSwatch, Text, Tooltip } from '@mantine/core'
import { IconPlus, IconTrash } from '@tabler/icons-react'
import { useService } from './service'
import type { ComponentGraph } from '@/core/pages/CompGraphEditor/models/componentGraph'
import { NODE_COLORS } from '@/core/pages/CompGraphEditor/models/componentGraph'

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
    selectedColor,
    setSelectedColor,
    memo,
    setMemo,
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

        <Stack gap="xs">
          <Text size="sm" fw={500}>Color</Text>
          <Group gap="xs">
            <Tooltip label="None">
              <ColorSwatch
                color="transparent"
                style={{
                  cursor: 'pointer',
                  border: selectedColor === null ? '2px solid var(--mantine-color-dark-4)' : '2px solid var(--mantine-color-gray-4)',
                  outline: 'none',
                }}
                onClick={() => setSelectedColor(null)}
              />
            </Tooltip>
            {NODE_COLORS.map((color) => (
              <Tooltip key={color} label={color}>
                <ColorSwatch
                  color={`var(--mantine-color-${color}-6)`}
                  style={{
                    cursor: 'pointer',
                    outline: selectedColor === color ? '2px solid var(--mantine-color-dark-4)' : 'none',
                    outlineOffset: 2,
                  }}
                  onClick={() => setSelectedColor(color)}
                />
              </Tooltip>
            ))}
          </Group>
        </Stack>

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

        <Textarea
          label="Memo"
          placeholder="Notes about this component..."
          value={memo}
          onChange={(e) => setMemo(e.currentTarget.value)}
          autosize
          minRows={2}
        />

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
