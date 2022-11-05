const list = 'dracula'
// 'light dark cupcake bumblebee emerald corporate synthwave valentine halloween garden forest aqua lofi pastel fantasy wireframe black luxury dracula cmyk business acid lemonade night coffee winter'
const customThemes = [
  {
    light: {
      primary: '#3DCDFE',
      'primary-content': '#FFFFFF',
      secondary: '#668DF3',
      'secondary-content': '#FFFFFF',
      accent: '#FE7C00',
      'accent-content': '#FFFFFF',
      neutral: '#FFFFFF',
      'base-100': '#F9FBFC',
      'base-200': '#EFF3F6',
      'base-300': '#9E9DB0',
      'base-content': '#626466',

      '--rounded-prop': '.25rem',
      '--black': '0 100 50'
    }
  }
]

const themes = () => list.split(' ').map((theme) => theme.trim())
const daisyui = { themes: [...themes(), ...customThemes], utils: true, styled: true }

module.exports = { daisyui, list: customThemes.reduce((acc, theme) => (acc += ` ${Object.keys(theme)?.[0]}`), list) }
