<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps(['title', 'icon'])
</script>

<template>
  <div class="section-title">
    <Icon v-if="icon" :icon="icon" />
    <span>{{ title }}</span>
  </div>
</template>

<style scoped>
.section-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  text-align: center;

  background: linear-gradient(
    270deg,
    var(--vp-c-purple-1),
    var(--vp-c-brand-2),
    var(--vp-c-purple-1)
  );

  background-size: 200% 100%;
  animation: gradient-flow 2s linear infinite;

  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-title::before,
.section-title::after {
  content: "";
  flex: 1;
  height: 2px;

  background: linear-gradient(
    270deg,
    var(--vp-c-purple-1),
    var(--vp-c-brand-2),
    var(--vp-c-purple-1)
  );

  background-size: 200% 100%;
  animation: gradient-flow 2s linear infinite;

  border-radius: 2px;
}

@keyframes gradient-flow {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}
</style>