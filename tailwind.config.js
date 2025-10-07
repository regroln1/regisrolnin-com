/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Jost', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'ui-serif', 'Georgia', 'serif'],
        crimson: ['Crimson Text', 'serif'],
      },
      colors: {
        'navy': {
          900: '#1a202c',
          950: '#0f1419',
        },
        'navy-black': '#0f1419',
      },
    },
  },
  plugins: [],
};