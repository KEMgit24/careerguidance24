/**
 * clean-data.js
 * Script to clean and normalize raw scraped data from universities and careers.
 * Removes duplicates, validates formats, and normalizes fields.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'app', 'src', 'data');

function cleanUniversities() {
  const filePath = path.join(DATA_DIR, 'universities.json');
  if (!fs.existsSync(filePath)) {
    console.log('  ⚠️  universities.json not found');
    return [];
  }
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const seen = new Set();
  const cleaned = data.filter(uni => {
    if (!uni.name) return false;
    const key = uni.name.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    // Normalize fields
    uni.name = uni.name.trim();
    uni.location = (uni.location || '').trim();
    uni.phone = (uni.phone || '').trim();
    uni.email = (uni.email || '').trim();
    uni.website = (uni.website || '').trim();
    return true;
  });
  
  fs.writeFileSync(filePath, JSON.stringify(cleaned, null, 2), 'utf8');
  console.log(`  ✅ Universities: ${data.length} -> ${cleaned.length} (removed ${data.length - cleaned.length} duplicates)`);
  return cleaned;
}

function cleanCareers() {
  const filePath = path.join(DATA_DIR, 'careers.json');
  if (!fs.existsSync(filePath)) {
    console.log('  ⚠️  careers.json not found');
    return [];
  }
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const careers = Array.isArray(data) ? data : (data.careers || []);
  const seen = new Set();
  const cleaned = careers.filter(career => {
    if (!career.nom_metier) return false;
    const key = career.nom_metier.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    // Normalize fields
    career.nom_metier = career.nom_metier.trim();
    career.secteur = (career.secteur || '').trim();
    career.description = (career.description || '').trim();
    return true;
  });
  
  const output = Array.isArray(data) ? cleaned : { careers: cleaned };
  fs.writeFileSync(filePath, JSON.stringify(output, null, 2), 'utf8');
  console.log(`  ✅ Careers: ${careers.length} -> ${cleaned.length} (removed ${careers.length - cleaned.length} duplicates)`);
  return cleaned;
}

console.log('🧹 Cleaning data...');
cleanUniversities();
cleanCareers();
console.log('✨ Data cleaning complete!');
