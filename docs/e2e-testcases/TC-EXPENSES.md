# TC-EXPENSES: Expense Management Test Cases

## Overview
End-to-end test cases for adding, viewing, filtering, editing, deleting, and paginating expenses.

---

## Add Expense Tests

### TC-EXP-001: Add expense with all fields
**Priority:** P0
**Description:** Verify that a user can create an expense with all fields filled in (amount, category, date, description).
**Preconditions:**
- User is logged in
- At least one category exists (default categories are available)

**Steps:**
1. Navigate to the Expenses page (`/expenses`) or click "Add Expense" from the Dashboard
2. Click the "Add Expense" button (or navigate to `/expenses/new`)
3. Enter "45.99" in the Amount field
4. Select "Food" from the Category dropdown
5. Select today's date in the Date picker
6. Enter "Grocery shopping at the supermarket" in the Description field
7. Click the "Save Expense" button

**Expected Results:**
- User is redirected to the Expenses list (`/expenses`)
- A success toast "Expense added." is displayed
- The new expense appears in the list with the correct amount ($45.99), category (Food), date, and description
- The expense is listed at the top (reverse chronological order)

---

### TC-EXP-002: Add expense with minimum required fields
**Priority:** P0
**Description:** Verify that an expense can be created with only the required fields (amount, category, date) and no description.
**Preconditions:**
- User is logged in

**Steps:**
1. Navigate to `/expenses/new`
2. Enter "10.00" in the Amount field
3. Select "Transportation" from the Category dropdown
4. Confirm the Date field defaults to today's date
5. Leave the Description field empty
6. Click the "Save Expense" button

**Expected Results:**
- User is redirected to the Expenses list
- A success toast "Expense added." is displayed
- The expense appears in the list with the correct amount ($10.00), category (Transportation), and today's date
- The description column/field is empty or shows a dash

---

### TC-EXP-003: Add expense with invalid amount (zero)
**Priority:** P1
**Description:** Verify that an expense with a zero amount is rejected by validation.
**Preconditions:**
- User is logged in
- User is on the Add Expense form (`/expenses/new`)

**Steps:**
1. Enter "0" in the Amount field
2. Select any category
3. Confirm a date is selected
4. Click the "Save Expense" button

**Expected Results:**
- An inline validation error appears below the Amount field (e.g., "Amount must be greater than 0")
- The expense is not saved
- User remains on the Add Expense form

---

### TC-EXP-004: Add expense with invalid amount (negative)
**Priority:** P1
**Description:** Verify that a negative amount is rejected by validation.
**Preconditions:**
- User is logged in
- User is on the Add Expense form (`/expenses/new`)

**Steps:**
1. Enter "-25.00" in the Amount field
2. Select any category
3. Confirm a date is selected
4. Click the "Save Expense" button

**Expected Results:**
- An inline validation error appears below the Amount field
- The expense is not saved
- User remains on the Add Expense form

---

### TC-EXP-005: Add expense without required fields
**Priority:** P1
**Description:** Verify that the form enforces all required fields (amount, category, date).
**Preconditions:**
- User is logged in
- User is on the Add Expense form (`/expenses/new`)

**Steps:**
1. Leave the Amount field empty
2. Leave the Category dropdown unselected (placeholder "Select a category")
3. Clear the Date field if pre-populated
4. Click the "Save Expense" button

**Expected Results:**
- Inline validation errors appear for each empty required field
- The expense is not saved
- User remains on the Add Expense form
- Error messages clear when the corresponding fields are filled in

---

### TC-EXP-006: Add expense cancel action
**Priority:** P2
**Description:** Verify that clicking Cancel on the Add Expense form returns to the previous page without saving.
**Preconditions:**
- User is logged in
- User is on the Expenses list page

**Steps:**
1. Click "Add Expense" to open the form
2. Enter "99.99" in the Amount field
3. Select "Entertainment" from the Category dropdown
4. Click the "Cancel" button

**Expected Results:**
- User is returned to the Expenses list
- No new expense is created
- No success or error toast is shown
- The expense with amount $99.99 does not appear in the list

---

## View Expenses Tests

### TC-EXP-007: View expenses list
**Priority:** P0
**Description:** Verify that the expenses list page displays all user expenses in reverse chronological order.
**Preconditions:**
- User is logged in
- User has at least 3 expenses created on different dates

**Steps:**
1. Navigate to the Expenses page (`/expenses`) via the sidebar navigation
2. Observe the expenses list

**Expected Results:**
- The Expenses page loads with a page title "Expenses"
- An "Add Expense" button is visible at the top
- Expenses are listed in reverse chronological order (newest first)
- Each expense row displays: Date (formatted as "MMM DD, YYYY"), Category (with color indicator/badge), Description, and Amount (right-aligned, formatted as "$X,XXX.XX")
- The filter bar is visible above the list with Category dropdown and date range pickers

---

### TC-EXP-008: View expenses empty state
**Priority:** P2
**Description:** Verify the empty state is displayed when a user has no expenses.
**Preconditions:**
- User is logged in
- User has zero expenses

**Steps:**
1. Navigate to the Expenses page (`/expenses`)

**Expected Results:**
- An empty state illustration/icon is displayed
- Text reads "No expenses yet. Start tracking your spending!" (or similar)
- An "Add Your First Expense" button is visible
- Clicking the button navigates to the Add Expense form
- No table/list headers are shown (or they are shown with the empty state below)
- Pagination is not displayed

---

## Filter Expenses Tests

### TC-EXP-009: Filter expenses by category
**Priority:** P1
**Description:** Verify that expenses can be filtered by selecting a specific category.
**Preconditions:**
- User is logged in
- User has expenses in at least 3 different categories (e.g., Food, Transportation, Entertainment)

**Steps:**
1. Navigate to the Expenses page (`/expenses`)
2. Open the Category dropdown filter (default is "All Categories")
3. Select "Food"
4. Click "Apply" (or wait if filters apply on change)

**Expected Results:**
- Only expenses with the "Food" category are displayed
- All displayed expense rows show "Food" as their category
- The expense count and pagination reflect the filtered results
- A "Clear filters" link appears
- Clicking "Clear filters" restores the full unfiltered list

---

### TC-EXP-010: Filter expenses by date range
**Priority:** P1
**Description:** Verify that expenses can be filtered by a start date and end date.
**Preconditions:**
- User is logged in
- User has expenses spanning at least 3 different dates (e.g., Feb 1, Feb 5, Feb 10)

**Steps:**
1. Navigate to the Expenses page (`/expenses`)
2. Set the "From" date picker to Feb 3
3. Set the "To" date picker to Feb 8
4. Click "Apply" (or wait for auto-filter)

**Expected Results:**
- Only expenses with dates between Feb 3 and Feb 8 (inclusive) are displayed
- Expenses dated before Feb 3 or after Feb 8 are not shown
- The result count is updated accordingly
- A "Clear filters" link is visible

---

### TC-EXP-011: Filter expenses by category and date range combined
**Priority:** P1
**Description:** Verify that category and date range filters can be used together.
**Preconditions:**
- User is logged in
- User has multiple expenses across categories and dates

**Steps:**
1. Navigate to the Expenses page (`/expenses`)
2. Select "Transportation" from the Category dropdown
3. Set a date range that includes some Transportation expenses
4. Apply filters

**Expected Results:**
- Only expenses matching both the selected category AND date range are displayed
- Results are correctly narrowed by both criteria
- Clearing filters restores the full list

---

### TC-EXP-012: Filter with no results
**Priority:** P2
**Description:** Verify the display when filters return no matching expenses.
**Preconditions:**
- User is logged in
- User has expenses but none in the "Healthcare" category (or in a specific date range)

**Steps:**
1. Navigate to the Expenses page (`/expenses`)
2. Select a category that has no expenses (e.g., "Healthcare")
3. Apply the filter

**Expected Results:**
- A message "No expenses found for the selected filters." is displayed
- No expense rows are shown
- A "Clear filters" link is available
- The "Add Expense" button remains visible

---

## Edit Expense Tests

### TC-EXP-013: Edit expense amount
**Priority:** P1
**Description:** Verify that the amount of an existing expense can be updated.
**Preconditions:**
- User is logged in
- User has an existing expense (e.g., Food, $45.99)

**Steps:**
1. Navigate to the Expenses page (`/expenses`)
2. Click on the expense row (or the edit/pencil icon) for the expense to edit
3. Verify the Edit Expense form opens pre-populated with the expense data
4. Change the Amount from "45.99" to "52.00"
5. Click "Save Changes"

**Expected Results:**
- User is redirected to the Expenses list
- A success toast "Expense updated." is displayed
- The expense now shows the updated amount ($52.00)
- All other fields (category, date, description) remain unchanged

---

### TC-EXP-014: Edit expense category
**Priority:** P1
**Description:** Verify that the category of an existing expense can be changed.
**Preconditions:**
- User is logged in
- User has an existing expense with category "Food"

**Steps:**
1. Navigate to the Expenses page
2. Click on the expense to edit
3. Change the Category dropdown from "Food" to "Shopping"
4. Click "Save Changes"

**Expected Results:**
- User is redirected to the Expenses list
- A success toast "Expense updated." is displayed
- The expense now shows the updated category "Shopping" with its appropriate color indicator
- All other fields remain unchanged

---

### TC-EXP-015: Edit expense cancel action
**Priority:** P2
**Description:** Verify that cancelling an edit returns to the list without saving changes.
**Preconditions:**
- User is logged in
- User has an existing expense (e.g., amount $45.99)

**Steps:**
1. Navigate to the Expenses page
2. Click on the expense to edit
3. Change the Amount to "999.99"
4. Click "Cancel"

**Expected Results:**
- User is returned to the Expenses list
- The expense retains its original amount ($45.99)
- No success or error toast is shown

---

## Delete Expense Tests

### TC-EXP-016: Delete expense with confirmation
**Priority:** P1
**Description:** Verify that an expense can be deleted after confirming the deletion dialog.
**Preconditions:**
- User is logged in
- User has at least one expense in the list

**Steps:**
1. Navigate to the Expenses page (`/expenses`)
2. Note the total number of expenses
3. Click the delete icon (trash) on an expense row (or click the "Delete" button from the Edit form)
4. Verify a confirmation dialog appears with the message "Are you sure you want to delete this expense? This action cannot be undone."
5. Click the "Delete" button in the confirmation dialog

**Expected Results:**
- The confirmation dialog closes
- The expense is removed from the list
- A success toast "Expense deleted." is displayed
- The total number of expenses decreases by one
- User remains on the Expenses list page

---

### TC-EXP-017: Cancel delete expense
**Priority:** P1
**Description:** Verify that cancelling the delete confirmation dialog preserves the expense.
**Preconditions:**
- User is logged in
- User has at least one expense in the list

**Steps:**
1. Navigate to the Expenses page
2. Note the expense details and total count
3. Click the delete icon on an expense row
4. Verify the confirmation dialog appears
5. Click "Cancel" in the confirmation dialog

**Expected Results:**
- The confirmation dialog closes
- The expense remains in the list unchanged
- The total count of expenses is the same
- No toast message is shown

---

### TC-EXP-018: Delete expense from edit form
**Priority:** P2
**Description:** Verify that an expense can be deleted from within the Edit Expense form.
**Preconditions:**
- User is logged in
- User has at least one expense

**Steps:**
1. Navigate to the Expenses page
2. Click on an expense to open the Edit form
3. Click the "Delete Expense" button (danger/red button at the bottom)
4. Confirm the deletion in the dialog

**Expected Results:**
- User is returned to the Expenses list
- The deleted expense is no longer in the list
- A success toast "Expense deleted." is displayed

---

## Pagination Tests

### TC-EXP-019: Pagination with more than 10 expenses
**Priority:** P1
**Description:** Verify that pagination controls appear and function correctly when there are more than 10 expenses.
**Preconditions:**
- User is logged in
- User has at least 15 expenses

**Steps:**
1. Navigate to the Expenses page (`/expenses`)
2. Verify the first page shows 10 expenses
3. Verify pagination controls are visible at the bottom (page numbers, Previous/Next)
4. Verify "Showing 1-10 of N" text is displayed
5. Click "Next" or page "2"
6. Verify the second page loads with the remaining expenses

**Expected Results:**
- Page 1 displays the first 10 expenses (most recent)
- Pagination controls show page numbers and Previous/Next buttons
- "Showing 1-10 of N" is displayed on page 1
- Page 2 displays the next set of expenses (up to 10)
- "Showing 11-N of N" is displayed on page 2
- "Previous" button is disabled on page 1
- "Next" button is disabled on the last page
- Expenses maintain reverse chronological order across pages

---

### TC-EXP-020: Pagination hidden with fewer than 10 expenses
**Priority:** P2
**Description:** Verify that pagination controls are not shown when the total expense count is 10 or fewer.
**Preconditions:**
- User is logged in
- User has between 1 and 10 expenses

**Steps:**
1. Navigate to the Expenses page (`/expenses`)

**Expected Results:**
- All expenses are displayed on a single page
- No pagination controls (page numbers, Previous/Next buttons) are visible
- "Showing 1-N of N" may or may not be displayed (where N <= 10)

---

### TC-EXP-021: Pagination with active filters
**Priority:** P2
**Description:** Verify that pagination reflects filtered results correctly.
**Preconditions:**
- User is logged in
- User has more than 10 expenses total, but filtering by a specific category yields fewer than 10

**Steps:**
1. Navigate to the Expenses page
2. Note the pagination shows multiple pages
3. Select a category filter that has fewer than 10 expenses
4. Apply the filter

**Expected Results:**
- The list updates to show only filtered expenses
- Pagination adjusts to the filtered count
- If filtered results are 10 or fewer, pagination controls are hidden
- "Showing" text reflects the filtered total
