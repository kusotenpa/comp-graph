import { useEffect, useState } from 'react'
import type { ComponentGraph } from './models/componentGraph'
import { compressGraph, decompressGraph } from '@/core/common/utils/urlPersistence'

export const useService = () => {
  const [graph, setGraph] = useState<ComponentGraph>(() => {
    const params = new URLSearchParams(window.location.search)
    const data = params.get('data')
    if (data) {
      const decompressed = decompressGraph(data)
      return decompressed ?? { components: [] }
    }
    return { components: [] }
  })

  useEffect(() => {
    const compressed = compressGraph(graph)
    const url = new URL(window.location.href)
    url.searchParams.set('data', compressed)
    window.history.replaceState({}, '', url.toString())
  }, [graph])

  const copyShareUrl = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
  }

  return {
    graph,
    setGraph,
    copyShareUrl,
  }
}
