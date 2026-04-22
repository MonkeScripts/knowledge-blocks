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
        'block-nvidia-cuvslam': resolve(root, 'blocks/nvidia-cuvslam.html'),
        'block-orb-slam3': resolve(root, 'blocks/orb-slam3.html'),
        'block-mit-kimera': resolve(root, 'blocks/mit-kimera.html'),
        'block-imu-preintegration': resolve(root, 'blocks/imu-preintegration.html'),
        'block-factor-graphs': resolve(root, 'blocks/factor-graphs.html'),
        'block-dynamic-scene-graphs': resolve(root, 'blocks/dynamic-scene-graphs.html'),
        'block-bundle-adjustment': resolve(root, 'blocks/bundle-adjustment.html'),
        'block-loop-closure': resolve(root, 'blocks/loop-closure.html'),
        'block-visual-features': resolve(root, 'blocks/visual-features.html'),
        'block-pose-graph-optimization': resolve(root, 'blocks/pose-graph-optimization.html'),
        'block-semantic-mapping': resolve(root, 'blocks/semantic-mapping.html'),
        'block-mesh-reconstruction': resolve(root, 'blocks/mesh-reconstruction.html'),
        'block-multi-robot-slam': resolve(root, 'blocks/multi-robot-slam.html'),
        'block-stereo-vision': resolve(root, 'blocks/stereo-vision.html'),
        'block-robust-optimization': resolve(root, 'blocks/robust-optimization.html'),
      }
    }
  }
})
