import { Button, TextInput, Textarea, Select, Stack, Group, ActionIcon, Title, Paper, ColorSwatch, Text, Tooltip } from '@mantine/core'
import { IconPlus, IconTrash } from '@tabler/icons-react'
import type { RefObject } from 'react'
import { useState } from 'react'
import { useService } from './service'
import type { ComponentGraph } from '@/core/pages/CompGraphEditor/models/componentGraph'
import { NODE_COLORS } from '@/core/pages/CompGraphEditor/models/componentGraph'

type Props = {
  graph: ComponentGraph
  onGraphChange: (graph: ComponentGraph) => void
  editingComponentId?: string
  nameInputRef?: RefObject<HTMLInputElement | null>
}

export const ComponentForm = ({ graph, onGraphChange, editingComponentId, nameInputRef }: Props) => {
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
    availableParents,
  } = useService({ graph, onGraphChange, editingComponentId })

  const [focusedSwatch, setFocusedSwatch] = useState<string | null | undefined>(undefined)
  const focusRing = '0 0 0 2px var(--mantine-color-blue-5)'

  if (!editingComponentId) {
    return (
      <Paper p="md" withBorder>
        <Text c="dimmed" size="sm" ta="center">
          Click on the canvas to create a new component
        </Text>
      </Paper>
    )
  }

  return (
    <Paper p="md" withBorder>
      <Stack>
        <Title order={3}>Component</Title>

        <TextInput
          ref={nameInputRef}
          label="Component Name"
          placeholder="Button"
          value={componentName}
          onChange={(e) => setComponentName(e.currentTarget.value)}
        />

        <Stack gap="xs">
          <Text size="sm" fw={500}>Color</Text>
          <Group gap="xs">
            <Tooltip label="None">
              <ColorSwatch
                color="transparent"
                tabIndex={0}
                role="button"
                aria-label="None"
                aria-pressed={selectedColor === null}
                style={{
                  cursor: 'pointer',
                  border: selectedColor === null ? '2px solid var(--mantine-color-dark-4)' : '2px solid var(--mantine-color-gray-4)',
                  outline: 'none',
                  boxShadow: focusedSwatch === null ? focusRing : undefined,
                }}
                onClick={() => setSelectedColor(null)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedColor(null)}
                onFocus={() => setFocusedSwatch(null)}
                onBlur={() => setFocusedSwatch(undefined)}
              />
            </Tooltip>
            {NODE_COLORS.map((color) => (
              <Tooltip key={color} label={color}>
                <ColorSwatch
                  color={`var(--mantine-color-${color}-6)`}
                  tabIndex={0}
                  role="button"
                  aria-label={color}
                  aria-pressed={selectedColor === color}
                  style={{
                    cursor: 'pointer',
                    outline: selectedColor === color ? '2px solid var(--mantine-color-dark-4)' : 'none',
                    outlineOffset: 2,
                    boxShadow: focusedSwatch === color ? focusRing : undefined,
                  }}
                  onClick={() => setSelectedColor(color)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedColor(color)}
                  onFocus={() => setFocusedSwatch(color)}
                  onBlur={() => setFocusedSwatch(undefined)}
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
          data={availableParents.filter((c) => c.id !== editingComponentId).map((c) => ({ value: c.id, label: c.name }))}
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
      </Stack>
    </Paper>
  )
}
