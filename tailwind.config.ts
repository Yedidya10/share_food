import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    // הוסף כאן נתיבים נוספים במידת הצורך
  ],
  theme: {
    extend: {
      height: {
        // עכשיו אפשר להשתמש ב-h-[100dvh] וכו'
        'screen-dvh': '100dvh',
        'screen-svh': '100svh',
        'screen-lvh': '100lvh',
      },
      minHeight: {
        'screen-dvh': '100dvh',
        'screen-svh': '100svh',
        'screen-lvh': '100lvh',
      },
    },
  },
  plugins: [],
}

export default config
