import { createFileRoute } from '@tanstack/react-router'
import { CompGraphEditor } from '@/core/pages/CompGraphEditor'

export const Route = createFileRoute('/')({
  component: CompGraphEditor,
})
