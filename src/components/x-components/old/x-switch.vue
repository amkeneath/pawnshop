<script setup lang="ts">
import { styles, xColor, xId } from '~/components/x-components/scripts'

interface Props {
  id?: string
  modelValue?: boolean
  on?: boolean
  icon?: unknown
  altIcon?: unknown
  color?: string
}
interface Emits {
  (e: 'update:modelValue', payload: boolean): void
  (e: 'change', payload: boolean): void
  (e: 'toggle', payload: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  modelValue: undefined,
  on: undefined,
  icon: undefined,
  altIcon: undefined,
  color: undefined
})

const emit = defineEmits<Emits>()

const id = xId()

const { modelValue, on } = toRefs(props)
const model = ref<boolean>(false)

watch(
  [modelValue, on],
  ([newModelValue, newOn], [oldModelValue, oldOn]) => {
    model.value = typeof newModelValue === 'boolean' ? newModelValue : typeof newOn === 'boolean' ? newOn : false
  },
  { immediate: true }
)

const onToggle = (): void => {
  emit('update:modelValue', model.value)
  emit('change', model.value)
  emit('toggle', model.value)
}
</script>

<template>
  <a :class="[styles.base, styles.focus, styles.radius, styles.transition, xColor.op(color), xColor.focus(color)]" class="x-switch w-20">
    <label :for="id">
      <input :id="id" ref="checkbox" v-model="model" type="checkbox" class="hidden" @change="onToggle" />
      <div :class="[styles.transition, `${model ? 'left-0' : '-left-10'}`]" class="absolute flex h-full">
        <span :class="[styles.radius, xColor.op(color)]" class="absolute h-full w-20" />
        <span class="z-10 w-10 flex-none pl-2"><component :is="props.altIcon || props.icon" class="m-auto h-full" /></span>
        <span class="z-10 h-full w-10 flex-none p-1"
          ><span :class="[styles.radius, styles.transition, xColor.bg(color), xColor.hover(color)]" class="block h-full w-full"
        /></span>
        <span class="z-10 w-10 flex-none pr-2"><component :is="props.icon" class="m-auto h-full" /></span>
      </div>
    </label>
  </a>
</template>
