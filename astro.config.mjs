import { defineConfig } from 'astro/config';
import vercel from "@astrojs/vercel";

import react from "@astrojs/react";

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: cloudflare(),
  integrations: [react(), tailwind()],
  site: 'https://crossrambles.com'
});