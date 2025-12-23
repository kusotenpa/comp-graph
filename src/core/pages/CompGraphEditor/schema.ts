import { z } from 'zod'

export const compGraphEditorSearchSchema = z.object({
  data: z.string().optional(),
})

export type CompGraphEditorSearch = z.infer<typeof compGraphEditorSearchSchema>
