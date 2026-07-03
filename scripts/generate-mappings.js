/**
 * generate-mappings.js
 * Script to generate career-university mappings from cleaned data.
 * Creates associations between careers and universities based on domains.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'app', 'src', 'data');
const MAPPINGS_DIR = path.join(DATA_DIR, '..', '..', 'data', 'mappings');

// Ensure mappings directory exists
if (!fs.existsSync(MAPPINGS_DIR)) {
  fs.mkdirSync(MAPPINGS_DIR, { recursive: true });
}

function generateMappings() {
  // Load universities
  const universitiesPath = path.join(DATA_DIR, 'universities.json');
  if (!fs.existsSync(universitiesPath)) {
    console.log('  ⚠️  universities.json not found');
    return;
  }
  const universities = JSON.parse(fs.readFileSync(universitiesPath, 'utf8'));

  // Load careers
  const careersPath = path.join(DATA_DIR, 'careers.json');
  if (!fs.existsSync(careersPath)) {
    console.log('  ⚠️  careers.json not found');
    return;
  }
  const careersData = JSON.parse(fs.readFileSync(careersPath, 'utf8'));
  const careers = Array.isArray(careersData) ? careersData : (careersData.careers || []);

  // Generate mappings: career_id -> [university_ids]
  const mappings = {};
  
  careers.forEach(career => {
    const careerDomains = (career.secteur || '').toLowerCase().split(' ');
    const matchingUnis = universities
      .filter(uni => {
        if (!uni.domains || !Array.isArray(uni.domains)) return false;
        const uniDomains = uni.domains.map(d => d.toLowerCase());
        return careerDomains.some(d => uniDomains.some(ud => ud.includes(d) || d.includes(ud)));
      })
      .map(uni => uni.id || uni.name);
    
    if (matchingUnis.length > 0) {
      mappings[career.id || career.nom_metier] = matchingUnis;
    }
  });

  // Write mappings
  const mappingsPath = path.join(MAPPINGS_DIR, 'career-university-mapping.json');
  fs.writeFileSync(mappingsPath, JSON.stringify(mappings, null, 2), 'utf8');
  console.log(`  ✅ Generated mappings: ${Object.keys(mappings).length} careers mapped to universities`);
}

console.log('🔗 Generating career-university mappings...');
generateMappings();
console.log('✨ Mapping generation complete!');
