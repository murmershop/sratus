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
        forward: ["dataLayer.push"],
        resolveUrl(url, location, type) {
          if (type !== "script") return url;
          const proxyUrl = new URL("https://murmershop-proxy.deno.dev/");
          const reqUrl = new URL(url.href);
          const urlParam = reqUrl.searchParams.get("url");
          proxyUrl.searchParams.append("url", urlParam);
          return proxyUrl;
        },
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
