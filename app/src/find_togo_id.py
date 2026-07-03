import urllib.request, json
url = 'https://legrandfrere.africa/wp-json/wp/v2/localite?per_page=100'
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    r = urllib.request.urlopen(req, timeout=15)
    data = json.loads(r.read().decode('utf-8'))
    for loc in data:
        if 'togo' in loc['name'].lower():
            print(f"ID: {loc['id']} Name: {loc['name']}")
except Exception as e:
    print(f'Error: {e}')
