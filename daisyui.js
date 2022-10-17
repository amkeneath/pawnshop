const list = ''
// 'light dark cupcake bumblebee emerald corporate synthwave valentine halloween garden forest aqua lofi pastel fantasy wireframe black luxury dracula cmyk business acid lemonade night coffee winter'
const customThemes = [
  {
    dark: {
      primary: '#FFBD9A',
      secondary: '#C9BCFF',
      accent: '#B7E4CC',
      neutral: '#3F4756',
      'base-100': '#121315',
      'base-200': '#1E1F21',
      'base-300': '#2A2B2C',
      'base-content': '#D0D0D0',
      info: '#9999FF',
      success: '#99FF99',
      warning: '#FFFF99',
      error: '#FF9999'
    }
  }
]

const themes = () => list.split(' ').map((theme) => theme.trim())
const daisyui = { themes: [...themes(), ...customThemes], utils: false, styled: false }

module.exports = { daisyui, list: customThemes.reduce((acc, theme) => (acc += ` ${Object.keys(theme)?.[0]}`), list) }
