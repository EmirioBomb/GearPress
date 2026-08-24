<script setup lang="ts">
import type { Component } from 'vue'
import DotGrid from 'vuepress-theme-plume/components/background/DotGrid.vue'
import LiquidEther from 'vuepress-theme-plume/components/background/LiquidEther.vue'
import Orb from 'vuepress-theme-plume/components/background/Orb.vue'
import { computed, markRaw, onMounted, ref } from 'vue'
import { useData } from 'vuepress-theme-plume/composables'

type HeroEffect = 'liquid-ether' | 'dot-grid' | 'orb'

interface EffectOption {
  value: HeroEffect
  label: { zh: string, en: string }
  component: Component
  config: Record<string, unknown>
}

const STORAGE_KEY = 'gearpress-hero-effect'
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
  {
    value: 'orb',
    label: { zh: '光球', en: 'Orb' },
    component: markRaw(Orb),
    config: {
      hue: 258,
      hoverIntensity: 0.25,
      rotateOnHover: true,
    },
  },
]

const { frontmatter, isDark, lang } = useData<'home'>()
const selected = ref<HeroEffect>('liquid-ether')
const isHome = computed(() => frontmatter.value.home === true || frontmatter.value.pageLayout === 'home')
const current = computed(() => effects.find(option => option.value === selected.value) ?? effects[0])
const label = computed(() => lang.value.startsWith('zh') ? current.value.label.zh : current.value.label.en)
const currentConfig = computed(() => {
  if (current.value.value === 'liquid-ether') {
    return {
      ...current.value.config,
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
      ? 'radial-gradient(circle at 50% 40%, rgb(18 75 117 / 46%), transparent 45%), #030914'
      : 'radial-gradient(circle at 50% 40%, rgb(126 191 220 / 28%), transparent 45%), #f5fafd'
    : 'var(--vp-c-bg)',
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

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (isHeroEffect(saved))
    setEffect(saved, false)
  else
    localStorage.removeItem(STORAGE_KEY)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isHome"
      class="hero-effect-layer"
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
    v-if="isHome"
    class="hero-effect-switch"
    type="button"
    :aria-label="lang.startsWith('zh') ? `切换首页背景，当前为${label}` : `Switch homepage background, currently ${label}`"
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
  transition: background-color var(--vp-t-color);
}

.hero-effect-canvas {
  position: absolute;
  inset: 0;
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
  color: var(--vp-c-text-2);
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 8px;
  transition: color var(--vp-t-color), background-color var(--vp-t-color);
}

.hero-effect-switch:hover {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-default-soft);
}

.hero-effect-switch svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentcolor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.6;
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