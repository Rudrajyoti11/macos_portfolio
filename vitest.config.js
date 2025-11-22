import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/__tests__/setup/setupTests.js',
    css: true,
  },
  resolve: {
    alias: {
      '#components': path.resolve(__dirname, './src/components'),
      '#constants': path.resolve(__dirname, './src/constants'),
      '#store': path.resolve(__dirname, './src/store'),
      '#windows': path.resolve(__dirname, './src/windows'),
      '#hoc': path.resolve(__dirname, './src/hoc'),
    },
  },
});