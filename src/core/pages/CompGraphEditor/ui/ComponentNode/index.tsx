import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { Paper, Title, Text, Stack } from '@mantine/core'
import type { FlowNodeData } from '@/core/common/utils/graphLayout'

type Props = {
  data: FlowNodeData
}

export const ComponentNode = memo(({ data }: Props) => {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <Paper p="md" shadow="sm" withBorder style={{ minWidth: 250 }}>
        <Stack gap="xs">
          <Title order={4}>{data.name}</Title>
          {data.props.length > 0 && (
            <Stack gap={4}>
              <Text size="sm" fw={600} c="dimmed">
                Props:
              </Text>
              {data.props.map((prop, index) => (
                <Text key={index} size="xs" c="dimmed">
                  {prop.name}: <Text span c="blue">{prop.type}</Text>
                </Text>
              ))}
            </Stack>
          )}
        </Stack>
      </Paper>
      <Handle type="source" position={Position.Bottom} />
    </>
  )
})

ComponentNode.displayName = 'ComponentNode'
