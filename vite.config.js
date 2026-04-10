import { defineConfig } from 'vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: './',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        'block-example': resolve(root, 'blocks/example.html'),
        'block-docker': resolve(root, 'blocks/docker.html'),
        'block-kubernetes': resolve(root, 'blocks/kubernetes.html'),
        'block-ci-cd': resolve(root, 'blocks/ci-cd.html'),
      }
    }
  }
})
