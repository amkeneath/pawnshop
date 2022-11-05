<script setup lang="ts">
// USE
const { t } = useI18n()
const router = useRouter()
const route = useRoute()

// WATCHERS
watch(route, () => {
  setThemeColorByProp('--b1')
})
</script>

<route lang="yaml">
meta:
  layout: 404
</route>

<template>
  <main class="px-4 py-10 text-center">
    <div>
      <p class="mt-4 text-4xl">
        <carbon-warning class="inline-block" />
      </p>
    </div>
    <router-view />
    <div>
      <button class="btn m-3 mt-8 text-sm" @click="router.back()">
        {{ t('button.back') }}
      </button>
    </div>
  </main>
</template>
