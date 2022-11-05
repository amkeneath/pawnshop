<script setup lang="ts">
import SignaturePad from 'signature_pad'

import { getStylePropertyValue } from '~/composables/element'
import { ListenerCleanup, OnComponentOpenParams } from '~/shims'

interface Props {
  modelValue?: boolean
}
interface Emits {
  (e: 'update:modelValue', payload: boolean): void
  (e: 'close', payload: number): void
  (e: 'open', payload: OnComponentOpenParams): void
  (e: 'save', payload: string): void
}
type EventAction = (e: KeyboardEvent) => void
interface SignatureKeyboardEvents {
  Backspace: EventAction
  Delete: EventAction
  Escape: EventAction
  Enter: EventAction
}
interface ActionKeys {
  altKey: boolean
  ctrlKey: boolean
  shiftKey: boolean
}
interface ContentData {
  width: number
  height: number
  xOffset: number
  yOffset: number
}

// PROPS
const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined
})
const { modelValue } = toRefs(props)

// EMITS
const emit = defineEmits<Emits>()

// CONSTANTS
const keyboardEventListener = ['keydown', keyboardEvent] as const
const DEFAULT = true
const actions: SignatureKeyboardEvents = {
  Backspace(e: KeyboardEvent): void {
    if (ctrlPressed(e)) undo()
  },
  Delete(e: KeyboardEvent): void {
    if (ctrlPressed(e)) clear()
  },
  Escape(): void {
    close()
  },
  Enter(e: KeyboardEvent): void {
    if (ctrlPressed(e)) save()
  }
}

// NON-CONSTANTS
let signaturePad: SignaturePad
let listenerCleanup: ListenerCleanup
let setColorInterval: number
let setColorTimeout: number

// REFERENCES
const canvasElement = ref<HTMLCanvasElement>()
const colorViewElement = ref<HTMLDivElement>()
const model = ref<boolean>(DEFAULT)
const drawing = ref<boolean>(false)

// METHODS
function ctrlPressed({ altKey, ctrlKey, shiftKey }: ActionKeys): boolean {
  return !altKey && ctrlKey && !shiftKey
}
function keyboardEvent(e: KeyboardEvent): void {
  actions[e.code as keyof typeof actions]?.(e)
}

function getCanvasContentData(canvas: HTMLCanvasElement): ContentData {
  const context = canvas.getContext('2d')
  const pix = { x: [] as Array<number>, y: [] as Array<number> }
  const canvasHeight = canvas.height
  const canvasWidth = canvas.width
  const imageData = context?.getImageData(0, 0, canvasWidth, canvasHeight)
  if (imageData) {
    for (let y = 0; y < canvasHeight; y++) {
      for (let x = 0; x < canvasWidth; x++) {
        let index = (y * canvasWidth + x) * 4
        if (imageData.data[index + 3] > 0) {
          pix.x.push(x)
          pix.y.push(y)
        }
      }
    }
  }
  pix.x.sort(function (a, b) {
    return a - b
  })
  pix.y.sort(function (a, b) {
    return a - b
  })
  var n = pix.x.length - 1

  const width = 1 + pix.x[n] - pix.x[0]
  const height = 1 + pix.y[n] - pix.y[0]
  const xOffset = pix.x[0]
  const yOffset = pix.y[0]
  return { width, height, xOffset, yOffset }
}
function resizeCanvas(): void {
  if (canvasElement.value) {
    const canvas: HTMLCanvasElement = canvasElement.value
    const ratio = Math.max(window.devicePixelRatio || 1, 1)
    canvas.width = canvas.offsetWidth * ratio
    canvas.height = canvas.offsetHeight * ratio
    canvas.getContext('2d')?.scale(ratio, ratio)
    signaturePad?.clear()
  }
}
function setSignaturePad(): void {
  if (canvasElement.value && colorViewElement.value) {
    const canvas: HTMLCanvasElement = canvasElement.value
    const colorView: HTMLDivElement = colorViewElement.value
    const color = getStylePropertyValue(colorView, 'background-color')
    const config = { minWidth: 5, maxWidth: 10, penColor: color }
    signaturePad = new SignaturePad(canvas, config)
    signaturePad?.addEventListener('beginStroke', () => {
      drawing.value = true
    })
    signaturePad?.addEventListener('endStroke', () => {
      drawing.value = false
    })
    resizeCanvas()
  }
}

function setColor(): void {
  if (canvasElement.value && colorViewElement.value) {
    clearTimeout(setColorTimeout)
    const colorView: HTMLDivElement = colorViewElement.value
    setColorInterval = setInterval(() => {
      if (canvasElement.value && colorViewElement.value) {
        const color = getStylePropertyValue(colorView, 'background-color')
        const data = signaturePad?.toData()
        data.forEach((data) => {
          data.penColor = color
        })
        signaturePad.fromData(data)
      }
    }, 50)
    setColorTimeout = setTimeout(() => {
      clearInterval(setColorInterval)
    }, 1000)
  }
}

async function save(): Promise<void> {
  if (canvasElement.value) {
    const data = signaturePad?.toData()
    const canvas: HTMLCanvasElement = canvasElement.value
    const { xOffset, yOffset, width, height } = getCanvasContentData(canvas)
    data.forEach((data) => {
      data.penColor = 'black' // Always export signature with black color
      data.points.forEach((point) => {
        point.x = point.x - xOffset
        point.y = point.y - yOffset
      })
    })

    const newCanvas: HTMLCanvasElement = document.createElement('canvas')
    const newSignaturePad = new SignaturePad(newCanvas)
    const ratio = Math.max(window.devicePixelRatio || 1, 1)

    newCanvas.width = width * ratio
    newCanvas.height = height * ratio
    newCanvas.getContext('2d')?.scale(ratio, ratio)

    newSignaturePad.clear()
    newSignaturePad.off()
    newSignaturePad.fromData(data)

    const altData = newSignaturePad.toDataURL('image/svg+xml')
    emit('save', altData)
  }
}
function undo(): void {
  const data = signaturePad?.toData()
  if (data) {
    data.pop()
    signaturePad?.fromData(data)
  }
}
function clear(): void {
  signaturePad?.clear()
}
function close(): void {
  model.value = false
}

function modalOpen(duration = 0): void {
  listenerCleanup = useEventListener(...keyboardEventListener)
  emit('update:modelValue', true)
  emit('open', { duration, actions: { save, undo, clear, close } })
}
function modalClosed(duration = 0): void {
  listenerCleanup?.()
  emit('update:modelValue', false)
  emit('close', duration)
}

// INITIALIZE

/** WATCHERS AND OBSERVERS */
useResizeObserver(canvasElement, resizeCanvas)

watch(
  [modelValue],
  ([newModelValue], [oldModelValue]) => {
    if (newModelValue !== oldModelValue) {
      model.value = typeof newModelValue === 'boolean' ? newModelValue : DEFAULT
    }
  },
  { immediate: true }
)

watch(theme, () => {
  setColor()
})

/** HOOKS */
onMounted(() => {
  setSignaturePad()
})
</script>

<template>
  <x-modal v-model="model" class="x-signature-pad" @open="modalOpen($event)" @close="modalClosed($event)">
    <div class="container relative flex h-full w-full items-center justify-end">
      <canvas ref="canvasElement" class="absolute top-0 left-0 h-full w-full" />
      <button class="btn-ghost btn-circle btn-lg btn z-10 duration-300" :class="{ 'translate-x-20': drawing }">
        <div ref="colorViewElement" class="h-12 w-12 rounded-full bg-current" />
      </button>
    </div>
  </x-modal>
</template>
