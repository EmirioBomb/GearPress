import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { normalizeGalleryPage, type GalleryItem } from './ai-gallery.data'

const API_URL = 'https://ai-gallery.emiriobaan.top/'
const CACHE_MS = 5 * 60 * 1000
let snapshot: { pages: GalleryItem[][], cursor: string | null, hasMore: boolean, expires: number } | undefined

export function useGallery() {
  const pages = ref<GalleryItem[][]>([])
  const items = computed(() => pages.value.flat())
  const loading = ref(true)
  const error = ref(false)
  const hasMore = ref(true)
  const retrySeconds = ref(0)
  let cursor: string | null = null
  let controller: AbortController | undefined
  let pending: Promise<void> | undefined
  let retryTimer: ReturnType<typeof setInterval> | undefined
  let disposed = false

  function loadMore(): Promise<void> {
    if (pending)
      return pending
    if (!hasMore.value || retrySeconds.value || disposed)
      return Promise.resolve()
    pending = fetchPage().finally(() => { pending = undefined })
    return pending
  }

  async function fetchPage() {
    loading.value = true
    error.value = false
    controller = new AbortController()
    try {
      const url = new URL(API_URL)
      // Let the Worker own the page size so deployment settings cannot diverge.
      if (cursor)
        url.searchParams.set('cursor', cursor)
      const response = await fetch(url, { signal: controller.signal, headers: { Accept: 'application/json' } })
      if (response.status === 429) {
        const value = response.headers.get('Retry-After')
        const seconds = value && /^\d+$/.test(value) ? Number(value) : value ? (Date.parse(value) - Date.now()) / 1000 : 60
        retrySeconds.value = Number.isFinite(seconds) ? Math.max(1, Math.ceil(seconds)) : 60
        retryTimer = setInterval(() => {
          retrySeconds.value = Math.max(0, retrySeconds.value - 1)
          if (!retrySeconds.value)
            clearInterval(retryTimer)
        }, 1000)
      }
      if (!response.ok)
        throw new Error(`Gallery request failed (${response.status}).`)
      const page = normalizeGalleryPage(await response.json())
      if (disposed)
        return
      if (page.hasMore && page.nextCursor === cursor)
        throw new Error('Gallery cursor did not advance.')
      const seen = new Set(items.value.map(item => item.id))
      const additions = page.items.filter(item => !seen.has(item.id))
      if (additions.length)
        pages.value.push(additions)
      cursor = page.nextCursor
      hasMore.value = page.hasMore
      snapshot = {
        pages: pages.value.map(page => page.map(item => ({ ...item }))),
        cursor, hasMore: hasMore.value, expires: snapshot?.expires && snapshot.expires > Date.now() ? snapshot.expires : Date.now() + CACHE_MS,
      }
    }
    catch {
      if (!disposed && !controller.signal.aborted)
        error.value = true
    }
    finally {
      if (!disposed)
        loading.value = false
    }
  }

  onMounted(() => {
    if (snapshot && snapshot.expires > Date.now()) {
      pages.value = snapshot.pages.map(page => page.map(item => ({ ...item })))
      cursor = snapshot.cursor
      hasMore.value = snapshot.hasMore
      loading.value = false
    }
    else {
      snapshot = undefined
      void loadMore()
    }
  })

  onBeforeUnmount(() => {
    disposed = true
    controller?.abort()
    clearInterval(retryTimer)
  })

  return { pages, items, loading, error, hasMore, retrySeconds, loadMore }
}
