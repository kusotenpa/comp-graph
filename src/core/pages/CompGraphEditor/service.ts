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
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const compressed = compressGraph(graph)
    const url = new URL(window.location.href)
    url.searchParams.set('data', compressed)
    window.history.replaceState({}, '', url.toString())
  }, [graph])

  const copyShareUrl = async () => {
    const url = window.location.href
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }

  return {
    graph,
    setGraph,
    copyShareUrl,
    copied,
  }
}
