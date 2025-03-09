/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0E1525',
        foreground: '#F5F9FC',
        card: '#1C2333',
        'card-hover': '#2B3245',
        border: '#2B3245',
        primary: '#0099FF',
        secondary: '#6F7787',
        accent: {
          purple: '#A960FF',
          blue: '#0099FF',
          green: '#2ECC71',
          yellow: '#FFD500',
          red: '#FF4B4B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    },
  },
  plugins: [],
};