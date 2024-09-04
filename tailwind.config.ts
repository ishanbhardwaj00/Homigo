import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        slideRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        slideRight: 'slideRight 0.5s ease-out',
      },

      textShadow: {
        outline:
          '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'custom-pattern': "url('/images/bg-svg.svg')",
        step1: "url('/images/register-svg.svg')",
        step2: "url('/images/step2.svg')",
      },
      colors: {
        primary: {
          DEFAULT: '#232beb',
          light: '#232beb',
        },
        button: {
          primary: {
            DEFAULT: '#a7ebcf',
          },
          radio: {
            DEFAULT: '#EBEBEB',
          },
        },
      },
    },
  },
  plugins: [],
}
export default config
