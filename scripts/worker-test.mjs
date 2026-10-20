import assert from 'node:assert/strict';
import worker from '../src/worker.ts';
let calls = 0;
const env = { ASSETS: { async fetch(request) { calls++; return new Response('asset', { status: new URL(request.url).pathname === '/missing/' ? 404 : 200 }); } } };
for (const origin of ['http://tamanayunbali.com', 'http://www.tamanayunbali.com', 'https://www.tamanayunbali.com']) {
  const response = await worker.fetch(new Request(origin + '/visit/?x=1'), env);
  assert.equal(response.status, 301);
  assert.equal(response.headers.get('location'), 'https://tamanayunbali.com/visit/?x=1');
}
assert.equal(calls, 0);
const found = await worker.fetch(new Request('https://tamanayunbali.com/'), env);
assert.equal(found.status, 200);
const missing = await worker.fetch(new Request('https://tamanayunbali.com/missing/'), env);
assert.equal(missing.status, 404);
assert.equal(missing.headers.get('X-Robots-Tag'), 'noindex, follow');
assert.equal(await missing.text(), 'asset');
console.log('Worker: canonical redirects, ASSETS delegation, and preserved 404 passed.');
