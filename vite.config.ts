import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('three') || id.includes('@react-three')) {
            return 'three-vendor';
          }
          if (id.includes('recharts') || id.includes('d3-')) {
            return 'charts-vendor';
          }
          if (id.includes('lucide-react') || id.includes('framer-motion')) {
            return 'ui-vendor';
          }
        },
      },
    },
  },
});
