<template>
  <div
    class="coverflow-shell"
    role="region"
    :aria-label="title ?? 'Game covers'"
  >
    <p v-if="title" class="section-label">{{ title }}</p>
    <div
      class="coverflow-stage"
      @focusin="pauseAutoplay"
      @focusout="resumeAutoplay"
    >
      <Swiper
        class="coverflow"
        effect="coverflow"
        grab-cursor
        centered-slides
        loop
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
          v-for="(game, index) in items"
          :key="game.name"
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
              :loading="index === 0 ? 'eager' : 'lazy'"
              decoding="async"
              @error="onImgError"
            />

            <div class="overlay" aria-hidden="true" />

            <div class="content">
              <div class="title">
                {{ game.name }}
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

              <div v-if="game.tags?.length" class="tags">
                <span
                  v-for="tag in game.tags"
                  :key="tag"
                  class="tag"
                >
                  {{ tag }}
                </span>
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
        aria-label="Previous game cover"
        @click="slidePrev"
      >
        <span aria-hidden="true">‹</span>
      </button>
      <button
        class="coverflow-button coverflow-button-next"
        type="button"
        aria-label="Next game cover"
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

import "swiper/css"
import "swiper/css/effect-coverflow"

export interface GameItem {
  name: string
  link: string
  href?: string
  description?: string
  tags?: string[]
  platform?: string[]
}

defineProps<{ items: GameItem[]; title?: string }>()

const modules = [Autoplay, EffectCoverflow, Keyboard]
const prefersReducedMotion = usePreferredReducedMotion()
const swiper = ref<SwiperInstance>()

const coverflow = {
  rotate: 18,
  stretch: 0,
  depth: 180,
  modifier: 1.1,
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

function onSwiper(instance: SwiperInstance) {
  swiper.value = instance
}

function pauseAutoplay() {
  swiper.value?.autoplay.pause()
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
    swiper.value?.autoplay.resume()
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
  gap: 12px;

  box-sizing: border-box;
  padding: 16px;

  border-radius: 20px;
  overflow: hidden;

  border: 1px solid var(--gp-home-card-border);

  background: var(--gp-home-card-bg);

  box-shadow: var(--gp-home-card-shadow);
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

  transition: transform 0.35s ease, box-shadow 0.35s ease;
}

.card:hover,
.card:focus-visible {
  transform: translateY(-6px);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.42);
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
  font-weight: 600;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
}

.platforms {
  display: flex;
  gap: 6px;
  margin-top: 6px;
}

.platform-icon {
  width: 14px;
  height: 14px;
  opacity: 0.9;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
}

.tag {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(6px);
}

.desc {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  margin-top: 6px;
  font-size: 11px;
  opacity: 0.82;
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