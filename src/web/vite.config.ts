import { defineConfig } from "vite";

export default defineConfig({
    build: {
        outDir: './../../out/web/',
        emptyOutDir: true
    },
    base: "/gui/"
});