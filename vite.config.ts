import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg}'],
        importScripts: ['push-handler.js'],
        // photos of recipes found online are kept after the first view, so saved ones work offline
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/www\.themealdb\.com\/images\//,
            handler: 'CacheFirst',
            options: { cacheName: 'web-recipe-photos', expiration: { maxEntries: 300 }, cacheableResponse: { statuses: [0, 200] } },
          },
        ],
      },
      includeAssets: ['icons/apple-touch-icon.png'],
      manifest: {
        name: 'Fuel & Form',
        short_name: 'Fuel & Form',
        description: 'Easy meals, workouts and progress — all in one place.',
        theme_color: '#faf5ec',
        background_color: '#faf5ec',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        scope: './',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
