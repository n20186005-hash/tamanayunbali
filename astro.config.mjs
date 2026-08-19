import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Isi domain produksi hanya pada konstanta SITE di bawah.
// Biarkan kosong selama domain belum ditetapkan. Build tetap valid tanpa URL placeholder.
const SITE = '';

export default defineConfig({
  site: SITE || undefined,
  integrations: SITE ? [sitemap()] : [],
  vite: {
    plugins: [tailwindcss()],
  },
});
