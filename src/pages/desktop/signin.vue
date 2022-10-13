<script setup>
const icons = {
  signIn: markRaw(IconHeroiconsArrowRightOnRectangle),
  username: markRaw(IconHeroiconsUser),
  password: markRaw(IconHeroiconsLockClosed),
  moon: markRaw(IconHeroiconsMoon),
  sun: markRaw(IconHeroiconsSun)
}
</script>

<route lang="yaml">
meta:
  layout: empty
</route>

<template>
  <section class="login bg-light text-light-800 dark:bg-dark flex flex-row-reverse content-center p-2 dark:text-base-200">
    <div
      class="bg-dark dark:bg-light dark:text-base-800 flex w-full max-w-xl items-center justify-center rounded-lg px-4 py-12 text-base-200 drop-shadow sm:px-6 lg:px-10"
    >
      <div class="w-full max-w-lg space-y-8">
        <div>
          <img class="mx-auto h-12 w-auto" src="/logo.svg" alt="RSY Pawnshop Logo" />
          <h2 class="mt-6 text-center text-3xl font-bold uppercase tracking-tight">RSY Pawnshop</h2>
        </div>
        <form class="mt-8 space-y-4" action="#" method="POST">
          <input type="hidden" name="remember" value="true" />
          <div class="flex flex-col gap-3">
            <x-input id="username" color="primary" label="Username" :icon="icons.username" required />
            <x-input id="password" color="primary" label="Password" :icon="icons.password" type="password" required />
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <x-checkbox id="remember-me" />
              <label for="remember-me">Remember me</label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium hover:text-base-100">Forgot your password?</a>
            </div>
          </div>
          <x-button color="dark-accent" dark-color="light-accent">Sign In</x-button>
        </form>
      </div>
    </div>
    <div class="flex grow items-end">
      <x-switch :icon="icons.moon" :alt-icon="icons.sun" :on="isDark" @change="toggleDark(!isDark)" />
    </div>
  </section>
</template>
