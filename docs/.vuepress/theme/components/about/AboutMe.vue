<template>
  <div class="page">
    <ProfileCard align="center" boxMode="banner" />

    <section class="media-grid">
      <SpotifyEmbeded playlistId="50zTqYDKkup6TbU3TFpdN3" />
      <GameCoverSwiper :items="gamesData" />
    </section>

    <SectionTitle title="Skills & Tools" icon="mdi:tools" />
    <IconMarquee :items="toolsData" direction="left" :duration="25" />
    <IconMarquee :items="langsData" direction="right" :duration="50" />
  </div>
</template>

<script setup lang="ts">
import { toolsData } from "./data/tools.data"
import { langsData } from "./data/lang.data"
import { gamesData } from "./data/game-cover.data"

import ProfileCard from "./ProfileCard.vue"
import IconMarquee from "./IconMarquee.vue"
import SpotifyEmbeded from "./SpotifyEmbeded.vue"
import GameCoverSwiper from "./GameCoverSwiper.vue"
import SectionTitle from "../SectionTitle.vue"
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* 基于视口高度的响应式布局高度，限制最小/最大值以保证跨浏览器一致性 */
.media-grid {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 24px;
  align-items: stretch;

  height: clamp(360px, 52vh, 720px);
}

/* 让子项参与等高布局，避免跨浏览器（Chrome/Safari）高度计算不一致 */
.media-grid > * {
  height: 100%;
  min-height: 0;
}

@media (max-width: 768px) {
  .page {
    gap: 24px;
  }

  .media-grid {
    grid-template-columns: 1fr;
    gap: 16px;

    /* 移动端自动放开高度 */
    height: auto;
  }
}
</style>