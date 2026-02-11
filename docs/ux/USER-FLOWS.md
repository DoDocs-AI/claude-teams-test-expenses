# User Flows - Expense Tracker App

## Overview

This document defines all user journeys for the Expense Tracker application. Each flow describes the entry point, step-by-step actions, success and error states, and navigation paths.

---

## Flow 1: Registration

**Entry Point:** `/register` page, or "Create account" link on the Login page.

### Steps
1. User navigates to the app URL and sees the Login page.
2. User clicks the "Create account" link below the login form.
3. The Registration form is displayed with fields: Email, Password, Confirm Password.
4. User fills in all fields and clicks "Register".
5. Frontend validates:
   - Email is a valid format and not empty.
   - Password is at least 8 characters.
   - Password and Confirm Password match.
6. If validation passes, a registration API request is sent.
7. On success, the user is redirected to the Login page with a success message: "Account created. Please log in."

### Error States
- **Validation error:** Inline error messages appear below the relevant field (e.g., "Invalid email format", "Password must be at least 8 characters", "Passwords do not match").
- **Email already registered:** An error message appears: "An account with this email already exists."
- **Server error:** A generic error banner appears at the top: "Something went wrong. Please try again."

### Navigation
- "Already have an account? Log in" link navigates to `/login`.

---

## Flow 2: Login

**Entry Point:** `/login` page (default landing page for unauthenticated users).

### Steps
1. User sees the Login form with Email and Password fields.
2. User enters their credentials and clicks "Log In".
3. Frontend validates that both fields are non-empty.
4. A login API request is sent.
5. On success, the JWT token is stored in memory/localStorage and the user is redirected to the Dashboard (`/dashboard`).

### Error States
- **Empty fields:** Inline error: "Email is required", "Password is required".
- **Invalid credentials:** Error message above the form: "Invalid email or password."
- **Server error:** Generic error banner: "Something went wrong. Please try again."

### Navigation
- "Create account" link navigates to `/register`.
- After successful login, user is redirected to `/dashboard`.

---

## Flow 3: Add New Expense

**Entry Point:** "Add Expense" button visible on the Dashboard and the Expenses list page. Also accessible via `/expenses/new`.

### Steps
1. User clicks the "Add Expense" button.
2. The Add Expense form opens (as a dedicated page or modal).
3. Form fields:
   - **Amount** (required): numeric input, USD. Placeholder: "0.00".
   - **Category** (required): dropdown populated with default + custom categories.
   - **Date** (required): date picker, defaults to today.
   - **Description** (optional): text input, max 200 characters.
4. User fills in the fields and clicks "Save".
5. Frontend validates:
   - Amount is a positive number greater than 0.
   - Category is selected.
   - Date is present and not in the future.
6. An API request creates the expense.
7. On success, user is redirected to the Expenses list with a success toast: "Expense added."

### Error States
- **Validation error:** Inline errors below each invalid field.
- **Server error:** Error banner: "Could not save expense. Please try again."

### Navigation
- "Cancel" button returns user to the previous page (Expenses list or Dashboard).
- After save, user returns to the Expenses list.

---

## Flow 4: View and Filter Expenses

**Entry Point:** "Expenses" link in the navigation sidebar/top nav, navigates to `/expenses`.

### Steps
1. User clicks "Expenses" in the navigation.
2. The Expenses list page loads showing all expenses in reverse chronological order.
3. Each row displays: Date, Category (with color indicator), Description, Amount.
4. User can filter by:
   - **Category:** dropdown to select a specific category or "All".
   - **Date range:** start date and end date pickers.
5. User selects filter criteria and clicks "Apply" (or filters apply on change).
6. The list updates to show only matching expenses.
7. If no expenses match, a message displays: "No expenses found for the selected filters."
8. Pagination controls appear at the bottom if there are more than 10 items per page.

### Error States
- **Loading failure:** Error message: "Could not load expenses. Please try again." with a Retry button.
- **Empty state (no expenses ever):** Illustrated empty state: "No expenses yet. Add your first expense!" with an "Add Expense" button.

### Navigation
- Clicking an expense row opens the Edit Expense form.
- "Add Expense" button is always visible at the top of the list.

---

## Flow 5: Edit Expense

**Entry Point:** Clicking on an expense row in the Expenses list, or clicking the edit icon on an expense row.

### Steps
1. User clicks an expense row or the edit icon.
2. The Edit Expense form opens pre-populated with the expense data.
3. User modifies any fields (Amount, Category, Date, Description).
4. User clicks "Save Changes".
5. Same validation as Add Expense.
6. An API request updates the expense.
7. On success, user returns to the Expenses list with a toast: "Expense updated."

### Error States
- Same validation errors as Add Expense.
- **Not found:** If the expense was deleted by another session: "This expense no longer exists."
- **Server error:** Error banner: "Could not update expense. Please try again."

### Navigation
- "Cancel" returns to the Expenses list without saving.
- "Delete" button is also visible on this form (see Flow 6).

---

## Flow 6: Delete Expense

**Entry Point:** Delete icon/button on an expense row in the list, or "Delete" button on the Edit Expense form.

### Steps
1. User clicks the delete icon or "Delete" button.
2. A confirmation dialog appears: "Are you sure you want to delete this expense? This action cannot be undone."
3. User clicks "Delete" to confirm or "Cancel" to dismiss.
4. On confirm, an API request deletes the expense.
5. On success, the expense is removed from the list and a toast appears: "Expense deleted."

### Error States
- **Server error:** Error message: "Could not delete expense. Please try again."

### Navigation
- After deletion, user remains on the Expenses list (or is returned to it if deleting from the Edit form).

---

## Flow 7: Manage Categories

**Entry Point:** "Categories" link in the navigation sidebar/top nav, navigates to `/categories`.

### Steps
1. User clicks "Categories" in the navigation.
2. The Categories page loads showing a list of all categories (default and custom).
3. Default categories are displayed with a "Default" label and cannot be edited or deleted.
4. Custom categories show edit and delete icons.
5. To add a custom category:
   a. User clicks "Add Category" button.
   b. An inline input field appears at the top of the list (or a small form).
   c. User types the category name (max 50 characters) and clicks "Save" or presses Enter.
   d. On success, the new category appears in the list with a toast: "Category added."
6. To delete a custom category:
   a. User clicks the delete icon next to a custom category.
   b. Confirmation dialog: "Delete category '[name]'? Expenses using this category will be reassigned to 'Other'."
   c. On confirm, the category is deleted.

### Error States
- **Duplicate name:** Inline error: "A category with this name already exists."
- **Empty name:** Inline error: "Category name is required."
- **Server error:** Error banner: "Could not save category. Please try again."

### Navigation
- Categories page is a standalone page accessible from the main navigation.

---

## Flow 8: Set Monthly Budget

**Entry Point:** "Budget" link in the navigation sidebar/top nav, navigates to `/budget`.

### Steps
1. User clicks "Budget" in the navigation.
2. The Budget page loads showing:
   - Current monthly budget amount (or "No budget set" if not configured).
   - Current month's total spending.
   - Remaining budget (budget minus spending), displayed with color coding (green if positive, red if over budget).
   - A simple progress bar showing spending relative to budget.
3. User clicks "Edit Budget" (or the budget amount is directly editable).
4. An input field is displayed for the monthly budget amount.
5. User enters a positive number and clicks "Save".
6. On success, the page updates with a toast: "Budget updated."

### Error States
- **Invalid amount:** Inline error: "Please enter a valid positive number."
- **Server error:** Error banner: "Could not save budget. Please try again."

### Navigation
- Budget page is a standalone page accessible from the main navigation.

---

## Flow 9: View Dashboard and Reports

**Entry Point:** "Dashboard" link in the navigation (first item), navigates to `/dashboard`. This is the default landing page after login.

### Steps
1. User clicks "Dashboard" in the navigation (or is redirected here after login).
2. The Dashboard loads and displays:
   - **Summary Cards** (top row):
     - Total Spent this month (with dollar amount).
     - Monthly Budget remaining (with dollar amount, color-coded).
     - Number of transactions this month.
     - Top spending category this month.
   - **Category Breakdown Chart**: Pie/donut chart showing spending distribution by category for the current month.
   - **Monthly Trend Chart**: Bar or line chart showing total spending per month for the last 6 months.
   - **Recent Expenses**: A compact list of the 5 most recent expenses with date, category, and amount.
3. User can change the reporting month using a month/year selector to view historical data.
4. Charts and summary cards update to reflect the selected month.

### Error States
- **Loading failure:** Error message with Retry button for each section that failed to load.
- **No data:** Sections display appropriate empty states (e.g., chart placeholder with "No spending data for this month").

### Navigation
- Clicking "View All" under Recent Expenses navigates to `/expenses`.
- Clicking on a chart segment could filter the Expenses list by that category (optional enhancement).

---

## Flow 10: Logout

**Entry Point:** User avatar/menu or "Logout" button in the navigation sidebar/top nav.

### Steps
1. User clicks "Logout" in the navigation or user menu.
2. The JWT token is cleared from storage.
3. User is immediately redirected to the Login page (`/login`).
4. A brief toast message appears: "You have been logged out."

### Error States
- Logout is a client-side operation (clear token + redirect), so server errors are unlikely. If token invalidation on the server fails, the client still proceeds with local cleanup.

### Navigation
- After logout, all navigation links redirect to `/login`.
- Attempting to access any authenticated page redirects to `/login`.

---

## Route Summary

| Route | Page | Auth Required |
|---|---|---|
| `/login` | Login | No |
| `/register` | Registration | No |
| `/dashboard` | Dashboard & Reports | Yes |
| `/expenses` | Expenses List | Yes |
| `/expenses/new` | Add Expense | Yes |
| `/expenses/:id/edit` | Edit Expense | Yes |
| `/categories` | Manage Categories | Yes |
| `/budget` | Budget Settings | Yes |

## Navigation Structure

The main navigation is a **sidebar** (desktop) that collapses to a **hamburger menu** (mobile/tablet) with the following items:

1. **Dashboard** (icon: chart/home) - `/dashboard`
2. **Expenses** (icon: receipt/list) - `/expenses`
3. **Categories** (icon: tag) - `/categories`
4. **Budget** (icon: wallet) - `/budget`
5. **Logout** (icon: exit) - at the bottom of the sidebar

The user's email is displayed at the top of the sidebar.
