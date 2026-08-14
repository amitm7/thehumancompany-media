import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';
import keystatic from '@keystatic/astro';

// Hybrid output: the site is static/prerendered, but the Keystatic
// admin panel (/keystatic) runs as a small server route.
export default defineConfig({
  output: 'hybrid',
  adapter: node({ mode: 'standalone' }),
  integrations: [react(), keystatic()],
});
