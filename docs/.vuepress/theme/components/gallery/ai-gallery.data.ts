export type GalleryText = string | { zh: string, en: string }

export interface GalleryItem {
  id: string
  src: string
  title: GalleryText
  createdAt?: string
  alt?: GalleryText
  width: number
  height: number
  size?: number
}

export interface GalleryPage {
  items: GalleryItem[]
  hasMore: boolean
  nextCursor: string | null
}

export function normalizeGalleryPage(response: unknown): GalleryPage {
  const items = normalizeGalleryResponse(response)
  const hasMore = isRecord(response) && response.hasMore === true
  const nextCursor = isRecord(response) && typeof response.nextCursor === 'string' && response.nextCursor
    ? response.nextCursor : null
  if (hasMore && !nextCursor)
    throw new TypeError('Gallery response is missing the next cursor.')
  return { items, hasMore, nextCursor: hasMore ? nextCursor : null }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function text(value: unknown): GalleryText | undefined {
  if (typeof value === 'string' && value.trim())
    return value.trim()
  if (isRecord(value) && typeof value.zh === 'string' && typeof value.en === 'string')
    return { zh: value.zh, en: value.en }
}

function imageUrl(value: unknown): string | undefined {
  if (typeof value !== 'string')
    return
  const url = value.trim()
  if (url.startsWith('/') && !url.startsWith('//') && !url.includes('\\'))
    return url
  try {
    const parsed = new URL(url)
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:')
      return parsed.href
  }
  catch {
    return
  }
}

function dimension(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : fallback
}

// Adapt the Cloudflare Worker payload to the gallery's display model.
export function normalizeGalleryResponse(response: unknown): GalleryItem[] {
  if (isRecord(response) && response.success === false) {
    const message = typeof response.error === 'string' ? response.error : 'Gallery request failed.'
    throw new Error(message)
  }

  const items = isRecord(response) ? response.images : undefined
  if (!Array.isArray(items))
    throw new TypeError('Gallery response must contain an images array.')

  const ids = new Set<string>()
  return items.flatMap((item): GalleryItem[] => {
    if (!isRecord(item))
      return []
    const src = imageUrl(item.url)
    const title = text(item.name)
    if (!src || !title)
      return []
    const id = typeof item.id === 'string' && item.id.trim() ? item.id.trim() : src
    if (ids.has(id))
      return []
    ids.add(id)
    return [{
      id, src, title,
      createdAt: typeof item.uploaded === 'string' ? item.uploaded : undefined,
      alt: text(item.alt),
      width: dimension(item.width, 4),
      height: dimension(item.height, 5),
      size: dimension(item.size, 0) || undefined,
    }]
  })
}
