<template>
  <div
    ref="root"
    class="select-menu"
    :class="{ 'is-open': isOpen }"
    @focusout="onFocusOut"
  >
    <button
      :id="triggerId"
      ref="trigger"
      type="button"
      class="select-menu-trigger"
      :aria-label="triggerAriaLabel"
      :aria-controls="menuId"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :disabled="disabled"
      @click="toggleMenu"
      @keydown="onTriggerKeydown"
    >
      <span class="select-menu-trigger-label">{{ activeOption?.label }}</span>
      <span
        v-if="activeOption?.count !== undefined"
        class="select-menu-count select-menu-trigger-count"
        aria-hidden="true"
      >
        {{ activeOption.count }}
      </span>
      <Icon icon="lucide:chevron-down" class="select-menu-chevron" aria-hidden="true" />
    </button>

    <Transition name="select-menu-popover">
      <div
        v-if="isOpen"
        :id="menuId"
        class="select-menu-popover"
        role="listbox"
        :aria-label="ariaLabel"
      >
        <div
          v-for="(option, index) in options"
          :id="optionId(index)"
          :key="option.value"
          :ref="element => setOptionRef(element, index)"
          class="select-menu-option"
          :class="{ 'is-active': option.value === modelValue }"
          role="option"
          tabindex="-1"
          :aria-selected="option.value === modelValue"
          @click="selectOption(index)"
          @keydown="onOptionKeydown($event, index)"
          @pointermove="activeIndex = index"
        >
          <Icon
            icon="lucide:check"
            class="select-menu-check"
            :class="{ 'is-visible': option.value === modelValue }"
            aria-hidden="true"
          />
          <span class="select-menu-option-label">{{ option.label }}</span>
          <span
            v-if="option.count !== undefined"
            class="select-menu-count select-menu-option-count"
            aria-hidden="true"
          >
            {{ option.count }}
          </span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useId,
  watch,
} from "vue"

export interface SelectMenuOption {
  value: string
  label: string
  count?: number
}

const props = withDefaults(defineProps<{
  modelValue: string
  options: readonly SelectMenuOption[]
  ariaLabel: string
  disabled?: boolean
}>(), {
  disabled: false,
})

const emit = defineEmits<{
  "update:modelValue": [value: string]
}>()

const instanceId = useId().replace(/:/g, "")
const triggerId = `select-menu-trigger-${instanceId}`
const menuId = `select-menu-listbox-${instanceId}`
const root = ref<HTMLElement>()
const trigger = ref<HTMLButtonElement>()
const optionElements = ref<Array<HTMLElement | undefined>>([])
const isOpen = ref(false)
const activeIndex = ref(0)
let typeaheadQuery = ""
let typeaheadTimer: ReturnType<typeof setTimeout> | undefined

const selectedIndex = computed(() =>
  props.options.findIndex(option => option.value === props.modelValue),
)
const activeOption = computed(() =>
  props.options[selectedIndex.value] ?? props.options[0],
)
const triggerAriaLabel = computed(() => {
  const value = activeOption.value?.label
  return value ? `${props.ariaLabel}: ${value}` : props.ariaLabel
})

watch(
  () => [props.modelValue, props.options] as const,
  () => {
    if (isOpen.value) activeIndex.value = normalizedIndex(selectedIndex.value)
  },
)

function optionId(index: number) {
  return `${menuId}-option-${index}`
}

function normalizedIndex(index: number) {
  if (!props.options.length) return 0
  return Math.min(Math.max(index, 0), props.options.length - 1)
}

function setOptionRef(element: unknown, index: number) {
  if (typeof HTMLElement !== "undefined" && element instanceof HTMLElement) {
    optionElements.value[index] = element
  } else {
    optionElements.value[index] = undefined
  }
}

async function openMenu(index = selectedIndex.value) {
  if (props.disabled || !props.options.length) return

  isOpen.value = true
  activeIndex.value = normalizedIndex(index < 0 ? 0 : index)
  await nextTick()
  optionElements.value[activeIndex.value]?.focus()
}

function closeMenu(restoreFocus = false) {
  if (!isOpen.value) return

  isOpen.value = false
  clearTypeahead()
  if (restoreFocus) nextTick(() => trigger.value?.focus())
}

function toggleMenu() {
  if (isOpen.value) closeMenu()
  else openMenu()
}

function focusOption(index: number) {
  if (!props.options.length) return

  const nextIndex = (index + props.options.length) % props.options.length
  activeIndex.value = nextIndex
  optionElements.value[nextIndex]?.focus()
}

function selectOption(index: number) {
  const option = props.options[index]
  if (!option) return

  emit("update:modelValue", option.value)
  closeMenu(true)
}

function onTriggerKeydown(event: KeyboardEvent) {
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault()
    const fallbackIndex = event.key === "ArrowDown" ? 0 : props.options.length - 1
    openMenu(selectedIndex.value >= 0 ? selectedIndex.value : fallbackIndex)
    return
  }

  if (event.key === "Home" || event.key === "End") {
    event.preventDefault()
    openMenu(event.key === "Home" ? 0 : props.options.length - 1)
    return
  }

  if (isTypeaheadKey(event)) {
    const match = findTypeaheadMatch(event.key, selectedIndex.value)
    if (match >= 0) emit("update:modelValue", props.options[match].value)
  }
}

function onOptionKeydown(event: KeyboardEvent, index: number) {
  switch (event.key) {
    case "ArrowDown":
      event.preventDefault()
      focusOption(index + 1)
      return
    case "ArrowUp":
      event.preventDefault()
      focusOption(index - 1)
      return
    case "Home":
      event.preventDefault()
      focusOption(0)
      return
    case "End":
      event.preventDefault()
      focusOption(props.options.length - 1)
      return
    case "Enter":
    case " ":
      event.preventDefault()
      selectOption(index)
      return
    case "Escape":
      event.preventDefault()
      closeMenu(true)
      return
  }

  if (isTypeaheadKey(event)) {
    event.preventDefault()
    const match = findTypeaheadMatch(event.key, index)
    if (match >= 0) focusOption(match)
  }
}

function isTypeaheadKey(event: KeyboardEvent) {
  return event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey
}

function findTypeaheadMatch(key: string, currentIndex: number) {
  typeaheadQuery += key.toLocaleLowerCase()
  if (typeaheadTimer) clearTimeout(typeaheadTimer)
  typeaheadTimer = setTimeout(clearTypeahead, 650)

  const query = typeaheadQuery
  for (let offset = 1; offset <= props.options.length; offset += 1) {
    const index = (Math.max(currentIndex, -1) + offset) % props.options.length
    if (props.options[index]?.label.toLocaleLowerCase().startsWith(query)) return index
  }

  if (query.length > 1) {
    typeaheadQuery = key.toLocaleLowerCase()
    return findTypeaheadMatchFrom(typeaheadQuery, currentIndex)
  }

  return -1
}

function findTypeaheadMatchFrom(query: string, currentIndex: number) {
  for (let offset = 1; offset <= props.options.length; offset += 1) {
    const index = (Math.max(currentIndex, -1) + offset) % props.options.length
    if (props.options[index]?.label.toLocaleLowerCase().startsWith(query)) return index
  }
  return -1
}

function clearTypeahead() {
  typeaheadQuery = ""
  if (typeaheadTimer) clearTimeout(typeaheadTimer)
  typeaheadTimer = undefined
}

function onFocusOut(event: FocusEvent) {
  const nextFocused = event.relatedTarget
  if (nextFocused instanceof Node && root.value?.contains(nextFocused)) return
  closeMenu()
}

function onDocumentPointerDown(event: PointerEvent) {
  if (!root.value?.contains(event.target as Node)) closeMenu()
}

onMounted(() => document.addEventListener("pointerdown", onDocumentPointerDown))
onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", onDocumentPointerDown)
  clearTypeahead()
})
</script>

<style scoped>
.select-menu {
  position: relative;
  z-index: var(--gp-select-z-index, 30);
  display: inline-block;
  min-width: var(--gp-select-min-width, 126px);
  color: var(--vp-c-text-1);
  font: inherit;
}

.select-menu-trigger {
  display: flex;
  width: 100%;
  height: var(--gp-select-trigger-height, 34px);
  box-sizing: border-box;
  gap: 7px;
  align-items: center;
  padding: 0 9px 0 11px;
  color: inherit;
  font: inherit;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  border: 1px solid color-mix(in srgb, var(--gp-blue) 35%, var(--gp-home-card-border));
  border-radius: 10px;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--gp-blue) 13%, transparent), transparent 74%),
    color-mix(in srgb, var(--gp-surface-bg-elv) 92%, transparent);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 7%),
    0 4px 12px rgb(42 67 89 / 0.07);
  cursor: pointer;
  transition: border-color 160ms ease, background 160ms ease, box-shadow 160ms ease;
}

.select-menu-trigger:hover,
.select-menu-trigger[aria-expanded="true"] {
  border-color: color-mix(in srgb, var(--gp-cyan) 62%, var(--gp-home-card-border));
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--gp-blue) 23%, transparent), transparent 74%),
    color-mix(in srgb, var(--gp-surface-bg-elv) 96%, transparent);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 10%),
    0 0 14px color-mix(in srgb, var(--gp-active-glow) 24%, transparent);
}

.select-menu-trigger:focus-visible,
.select-menu-option:focus-visible {
  outline: 2px solid var(--gp-cyan);
  outline-offset: 2px;
}

.select-menu-trigger:disabled {
  cursor: not-allowed;
  opacity: 0.52;
}

.select-menu-trigger-label,
.select-menu-option-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.select-menu-trigger-label {
  flex: 1;
  text-align: left;
}

.select-menu-chevron {
  width: 14px;
  height: 14px;
  flex: none;
  color: var(--gp-cyan);
  transition: transform 160ms ease;
}

.select-menu-trigger[aria-expanded="true"] .select-menu-chevron {
  transform: rotate(180deg);
}

.select-menu-count {
  display: inline-flex;
  box-sizing: border-box;
  flex: none;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-text-2);
  font-variant-numeric: tabular-nums;
  font-weight: 750;
  border: 1px solid color-mix(in srgb, var(--gp-blue) 30%, var(--gp-home-card-border));
  border-radius: 999px;
  background: color-mix(in srgb, var(--gp-blue) 12%, var(--gp-surface-bg-elv));
}

.select-menu-trigger-count {
  min-width: 20px;
  height: 18px;
  padding: 0 5px;
  color: var(--vp-c-text-1);
  font-size: 10px;
  border-color: color-mix(in srgb, var(--gp-cyan) 38%, var(--gp-home-card-border));
  background: color-mix(in srgb, var(--gp-blue) 18%, var(--gp-surface-bg-elv));
}

.select-menu-popover {
  position: absolute;
  z-index: 1;
  top: calc(100% + 7px);
  right: 0;
  display: grid;
  width: max-content;
  min-width: max(100%, var(--gp-select-menu-min-width, 160px));
  max-width: calc(100vw - 24px);
  box-sizing: border-box;
  padding: 5px;
  border: 1px solid color-mix(in srgb, var(--gp-cyan) 28%, var(--gp-home-card-border));
  border-radius: 12px;
  background: color-mix(in srgb, var(--gp-surface-bg-elv) 96%, var(--vp-c-bg));
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 8%),
    0 14px 32px rgb(0 0 0 / 28%);
  backdrop-filter: blur(16px);
}

.select-menu-option {
  display: grid;
  grid-template-columns: 16px minmax(0, 1fr) auto;
  min-width: 0;
  min-height: var(--gp-select-option-height, 40px);
  box-sizing: border-box;
  gap: 8px;
  align-items: center;
  padding: 0 9px;
  color: var(--vp-c-text-2);
  font-size: 11px;
  font-weight: 600;
  line-height: 1.3;
  border-radius: 8px;
  cursor: pointer;
  transition: color 140ms ease, background 140ms ease, box-shadow 140ms ease;
}

.select-menu-option:hover,
.select-menu-option:focus-visible {
  color: var(--vp-c-text-1);
  background: color-mix(in srgb, var(--gp-blue) 13%, transparent);
}

.select-menu-option.is-active {
  color: var(--vp-c-text-1);
  font-weight: 750;
  background: var(--gp-gradient-active);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--gp-active-border) 60%, transparent);
}

.select-menu-check {
  width: 14px;
  height: 14px;
  color: var(--gp-cyan);
  opacity: 0;
}

.select-menu-check.is-visible {
  opacity: 1;
}

.select-menu-option-count {
  min-width: 21px;
  height: 18px;
  padding: 0 5px;
  font-size: 9px;
}

.select-menu-option.is-active .select-menu-option-count {
  color: var(--vp-c-text-1);
  border-color: color-mix(in srgb, var(--gp-cyan) 55%, var(--gp-home-card-border));
  background: color-mix(in srgb, var(--gp-cyan) 17%, var(--gp-surface-bg-elv));
}

.select-menu-popover-enter-active,
.select-menu-popover-leave-active {
  transition: opacity 140ms ease, transform 140ms ease;
  transform-origin: top right;
}

.select-menu-popover-enter-from,
.select-menu-popover-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}

@media (max-width: 640px) {
  .select-menu-trigger {
    height: max(44px, var(--gp-select-trigger-height, 34px));
  }

  .select-menu-option {
    min-height: max(44px, var(--gp-select-option-height, 40px));
  }
}

@media (prefers-reduced-motion: reduce) {
  .select-menu-trigger,
  .select-menu-chevron,
  .select-menu-option,
  .select-menu-popover-enter-active,
  .select-menu-popover-leave-active {
    transition: none;
  }
}
</style>
