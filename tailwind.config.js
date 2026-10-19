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
        studio: {
          bg: '#141417',
          panel: '#1E1E24',
          subpanel: '#282830',
          border: '#33333E',
          accent: '#FF3366', // InVision iconic pink/red brand color!
          accentHover: '#E02956',
          cyan: '#00D2FF',
          purple: '#7928CA',
          text: '#ECECF1',
          muted: '#8E8EA0',
          hover: '#2E2E38'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
