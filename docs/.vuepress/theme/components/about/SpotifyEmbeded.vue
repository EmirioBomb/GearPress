<template>
  <iframe
    title="Spotify Playlist"
    class="spotify"
    :class="{ loaded }"
    :src="src"
    :style="style"
    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    loading="lazy"
    @load="onLoad"
  />
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useWindowSize } from "@vueuse/core"

const props = defineProps<{
  playlistId: string
  width?: number
  height?: number
  mode?: "auto" | "compact" | "full"
  breakpoint?: number
  compactHeight?: number
}>()

const { width: screenWidth } = useWindowSize()
const loaded = ref(false)

/** 是否紧凑模式 */
const isCompact = computed(() => {
  if (props.mode === "compact") return true
  if (props.mode === "full") return false
  return screenWidth.value <= (props.breakpoint ?? 768)
})

/** Spotify embed 地址 */
const src = computed(() => {
  const base = `https://open.spotify.com/embed/playlist/${props.playlistId}?utm_source=generator`
  return isCompact.value ? base : `${base}&theme=0`
})

const computedHeight = computed(() => {
  if (props.height) {
    return `${props.height}px`
  }

  if (isCompact.value) {
    return `${props.compactHeight ?? 152}px`
  }

  return "100%"
})

const style = computed(() => {
  return {
    width: props.width ? `${props.width}px` : "100%",
    height: computedHeight.value,
  }
})

function onLoad() {
  loaded.value = true
}
</script>

<style scoped>
/* iframe */
.spotify {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;

  border-radius: 12px;

  opacity: 0;
  transform: scale(0.99);

  transition: opacity 0.35s ease, transform 0.35s ease;
}

/* loaded 后渐显 */
.spotify.loaded {
  opacity: 1;
  transform: scale(1);
}
</style>