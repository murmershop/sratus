export default async (req: Request) => {
  const url = new URL(req.url);
  const params = url.searchParams;

  const urlParam = params.get("url");
  if (!urlParam) return new Response("");

  try {
    const decodedUrl = decodeURIComponent(urlParam);
    console.log("request to %s", decodedUrl);
    const proxyRes = await fetch(decodedUrl);
    return proxyRes;
  } catch (err) {
    console.error(err);
    return new Response("Error fetching " + urlParam);
  }
};
