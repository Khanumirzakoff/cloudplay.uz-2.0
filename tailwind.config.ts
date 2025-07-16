import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import Color from 'color';

export default {
  content: [
    './index.html',
    './{src,components}/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#00F5FF',
        'secondary': '#FF00C1',
        'background': '#0A0A10',
        'surface': '#1A1A24',
        'glow': 'rgba(0, 245, 255, 0.5)',
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        orbitron: ['"Orbitron"', 'sans-serif'],
      },
      boxShadow: {
        'glow-primary': '0 0 15px 5px rgba(0, 245, 255, 0.3)',
        'glow-secondary': '0 0 15px 5px rgba(255, 0, 193, 0.3)',
      },
      animation: {
        'aurora': 'aurora 20s ease-in-out infinite',
        'glow': 'glow 1.5s ease-in-out infinite alternate',
      },
      keyframes: {
        aurora: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        glow: {
          'from': { textShadow: '0 0 5px #00F5FF, 0 0 10px #00F5FF, 0 0 15px #00F5FF' },
          'to': { textShadow: '0 0 10px #00F5FF, 0 0 20px #00F5FF, 0 0 30px #00F5FF' },
        }
      },
      backgroundImage: {
        'hero-pattern': "url('/img/hero-bg.svg')",
        'wall-pattern': "url('/img/wall-bg.svg')",
      },
    },
  },
  plugins: [
    require('tailwindcss-gradients'),
    plugin(function({ addUtilities, theme }) {
      const colors = theme('colors');
      const newUtilities = {};
      for (const color in colors) {
        if (typeof colors[color] === 'object') {
          const color1 = colors[color][500] || colors[color];
          const color2 = colors[color][700] || colors[color];
          newUtilities[`.bg-glow-${color}`] = {
            boxShadow: `0 0 15px 5px ${Color(color1).alpha(0.3).string()}`
          };
        }
      }
      addUtilities(newUtilities, ['responsive', 'hover']);
    })
  ],
} satisfies Config;
