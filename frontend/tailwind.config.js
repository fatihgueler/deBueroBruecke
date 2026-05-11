/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          500: '#4F6EF7',
          600: '#3B55E6',
          700: '#2D44C7',
        },
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
        surface: '#0f172a',
        card: '#1e293b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-critical': 'pulse-critical 1.5s ease-in-out infinite',
      },
      keyframes: {
        'pulse-critical': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.03)' },
        },
      },
    },
  },
  plugins: [],
};
