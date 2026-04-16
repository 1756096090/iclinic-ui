import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/**/*.{html,ts,tsx}',
    './src/app/**/*.{html,ts}',
    './src/index.html',
  ],
  theme: {
    extend: {
      colors: {
        red: {
          50: '#fef2f2',
          600: '#dc2626',
          700: '#b91c1c',
        },
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
} satisfies Config;
