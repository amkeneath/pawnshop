<script setup lang="ts">
interface Props {
  active?: number
}

const props = withDefaults(defineProps<Props>(), {
  active: 0
})

const { active } = toRefs(props)

const contentWrapper = ref()

const getGap = (): string => {
  if (contentWrapper.value) return window?.getComputedStyle(contentWrapper.value)?.getPropertyValue('column-gap') || '0'
  return ''
}
const transform = computed(() => `translateX(calc(${active.value} * (-100% - ${getGap()})))`)
</script>

<template>
  <div class="tab-contents">
    <div ref="contentWrapper" class="flex gap-4 duration-300" :style="{ transform }">
      <slot />
    </div>
  </div>
</template>

<style lang="postcss">
.tab-contents .tab-content {
  @apply flex-shrink-0 w-full;
}
</style>
