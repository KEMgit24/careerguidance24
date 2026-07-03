import json
import os
from pathlib import Path

# Use environment variable or default to current script directory
data_dir = os.getenv('CAREER_DATA_DIR', str(Path(__file__).parent / 'data'))
universities_file = os.path.join(data_dir, 'universities.json')

if not os.path.exists(universities_file):
    print(f"Error: {universities_file} not found")
    exit(1)

data = json.load(open(universities_file, encoding='utf-8'))
print(f'Total: {len(data)} etablissements\n')

# Sample 5 new entries (after first 24 existing ones)
print("=== 5 nouveaux etablissements (apercu) ===")
for u in data[24:29]:
    name = u.get('name', '')[:55]
    phone = u.get('phone', '')[:22]
    email = u.get('email', '')[:35]
    website = u.get('website', '')[:35]
    location = u.get('location', '')
    print(f"  {name}")
    print(f"    Ville: {location} | Tel: {phone} | Email: {email}")
    print(f"    Site: {website}")
    print()

# Stats
with_phone = sum(1 for u in data if u.get('phone'))
with_email = sum(1 for u in data if u.get('email'))
with_website = sum(1 for u in data if u.get('website'))
with_logo = sum(1 for u in data if u.get('logo'))
with_desc = sum(1 for u in data if u.get('description'))
cames_count = sum(1 for u in data if u.get('has_cames'))

# Location breakdown
from collections import Counter
locations = Counter(u.get('location', 'N/A') for u in data)

print("=== Stats ===")
print(f"  Avec telephone:  {with_phone}/{len(data)}")
print(f"  Avec email:      {with_email}/{len(data)}")
print(f"  Avec site web:   {with_website}/{len(data)}")
print(f"  Avec logo:       {with_logo}/{len(data)}")
print(f"  Avec description:{with_desc}/{len(data)}")
print(f"  Reconnus CAMES:  {cames_count}/{len(data)}")
print()
print("=== Repartition par ville ===")
for city, count in locations.most_common():
    print(f"  {city}: {count}")
