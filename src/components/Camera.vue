<script setup lang="ts">
import { getTransitionDuration } from '~/composables/element'
import { OnComponentOpenParams, WorkerNavigator } from '~/shims'

interface Props {
  modelValue?: boolean
  id?: string
  controls?: boolean
}
interface Emits {
  (e: 'update:modelValue', payload: boolean): void
  (e: 'close', payload: number): void
  (e: 'open', payload: OnComponentOpenParams): void
  (e: 'snap', payload: string): void
}

// PROPS
const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  id: 'default-camera',
  controls: false
})
const { modelValue, controls } = toRefs(props)

// EMITS
const emit = defineEmits<Emits>()

// USE
const { videoInputs: cameras, audioInputs: microphones } = useDevicesList({ requestPermissions: true })
const activeCameraId = useLocalStorage(`${props.id}-video`, '')
const activeMicrophoneId = useLocalStorage(`${props.id}-audio`, '')

// CONSTANTS
const DEFAULT = true

//REFERENCES
const videoElement = ref<HTMLVideoElement>()
const canvasElement = ref<HTMLCanvasElement>()
const snapFrameElement = ref<HTMLDivElement>()
const snapFrameWrapperElement = ref<HTMLDivElement>()
const model = ref<boolean>(false)
const snapping = ref<boolean>(false)
const sideMenu = ref<boolean>(false)
const mediaStream = ref<MediaStream>({} as MediaStream)

// COMPUTED
const cameraIndex = computed((): number =>
  Math.max(
    cameras.value.findIndex(({ deviceId }) => deviceId === activeCameraId.value),
    0
  )
)
const microphoneIndex = computed((): number =>
  Math.max(
    microphones.value.findIndex(({ deviceId }) => deviceId === activeMicrophoneId.value),
    0
  )
)

// METHODS
function clearCanvas(): void {
  if (canvasElement.value) {
    const canvas: HTMLCanvasElement = canvasElement.value
    const context = canvas.getContext('2d')
    if (context) {
      context.fillStyle = '#AAA'
      context.fillRect(0, 0, canvas.width, canvas.height)
    }
  }
}

async function snap(): Promise<void> {
  if (!snapping.value) {
    let duration = 2000
    if (snapFrameElement.value) {
      duration = getTransitionDuration(snapFrameElement.value)
      if (videoElement.value && snapFrameWrapperElement.value) {
        const mediaStreamTrack = mediaStream.value.getVideoTracks()[0]
        const imageCapture = new ImageCapture(mediaStreamTrack)
        const bitMap = await imageCapture.grabFrame()
        const { width, height } = { width: bitMap.width, height: bitMap.height }
        const multiplier = videoElement.value.offsetHeight / height
        snapFrameWrapperElement.value.style.height = `${height * multiplier}px`
        snapFrameWrapperElement.value.style.width = `${width * multiplier}px`
      }
    }
    snapping.value = true
    setTimeout(() => {
      snapping.value = false
      setTimeout(async (): Promise<void> => {
        if (canvasElement.value) {
          const mediaStreamTrack = mediaStream.value.getVideoTracks()[0]
          const imageCapture = new ImageCapture(mediaStreamTrack)
          const bitMap = await imageCapture.grabFrame()
          const canvas: HTMLCanvasElement = canvasElement.value
          canvas.width = bitMap.width
          canvas.height = bitMap.height
          canvas.getContext('2d')?.drawImage(bitMap, 0, 0)
          const data = canvas.toDataURL('image/png')
          clearCanvas()
          emit('snap', data)
        }
      }, duration)
    }, duration)
  }
}

function selectCamera(deviceId: string): void {
  activeCameraId.value = deviceId
}
function selectMicrophone(deviceId: string): void {
  activeMicrophoneId.value = deviceId
}
function openSideMenu(): void {
  sideMenu.value = true
}
function closeSideMenu(): void {
  sideMenu.value = false
}
function toggleSideMenu(): void {
  if (!sideMenu.value) openSideMenu()
  else closeSideMenu()
}

function setMediaStream(): void {
  const _navigator: WorkerNavigator = navigator
  const constraints: MediaStreamConstraints = {}
  constraints.audio = { deviceId: activeMicrophoneId.value }
  constraints.video = { deviceId: activeCameraId.value }
  if (_navigator.mediaDevices) {
    _navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream: MediaStream) => {
        if (mediaStream.value.getTracks) {
          mediaStream.value.getTracks().forEach((track) => {
            track.stop()
          })
        }
        const mediaStreamTrack = stream.getVideoTracks()[0]
        const capabilities = mediaStreamTrack.getCapabilities()
        const width = capabilities.width?.max
        const height = capabilities.height?.max
        mediaStreamTrack.applyConstraints({ height, width, advanced: [{ aspectRatio: 1 }] })
        if (videoElement.value) {
          const video: HTMLVideoElement = videoElement.value
          video.srcObject = stream || null
          // video.play()
        }

        mediaStream.value = stream
      })
      .catch((err: Error) => {
        console.log('ERROR:setMediaStream', err)
      })
  }
}

function close(): void {
  model.value = false
}

function modalOpen(duration = 0): void {
  emit('update:modelValue', true)
  emit('open', { duration, actions: { snap, toggleSideMenu, close } })
}
function modalClosed(duration = 0): void {
  emit('update:modelValue', false)
  emit('close', duration)
}

// WATCHERS
watch(
  [activeCameraId, activeMicrophoneId],
  () => {
    setMediaStream()
  },
  { immediate: true }
)

/** WATCHERS */
watch(
  [modelValue],
  ([newModelValue], [oldModelValue]) => {
    if (newModelValue !== oldModelValue) {
      model.value = typeof newModelValue === 'boolean' ? newModelValue : DEFAULT
    }
  },
  { immediate: true }
)

// HOOKS
onMounted((): void => {
  // Do something
})
</script>

<template>
  <x-modal v-model="model" class="camera" @open="modalOpen($event)" @close="modalClosed($event)" @click.stop="closeSideMenu()">
    <canvas ref="canvasElement" />
    <video ref="videoElement" autoplay />
    <div ref="snapFrameWrapperElement" class="snap-frame-wrapper">
      <div ref="snapFrameElement" class="snap-frame" :class="{ snapping: snapping }" />
    </div>
    <div v-if="!sideMenu && controls" class="controls">
      <button @click.stop="close()">
        <x-icon icon="heroicons-x-mark" class="icon" />
      </button>
      <button class="snap-button" @click.stop="snap()">
        <span />
      </button>
      <button tabindex="0" @click.stop="openSideMenu()">
        <x-icon icon="heroicons-cog-6-tooth" class="icon" />
      </button>
    </div>
    <div
      class="absolute top-0 left-full z-10 h-full w-full max-w-xs bg-black/70 py-4 px-2 drop-shadow transition-all duration-300"
      :class="{ '-translate-x-full': sideMenu }"
    >
      <ul tabindex="0" class="menu menu-compact h-full w-full">
        <li v-for="(camera, idx) of cameras" :key="camera.deviceId" class="text-sm text-white/70">
          <a
            class="items-start bg-transparent leading-5 transition-all duration-300 hover:text-white/90"
            :class="{ '!text-white': idx === cameraIndex }"
            @click.stop="selectCamera(camera.deviceId)"
          >
            <x-icon icon="heroicons-video-camera" class="h-5 flex-none" />
            {{ camera.label }}
          </a>
        </li>
        <li v-for="(microphone, idx) of microphones" :key="microphone.deviceId" class="text-sm text-white/70">
          <a
            class="bg-transparent transition-all duration-300 hover:text-white/90"
            :class="{ '!text-white': idx === microphoneIndex }"
            @click.stop="selectMicrophone(microphone.deviceId)"
          >
            <x-icon icon="heroicons-microphone" class="flex-none" />
            {{ microphone.label.match(/\(([^)]+)\)/)?.[1] }}
          </a>
        </li>
        <li v-if="false"><div class="divider m-0 gap-0 before:bg-white/20 after:bg-white/20" /></li>
        <li v-if="false" class="text-sm text-secondary">
          <a class="bg-transparent transition-all duration-300 hover:text-white/90">
            <x-icon icon="heroicons-play" class="flex-none" />
            Start
          </a>
        </li>
        <li class="text-sm text-secondary">
          <a class="bg-transparent transition-all duration-300 hover:text-white/90">
            <x-icon icon="heroicons-stop" class="flex-none" />
            Stop
          </a>
        </li>
        <li class="grow opacity-0" />
        <li v-if="controls" class="text-sm text-white/70">
          <a class="bg-transparent transition-all duration-300 hover:text-white/90" @click="openSideMenu()">
            <x-icon icon="heroicons-x-mark" class="" />
          </a>
        </li>
      </ul>
    </div>
  </x-modal>
</template>

<style lang="postcss" scoped>
.camera {
  @apply overflow-hidden;

  & canvas {
    @apply absolute -z-10 h-full w-full;
  }

  & video {
    @apply h-full w-full bg-black;
  }

  & button .icon {
    @apply text-lg text-white;
  }

  & .snap-frame-wrapper {
    @apply absolute top-0 h-full w-full left-1/2 -translate-x-1/2 duration-[0] overflow-hidden;
  }

  & .snap-frame {
    @apply bg-white duration-100 opacity-0 w-full h-full;

    &.snapping {
      @apply opacity-100;
    }
  }

  & .controls {
    @apply absolute bottom-0 z-10 flex w-full items-center justify-around p-8;
  }

  & .snap-button {
    @apply flex h-16 w-16 items-center justify-center rounded-full bg-white/30;

    & span {
      @apply block h-14 w-14 rounded-full bg-white transition-all duration-100;
    }

    &:active > span {
      @apply scale-90;
    }
  }
}
</style>
