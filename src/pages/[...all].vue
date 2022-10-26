<route lang="yaml">
name: not-found
meta:
  layout: 404
</route>

<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="text-4xl">
    {{ t('not-found') }}
  </div>
</template>
