/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0f172a',
        sidebar: '#1e293b',
        card: 'rgba(30, 41, 59, 0.7)',
        primaryText: '#f8fafc',
        secondaryText: '#94a3b8',
        primary: '#3b82f6',
        primaryHover: '#2563eb',
        secondary: '#8b5cf6',
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        borderC: 'rgba(255, 255, 255, 0.1)',
      }
    },
  },
  plugins: [],
}
