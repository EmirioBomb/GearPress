import { onBeforeUnmount, onMounted, ref, type Ref } from "vue"
import type { NavigationCategory, NavigationItem } from "./navigation.data"

export interface FavoriteGroup {
  id: NavigationCategory
  items: NavigationItem[]
}

type ReorderKind = "group" | "item"
interface ReorderTarget {
  kind: ReorderKind
  id: string
  category?: NavigationCategory
}
interface FavoriteDrag extends ReorderTarget {
  pointerId: number
  startX: number
  startY: number
  x: number
  y: number
  active: boolean
  targetId?: string
  handle: HTMLElement
}

// Keep valid saved entries and append new catalog entries without losing their default order.
export function normalizeFavoriteOrder(saved: unknown, defaults: readonly string[]) {
  const valid = new Set(defaults)
  const entries = Array.isArray(saved) ? saved.filter((id): id is string => typeof id === "string" && valid.has(id)) : []
  return [...new Set([...entries, ...defaults])]
}

export function moveFavoriteOrder(order: readonly string[], id: string, targetId: string) {
  const from = order.indexOf(id)
  const to = order.indexOf(targetId)
  if (from < 0 || to < 0 || from === to) return [...order]
  const next = [...order]
  next.splice(from, 1)
  next.splice(to, 0, id)
  return next
}

export function useFavoriteOrdering(options: {
  root: Ref<HTMLElement | undefined>
  categoryOrder: readonly NavigationCategory[]
  items: readonly NavigationItem[]
  getGroups: () => FavoriteGroup[]
  label: (kind: ReorderKind, id: string) => string
  announcement: (label: string, position: number, total: number) => string
  onFinish: () => void
}) {
  const storageKey = "gearpress-navigation-favorite-order-v1"
  const defaultItems = options.items.map(item => item.id)
  const groupOrder = ref<string[]>([...options.categoryOrder])
  const itemOrder = ref<string[]>([...defaultItems])
  const orderStorageUnavailable = ref(false)
  const isReorderingFavorites = ref(false)
  const reorderAnnouncement = ref("")
  const drag = ref<FavoriteDrag>()
  let dragFrame: number | undefined

  function restoreOrder() {
    try {
      const raw = window.localStorage.getItem(storageKey)
      if (!raw) return
      const value: unknown = JSON.parse(raw)
      if (typeof value !== "object" || value === null || !("version" in value) || value.version !== 1) return
      groupOrder.value = normalizeFavoriteOrder("groups" in value ? value.groups : undefined, options.categoryOrder)
      itemOrder.value = normalizeFavoriteOrder("items" in value ? value.items : undefined, defaultItems)
    }
    catch {
      orderStorageUnavailable.value = true
    }
  }

  function persistOrder() {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ version: 1, groups: groupOrder.value, items: itemOrder.value }))
      orderStorageUnavailable.value = false
    }
    catch {
      orderStorageUnavailable.value = true
    }
  }

  function visibleOrder(target: ReorderTarget) {
    const groups = options.getGroups()
    return target.kind === "group"
      ? groups.map(group => group.id as string)
      : groups.find(group => group.id === target.category)?.items.map(item => item.id) ?? []
  }

  function applyMove(source: ReorderTarget, targetId: string) {
    const visible = visibleOrder(source)
    if (!visible.includes(source.id) || !visible.includes(targetId) || source.id === targetId) return false
    const order = source.kind === "group" ? groupOrder : itemOrder
    order.value = moveFavoriteOrder(order.value, source.id, targetId)
    persistOrder()
    const position = visibleOrder(source).indexOf(source.id) + 1
    reorderAnnouncement.value = options.announcement(options.label(source.kind, source.id), position, visible.length)
    return true
  }

  function focusHandle(id: string) {
    const handle = [...(options.root.value?.querySelectorAll<HTMLElement>("[data-reorder-handle]") ?? [])]
      .find(element => element.dataset.reorderHandle === id)
    handle?.focus({ preventScroll: true })
    handle?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" })
  }

  function onFavoriteReorderKey(event: KeyboardEvent, kind: ReorderKind, id: string, category?: NavigationCategory) {
    if (event.key === "Escape") {
      event.preventDefault()
      finishFavoriteReordering()
      return
    }
    const backward = event.key === "ArrowUp" || (kind === "group" && event.key === "ArrowLeft")
    const forward = event.key === "ArrowDown" || (kind === "group" && event.key === "ArrowRight")
    if (!backward && !forward && event.key !== "Home" && event.key !== "End") return
    event.preventDefault()
    const source = { kind, id, category }
    const ids = visibleOrder(source)
    const index = ids.indexOf(id)
    const target = event.key === "Home" ? ids[0] : event.key === "End" ? ids.at(-1) : ids[index + (backward ? -1 : 1)]
    if (target && applyMove(source, target)) requestAnimationFrame(() => focusHandle(id))
  }

  function isFavoriteDrag(kind: ReorderKind, id: string) {
    return drag.value?.active && drag.value.kind === kind && drag.value.id === id
  }

  function isFavoriteDropTarget(kind: ReorderKind, id: string) {
    return drag.value?.active && drag.value.kind === kind && drag.value.targetId === id
  }

  function findDropTarget(current: FavoriteDrag) {
    const element = document.elementFromPoint(current.x, current.y)
    if (!element || !options.root.value?.contains(element)) return
    if (current.kind === "group") return element.closest<HTMLElement>("[data-favorite-group]")?.dataset.favoriteGroup
    const group = element.closest<HTMLElement>("[data-favorite-group]")
    if (group?.dataset.favoriteGroup !== current.category) return
    return element.closest<HTMLElement>("[data-favorite-id]")?.dataset.favoriteId
  }

  function scrollNearEdge(current: FavoriteDrag) {
    const scrollAmount = (start: number, end: number) => current.y < start + 36 ? -8 : current.y > end - 36 ? 8 : 0
    if (current.kind === "item") {
      const group = [...(options.root.value?.querySelectorAll<HTMLElement>("[data-favorite-group]") ?? [])]
        .find(element => element.dataset.favoriteGroup === current.category)
      const list = group?.querySelector<HTMLElement>(".favorites-links")
      if (list) {
        const bounds = list.getBoundingClientRect()
        if (current.x >= bounds.left && current.x <= bounds.right) {
          const delta = scrollAmount(bounds.top, bounds.bottom)
          const previous = list.scrollTop
          list.scrollTop += delta
          if (list.scrollTop !== previous) return
        }
      }
    }
    window.scrollBy({ top: scrollAmount(0, window.innerHeight), behavior: "instant" })
  }

  function updateDragFrame() {
    const current = drag.value
    if (!current?.active) return
    scrollNearEdge(current)
    const target = findDropTarget(current)
    current.targetId = target && target !== current.id ? target : undefined
    dragFrame = window.requestAnimationFrame(updateDragFrame)
  }

  function onPointerMove(event: PointerEvent) {
    const current = drag.value
    if (!current || event.pointerId !== current.pointerId) return
    current.x = event.clientX
    current.y = event.clientY
    if (!current.active && Math.hypot(current.x - current.startX, current.y - current.startY) >= 5) {
      current.active = true
      dragFrame = window.requestAnimationFrame(updateDragFrame)
    }
    if (current.active) event.preventDefault()
  }

  function stopFavoriteDrag() {
    const current = drag.value
    drag.value = undefined
    if (dragFrame !== undefined) window.cancelAnimationFrame(dragFrame)
    dragFrame = undefined
    window.removeEventListener("pointermove", onPointerMove)
    window.removeEventListener("pointerup", onPointerUp)
    window.removeEventListener("pointercancel", onPointerCancel)
    window.removeEventListener("keydown", onDragKeydown, true)
    window.removeEventListener("blur", onPointerCancel)
    if (current && current.pointerId >= 0 && current.handle.hasPointerCapture(current.pointerId)) current.handle.releasePointerCapture(current.pointerId)
  }

  function onPointerUp(event: PointerEvent) {
    const current = drag.value
    if (!current || event.pointerId !== current.pointerId) return
    current.x = event.clientX
    current.y = event.clientY
    const target = current.active ? findDropTarget(current) : undefined
    stopFavoriteDrag()
    if (target && applyMove(current, target)) requestAnimationFrame(() => focusHandle(current.id))
  }

  function onPointerCancel() {
    stopFavoriteDrag()
  }

  function onDragKeydown(event: KeyboardEvent) {
    if (event.key !== "Escape") return
    event.preventDefault()
    event.stopPropagation()
    const id = drag.value?.id
    stopFavoriteDrag()
    if (id) focusHandle(id)
  }

  function startFavoriteNativeDrag(event: DragEvent, kind: ReorderKind, id: string, category?: NavigationCategory) {
    const handle = event.currentTarget
    if (!isReorderingFavorites.value || !(handle instanceof HTMLElement) || !event.dataTransfer) {
      event.preventDefault()
      return
    }
    stopFavoriteDrag()
    event.dataTransfer.effectAllowed = "move"
    event.dataTransfer.setData("text/plain", id)
    // Desktop uses native drag images; touch and pen use the pointer handlers below.
    drag.value = { kind, id, category, pointerId: -1, startX: event.clientX, startY: event.clientY, x: event.clientX, y: event.clientY, active: true, handle }
    dragFrame = window.requestAnimationFrame(updateDragFrame)
    window.addEventListener("keydown", onDragKeydown, true)
    window.addEventListener("blur", onPointerCancel)
  }

  function onFavoriteNativeDragOver(event: DragEvent) {
    const current = drag.value
    if (!current || current.pointerId !== -1) return
    current.x = event.clientX
    current.y = event.clientY
    const target = findDropTarget(current)
    current.targetId = target && target !== current.id ? target : undefined
    if (!target) return
    event.preventDefault()
    if (event.dataTransfer) event.dataTransfer.dropEffect = "move"
  }

  function onFavoriteNativeDrop(event: DragEvent) {
    const current = drag.value
    if (!current || current.pointerId !== -1) return
    event.preventDefault()
    current.x = event.clientX
    current.y = event.clientY
    const target = findDropTarget(current)
    stopFavoriteDrag()
    if (target && applyMove(current, target)) requestAnimationFrame(() => focusHandle(current.id))
  }

  function startFavoriteDrag(event: PointerEvent, kind: ReorderKind, id: string, category?: NavigationCategory) {
    if (!isReorderingFavorites.value || event.button !== 0 || !event.isPrimary || event.pointerType === "mouse") return
    const handle = event.currentTarget
    if (!(handle instanceof HTMLElement)) return
    stopFavoriteDrag()
    handle.focus({ preventScroll: true })
    handle.setPointerCapture(event.pointerId)
    drag.value = { kind, id, category, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, x: event.clientX, y: event.clientY, active: false, handle }
    window.addEventListener("pointermove", onPointerMove, { passive: false })
    window.addEventListener("pointerup", onPointerUp)
    window.addEventListener("pointercancel", onPointerCancel)
    window.addEventListener("keydown", onDragKeydown, true)
    window.addEventListener("blur", onPointerCancel)
  }

  function finishFavoriteReordering() {
    stopFavoriteDrag()
    isReorderingFavorites.value = false
    options.onFinish()
  }

  function toggleFavoriteReordering() {
    if (isReorderingFavorites.value) finishFavoriteReordering()
    else isReorderingFavorites.value = true
  }

  onMounted(restoreOrder)
  onBeforeUnmount(stopFavoriteDrag)

  return {
    groupOrder, itemOrder, orderStorageUnavailable, isReorderingFavorites, reorderAnnouncement,
    toggleFavoriteReordering, finishFavoriteReordering, startFavoriteDrag, onFavoriteReorderKey,
    isFavoriteDrag, isFavoriteDropTarget,
    startFavoriteNativeDrag, onFavoriteNativeDragOver, onFavoriteNativeDrop, stopFavoriteDrag,
  }
}
