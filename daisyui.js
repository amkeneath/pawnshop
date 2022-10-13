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
      'base-200': '#1e1f21',
      'base-300': '#2a2b2c',
      'base-content': '#d0d0d0',
      info: '#9999ff',
      success: '#99ff99',
      warning: '#ffff99',
      error: '#ff9999',

      '--rounded-box': '2rem', // border radius rounded-box utility class, used in card and other large boxes
      '--rounded-btn': '1rem', // border radius rounded-btn utility class, used in buttons and similar element
      '--rounded-badge': '075rem', // border radius rounded-badge utility class, used in badges and similar
      '--animation-btn': '0.25s', // duration of animation when you click on button
      '--animation-input': '0.25s', // duration of animation for inputs like checkbox, toggle, radio, etc
      '--btn-text-case': 'uppercase', // set default text transform for buttons
      '--btn-focus-scale': '0.95', // scale transform of button when you focus on it
      '--border-btn': '1px', // border width of buttons
      '--tab-border': '1px', // border width of tabs
      '--tab-radius': '0.75rem', // border radius of tabs

      '--rounded-prop': '.25rem',
      '--animation-general': '0.25s'
    }
  }
]

const themes = () => list.split(' ').map((theme) => theme.trim())
const daisyui = { themes: [...themes(), ...customThemes], utils: false }

module.exports = { daisyui, list: customThemes.reduce((acc, theme) => (acc += ` ${Object.keys(theme)?.[0]}`), list) }
