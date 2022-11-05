<script setup lang="ts">
interface Props {
  withTitlebar?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  withTitlebar: false
})
</script>

<template>
  <section ref="section" class="x-section container" :class="{ '!pt-titlebar-h': isOverlayVisible && props.withTitlebar }">
    <slot />
  </section>
</template>
