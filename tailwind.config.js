/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Spotify 风格配色
        spotify: {
          50: '#E8F8F0',
          100: '#C2EDD9',
          200: '#9BE3C3',
          300: '#74D9AD',
          400: '#4DCF97',
          500: '#1DB954', // Spotify 绿
          600: '#1AA34A',
          700: '#178D40',
          800: '#137736',
          900: '#0F612C',
        },
        dark: {
          50: '#B3B3B3',
          100: '#9B9B9B',
          200: '#6A6A6A',
          300: '#535353',
          400: '#3E3E3E',
          500: '#282828', // Spotify 深灰
          600: '#1F1F1F',
          700: '#181818', // Spotify 黑
          800: '#121212',
          900: '#000000',
        },
        light: {
          50: '#FFFFFF',
          100: '#F6F6F6',
          200: '#E5E5E5',
          300: '#B3B3B3',
          400: '#7F7F7F',
          500: '#535353',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Fredoka', 'Comic Sans MS', 'cursive', 'sans-serif'],
        'kids': ['Baloo 2', 'Fredoka', 'Comic Sans MS', 'cursive', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shake': 'shake 0.5s ease-in-out',
        'pop': 'pop 0.3s ease-out',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%': { transform: 'rotate(5deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
      }
    },
  },
  plugins: [],
}
