import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import image from "@astrojs/image";
import partytown from "@astrojs/partytown";
import prefetch from "@astrojs/prefetch";

import compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
  site: "https://murmer.shop",
  integrations: [
    tailwind(),
    react(),
    sitemap(),
    image({
      serviceEntryPoint: "@astrojs/image/sharp",
    }),
    partytown(),
    prefetch(),
    compress({
      html: true,
      css: true,
      js: true,
    }),
  ],
});
