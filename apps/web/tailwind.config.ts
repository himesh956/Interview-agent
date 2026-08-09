import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0b',
        surface: '#111113',
        'surface-2': '#16161a',
        'border-soft': 'rgba(255,255,255,0.05)',
        accent: '#06b6d4',
        'accent-2': '#8b5cf6'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: []
};

export default config;