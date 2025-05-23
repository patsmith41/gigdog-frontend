// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: 'class',
  content: [ /* ...your content paths... */ ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-geist-mono)', ...defaultTheme.fontFamily.mono],
      },
      fontSize: {
        'xxl': '3rem',
      },
      colors: { // <<< ADD THIS
        'background': 'hsl(var(--background-hsl) / <alpha-value>)',
        'foreground': 'hsl(var(--foreground-hsl) / <alpha-value>)',
        'brand-primary': 'hsl(var(--brand-primary-hsl) / <alpha-value>)',
        'brand-secondary': 'hsl(var(--brand-secondary-hsl) / <alpha-value>)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};