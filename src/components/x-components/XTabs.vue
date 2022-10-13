<script setup lang="ts">
interface TabItem {
  text: string
  icon?: unknown
}
type TabItems = Array<TabItem>
interface Props {
  modelValue?: number
  items?: TabItems
}
interface Emits {
  (e: 'update:modelValue', payload: number): void
  (e: 'change', payload: number): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  items: undefined
})
const emit = defineEmits<Emits>()

const { modelValue } = toRefs(props)

const tabsRef = ref()
const model = ref()
const propWidth = ref()
const propLeft = ref()

const setModel = (index: number): void => {
  model.value = index
  nextTick(() => {
    propWidth.value = `${(tabsRef.value?.querySelector('.active')?.offsetWidth || 0) * 0.5}px`
    propLeft.value = `${tabsRef.value?.querySelector('.active')?.offsetLeft || 0}px`
  })
}

const setActive = (index: number): void => {
  setModel(index)
  emit('update:modelValue', index)
  emit('change', index)
}

watch(
  modelValue,
  (newModelValue) => {
    setModel(Math.min(newModelValue, props.items.length - 1))
  },
  { immediate: true }
)
</script>

<template>
  <div ref="tabsRef" class="tabs gap-8 flex-nowrap relative w-full">
    <a v-for="(item, idx) of props.items" :key="item.text" class="tab px-0 py-3 h-full" :class="{ active: idx === model }" @click.stop="setActive(idx)">
      <h5>{{ item.text }}</h5>
    </a>
    <span class="tabs-prop absolute h-1 w-0 bg-primary left-0 bottom-0 block translate-x-1/2" :style="{ width: propWidth, left: propLeft }" />
  </div>
</template>

<style lang="postcss" scoped>
.tabs {
  & .tabs-prop {
    border-radius: var(--rounded-prop);
    transition-duration: var(--animation-general);
  }

  & .tab {
    transition-duration: var(--animation-general);

    &.active {
      @apply text-primary;
    }
  }
}
</style>
