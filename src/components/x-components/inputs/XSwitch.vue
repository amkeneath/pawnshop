<script setup lang="ts">
interface Props {
  modelValue?: boolean
  on?: boolean
  icon?: string
  altIcon?: string
  vertical?: boolean
}
interface Emits {
  (e: 'update:modelValue', payload: boolean): void
  (e: 'change', payload: boolean): void
  (e: 'toggle', payload: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  on: undefined,
  icon: undefined,
  altIcon: undefined,
  vertical: false
})

const emit = defineEmits<Emits>()

const id = generateId()

const switchElement = ref()
const propElement = ref()

const { modelValue, on } = toRefs(props)
const model = ref(false)

function onToggle(): void {
  emit('update:modelValue', model.value)
  emit('change', model.value)
  emit('toggle', model.value)
}
function setProp(): void {
  if (switchElement.value) {
    nextTick(() => {
      const style = getComputedStyle(switchElement.value, ':before')
      if (style && propElement.value) {
        const element: HTMLElement = propElement.value
        const ps = ['background-color', 'border-color', 'border-width', 'border-radius']
        type StyleKey = keyof typeof style
        ps.forEach((p) => {
          element.style.setProperty(p, style[toCamelCase(p) as StyleKey] as string)
        })
      }
    })
  }
}

watch(
  [modelValue, on],
  ([newModelValue, newOn]) => {
    model.value = typeof newModelValue === 'boolean' ? newModelValue : typeof newOn === 'boolean' ? newOn : false
  },
  { immediate: true }
)

watch([theme, isDark], () => {
  setProp()
})

useMutationObserver(
  switchElement,
  (mutations) => {
    if (mutations[0]) setProp()
  },
  { attributes: true, subtree: false }
)

onMounted(() => {
  setProp()
})
</script>

<template>
  <label
    ref="switchElement"
    :for="id"
    :class="[vertical ? 'w-8' : 'w-16']"
    class="x-switch relative flex cursor-pointer overflow-hidden rounded-full border p-0.5 before:hidden before:rounded-full before:bg-base-content"
  >
    <div :class="[vertical ? 'aspect-h-2 aspect-w-1' : 'aspect-h-1 aspect-w-2']" class="relative m-auto w-full">
      <input :id="id" v-model="model" type="checkbox" class="hidden" @change="onToggle()" />
      <div
        :class="[vertical ? (model ? 'top-0' : 'top-1/2') : model ? 'left-0' : '-left-1/2', { 'flex-col-reverse': vertical }]"
        class="absolute flex h-full w-full duration-300"
      >
        <span :class="[vertical ? 'w-full h-1/2' : 'h-full w-1/2']" class="flex flex-none"
          ><x-icon :icon="props.icon" :class="[vertical ? 'w-full h-2/3' : 'h-full w-2/3']" class="m-auto"
        /></span>
        <span :class="[vertical ? 'w-full h-1/2' : 'h-full w-1/2']" class="flex flex-none items-center"
          ><span ref="propElement" class="aspect-h-1 aspect-w-1 block w-full"
        /></span>
        <span :class="[vertical ? 'w-full h-1/2' : 'h-full w-1/2']" class="flex flex-none"
          ><x-icon :icon="props.altIcon || props.icon" :class="[vertical ? 'w-full h-2/3' : 'h-full w-2/3']" class="m-auto"
        /></span>
      </div>
    </div>
  </label>
</template>
