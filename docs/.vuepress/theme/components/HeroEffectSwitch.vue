<script setup lang="ts">
import type { Component } from 'vue'
import DotGrid from 'vuepress-theme-plume/components/background/DotGrid.vue'
import LiquidEther from 'vuepress-theme-plume/components/background/LiquidEther.vue'
import { computed, markRaw, onMounted, onUnmounted, ref } from 'vue'
import { useData } from 'vuepress-theme-plume/composables'

type HeroEffect = 'liquid-ether' | 'dot-grid'

interface EffectOption {
  value: HeroEffect
  label: { zh: string, en: string }
  component: Component
  config: Record<string, unknown>
}

const STORAGE_KEY = 'gearpress-hero-effect'
const DEFAULT_EFFECT: HeroEffect = 'dot-grid'
const effects: readonly EffectOption[] = [
  {
    value: 'liquid-ether',
    label: { zh: '流体', en: 'Liquid' },
    component: markRaw(LiquidEther),
    config: {
      mouseForce: 40,
      cursorSize: 60,
      isViscous: false,
      viscous: 48,
      iterationsViscous: 32,
      iterationsPoisson: 48,
      dt: 0.015,
      BFECC: true,
      resolution: 0.5,
      isBounce: false,
      autoDemo: false,
      autoSpeed: 1,
      autoIntensity: 0.5,
      takeoverDuration: 0.1,
      autoResumeDelay: 500,
      autoRampDuration: 1,
    },
  },
  {
    value: 'dot-grid',
    label: { zh: '点阵', en: 'Dot grid' },
    component: markRaw(DotGrid),
    config: {
      dotSize: 4,
      gap: 18,
      activeColor: '#7040cf',
      proximity: 140,
    },
  },
]

const { frontmatter, isDark, lang } = useData()
const selected = ref<HeroEffect>(DEFAULT_EFFECT)
const effectLayer = ref<HTMLElement | null>(null)
const isHeroPage = computed(() => {
  if (frontmatter.value.home === true)
    return true

  const config = frontmatter.value.config
  return Array.isArray(config) && config.some(item =>
    typeof item === 'object'
    && item !== null
    && 'type' in item
    && item.type === 'hero',
  )
})
const current = computed(() =>
  effects.find(option => option.value === selected.value)
  ?? effects.find(option => option.value === DEFAULT_EFFECT)!,
)
const label = computed(() => lang.value.startsWith('zh') ? current.value.label.zh : current.value.label.en)
const currentConfig = computed(() => {
  if (current.value.value === 'liquid-ether') {
    return {
      ...current.value.config,
      // 全站通过窗口级鼠标事件驱动流体，避免背景层阻挡页面交互。
      autoDemo: false,
      colors: isDark.value
        ? ['#68aec1', '#a88be8', '#7096c2', '#d1e8e2']
        : ['#050a30', '#7040cf', '#7096c2', '#68aec1'],
    }
  }

  if (current.value.value === 'dot-grid') {
    return {
      ...current.value.config,
      baseColor: isDark.value ? '#19324f' : '#b5ccda',
      activeColor: isDark.value ? '#8be9f4' : '#167c96',
    }
  }

  return current.value.config
})
const layerStyle = computed(() => ({
  background: current.value.value === 'dot-grid'
    ? isDark.value
      ? isHeroPage.value
        ? 'radial-gradient(circle at 50% 40%, rgb(18 75 117 / 46%), transparent 45%), #030914'
        : 'radial-gradient(circle at 50% 32%, rgb(18 75 117 / 28%), transparent 48%), #080d17'
      : isHeroPage.value
        ? 'radial-gradient(circle at 50% 40%, rgb(126 191 220 / 28%), transparent 45%), #f5fafd'
        : 'radial-gradient(circle at 50% 32%, rgb(126 191 220 / 18%), transparent 48%), #f5fafd'
    : isDark.value ? '#080d17' : '#f5fafd',
}))

function isHeroEffect(value: string | null): value is HeroEffect {
  return effects.some(option => option.value === value)
}

function setEffect(value: HeroEffect, persist = true) {
  selected.value = value
  if (persist)
    localStorage.setItem(STORAGE_KEY, value)
}

function cycleEffect() {
  const index = effects.findIndex(option => option.value === selected.value)
  setEffect(effects[(index + 1) % effects.length].value)
}

function forwardPointerToLiquid(event: MouseEvent) {
  if (selected.value !== 'liquid-ether')
    return

  const liquid = effectLayer.value?.querySelector<HTMLElement>('.home-hero-effect-liquid-ether')
  liquid?.dispatchEvent(new MouseEvent('mousemove', {
    clientX: event.clientX,
    clientY: event.clientY,
  }))
}

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (isHeroEffect(saved))
    setEffect(saved, false)
  else
    localStorage.removeItem(STORAGE_KEY)

  window.addEventListener('mousemove', forwardPointerToLiquid)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', forwardPointerToLiquid)
})
</script>

<template>
  <Teleport to="body">
    <div
      ref="effectLayer"
      class="hero-effect-layer"
      :class="{ 'is-content-page': !isHeroPage }"
      :style="layerStyle"
    >
      <component
        :is="current.component"
        class="hero-effect-canvas"
        v-bind="currentConfig"
      />
    </div>
  </Teleport>

  <button
    class="hero-effect-switch"
    type="button"
    :aria-label="lang.startsWith('zh') ? `切换页面背景，当前为${label}` : `Switch page background, currently ${label}`"
    :title="lang.startsWith('zh') ? `背景：${label}` : `Background: ${label}`"
    @click="cycleEffect"
  >
    <svg v-if="current.value === 'liquid-ether'" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 8c2.3-2 4.7-2 7 0s4.7 2 7 0 3.7-1.8 4-1.6M3 12c2.3-2 4.7-2 7 0s4.7 2 7 0 3.7-1.8 4-1.6M3 16c2.3-2 4.7-2 7 0s4.7 2 7 0 3.7-1.8 4-1.6" />
    </svg>
    <svg v-else-if="current.value === 'dot-grid'" class="dot-grid-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="6" cy="6" r="1" />
      <circle cx="12" cy="6" r="1" />
      <circle cx="18" cy="6" r="1" />
      <circle cx="6" cy="12" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="18" cy="12" r="1" />
      <circle cx="6" cy="18" r="1" />
      <circle cx="12" cy="18" r="1" />
      <circle cx="18" cy="18" r="1" />
    </svg>
    <svg v-else viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="7.5" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5v2M21.5 12h-2M12 21.5v-2M2.5 12h2" />
    </svg>
    <span>{{ label }}</span>
  </button>
</template>

<style scoped>
.hero-effect-layer {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  transition: background-color var(--vp-t-color);
}

.hero-effect-canvas {
  position: absolute;
  inset: 0;
}

/* 主页保留完整效果；内容页降低背景强度，同时继续响应全局鼠标移动。 */
.hero-effect-layer.is-content-page .hero-effect-canvas {
  opacity: 0.62;
}

.hero-effect-switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  margin-left: 2px;
  font: inherit;
  color: var(--vp-c-brand-1);
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 8px;
  box-shadow: none;
  transition: color var(--vp-t-color), background-color var(--vp-t-color);
}

.hero-effect-switch:hover {
  color: var(--gp-icon-highlight);
  background: var(--vp-c-default-soft);
}

.hero-effect-switch svg {
  width: 21px;
  height: 21px;
  fill: none;
  stroke: currentcolor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.9;
}

.hero-effect-switch .dot-grid-icon circle {
  fill: currentcolor;
  stroke: none;
}

.hero-effect-switch span {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>

<style>
/* The switcher renders Plume's selected effect; hide the frontmatter fallback. */
.vp-home-hero > [class^='home-hero-effect-'] {
  visibility: hidden;
}
</style>