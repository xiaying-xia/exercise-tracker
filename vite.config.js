import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

const base =
  process.env.GITHUB_PAGES === 'true'
    ? process.env.GITHUB_PAGES_BASE || '/exercise-tracker/'
    : '/'

export default defineConfig({
  base,
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    open: 'http://localhost:5173/',
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true,
    open: 'http://localhost:4173/',
  },
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: '运动打卡',
        short_name: '运动打卡',
        description: '记录每日运动，本地保存',
        theme_color: '#0d9488',
        background_color: '#f0fdfa',
        display: 'standalone',
        orientation: 'portrait',
        lang: 'zh-CN',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,ico}'],
      },
    }),
  ],
})
