import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    base: './', // Crucial for Electron to find assets
    build: {
        outDir: 'dist/renderer',
    },
});
