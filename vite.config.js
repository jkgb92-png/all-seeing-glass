import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // REQUIRED: must match the GitHub Pages sub-path for this repository.
  // Changing this will break ALL asset and favicon references on the live site.
  // The repo is served at https://jkgb92-png.github.io/all-seeing-glass/
  // so base must be '/all-seeing-glass/'.
  base: '/all-seeing-glass/',
  server: { 
    port: 3000, 
    open: true 
  }
})
