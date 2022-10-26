import './styles/main.postcss'

// eslint-disable-next-line import/no-unresolved
import { setupLayouts } from 'virtual:generated-layouts'
// eslint-disable-next-line import/no-unresolved
import generatedRoutes from 'virtual:generated-pages'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import middleware from '~/middleware/router'

import App from './App.vue'
import type { UserModule } from './types'

const app = createApp(App)
const routes = setupLayouts(generatedRoutes)
const router = createRouter({ history: createWebHistory(), routes })

Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true })).map((i) => i.install?.({ app, router, routes }))

app.use(router)
middleware(router)

app.mount('#app').$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*')
})
