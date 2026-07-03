import urllib.request
import json
import time
import socket
import os
from pathlib import Path

# Use environment variable or default to current script directory
output_dir = os.getenv('CAREER_DATA_DIR', str(Path(__file__).parent / 'data'))
os.makedirs(output_dir, exist_ok=True)
output_file = os.path.join(output_dir, 'legrandfrere_togo_schools.json')
togo_ids = [561, 560, 530, 558, 477, 559]
base_url = 'https://legrandfrere.africa/wp-json/wp/v2/etablissement?per_page=100'

def fetch_with_retry(url, retries=5, backoff=2):
    for attempt in range(1, retries + 1):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
            with urllib.request.urlopen(req, timeout=30) as r:
                return r.read(), r.headers
        except (urllib.error.URLError, socket.timeout, ConnectionResetError) as e:
            if attempt == retries:
                raise e
            print(f"Error requesting {url} (Attempt {attempt}/{retries}): {e}. Retrying in {backoff} seconds...")
            time.sleep(backoff)
            backoff *= 2

try:
    print("Fetching initial page to get total page count...")
    _, headers = fetch_with_retry(base_url)
    total_pages = int(headers.get('X-WP-TotalPages', 1))
    print(f"Total pages to fetch: {total_pages}")
    
    togo_schools = []
    
    for page in range(1, total_pages + 1):
        print(f"Fetching page {page} of {total_pages}...")
        url_page = f'{base_url}&page={page}'
        try:
            content, _ = fetch_with_retry(url_page)
            data = json.loads(content.decode('utf-8'))
            page_togo_count = 0
            for school in data:
                if 'localite' in school:
                    # Check if any of the school's localite IDs are in togo_ids
                    if any(loc_id in togo_ids for loc_id in school['localite']):
                        togo_schools.append(school)
                        page_togo_count += 1
            print(f"Page {page}: Extracted {page_togo_count} Togo schools (Total so far: {len(togo_schools)})")
        except Exception as e:
            print(f"FAILED to fetch page {page} after all retries: {e}")
        time.sleep(1) # Extra politeness delay
        
    print(f"Found {len(togo_schools)} schools in Togo in total.")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(togo_schools, f, ensure_ascii=False, indent=2)
        
    print(f"Saved {len(togo_schools)} schools to {output_file}")
except Exception as e:
    print(f'Critical error: {e}')
