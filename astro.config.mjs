import { defineConfig } from 'astro/config';
import vercel from "@astrojs/vercel";

import react from "@astrojs/react";

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: vercel(),
  integrations: [react(), tailwind()],
  site: 'https://crossrambles.com',
  vite: {
    build: {
      rollupOptions: {
        external: [/.*\/page\/1\/.*/], // Regex to exclude paths containing `page/1`
      },
    },
  },
});