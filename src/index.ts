export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // Simple health route
    if (url.pathname === "/" || url.pathname === "/health") {
      return new Response("BinaRig Worker: OK", {
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }

    // Echo path for demonstration
    return new Response(JSON.stringify({ path: url.pathname }), {
      headers: { "content-type": "application/json" },
    });
  },
};