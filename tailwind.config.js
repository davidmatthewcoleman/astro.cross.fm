const { scopedPreflightStyles, isolateInsideOfContainer } = require('tailwindcss-scoped-preflight');
const plugin = require("tailwindcss");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx,astro}',
    './components/**/*.{js,jsx,astro}',
    './components/ui/*.{js,jsx,astro}',
    './app/**/*.{js,jsx,astro}',
    './src/**/*.{js,jsx,astro}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontSize: {
        xxs: "0.675rem",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        completePulse: {
          "0%": {
            opacity: 1,
          },
          "50%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
        subtlePulse: {
          '0%': { transform: 'scale(1)', opacity: '0' },
          '25%': { opacity: '0.25' },
          '50%': { transform: 'scale(2.75)', opacity: '0' },
          '75%': { opacity: '0' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: 'shimmer 4s infinite',
        completePulse: "completePulse ease-in-out 2.5s infinite",
        subtlePulse: 'subtlePulse ease-in-out 4.5s 3s infinite',
      },
      backgroundImage: {
        'gradient-skeleton': `linear-gradient(90deg, transparent 600px, white 50%, transparent calc(100% - 600px))`
      },
      screens: {
        break: '960px',
        'break-sm': '720px'
      }
    },
  },
  plugins: [
      require("tailwindcss-animate"),
      scopedPreflightStyles({
        isolationStrategy: isolateInsideOfContainer([".tw-app", "#tw-app"]),
      }),
      plugin(function ({ addVariant, e }) {
        addVariant('duo', ({ modifySelectors, separator }) => {
          modifySelectors(({ className }) => {
            return `.${e(`duo${separator}${className}`)} .duo`;
          });
        });
        addVariant('duo-front', ({ modifySelectors, separator }) => {
          modifySelectors(({ className }) => {
            return `.${e(`duo-front${separator}${className}`)} .duo-front`;
          });
        });
        addVariant('duo-back', ({ modifySelectors, separator }) => {
          modifySelectors(({ className }) => {
            return `.${e(`duo-back${separator}${className}`)} .duo-back`;
          });
        });
      }),
  ],
}