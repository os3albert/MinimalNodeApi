import { test } from 'node:test';
import assert from 'node:assert';
import { ProductService } from './prodotti.js';

test('ProductService.getProducts should return an array of products', async () => {
  const products = await ProductService.getProducts();
  assert.strictEqual(Array.isArray(products), true, 'Products should be an array');
  assert.ok(products.length > 0, 'Products array should not be empty');
});

test('ProductService.getProductById should return the correct product', async () => {
  const products = await ProductService.getProducts();
  const firstProduct = products[0];
  const foundProduct = await ProductService.getProductById(firstProduct.id);
  assert.deepStrictEqual(foundProduct, firstProduct, 'Should find the same product by ID');
});

test('ProductService.getProductById should throw error for non-existent ID', async () => {
  assert.throws(() => {
    ProductService.getProductById(999999);
  }, /Prodotto non trovato/i);
});
