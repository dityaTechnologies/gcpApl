/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0a0e1a',
          900: '#0f1525',
          800: '#1a1f35',
          700: '#242940',
          600: '#2e3450',
        },
        teal: {
          400: '#2dd4bf',
          500: '#00d4aa',
          600: '#00b899',
        },
        purple: {
          500: '#7c5cfc',
          600: '#6b4ef0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #00d4aa, #7c5cfc)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-in': 'bounceIn 0.4s ease-out',
        'shake': 'shake 0.4s ease-out',
        'confetti-fall': 'confettiFall 1s ease-out forwards',
        'pulse-ring': 'pulseRing 1s linear infinite',
        'spin-slow': 'spin 1.5s linear infinite',
        'slide-down': 'slideDown 0.3s ease-out',
        'coin-pop': 'coinPop 0.5s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        bounceIn: { '0%': { transform: 'scale(0.8)', opacity: '0' }, '60%': { transform: 'scale(1.1)' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        shake: { '0%,100%': { transform: 'translateX(0)' }, '20%': { transform: 'translateX(-8px)' }, '40%': { transform: 'translateX(8px)' }, '60%': { transform: 'translateX(-4px)' }, '80%': { transform: 'translateX(4px)' } },
        confettiFall: { '0%': { transform: 'translateY(-20px) rotate(0deg)', opacity: '1' }, '100%': { transform: 'translateY(80px) rotate(360deg)', opacity: '0' } },
        pulseRing: { '0%': { strokeDashoffset: '0' }, '100%': { strokeDashoffset: '-100' } },
        slideDown: { from: { opacity: '0', transform: 'translateY(-16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        coinPop: { '0%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.4)' }, '100%': { transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
};
