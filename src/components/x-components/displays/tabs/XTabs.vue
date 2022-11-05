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

const tabsElement = ref()

const { modelValue } = toRefs(props)
const model = ref()
const propWidth = ref()
const propLeft = ref()

function setModel(index: number): void {
  model.value = index
  nextTick(() => {
    propWidth.value = `${(tabsElement.value?.querySelector('.active')?.offsetWidth || 0) * 0.5}px`
    propLeft.value = `${tabsElement.value?.querySelector('.active')?.offsetLeft || 0}px`
  })
}
function setActive(index: number): void {
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
  <div ref="tabsElement" class="tabs relative w-full flex-nowrap gap-8">
    <a
      v-for="(item, idx) of props.items"
      :key="item.text"
      class="tab h-full px-0 pb-3"
      :class="{ 'active text-primary': idx === model }"
      @click.stop="setActive(idx)"
    >
      <h5>{{ item.text }}</h5>
    </a>
    <span class="absolute left-0 bottom-0 block h-1 w-0 translate-x-1/2 rounded-sm bg-primary duration-300" :style="{ width: propWidth, left: propLeft }" />
  </div>
</template>
