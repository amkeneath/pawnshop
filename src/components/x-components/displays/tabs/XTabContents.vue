<script setup lang="ts">
import { getStylePropertyValue } from '~/composables/element'

interface Props {
  active?: number
}

const props = withDefaults(defineProps<Props>(), {
  active: 0
})

const wrapperElement = ref()

const { active } = toRefs(props)

function getGap(): string {
  if (wrapperElement.value) return getStylePropertyValue(wrapperElement.value, 'column-gap') || '0'
  return ''
}

const transform = computed(() => `translateX(calc(${active.value} * (-100% - ${getGap()})))`)
</script>

<template>
  <div class="tab-contents">
    <div ref="wrapperElement" class="flex gap-4 duration-300" :style="{ transform }">
      <slot />
    </div>
  </div>
</template>

<style lang="postcss">
.tab-contents .tab-content {
  @apply flex-shrink-0 w-full;
}
</style>
