import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Use the repo sub-path in production (GitHub Pages) but root in dev to avoid 404s
  base: process.env.NODE_ENV === 'production' ? '/all-seeing-glass/' : '/',
  server: { port: 3000, open: true }
})
