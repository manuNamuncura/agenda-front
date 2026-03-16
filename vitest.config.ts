/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Permite usar 'describe', 'it', 'expect' sin importarlos
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts', // Archivo para configurar extensiones
    include: ['src/**/*.{test,spec}.{ts,tsx}'], // Dónde buscar los tests
  },
});