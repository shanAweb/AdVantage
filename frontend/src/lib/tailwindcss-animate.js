const plugin = require('tailwindcss/plugin')

module.exports = plugin(function({ addUtilities }) {
  addUtilities({
    '.animate-accordion-down': {
      'animation': 'accordion-down 0.2s ease-out'
    },
    '.animate-accordion-up': {
      'animation': 'accordion-up 0.2s ease-out'
    }
  })
})







