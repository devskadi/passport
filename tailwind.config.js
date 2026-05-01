/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        coral: {
          DEFAULT: '#FF6B4A',
          dark: '#E84A2A',
          soft: 'rgba(255,107,74,0.12)'
        },
        turquoise: {
          DEFAULT: '#0DB5A6',
          dark: '#008B7E',
          soft: 'rgba(13,181,166,0.12)'
        },
        yellow: {
          DEFAULT: '#FFC93C',
          dark: '#E5A800',
          soft: 'rgba(255,201,60,0.18)'
        },
        pink: {
          DEFAULT: '#FF3D7F',
          dark: '#D6225E',
          soft: 'rgba(255,61,127,0.12)'
        },
        cream: {
          DEFAULT: '#FFF8EC',
          warm: '#FFF1DD'
        },
        ink: {
          DEFAULT: '#1A1A2E',
          soft: '#4A4A5E',
          mute: '#8A8AA0'
        }
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        hand: ['Caveat', 'cursive']
      }
    }
  },
  plugins: []
};
