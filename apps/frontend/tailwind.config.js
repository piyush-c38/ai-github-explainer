/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#131314',
        'surface-1': '#1E1F20',
        'surface-2': '#282A2C',
        primary: '#8AB4F8',
        'on-primary': '#001D35',
        secondary: '#C2E7FF',
        'on-secondary': '#001F2A',
        tertiary: '#F4B5BC',
        'on-tertiary': '#460011',
        'on-surface': '#E3E3E3',
        'on-surface-variant': '#C4C7C5',
        outline: '#8E918F',
      },
    },
  },
  plugins: [],
};
