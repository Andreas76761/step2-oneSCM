import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';

const version = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version as string;

export default defineConfig({
  plugins: [react()],
  define: { __APP_VERSION__: JSON.stringify(version) },
  server: { port: 5173, proxy: { '/api': 'http://localhost:3000', '/openapi.yaml': 'http://localhost:3000' } },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 600,
    // React und Router ändern sich selten: eigener Chunk bleibt über App-Updates im Browser-Cache
    rollupOptions: { output: { manualChunks: { vendor: ['react', 'react-dom', 'react-dom/client', 'react-router-dom'] } } },
  },
});
