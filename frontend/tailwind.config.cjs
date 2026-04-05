/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        coral: {
          50: '#FFF5F2',
          100: '#FFE8E0',
          200: '#FFD0C2',
          300: '#FFB09A',
          400: '#FF8B6B',
          500: '#FF6B4E',
          600: '#E8573A',
          700: '#CC4429',
          800: '#A33620',
          900: '#7A2918',
        },
        ink: '#111827',
        muted: '#6B7280',
        surface: '#F9FAFB',
        card: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
