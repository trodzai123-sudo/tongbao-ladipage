import assert from 'node:assert/strict';
import { readFile, access, readdir } from 'node:fs/promises';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = await readFile(path.join(root, 'index.html'), 'utf8');
const context = { window: {} };
vm.runInNewContext(await readFile(path.join(root, 'assets/js/product-data.js'), 'utf8'), context);
const products = context.window.TONGBAO_PRODUCTS;
assert(products.length > 0, 'The catalog is empty.');
assert.equal(new Set(products.map(product => product.id)).size, products.length, 'Duplicate product IDs.');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, 'Duplicate HTML IDs.');
assert.equal((html.match(/data-lead-form/g) || []).length, 1, 'Keep a single consultation form.');
for (const match of html.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(match[1]), `Missing anchor #${match[1]}`);
const assets = [...html.matchAll(/(?:src|href)="(assets\/[^"?]+)(?:\?[^"\s]*)?"/g)].map(match => match[1]);
products.forEach(product => {
  assert(product.name && product.short && product.group && product.specs.length, `Incomplete product ${product.id}`);
  assets.push(product.image, ...(product.gallery || []));
});
for (const asset of new Set(assets)) {
  assert(!/^https?:/.test(asset), `Product images must be local: ${asset}`);
  await access(path.join(root, asset.split('?')[0]));
}
for (const filename of await readdir(path.join(root, 'assets/js'))) {
  if (filename.endsWith('.js')) new vm.Script(await readFile(path.join(root, 'assets/js', filename), 'utf8'), { filename });
}
assert(!html.includes('https://tongbao-ladipage.pages.dev'), 'Do not publish the old canonical hostname.');
console.log(`Checks passed: ${products.length} products, ${new Set(assets).size} local assets, scripts, anchors and form structure.`);
