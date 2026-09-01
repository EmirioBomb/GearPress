<template>
  <div class="coverflow-shell">
    <p v-if="title" class="section-label">{{ title }}</p>
    <Swiper
      class="coverflow"
      effect="coverflow"
      grab-cursor
      centered-slides
      loop
      :slides-per-view="'auto'"
      :coverflow-effect="coverflow"
      :autoplay="autoplay"
      :modules="modules"
    >
      <SwiperSlide
        v-for="game in items"
        :key="game.name"
        class="slide"
      >
        <a
          class="card"
          :href="game.href"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            class="cover"
            :src="game.link"
            :alt="game.alt || game.name"
            loading="lazy"
            @error="onImgError"
          />

          <div class="overlay" />

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

            <div v-if="game.alt" class="desc">
              {{ game.alt }}
            </div>
          </div>
        </a>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue"
import { Autoplay, EffectCoverflow } from "swiper/modules"
import { Icon } from "@iconify/vue"

import "swiper/css"
import "swiper/css/effect-coverflow"

export interface GameItem {
  name: string
  link?: string
  href?: string
  alt?: string
  tags?: string[]
  platform?: string[]
}

defineProps<{ items: GameItem[]; title?: string }>()

const modules = [Autoplay, EffectCoverflow]

const coverflow = {
  rotate: 18,
  stretch: 0,
  depth: 180,
  modifier: 1.1,
  slideShadows: false
}

const autoplay = {
  delay: 2200,
  disableOnInteraction: false
}

function onImgError(e: Event) {
  const img = e.target as HTMLImageElement
  if (img.dataset.failed) return
  img.dataset.failed = "true"

  img.src =
    "https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/game-cover/Not%20Found.png"
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

:deep(.swiper) {
  flex: 1;
  min-height: 0;
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
  height: 82%;
  aspect-ratio: 2 / 3;
  width: auto;
}

.card {
  position: relative;
  width: 100%;
  height: 100%;

  border-radius: 18px;
  overflow: hidden;

  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.35);

  transition: transform 0.35s ease, box-shadow 0.35s ease;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.42);
}

.cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;

  transition: transform 0.45s ease;
}

.card:hover .cover {
  transform: scale(1.06);
}

.overlay {
  position: absolute;
  inset: 0;

  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.92),
    rgba(0, 0, 0, 0.25),
    transparent
  );
}

.content {
  position: absolute;
  inset: 0;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  padding: 14px;
  color: #fff;
}

.title {
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
  margin-top: 6px;
  font-size: 11px;
  opacity: 0.82;
}

@media (max-width: 640px) {
  .coverflow-shell {
    padding: 12px;
  }

  .slide {
    width: 72%;
    height: auto;
    max-width: 220px;
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