<route lang="yaml">
meta:
  layout: 404
</route>

<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div>
    {{ t('not-found') }}
  </div>
</template>
