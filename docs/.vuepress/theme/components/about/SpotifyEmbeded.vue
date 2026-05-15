<template>
  <iframe
    title="Spotify Embeded Player"
    class="spotify"
    :src="src"
    :style="style"
    loading="lazy"
    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
  />
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useWindowSize } from "@vueuse/core"

const props = defineProps<{
  playlistId: string
  mode?: "compact" | "normal"
  breakpoint?: number
}>()

const { width: screenWidth } = useWindowSize()

/** 是否为紧凑模式 */
const isCompact = computed(() => {
  if (props.mode === "compact") return true
  if (props.mode === "normal") return false
  return screenWidth.value <= (props.breakpoint ?? 768)
})

/** embed url */
const src = computed(() => {
  return `https://open.spotify.com/embed/playlist/${props.playlistId}?utm_source=generator&theme=0`
})

/** 高度策略 */
const height = computed(() => {
  return isCompact.value ? 152 : 352
})

/** 样式 */
const style = computed(() => {
  return {
    width: "100%",
    height: `${height.value}px`,
    border: 0,
  }
})
</script>

<style scoped>
.spotify {
  display: block;
  width: 100%;
  border: 0;
  border-radius: 12px;
  transition: opacity 0.35s ease, transform 0.35s ease;
}
</style>