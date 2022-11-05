<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { AuthData } from '~/shims'
import { useAuthStore } from '~/stores/auth'

// USE
const auth = useAuthStore()

// REFERENCES
const { isFetching, data } = storeToRefs(auth)

// METHODS
const authData = reactive<AuthData>({
  username: '',
  password: ''
})

function login(): void {
  auth.login(authData)
}

// INITIALIZE
setThemeColorByProp(controlsOnRight ? '--n' : '--b1')
</script>
<route lang="yaml">
meta:
  layout: empty
  middleware: [guest]
</route>

<template>
  <section class="flex">
    <x-section class="w-1/2">
      <div class="full"></div>
      <div class="flex h-full w-full flex-col items-center justify-center gap-2">
        <logo class="mb-6 h-1/2 w-1/2" />
        <h1 class="uppercase">Pawnshop</h1>
        <p class="scale-x-95 text-accent">Welcome to RSY Pawnshop</p>
      </div>
    </x-section>
    <x-section class="w-1/2 overflow-hidden rounded-tl-[3rem] bg-neutral text-neutral-content">
      <div class="m-auto flex h-full w-2/3 items-center justify-center">
        <form id="login" class="form w-full" @submit.prevent="login()">
          <div class="form-control relative w-full">
            <span class="label absolute flex h-full w-14 items-center justify-center">
              <x-icon icon="heroicons-user-solid" :class="{ '!text-error': data === 'invalid-user' }" />
            </span>
            <input
              v-model="authData.username"
              type="text"
              placeholder="Username"
              class="input-bordered input w-full pl-14"
              :class="{ '!input-error': data === 'invalid-user' }"
            />
          </div>
          <div class="form-control relative w-full">
            <span class="label absolute flex h-full w-14 items-center justify-center">
              <x-icon icon="heroicons-lock-closed" :class="{ '!text-error': data === 'invalid-password' }" />
            </span>
            <input
              v-model="authData.password"
              type="password"
              placeholder="Password"
              class="input-bordered input w-full pl-14"
              :class="{ '!input-error': data === 'invalid-password' }"
            />
          </div>
          <div class="text-right">
            <a class="link">Forgot password?</a>
          </div>
          <button type="submit" class="btn-primary btn" :class="[{ loading: isFetching }, isFetching ? 'gap-2' : 'gap-3']">
            <heroicons-arrow-right-on-rectangle v-if="!isFetching" />
            {{ isFetching ? 'Logging in' : 'Login' }}
          </button>
        </form>
      </div>
    </x-section>
  </section>
</template>
