<script setup lang="ts">
import { setOverlay } from '~/composables/controls-overlay'

interface Props {
  draggableTitlebar?: boolean
  hideTitlebar?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  draggableTitlebar: false,
  hideTitlebar: false
})

onMounted(() => {
  setOverlay()
})
</script>

<template>
  <section class="x-section container flex flex-col">
    <div v-if="!hideTitlebar" class="h-titlebar -mt-4 hidden w-full flex-none" :class="{ draggable: props.draggableTitlebar }">
      <div class="flex h-full w-full overflow-hidden"><slot name="title-bar"></slot></div>
    </div>
    <div class="h-full w-full grow">
      <slot />
    </div>
  </section>
</template>
