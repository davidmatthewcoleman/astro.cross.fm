import { defineConfig } from 'astro/config';
import vercel from "@astrojs/vercel/serverless";

import react from "@astrojs/react";

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  output: 'hybrid',
  adapter: vercel(),
  experimental: {
    contentCollectionCache: true
  },
  integrations: [react(), tailwind()]
});