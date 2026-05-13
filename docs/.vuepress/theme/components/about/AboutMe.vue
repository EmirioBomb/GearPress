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
import { toolsData } from "./data/tools.data";
import { langsData } from "./data/lang.data";
import { gamesData } from "./data/game-cover.data";

import ProfileCard from "./ProfileCard.vue";
import IconMarquee from "./IconMarquee.vue";
import SpotifyEmbeded from "./SpotifyEmbeded.vue";
import GameCoverSwiper from "./GameCoverSwiper.vue";
import SectionTitle from "../SectionTitle.vue";
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.media-grid {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 24px;
  align-items: stretch;
}

@media (max-width: 768px) {
  .page {
    gap: 24px;
  }

  .media-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>