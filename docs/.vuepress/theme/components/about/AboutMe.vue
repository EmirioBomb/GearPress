<template>
  <div class="page">
    <AboutProfilePanel
      :blog-count="blogCount"
      :note-count="noteCount"
      :game-count="gamesData.length"
      :language-count="langsData.length"
      :tool-count="toolsData.length"
    />

    <section class="media-grid">
      <SpotifyEmbedded playlistId="50zTqYDKkup6TbU3TFpdN3" mode="full" />
      <GameCoverSwiper :items="gamesData" />
    </section>

    <SectionTitle title="Skills & Tools" icon="mdi:tools" />
    <IconMarquee :items="toolsData" direction="left" :duration="25" />
    <IconMarquee :items="langsData" direction="right" :duration="50" />
  </div>
</template>

<script setup lang="ts">
import { routes } from "@internal/routes"
import { computed } from "vue"
import { useData, usePostsData } from "vuepress-theme-plume/composables"

import { toolsData } from "./data/tools.data"
import { langsData } from "./data/lang.data"
import { gamesData } from "./data/game-cover.data"

import AboutProfilePanel from "./AboutProfilePanel.vue"
import IconMarquee from "./IconMarquee.vue"
import SpotifyEmbedded from "./SpotifyEmbedded.vue"
import GameCoverSwiper from "./GameCoverSwiper.vue"
import SectionTitle from "../SectionTitle.vue"

const { lang } = useData()
const postsData = usePostsData()

const blogCount = computed(() => {
  const blogPath = lang.value.startsWith("en") ? "/en/blog/" : "/blog/"
  return postsData.value[blogPath]?.filter(post => !post.draft).length ?? 0
})

const noteCount = computed(() => {
  const localePrefix = lang.value.startsWith("en") ? "/en" : ""
  const notePath = `${localePrefix}/notes/`
  const routeTable = routes as Record<string, unknown>

  return Object.keys(routeTable).filter(path =>
    path.startsWith(notePath) && path !== `${notePath}about-me/`,
  ).length
})
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