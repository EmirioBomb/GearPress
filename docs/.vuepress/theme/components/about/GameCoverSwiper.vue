<template>
  <div
    class="coverflow-shell"
    role="region"
    :aria-label="title ?? 'Game covers'"
  >
    <div class="coverflow-header">
      <p v-if="title" class="section-label">{{ title }}</p>

      <SelectMenu
        :model-value="activeSeries"
        class="series-filter"
        :options="seriesOptions"
        :aria-label="seriesSelectLabel"
        @update:model-value="setSeries"
      />

    </div>

    <div
      class="coverflow-stage"
      @focusin="pauseAutoplay"
      @focusout="resumeAutoplay"
    >
      <Swiper
        :key="swiperKey"
        class="coverflow"
        effect="coverflow"
        grab-cursor
        centered-slides
        :loop="enableLoop"
        :rewind="enableRewind"
        :initial-slide="initialSlide"
        :speed="520"
        keyboard
        :slides-per-view="'auto'"
        :coverflow-effect="coverflow"
        :autoplay="autoplay"
        :prevent-clicks="true"
        :prevent-clicks-propagation="true"
        :modules="modules"
        @swiper="onSwiper"
      >
        <SwiperSlide
          v-for="(game, index) in filteredItems"
          :key="`${activeSeries}-${game.name}`"
          class="slide"
        >
          <component
            :is="game.href ? 'a' : 'div'"
            class="card"
            v-bind="game.href ? externalLinkAttributes(game) : undefined"
          >
            <img
              class="cover"
              :src="withBase(game.link)"
              :alt="game.name"
              width="640"
              height="960"
              :style="{
                objectFit: game.imageFit ?? 'cover',
                objectPosition: game.imagePosition ?? 'center',
              }"
              :loading="index === 0 ? 'eager' : 'lazy'"
              decoding="async"
              @error="onImgError"
            />

            <div class="overlay" aria-hidden="true" />

            <div class="content">
              <div class="title">
                {{ game.name }}
              </div>

              <div v-if="game.tags?.length" class="tags">
                <span
                  v-for="tag in game.tags"
                  :key="tag"
                  class="tag"
                >
                  {{ tag }}
                </span>
              </div>

              <div v-if="game.platform?.length" class="platforms">
                <Icon
                  v-for="p in game.platform"
                  :key="p"
                  :icon="p"
                  class="platform-icon"
                  aria-hidden="true"
                />
              </div>

              <div v-if="game.description" class="desc">
                {{ game.description }}
              </div>
            </div>
          </component>
        </SwiperSlide>
      </Swiper>

      <button
        class="coverflow-button coverflow-button-prev"
        type="button"
        :aria-label="previousLabel"
        :title="previousLabel"
        @click="slidePrev"
      >
        <span aria-hidden="true">‹</span>
      </button>
      <button
        class="coverflow-button coverflow-button-next"
        type="button"
        :aria-label="nextLabel"
        :title="nextLabel"
        @click="slideNext"
      >
        <span aria-hidden="true">›</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { usePreferredReducedMotion } from "@vueuse/core"
import { Swiper, SwiperSlide } from "swiper/vue"
import type { Swiper as SwiperInstance } from "swiper"
import { Autoplay, EffectCoverflow, Keyboard } from "swiper/modules"
import { Icon } from "@iconify/vue"
import { withBase } from "vuepress/client"

import SelectMenu from "../SelectMenu.vue"
import type { GameItem, GameSeries } from "./data/game-cover.data"

import "swiper/css"
import "swiper/css/effect-coverflow"

export type { GameItem, GameSeries }

type GameCoverLocale = "zh-CN" | "en"
type SeriesFilterId = "all" | GameSeries

const SERIES_ORDER: GameSeries[] = ["tales", "gundam", "final-fantasy"]

const props = defineProps<{
  items: GameItem[]
  title?: string
  locale?: GameCoverLocale
}>()

const modules = [Autoplay, EffectCoverflow, Keyboard]
const prefersReducedMotion = usePreferredReducedMotion()
const swiper = ref<SwiperInstance>()
const activeSeries = ref<SeriesFilterId>("all")

const isEnglish = computed(() => props.locale === "en")
const previousLabel = computed(() => isEnglish.value ? "Previous" : "上一张")
const nextLabel = computed(() => isEnglish.value ? "Next" : "下一张")
const seriesSelectLabel = computed(() => isEnglish.value ? "Game series" : "游戏系列")

const coverflow = {
  rotate: 12,
  stretch: 0,
  depth: 110,
  modifier: 1,
  slideShadows: false
}

const autoplay = computed(() => {
  if (prefersReducedMotion.value === "reduce") return false

  return {
    delay: 4500,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  }
})

function resolveSeries(game: GameItem): GameSeries | null {
  if (game.series) return game.series

  const name = game.name
  if (/^Tales of\b/i.test(name)) return "tales"
  if (/\bSD Gundam\b/i.test(name) || /\bGundam\b/i.test(name)) return "gundam"
  if (/\bFinal Fantasy\b/i.test(name)) return "final-fantasy"
  return null
}

function seriesLabel(id: SeriesFilterId): string {
  if (id === "all") return isEnglish.value ? "All" : "全部"

  const labels: Record<GameSeries, { zh: string; en: string }> = {
    tales: { zh: "传说", en: "TalesOf" },
    gundam: { zh: "高达", en: "Gundam" },
    "final-fantasy": { zh: "最终幻想", en: "Final Fantasy" },
  }

  return isEnglish.value ? labels[id].en : labels[id].zh
}

const classifiedItems = computed(() =>
  props.items.map(game => ({
    game,
    series: resolveSeries(game),
  })),
)

const seriesCounts = computed(() => {
  const counts: Record<SeriesFilterId, number> = {
    all: props.items.length,
    tales: 0,
    gundam: 0,
    "final-fantasy": 0,
  }

  for (const item of classifiedItems.value) {
    if (!item.series) continue
    counts[item.series] += 1
  }

  return counts
})

const availableSeries = computed(() =>
  SERIES_ORDER.filter(series => seriesCounts.value[series] > 0),
)

const seriesOptions = computed(() => [
  {
    value: "all",
    label: seriesLabel("all"),
    count: seriesCounts.value.all,
  },
  ...availableSeries.value.map(series => ({
    value: series,
    label: seriesLabel(series),
    count: seriesCounts.value[series],
  })),
])

const filteredItems = computed(() => {
  if (activeSeries.value === "all") return props.items

  return classifiedItems.value
    .filter(item => item.series === activeSeries.value)
    .map(item => item.game)
})

const initialSlide = computed(() => Math.floor(filteredItems.value.length / 2))
const enableLoop = computed(() => filteredItems.value.length > 6)
const enableRewind = computed(() => filteredItems.value.length > 1 && !enableLoop.value)
const swiperKey = computed(() => `${activeSeries.value}-${filteredItems.value.length}`)

function setSeries(series: string) {
  if (series !== "all" && !SERIES_ORDER.includes(series as GameSeries)) return

  const nextSeries = series as SeriesFilterId
  if (activeSeries.value === nextSeries) return
  activeSeries.value = nextSeries
  swiper.value = undefined
}

function onSwiper(instance: SwiperInstance) {
  swiper.value = instance
}

function pauseAutoplay() {
  swiper.value?.autoplay?.pause()
}

function resumeAutoplay(event: FocusEvent) {
  const nextFocused = event.relatedTarget
  const currentTarget = event.currentTarget

  if (
    currentTarget instanceof HTMLElement
    && nextFocused instanceof Node
    && currentTarget.contains(nextFocused)
  ) return

  if (prefersReducedMotion.value !== "reduce") {
    swiper.value?.autoplay?.resume()
  }
}

function slidePrev() {
  swiper.value?.slidePrev()
  pauseAutoplay()
}

function slideNext() {
  swiper.value?.slideNext()
  pauseAutoplay()
}

function externalLinkAttributes(game: GameItem) {
  return {
    href: game.href,
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": `Open ${game.name} in a new tab`,
  }
}

function onImgError(e: Event) {
  const img = e.target as HTMLImageElement

  if (img.dataset.fallback) {
    img.hidden = true
    return
  }

  img.dataset.fallback = "true"
  img.src = withBase("/game-cover-fallback.svg")
}
</script>

<style scoped>
.coverflow-shell {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 10px;

  box-sizing: border-box;
  padding: 16px;

  border-radius: 20px;
  overflow: hidden;

  border: 1px solid var(--gp-home-card-border);

  background: var(--gp-home-card-bg);

  box-shadow: var(--gp-home-card-shadow);
}

.coverflow-header {
  display: flex;
  flex: none;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.section-label {
  flex: none;
  margin: 0;
  color: var(--gp-icon-highlight);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  line-height: 1.4;
}

.series-filter {
  --gp-select-min-width: 120px;
  --gp-select-menu-min-width: 148px;
  --gp-select-trigger-height: 32px;
  --gp-select-option-height: 31px;

  flex: none;
  margin-left: auto;
}

.coverflow-stage {
  position: relative;
  flex: 1;
  min-width: 0;
  min-height: 0;
}

:deep(.swiper) {
  width: 100%;
  height: 100%;
  overflow: visible;
}

:deep(.swiper-wrapper) {
  align-items: center;
  transition-timing-function: cubic-bezier(0.22, 0.61, 0.36, 1);
}

:deep(.swiper-slide) {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: visible;
}

.slide {
  width: auto;
  height: min(82%, 520px);
  max-height: calc(100% - 8px);
  aspect-ratio: 2 / 3;
}

.coverflow-button {
  position: absolute;
  z-index: 2;
  top: 50%;
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 50%;
  color: #fff;
  background: rgba(11, 17, 31, 0.72);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28);
  cursor: pointer;
  transform: translateY(-50%);
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.coverflow-button:hover {
  background: rgba(11, 17, 31, 0.94);
  transform: translateY(-50%) scale(1.06);
}

.coverflow-button:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}

.coverflow-button span {
  margin-top: -3px;
  font-size: 28px;
  line-height: 1;
}

.coverflow-button-prev {
  left: 2px;
}

.coverflow-button-next {
  right: 2px;
}

.card {
  position: relative;
  width: 100%;
  height: 100%;

  border-radius: 18px;
  overflow: hidden;
  color: inherit;
  text-decoration: none;
  background: linear-gradient(145deg, #143d50, #252a5c 54%, #3c1d68);
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.35);
  will-change: transform, opacity;

  transition: transform 0.52s cubic-bezier(0.22, 0.61, 0.36, 1), opacity 0.52s cubic-bezier(0.22, 0.61, 0.36, 1);
}

:deep(.swiper-slide:not(.swiper-slide-active)) .card {
  opacity: 0.82;
}

:deep(.swiper-slide-active) .card {
  opacity: 1;
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--gp-cyan) 86%, transparent),
    0 0 24px color-mix(in srgb, var(--gp-cyan) 27%, transparent),
    0 22px 54px rgb(0 0 0 / 0.42);
}

.card:hover,
.card:focus-visible {
  transform: translateY(-6px);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.42);
}

:deep(.swiper-slide-active) .card:hover,
:deep(.swiper-slide-active) .card:focus-visible {
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--gp-cyan) 86%, transparent),
    0 0 24px color-mix(in srgb, var(--gp-cyan) 27%, transparent),
    0 24px 60px rgb(0 0 0 / 0.44);
}

.card:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}

.cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;

  transition: transform 0.45s ease;
}

.card:hover .cover {
  transform: scale(1.06);
}

.overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;

  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.84),
    rgba(0, 0, 0, 0.2),
    transparent 68%
  );
}

.content {
  position: absolute;
  inset: 0;
  pointer-events: none;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 0;

  padding: 14px;
  color: #fff;
}

.title {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.01em;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
}

:deep(.swiper-slide-active) .title {
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.92);
}

.platforms {
  display: flex;
  gap: 6px;
  margin-top: 5px;
}

.platform-icon {
  width: 14px;
  height: 14px;
  opacity: 0.78;
}

:deep(.swiper-slide-active) .platform-icon {
  opacity: 0.92;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
}

.tag {
  display: inline-flex;
  align-items: center;
  min-height: 20px;
  padding: 3px 8px;
  border: 1px solid rgb(255 255 255 / 58%);
  border-radius: 999px;
  color: #fff;
  background: rgb(255 255 255 / 18%);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  line-height: 1.2;
  text-shadow: 0 1px 6px rgb(0 0 0 / 55%);
  backdrop-filter: blur(6px);
}

.desc {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  margin-top: 6px;
  font-size: 10.5px;
  line-height: 1.45;
  opacity: 0.74;
}

@media (prefers-reduced-motion: reduce) {
  .card,
  .cover,
  .coverflow-button {
    transition: none;
  }

  .card:hover,
  .card:hover .cover,
  .coverflow-button:hover {
    transform: none;
  }
}

@media (max-width: 640px) {
  .coverflow-shell {
    padding: 12px;
  }

  .coverflow-header {
    gap: 8px;
  }

  .series-filter {
    --gp-select-min-width: 112px;
    --gp-select-menu-min-width: 148px;

    flex: 0 1 auto;
  }

  .slide {
    width: min(72vw, 220px);
    height: auto;
    max-width: none;
  }

  .title {
    font-size: 13px;
  }

  .desc {
    font-size: 10px;
  }

  .platform-icon {
    width: 12px;
    height: 12px;
  }
}
</style>
