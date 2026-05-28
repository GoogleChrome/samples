import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    port: 3000,
    open: false
  },
  build: {
    target: 'esnext'
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
