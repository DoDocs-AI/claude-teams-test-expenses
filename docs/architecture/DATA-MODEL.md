# Data Model - Expense Tracker App

## Database: PostgreSQL 16

## Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────────┐
│    users     │       │   categories     │       │    budgets       │
├──────────────┤       ├──────────────────┤       ├──────────────────┤
│ id (PK)      │──┐    │ id (PK)          │       │ id (PK)          │
│ email        │  │    │ name             │       │ user_id (FK)     │──┐
│ password_hash│  │    │ icon             │       │ month            │  │
│ name         │  │    │ is_default       │       │ year             │  │
│ created_at   │  │    │ user_id (FK)     │──┐    │ amount           │  │
│ updated_at   │  │    │ created_at       │  │    │ created_at       │  │
└──────────────┘  │    └──────────────────┘  │    │ updated_at       │  │
                  │                           │    └──────────────────┘  │
                  │    ┌──────────────────┐   │                          │
                  │    │    expenses      │   │                          │
                  │    ├──────────────────┤   │                          │
                  │    │ id (PK)          │   │                          │
                  ├───>│ user_id (FK)     │   │                          │
                  │    │ category_id (FK) │<──┘                          │
                  │    │ amount           │                               │
                  │    │ date             │                               │
                  │    │ description      │                               │
                  │    │ created_at       │                               │
                  │    │ updated_at       │                               │
                  │    └──────────────────┘                               │
                  │                                                       │
                  └───────────────────────────────────────────────────────┘
```

## Table Definitions

### 1. users

Stores registered user accounts.

```sql
CREATE TABLE users (
    id              BIGSERIAL       PRIMARY KEY,
    email           VARCHAR(255)    NOT NULL UNIQUE,
    password_hash   VARCHAR(255)    NOT NULL,
    name            VARCHAR(100)    NOT NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_users_email ON users(email);
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGSERIAL | PK, auto-increment | Unique user identifier |
| email | VARCHAR(255) | NOT NULL, UNIQUE | User's email address (login identifier) |
| password_hash | VARCHAR(255) | NOT NULL | bcrypt-hashed password |
| name | VARCHAR(100) | NOT NULL | User's display name |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Account creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

### 2. categories

Stores expense categories. Includes both system defaults (shared by all users) and user-created custom categories.

```sql
CREATE TABLE categories (
    id              BIGSERIAL       PRIMARY KEY,
    name            VARCHAR(50)     NOT NULL,
    icon            VARCHAR(50),
    is_default      BOOLEAN         NOT NULL DEFAULT FALSE,
    user_id         BIGINT          REFERENCES users(id) ON DELETE CASCADE,
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE UNIQUE INDEX idx_categories_name_user ON categories(name, user_id) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX idx_categories_name_default ON categories(name) WHERE is_default = TRUE;
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGSERIAL | PK, auto-increment | Unique category identifier |
| name | VARCHAR(50) | NOT NULL | Category name |
| icon | VARCHAR(50) | NULLABLE | Icon identifier string |
| is_default | BOOLEAN | NOT NULL, DEFAULT FALSE | True for system-wide default categories |
| user_id | BIGINT | FK -> users(id), NULLABLE | NULL for default categories; set for user-created |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |

**Notes:**
- Default categories have `is_default = TRUE` and `user_id = NULL`
- Custom categories have `is_default = FALSE` and `user_id` set to the creating user
- The partial unique indexes ensure: no duplicate default category names, and no duplicate custom category names per user

### 3. expenses

Stores individual expense entries.

```sql
CREATE TABLE expenses (
    id              BIGSERIAL       PRIMARY KEY,
    user_id         BIGINT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id     BIGINT          NOT NULL REFERENCES categories(id),
    amount          DECIMAL(10,2)   NOT NULL CHECK (amount > 0),
    date            DATE            NOT NULL,
    description     VARCHAR(500),
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_user_date ON expenses(user_id, date DESC);
CREATE INDEX idx_expenses_user_category ON expenses(user_id, category_id);
CREATE INDEX idx_expenses_user_date_range ON expenses(user_id, date);
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGSERIAL | PK, auto-increment | Unique expense identifier |
| user_id | BIGINT | NOT NULL, FK -> users(id) ON DELETE CASCADE | Owner of the expense |
| category_id | BIGINT | NOT NULL, FK -> categories(id) | Expense category |
| amount | DECIMAL(10,2) | NOT NULL, CHECK > 0 | Expense amount in USD |
| date | DATE | NOT NULL | Date the expense occurred |
| description | VARCHAR(500) | NULLABLE | Optional description |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_expenses_user_id` - Fast lookup of all expenses for a user
- `idx_expenses_user_date` - Supports default sort (by date descending) per user
- `idx_expenses_user_category` - Supports filtering by category per user
- `idx_expenses_user_date_range` - Supports date range queries for reports

### 4. budgets

Stores monthly budget amounts per user. Each user can have at most one budget per month/year combination.

```sql
CREATE TABLE budgets (
    id              BIGSERIAL       PRIMARY KEY,
    user_id         BIGINT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    month           INTEGER         NOT NULL CHECK (month BETWEEN 1 AND 12),
    year            INTEGER         NOT NULL CHECK (year BETWEEN 2000 AND 2100),
    amount          DECIMAL(10,2)   NOT NULL CHECK (amount > 0),
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, month, year)
);

CREATE INDEX idx_budgets_user_month_year ON budgets(user_id, month, year);
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGSERIAL | PK, auto-increment | Unique budget identifier |
| user_id | BIGINT | NOT NULL, FK -> users(id) ON DELETE CASCADE | Budget owner |
| month | INTEGER | NOT NULL, CHECK 1-12 | Budget month |
| year | INTEGER | NOT NULL, CHECK 2000-2100 | Budget year |
| amount | DECIMAL(10,2) | NOT NULL, CHECK > 0 | Monthly budget amount in USD |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Constraints:**
- `UNIQUE (user_id, month, year)` - One budget per user per month

## Seed Data - Default Categories

The following default categories are inserted on application startup (or via migration):

```sql
INSERT INTO categories (name, icon, is_default, user_id) VALUES
    ('Food',            'utensils',     TRUE, NULL),
    ('Transportation',  'car',          TRUE, NULL),
    ('Housing',         'home',         TRUE, NULL),
    ('Utilities',       'bolt',         TRUE, NULL),
    ('Entertainment',   'film',         TRUE, NULL),
    ('Healthcare',      'heart-pulse',  TRUE, NULL),
    ('Shopping',        'shopping-bag', TRUE, NULL),
    ('Other',           'ellipsis',     TRUE, NULL);
```

## Hibernate/JPA Entity Mapping Notes

### Entity Naming

- Java entities use camelCase field names
- Database columns use snake_case (Hibernate's default physical naming strategy handles the conversion)

### Key Annotations

| Entity | Key Annotations |
|--------|----------------|
| User | `@Entity`, `@Table(name = "users")` |
| Category | `@Entity`, `@Table(name = "categories")` |
| Expense | `@Entity`, `@Table(name = "expenses")`, `@ManyToOne` for user and category |
| Budget | `@Entity`, `@Table(name = "budgets")`, `@Table(uniqueConstraints = ...)` |

### Cascade and Deletion Behavior

- Deleting a user cascades to delete all their expenses, budgets, and custom categories
- Deleting a category is prevented if expenses reference it (referential integrity)
- Default categories cannot be deleted

## Queries for Reports

### Monthly Summary (total spent, count, top category)

```sql
SELECT SUM(e.amount) as total_spent,
       COUNT(e.id) as transaction_count
FROM expenses e
WHERE e.user_id = :userId
  AND EXTRACT(MONTH FROM e.date) = :month
  AND EXTRACT(YEAR FROM e.date) = :year;
```

### Spending by Category

```sql
SELECT c.id, c.name, c.icon,
       SUM(e.amount) as total_amount,
       COUNT(e.id) as transaction_count
FROM expenses e
JOIN categories c ON e.category_id = c.id
WHERE e.user_id = :userId
  AND EXTRACT(MONTH FROM e.date) = :month
  AND EXTRACT(YEAR FROM e.date) = :year
GROUP BY c.id, c.name, c.icon
ORDER BY total_amount DESC;
```

### Monthly Trend (spending per month over a year)

```sql
SELECT EXTRACT(MONTH FROM e.date) as month,
       SUM(e.amount) as total_spent,
       COUNT(e.id) as transaction_count
FROM expenses e
WHERE e.user_id = :userId
  AND EXTRACT(YEAR FROM e.date) = :year
GROUP BY EXTRACT(MONTH FROM e.date)
ORDER BY month;
```
