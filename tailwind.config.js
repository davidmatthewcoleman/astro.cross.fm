/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  theme: {
    screens: {
      'sm': '400px',
      'md': '600px',
      'lg': '800px',
      'xl': '960px',
    },
    extend: {
      ringColor: {
        'accent': 'var(--accentLight, #038cfc)',
      },
      fontSize: {
        'xxs': '0.675rem',
      },
    },
  },
  plugins: [],
}

