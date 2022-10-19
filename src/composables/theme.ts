import { BasicColorSchema } from '@vueuse/core'

// these APIs are auto-imported from @vueuse/core
const daisyuiThemes: string = import.meta.env.VITE_THEMES

// DEFAULTS
const THEMEPAIR_LIGHT = 'light'
const THEMEPAIR_DARK = 'dracula'

const fullTheme = ref(false)

const themes = daisyuiThemes.split(' ').map((theme: string) => theme.trim())

const checkedValue = (value: string, defaultValue: string): string => (themes.includes(value) ? value : defaultValue)
const checkedValueLight = (value = THEMEPAIR_LIGHT): string => checkedValue(value, THEMEPAIR_LIGHT)
const checkedValueDark = (value = THEMEPAIR_DARK): string => checkedValue(value, THEMEPAIR_DARK)

const valueLightStorage = useLocalStorage('themepair-light', checkedValueLight())
const valueDarkStorage = useLocalStorage('themepair-dark', checkedValueDark())

const themeSelector = 'html'
const themeAttribute = 'data-theme'
const themePair = ref({ valueLight: valueLightStorage.value, valueDark: valueDarkStorage.value })

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
const themeModes = themes.reduce((accumulator, value): any => ({ ...accumulator, [value]: value }), {})

const theme = useColorMode({
  selector: themeSelector,
  attribute: themeAttribute,
  modes: themeModes
})
let isDark = useDark()

const setTheme = useToggle(theme)
let toggleDark = useToggle(isDark)

const preferredDark = usePreferredDark()

let lastProp = '--b1'
const getPropertyValue = (property: string): string => {
  return `hsl(${getComputedStyle(document.querySelector('html') as HTMLElement)
    ?.getPropertyValue(property)
    .trim()
    .split(' ')
    .join(', ')})`
}
const themeColor = ref('')
// const themeColor = computed(() => (isDark.value ? '#121315' : '#121315'))

const setThemeColorByProp = (prop?: string): void => {
  prop = prop || lastProp
  const value = getPropertyValue(prop)
  if (value) {
    lastProp = prop
    themeColor.value = value
  }
}

setThemeColorByProp()

const favicon = computed(() => (preferredDark.value ? 'favicon-dark.svg' : 'favicon.svg'))

const setFavicon = useFavicon(favicon)

const setIsDark = (valueLight: string, valueDark: string): void => {
  themePair.value = { valueLight: checkedValueLight(valueLight), valueDark: checkedValueDark(valueDark) }
  isDark = useDark({
    selector: themeSelector,
    attribute: themeAttribute,
    ...themePair.value
  })
  toggleDark = useToggle(isDark)
  setThemeColorByProp()
}

const setThemePair = (valueLight = checkedValueLight(), valueDark = checkedValueDark()): void => {
  if (valueLight !== valueLightStorage.value) {
    valueLightStorage.value = valueLight
  }
  if (valueDark !== valueDarkStorage.value) {
    valueDarkStorage.value = valueDark
  }
}

watch(
  [valueLightStorage, valueDarkStorage],
  ([newValueLight, newValueDark], [oldValueLight, oldValueDark]) => {
    if (newValueLight !== oldValueLight || newValueDark !== oldValueDark) {
      if (themes.includes(newValueLight) && themes.includes(newValueDark)) {
        setIsDark(newValueLight, newValueDark)
      } else {
        if (!themes.includes(newValueLight)) {
          valueLightStorage.value = checkedValueLight()
        }
        if (!themes.includes(newValueDark)) {
          valueDarkStorage.value = checkedValueDark()
        }
      }
    }
  },
  { immediate: true }
)

const themeElement = ref(document.querySelector(themeSelector))
if (themeElement) {
  useMutationObserver(
    themeElement,
    (mutations) => {
      if (mutations[0] && mutations[0].attributeName === themeAttribute) {
        const themeValue = theme.value as string
        const currentTheme = themeElement.value?.getAttribute(themeAttribute) as string
        if (themes.includes(currentTheme)) {
          if (themeValue !== currentTheme && fullTheme.value) {
            setTheme(currentTheme as BasicColorSchema)
          }
          setThemeColorByProp()
        } else {
          themeElement.value?.setAttribute(themeAttribute, themeValue)
        }
      }
    },
    { attributes: true }
  )
}

const readonlyThemePair = readonly(themePair)
export {
  favicon,
  fullTheme,
  isDark,
  preferredDark,
  setFavicon,
  setTheme,
  setThemeColorByProp,
  setThemePair,
  theme,
  themeAttribute,
  themeColor,
  readonlyThemePair as themePair,
  themes,
  toggleDark
}
