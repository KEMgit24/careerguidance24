/**
 * import-to-supabase.js
 * Script to import cleaned and mapped data into Supabase.
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
require('dotenv').config({ path: path.join(__dirname, '..', 'app', '.env.local') });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const DATA_DIR = path.join(__dirname, '..', 'app', 'src', 'data');

async function importUniversities() {
  const filePath = path.join(DATA_DIR, 'universities.json');
  if (!fs.existsSync(filePath)) {
    console.log('  ⚠️  universities.json not found');
    return;
  }
  
  const universities = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log(`  📤 Importing ${universities.length} universities...`);
  
  const { data, error } = await supabase
    .from('universities')
    .upsert(universities, { onConflict: 'name' });
  
  if (error) {
    console.error('  ❌ Error importing universities:', error);
  } else {
    console.log(`  ✅ Successfully imported/updated ${universities.length} universities`);
  }
}

async function importCareers() {
  const filePath = path.join(DATA_DIR, 'careers.json');
  if (!fs.existsSync(filePath)) {
    console.log('  ⚠️  careers.json not found');
    return;
  }
  
  const careersData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const careers = Array.isArray(careersData) ? careersData : (careersData.careers || []);
  console.log(`  📤 Importing ${careers.length} careers...`);
  
  const { data, error } = await supabase
    .from('careers')
    .upsert(careers, { onConflict: 'nom_metier' });
  
  if (error) {
    console.error('  ❌ Error importing careers:', error);
  } else {
    console.log(`  ✅ Successfully imported/updated ${careers.length} careers`);
  }
}

async function main() {
  console.log('📥 Importing data to Supabase...');
  await importUniversities();
  await importCareers();
  console.log('✨ Supabase import complete!');
}

main().catch(console.error);
