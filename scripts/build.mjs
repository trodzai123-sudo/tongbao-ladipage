import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');
const configuredUrl = process.env.SITE_URL?.trim();
let origin;
if (configuredUrl) {
  const parsed = new URL(configuredUrl);
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.search || parsed.hash || parsed.pathname !== '/') {
    throw new Error('SITE_URL must be a public HTTPS origin, e.g. https://your-project.pages.dev');
  }
  origin = parsed.origin;
}
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const entry of ['assets', '_headers', 'favicon-32.png', 'favicon.ico', '404.html']) {
  await cp(path.join(root, entry), path.join(output, entry), { recursive: true });
}
let html = await readFile(path.join(root, 'index.html'), 'utf8');
const tags = [];
if (origin) {
  tags.push(`<link rel="canonical" href="${origin}/">`, `<meta property="og:url" content="${origin}/">`);
  html = html.replace('content="assets/images/catalog-products/eb-plus-tongbao-v2.webp"', `content="${origin}/assets/images/catalog-products/eb-plus-tongbao-v2.webp"`);
  const organization = { '@context': 'https://schema.org', '@type': 'Organization', name: 'TONGBAO Việt Nam', url: `${origin}/`, logo: `${origin}/assets/images/brand/logo.webp`, telephone: '+84337018271' };
  tags.push(`<script type="application/ld+json">${JSON.stringify(organization).replace(/</g, '\\u003c')}</script>`);
  await writeFile(path.join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc></url></urlset>\n`);
} else {
  console.warn('SITE_URL is not set; canonical, structured data and sitemap are omitted until the new hostname is known.');
}
for (const match of html.matchAll(/(?:href|src)="(assets\/(?:css|js)\/[^?"\s]+)(?:\?[^"\s]*)?"/g)) {
  const digest = createHash('sha256').update(await readFile(path.join(root, match[1]))).digest('hex').slice(0, 12);
  html = html.replace(match[0], match[0].replace(/=".*"/, `="${match[1]}?v=${digest}"`));
}
html = html.replace('</head>', `  ${tags.join('\n  ')}\n</head>`);
await writeFile(path.join(output, 'index.html'), html);
await writeFile(path.join(output, 'robots.txt'), `User-agent: *\nAllow: /\n${origin ? `\nSitemap: ${origin}/sitemap.xml\n` : ''}`);
console.log('Cloudflare static output is ready in dist/.');
