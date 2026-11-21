import { existsSync } from 'node:fs'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const root = import.meta.dirname

// https://vite.dev/config/
export default defineConfig({
  // Relative asset paths: the build works at a domain root or under a sub-path.
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(root, './src') },
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    // Pre-bundle every runtime dependency in one pass, so the dev server never
    // discovers one late and ends up with two copies of React ("Invalid hook call").
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'motion/react',
      'lucide-react',
      '@radix-ui/react-dialog',
      'cmdk',
      'sonner',
      'lenis',
      'gsap',
      'gsap/ScrollTrigger',
      'ogl',
      'cn',
    ],
  },
  build: {
    target: 'es2022',
    rollupOptions: {
      // Two pages from one data file: the site and the printable résumé.
      input: {
        main: path.resolve(root, 'index.html'),
        resume: path.resolve(root, 'resume.html'),
      },
    },
  },
  define: {
    // Download buttons only render when public/resume.pdf exists at build time.
    __HAS_RESUME__: JSON.stringify(existsSync(path.resolve(root, 'public/resume.pdf'))),
  },
})
