# Database Schema

## Technology: Supabase (PostgreSQL)

---

## Tables

### `profiles`
Extends Supabase Auth `auth.users` table. Stores student-specific profile data.

| Column         | Type        | Constraints              | Description                              |
|----------------|-------------|--------------------------|------------------------------------------|
| `id`           | `uuid`      | PK, FK → auth.users.id   | User ID (matches Supabase auth user)     |
| `nom`          | `text`      | NOT NULL                 | Last name                                |
| `prenom`       | `text`      | NOT NULL                 | First name                               |
| `niveau`       | `text`      |                          | Academic level (e.g., "Terminale", "BAC") |
| `interets`     | `text[]`    |                          | Array of interests                       |
| `loisirs`      | `text[]`    |                          | Array of hobbies                         |
| `created_at`   | `timestamptz` | DEFAULT now()          | Account creation date                    |
| `updated_at`   | `timestamptz` | DEFAULT now()          | Last update date                         |

---

### `careers`
Reference table of available careers.

| Column         | Type        | Constraints   | Description                        |
|----------------|-------------|---------------|------------------------------------|
| `id`           | `uuid`      | PK            | Career ID                          |
| `nom_metier`   | `text`      | NOT NULL      | Career name                        |
| `description`  | `text`      |               | Career description                 |
| `secteur`      | `text`      |               | Industry sector                    |
| `keywords`     | `text[]`    |               | Keywords for AI matching           |
| `created_at`   | `timestamptz` | DEFAULT now()| Creation date                     |

---

### `roadmaps`
Roadmaps linked to careers.

| Column               | Type     | Constraints        | Description                                   |
|----------------------|----------|--------------------|-----------------------------------------------|
| `id`                 | `uuid`   | PK                 | Roadmap ID                                    |
| `career_id`          | `uuid`   | FK → careers.id    | Associated career                             |
| `competences_cles`   | `text[]` |                    | Key skills to acquire                         |
| `matieres_importantes` | `text[]` |                  | Important subjects to focus on                |
| `created_at`         | `timestamptz` | DEFAULT now() | Creation date                                |

---

### `universities`
Reference table of universities and institutions.

| Column              | Type     | Constraints   | Description                              |
|---------------------|----------|---------------|------------------------------------------|
| `id`                | `uuid`   | PK            | University ID                            |
| `nom_etablissement` | `text`   | NOT NULL      | Institution name                         |
| `ville`             | `text`   |               | City                                     |
| `pays`              | `text`   | DEFAULT 'Togo'| Country                                  |
| `filieres`          | `text[]` |               | Available programs/majors                |
| `contact`           | `text`   |               | Contact information                      |
| `created_at`        | `timestamptz` | DEFAULT now()| Creation date                          |

---

### `career_university_mapping`
Many-to-many: careers ↔ universities.

| Column          | Type   | Constraints             | Description              |
|-----------------|--------|-------------------------|--------------------------|
| `id`            | `uuid` | PK                      | Mapping ID               |
| `career_id`     | `uuid` | FK → careers.id         | Career reference         |
| `university_id` | `uuid` | FK → universities.id    | University reference     |

---

### `user_orientations`
Records of career recommendations per user (AI results).

| Column        | Type      | Constraints             | Description                             |
|---------------|-----------|-------------------------|-----------------------------------------|
| `id`          | `uuid`    | PK                      | Orientation record ID                   |
| `user_id`     | `uuid`    | FK → profiles.id        | User                                    |
| `career_id`   | `uuid`    | FK → careers.id         | Recommended career                      |
| `pertinence`  | `numeric` |                         | Relevance score (0–100)                 |
| `saved`       | `boolean` | DEFAULT false           | Whether the user saved this career      |
| `created_at`  | `timestamptz` | DEFAULT now()       | When the recommendation was generated   |

---

## Row Level Security (RLS)

- All tables will have RLS enabled.
- `profiles`: users can only read/write their own row.
- `user_orientations`: users can only read/write their own orientations.
- `careers`, `roadmaps`, `universities`, `career_university_mapping`: public read, admin write.

---

## Notes

> Migration SQL files will be created in `supabase/migrations/` as we build each feature.
