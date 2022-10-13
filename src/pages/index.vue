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
    <div class="fixed w-full">
      <div class="card card-top">
        <div class="flex justify-between items-center">
          <h1 class="title">Loan</h1>
          <component :is="icon.xMark" class="text-xl"/>
        </div>
        <x-tabs v-model="tabModel" :items="categories" class="-mb-2" />
      </div>
      <div class="container">
        <x-tab-contents :active="tabModel">
          <div v-for="category of categories" :key="category.text" class="tab-content grid grid-cols-fit-sm gap-3">
            <a v-for="(jewelry, idx) of jewelries" :key="jewelry.text" class="bg-base-200 text-base-content flex items-center gap-1 rounded-btn" @click.stop="setActiveItem(idx)">
              <component :is="jewelry.icon" class="bg-base-100 text-base-content rounded w-16 h-16 flex-0 p-2 rounded-btn scale-75 flex-none animation-general" :class="{'bg-primary text-primary-content': idx === activeItem}" />
              <span class="w-full animation-general" :class="{'text-primary': idx === activeItem}">{{ jewelry.text }}</span>
            </a>
          </div>
        </x-tab-contents>
      </div>
    </div>
    <div class="card-bottom card mt-auto h-1/2 w-full"></div>
  </section>
</template>

<style lang="postcss" scoped></style>
