import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative asset paths so the build works whether it's served from a
  // domain root, a GitHub Pages project subpath, or opened from disk.
  base: './',
})
