# API Specification - Expense Tracker App

## Base URL

```
http://localhost:8080/api
```

## Authentication

All endpoints except `/api/auth/register` and `/api/auth/login` require a valid JWT token in the `Authorization` header:

```
Authorization: Bearer <jwt-token>
```

Unauthorized requests return `401 Unauthorized`.

## Common Response Formats

### Error Response

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable error description"
}
```

### Pagination Response Wrapper

```json
{
  "content": [...],
  "page": 0,
  "size": 20,
  "totalElements": 100,
  "totalPages": 5
}
```

---

## 1. Authentication Endpoints

### POST /api/auth/register

Register a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| email | string | Yes | Valid email format, max 255 chars |
| password | string | Yes | Min 8 characters |
| name | string | Yes | Min 1, max 100 characters |

**Response: 201 Created**

```json
{
  "token": "eyJhbGciOiJSUzI1NiJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Error Responses:**

| Code | Error | Description |
|------|-------|-------------|
| 400 | VALIDATION_ERROR | Invalid input (missing fields, bad email format, short password) |
| 409 | EMAIL_EXISTS | An account with this email already exists |

---

### POST /api/auth/login

Authenticate a user and receive a JWT token.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| email | string | Yes | Valid email format |
| password | string | Yes | Non-empty |

**Response: 200 OK**

```json
{
  "token": "eyJhbGciOiJSUzI1NiJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Error Responses:**

| Code | Error | Description |
|------|-------|-------------|
| 400 | VALIDATION_ERROR | Missing or invalid input fields |
| 401 | INVALID_CREDENTIALS | Email or password is incorrect |

---

### GET /api/auth/me

Get the currently authenticated user's information.

**Headers:** `Authorization: Bearer <token>` (required)

**Response: 200 OK**

```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Error Responses:**

| Code | Error | Description |
|------|-------|-------------|
| 401 | UNAUTHORIZED | Missing or invalid JWT token |

---

## 2. Expense Endpoints

All expense endpoints require authentication.

### GET /api/expenses

Get a paginated list of the current user's expenses, sorted by date descending.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| category | long | No | - | Filter by category ID |
| startDate | string (YYYY-MM-DD) | No | - | Filter expenses on or after this date |
| endDate | string (YYYY-MM-DD) | No | - | Filter expenses on or before this date |
| page | int | No | 0 | Page number (0-indexed) |
| size | int | No | 20 | Page size (max 100) |

**Response: 200 OK**

```json
{
  "content": [
    {
      "id": 1,
      "amount": 45.99,
      "category": {
        "id": 2,
        "name": "Food",
        "icon": "utensils"
      },
      "date": "2026-02-10",
      "description": "Grocery shopping",
      "createdAt": "2026-02-10T14:30:00Z",
      "updatedAt": "2026-02-10T14:30:00Z"
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 45,
  "totalPages": 3
}
```

**Error Responses:**

| Code | Error | Description |
|------|-------|-------------|
| 400 | VALIDATION_ERROR | Invalid date format or parameter values |
| 401 | UNAUTHORIZED | Missing or invalid JWT token |

---

### POST /api/expenses

Create a new expense.

**Request Body:**

```json
{
  "amount": 45.99,
  "categoryId": 2,
  "date": "2026-02-10",
  "description": "Grocery shopping"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| amount | decimal | Yes | Greater than 0, max 2 decimal places |
| categoryId | long | Yes | Must reference an existing category accessible to the user |
| date | string (YYYY-MM-DD) | Yes | Valid date |
| description | string | No | Max 500 characters |

**Response: 201 Created**

```json
{
  "id": 1,
  "amount": 45.99,
  "category": {
    "id": 2,
    "name": "Food",
    "icon": "utensils"
  },
  "date": "2026-02-10",
  "description": "Grocery shopping",
  "createdAt": "2026-02-10T14:30:00Z",
  "updatedAt": "2026-02-10T14:30:00Z"
}
```

**Error Responses:**

| Code | Error | Description |
|------|-------|-------------|
| 400 | VALIDATION_ERROR | Invalid input data |
| 401 | UNAUTHORIZED | Missing or invalid JWT token |
| 404 | CATEGORY_NOT_FOUND | The specified category does not exist |

---

### GET /api/expenses/{id}

Get a single expense by ID.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | long | Expense ID |

**Response: 200 OK**

```json
{
  "id": 1,
  "amount": 45.99,
  "category": {
    "id": 2,
    "name": "Food",
    "icon": "utensils"
  },
  "date": "2026-02-10",
  "description": "Grocery shopping",
  "createdAt": "2026-02-10T14:30:00Z",
  "updatedAt": "2026-02-10T14:30:00Z"
}
```

**Error Responses:**

| Code | Error | Description |
|------|-------|-------------|
| 401 | UNAUTHORIZED | Missing or invalid JWT token |
| 404 | NOT_FOUND | Expense not found or does not belong to the user |

---

### PUT /api/expenses/{id}

Update an existing expense.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | long | Expense ID |

**Request Body:**

```json
{
  "amount": 52.00,
  "categoryId": 2,
  "date": "2026-02-10",
  "description": "Grocery shopping - updated"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| amount | decimal | Yes | Greater than 0, max 2 decimal places |
| categoryId | long | Yes | Must reference an existing category accessible to the user |
| date | string (YYYY-MM-DD) | Yes | Valid date |
| description | string | No | Max 500 characters |

**Response: 200 OK**

```json
{
  "id": 1,
  "amount": 52.00,
  "category": {
    "id": 2,
    "name": "Food",
    "icon": "utensils"
  },
  "date": "2026-02-10",
  "description": "Grocery shopping - updated",
  "createdAt": "2026-02-10T14:30:00Z",
  "updatedAt": "2026-02-10T15:00:00Z"
}
```

**Error Responses:**

| Code | Error | Description |
|------|-------|-------------|
| 400 | VALIDATION_ERROR | Invalid input data |
| 401 | UNAUTHORIZED | Missing or invalid JWT token |
| 404 | NOT_FOUND | Expense not found or does not belong to the user |
| 404 | CATEGORY_NOT_FOUND | The specified category does not exist |

---

### DELETE /api/expenses/{id}

Delete an expense.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | long | Expense ID |

**Response: 204 No Content**

(Empty response body)

**Error Responses:**

| Code | Error | Description |
|------|-------|-------------|
| 401 | UNAUTHORIZED | Missing or invalid JWT token |
| 404 | NOT_FOUND | Expense not found or does not belong to the user |

---

## 3. Category Endpoints

### GET /api/categories

Get all categories available to the current user (default categories + user's custom categories).

**Headers:** `Authorization: Bearer <token>` (required)

**Response: 200 OK**

```json
[
  {
    "id": 1,
    "name": "Food",
    "icon": "utensils",
    "isDefault": true
  },
  {
    "id": 2,
    "name": "Transportation",
    "icon": "car",
    "isDefault": true
  },
  {
    "id": 9,
    "name": "Pet Supplies",
    "icon": "paw",
    "isDefault": false
  }
]
```

**Error Responses:**

| Code | Error | Description |
|------|-------|-------------|
| 401 | UNAUTHORIZED | Missing or invalid JWT token |

---

### POST /api/categories

Create a custom category for the current user.

**Headers:** `Authorization: Bearer <token>` (required)

**Request Body:**

```json
{
  "name": "Pet Supplies",
  "icon": "paw"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| name | string | Yes | Min 1, max 50 characters, unique per user |
| icon | string | No | Max 50 characters (icon identifier) |

**Response: 201 Created**

```json
{
  "id": 9,
  "name": "Pet Supplies",
  "icon": "paw",
  "isDefault": false
}
```

**Error Responses:**

| Code | Error | Description |
|------|-------|-------------|
| 400 | VALIDATION_ERROR | Invalid input data |
| 401 | UNAUTHORIZED | Missing or invalid JWT token |
| 409 | CATEGORY_EXISTS | A category with this name already exists for the user |

---

## 4. Budget Endpoints

All budget endpoints require authentication.

### GET /api/budgets/monthly

Get the monthly budget for a specific month/year.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| month | int | No | Current month | Month (1-12) |
| year | int | No | Current year | Year (e.g., 2026) |

**Response: 200 OK**

```json
{
  "id": 1,
  "month": 2,
  "year": 2026,
  "amount": 2000.00,
  "spent": 1245.50,
  "remaining": 754.50
}
```

If no budget is set for the requested month, `amount` is `null` and `spent` / `remaining` are still calculated:

```json
{
  "id": null,
  "month": 2,
  "year": 2026,
  "amount": null,
  "spent": 1245.50,
  "remaining": null
}
```

**Error Responses:**

| Code | Error | Description |
|------|-------|-------------|
| 400 | VALIDATION_ERROR | Invalid month or year values |
| 401 | UNAUTHORIZED | Missing or invalid JWT token |

---

### PUT /api/budgets/monthly

Set or update the monthly budget.

**Request Body:**

```json
{
  "month": 2,
  "year": 2026,
  "amount": 2000.00
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| month | int | Yes | 1-12 |
| year | int | Yes | Reasonable year range (2000-2100) |
| amount | decimal | Yes | Greater than 0, max 2 decimal places |

**Response: 200 OK**

```json
{
  "id": 1,
  "month": 2,
  "year": 2026,
  "amount": 2000.00,
  "spent": 1245.50,
  "remaining": 754.50
}
```

**Error Responses:**

| Code | Error | Description |
|------|-------|-------------|
| 400 | VALIDATION_ERROR | Invalid input data |
| 401 | UNAUTHORIZED | Missing or invalid JWT token |

---

## 5. Reports / Dashboard Endpoints

All report endpoints require authentication.

### GET /api/reports/summary

Get a monthly spending summary.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| month | int | No | Current month | Month (1-12) |
| year | int | No | Current year | Year (e.g., 2026) |

**Response: 200 OK**

```json
{
  "month": 2,
  "year": 2026,
  "totalSpent": 1245.50,
  "transactionCount": 23,
  "topCategory": {
    "id": 1,
    "name": "Food",
    "icon": "utensils",
    "amount": 450.00
  },
  "budgetAmount": 2000.00,
  "budgetRemaining": 754.50
}
```

If no expenses exist for the month:

```json
{
  "month": 2,
  "year": 2026,
  "totalSpent": 0,
  "transactionCount": 0,
  "topCategory": null,
  "budgetAmount": 2000.00,
  "budgetRemaining": 2000.00
}
```

**Error Responses:**

| Code | Error | Description |
|------|-------|-------------|
| 400 | VALIDATION_ERROR | Invalid month or year values |
| 401 | UNAUTHORIZED | Missing or invalid JWT token |

---

### GET /api/reports/by-category

Get spending breakdown by category for a specific month.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| month | int | No | Current month | Month (1-12) |
| year | int | No | Current year | Year (e.g., 2026) |

**Response: 200 OK**

```json
[
  {
    "category": {
      "id": 1,
      "name": "Food",
      "icon": "utensils"
    },
    "totalAmount": 450.00,
    "transactionCount": 12,
    "percentage": 36.1
  },
  {
    "category": {
      "id": 2,
      "name": "Transportation",
      "icon": "car"
    },
    "totalAmount": 200.00,
    "transactionCount": 5,
    "percentage": 16.1
  }
]
```

**Error Responses:**

| Code | Error | Description |
|------|-------|-------------|
| 400 | VALIDATION_ERROR | Invalid month or year values |
| 401 | UNAUTHORIZED | Missing or invalid JWT token |

---

### GET /api/reports/monthly-trend

Get monthly spending totals over a year for trend analysis.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| year | int | No | Current year | Year (e.g., 2026) |

**Response: 200 OK**

```json
[
  { "month": 1, "year": 2026, "totalSpent": 1800.00, "transactionCount": 30 },
  { "month": 2, "year": 2026, "totalSpent": 1245.50, "transactionCount": 23 },
  { "month": 3, "year": 2026, "totalSpent": 0, "transactionCount": 0 },
  { "month": 4, "year": 2026, "totalSpent": 0, "transactionCount": 0 },
  { "month": 5, "year": 2026, "totalSpent": 0, "transactionCount": 0 },
  { "month": 6, "year": 2026, "totalSpent": 0, "transactionCount": 0 },
  { "month": 7, "year": 2026, "totalSpent": 0, "transactionCount": 0 },
  { "month": 8, "year": 2026, "totalSpent": 0, "transactionCount": 0 },
  { "month": 9, "year": 2026, "totalSpent": 0, "transactionCount": 0 },
  { "month": 10, "year": 2026, "totalSpent": 0, "transactionCount": 0 },
  { "month": 11, "year": 2026, "totalSpent": 0, "transactionCount": 0 },
  { "month": 12, "year": 2026, "totalSpent": 0, "transactionCount": 0 }
]
```

Always returns all 12 months for the requested year, with 0 values for months with no expenses.

**Error Responses:**

| Code | Error | Description |
|------|-------|-------------|
| 400 | VALIDATION_ERROR | Invalid year value |
| 401 | UNAUTHORIZED | Missing or invalid JWT token |
