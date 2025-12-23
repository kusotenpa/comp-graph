export type PropDefinition = {
  name: string
  type: string
}

export type ComponentNode = {
  id: string
  name: string
  props: PropDefinition[]
  parentId: string | null
}

export type ComponentGraph = {
  components: ComponentNode[]
}
