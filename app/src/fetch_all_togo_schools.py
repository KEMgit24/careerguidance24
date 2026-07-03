import urllib.request, json, time, os

output_file = r'C:\Users\Shanlight\.gemini\antigravity-ide\brain\80368172-10f3-47fb-9a93-7f12beae7381\scratch\all_togo_schools.json'

url = 'https://legrandfrere.africa/wp-json/wp/v2/etablissement?per_page=100'
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    r = urllib.request.urlopen(req, timeout=15)
    total_pages = int(r.headers.get('X-WP-TotalPages', 1))
    
    togo_schools = []
    
    for page in range(1, total_pages + 1):
        print(f"Fetching page {page} of {total_pages}...")
        url_page = f'{url}&page={page}'
        req_page = urllib.request.Request(url_page, headers={'User-Agent': 'Mozilla/5.0'})
        try:
            r_page = urllib.request.urlopen(req_page, timeout=15)
            data = json.loads(r_page.read().decode('utf-8'))
            for school in data:
                if 'localite' in school and 477 in school['localite']:
                    togo_schools.append(school)
        except Exception as e:
            print(f'Error fetching page {page}: {e}')
        time.sleep(1) # Be nice to the server
        
    print(f"Found {len(togo_schools)} schools in Togo.")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(togo_schools, f, ensure_ascii=False, indent=2)
        
    print("Done")
except Exception as e:
    print(f'Error: {e}')
