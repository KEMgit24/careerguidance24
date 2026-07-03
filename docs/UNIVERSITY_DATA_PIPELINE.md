# University Data Pipeline

## Overview

This document describes how university and institution data is collected, cleaned, and imported into the Supabase database.

## Pipeline Steps

```
1. Scrape / Collect raw data
        ↓
2. Clean and normalize
        ↓
3. Generate career-university mappings
        ↓
4. Import to Supabase
```

## Step 1 - Data Collection (`scripts/scrape-universities.js`)

Sources:
- Manual data entry from official Togolese university directories
- Public institution websites
- Ministry of Higher Education publications

Output: `data/universities/universities-raw.json`

## Step 2 - Data Cleaning (`scripts/clean-data.js`)

- Normalize institution names
- Standardize field names
- Remove duplicates
- Validate required fields (`nom_etablissement`, `filieres`)

Output: `data/universities/universities.json`

## Step 3 - Generate Mappings (`scripts/generate-mappings.js`)

- Cross-reference university programs with careers in `data/careers/careers.json`
- Generate `career_id ↔ university_id` pairs

Output: `data/mappings/career-university-mapping.json`

## Step 4 - Import to Supabase (`scripts/import-to-supabase.js`)

- Read cleaned JSON files
- Upsert into Supabase tables: `universities`, `career_university_mapping`
- Requires `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in environment

## Data Schema Reference

See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for the exact table structure.

## Known Universities (Togo) — Placeholder List

> TODO: Populate with actual verified data.

- Université de Lomé (UL)
- Université de Kara (UK)
- École Nationale Supérieure d'Ingénieurs (ENSI)
- Institut Africain d'Informatique (IAI-Togo)
- École Supérieure de Commerce et de Gestion (ESCG)
