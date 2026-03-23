import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'
import { z } from 'zod'
import type { ComponentGraph } from '@/core/pages/CompGraphEditor/models/componentGraph'

const propDefinitionSchema = z.object({
  name: z.string(),
  type: z.string(),
})

const nodeColorSchema = z.enum(['blue', 'green', 'yellow', 'orange', 'red', 'violet'])

const componentNodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  props: z.array(propDefinitionSchema),
  parentId: z.string().nullable(),
  color: nodeColorSchema.nullable().optional(),
  memo: z.string().nullable().optional(),
})

const componentGraphSchema = z.object({
  components: z.array(componentNodeSchema),
})

export const compressGraph = (graph: ComponentGraph): string => {
  const json = JSON.stringify(graph)
  return compressToEncodedURIComponent(json)
}

export const decompressGraph = (compressed: string): ComponentGraph | null => {
  if (!compressed) {
    return null
  }

  try {
    const decompressed = decompressFromEncodedURIComponent(compressed)
    if (!decompressed) {
      return null
    }

    const parsed = JSON.parse(decompressed)
    const validated = componentGraphSchema.parse(parsed)
    return validated
  } catch {
    return null
  }
}
