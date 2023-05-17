import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import image from "@astrojs/image";
import partytown from "@astrojs/partytown";
import prefetch from "@astrojs/prefetch";
import compress from "astro-compress";
import mdx from "@astrojs/mdx";

import config from "./web.config.json";

// https://astro.build/config
export default defineConfig({
  site: config.site,
  integrations: [
    tailwind(),
    react(),
    sitemap(),
    image({
      serviceEntryPoint: "@astrojs/image/sharp",
    }),
    partytown({
      config: {
        resolveUrl: function (url, location, type) {
          if (type === "script") {
            var proxyUrl = new URL(config.site);
            proxyUrl.searchParams.append("url", url.href);
            return proxyUrl;
          }

          return url;
        },
        forward: ["dataLayer.push"],
      },
    }),
    prefetch(),
    mdx(),
    compress({
      html: true,
      css: true,
      js: true,
    }),
  ],
});
