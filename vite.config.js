import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/pwa_FRM_Book2_python/',
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
    hmr: {
      host: 'localhost'
    }
  },
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      includeAssets: ['icons/*.png', 'icons/*.jpg'],
      manifest: {
        name: 'pwa_實戰篇_手術刀般精準的FRM用Python科學管控財金風險',
        short_name: 'FRM_Python_實戰篇',
        description: '手術刀般精準的 FRM 用 Python 科學管控財金風險 - 互動式學習 (實戰篇)',
        theme_color: '#1e40af',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'any',
        scope: '/pwa_FRM_Book2_python/',
        start_url: '/pwa_FRM_Book2_python/',
        icons: [
          {
            src: 'icons/icon-72x72.png',
            sizes: '72x72',
            type: 'image/png'
          },
          {
            src: 'icons/icon-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          },
          {
            src: 'icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'icons/icon-144x144.png',
            sizes: '144x144',
            type: 'image/png'
          },
          {
            src: 'icons/icon-152x152.png',
            sizes: '152x152',
            type: 'image/png'
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,wasm,zip,json,whl}'],
        maximumFileSizeToCacheInBytes: 50 * 1024 * 1024 // 50MB for Pyodide assets
      }
    })
  ],
  build: {
    cssCodeSplit: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      external: [
        'node:url',
        'node:fs',
        'node:fs/promises',
        'node:vm',
        'node:path',
        'node:crypto',
        'node:child_process'
      ],
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'vendor-react';
            }
            if (id.includes('@monaco-editor') || id.includes('monaco-editor')) {
              return 'vendor-monaco';
            }
            if (id.includes('pyodide') || id.includes('localforage')) {
              return 'vendor-pyodide';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('katex') || id.includes('marked-katex-extension')) {
              return 'vendor-katex';
            }
            if (id.includes('marked') || id.includes('dompurify') || id.includes('react-syntax-highlighter')) {
              return 'vendor-utils';
            }
            return 'vendor';
          }
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['pyodide']
  }
})
