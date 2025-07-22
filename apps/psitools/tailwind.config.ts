import { fontFamily } from 'tailwindcss/defaultTheme';
import colors from 'tailwindcss/colors';
import { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontSize: {
        sm: ['var(--fs-sm)', '1.25rem'],
        base: ['var(--fs-base)', '1.5rem'],
        lg: ['var(--fs-lg)', '1.75rem'],
        xl: ['var(--fs-xl)', '1.75em'],
      },

      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          600: 'hsl(var(--primary-600))',
          500: 'hsl(var(--primary-500))',
          400: 'hsl(var(--primary-400))',
          300: 'hsl(var(--primary-300))',
          200: 'hsl(var(--primary-200))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        transparent: 'transparent',
        current: 'currentColor',
        gray: {
          10: '#FAFAFA',
          20: '#DCE4E6',
          30: '#C4CaCC',
          ...colors.gray,
        },
        'forest-green': {
          700: '#2D7C35',
          600: '#57965D',
          500: '#76AA7C',
          400: '#96BD9A',
          300: '#B5D1B8',
          200: '#CADECC',
        },
        'darkest-blue': '#0E2210',
        'space-gray': '#1C1E33',
      },
      height: ({ theme }) => ({
        'full-safe': `calc(100svh - var(--header-height))`,
      }),
      width: ({ theme }) => ({
        fill: 'fill-available',
        'webkit-fill': '-webkit-fill-available',
        'moz-fill': '-moz-available',
      }),
      minHeight: ({ theme }) => ({
        'screen-safe': `calc(100dvh - ${theme('spacing.6')} - ${theme(
          'spacing.16',
        )})`,
      }),
      fontFamily: {
        rubik: ['var(--ff-rubik)', ...fontFamily.sans],
        poppins: ['var(--ff-poppins)', ...fontFamily.sans],
      },
      maxWidth: ({ theme }) => ({
        6: theme('spacing.6'),
      }),
      gridTemplateColumns: ({ theme }) => ({
        sidebar: `${theme('spacing.64')} 1fr`,
        'sidebar-collapse': `${theme('spacing.16')} 1fr`,
      }),
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'slide-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },
        'slide-up': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: '0' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        fadein: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        shimmering: {
          from: { backgroundPosition: 'top right' },
          to: { backgroundPosition: 'top left' },
        },
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        },
      },
      animation: {
        'slide-down': 'slide-down 0.25s ease-out',
        'slide-up': 'slide-up 0.25s ease-out',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shimmering:
          'shimmering forwards infinite ease-in-out, fadein 0.02s forwards',
        shake: 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both',
        'fade-in': 'fadein 0.5s ease-in-out',
        'fade-out': 'fadein 0.5s ease-in-out reverse',
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    require('tailwindcss-animate'),
    require('./tailwindcss-color-extractor.cjs'),

    plugin(function ({ addUtilities }) {
      addUtilities({
        '.no-scrollbar': {
          scrollbarWidth: 'none',
          '-ms-overflow-style': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      });
    }),
  ],
};

export default config;
