<script setup lang="ts">
import { getTransitionDuration } from '~/composables/element'

interface Props {
  modelValue?: boolean
  fullscreen?: boolean
}
interface Emits {
  (e: 'update:modelValue', payload: boolean): void
  (e: 'open', payload: number): void
  (e: 'close', payload: number): void
}

// PROPS
const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  fullscreen: false
})
const { modelValue, fullscreen } = toRefs(props)

// EMITS
const emit = defineEmits<Emits>()

// CONSTANTS
const DEFAULT = false

// REFERENCES
const modalElement = ref<HTMLTableSectionElement>()
const model = ref<boolean>(DEFAULT)

// METHODS
function getAnimationDuration(): number {
  if (modalElement.value) return getTransitionDuration(modalElement.value)
  return 0
}

function open(viaModel = false): void {
  if (!model.value) {
    model.value = true
    if (!viaModel) emit('update:modelValue', true)
    emit('open', getAnimationDuration())
  }
}
function close(viaModel = false): void {
  if (model.value) {
    model.value = false
    if (!viaModel) emit('update:modelValue', false)
    emit('close', getAnimationDuration())
  }
}

// WATCHERS
watch(
  [modelValue],
  ([newModelValue], [oldModelValue]) => {
    if (newModelValue !== oldModelValue) {
      nextTick(() => {
        const value = typeof newModelValue === 'boolean' ? newModelValue : DEFAULT
        if (value) open(true)
        else close(true)
      })
    }
  },
  { immediate: true }
)
</script>

<template>
  <modal
    ref="modalElement"
    class="x-modal absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 scale-0 bg-base-100 text-base-content drop-shadow duration-300"
    :class="{ open: model, fullscreen: fullscreen }"
  >
    <slot />
  </modal>
</template>

<style lang="postcss" scoped>
.open {
  @apply scale-100;
}

.fullscreen {
  @apply !screen-safe-area;
}
</style>
