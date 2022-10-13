module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': 'postcss-nesting',
    tailwindcss: {},
    autoprefixer: {},
    'postcss-preset-env': {
      stage: 2,
      features: { 'nesting-rules': true, 'custom-selectors': true }
    }
    // ...(preset.env.MODE === 'production' ? { cssnano: {} } : {})
  }
}
