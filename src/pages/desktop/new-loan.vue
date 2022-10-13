<script setup lang="ts">
const icon = {
  lifebuoy: markRaw(IconHeroiconsLifebuoy),
  truck: markRaw(IconHeroiconsTruck),
  devicePhoneMobile: markRaw(IconHeroiconsDevicePhoneMobile),
  star: markRaw(IconHeroiconsStar)
}
const categories = [
  { text: 'Jewelry', icon: icon.lifebuoy },
  { text: 'Automotive', icon: icon.truck },
  { text: 'Appliances', icon: icon.star },
  { text: 'Gadgets', icon: icon.devicePhoneMobile }
]

const jewelries = [
  { id: 'ring', text: 'Ring' },
  { id: 'necklace', text: 'Necklace' },
  { id: 'bracelet', text: 'Bracelet' },
  { id: 'item1', text: 'Item 1' },
  { id: 'item2', text: 'Item 2' }
]
</script>

<template>
  <section class="flex gap-6">
    <nav class="card h-full w-40 bg-base-100 p-4">
      <ul class="flex h-full w-full flex-col items-center justify-center gap-4">
        <li v-for="category of categories" :key="category.text" class="w-full">
          <a class="card flex w-full cursor-pointer flex-col items-center bg-neutral p-4 text-primary shadow hover:bg-neutral-focus">
            <component :is="category.icon" class="m-2 h-8 w-8" />
            <h2 class="capitalize">{{ category?.text }}</h2>
          </a>
        </li>
      </ul>
    </nav>
    <section class="flex h-full w-full items-center justify-center">
      <div class="flex flex-wrap justify-center gap-10">
        <div v-for="jewelry of jewelries" :key="jewelry.id" class="card flex h-60 w-60 cursor-pointer items-center justify-center bg-base-100 shadow">
          {{ jewelry.text }}
        </div>
      </div>
    </section>
  </section>
</template>

<style lang="postcss" scoped></style>
