# Sprint Tasks - Expense Tracker App

## Infrastructure & Setup

### Backend Setup
- [x] [BACKEND] Initialize Quarkus project with Maven, adding extensions: rest-jackson, hibernate-orm-panache, jdbc-postgresql, smallrye-jwt, smallrye-jwt-build, hibernate-validator
- [x] [BACKEND] Configure `application.properties` with PostgreSQL connection, JWT settings, CORS policy, and HTTP port
- [x] [BACKEND] Generate RSA key pair (privateKey.pem, publicKey.pem) for JWT RS256 signing
- [x] [BACKEND] Create Docker Compose file with PostgreSQL service (database: expense_db, user: expense_user)
- [x] [BACKEND] Set up base project package structure: auth, expense, category, budget, report, common
- [x] [BACKEND] Create common exception classes (NotFoundException, ValidationException, ConflictException) and JAX-RS ExceptionMapper
- [x] [BACKEND] Create base entity class with id, createdAt, updatedAt fields and JPA lifecycle callbacks

### Frontend Setup
- [x] [FRONTEND] Initialize React project with Vite and TypeScript (`npm create vite@latest frontend -- --template react-ts`)
- [x] [FRONTEND] Install dependencies: react-router-dom, recharts, and dev dependencies
- [x] [FRONTEND] Configure Vite proxy to forward `/api` requests to backend at localhost:8080
- [x] [FRONTEND] Set up project folder structure: api/, components/, pages/, hooks/, context/, types/, utils/
- [x] [FRONTEND] Create CSS design tokens (variables) matching the UI-SPEC color palette, typography, spacing, and shadows
- [x] [FRONTEND] Create shared layout component with sidebar navigation (Dashboard, Expenses, Categories, Budget, Logout)
- [x] [FRONTEND] Create reusable UI components: Button (primary, secondary, danger, ghost), Input, Select, DatePicker, Toast notification system
- [x] [FRONTEND] Set up React Router v6 with route definitions for all pages (login, register, dashboard, expenses, categories, budget)
- [x] [FRONTEND] Create API client module with fetch wrapper that attaches JWT Authorization header and handles 401 redirects
- [x] [FRONTEND] Create AuthContext provider to manage JWT token and current user state
- [x] [FRONTEND] Create ProtectedRoute component that redirects unauthenticated users to /login
- [x] [FRONTEND] Create TypeScript type definitions for all API request/response shapes (User, Expense, Category, Budget, Report types)

---

## US-01: User Registration

### Backend Tasks
- [x] [BACKEND] Create User entity with JPA annotations mapping to the `users` table (id, email, passwordHash, name, createdAt, updatedAt)
- [x] [BACKEND] Create UserRepository extending PanacheRepository with findByEmail query method
- [x] [BACKEND] Create AuthService with register method: validate input, check email uniqueness, hash password with bcrypt, persist user, generate JWT token
- [x] [BACKEND] Create JwtService to generate signed JWT tokens with user claims (sub, email, name, iss, exp)
- [x] [BACKEND] Create RegisterRequest DTO with Bean Validation annotations (@Email, @NotBlank, @Size)
- [x] [BACKEND] Create AuthResponse DTO containing token string and user info
- [x] [BACKEND] Create AuthResource with POST /api/auth/register endpoint returning 201 with AuthResponse

### Frontend Tasks
- [x] [FRONTEND] Create Registration page component at `/register` with email, password, and confirm password fields
- [x] [FRONTEND] Implement client-side validation: email format, password min 8 chars, confirm password match
- [x] [FRONTEND] Display inline validation errors below each field on blur and on submit
- [x] [FRONTEND] Call POST /api/auth/register on form submit and handle success (redirect to /login with success message) and errors (duplicate email, server errors)
- [x] [FRONTEND] Add "Already have an account? Log in" link to navigate to /login

---

## US-02: User Login/Logout

### Backend Tasks
- [x] [BACKEND] Create AuthService login method: validate credentials, verify password hash, generate and return JWT token
- [x] [BACKEND] Create LoginRequest DTO with Bean Validation annotations
- [x] [BACKEND] Create AuthResource POST /api/auth/login endpoint returning 200 with AuthResponse
- [x] [BACKEND] Create AuthResource GET /api/auth/me endpoint returning the current authenticated user info from JWT claims
- [x] [BACKEND] Configure SmallRye JWT filter to validate tokens on all /api/* endpoints except /api/auth/login and /api/auth/register

### Frontend Tasks
- [x] [FRONTEND] Create Login page component at `/login` with email and password fields
- [x] [FRONTEND] Implement client-side validation: both fields required and non-empty
- [x] [FRONTEND] Call POST /api/auth/login on form submit, store JWT token in AuthContext/localStorage, and redirect to /dashboard
- [x] [FRONTEND] Display error messages for invalid credentials and server errors
- [x] [FRONTEND] Add "Don't have an account? Create account" link to navigate to /register
- [x] [FRONTEND] Implement logout functionality: clear JWT token, redirect to /login, show "You have been logged out." toast
- [x] [FRONTEND] Add user email display and Logout button to the sidebar navigation

---

## US-03: Add Expense

### Backend Tasks
- [x] [BACKEND] Create Expense entity with JPA annotations mapping to the `expenses` table (id, userId, categoryId, amount, date, description, createdAt, updatedAt) with @ManyToOne relations to User and Category
- [x] [BACKEND] Create ExpenseRepository extending PanacheRepository with query methods for filtering by user, category, and date range
- [x] [BACKEND] Create ExpenseService with createExpense method: validate input, verify category exists and is accessible, persist expense linked to authenticated user
- [x] [BACKEND] Create CreateExpenseRequest DTO with Bean Validation annotations (@NotNull, @Positive, @Size)
- [x] [BACKEND] Create ExpenseResponse DTO with nested CategoryResponse
- [x] [BACKEND] Create ExpenseResource with POST /api/expenses endpoint returning 201 with ExpenseResponse

### Frontend Tasks
- [x] [FRONTEND] Create Add Expense page component at `/expenses/new` with amount, category dropdown, date picker, and description fields
- [x] [FRONTEND] Fetch categories from GET /api/categories to populate the category dropdown
- [x] [FRONTEND] Set date picker default to today and prevent future dates
- [x] [FRONTEND] Implement client-side validation: amount positive, category selected, date present and not future
- [x] [FRONTEND] Call POST /api/expenses on form submit and handle success (redirect to /expenses with "Expense added." toast) and errors
- [x] [FRONTEND] Add Cancel button that returns to the Expenses list

---

## US-04: View and Filter Expenses

### Backend Tasks
- [x] [BACKEND] Create ExpenseResource GET /api/expenses endpoint with pagination (page, size) and optional filters (category, startDate, endDate)
- [x] [BACKEND] Implement ExpenseRepository query with dynamic filtering: filter by user_id (always), optional category_id, optional date range, ordered by date DESC
- [x] [BACKEND] Create PaginatedResponse wrapper DTO with content, page, size, totalElements, totalPages fields

### Frontend Tasks
- [x] [FRONTEND] Create Expenses list page component at `/expenses` with table layout (desktop) and card layout (mobile)
- [x] [FRONTEND] Display each expense with: Date (formatted "MMM DD, YYYY"), Category (colored badge), Description (truncated), Amount (right-aligned, monospace)
- [x] [FRONTEND] Create filter bar with Category dropdown ("All Categories" default), Start Date picker, End Date picker, and Apply/Clear controls
- [x] [FRONTEND] Implement pagination controls: page numbers, Previous/Next buttons, "Showing X-Y of Z" text (10 items per page)
- [x] [FRONTEND] Show empty state with illustration when no expenses exist: "No expenses yet. Start tracking your spending!" with "Add Your First Expense" button
- [x] [FRONTEND] Show "No expenses match your filters." with "Clear filters" link when filters return no results
- [x] [FRONTEND] Show loading skeletons while fetching and error state with Retry button on failure
- [x] [FRONTEND] Add "Add Expense" button in the page header that navigates to /expenses/new
- [x] [FRONTEND] Make expense rows clickable to navigate to /expenses/:id/edit

---

## US-05: Edit Expense

### Backend Tasks
- [x] [BACKEND] Create ExpenseResource GET /api/expenses/{id} endpoint returning a single expense (only if owned by the authenticated user)
- [x] [BACKEND] Create ExpenseService updateExpense method: validate input, verify ownership, verify category exists, update and persist
- [x] [BACKEND] Create ExpenseResource PUT /api/expenses/{id} endpoint returning 200 with updated ExpenseResponse

### Frontend Tasks
- [x] [FRONTEND] Create Edit Expense page component at `/expenses/:id/edit` reusing the expense form
- [x] [FRONTEND] Fetch existing expense data from GET /api/expenses/{id} and pre-populate the form
- [x] [FRONTEND] Call PUT /api/expenses/{id} on form submit and handle success (redirect to /expenses with "Expense updated." toast) and errors
- [x] [FRONTEND] Add Cancel button to return to the Expenses list without saving
- [x] [FRONTEND] Add Delete button (danger style) that triggers the delete confirmation dialog

---

## US-06: Delete Expense

### Backend Tasks
- [x] [BACKEND] Create ExpenseService deleteExpense method: verify ownership, delete expense
- [x] [BACKEND] Create ExpenseResource DELETE /api/expenses/{id} endpoint returning 204 No Content

### Frontend Tasks
- [x] [FRONTEND] Create reusable ConfirmationDialog component (modal with title, message, Cancel and confirm buttons, backdrop dismiss, focus trap)
- [x] [FRONTEND] Add delete icon button to each expense row in the Expenses list (visible on hover for desktop, always visible on mobile)
- [x] [FRONTEND] On delete trigger (row icon or Edit form Delete button), show confirmation: "Are you sure you want to delete this expense? This action cannot be undone."
- [x] [FRONTEND] Call DELETE /api/expenses/{id} on confirmation and handle success (remove from list, show "Expense deleted." toast) and errors

---

## US-07: Manage Categories

### Backend Tasks
- [x] [BACKEND] Create Category entity with JPA annotations mapping to the `categories` table (id, name, icon, isDefault, userId, createdAt)
- [x] [BACKEND] Create CategoryRepository extending PanacheRepository with query methods: findDefaults, findByUserId, findByNameAndUserId
- [x] [BACKEND] Create CategoryService with methods: getAllForUser (returns defaults + user custom), createCustomCategory (validate name uniqueness), deleteCustomCategory (reassign expenses to "Other")
- [x] [BACKEND] Create CreateCategoryRequest DTO and CategoryResponse DTO
- [x] [BACKEND] Create CategoryResource with GET /api/categories (list all for user) and POST /api/categories (create custom) endpoints
- [x] [BACKEND] Seed default categories (Food, Transportation, Housing, Utilities, Entertainment, Healthcare, Shopping, Other) on application startup using a Startup observer or import.sql

### Frontend Tasks
- [x] [FRONTEND] Create Categories page component at `/categories` displaying default categories (with "Default" label, no actions) and custom categories (with edit/delete icons)
- [x] [FRONTEND] Implement "Add Category" flow: click button, show inline input field (max 50 chars) with Save and Cancel
- [x] [FRONTEND] Call POST /api/categories on save and handle success (add to list, show "Category added." toast) and errors (duplicate name, empty name)
- [x] [FRONTEND] Implement delete custom category flow: show confirmation dialog "Delete category '[name]'? Expenses using this category will be reassigned to 'Other'.", call API on confirm

---

## US-08: Set Monthly Budget

### Backend Tasks
- [x] [BACKEND] Create Budget entity with JPA annotations mapping to the `budgets` table (id, userId, month, year, amount, createdAt, updatedAt) with unique constraint on (userId, month, year)
- [x] [BACKEND] Create BudgetRepository extending PanacheRepository with findByUserIdAndMonthAndYear query method
- [x] [BACKEND] Create BudgetService with methods: getMonthlyBudget (returns budget + spent + remaining), setMonthlyBudget (create or update)
- [x] [BACKEND] Create BudgetRequest DTO and BudgetResponse DTO (including calculated spent and remaining fields)
- [x] [BACKEND] Create BudgetResource with GET /api/budgets/monthly and PUT /api/budgets/monthly endpoints

### Frontend Tasks
- [x] [FRONTEND] Create Budget page component at `/budget` displaying current monthly budget with Edit button
- [x] [FRONTEND] Implement budget edit mode: transform display to input field with Save and Cancel buttons
- [x] [FRONTEND] Call PUT /api/budgets/monthly on save and handle success (show "Budget updated." toast, refresh display) and errors
- [x] [FRONTEND] Display monthly summary: Budget amount, Spent amount, Remaining amount (green/red color coding)
- [x] [FRONTEND] Display progress bar showing spending vs budget (green 0-75%, amber 75-100%, red >100%)
- [x] [FRONTEND] Show "You haven't set a monthly budget yet." with "Set Budget" button when no budget exists

---

## US-09: View Dashboard and Reports

### Backend Tasks
- [x] [BACKEND] Create ReportService with methods: getMonthlySummary (total spent, transaction count, top category, budget info), getSpendingByCategory (category breakdown with amounts and percentages), getMonthlyTrend (12 months of spending data)
- [x] [BACKEND] Create ReportResource with GET /api/reports/summary endpoint returning monthly summary
- [x] [BACKEND] Create ReportResource with GET /api/reports/by-category endpoint returning category breakdown array
- [x] [BACKEND] Create ReportResource with GET /api/reports/monthly-trend endpoint returning 12-month trend data
- [x] [BACKEND] Create response DTOs: MonthlySummaryResponse, CategoryBreakdownResponse, MonthlyTrendResponse

### Frontend Tasks
- [x] [FRONTEND] Create Dashboard page component at `/dashboard` as the default authenticated landing page
- [x] [FRONTEND] Create four summary cards: Total Spent, Budget Remaining (color-coded), Transactions count, Top Category (with colored dot)
- [x] [FRONTEND] Integrate Recharts pie/donut chart for category breakdown with category color palette and legend (name, color swatch, amount, percentage)
- [x] [FRONTEND] Integrate Recharts bar chart for monthly spending trend (X: month labels, Y: dollar amounts, tooltip on hover)
- [x] [FRONTEND] Create Recent Expenses section showing the 5 most recent expenses with a "View All" link to /expenses
- [x] [FRONTEND] Add month/year selector in the page header that updates all dashboard data when changed
- [x] [FRONTEND] Handle empty states for each section (e.g., "No spending data for this month" for charts)
- [x] [FRONTEND] Handle loading states (skeleton placeholders) and error states (Retry button) independently for each section
