<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps(['title', 'icon'])
</script>

<template>
  <div class="section-title">
    <Icon v-if="icon" :icon="icon" />
    <span class="name clip">{{ title }}</span>
  </div>
</template>

<style scoped>
.section-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  text-align: center;
  background: var(--vp-bg-home-hero-name, linear-gradient(315deg, var(--vp-c-purple-1) 15%, var(--vp-c-brand-2) 65%, var(--vp-c-brand-2) 100%));
  -webkit-background-clip: text;
  background-clip: text;

  -webkit-text-fill-color: transparent;
}
</style>