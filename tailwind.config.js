/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#050505',
          800: '#0D0809',
          700: '#1d090b',
          600: '#2a0c10',
          500: '#3a0e14',
        },
        // Remapped gold→red so all existing text-gold-*, bg-gold-*, border-gold-* classes
        // automatically render in the new crimson theme without editing every page.
        gold: {
          100: '#ffeded',
          200: '#ffcccc',
          300: '#ff8a8e',
          400: '#ff4c53',
          500: '#FF1018',
          600: '#d90d17',
          700: '#65090D',
        },
        crimson: {
          300: '#ff4c53',
          400: '#ff2630',
          500: '#FF1018',
          600: '#d90d17',
          700: '#65090D',
        },
        ice: {
          400: '#5b8def',
          500: '#3b6fd6',
        },
      },
      fontFamily: {
        persian: ['Vazirmatn', 'Tahoma', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(255, 16, 24, 0.35)',
        'gold-glow-lg': '0 0 40px rgba(255, 16, 24, 0.45)',
        'cinematic': '0 20px 60px rgba(0, 0, 0, 0.7)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 16, 24, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 16, 24, 0.55)' },
        },
        'card-flip-in': {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        'card-flip-out': {
          '0%': { transform: 'rotateY(180deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'card-flip-in': 'card-flip-in 0.6s ease-in-out',
        'card-flip-out': 'card-flip-out 0.6s ease-in-out',
      },
    },
  },
  plugins: [],
}
