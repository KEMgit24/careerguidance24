import urllib.request, json
url = 'https://legrandfrere.africa/wp-json/wp/v2/localite?per_page=100'
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    r = urllib.request.urlopen(req, timeout=15)
    total_pages = int(r.headers.get('X-WP-TotalPages', 1))
    
    togo_ids = []
    for page in range(1, total_pages + 1):
        url_page = f'{url}&page={page}'
        req_page = urllib.request.Request(url_page, headers={'User-Agent': 'Mozilla/5.0'})
        r_page = urllib.request.urlopen(req_page, timeout=15)
        data = json.loads(r_page.read().decode('utf-8'))
        for loc in data:
            if 'togo' in loc['name'].lower():
                print(f"ID: {loc['id']} Name: {loc['name']}")
                togo_ids.append(loc['id'])
    print(f"Togo IDs: {togo_ids}")
except Exception as e:
    print(f'Error: {e}')
