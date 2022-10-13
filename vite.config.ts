import { defineConfig, loadEnv } from 'vite'
import { rmSync } from 'fs'
import autoImport from 'unplugin-auto-import/vite'
import components from 'unplugin-vue-components/vite'
import eslintPlugin from 'vite-plugin-eslint'
import icons from 'unplugin-icons/vite'
import iconsResolver from 'unplugin-icons/resolver'
import inspect from 'vite-plugin-inspect'
import layouts from 'vite-plugin-vue-layouts'
import pages from 'vite-plugin-pages'
import path from 'path'
// import manifest from './manifest.json'
// import { VitePWA as pwa } from 'vite-plugin-pwa'
import stylelintPlugin from 'vite-plugin-stylelint'
import vue from '@vitejs/plugin-vue'
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import { version as pkgVersion } from './package.json'
import { list as themes } from './daisyui'

rmSync('dist', { recursive: true, force: true })

process.env.VITE_APP_VERSION = pkgVersion
if (process.env.NODE_ENV === 'production') {
  process.env.VITE_APP_BUILD_EPOCH = new Date().getTime().toString()
}

process.env.VITE_THEMES = themes

export default defineConfig(({ mode }) => {
  // const env = loadEnv(mode, process.cwd(), '')
  // const production = env.MODE === 'production'
  return {
    resolve: {
      alias: {
        '~/': `${path.resolve(__dirname, 'src')}/`,
        '@': `${path.resolve(__dirname, 'src')}/`
      }
    },
    plugins: [
      vue({
        include: [/\.vue$/, /\.md$/],
        reactivityTransform: true
      }),
      pages({
        extensions: ['vue', 'md']
      }),
      layouts(),
      components({
        extensions: ['vue', 'md'],
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: 'src/components.d.ts',
        resolvers: [
          iconsResolver({
            prefix: false
          })
        ]
      }),
      autoImport({
        imports: ['vue', 'vue-router', 'vue-i18n', '@vueuse/head', '@vueuse/core', 'pinia'],
        resolvers: [
          iconsResolver({
            componentPrefix: 'icon',
            enabledCollections: ['carbon', 'mdi', 'icon-park-outline', 'heroicons', 'icons-heroicons']
          })
        ],
        dts: 'src/auto-imports.d.ts',
        dirs: ['src/composables', 'src/store'],
        vueTemplate: true
      }),
      // pwa({
      //   strategies: 'injectManifest',
      //   includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png', 'safari-pinned-tab.svg'],
      //   srcDir: 'src',
      //   filename: 'sw.ts',
      //   registerType: 'autoUpdate',
      //   manifest,
      //   devOptions: {
      //     enabled: true,
      //     type: 'module'
      //   }
      // }),
      icons({
        autoInstall: true,
        compiler: 'vue3'
      }),
      vueI18n({
        runtimeOnly: true,
        compositionOnly: true,
        include: [path.resolve(__dirname, 'locales/**')]
      }),

      // https://github.com/antfu/vite-plugin-inspect
      inspect({
        // change this to enable inspect for debugging
        enabled: false
      }),
      eslintPlugin(),
      stylelintPlugin()
    ],
    server: {
      open: true,
      fs: {
        strict: true
      }
    },
    optimizeDeps: {
      include: ['vue', 'vue-router', '@vueuse/core', '@vueuse/head'],
      exclude: ['vue-demi']
    }
  }
})
