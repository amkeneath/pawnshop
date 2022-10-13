<script setup lang="ts">
// `import { useUserStore } from '~/stores/user'

// const user = useUserStore()
// const name = ref(user.savedName)

// const router = useRouter()
// const go = () => {
//     if (name.value) router.push(`/hi/${encodeURIComponent(name.value)}`)
// }

// const { t } = useI18n()
</script>

<template>
  <section class="home flex items-center justify-center">
    <div class="grid h-full w-full max-w-[600px] gap-6 md:max-h-[600px] md:grid-cols-2">
      <router-link to="/new-loan" title="New Loan" class="btn flex h-full max-h-96 w-full items-center justify-center border-none text-2xl shadow"
        >New Loan</router-link
      >
      <router-link to="/new-loan" title="New Loan" class="btn flex h-full max-h-96 w-full items-center justify-center border-none text-2xl shadow"
        >Fru fru</router-link
      >
      <router-link to="/new-loan" title="New Loan" class="btn flex h-full max-h-96 w-full items-center justify-center border-none text-2xl shadow"
        >Fru fru</router-link
      >
      <router-link to="/new-loan" title="New Loan" class="btn flex h-full max-h-96 w-full items-center justify-center border-none text-2xl shadow"
        >Fru fru</router-link
      >
    </div>
  </section>
</template>

<style lang="postcss" scoped></style>
