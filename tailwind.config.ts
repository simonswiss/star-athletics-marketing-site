import type { Config } from 'tailwindcss'
import typographyPlugin from '@tailwindcss/typography'

const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {},
  plugins: [typographyPlugin],
} satisfies Config

export default config
