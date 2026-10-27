import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'

const base = process.env.GITHUB_ACTIONS === 'true' ? '/Reddirector_portfolio/' : '/'

function generateSpaRoutes() {
  const routes = [
    'projects/orchestration-engine',
    'projects/sae-reproduction',
    'projects/pentagon',
  ]
  return {
    name: 'generate-spa-routes',
    closeBundle() {
      const distDir = path.resolve(process.cwd(), 'dist')
      const indexHtmlPath = path.join(distDir, 'index.html')
      if (!fs.existsSync(indexHtmlPath)) return

      const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8')

      // 1. Generate 404.html for GitHub Pages fallback
      fs.writeFileSync(path.join(distDir, '404.html'), indexHtml, 'utf-8')

      // 2. Generate static HTML files for direct routes so refreshes return 200 OK
      for (const route of routes) {
        const routeDir = path.join(distDir, route)
        fs.mkdirSync(routeDir, { recursive: true })
        fs.writeFileSync(path.join(routeDir, 'index.html'), indexHtml, 'utf-8')
      }
    },
  }
}

export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), generateSpaRoutes()],
  build: {
    rollupOptions: {
      output: {
        // Vendor code changes rarely; splitting it lets repeat visitors reuse
        // the cached chunks even after app-only deploys. (Rolldown/Vite 8
        // requires the function form of manualChunks.)
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('gsap')) return 'gsap'
          if (id.includes('barba')) return 'barba'
          if (id.includes('react') || id.includes('scheduler')) return 'react'
          return undefined
        },
      },
    },
  },
})
