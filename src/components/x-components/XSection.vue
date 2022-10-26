<script setup lang="ts">
interface Props {
  draggableTitlebar?: boolean
  hideTitlebar?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  draggableTitlebar: false,
  hideTitlebar: false
})

const section = ref()
const marginTop = ref('')
onMounted(() => {
  marginTop.value = `-${window.getComputedStyle(section.value)?.getPropertyValue('padding-top')}`
})
</script>

<template>
  <section ref="section" class="x-section container !flex !flex-col">
    <div
      v-if="!hideTitlebar"
      class="h-titlebar w-full flex-none"
      :class="[props.draggableTitlebar ? 'draggable' : 'non-draggable', { hidden: !isOverlayVisible }]"
      :style="{ marginTop: marginTop }"
    >
      <slot name="title-bar" />
    </div>
    <div class="h-full w-full grow">
      <slot />
    </div>
  </section>
</template>
