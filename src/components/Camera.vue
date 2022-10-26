<script setup lang="ts">
import { XWorkerNavigator } from '~/shims'

interface Props {
  modelValue?: boolean
  id?: string
}
interface Emits {
  (e: 'update:modelValue', payload: boolean): void
  (e: 'close'): void
  (e: 'open'): void
  (e: 'snap', payload: string): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  id: 'default-camera'
})
const emit = defineEmits<Emits>()

const icons = {
  xMark: markRaw(IconHeroiconsXMark),
  play: markRaw(IconHeroiconsPlay),
  stop: markRaw(IconHeroiconsStop),
  videoCamera: markRaw(IconHeroiconsVideoCamera),
  microphone: markRaw(IconHeroiconsMicrophone),
  cogSixTooth: markRaw(IconHeroiconsCog6Tooth)
}

const videoRef = ref(null)
const canvasRef = ref(null)

const { modelValue } = toRefs(props)
const model = ref<boolean>(false)

const snapFrame = ref(null)
const snapping = ref(false)
const sideMenu = ref(false)

const mediaStream = ref({} as MediaStream)

const { videoInputs: cameras, audioInputs: microphones } = useDevicesList({ requestPermissions: true })

const activeCameraId = useLocalStorage(`${props.id}-video`, '')
const activeMicrophoneId = useLocalStorage(`${props.id}-audio`, '')

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

const clearCanvas = (): void => {
  if (canvasRef.value) {
    const canvas: HTMLCanvasElement = canvasRef.value
    const context = canvas.getContext('2d')
    if (context) {
      context.fillStyle = '#AAA'
      context.fillRect(0, 0, canvas.width, canvas.height)
    }
  }
}

const open = (viaModel = false): void => {
  if (!viaModel) {
    emit('update:modelValue', true)
  }
  emit('open')
}
const close = (viaModel = false): void => {
  if (!viaModel) {
    emit('update:modelValue', false)
  }
  emit('close')
}
const onSnap = (): void => {
  if (!snapping.value) {
    let duration = 2000
    if (snapFrame.value) {
      duration = +window.getComputedStyle(snapFrame.value).transitionDuration * 1000
    }
    snapping.value = true
    setTimeout(() => {
      snapping.value = false
      setTimeout(async (): Promise<void> => {
        if (canvasRef.value) {
          const mediaStreamTrack = mediaStream.value.getVideoTracks()[0]
          const imageCapture = new ImageCapture(mediaStreamTrack)
          const bitMap = await imageCapture.grabFrame()
          const canvas: HTMLCanvasElement = canvasRef.value
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

const selectCamera = (deviceId: string): void => {
  activeCameraId.value = deviceId
}
const selectMicrophone = (deviceId: string): void => {
  activeMicrophoneId.value = deviceId
}
const openSideMenu = (): void => {
  sideMenu.value = true
}
const closeSideMenu = (): void => {
  sideMenu.value = false
}

const setMediaStream = (): void => {
  const xNavigator: XWorkerNavigator = navigator
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const constraints: MediaStreamConstraints = {}
  constraints.audio = { deviceId: activeMicrophoneId.value }
  constraints.video = { deviceId: activeCameraId.value }
  if (xNavigator.mediaDevices) {
    xNavigator.mediaDevices
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
        if (videoRef.value) {
          const video: HTMLVideoElement = videoRef.value
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

watch(
  [activeCameraId, activeMicrophoneId],
  ([newActiveCameraId, newActiveMicrophoneId]) => {
    setMediaStream()
  },
  { immediate: true }
)

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

onMounted((): void => {
  // Do something
})
</script>

<template>
  <div class="camera relative flex h-full w-full justify-center bg-black" :class="[{ 'hidden -z-10': !model }]" @click.stop="closeSideMenu()">
    <canvas ref="canvasRef" class="absolute -z-10 h-full w-full" />
    <video ref="videoRef" class="h-full" autoplay />
    <div ref="snapFrame" class="absolute top-0 h-full w-full bg-white transition-all duration-100" :class="snapping ? 'opacity-1' : 'opacity-0'" />
    <div v-if="!sideMenu" class="absolute bottom-0 z-10 flex w-full items-center justify-around p-8">
      <button @click.stop="close()">
        <component :is="icons.xMark" class="text-lg text-white" />
      </button>
      <button class="snap-button flex h-16 w-16 items-center justify-center rounded-full bg-white/30" @click.stop="onSnap()">
        <span class="block h-14 w-14 rounded-full bg-white transition-all duration-100"></span>
      </button>
      <button tabindex="0" @click.stop="openSideMenu()">
        <component :is="icons.cogSixTooth" class="text-base text-white" />
      </button>
    </div>
    <div
      class="absolute top-0 left-full z-20 h-full w-full max-w-xs bg-black/70 py-4 px-2 shadow transition-all duration-300"
      :class="{ '-translate-x-full': sideMenu }"
    >
      <ul tabindex="0" class="menu menu-compact h-full w-full">
        <li v-for="(camera, idx) of cameras" :key="camera.deviceId" class="text-sm text-white/70">
          <a
            class="items-start bg-transparent leading-5 transition-all duration-300 hover:text-white/90"
            :class="{ '!text-white': idx === cameraIndex }"
            @click.stop="selectCamera(camera.deviceId)"
          >
            <component :is="icons.videoCamera" class="h-5 flex-none" />
            {{ camera.label }}
          </a>
        </li>
        <li v-for="(microphone, idx) of microphones" :key="microphone.deviceId" class="text-sm text-white/70">
          <a
            class="bg-transparent transition-all duration-300 hover:text-white/90"
            :class="{ '!text-white': idx === microphoneIndex }"
            @click.stop="selectMicrophone(microphone.deviceId)"
          >
            <component :is="icons.microphone" class="flex-none" />
            {{ microphone.label.match(/\(([^)]+)\)/)?.[1] }}
          </a>
        </li>
        <li><div class="divider m-0 gap-0 before:bg-white/20 after:bg-white/20" /></li>
        <li class="text-sm text-secondary">
          <a class="bg-transparent transition-all duration-300 hover:text-white/90">
            <component :is="icons.play" class="flex-none" />
            Start
          </a>
        </li>
        <li class="text-sm text-secondary">
          <a class="bg-transparent transition-all duration-300 hover:text-white/90">
            <component :is="icons.stop" class="flex-none" />
            Stop
          </a>
        </li>
        <li class="grow opacity-0" />
        <li class="text-sm text-white/70">
          <a class="bg-transparent transition-all duration-300 hover:text-white/90" @click="openSideMenu()">
            <component :is="icons.xMark" class="" />
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.snap-button:active > span {
  @apply scale-90;
}
</style>
