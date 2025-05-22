// postcss.config.mjs
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [
    require('@tailwindcss/postcss'), // ✅ Use require() not string
    require('autoprefixer'),
  ],
};

export default config;
