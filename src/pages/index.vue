<script setup lang="ts">
const icon = {
  lifebuoy: markRaw(IconHeroiconsLifebuoy),
  truck: markRaw(IconHeroiconsTruck),
  devicePhoneMobile: markRaw(IconHeroiconsDevicePhoneMobile),
  star: markRaw(IconHeroiconsStar),
  xMark: markRaw(IconHeroiconsXMark)
}
const categories = ref([
  { text: 'Jewelry', icon: icon.lifebuoy },
  { text: 'Automotive', icon: icon.truck },
  { text: 'Appliances', icon: icon.star },
  { text: 'Gadgets', icon: icon.devicePhoneMobile }
])

const jewelries = ref([
  { text: 'Ring', icon: markRaw(icon.star) },
  { text: 'Necklace', icon: markRaw(icon.star) },
  { text: 'Bracelet', icon: markRaw(icon.star) },
  { text: 'Watch', icon: markRaw(icon.star) },
  { text: 'Item 1', icon: markRaw(icon.star) },
  { text: 'Item 2', icon: markRaw(icon.star) },
  { text: 'Item 3', icon: markRaw(icon.star) },
  { text: 'Item 4', icon: markRaw(icon.star) }
])

const tabModel = ref(0)
const activeItem = ref(0)

const setActiveItem = (index: number): void => {
  console.log('index', index)
  activeItem.value = index
}
</script>

<template>
  <section class="relative flex h-screen w-full flex-col">
    <div class="max-w-screen fixed max-h-screen w-full">
      <div class="card-top card">
        <div class="flex items-center justify-between">
          <h1 class="title">Loan</h1>
          <component :is="icon.xMark" class="text-xl" />
        </div>
        <x-tabs v-model="tabModel" :items="categories" class="-mb-2" />
      </div>
      <div class="container">
        <x-tab-contents :active="tabModel">
          <div v-for="category of categories" :key="category.text" class="tab-content grid-cols-fit-sm grid gap-3">
            <a
              v-for="(jewelry, idx) of jewelries"
              :key="jewelry.text"
              class="rounded-btn flex items-center gap-1 bg-base-200 text-base-content"
              @click.stop="setActiveItem(idx)"
            >
              <component
                :is="jewelry.icon"
                class="flex-0 rounded-btn animation-general h-16 w-16 flex-none scale-75 rounded bg-base-100 p-2 text-base-content"
                :class="{ 'bg-primary text-primary-content': idx === activeItem }"
              />
              <span class="animation-general w-full" :class="{ 'text-primary': idx === activeItem }">{{ jewelry.text }}</span>
            </a>
          </div>
        </x-tab-contents>
      </div>
    </div>
    <div class="card-bottom card mt-auto h-1/2 w-full"></div>
    <div class="safe-left fixed top-0 left-0 h-full" />
    <div class="safe-right fixed top-0 right-0 h-full" />
    <div class="safe-top fixed top-0 left-0 w-full" />
    <div class="safe-bottom fixed left-0 bottom-0 w-full" />
  </section>
</template>

<style lang="postcss" scoped>
[class^='safe-'] {
  @apply bg-red-600;
}

.safe-left {
  width: env(safe-area-inset-left, 20px);
}

.safe-right {
  width: env(safe-area-inset-right, 20px);
}

.safe-top {
  height: env(safe-area-inset-top, 20px);
}

.safe-bottom {
  height: env(safe-area-inset-bottom, 20px);
}
</style>
