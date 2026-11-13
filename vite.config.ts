import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['manifest.json', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'Arcade_Mafia',
        short_name: 'Mafia',
        description: 'مدیریت حرفه‌ای بازی مافیا',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0a0e1a',
        theme_color: '#0a0e1a',
        lang: 'fa',
        dir: 'rtl',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Don't cache Supabase API requests or Google Fonts
        navigateFallbackDenylist: [/^https:\/\/.*\.supabase\.co\//, /^https:\/\/fonts\.(googleapis|gstatic)\.com\//],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
          {
            // Cache Supabase storage images for offline use
            urlPattern: /^https:\/\/.*\.supabase\.co\/storage\/v1\/object\/public\//i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'supabase-images',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})
