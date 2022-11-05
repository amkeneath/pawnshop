<script lang="ts" setup>
import { useAuthStore } from '~/stores/auth'

// USE
const auth = useAuthStore()

function logout(): void {
  auth.logout()
}
</script>
<template>
  <div class="container">
    <button class="btn-secondary btn" @click.stop="logout()">Logout</button>
  </div>
</template>
