<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps({
  title: String,
  icon: String
})
</script>

<template>
  <div class="section-title" :class="{ empty: !icon && !title }">
    <template v-if="icon || title">
      <Icon v-if="icon" :icon="icon" />
      <span v-if="title">{{ title }}</span>
    </template>

    <div v-else class="divider-line"></div>
  </div>
</template>

<style scoped>
.section-title {
  --gradient: linear-gradient(
    270deg,
    var(--vp-c-purple-1),
    var(--vp-c-brand-2),
    var(--vp-c-purple-1)
  );

  --anim: gradient-flow 2s linear infinite;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  text-align: center;
}

.section-title:not(.empty) {
  background: var(--gradient);
  background-size: 200% 100%;
  animation: var(--anim);

  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-title:not(.empty)::before,
.section-title:not(.empty)::after {
  content: "";
  flex: 1;
  height: 2px;

  background: var(--gradient);
  background-size: 200% 100%;
  animation: var(--anim);

  border-radius: 2px;
}

.divider-line {
  width: 100%;
  height: 2px;

  background: var(--gradient);
  background-size: 200% 100%;
  animation: var(--anim);

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