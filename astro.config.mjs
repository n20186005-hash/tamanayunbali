import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Isi domain produksi hanya pada konstanta SITE di bawah.
// Bila diisi, canonical / Open Graph URL absolut, hreflang, dan sitemap otomatis terbit.
const SITE = 'https://tamanayunbali.com';

export default defineConfig({
  site: SITE || undefined,
  integrations: SITE ? [sitemap({ filter: (page) => !page.endsWith("/404/") })] : [],
  vite: {
    plugins: [tailwindcss()],
  },
});
