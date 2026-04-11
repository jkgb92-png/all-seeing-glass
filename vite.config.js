import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Setting base to './' ensures assets are loaded relative to the index.html,
  // which fixes most 404 errors regardless of the environment.
  base: './',
  server: { 
    port: 3000, 
    open: true 
  }
})
