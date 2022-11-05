<script setup lang="ts">
import { LayoutCardSize, MenuItems, OnComponentOpenParams } from '~/shims'
import { useMenuStore } from '~/stores/menu'

//STORES
const menuStore = useMenuStore()

// REFERENCES
const imageContainerElement = ref<HTMLDivElement>()
const signaturePadContainerElement = ref<HTMLDivElement>()
const containerElementHeight = ref<string>()
const layoutCardSize = ref<LayoutCardSize>()
const cameraModel = ref<boolean>(false)
const cameraView = ref<boolean>(false)
const signaturePadModel = ref<boolean>(false)
const signaturePadView = ref<boolean>(false)
const imageSrc = ref<string>('')
const signatureSrc = ref<string>('')
const resizing = ref<boolean>(false)
const deletingImage = ref<boolean>(false)
const deletingSignature = ref<boolean>(false)
const menuItems = ref<MenuItems>([])

// METHODS
function handleContainerResize(element?: HTMLElement): void {
  if (element) {
    if (!resizing.value) {
      resizing.value = true
      element.style.height = containerElementHeight.value || ''
      setTimeout(
        () => {
          element.style.height = ''
          resizing.value = false
        },
        getTransitionDuration(element),
        1000
      )
    }
  }
}

function deletePhoto(): void {
  deletingImage.value = true
  setTimeout(() => {
    imageSrc.value = ''
    deletingImage.value = false
  }, 500)
}
function openCamera(): void {
  if (imageContainerElement.value) {
    const height = `${imageContainerElement.value.offsetHeight}px`
    imageContainerElement.value.style.height = height
    containerElementHeight.value = height
  }
  cameraView.value = true
  setTimeout(() => {
    cameraModel.value = true
    layoutCardSize.value = 'full'
    if (imageContainerElement.value) imageContainerElement.value.style.height = ''
  }, 20)
}
function onCameraSnap(src: string): void {
  handleContainerResize(imageContainerElement.value)
  cameraModel.value = false
  imageSrc.value = src
}
function onCameraClose(duration = 0): void {
  handleContainerResize(imageContainerElement.value)
  layoutCardSize.value = 'default'
  menuStore.clearItems()
  setTimeout(() => {
    cameraView.value = false
  }, duration)
}
function onCameraOpen({ actions }: OnComponentOpenParams): void {
  const { snap, toggleSideMenu, close } = actions
  menuItems.value = [
    { icon: 'heroicons-camera', text: 'Take Picture', type: 'action', action: snap },
    { icon: 'heroicons-cog-6-tooth', text: 'Toggle Settings', type: 'action', action: toggleSideMenu, color: 'base' },
    { type: 'divider' },
    { icon: 'heroicons-x-mark', text: 'Close', type: 'action', action: close, color: 'base' }
  ]
}

function deleteSignature(): void {
  deletingSignature.value = true
  setTimeout(() => {
    signatureSrc.value = ''
    deletingSignature.value = false
  }, 500)
}
function openSignaturePad(): void {
  if (signaturePadContainerElement.value) {
    const height = `${signaturePadContainerElement.value.offsetHeight}px`
    signaturePadContainerElement.value.style.maxHeight = height
    containerElementHeight.value = height
  }
  signaturePadView.value = true
  setTimeout(() => {
    signaturePadModel.value = true
    layoutCardSize.value = 'full'
    if (signaturePadContainerElement.value) signaturePadContainerElement.value.style.maxHeight = '100%'
  }, 20)
}
function onSignaturePadSave(src = ''): void {
  handleContainerResize(signaturePadContainerElement.value)
  signaturePadModel.value = false
  signatureSrc.value = src
}
function onSignaturePadClose(duration = 0): void {
  handleContainerResize(signaturePadContainerElement.value)
  if (signaturePadContainerElement.value && containerElementHeight.value) signaturePadContainerElement.value.style.maxHeight = containerElementHeight.value
  layoutCardSize.value = 'default'
  menuStore.clearItems()
  setTimeout(() => {
    signaturePadView.value = false
    if (signaturePadContainerElement.value && containerElementHeight.value) signaturePadContainerElement.value.style.maxHeight = ''
  }, duration)
}
function onSignaturePadOpen({ actions }: OnComponentOpenParams): void {
  const { save, undo, clear, close } = actions
  menuItems.value = [
    { icon: 'heroicons-arrow-down-on-square', text: 'Save', type: 'action', action: save },
    { icon: 'heroicons-arrow-uturn-left', text: 'Undo', type: 'action', action: undo, color: 'base' },
    { icon: 'heroicons-trash', text: 'Delete', type: 'action', action: clear, color: 'base' },
    { type: 'divider' },
    { icon: 'heroicons-x-mark', text: 'Close', type: 'action', action: close, color: 'base' }
  ]
}

// INITIALIZE

// WATCHERS
watch(menuItems, (newMenuItems) => {
  if (newMenuItems) menuStore.setItems(newMenuItems)
})

watch(
  [isOverlayVisible, controlsOnRight, signaturePadModel, cameraModel],
  ([newIsOverlayVisible, newControlsOnRight, newSignaturePadModel, newCameraModel]) => {
    if (!newCameraModel) setThemeColorByProp(newIsOverlayVisible && newControlsOnRight && !newSignaturePadModel ? '--n' : '--b1')
    else setThemeColorByProp('--', '#000000')
  },
  { immediate: true }
)
</script>

<template>
  <x-split-layout card-state="show" :card-size="layoutCardSize" :card-focus="cameraModel || signaturePadModel">
    <div class="container w-full">
      <page-title><x-icon icon="heroicons-user" class="text-primary" /> New Account</page-title>

      <x-spacer />

      <form id="new-account" class="form" action="#" method="POST">
        <label class="input-group w-full">
          <span class="label-text w-1/3 min-w-[132px] whitespace-nowrap">First Name</span>
          <input type="text" placeholder="" class="input-bordered input w-2/3" />
        </label>
        <label class="input-group w-full">
          <span class="label-text w-1/3 min-w-[132px] whitespace-nowrap">Middle Name</span>
          <input type="text" placeholder="" class="input-bordered input w-2/3" />
        </label>
        <label class="input-group w-full">
          <span class="label-text w-1/3 min-w-[132px] whitespace-nowrap">Last Name</span>
          <input type="text" placeholder="" class="input-bordered input w-2/3" />
        </label>

        <x-spacer />

        <label class="input-group w-full">
          <span class="label-text w-1/3 min-w-[132px] whitespace-nowrap">Address</span>
          <input type="text" placeholder="" class="input-bordered input w-2/3" />
        </label>

        <label class="input-group w-full">
          <span class="label-text w-1/3 min-w-[132px] whitespace-nowrap">City</span>
          <input type="text" placeholder="" class="input-bordered input w-2/3" />
        </label>

        <label class="input-group w-full">
          <span class="label-text w-1/3 min-w-[132px] whitespace-nowrap">Zip Code</span>
          <input type="text" placeholder="" class="input-bordered input w-2/3" />
        </label>

        <x-spacer />

        <label class="input-group w-full">
          <span class="label-text w-1/3 min-w-[132px] whitespace-nowrap">Nationality</span>
          <input type="text" placeholder="" class="input-bordered input w-2/3" />
        </label>

        <label class="input-group w-full">
          <span class="label-text w-1/3 min-w-[132px] whitespace-nowrap">Gender</span>
          <select class="select-bordered select w-2/3">
            <option selected>Male</option>
            <option>Female</option>
          </select>
        </label>
        <label class="input-group w-full">
          <span class="label-text w-1/3 min-w-[132px] whitespace-nowrap">Date of Birth</span>
          <input type="date" placeholder="Expiry Date" class="input-bordered input w-2/3" />
        </label>
        <label class="input-group w-full">
          <span class="label-text w-1/3 min-w-[132px] whitespace-nowrap">Mobile Number</span>
          <input type="text" placeholder="" class="input-bordered input w-2/3" />
        </label>
        <label class="input-group w-full">
          <span class="label-text w-1/3 min-w-[132px] whitespace-nowrap">Telephone Number</span>
          <input type="text" placeholder="" class="input-bordered input w-2/3" />
        </label>
      </form>
    </div>

    <!-- SLOTS -->
    <template #card>
      <div class="container flex h-full flex-col gap-4 duration-300" :class="{ '!p-0': cameraModel || signaturePadModel }">
        <!-- IMAGE CONTAINER -->
        <div
          v-if="!signaturePadView"
          ref="imageContainerElement"
          class="image-signature-card top h-fit max-h-[75%] min-h-[50%] w-full"
          :class="{ expand: cameraModel }"
        >
          <div class="aspect-1 h-full w-full">
            <!-- CAMERA -->
            <camera
              v-if="cameraView"
              id="new-account-camera"
              v-model="cameraModel"
              class="image-signature-component"
              @snap="onCameraSnap($event)"
              @close="onCameraClose($event)"
              @open="onCameraOpen($event)"
            />
            <!-- IMAGE -->
            <div v-if="imageSrc" class="image-signature-content" :class="{ deleting: deletingImage }">
              <img :src="imageSrc" alt="User Photo" class="h-full w-full object-cover" />
              <div class="overlay-with-buttons">
                <button class="btn-square btn" @click.stop="deletePhoto()">
                  <x-icon icon="heroicons-trash" class="icon" />
                </button>
                <button class="btn-square btn" @click.stop="openCamera()">
                  <x-icon icon="heroicons-camera" class="icon" />
                </button>
              </div>
            </div>
          </div>
          <!-- OPEN CAMERA BUTTON -->
          <button
            v-if="!imageSrc && !cameraView"
            class="image-signature-card top image-signature-card-button btn-primary"
            :class="{ expand: cameraModel }"
            @click.stop="openCamera()"
          >
            <x-icon icon="heroicons-camera" class="icon" />
          </button>
        </div>

        <!-- SIGNATURE PAD -->
        <div v-if="!cameraView" ref="signaturePadContainerElement" class="image-signature-card top mt-auto w-full grow" :class="{ expand: signaturePadModel }">
          <!-- SIGNATURE CONTAINER -->
          <div class="h-full w-full">
            <!-- SIGNATURE PAD -->
            <signature-pad
              v-if="signaturePadView"
              v-model="signaturePadModel"
              class="image-signature-component"
              @save="onSignaturePadSave($event)"
              @close="onSignaturePadClose($event)"
              @open="onSignaturePadOpen($event)"
            />
            <!-- SIGNATURE -->
            <div v-if="signatureSrc" class="image-signature-content" :class="{ deleting: deletingSignature }">
              <div class="container h-full w-full">
                <div class="mask-signature top h-full w-full bg-current" :style="{ mask: `url(${signatureSrc})`, '-webkit-mask': `url(${signatureSrc})` }" />
              </div>
              <div class="overlay-with-buttons">
                <button class="btn-square btn" @click.stop="deleteSignature()">
                  <x-icon icon="heroicons-trash" class="icon" />
                </button>
                <button class="btn-square btn" @click.stop="openSignaturePad()">
                  <x-icon icon="heroicons-pencil-square" class="icon" />
                </button>
              </div>
            </div>
          </div>
          <!-- OPEN SIGNATURE PAD BUTTON -->
          <button
            v-if="!signatureSrc && !signaturePadView"
            class="image-signature-card image-signature-card-button"
            :class="{ expand: signaturePadModel }"
            @click.stop="openSignaturePad()"
          >
            <x-icon icon="heroicons-pencil" class="icon" />
          </button>
        </div>
      </div>
    </template>
  </x-split-layout>
</template>

<style lang="postcss" scoped>
.image-signature-card {
  @apply card !duration-300 relative;

  & .image-signature-component {
    @apply h-full w-full !scale-100 opacity-0 duration-300;
  }

  &.expand {
    @apply !h-full max-h-full rounded-none !rounded-tl-[3rem];

    & .image-signature-component {
      @apply !opacity-100;
    }
  }

  &.top {
    @apply rounded-tl-[2.4em];
  }
}

.image-signature-content {
  @apply h-full w-full duration-300 overflow-hidden;

  &.deleting {
    @apply scale-0 pointer-events-none rounded-full;
  }
}

.image-signature-card-button {
  @apply !btn !btn-ghost !absolute flex !h-full !w-full items-center justify-center;

  & .icon {
    @apply !h-16 !w-16;
  }

  &.btn-primary {
    @apply !btn-primary;
  }
}

.overlay-with-buttons {
  @apply absolute top-0 flex h-full w-full items-center justify-center gap-4 bg-neutral/60 opacity-0 transition-opacity duration-300 hover:opacity-100;

  & .icon {
    @apply text-2xl;
  }
}

.mask-signature {
  mask-size: contain !important;
  mask-repeat: no-repeat !important;
  mask-position: center !important;
}
</style>
