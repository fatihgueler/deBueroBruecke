/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#4F6EF7',
          600: '#3B55E6',
          700: '#2D44C7',
          800: '#1e3399',
          900: '#172469',
        },
        success: {
          DEFAULT: '#22c55e',
          light:   '#dcfce7',
          dark:    '#15803d',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light:   '#fef3c7',
          dark:    '#b45309',
        },
        danger: {
          DEFAULT: '#ef4444',
          light:   '#fee2e2',
          dark:    '#b91c1c',
        },
        surface:  '#0b1425',
        'surface-2': '#0f1c35',
        card:     '#152035',
        'card-2': '#1a2845',
        border:   '#1e3050',
        'border-2': '#243760',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-critical': 'pulse-critical 1.5s ease-in-out infinite',
        'float':          'float 6s ease-in-out infinite',
        'fade-in':        'fade-in 0.5s ease-out',
        'slide-up':       'slide-up 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'shimmer':        'shimmer 2.5s infinite',
        'glow-pulse':     'glow-pulse 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-critical': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':       { opacity: '0.85', transform: 'scale(1.03)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(100%)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(79, 110, 247, 0.2)' },
          '50%':       { boxShadow: '0 0 40px rgba(79, 110, 247, 0.5)' },
        },
      },
      boxShadow: {
        'glow':      '0 0 20px rgba(79, 110, 247, 0.3)',
        'glow-lg':   '0 0 40px rgba(79, 110, 247, 0.45)',
        'card':      '0 4px 24px rgba(0, 0, 0, 0.5)',
        'card-hover':'0 8px 40px rgba(0, 0, 0, 0.6)',
        'inner-glow':'inset 0 0 30px rgba(79, 110, 247, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow':       'radial-gradient(ellipse at 60% 0%, rgba(79,110,247,0.18) 0%, transparent 70%)',
        'card-gradient':   'linear-gradient(135deg, rgba(21,32,53,1) 0%, rgba(26,40,69,1) 100%)',
      },
    },
  },
  plugins: [],
};
