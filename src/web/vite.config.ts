import { defineConfig } from 'vite';

export default defineConfig({
    base: '/dashboard/',
    build: {
        outDir: './../../out/web/',
        emptyOutDir: true,
    },
});
