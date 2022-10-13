<script setup lang="ts">
const icons = {
  camera: markRaw(IconHeroiconsCamera),
  trash: markRaw(IconHeroiconsTrash),
  arrowDownOnSquare: markRaw(IconHeroiconsArrowDownOnSquare),
  pencilSquare: markRaw(IconHeroiconsPencilSquare)
}

const cameraModel = ref(false)
const signaturePadModel = ref(false)
const imageSrc = ref('')
const signatureSrc = ref('')

const openCamera = (): void => {
  cameraModel.value = true
}

const deleteImage = (): void => {
  imageSrc.value = ''
}

const onPhotoSnap = (src: string): void => {
  cameraModel.value = false
  imageSrc.value = src
}

const openSignaturePad = (): void => {
  signaturePadModel.value = true
}

const deleteSignature = (): void => {
  signatureSrc.value = ''
}

const saveSignature = (src = ''): void => {
  signaturePadModel.value = false
  signatureSrc.value = src
}
</script>

<route lang="yaml">
  meta:
    layout: desktop
  </route>

<template>
  <section class="flex flex-col gap-4">
    <header class="navbar card sticky top-0 z-40 flex flex-row gap-4 overflow-visible bg-base-100 shadow">
      <div class="navbar-start">
        <h2 class="px-2">New Account</h2>
      </div>
      <div class="navbar-center"></div>
      <div class="navbar-end">
        <button form="loan" class="btn-circle btn btn-ghost" type="submit">
          <component :is="icons.arrowDownOnSquare" class="text-base" />
        </button>
      </div>
    </header>
    <div class="grid gap-4 lg:grid-cols-2">
      <form id="new-account" class="space-y-2" action="#" method="POST">
        <input type="text" placeholder="First Name" class="input-bordered input w-full" />
        <input type="text" placeholder="Middle Name" class="input-bordered input w-full" />
        <input type="text" placeholder="Last Name" class="input-bordered input w-full" />

        <div class="divider opacity-0" />

        <input type="text" placeholder="Address" class="input-bordered input w-full" />
        <input type="text" placeholder="City" class="input-bordered input w-full" />
        <input type="number" placeholder="Zip Code" class="input-bordered input w-full" />

        <div class="divider opacity-0" />

        <input type="text" placeholder="Nationality" class="input-bordered input w-full" />
        <input type="text" placeholder="Gender" class="input-bordered input w-full" />
        <input type="date" placeholder="Date of Birth" class="input-bordered input w-full" />
        <input type="number" placeholder="Telephone Number" class="input-bordered input w-full" />
        <input type="number" placeholder="Mobile Number" class="input-bordered input w-full" />
      </form>
      <div class="flex flex-col items-center gap-4">
        <div class="aspect-w-1 aspect-h-1 card relative flex w-full items-center justify-center bg-base-100 text-base-content shadow">
          <div class="absolute h-full w-full">
            <div v-if="cameraModel" class="h-full w-full">
              <camera id="new-account-camera" v-model="cameraModel" class="" @snap="onPhotoSnap" />
            </div>
            <div v-else-if="imageSrc" class="h-full w-full">
              <img :src="imageSrc" alt="User Photo" class="h-full w-full" />
              <div
                class="absolute top-0 flex h-full w-full items-center justify-center gap-4 bg-neutral/60 opacity-0 transition-opacity duration-500 hover:opacity-100"
              >
                <button class="btn-square btn" @click.stop="deleteImage()">
                  <component :is="icons.trash" class="text-lg" />
                </button>
                <button class="btn-square btn" @click.stop="openCamera()">
                  <component :is="icons.camera" class="text-lg" />
                </button>
              </div>
            </div>
            <button v-else class="btn-square btn btn-ghost h-full w-full rounded-none" @click.stop="openCamera()">
              <component :is="icons.camera" class="h-20 w-20" />
            </button>
          </div>
        </div>
        <div class="card flex h-36 w-full items-center justify-center bg-base-100 uppercase text-base-content shadow">
          <div v-if="signaturePadModel" class="h-full w-full">
            <signature-pad v-model="signaturePadModel" @save="saveSignature" />
          </div>
          <div v-else-if="signatureSrc" class="h-full w-full">
            <div class="h-full w-full p-4">
              <div class="mask-signature h-full w-full bg-base-content" :style="{ mask: `url(${signatureSrc})`, '-webkit-mask': `url(${signatureSrc})` }" />
            </div>
            <div
              class="absolute top-0 flex h-full w-full items-center justify-center gap-4 bg-neutral/60 opacity-0 transition-opacity duration-500 hover:opacity-100"
            >
              <button class="btn-square btn" @click.stop="deleteSignature()">
                <component :is="icons.trash" class="text-lg" />
              </button>
              <button class="btn-square btn" @click.stop="openSignaturePad()">
                <component :is="icons.pencilSquare" class="text-lg" />
              </button>
            </div>
          </div>
          <button v-else class="btn btn-ghost h-full w-full rounded-none" @click.stop="openSignaturePad()">Signature</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
.template-1-1 {
  grid-template-columns: 1fr 1fr;
}

.mask-signature {
  mask-size: contain !important;
  mask-repeat: no-repeat !important;
  mask-position: center !important;
}
</style>
