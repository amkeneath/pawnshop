const { daisyui } = require('./daisyui')
const plugin = require('tailwindcss/plugin')

/** @type {import('@types/tailwindcss/tailwind-config').TailwindConfig } */
module.exports = {
  content: ['./index.html', './public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-mode="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        baloo: ['"Baloo 2"', 'cursive'],
        poppins: ['"Poppins"', 'sans-serif']
      }
    }
  },
  variants: { extend: {} },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
    require('daisyui'),
    plugin(function ({ addVariant, e, postcss }) {
      addVariant('firefox', ({ container, separator }) => {
        const isFirefoxRule = postcss.atRule({
          name: '-moz-document',
          params: 'url-prefix()'
        })
        isFirefoxRule.append(container.nodes)
        container.append(isFirefoxRule)
        isFirefoxRule.walkRules((rule) => {
          rule.selector = `.${e(`firefox${separator}${rule.selector.slice(1)}`)}`
        })
      })
    })
  ],
  daisyui
}
