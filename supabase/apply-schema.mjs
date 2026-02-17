#!/usr/bin/env node
/**
 * Apply Blisse schema to Supabase
 * Run: node supabase/apply-schema.mjs
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const SUPABASE_URL = 'https://kwxgcxqjywnzmhfnzdrp.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3eGdjeHFqeXduem1oZm56ZHJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzk0NzQwOCwiZXhwIjoyMDY5NTIzNDA4fQ.zuKqTEvQ4OToFubF5VkKbM9qr3CLYdpSu-P7c1cHlUI';

async function main() {
  console.log('Blisse Schema Importer');
  console.log('=====================\n');

  // Initialize Supabase client with service role key
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  // Test connection
  console.log('Testing Supabase connection...');
  const { data: testData, error: testError } = await supabase
    .from('blisse_treatments')
    .select('count')
    .limit(1);

  if (testError && testError.code === '42P01') {
    console.log('Tables do not exist yet. Please run the SQL schema manually.\n');
    console.log('Instructions:');
    console.log('1. Go to https://supabase.com/dashboard/project/kwxgcxqjywnzmhfnzdrp/sql/new');
    console.log('2. Copy the contents of supabase/schema.sql');
    console.log('3. Paste and run in the SQL Editor\n');

    // Read and display schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    console.log('Schema SQL to run:');
    console.log('==================');
    console.log(schema);
    return;
  }

  if (testError) {
    console.error('Connection error:', testError.message);
    return;
  }

  console.log('Connection successful!\n');

  // Check if data exists
  const { data: treatments } = await supabase
    .from('blisse_treatments')
    .select('*');

  const { data: packages } = await supabase
    .from('blisse_packages')
    .select('*');

  console.log(`Current data:`);
  console.log(`- Treatments: ${treatments?.length || 0}`);
  console.log(`- Packages: ${packages?.length || 0}`);

  if (treatments?.length > 0) {
    console.log('\nTreatments in database:');
    treatments.forEach((t, i) => {
      console.log(`  ${i + 1}. ${t.name} (${t.category}) - ${t.price}€`);
    });
  }

  if (packages?.length > 0) {
    console.log('\nPackages in database:');
    packages.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.name} (${p.category}) - ${p.price}€`);
    });
  }
}

main().catch(console.error);
