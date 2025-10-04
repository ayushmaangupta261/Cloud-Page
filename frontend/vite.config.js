import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    port: 3000,
    host: true
  },
  resolve: {
    alias: {
      '@component': path.resolve(__dirname, './src/component') // points to your component folder
    }
  }
});
