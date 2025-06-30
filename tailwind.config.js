/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'heracx-',
  // important: '#flai',
  corePlugins: {
    preflight: false,
  },
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class', // only generate classes
    })
  ],
}

