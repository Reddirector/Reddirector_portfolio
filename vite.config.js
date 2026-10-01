import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const base = process.env.GITHUB_ACTIONS === 'true' ? '/Reddirector_portfolio/' : '/'

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Vendor code changes rarely; splitting it lets repeat visitors reuse
        // the cached chunks even after app-only deploys. (Rolldown/Vite 8
        // requires the function form of manualChunks.)
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('gsap')) return 'gsap'
          if (id.includes('react') || id.includes('scheduler')) return 'react'
          return undefined
        },
      },
    },
  },
})
