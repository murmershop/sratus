export default async (req: Request) => {
  const url = new URL(req.url);
  const params = url.searchParams;

  const urlParam = params.get("url");
  if (!urlParam) return new Response("");

  const proxyRes = await fetch(urlParam);
  return proxyRes;
};
