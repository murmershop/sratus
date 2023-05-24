import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import image from "@astrojs/image";
import partytown from "@astrojs/partytown";
import prefetch from "@astrojs/prefetch";
import compress from "astro-compress";
import mdx from "@astrojs/mdx";
import critters from "astro-critters";
import config from "./web.config.json";

// https://astro.build/config
export default defineConfig({
  site: config.site,
  vite: {
    build: {
      rollupOptions: {
        output: {
          assetFileNames: "assets/[hash][extname]",
        },
      },
    },
  },
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
          const proxyUrl = new URL("https://murmershop-proxy.deno.dev/");
          if (type !== "script" || url.host.includes(proxyUrl.host)) return url;
          proxyUrl.searchParams.append("url", url.href);
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
    critters({
      path: [
        // inline dist
        "./dist",

        // inline dist one more time into a different directory
        new Map([["./dist", "./dist-inlined"]]),
      ],
    }),
  ],
});
