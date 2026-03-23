export type PropDefinition = {
  name: string
  type: string
}

export const NODE_COLORS = ['blue', 'green', 'yellow', 'orange', 'red', 'violet'] as const
export type NodeColor = (typeof NODE_COLORS)[number]

export type ComponentNode = {
  id: string
  name: string
  props: PropDefinition[]
  parentId: string | null
  color?: NodeColor | null
  memo?: string | null
}

export type ComponentGraph = {
  components: ComponentNode[]
}
