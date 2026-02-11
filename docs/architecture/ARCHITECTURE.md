# System Architecture - Expense Tracker App

## 1. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Backend** | Quarkus (Java) | 3.x (latest stable) |
| **Frontend** | React (TypeScript) | 18.x with Vite |
| **Database** | PostgreSQL | 16.x |
| **Authentication** | JWT (SmallRye JWT) | via Quarkus extensions |
| **ORM** | Hibernate ORM with Panache | via Quarkus extensions |
| **Build (Backend)** | Maven | 3.9+ |
| **Build (Frontend)** | npm | 10.x |
| **Containerization** | Docker + Docker Compose | latest |

## 2. Project Structure

```
test-expenses/
├── docs/                          # All project documentation
│   ├── requirements/
│   ├── ux/
│   ├── architecture/
│   ├── sprint/
│   └── e2e-testcases/
├── backend/                       # Quarkus Maven project
│   ├── pom.xml
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/expense/
│   │   │   │   ├── auth/          # Auth resources, services, DTOs
│   │   │   │   ├── expense/       # Expense resources, services, entities
│   │   │   │   ├── category/      # Category resources, services, entities
│   │   │   │   ├── budget/        # Budget resources, services, entities
│   │   │   │   ├── report/        # Report/dashboard resources, services
│   │   │   │   └── common/        # Shared config, exceptions, filters
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── Dockerfile
├── frontend/                      # React + Vite project
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── index.html
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── api/                   # API client and service functions
│   │   ├── components/            # Reusable UI components
│   │   ├── pages/                 # Page-level components (routes)
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── context/               # React context (auth, etc.)
│   │   ├── types/                 # TypeScript type definitions
│   │   └── utils/                 # Utility functions
│   ├── public/
│   └── Dockerfile
├── docker-compose.yml
└── CLAUDE.md
```

## 3. System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                        Client Browser                         │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              React Frontend (TypeScript)                  │  │
│  │                                                            │  │
│  │  ┌─────────┐ ┌──────────┐ ┌─────────┐ ┌──────────────┐  │  │
│  │  │  Auth   │ │ Expenses │ │ Budget  │ │  Dashboard   │  │  │
│  │  │  Pages  │ │  Pages   │ │  Pages  │ │  & Reports   │  │  │
│  │  └─────────┘ └──────────┘ └─────────┘ └──────────────┘  │  │
│  │                      │                                     │  │
│  │              ┌───────┴───────┐                             │  │
│  │              │   API Client  │ (fetch + JWT in headers)   │  │
│  │              └───────┬───────┘                             │  │
│  └──────────────────────┼────────────────────────────────────┘  │
└─────────────────────────┼────────────────────────────────────────┘
                          │ HTTP/REST (JSON)
                          │ Port 8080
┌─────────────────────────┼────────────────────────────────────────┐
│                 Quarkus Backend (Java)                            │
│                                                                    │
│  ┌──────────────────────┼────────────────────────────────────┐    │
│  │              ┌───────┴───────┐                             │    │
│  │              │  JAX-RS REST  │                             │    │
│  │              │   Resources   │                             │    │
│  │              └───────┬───────┘                             │    │
│  │                      │                                     │    │
│  │  ┌──────┐  ┌────────┴───────┐  ┌──────────────────────┐  │    │
│  │  │ JWT  │  │    Service     │  │   Exception Mapper   │  │    │
│  │  │Filter│  │     Layer      │  │   & CORS Filter      │  │    │
│  │  └──────┘  └────────┬───────┘  └──────────────────────┘  │    │
│  │                      │                                     │    │
│  │              ┌───────┴───────┐                             │    │
│  │              │   Hibernate   │                             │    │
│  │              │   Panache     │                             │    │
│  │              │  Repositories │                             │    │
│  │              └───────┬───────┘                             │    │
│  └──────────────────────┼────────────────────────────────────┘    │
│                          │ JDBC                                    │
└──────────────────────────┼────────────────────────────────────────┘
                           │ Port 5432
┌──────────────────────────┼────────────────────────────────────────┐
│                    PostgreSQL Database                              │
│                                                                      │
│    ┌──────────┐  ┌────────────┐  ┌──────────┐  ┌──────────────┐   │
│    │  users   │  │ categories │  │ expenses │  │   budgets    │   │
│    └──────────┘  └────────────┘  └──────────┘  └──────────────┘   │
└────────────────────────────────────────────────────────────────────┘
```

## 4. Authentication Design

### JWT-Based Authentication Flow

1. **Registration:** User sends email + password + name to `POST /api/auth/register`. Password is hashed with bcrypt. User record is stored. A JWT is returned.
2. **Login:** User sends email + password to `POST /api/auth/login`. Backend validates credentials. On success, a signed JWT is returned.
3. **Authenticated Requests:** Frontend stores JWT in memory (and optionally localStorage). Every API request includes the JWT in the `Authorization: Bearer <token>` header.
4. **Token Validation:** Quarkus SmallRye JWT filter validates the token on every protected endpoint. Invalid/expired tokens return 401.

### JWT Token Structure

```json
{
  "sub": "<user-id>",
  "email": "user@example.com",
  "name": "User Name",
  "iat": 1700000000,
  "exp": 1700086400,
  "iss": "expense-tracker"
}
```

- **Expiration:** 24 hours
- **Algorithm:** RS256 (RSA with SHA-256)
- **Issuer:** `expense-tracker`

### Quarkus Security Extensions

- `quarkus-smallrye-jwt` - JWT token parsing and validation
- `quarkus-smallrye-jwt-build` - JWT token generation
- `quarkus-elytron-security-common` - Password hashing (bcrypt)

## 5. Backend Architecture Details

### Layered Architecture

```
Resource (REST Controller)  ->  Service (Business Logic)  ->  Repository (Data Access)
         |                              |                            |
    DTOs / Requests            Entity Mapping              Hibernate Panache
    Validation                 Authorization checks        Database queries
    HTTP concerns              Business rules              Transactions
```

### Key Quarkus Extensions

| Extension | Purpose |
|-----------|---------|
| `quarkus-rest-jackson` | JAX-RS REST with Jackson JSON |
| `quarkus-hibernate-orm-panache` | ORM with Active Record/Repository pattern |
| `quarkus-jdbc-postgresql` | PostgreSQL JDBC driver |
| `quarkus-smallrye-jwt` | JWT authentication |
| `quarkus-smallrye-jwt-build` | JWT token generation |
| `quarkus-hibernate-validator` | Bean validation |

### Configuration (application.properties)

```properties
# Database
quarkus.datasource.db-kind=postgresql
quarkus.datasource.username=expense_user
quarkus.datasource.password=expense_pass
quarkus.datasource.jdbc.url=jdbc:postgresql://localhost:5432/expense_db
quarkus.hibernate-orm.database.generation=update

# JWT
mp.jwt.verify.publickey.location=publicKey.pem
mp.jwt.verify.issuer=expense-tracker
smallrye.jwt.sign.key.location=privateKey.pem
smallrye.jwt.new-token.lifespan=86400

# CORS
quarkus.http.cors=true
quarkus.http.cors.origins=http://localhost:5173
quarkus.http.cors.methods=GET,POST,PUT,DELETE,OPTIONS
quarkus.http.cors.headers=Content-Type,Authorization
quarkus.http.cors.exposed-headers=Authorization

# HTTP
quarkus.http.port=8080
```

## 6. Frontend Architecture Details

### State Management

- **Auth state:** React Context (`AuthContext`) holding current user and JWT token
- **Server state:** Direct fetch calls from service modules in `api/`; component-level state with `useState` and `useEffect`
- **Form state:** Local component state

### Routing

React Router v6 with the following route structure:

| Route | Page | Auth Required |
|-------|------|---------------|
| `/login` | Login page | No |
| `/register` | Registration page | No |
| `/` | Dashboard | Yes |
| `/expenses` | Expense list | Yes |
| `/expenses/new` | Add expense form | Yes |
| `/expenses/:id/edit` | Edit expense form | Yes |
| `/categories` | Manage categories | Yes |
| `/budget` | Budget management | Yes |
| `/reports` | Reports & charts | Yes |

### API Client Design

A centralized API client module that:
- Reads the JWT from auth context/storage
- Attaches `Authorization` header to all requests
- Handles 401 responses by redirecting to login
- Provides typed request/response functions

### Chart Library

- **Recharts** for data visualization (pie charts, bar charts, line charts)

## 7. Deployment Architecture

### Docker Compose Setup

```yaml
services:
  postgres:
    image: postgres:16
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: expense_db
      POSTGRES_USER: expense_user
      POSTGRES_PASSWORD: expense_pass
    volumes:
      - pgdata:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    depends_on:
      - postgres
    environment:
      QUARKUS_DATASOURCE_JDBC_URL: jdbc:postgresql://postgres:5432/expense_db
      QUARKUS_DATASOURCE_USERNAME: expense_user
      QUARKUS_DATASOURCE_PASSWORD: expense_pass

  frontend:
    build: ./frontend
    ports:
      - "5173:80"
    depends_on:
      - backend

volumes:
  pgdata:
```

### Development Workflow

- **Backend dev:** `cd backend && ./mvnw quarkus:dev` (hot reload on port 8080)
- **Frontend dev:** `cd frontend && npm run dev` (Vite dev server on port 5173, proxy API to 8080)
- **Full stack:** `docker compose up --build`

## 8. Security Considerations

- **Password Storage:** bcrypt hashing via Quarkus Elytron
- **SQL Injection:** Prevented by Hibernate ORM parameterized queries
- **XSS:** React escapes output by default; avoid rendering raw HTML from untrusted sources
- **CORS:** Restricted to frontend origin in dev; locked down in production
- **Input Validation:** Bean Validation on backend DTOs; form validation on frontend
- **Authorization:** Every data query is scoped to the authenticated user's ID (multi-tenant data isolation)
- **JWT Security:** RS256 signed tokens with expiration; secrets never exposed to frontend
