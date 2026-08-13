import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Deployed to GitHub Pages as a *project* page (mahesh-cuber24.github.io/my-portfolio/),
// so every asset URL has to be prefixed with the repo name.
export default defineConfig({
  base: '/my-portfolio/',
  plugins: [react(), tailwindcss()],
});
