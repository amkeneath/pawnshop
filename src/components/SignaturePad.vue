<script setup lang="ts">
import SignaturePad from 'signature_pad'

type EventAction = (e: KeyboardEvent) => void

interface Props {
  modelValue?: boolean
  id?: string
}
interface Emits {
  (e: 'update:modelValue', payload: boolean): void
  (e: 'close'): void
  (e: 'open'): void
  (e: 'save', payload: string): void
}
interface ContentData {
  width: number
  height: number
  xOffset: number
  yOffset: number
}
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

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  id: 'default-camera'
})
const emit = defineEmits<Emits>()

const icons = {
  arrowDownOnSquare: markRaw(IconHeroiconsArrowDownOnSquare),
  arrowUturnLeft: markRaw(IconHeroiconsArrowUturnLeft),
  trash: markRaw(IconHeroiconsTrash),
  xMark: markRaw(IconHeroiconsXMark)
}

const canvasRef = ref(null)
const penColorRef = ref(null)

const { modelValue } = toRefs(props)
const model = ref(false)

const drawing = ref(false)

let signaturePad = {} as SignaturePad

const getCanvasContentData = (canvas: HTMLCanvasElement): ContentData => {
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
const resizeCanvas = (): void => {
  if (canvasRef.value) {
    const canvas: HTMLCanvasElement = canvasRef.value
    const ratio = Math.max(window.devicePixelRatio || 1, 1)
    canvas.width = canvas.offsetWidth * ratio
    canvas.height = canvas.offsetHeight * ratio
    canvas.getContext('2d')?.scale(ratio, ratio)
    signaturePad.clear()
  }
}
const setSignaturePad = (): void => {
  if (canvasRef.value && penColorRef.value) {
    const canvas: HTMLCanvasElement = canvasRef.value
    const penColor: HTMLElement = penColorRef.value
    const color = getComputedStyle(penColor).getPropertyValue('background-color')
    const config = { minWidth: 5, maxWidth: 10, penColor: color }
    signaturePad = new SignaturePad(canvas, config)
    signaturePad.addEventListener('beginStroke', () => {
      drawing.value = true
    })
    signaturePad.addEventListener('endStroke', () => {
      drawing.value = false
    })
    resizeCanvas()
  }
}

const save = async (): Promise<void> => {
  const data = signaturePad.toData()
  if (canvasRef.value) {
    const canvas: HTMLCanvasElement = canvasRef.value
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
const undo = (): void => {
  const data = signaturePad.toData()
  if (data) {
    data.pop()
    signaturePad.fromData(data)
  }
}
const clear = (): void => signaturePad.clear()

const open = (viaModel = false): void => {
  if (!viaModel) emit('update:modelValue', true)
  emit('open')
}
const close = (viaModel = false): void => {
  if (!viaModel) emit('update:modelValue', false)
  emit('close')
}

const ctrlPressed = ({ altKey, ctrlKey, shiftKey }: ActionKeys): boolean => !altKey && ctrlKey && !shiftKey
const actions: SignatureKeyboardEvents = {
  Backspace: (e: KeyboardEvent): void => {
    if (ctrlPressed(e)) undo()
  },
  Delete: (e: KeyboardEvent): void => {
    if (ctrlPressed(e)) signaturePad.clear()
  },
  Escape: (): void => close(),
  Enter: (e: KeyboardEvent): void => {
    if (ctrlPressed(e)) save()
  }
}
const keyboardEvent = (e: KeyboardEvent): void => actions[e.code as keyof typeof actions]?.(e)
const keyboardEventListener = ['keydown', keyboardEvent] as const

watch(
  [modelValue],
  ([newModelValue], [oldModelValue]) => {
    if (newModelValue !== oldModelValue) {
      model.value = typeof newModelValue === 'boolean' ? newModelValue : true
      if (model.value) open(true)
      else close(true)
    }
  },
  { immediate: true }
)
onUnmounted(() => {
  window.removeEventListener(...keyboardEventListener)
})

onMounted(() => {
  setSignaturePad()
  window.addEventListener(...keyboardEventListener)
})

useResizeObserver(canvasRef, resizeCanvas)
</script>

<template>
  <div id="xxx-yyy" class="fixed top-0 left-0 z-50 h-screen w-screen" :class="{ 'hidden -z-10': !model }">
    <div class="h-full w-full p-6">
      <canvas ref="canvasRef" class="absolute top-0 left-0 h-full w-full bg-base-200" />
      <header
        class="navbar card flex flex-row gap-4 overflow-visible bg-base-100 text-base-content shadow transition-all duration-500"
        :class="{ 'opacity-0 -translate-y-full': drawing }"
      >
        <div class="navbar-start"></div>
        <div class="navbar-center">
          <button class="btn-circle btn btn-ghost" @click.stop="close()">
            <component :is="icons.xMark" class="text-base" />
          </button>
          <button class="btn-circle btn btn-ghost">
            <div ref="penColorRef" class="h-5 w-5 rounded-full bg-base-content" />
          </button>
          <button class="btn-circle btn btn-ghost" @click.stop="clear()">
            <component :is="icons.trash" class="text-base" />
          </button>
          <button class="btn-circle btn btn-ghost" @click.stop="undo()">
            <component :is="icons.arrowUturnLeft" class="text-base" />
          </button>
          <button class="btn-circle btn btn-ghost" @click.stop="save()">
            <component :is="icons.arrowDownOnSquare" class="text-base" />
          </button>
        </div>
        <div class="navbar-end"></div>
      </header>
    </div>
  </div>
</template>
