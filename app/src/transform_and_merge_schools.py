"""
transform_and_merge_schools.py
Transforms raw Le Grand Frere API data into universities.json format,
fetches contact info from each school's individual page, and merges
with the existing universities.json (deduplicating by name).
"""

import json
import re
import html as html_module
import time
import urllib.request
import socket
import os
from pathlib import Path

# Use environment variable or default to current script directory
data_dir = os.getenv('CAREER_DATA_DIR', str(Path(__file__).parent / 'data'))
os.makedirs(data_dir, exist_ok=True)

RAW_INPUT = os.path.join(data_dir, 'legrandfrere_togo_schools.json')
EXISTING_UNI = os.path.join(data_dir, 'universities.json')
OUTPUT_UNI = os.path.join(data_dir, 'universities.json')

# Mapping: class_list keywords -> human-readable domains
DOMAIN_MAP = {
    'domaine-informatique': 'Informatique',
    'domaine-genie-informatique': 'Génie Informatique',
    'domaine-conception-et-administration-de-bases-de-donnees-et-de-reseau': 'Réseaux & Bases de Données',
    'domaine-developpement-et-analyse-de-logiciels-et-dapplications': 'Développement Logiciel',
    'domaine-electronique-et-automatisation': 'Électronique & Automatisation',
    'domaine-business': 'Business',
    'domaine-commerce-et-administration': 'Commerce & Administration',
    'domaine-communication': 'Communication',
    'domaine-comptabilite-et-fiscalite': 'Comptabilité & Fiscalité',
    'domaine-finance-banque-et-assurances': 'Finance & Banque',
    'domaine-droit': 'Droit',
    'domaine-sciences-economiques': 'Sciences Économiques',
    'domaine-management': 'Management',
    'domaine-marketing': 'Marketing',
    'domaine-sante': 'Santé',
    'domaine-medecine': 'Médecine',
    'domaine-arts': 'Arts',
    'domaine-sociologie-et-etudes-culturelles': 'Sciences Sociales & Culture',
    'domaine-musique-theatre-danse-cirque': 'Arts du Spectacle',
    'domaine-architecture': 'Architecture',
    'domaine-genie-civil': 'Génie Civil',
    'domaine-travaux-publics': 'Travaux Publics',
    'domaine-agriculture': 'Agriculture',
    'domaine-agronomie': 'Agronomie',
    'domaine-environnement': 'Environnement',
    'domaine-sciences': 'Sciences',
    'domaine-mathematiques': 'Mathématiques',
    'domaine-physique': 'Physique',
    'domaine-chimie': 'Chimie',
    'domaine-biologie': 'Biologie',
    'domaine-lettres': 'Lettres & Langues',
    'domaine-langues': 'Langues',
    'domaine-education': 'Éducation',
    'domaine-hotellerie-et-services-de-restauration': 'Hôtellerie & Restauration',
    'domaine-voyage-tourisme-et-loisirs': 'Tourisme & Loisirs',
    'domaine-energie': 'Énergie',
    'domaine-mines': 'Mines & Ressources',
    'domaine-ressources-humaines': 'Ressources Humaines',
}

# Mapping: class_list keywords -> niveau labels
NIVEAU_MAP = {
    'niveau-bts': 'BTS',
    'niveau-licence': 'Licence',
    'niveau-master': 'Master',
    'niveau-doctorat': 'Doctorat',
    'niveau-prepa': 'Classe Préparatoire',
    'niveau-cap': 'CAP / Formation Professionnelle',
    'niveau-ing': 'Ingénieur',
}

TYPE_MAP = {
    'type-etablissement-etablissement-prive': 'Établissement privé',
    'type-etablissement-etablissement-public': 'Établissement public',
    'type-etablissement-centre-de-formation': 'Centre de Formation',
    'type-etablissement-grande-ecole': 'Grande École',
    'type-etablissement-institution-regionale': 'Institution régionale',
}

LOCATION_MAP = {
    'localite-lome': 'Lomé',
    'localite-kara': 'Kara',
    'localite-atakpame': 'Atakpamé',
    'localite-sokode': 'Sokodé',
    'localite-tsevie': 'Tsévié',
    'localite-dapaong': 'Dapaong',
    'localite-notsé': 'Notsé',
}


def clean_html(raw_html: str) -> str:
    """Strip HTML tags and decode HTML entities."""
    text = re.sub(r'<[^>]+>', '', raw_html)
    text = html_module.unescape(text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def fetch_with_retry(url, retries=3, backoff=3, timeout=25):
    """Fetch a URL with retries."""
    for attempt in range(1, retries + 1):
        try:
            req = urllib.request.Request(
                url,
                headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
            )
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return r.read().decode('utf-8')
        except (urllib.error.URLError, socket.timeout, ConnectionResetError) as e:
            if attempt == retries:
                return None
            print(f"  Retry {attempt}/{retries} for {url}: {e}")
            time.sleep(backoff * attempt)
    return None


def extract_contacts_from_page(url: str):
    """
    Fetch the school's individual page and extract phone, email, website.
    Returns dict with 'phone', 'email', 'website'.
    """
    result = {'phone': '', 'email': '', 'website': '', 'logo': '', 'header_image': ''}
    
    html = fetch_with_retry(url)
    if not html:
        return result

    # Phone: href="tel:..."
    phone_match = re.search(r'href=["\']tel:([^"\']+)["\']', html)
    if phone_match:
        result['phone'] = urllib.parse.unquote(phone_match.group(1)).strip()

    # Email: href="mailto:..."
    email_match = re.search(r'href=["\']mailto:([^"\']+)["\']', html)
    if email_match:
        result['email'] = email_match.group(1).strip()

    # Website: gtm-btn-website link
    site_match = re.search(r'class=["\'][^"\']*gtm-btn-website[^"\']*["\'][^>]*>([^<]+)<', html)
    if site_match:
        result['website'] = site_match.group(1).strip()

    # Logo from og:image or featured image 
    logo_match = re.search(r'property=["\']og:image["\'][^>]*content=["\']([^"\']+)["\']', html)
    if not logo_match:
        logo_match = re.search(r'content=["\']([^"\']+)["\'][^>]*property=["\']og:image["\']', html)
    if logo_match:
        result['logo'] = logo_match.group(1).strip()

    # Header/banner image from elementor header or first large image
    header_match = re.search(r'background-image\s*:\s*url\(["\']?([^"\')\s]+)["\']?\)', html)
    if header_match:
        img_url = header_match.group(1)
        if 'legrandfrere.africa/wp-content' in img_url and '150x150' not in img_url and '24x24' not in img_url:
            result['header_image'] = img_url

    return result


def extract_domains_from_class_list(class_list: list) -> list:
    """Extract human-readable domains from CSS class list."""
    domains = []
    for cls in class_list:
        for key, label in DOMAIN_MAP.items():
            if cls.startswith(key) or cls == key:
                if label not in domains:
                    domains.append(label)
                break
    return domains


def extract_niveaux_from_class_list(class_list: list) -> list:
    """Extract niveau/filière level from CSS class list."""
    niveaux = []
    for cls in class_list:
        for key, label in NIVEAU_MAP.items():
            if cls == key:
                if label not in niveaux:
                    niveaux.append(label)
                break
    return niveaux


def extract_type_from_class_list(class_list: list) -> str:
    """Extract establishment type from CSS class list."""
    for cls in class_list:
        for key, label in TYPE_MAP.items():
            if cls == key:
                return label
    return 'Établissement privé'


def extract_location_from_class_list(class_list: list) -> str:
    """Extract city from CSS class list."""
    for cls in class_list:
        for key, label in LOCATION_MAP.items():
            if cls == key:
                return label
    return 'Togo'


def has_cames_from_content(content: str) -> bool:
    """Check if school has CAMES accreditation from content."""
    return 'CAMES' in content or 'cames' in content.lower()


def build_filieres(niveaux: list, domains: list) -> list:
    """Build generic filieres from niveaux and domains."""
    filieres = []
    for niv in niveaux:
        for dom in domains[:2]:  # Only top 2 domains
            filieres.append(f"{niv} {dom}")
    return filieres if filieres else niveaux


def normalize_name(name: str) -> str:
    """Normalize school name for comparison."""
    name = html_module.unescape(name)
    name = re.sub(r'&rsquo;', "'", name)
    name = re.sub(r'&#\d+;', '', name)
    name = name.strip().lower()
    return name


def main():
    import urllib.parse  # Used in extract_contacts_from_page

    print("=== Loading existing universities ===")
    with open(EXISTING_UNI, 'r', encoding='utf-8') as f:
        existing = json.load(f)
    
    existing_names = {normalize_name(u['name']) for u in existing}
    print(f"Loaded {len(existing)} existing universities.")

    print("\n=== Loading raw scraped schools ===")
    with open(RAW_INPUT, 'r', encoding='utf-8') as f:
        raw_schools = json.load(f)
    print(f"Loaded {len(raw_schools)} raw schools.")

    new_schools = []
    skipped = 0
    id_counter = len(existing) + 1

    for i, school in enumerate(raw_schools):
        name_raw = school['title']['rendered']
        name = clean_html(name_raw)
        
        # Deduplicate by name
        if normalize_name(name) in existing_names:
            print(f"  [{i+1:3d}] SKIP (duplicate): {name[:60]}")
            skipped += 1
            continue

        print(f"  [{i+1:3d}] Processing: {name[:60]}")
        
        link = school.get('link', '')
        class_list = school.get('class_list', [])
        content_html = school['content']['rendered']
        
        domains = extract_domains_from_class_list(class_list)
        niveaux = extract_niveaux_from_class_list(class_list)
        uni_type = extract_type_from_class_list(class_list)
        location = extract_location_from_class_list(class_list)
        has_cames = has_cames_from_content(content_html)
        description = clean_html(content_html)
        if len(description) > 400:
            description = description[:397] + '...'
        
        filieres = build_filieres(niveaux, domains)

        # Fetch contacts from individual page
        contacts = {'phone': '', 'email': '', 'website': '', 'logo': '', 'header_image': ''}
        if link:
            contacts = extract_contacts_from_page(link)
            time.sleep(1.5)  # Be polite

        new_uni = {
            "id": f"uni_{id_counter:03d}",
            "name": name,
            "logo": contacts.get('logo', ''),
            "header_image": contacts.get('header_image', ''),
            "type": uni_type,
            "location": location,
            "has_cames": has_cames,
            "website": contacts.get('website', ''),
            "email": contacts.get('email', ''),
            "phone": contacts.get('phone', ''),
            "description": description,
            "filieres": filieres,
            "domains": domains,
        }

        new_schools.append(new_uni)
        existing_names.add(normalize_name(name))
        id_counter += 1

    print(f"\n=== Results ===")
    print(f"New schools to add: {len(new_schools)}")
    print(f"Skipped (duplicates): {skipped}")

    final_list = existing + new_schools
    print(f"Total universities: {len(final_list)}")

    with open(OUTPUT_UNI, 'w', encoding='utf-8') as f:
        json.dump(final_list, f, ensure_ascii=False, indent=2)

    print(f"\nSaved {len(final_list)} universities to {OUTPUT_UNI}")


if __name__ == '__main__':
    import urllib.parse
    main()
