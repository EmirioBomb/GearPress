<template>
  <section
    class="profile"
    :class="[
      `align-${align}`,
      boxMode === 'profile' ? 'box-profile' : '',
      isDark ? 'theme-dark' : 'theme-light'
    ]"
  >
    <div
      class="profile-banner"
      :class="[
        boxMode === 'banner' ? 'box-banner' : '',
        isDark ? 'theme-dark' : 'theme-light'
      ]"
    >
      <img
        src="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/profile/sticker.gif"
        width="100"
        class="profile-avatar is-static"
        alt="Status"
      />

      <img
        src="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/profile/profile.svg"
        class="profile-message is-static"
        alt="About Me"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue"

const props = withDefaults(
  defineProps<{
    align?: "left" | "center" | "right"
    boxMode?: "profile" | "banner"
  }>(),
  {
    align: "center",
    boxMode: "banner"
  }
)

/** 自动检测主题，根据主题调整卡片底色及hover效果 */
const isDark = computed(
  () => document.documentElement.dataset.theme === "dark"
)
</script>

<style scoped>
.profile {
  display: flex;
  width: 100%;
}

.profile.align-left {
  justify-content: flex-start;
}

.profile.align-center {
  justify-content: center;
}

.profile.align-right {
  justify-content: flex-end;
}

.profile.box-profile {
  padding: 12px;
  border-radius: 16px;
  transition: all 0.25s ease;
}

.profile-banner {
  display: inline-flex;
  align-items: flex-end;
  gap: 10px;

  max-width: 100%;
  flex-wrap: nowrap;

  background: transparent;
  border: none;

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    background-color 0.25s ease,
    border-color 0.25s ease;
}

.profile-banner.box-banner {
  padding: 10px;
  border-radius: 16px;
}

.profile-message {
  flex: 1;
  min-width: 0;
  max-width: 100%;
  height: auto;
}

.theme-light.box-profile:hover,
.theme-light.box-banner:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 28px rgb(0 0 0 / 12%);
}

.theme-dark.box-profile:hover,
.theme-dark.box-banner:hover {
  transform: translateY(-3px);
  box-shadow:
    0 10px 28px rgba(98, 97, 97, 0.45),
    0 0 0 1px rgb(255 255 255 / 6%);
}

.is-static {
  pointer-events: none;
}
</style>