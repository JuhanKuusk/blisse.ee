#!/usr/bin/env node
/**
 * Fetch treatments from WooCommerce API and generate HTML
 */

const WC_API_URL = 'https://backend.kehastuudio.ee/wp-json/wc/v3';
const CONSUMER_KEY = 'ck_817c3f01b3ca20c779df1efdb5bfec0cf2533683';
const CONSUMER_SECRET = 'cs_e9f937e31d8c70df97d14cf87a0d3602b3ddcf2c';

async function fetchAllProducts() {
  const url = `${WC_API_URL}/products?per_page=100&status=publish&consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;
  const response = await fetch(url);
  return response.json();
}

function isComboTreatment(name) {
  const n = name.toLowerCase();
  const comboIndicators = ['+', 'combo', 'kombo', 'pakett', 'superpakett', 'eripakkumine', 'topeltmõju', 'mega40', 'mega20', ' & ', ' x '];
  return comboIndicators.some(ind => n.includes(ind));
}

function isFaceTreatment(name) {
  const n = name.toLowerCase();
  return n.includes('näo') || n.includes('facial') || n.includes('face') || n.includes('näole') || n.includes('hammaste');
}

async function main() {
  console.log('Fetching products from WooCommerce...');
  const products = await fetchAllProducts();

  // Filter only salongihooldused category
  const salongiProducts = products.filter(p =>
    p.categories && p.categories.some(c => c.slug === 'salongihooldused')
  );

  console.log(`Found ${salongiProducts.length} salongihooldused products`);

  // Categorize
  const kehahooldused = salongiProducts.filter(p => !isFaceTreatment(p.name) && !isComboTreatment(p.name));
  const naohooldused = salongiProducts.filter(p => isFaceTreatment(p.name) && !isComboTreatment(p.name));
  const paketid = salongiProducts.filter(p => isComboTreatment(p.name));

  console.log(`\nKEHAHOOLDUSED (${kehahooldused.length}):`);
  kehahooldused.forEach((p, i) => {
    console.log(`${i+1}. ${p.name} | ${p.price}€`);
  });

  console.log(`\nNÄOHOOLDUSED (${naohooldused.length}):`);
  naohooldused.forEach((p, i) => {
    console.log(`${i+1}. ${p.name} | ${p.price}€`);
  });

  console.log(`\nPAKETID (${paketid.length}):`);
  paketid.forEach((p, i) => {
    console.log(`${i+1}. ${p.name} | ${p.price}€`);
  });

  // Output as JSON for HTML generation
  const output = {
    kehahooldused: kehahooldused.map(p => ({
      name: p.name,
      price: p.price,
      slug: p.slug,
      description: p.short_description?.replace(/<[^>]*>/g, '') || '',
      image: p.images?.[0]?.src || ''
    })),
    naohooldused: naohooldused.map(p => ({
      name: p.name,
      price: p.price,
      slug: p.slug,
      description: p.short_description?.replace(/<[^>]*>/g, '') || '',
      image: p.images?.[0]?.src || ''
    })),
    paketid: paketid.map(p => ({
      name: p.name,
      price: p.price,
      slug: p.slug,
      description: p.short_description?.replace(/<[^>]*>/g, '') || '',
      image: p.images?.[0]?.src || ''
    }))
  };

  console.log('\n=== JSON OUTPUT ===');
  console.log(JSON.stringify(output, null, 2));
}

main().catch(console.error);
