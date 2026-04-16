import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import { rehypeExternalLinks } from './src/plugins/rehype-external-links.mjs';

export default defineConfig({
  site: 'https://regisrolnin.com',
  integrations: [
    tailwind(),
    sitemap(),
  ],
  markdown: {
    rehypePlugins: [rehypeExternalLinks],
  },
});
