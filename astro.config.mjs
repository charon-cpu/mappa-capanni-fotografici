// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // TODO: aggiornare con l'URL reale assegnato da Render (o il dominio custom, se scelto in seguito)
  site: 'https://mappa-capanni-fotografici.onrender.com',
  integrations: [sitemap()],
});
