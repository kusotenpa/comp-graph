import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { Paper, Title, Text, Stack } from '@mantine/core'
import type { FlowNodeData } from '@/core/common/utils/graphLayout'
import { useColorScheme } from '@/core/common/utils/colorScheme'

type Props = {
  data: FlowNodeData
}

export const ComponentNode = memo(({ data }: Props) => {
  const { colorScheme } = useColorScheme()
  const isDark = colorScheme === 'dark'

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <Paper
        p="md"
        shadow={isDark ? undefined : 'sm'}
        withBorder
        style={{
          minWidth: 250,
          borderLeft: data.color ? `4px solid var(--mantine-color-${data.color}-6)` : undefined,
          backgroundColor: isDark ? 'var(--mantine-color-dark-5)' : undefined,
        }}
      >
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
          {data.memo && (
            <Text size="xs" c="dimmed" style={{ whiteSpace: 'pre-wrap' }}>
              {data.memo}
            </Text>
          )}
        </Stack>
      </Paper>
      <Handle type="source" position={Position.Bottom} />
    </>
  )
})

ComponentNode.displayName = 'ComponentNode'
