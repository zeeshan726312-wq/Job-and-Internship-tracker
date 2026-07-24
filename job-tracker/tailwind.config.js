/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        bg: '#090d16',
        sidebar: '#0f172a',
        card: 'rgba(15, 23, 42, 0.75)',
        primaryText: '#f8fafc',
        secondaryText: '#94a3b8',
        primary: '#6366f1',
        primaryHover: '#4f46e5',
        secondary: '#a855f7',
        success: '#10b981',
        danger: '#f43f5e',
        warning: '#f59e0b',
        borderC: 'rgba(255, 255, 255, 0.08)',
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(99, 102, 241, 0.25)',
        'glow-md': '0 0 25px -5px rgba(99, 102, 241, 0.35)',
        'glow-lg': '0 0 40px -10px rgba(99, 102, 241, 0.45)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
}
