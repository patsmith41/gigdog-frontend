// tailwind.config.js - ENSURE THIS IS THE EXACT CONTENT
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-geist-mono)', ...defaultTheme.fontFamily.mono],
      },
      fontSize: {
        'xxl': '3rem',
      },
      colors: { 
        'background': 'hsl(var(--background-hsl) / <alpha-value>)',
        'foreground': 'hsl(var(--foreground-hsl) / <alpha-value>)',
        'brand-primary': 'hsl(var(--brand-primary-hsl) / <alpha-value>)',
        'brand-secondary': 'hsl(var(--brand-secondary-hsl) / <alpha-value>)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    // Make sure line-clamp is NOT here for this revert
  ],
};