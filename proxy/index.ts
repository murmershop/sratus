import { serve } from "https://deno.land/std/http/mod.ts";

serve(async (req: Request) => {
  const url = new URL(req.url);
  const params = url.searchParams;

  const urlParam = params.get("url");
  if (!urlParam) return new Response("");

  try {
    const decodedUrl = decodeURIComponent(urlParam);
    console.log("request to %s", decodedUrl);
    const proxyRes = await fetch(decodedUrl);
    return new Response(proxyRes.body, {
      headers: new Headers({
        "Access-Control-Allow-Origin": "*",
        accept: "text/plain",
      }),
    });
  } catch (err) {
    console.error(err);
    return new Response("Error fetching " + urlParam);
  }
});
