# User Stories - Expense Tracker App

## Overview

This document contains all user stories derived from the Product Requirements Document, UX flows, and architecture specifications. Stories are prioritized by dependency order: authentication first, then core CRUD, then supporting features, and finally reporting.

---

### US-01: User Registration

**As a** new user, **I want** to create an account with my email and password, **so that** I can start tracking my personal expenses.

**Acceptance Criteria:**
- [ ] Registration form is displayed at `/register` with fields: Email, Password, Confirm Password
- [ ] Email is validated for proper format and uniqueness
- [ ] Password requires a minimum of 8 characters
- [ ] Confirm Password must match Password field
- [ ] Inline validation errors are shown below each field on blur and on submit
- [ ] On successful registration, user is redirected to `/login` with a success message: "Account created. Please log in."
- [ ] If the email is already registered, an error message is displayed: "An account with this email already exists."
- [ ] Password is securely hashed with bcrypt before storage
- [ ] A "Already have an account? Log in" link navigates to `/login`

---

### US-02: User Login/Logout

**As a** registered user, **I want** to log in with my email and password and log out when done, **so that** my expense data is secure and only accessible to me.

**Acceptance Criteria:**
- [ ] Login form is displayed at `/login` with Email and Password fields
- [ ] Both fields are validated as non-empty before submission
- [ ] On successful login, a JWT token is returned and stored, and the user is redirected to `/dashboard`
- [ ] Invalid credentials display an error: "Invalid email or password."
- [ ] Server errors display a generic banner: "Something went wrong. Please try again."
- [ ] A "Create account" link navigates to `/register`
- [ ] Logout clears the JWT token from storage and redirects to `/login`
- [ ] A toast "You have been logged out." is displayed after logout
- [ ] All protected routes redirect unauthenticated users to `/login`
- [ ] JWT token is included as `Authorization: Bearer <token>` header on all authenticated API requests

---

### US-03: Add Expense

**As a** logged-in user, **I want** to add a new expense with amount, category, date, and optional description, **so that** I can track my daily spending.

**Acceptance Criteria:**
- [ ] An "Add Expense" button is visible on the Dashboard and the Expenses list page
- [ ] The Add Expense form displays at `/expenses/new` with fields: Amount (required, numeric, USD), Category (required, dropdown), Date (required, date picker defaulting to today), Description (optional, max 200 characters)
- [ ] Amount must be a positive number greater than 0
- [ ] Category dropdown is populated with all default and user-created custom categories
- [ ] Date cannot be in the future
- [ ] Inline validation errors are shown below each invalid field
- [ ] On successful save, user is redirected to the Expenses list with a toast: "Expense added."
- [ ] A "Cancel" button returns the user to the previous page
- [ ] Backend stores the expense linked to the authenticated user

---

### US-04: View and Filter Expenses

**As a** logged-in user, **I want** to view all my expenses in a list and filter them by category and date range, **so that** I can review my spending history.

**Acceptance Criteria:**
- [ ] Expenses list page is accessible at `/expenses` via the main navigation
- [ ] Expenses are displayed in reverse chronological order by default
- [ ] Each expense row shows: Date, Category (with color indicator), Description, and Amount
- [ ] A filter bar at the top provides: Category dropdown (with "All Categories" default), Start Date picker, and End Date picker
- [ ] Filters can be applied to narrow down the expense list
- [ ] A "Clear filters" link appears when any filter is active
- [ ] If no expenses match the filters, display: "No expenses found for the selected filters."
- [ ] Pagination is shown at the bottom with 10 items per page (Previous/Next buttons, page numbers, "Showing X-Y of Z")
- [ ] If the user has no expenses at all, an empty state is shown: "No expenses yet. Start tracking your spending!" with an "Add Your First Expense" button
- [ ] Loading failure shows an error message with a Retry button
- [ ] Clicking an expense row opens the Edit Expense form
- [ ] On mobile, expenses are displayed as cards instead of a table

---

### US-05: Edit Expense

**As a** logged-in user, **I want** to edit an existing expense, **so that** I can correct mistakes or update details.

**Acceptance Criteria:**
- [ ] Clicking an expense row or the edit icon navigates to `/expenses/:id/edit`
- [ ] The Edit Expense form is pre-populated with the existing expense data
- [ ] All fields (Amount, Category, Date, Description) can be modified
- [ ] Same validation rules as Add Expense apply
- [ ] On successful save, user returns to the Expenses list with a toast: "Expense updated."
- [ ] A "Cancel" button returns to the Expenses list without saving
- [ ] A "Delete" button is visible on the edit form (triggers delete flow)
- [ ] If the expense no longer exists, an error is shown: "This expense no longer exists."
- [ ] Only the expense owner can edit their own expenses (backend authorization)

---

### US-06: Delete Expense

**As a** logged-in user, **I want** to delete an expense, **so that** I can remove incorrect or unwanted entries.

**Acceptance Criteria:**
- [ ] Delete can be triggered from the delete icon on an expense row or the "Delete" button on the Edit Expense form
- [ ] A confirmation dialog appears: "Are you sure you want to delete this expense? This action cannot be undone."
- [ ] "Cancel" dismisses the dialog without deleting
- [ ] "Delete" confirms and sends a DELETE request to the API
- [ ] On successful deletion, the expense is removed from the list and a toast appears: "Expense deleted."
- [ ] If deletion fails, an error message is shown: "Could not delete expense. Please try again."
- [ ] After deletion, user remains on (or returns to) the Expenses list
- [ ] Only the expense owner can delete their own expenses (backend authorization)

---

### US-07: Manage Categories

**As a** logged-in user, **I want** to view default categories and create custom categories, **so that** I can organize my expenses in a way that fits my lifestyle.

**Acceptance Criteria:**
- [ ] Categories page is accessible at `/categories` via the main navigation
- [ ] Default categories (Food, Transportation, Housing, Utilities, Entertainment, Healthcare, Shopping, Other) are listed with a "Default" label and cannot be edited or deleted
- [ ] Custom categories are listed separately with edit and delete icons
- [ ] Clicking "Add Category" shows an inline input field for the category name (max 50 characters)
- [ ] On save, the new custom category appears in the list with a toast: "Category added."
- [ ] Duplicate category names show an inline error: "A category with this name already exists."
- [ ] Empty category name shows an inline error: "Category name is required."
- [ ] Deleting a custom category shows a confirmation: "Delete category '[name]'? Expenses using this category will be reassigned to 'Other'."
- [ ] On delete confirmation, the category is removed and associated expenses are reassigned to "Other"
- [ ] Default categories are seeded on application startup

---

### US-08: Set Monthly Budget

**As a** logged-in user, **I want** to set a monthly budget amount, **so that** I can track my spending against a target.

**Acceptance Criteria:**
- [ ] Budget page is accessible at `/budget` via the main navigation
- [ ] If no budget is set, display: "You haven't set a monthly budget yet." with a "Set Budget" button
- [ ] Current monthly budget amount is displayed prominently with an "Edit" button
- [ ] Clicking "Edit" transforms the display into an input field with Save and Cancel buttons
- [ ] Budget amount must be a positive number
- [ ] On save, a toast appears: "Budget updated." and the page refreshes with the new value
- [ ] The page shows a monthly summary: Budget amount, Total Spent this month, Remaining (green if positive, red if over budget)
- [ ] A progress bar shows spending relative to budget (green 0-75%, amber 75-100%, red >100%)
- [ ] Budget is stored per user per month/year combination
- [ ] Invalid amounts show an inline error: "Please enter a valid positive number."

---

### US-09: View Dashboard and Reports

**As a** logged-in user, **I want** to see a dashboard with spending summaries, charts, and recent expenses, **so that** I can understand my financial habits at a glance.

**Acceptance Criteria:**
- [ ] Dashboard is the default landing page after login, accessible at `/dashboard`
- [ ] Four summary cards are displayed at the top: Total Spent this month, Budget Remaining (color-coded), Number of Transactions, Top Spending Category
- [ ] A Category Breakdown pie/donut chart shows spending distribution by category with a color legend
- [ ] A Monthly Trend bar/line chart shows total spending per month for the current year
- [ ] A "Recent Expenses" section shows the 5 most recent expenses with date, category, and amount
- [ ] A "View All" link under Recent Expenses navigates to `/expenses`
- [ ] A month/year selector allows viewing data for previous months
- [ ] Changing the month updates all summary cards and charts
- [ ] If no data exists for a month, appropriate empty states are shown (e.g., "No spending data for this month")
- [ ] Each section handles loading failures independently with a Retry button
- [ ] On mobile, summary cards stack vertically and charts take full width
