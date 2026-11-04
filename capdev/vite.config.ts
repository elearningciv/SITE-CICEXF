import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// VITE_DEMO=1 builds a server-free demonstration in one script (published as a preview page)
const demo = process.env.VITE_DEMO === '1';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: demo ? 'dist-demo' : 'dist',
    chunkSizeWarningLimit: 900,
    cssCodeSplit: !demo,
    rollupOptions: demo ? { output: { inlineDynamicImports: true } } : undefined
  }
});
