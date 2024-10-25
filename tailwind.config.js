/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    `./src/pages/**/*.{js,jsx,ts,tsx}`,
    `./src/components/**/*.{js,jsx,ts,tsx}`,
  ],
  theme: {
    extend: {
      flex: {
        'logo': '0 0 150px',
      },
      maxWidth: {
        'hlg': '1140px'
      },
      backgroundImage: {
        'hero-pattern': "url('/images/werd.jpg')",
      }
    },
  },
  plugins: [],
}
