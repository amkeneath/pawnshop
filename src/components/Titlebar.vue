<template>
  <x-titlebar>
    <x-icon icon="heroicons-wifi" :class="[isOnline ? 'text-success' : 'text-error']" />
  </x-titlebar>
</template>
