<template>
  <div class="marquee">
    <div
      class="marquee__viewport"
      :class="{ 'is-paused': paused }"
      @mouseenter="paused = true"
      @mouseleave="paused = false"
    >
      <div
        class="marquee__track"
        :class="directionClass"
        :style="trackStyle"
      >
        <div class="marquee__group">
          <a
            v-for="(item, i) in items"
            :key="'m1-' + i"
            :href="item.url"
            target="_blank"
            rel="noopener noreferrer"
            :title="item.description"
            :aria-label="item.name"
          >
            <icon :name="item.icon" />
          </a>
        </div>

        <!-- clone for seamless loop -->
        <div class="marquee__group">
          <a
            v-for="(item, i) in items"
            :key="'m2-' + i"
            :href="item.url"
            target="_blank"
            rel="noopener noreferrer"
            :title="item.description"
            :aria-label="item.name"
          >
            <icon :name="item.icon" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"

type Item = {
  name: string
  url?: string
  icon?: string
  description?: string
  tags?: string[]
}

const props = defineProps<{
  items: Item[]
  direction?: "left" | "right"
  duration?: number   // seconds
}>()

const directionClass = computed(() =>
  props.direction === "right" ? "is-right" : "is-left"
)

const trackStyle = computed(() => ({
  animationDuration: `${props.duration ?? 30}s`,
}))

const paused = defineModel<boolean>("paused", { default: false })
</script>

<style scoped>
.marquee {
  position: relative;
}

.marquee__viewport {
  overflow: hidden;
  width: 100%;
}

.marquee__viewport.is-paused .marquee__track {
  animation-play-state: paused;
}

.marquee__track {
  display: flex;
  width: max-content;
  will-change: transform;
  animation: marquee-left linear infinite;
}

.marquee__track.is-right {
  animation-name: marquee-right;
}

.marquee__group {
  display: flex;
}

.marquee__group a {
  width: 70px;
  height: 70px;
  margin: 0 10px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 20%;
  font-size: 50px;

  background-color: var(--about-me-skill-item-bg);
}

@keyframes marquee-left {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

@keyframes marquee-right {
  from {
    transform: translateX(-50%);
  }
  to {
    transform: translateX(0%);
  }
}
</style>