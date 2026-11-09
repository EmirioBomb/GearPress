<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type ComponentPublicInstance } from 'vue'
import { withBase } from 'vuepress/client'
import { useData } from 'vuepress-theme-plume/composables'
import { type GalleryItem, type GalleryText } from './ai-gallery.data'
import { useGallery } from './useGallery'
import { galleryIcons } from './gallery.icons'

const { items, loading, error, hasMore, retrySeconds, loadMore } = useGallery()
const copyRetry = computed(() => english.value ? 'Retry' : '重试')
const retryLabel = computed(() => retrySeconds.value ? `${copyRetry.value} (${retrySeconds.value}s)` : copyRetry.value)

const { lang } = useData()
const english = computed(() => lang.value.startsWith('en'))
const copy = computed(() => english.value ? {
  title: 'AI Gallery',
  empty: 'No works yet', loading: 'Loading', error: 'The gallery could not be loaded',
  unavailable: 'Image unavailable', open: 'View', close: 'Close',
  previous: 'Previous image', next: 'Next image', original: 'Open original',
  fallback: 'AI-generated artwork',
  more: 'Load more',
} : {
  title: 'AI 画廊',
  empty: '暂无作品', loading: '正在加载', error: '画廊暂时无法加载',
  unavailable: '图片暂时无法显示', open: '查看', close: '关闭',
  previous: '上一张', next: '下一张', original: '打开原图',
  fallback: 'AI 生成作品',
  more: '加载更多',
})

const dialog = ref<HTMLDialogElement>()
const closeButton = ref<HTMLButtonElement>()
const selectedId = ref<string | null>(null)
const selectedIndex = computed(() => items.value.findIndex(item => item.id === selectedId.value))
const selected = computed(() => items.value[selectedIndex.value])
const loaded = ref(new Set<string>())
const failed = ref(new Set<string>())
const originalLoaded = ref(false)
const originalFailed = ref(false)
let trigger: HTMLElement | null = null
let previousOverflow: string | undefined
const sentinel = ref<HTMLElement>()
const navigating = ref(false)
let observer: IntersectionObserver | undefined
const masonry = ref<HTMLElement>()
const layout = ref({ width: 0, columns: 1, gap: 24, maxHeight: 360 })
let layoutObserver: ResizeObserver | undefined

function measureLayout() {
  if (!masonry.value)
    return
  const style = getComputedStyle(masonry.value)
  layout.value = {
    width: masonry.value.getBoundingClientRect().width,
    columns: Number(style.getPropertyValue('--gallery-columns')) || 1,
    gap: Number.parseFloat(style.getPropertyValue('--gallery-gap')) || 24,
    maxHeight: Math.min(Number.parseFloat(style.getPropertyValue('--gallery-max-height')) || 420, window.innerHeight * 0.6),
  }
}

function rowSpan(item: GalleryItem) {
  const { width, columns, gap } = layout.value
  if (!width)
    return undefined
  const columnWidth = (width - gap * (columns - 1)) / columns
  // Small grid rows keep one continuous masonry layout across API pages.
  const height = Math.min(columnWidth * item.height / item.width, layout.value.maxHeight)
  return `span ${Math.ceil((height + gap) / 8)}`
}

function localize(value: GalleryText | undefined) {
  return typeof value === 'string' ? value : value?.[english.value ? 'en' : 'zh'] || ''
}

function source(value: string) {
  return value.startsWith('/') ? withBase(value) : value
}

function alt(item: GalleryItem) {
  return localize(item.alt) || localize(item.title) || copy.value.fallback
}

function date(value: string | undefined) {
  // Date-only metadata stays on its original calendar day in every timezone.
  if (!value || !/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(value))
    return ''
  const parsed = new Date(`${value.slice(0, 10)}T00:00:00Z`)
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value.slice(0, 10))
    return ''
  return new Intl.DateTimeFormat(english.value ? 'en-US' : 'zh-CN', {
    year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC',
  }).format(parsed)
}

function fileSize(value: number | undefined) {
  if (!value || !Number.isFinite(value) || value < 0)
    return ''
  const megabytes = value / 1024 / 1024
  return `${megabytes < 1 ? Math.max(1, Math.round(value / 1024)) + ' KB' : megabytes.toFixed(2) + ' MB'}`
}

function markLoaded(src: string) {
  if (!loaded.value.has(src))
    loaded.value = new Set([...loaded.value, src])
}

function imageLoaded(item: GalleryItem, event: Event) {
  markLoaded(item.src)
  const image = event.currentTarget as HTMLImageElement
  if (image.naturalWidth > 0 && image.naturalHeight > 0) {
    item.width = image.naturalWidth
    item.height = image.naturalHeight
  }
}

function markFailed(src: string) {
  if (!failed.value.has(src))
    failed.value = new Set([...failed.value, src])
}

function thumbnailReady(element: Element | ComponentPublicInstance | null, src: string) {
  const image = element as HTMLImageElement | null
  // An SSR image may finish loading before hydration installs its event listeners.
  if (image?.complete) {
    if (image.naturalWidth > 0)
      markLoaded(src)
    else
      markFailed(src)
  }
}

async function open(item: GalleryItem, event: MouseEvent) {
  if (!dialog.value || dialog.value.open)
    return
  trigger = event.currentTarget as HTMLElement
  selectedId.value = item.id
  originalLoaded.value = false
  originalFailed.value = false
  await nextTick()
  if (!dialog.value || !selected.value)
    return
  previousOverflow = document.body.style.overflow
  dialog.value.showModal()
  document.body.style.overflow = 'hidden'
  closeButton.value?.focus()
}

function restore() {
  if (previousOverflow !== undefined) {
    document.body.style.overflow = previousOverflow
    previousOverflow = undefined
  }
}

function closed() {
  restore()
  selectedId.value = null
  trigger?.focus({ preventScroll: true })
  trigger = null
}

function close() {
  dialog.value?.close()
}

function backdropClick(event: MouseEvent) {
  if (event.target === dialog.value)
    close()
}

async function move(direction: number) {
  if (navigating.value)
    return
  const currentId = selectedId.value
  const index = selectedIndex.value + direction
  if (index < 0)
    return
  if (index >= items.value.length && hasMore.value) {
    navigating.value = true
    try {
      await loadMore()
    }
    finally {
      navigating.value = false
    }
  }
  if (selectedId.value !== currentId || !items.value[index])
    return
  selectedId.value = items.value[index].id
  originalLoaded.value = false
  originalFailed.value = false
}

function keydown(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault()
    move(event.key === 'ArrowLeft' ? -1 : 1)
  }
}

watch(selected, (item) => {
  if (!item && dialog.value?.open)
    close()
})

function observeMore() {
  observer?.disconnect()
  if (sentinel.value && !loading.value && !error.value && hasMore.value && !selectedId.value)
    observer?.observe(sentinel.value)
}

watch([loading, error, hasMore, selectedId, sentinel], observeMore, { flush: 'post' })
onMounted(() => {
  measureLayout()
  if ('ResizeObserver' in window) {
    layoutObserver = new ResizeObserver(measureLayout)
    if (masonry.value)
      layoutObserver.observe(masonry.value)
  }
  window.addEventListener('resize', measureLayout)
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting) && !loading.value && !error.value && !selectedId.value)
        void loadMore()
    }, { rootMargin: '400px 0px' })
    observeMore()
  }
})
onBeforeUnmount(() => {
  observer?.disconnect()
  layoutObserver?.disconnect()
  window.removeEventListener('resize', measureLayout)
  restore()
})
</script>

<template>
  <main class="ai-gallery" :aria-label="copy.title">
    <div v-if="!items.length && (loading || error || !hasMore)" class="gallery-status" role="status" :aria-label="loading ? copy.loading : undefined">
      <span v-if="loading" class="gallery-loading"><span class="gallery-spinner" aria-hidden="true" /></span>
      <template v-else>
        <Icon :icon="error ? galleryIcons.unavailable : galleryIcons.images" aria-hidden="true" />
        <span>{{ error ? copy.error : copy.empty }}</span>
      </template>
      <button v-if="error" class="gallery-retry" type="button" :disabled="retrySeconds > 0" @click="loadMore">{{ retryLabel }}</button>
    </div>
    <div ref="masonry" class="gallery-masonry">
      <figure v-for="(item, index) in items" :key="item.id" class="gallery-work" :style="{ gridRowEnd: rowSpan(item) }">
        <button
          class="gallery-image-button"
          type="button"
          :style="{ aspectRatio: `${item.width} / ${item.height}`, maxHeight: `${layout.maxHeight}px` }"
          :aria-label="`${copy.open} ${localize(item.title) || copy.fallback}`"
          aria-haspopup="dialog"
          @click="open(item, $event)"
        >
          <span v-if="failed.has(item.src)" class="gallery-image-status" role="status">
            <Icon :icon="galleryIcons.unavailable" aria-hidden="true" />
            {{ copy.unavailable }}
          </span>
          <template v-else>
            <span v-if="!loaded.has(item.src)" class="gallery-placeholder" role="status" :aria-label="copy.loading" />
            <!-- Plume's PhotoSwipe must not open a second viewer for gallery images. -->
            <img
              no-view
              :ref="element => thumbnailReady(element, item.src)"
              :src="source(item.src)"
              :alt="alt(item)"
              :width="item.width"
              :height="item.height"
              :loading="index === 0 ? 'eager' : 'lazy'"
              decoding="async"
              :class="{ 'is-loaded': loaded.has(item.src) }"
              @load="imageLoaded(item, $event)"
              @error="markFailed(item.src)"
            >
          </template>
          <span class="gallery-enlarge" aria-hidden="true"><Icon :icon="galleryIcons.expand" /></span>
        </button>
      </figure>
    </div>

    <div v-if="hasMore" ref="sentinel" class="gallery-pagination" :aria-busy="loading">
      <span v-if="loading && items.length" class="gallery-loading" role="status" :aria-label="copy.loading"><span class="gallery-spinner" aria-hidden="true" /></span>
      <template v-else-if="!loading && (items.length || !error)">
        <span v-if="error" role="status">{{ copy.error }}</span>
        <button class="gallery-retry" type="button" :disabled="retrySeconds > 0" @click="loadMore">{{ error ? retryLabel : copy.more }}</button>
      </template>
    </div>

    <dialog ref="dialog" class="gallery-dialog" aria-labelledby="gallery-view-title" @close="closed" @keydown="keydown" @click="backdropClick">
      <template v-if="selected">
        <header class="gallery-view-heading">
          <div class="gallery-view-info">
            <h2 id="gallery-view-title" class="gallery-view-title">
              <span>{{ localize(selected.title) || copy.fallback }}</span>
              <a class="gallery-tool gallery-original" :href="source(selected.src)" target="_blank" rel="noopener noreferrer" :aria-label="copy.original" :title="copy.original"><Icon :icon="galleryIcons.original" aria-hidden="true" /></a>
            </h2>
            <p v-if="date(selected.createdAt) || fileSize(selected.size)" class="gallery-meta">
              <span v-if="fileSize(selected.size)">{{ fileSize(selected.size) }}</span>
              <time v-if="date(selected.createdAt)" :datetime="selected.createdAt?.slice(0, 10)">{{ date(selected.createdAt) }}</time>
            </p>
          </div>
          <button ref="closeButton" type="button" class="gallery-tool" :aria-label="copy.close" :title="copy.close" autofocus @click="close"><Icon :icon="galleryIcons.close" aria-hidden="true" /></button>
        </header>
        <div class="gallery-view-stage">
          <button type="button" class="gallery-tool gallery-step" :disabled="selectedIndex === 0 || navigating" :aria-label="copy.previous" :title="copy.previous" @click="move(-1)"><Icon :icon="galleryIcons.previous" aria-hidden="true" /></button>
          <div class="gallery-view-image" :aria-busy="!originalLoaded && !originalFailed">
            <span v-if="originalFailed" class="gallery-image-status" role="status">{{ copy.unavailable }}</span>
            <span v-else-if="!originalLoaded" class="gallery-image-status" role="status" :aria-label="copy.loading"><span class="gallery-spinner" aria-hidden="true" /></span>
            <img
              no-view
              v-if="!originalFailed"
              :key="selected.id"
              :src="source(selected.src)"
              :alt="alt(selected)"
              :width="selected.width"
              :height="selected.height"
              :class="{ 'is-loaded': originalLoaded }"
              @load="originalLoaded = true"
              @error="originalFailed = true"
            >
          </div>
          <button type="button" class="gallery-tool gallery-step" :disabled="navigating || (selectedIndex === items.length - 1 && (!hasMore || loading || retrySeconds > 0))" :aria-label="copy.next" :title="copy.next" @click="move(1)"><Icon :icon="galleryIcons.next" aria-hidden="true" /></button>
        </div>
        <footer class="gallery-view-footer">
          <span class="gallery-view-counter" aria-live="polite" aria-atomic="true">{{ selectedIndex + 1 }} / {{ items.length }}{{ hasMore ? '+' : '' }}</span>
          <span v-if="navigating" class="gallery-loading" role="status" :aria-label="copy.loading"><span class="gallery-spinner" aria-hidden="true" /></span>
          <template v-else-if="error">
            <span role="status">{{ copy.error }}</span>
            <button class="gallery-retry" type="button" :disabled="retrySeconds > 0" @click="loadMore">{{ retryLabel }}</button>
          </template>
        </footer>
      </template>
    </dialog>
  </main>
</template>

<style scoped>
:global(.ai-gallery-page .vp-home-custom) {
  padding: 0;
}

:global(.ai-gallery-page .vp-home-custom > .container) {
  max-width: none;
  padding: 0;
}

:global(.ai-gallery-page .vp-home-custom .vp-doc) {
  margin: 0;
  padding: 0;
}

.ai-gallery {
  max-width: 1200px;
  margin-inline: auto;
  padding: 24px 32px 80px;
  color: var(--vp-c-text-1);
  letter-spacing: 0;
}
.gallery-masonry {
  --gallery-columns: 4;
  --gallery-gap: 24px;
  --gallery-max-height: 420px;

  display: grid;
  grid-template-columns: repeat(var(--gallery-columns), minmax(0, 1fr));
  grid-auto-rows: 8px;
  grid-auto-flow: dense;
  column-gap: var(--gallery-gap);
  align-items: start;
}
.gallery-work { min-width: 0; margin: 0; padding-bottom: var(--gallery-gap); }
.gallery-image-button {
  position: relative; display: block; width: 100%; overflow: hidden;
  padding: 0; border: 0; border-radius: 6px;
  background: transparent; color: var(--vp-c-text-2); cursor: zoom-in;
}
.gallery-image-button img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; }
.gallery-image-button img, .gallery-view-image img { display: block; opacity: 0; transition: opacity 180ms ease; }
.gallery-image-button img.is-loaded, .gallery-view-image img.is-loaded { opacity: 1; }
.gallery-image-status { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 12px; padding: 20px; font-size: 14px; color: var(--vp-c-text-2); }
.gallery-image-status svg { width: 24px; height: 24px; }
.gallery-placeholder { position: absolute; inset: 0; border-radius: inherit; background: var(--gp-surface-bg-soft); pointer-events: none; }
.gallery-loading { display: inline-flex; align-items: center; justify-content: center; }
.gallery-spinner { display: inline-block; width: 20px; height: 20px; flex-shrink: 0; border: 2px solid var(--vp-c-divider); border-top-color: var(--vp-c-text-2); border-radius: 50%; animation: gallery-spin 900ms linear infinite; }
@keyframes gallery-spin { to { transform: rotate(360deg); } }
.gallery-enlarge { position: absolute; right: 12px; bottom: 12px; display: grid; place-items: center; width: 32px; height: 32px; border-radius: 4px; color: #fff; background: rgb(0 0 0 / 0.65); opacity: 0; transition: opacity 180ms ease; }
.gallery-enlarge svg { width: 18px; height: 18px; }
.gallery-image-button:hover .gallery-enlarge, .gallery-image-button:focus-visible .gallery-enlarge { opacity: 1; }
.gallery-meta { display: flex; flex-wrap: wrap; gap: 4px 12px; margin: 5px 0 0; color: var(--vp-c-text-2); font-size: 12px; overflow-wrap: anywhere; }
.gallery-status { position: relative; display: flex; align-items: center; justify-content: center; gap: 12px; min-height: 260px; color: var(--vp-c-text-2); }
.gallery-status > svg { width: 24px; height: 24px; flex-shrink: 0; }
.gallery-status > span { display: grid; gap: 8px; }
.gallery-status small { color: var(--vp-c-text-2); overflow-wrap: anywhere; }
.gallery-retry { padding: 8px 14px; border: 1px solid var(--vp-c-divider); border-radius: 4px; background: var(--gp-surface-bg-soft); color: var(--vp-c-text-1); cursor: pointer; }
.gallery-retry:focus-visible { outline: 2px solid var(--gp-icon-highlight); outline-offset: 3px; }
.gallery-retry:disabled { opacity: 0.5; cursor: wait; }
.gallery-pagination { display: flex; justify-content: center; align-items: center; gap: 12px; min-height: 56px; color: var(--vp-c-text-2); font-size: 14px; }
.gallery-dialog { position: fixed; inset: 0; width: calc(100% - 48px); max-width: 1440px; height: calc(100dvh - 48px); max-height: none; margin: auto; padding: 0 24px; border: 1px solid var(--vp-c-divider); border-radius: 8px; background: var(--gp-surface-bg-elv); color: var(--vp-c-text-1); }
.gallery-dialog[open] { display: grid; grid-template-rows: auto minmax(0, 1fr) auto; }
.gallery-dialog::backdrop { background: rgb(0 0 0 / 0.82); }
.gallery-view-heading { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 0; }
.gallery-view-info { min-width: 0; max-height: 140px; overflow: auto; }
.gallery-view-heading h2 { margin: 0; font-size: 16px; line-height: 1.5; font-weight: 500; overflow-wrap: anywhere; }
.gallery-view-title { display: flex; align-items: center; gap: 4px; }
.gallery-view-title > span { min-width: 0; }
.gallery-tool { display: inline-grid; place-items: center; flex-shrink: 0; width: 44px; height: 44px; padding: 0; border: 1px solid transparent; border-radius: 4px; background: transparent; color: var(--vp-c-text-1); cursor: pointer; }
.gallery-tool svg { width: 20px; height: 20px; }
.gallery-original svg { width: 18px; height: 18px; }
.gallery-view-stage { display: grid; grid-template-columns: 56px minmax(0, 1fr) 56px; gap: 12px; min-height: 0; }
.gallery-step { align-self: center; width: 56px; height: 64px; border-color: var(--vp-c-divider); border-radius: 8px; background: var(--gp-surface-bg-soft); }
.gallery-step svg { width: 36px; height: 36px; }
.gallery-tool:hover { background: var(--vp-c-default-soft); }
.gallery-tool:disabled { opacity: 0.3; cursor: default; }
.gallery-tool:focus-visible, .gallery-image-button:focus-visible { outline: 2px solid var(--gp-icon-highlight); outline-offset: 4px; }
.gallery-view-image { position: relative; min-width: 0; min-height: 0; display: grid; place-items: center; }
.gallery-view-image img { width: 100%; height: 100%; min-height: 0; object-fit: contain; }
.gallery-view-footer { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 12px; min-height: 56px; padding: 12px 0; }
.gallery-view-counter { font-size: 13px; color: var(--vp-c-text-2); font-variant-numeric: tabular-nums; }
@media (max-width: 959px) {
  .gallery-masonry { --gallery-columns: 2; --gallery-gap: 20px; }
}
@media (min-width: 960px) and (max-width: 1199px) {
  .gallery-masonry { --gallery-columns: 3; }
}
@media (max-width: 599px) {
  .ai-gallery { padding: 16px 20px 56px; }
  .gallery-masonry { --gallery-columns: 1; --gallery-max-height: 360px; }
  .gallery-dialog { width: 100%; height: 100dvh; max-width: none; margin: 0; padding: 0 16px; border: 0; border-radius: 0; }
  .gallery-view-stage { grid-template-columns: 44px minmax(0, 1fr) 44px; gap: 4px; }
  .gallery-step { width: 44px; height: 56px; }
  .gallery-step svg { width: 32px; height: 32px; }
  .gallery-view-heading { padding-top: max(12px, env(safe-area-inset-top)); }
  .gallery-view-footer { padding-bottom: max(12px, env(safe-area-inset-bottom)); }
}
@media (hover: none) { .gallery-enlarge { opacity: 1; } }
@media (prefers-reduced-motion: reduce) {
  .gallery-image-button img, .gallery-view-image img, .gallery-enlarge { transition: none; }
  .gallery-spinner { animation: none; }
}
</style>
