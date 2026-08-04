# Data Model — SkillForge

## Overview

SkillForge models the professional tech skill landscape as a graph with 5 node types and 9 relationship types.

## Node Types

### Skill
Represents a technical or soft skill in the tech industry.

| Property | Type | Description |
|----------|------|-------------|
| `name` | String (unique) | Skill name, e.g., "React" |
| `category` | String | Grouping: "Frontend", "Backend", "Core", etc. |
| `difficulty` | Integer (1-5) | Learning difficulty level |
| `description` | String | Brief explanation of the skill |
| `icon` | String | Emoji icon for visual representation |

### Role
Represents a professional job role/title.

| Property | Type | Description |
|----------|------|-------------|
| `title` | String (unique) | Role title, e.g., "Senior Frontend Engineer" |
| `level` | String | Career level: junior, mid, senior, lead |
| `domain` | String | Primary domain of the role |
| `avg_salary` | Integer | Average annual salary in USD |
| `description` | String | Brief role description |

### Domain
Represents a skill/career domain.

| Property | Type | Description |
|----------|------|-------------|
| `name` | String (unique) | Domain name, e.g., "Frontend" |
| `description` | String | Domain description |
| `color` | String | Hex color for visualization |

### LearningResource
Represents a course, book, or tutorial.

| Property | Type | Description |
|----------|------|-------------|
| `title` | String | Resource title |
| `type` | String | "course", "book", or "tutorial" |
| `provider` | String | Publisher/platform |
| `url` | String | External URL |
| `duration_hours` | Integer | Estimated completion time |
| `rating` | Float | Rating out of 5.0 |

### Professional
Sample professionals with skill profiles.

| Property | Type | Description |
|----------|------|-------------|
| `name` | String (unique) | Professional's name |
| `current_role` | String | Current job title |
| `experience_years` | Integer | Years of experience |
| `location` | String | City/region |

## Relationships

| Relationship | Start → End | Properties | Cardinality |
|-------------|-------------|-----------|-------------|
| `PREREQUISITE_OF` | Skill → Skill | — | Many-to-Many |
| `COMPLEMENTARY_TO` | Skill → Skill | `strength` (0-1) | Many-to-Many |
| `BELONGS_TO` | Skill → Domain | — | Many-to-Many |
| `REQUIRES` | Role → Skill | `importance` | Many-to-Many |
| `TEACHES` | LearningResource → Skill | — | Many-to-Many |
| `HAS_SKILL` | Professional → Skill | `proficiency` (1-5) | Many-to-Many |
| `WORKS_AS` | Professional → Role | — | Many-to-One |
| `LEADS_TO` | Role → Role | — | Many-to-Many |
| `RELATED_TO` | Domain → Domain | — | Many-to-Many |

## Constraints

```cypher
CREATE CONSTRAINT FOR (s:Skill) REQUIRE s.name IS UNIQUE
CREATE CONSTRAINT FOR (r:Role) REQUIRE r.title IS UNIQUE
CREATE CONSTRAINT FOR (d:Domain) REQUIRE d.name IS UNIQUE
CREATE CONSTRAINT FOR (p:Professional) REQUIRE p.name IS UNIQUE
```

## Seed Data Sizes

- ~80 Skills
- ~30 Roles
- 10 Domains
- ~25 Learning Resources
- ~30 Professionals
- ~400+ Relationships

All well within the CognoDB free tier limits (256 MB RAM, 1 GB disk).
