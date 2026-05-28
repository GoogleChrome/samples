import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    port: 3000,
    open: false
  },
  build: {
    target: 'esnext',
    modulePreload: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('preload-helper')) {
            return 'vite-preload-helper';
          }
        }
      }
    }
  },
  optimizeDeps: {
    exclude: [
      'built-in-ai-task-apis-polyfills',
      '@huggingface/transformers'
    ],
    esbuildOptions: {
      target: 'esnext'
    }
  }
});
