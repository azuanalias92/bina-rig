export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // Health check endpoint only (avoid intercepting the site root)
    if (url.pathname === "/_health") {
      return new Response("BinaRig Worker: OK", {
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }

    // Proxy all other requests to the origin so your real site renders
    return fetch(request);
  },
};