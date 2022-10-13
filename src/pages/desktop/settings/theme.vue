<script setup lang="ts">
import { BasicColorSchema } from '@vueuse/core'

const icons = {
  star: markRaw(IconHeroiconsStar),
  moon: markRaw(IconHeroiconsMoon),
  sun: markRaw(IconHeroiconsSun)
}
</script>

<template>
  <section class="">
    <div class="themes">
      <button v-for="t of themes" :key="t" class="aspect-h-1 aspect-w-1 btn card btn-ghost border-none shadow" @click="setTheme(t as BasicColorSchema)">
        <div :[themeAttribute]="t" class="absolute flex flex-col gap-2 bg-base-100 py-4 text-base-content">
          <h3 class="flex items-center gap-2 px-4 text-lg font-bold capitalize">
            {{ t }}
            <div class="flex gap-1">
              <component :is="icons.star" v-if="t === theme" />
              <component :is="icons.moon" v-if="t === themePair.valueDark" />
              <component :is="icons.sun" v-if="t === themePair.valueLight" />
            </div>
          </h3>
          <div class="flex grow gap-4 pr-4">
            <div class="card flex grow basis-2/3 flex-col gap-2 rounded-l-none">
              <div class="h-full w-full bg-base-200" />
              <div class="h-full w-full bg-base-300" />
            </div>
            <div class="flex grow basis-1/3 flex-col gap-2">
              <div class="badge-primary badge h-full w-full grow text-xs capitalize text-primary-content">primary</div>
              <div class="badge-secondary badge h-full w-full grow text-xs capitalize text-secondary-content">secondary</div>
              <div class="badge-accent badge h-full w-full grow text-xs capitalize text-accent-content">accent</div>
              <div class="badge-neutral badge h-full w-full grow text-xs capitalize text-neutral-content">neutral</div>
            </div>
          </div>
        </div>
      </button>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
.themes {
  @apply grid gap-4;

  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
</style>
