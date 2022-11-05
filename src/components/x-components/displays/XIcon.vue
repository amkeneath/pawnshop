<script setup lang="ts">
interface Props {
  icon?: string
}

withDefaults(defineProps<Props>(), {
  icon: undefined
})

const solid = true
</script>

<template>
  <!-- SOLID -->
  <i v-if="solid">
    <heroicons-lifebuoy-solid v-if="icon === 'heroicons-lifebuoy'" />
    <heroicons-truck-solid v-else-if="icon === 'heroicons-truck'" />
    <heroicons-star-solid v-else-if="icon === 'heroicons-star'" />
    <heroicons-device-phone-mobile-solid v-else-if="icon === 'heroicons-device-phone-mobile'" />
    <heroicons-ticket-solid v-else-if="icon === 'heroicons-ticket'" />
    <heroicons-calendar-solid v-else-if="icon === 'heroicons-calendar'" />
    <heroicons-magnifying-glass-solid v-else-if="icon === 'heroicons-magnifying-glass'" />
    <heroicons-chevron-up-solid v-else-if="icon === 'heroicons-chevron-up'" />
    <heroicons-chevron-down-solid v-else-if="icon === 'heroicons-chevron-down'" />
    <heroicons-chevron-double-up-solid v-else-if="icon === 'heroicons-chevron-double-up'" />
    <heroicons-chevron-double-down-solid v-else-if="icon === 'heroicons-chevron-double-down'" />
    <heroicons-bars-3-solid v-else-if="icon === 'heroicons-bars-3'" />
    <heroicons-scale-solid v-else-if="icon === 'heroicons-scale'" />
    <heroicons-plus-solid v-else-if="icon === 'heroicons-plus'" />
    <heroicons-home-solid v-else-if="icon === 'heroicons-home'" />
    <heroicons-user-solid v-else-if="icon === 'heroicons-user'" />
    <heroicons-user-plus-solid v-else-if="icon === 'heroicons-user-plus'" />
    <heroicons-sun-solid v-else-if="icon === 'heroicons-sun'" />
    <heroicons-moon-solid v-else-if="icon === 'heroicons-moon'" />
    <heroicons-wifi-solid v-else-if="icon === 'heroicons-wifi'" />
    <heroicons-play-solid v-else-if="icon === 'heroicons-play'" />
    <heroicons-microphone-solid v-else-if="icon === 'heroicons-microphone'" />
    <heroicons-stop-solid v-else-if="icon === 'heroicons-stop'" />
    <heroicons-video-camera-solid v-else-if="icon === 'heroicons-video-camera'" />
    <heroicons-cog-6-tooth-solid v-else-if="icon === 'heroicons-cog-6-tooth'" />
    <heroicons-x-mark-solid v-else-if="icon === 'heroicons-x-mark'" />
    <heroicons-trash-solid v-else-if="icon === 'heroicons-trash'" />
    <heroicons-arrow-uturn-left-solid v-else-if="icon === 'heroicons-arrow-uturn-left'" />
    <heroicons-arrow-down-on-square-solid v-else-if="icon === 'heroicons-arrow-down-on-square'" />
    <heroicons-pencil-square-solid v-else-if="icon === 'heroicons-pencil-square'" />
    <heroicons-pencil-solid v-else-if="icon === 'heroicons-pencil'" />
    <heroicons-lock-closed-solid v-else-if="icon === 'heroicons-lock-closed'" />
    <heroicons-camera-solid v-else-if="icon === 'heroicons-camera'" />
    <heroicons-bars-2-solid v-else-if="icon === 'heroicons-bars-2'" />
    <heroicons-queue-list-solid v-else-if="icon === 'heroicons-queue-list'" />
    <heroicons-check-solid v-else-if="icon === 'heroicons-check'" />
    <heroicons-squares-plus-solid v-else-if="icon === 'heroicons-squares-plus'" />
    <heroicons-squares--2x2-solid v-else-if="icon === 'heroicons-squares-2x2'" />
    <heroicons-star-solid v-else />
  </i>
  <!-- NON SOLID -->
  <i v-else>
    <heroicons-star />
  </i>
</template>

<style lang="postcss" scoped>
i {
  @apply block pointer-events-none;

  & svg {
    @apply w-full h-full min-w-[1em] min-h-[1rem];
  }
}
</style>
