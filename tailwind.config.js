/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkBg: '#0b0f19',
        darkCard: '#151c2c',
        darkBorder: '#222f47',
        techCyan: '#00f0ff',
        techGreen: '#00ff66',
        techPurple: '#bd00ff',
      },
      boxShadow: {
        neonCyan: '0 0 15px rgba(0, 240, 255, 0.3)',
        neonGreen: '0 0 15px rgba(0, 255, 102, 0.3)',
        neonPurple: '0 0 15px rgba(189, 0, 255, 0.3)',
      }
    },
  },
  plugins: [],
}
