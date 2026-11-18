import { existsSync } from 'node:fs'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const root = import.meta.dirname

// https://vite.dev/config/
export default defineConfig({
  // Relative asset paths, so the build works at a domain root and under a
  // sub-path such as https://<user>.github.io/portfolio/ without changes.
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(root, './src') },
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    // Pre-bundle everything in a single pass so the dev server never ends up
    // with two copies of React after discovering a dependency late.
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'motion/react',
      'lucide-react',
      '@radix-ui/react-slot',
      '@radix-ui/react-dialog',
      'cmdk',
      'sonner',
      'lenis',
      'cobe',
      'simple-icons',
      'class-variance-authority',
      'cn',
    ],
  },
  define: {
    // The résumé button only renders when public/resume.pdf actually exists.
    __HAS_RESUME__: JSON.stringify(existsSync(path.resolve(root, 'public/resume.pdf'))),
  },
})
