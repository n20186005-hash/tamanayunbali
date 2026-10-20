const canonicalHost = 'tamanayunbali.com';

type Env = { ASSETS: { fetch: (request: Request) => Promise<Response> } };

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    if (
      (url.hostname === canonicalHost || url.hostname === `www.${canonicalHost}`) &&
      (url.protocol !== 'https:' || url.hostname !== canonicalHost)
    ) {
      url.protocol = 'https:';
      url.hostname = canonicalHost;
      url.port = '';
      return Response.redirect(url.toString(), 301);
    }
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return response;
    const headers = new Headers(response.headers);
    headers.set('X-Robots-Tag', 'noindex, follow');
    return new Response(response.body, { status: 404, statusText: response.statusText, headers });
  },
};
