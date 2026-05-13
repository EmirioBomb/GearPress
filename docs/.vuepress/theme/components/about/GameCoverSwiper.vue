<template>
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

          <div class="platforms" v-if="game.platform?.length">
            <Icon
              v-for="p in game.platform"
              :key="p"
              :icon="p"
              class="platform-icon"
            />
          </div>

          <div class="tags" v-if="game.tags?.length">
            <span
              v-for="tag in game.tags"
              :key="tag"
              class="tag"
            >
              {{ tag }}
            </span>
          </div>

          <div class="desc" v-if="game.alt">
            {{ game.alt }}
          </div>
        </div>
      </a>
    </SwiperSlide>
  </Swiper>
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

defineProps<{ items: GameItem[] }>()

const modules = [Autoplay, EffectCoverflow]

const coverflow = {
  rotate: 18,
  stretch: 0,
  depth: 180,
  modifier: 1.1,
  slideShadows: false
}

const autoplay = {
  delay: 2000,
  disableOnInteraction: false
}

/**
 * 图片加载失败兜底
 * 仅替换一次，避免 fallback 失效导致死循环请求
 */
function onImgError(e: Event) {
  const img = e.target as HTMLImageElement

  if (img.dataset.failed) return

  img.dataset.failed = "true"
  img.src =
    "https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/game-cover/Not%20Found.png"
}
</script>

<style scoped>
.coverflow {
  width: 100%;
  height: 460px;
  display: flex;
  align-items: center;
}

/* swiper fix */
:deep(.swiper),
:deep(.swiper-wrapper),
:deep(.swiper-slide) {
  height: auto !important;
  overflow: visible;
}

/* card size */
.slide {
  width: 260px;
  aspect-ratio: 2 / 3;
  display: flex;
}

.card {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 18px 48px rgba(0,0,0,.35);
}

/* image */
.cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform .45s ease;
}

.card:hover .cover {
  transform: scale(1.06);
}

/* overlay */
.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0,0,0,.92),
    rgba(0,0,0,.25),
    transparent
  );
}

/* content */
.content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 14px;
  color: #fff;
}

/* title */
.title {
  font-size: 16px;
  font-weight: 600;
  text-shadow: 0 2px 10px rgba(0,0,0,.8);
}

/* platform */
.platforms {
  display: flex;
  gap: 6px;
  margin-top: 6px;
}

.platform-icon {
  width: 14px;
  height: 14px;
  opacity: .9;
}

/* tags */
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
  background: rgba(255,255,255,.14);
  backdrop-filter: blur(6px);
}

/* desc */
.desc {
  margin-top: 6px;
  font-size: 11px;
  opacity: .8;
}

/* mobile */
@media (max-width: 768px) {
  .coverflow {
    height: 320px;
  }

  .slide {
    width: 170px;
  }

  .title {
    font-size: 13px;
  }

  .desc {
    font-size: 10px;
  }
}
</style>