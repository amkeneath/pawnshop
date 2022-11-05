import { BasicColorSchema } from '@vueuse/core'

import { getStylePropertyValue } from './element'
import { extendBeforeExtension, extractNumbers } from './string'

type ThemeMode = 'auto' | 'light' | 'dark'

const daisyuiThemes: string = import.meta.env.VITE_THEMES

// DEFAULTS
const NO_THEME = 'NO-THEME'
const THEME_PAIR_DARK = 'dracula'
const THEME_PAIR_LIGHT = 'light'
const THEME_MODE: ThemeMode = 'auto'
const FAVICON = 'favicon.svg'

// STATICS
const themeSelector = 'html'
const themeAttribute = 'data-theme'
const themeModeAttribute = 'data-theme-mode'
const themes = daisyuiThemes.split(' ').map((theme: string) => theme.trim())
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
const themeModes = themes.reduce((accumulator, value): any => ({ ...accumulator, [value]: value }), {})

// HELPER METHODS
function checkedValue(value: string, defaultValue = themes[0]): string {
  return themes.includes(value) ? value : themes.includes(defaultValue) ? defaultValue : themes.length > 0 ? themes[0] : NO_THEME
}
function checkedValueDark(value = THEME_PAIR_DARK): string {
  return checkedValue(value, THEME_PAIR_DARK)
}
function checkedValueLight(value = THEME_PAIR_LIGHT): string {
  return checkedValue(value, THEME_PAIR_LIGHT)
}

// STORAGE
const valueDarkStorage = useLocalStorage('themepair-dark', checkedValueDark())
const valueLightStorage = useLocalStorage('themepair-light', checkedValueLight())
const themeStorage = useLocalStorage(themeAttribute, '')
const themeModeStorage = useLocalStorage(themeModeAttribute, THEME_MODE)

// STATE
let lastProp = '--b1'

// REFERENCES
const themePair = computed(() => ({ valueDark: valueDarkStorage.value, valueLight: valueLightStorage.value }))
const themeColor = ref('')

// FAVICON
const customFavicon = useFavicon()
const favicon = computed((): string => extendBeforeExtension(customFavicon.value || FAVICON, preferredDark ? '-dark' : ''))

const preferredDark = usePreferredDark()

// THEME
const theme = useColorMode({
  selector: themeSelector,
  attribute: themeAttribute,
  storageKey: themeAttribute,
  modes: themeModes
})
const _setTheme = useToggle(theme)

// LIGHT AND DARK TOGGLE
const isDark = useDark({
  selector: themeSelector,
  attribute: themeModeAttribute,
  storageKey: themeModeAttribute,
  onChanged(dark: boolean) {
    const { valueDark, valueLight } = themePair.value
    _setTheme((dark ? valueDark : valueLight) as BasicColorSchema)
    const element = document.querySelector(themeSelector)
    element?.setAttribute(this.attribute || '', localStorage.getItem(this.storageKey || '') || '')
    element?.classList[getAddOrRemove(dark)]('dark')
  }
})
const toggleDark = useToggle(isDark)

// METHODS
function isValidThemeMode(themeMode?: string): boolean {
  // return themeMode === 'auto' || themeMode === (preferredDark.value ? 'light' : 'dark')
  return themeMode === 'auto' || themeMode === 'dark' || themeMode === 'light'
}
function setCustomFavIcon(favicon: string): void {
  customFavicon.value = favicon
}
function removeCustomFavIcon(): void {
  customFavicon.value = undefined
}
function setTheme(theme: BasicColorSchema): void {
  const { valueLight: light, valueDark: dark } = themePair.value
  if (theme === light || theme === dark) toggleDark(theme === dark)
  else _setTheme(checkedValue(theme) as BasicColorSchema)
}
function setThemePair(valueLight?: string, valueDark?: string): void {
  if (valueLight !== valueLightStorage.value) {
    valueLightStorage.value = checkedValueLight(valueLight)
  }
  if (valueDark !== valueDarkStorage.value) {
    valueDarkStorage.value = checkedValueDark(valueDark)
  }
}
// Accepts css prop e.g. --b1
function setThemeColorByProp(prop?: string, fallback?: string): void {
  nextTick(() => {
    prop = prop || lastProp
    const value = getStylePropertyValue(document.querySelector(themeSelector) as HTMLElement, prop)
    if (value) {
      lastProp = prop
      themeColor.value = hslToHex(...extractNumbers(value))
    } else if (fallback) {
      lastProp = '--'
      themeColor.value = fallback
    }
  })
}

// INITIALIZE
setThemeColorByProp()

// WATCHERS AND OBSERVERS
const themeElement = ref(document.querySelector(themeSelector))
if (themeElement) {
  useMutationObserver(
    themeElement,
    (mutations) => {
      // if (mutations[0] && mutations[0].attributeName === themeAttribute) setThemeColorByProp()
      if (mutations[0]) setThemeColorByProp()
    },
    { attributes: true }
  )
}

watch(
  [themeModeStorage, themePair, themeStorage],
  ([newThemeMode, newThemepair, newTheme], [oldThemeMode, oldThemepair, oldTheme]) => {
    // THEME MODE
    if (newThemeMode !== oldThemeMode && !isValidThemeMode(newThemeMode)) {
      setTimeout(() => {
        themeModeStorage.value = 'light'
      }, 20)
    }

    // THEME
    if (newTheme !== oldTheme && !themes.includes(newTheme)) {
      setTimeout(() => {
        themeStorage.value = checkedValue(oldTheme || NO_THEME)
        document.querySelector(themeSelector)?.setAttribute(themeAttribute, themeStorage.value)
      }, 20)
    }

    // THEME PAIR
    const { valueDark: newValueDark, valueLight: newValueLight } = newThemepair
    const { valueDark: oldValueDark, valueLight: oldValueLight } = oldThemepair || { valueDark: undefined, valueLight: undefined }
    if (newValueDark !== oldValueDark || newValueLight !== oldValueLight) {
      if (!themes.includes(newValueDark)) {
        valueDarkStorage.value = checkedValueDark(oldValueDark)
      } else if (!themes.includes(newValueLight)) {
        valueLightStorage.value = checkedValueLight(oldValueLight)
      } else {
        const newTheme = isDark.value ? checkedValueDark(newValueDark) : checkedValueLight(newValueLight)
        if (newTheme !== theme.value) {
          _setTheme(newTheme as BasicColorSchema)
        }
      }
    }
  },
  { immediate: true }
)

// EXPORTS
const _themeColor = readonly(themeColor)
export {
  favicon,
  isDark,
  preferredDark,
  removeCustomFavIcon,
  setCustomFavIcon,
  setTheme,
  setThemeColorByProp,
  setThemePair,
  theme,
  _themeColor as themeColor,
  themePair,
  themes,
  toggleDark
}
