import { serve } from "https://deno.land/std/http/mod.ts";

serve(
  async (req: Request) => {
    const url = new URL(req.url);
    const params = url.searchParams;

    const urlParam = params.get("url");
    if (!urlParam) return new Response("");

    const proxyRes = await fetch(urlParam);
    return proxyRes;
  },
  { port: import.meta.env?.PROD ? undefined : 8000 }
);
