<template>
  <div v-if="isOverlayVisible" class="x-titlebar draggable windows-overlay z-[999] items-center duration-[0ms]" :class="{ 'justify-end': controlsOnRight }">
    <div
      class="relative flex h-full items-center"
      :class="[controlsOnRight ? 'pl-4 rounded-bl-2xl' : 'pr-4 rounded-bl-2xl']"
      :style="{ backgroundColor: themeColor }"
    >
      <span class="absolute top-0 h-full w-screen" :class="[controlsOnRight ? 'left-full' : 'right-full']" :style="{ backgroundColor: themeColor }" />
      <slot />
    </div>
  </div>
</template>
