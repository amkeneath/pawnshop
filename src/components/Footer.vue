<script setup lang="ts">
const { t, availableLocales, locale } = useI18n()

const toggleLocales = (): void => {
  // change to some real logic
  const locales = availableLocales
  locale.value = locales[(locales.indexOf(locale.value) + 1) % locales.length]
}

onMounted(() => {
  // Do something
})
</script>

<template>
  <nav class="mt-6 text-xl">
    <a class="icon-btn mx-2" :title="t('button.toggle_langs')" @click.stop="toggleLocales()">
      <x-icon />
    </a>
  </nav>
</template>
