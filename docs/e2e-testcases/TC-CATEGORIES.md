# TC-CATEGORIES: Category Management Test Cases

## Overview
End-to-end test cases for viewing, adding, and deleting categories, including default and custom categories.

---

## View Categories Tests

### TC-CAT-001: View default categories
**Priority:** P0
**Description:** Verify that all default categories are displayed on the Categories page and cannot be edited or deleted.
**Preconditions:**
- User is logged in
- Default categories have been seeded on application startup

**Steps:**
1. Navigate to the Categories page (`/categories`) via the sidebar navigation
2. Observe the "Default Categories" section

**Expected Results:**
- The following 8 default categories are displayed: Food, Transportation, Housing, Utilities, Entertainment, Healthcare, Shopping, Other
- Each default category has a color dot indicator and a "Default" label
- No edit (pencil) or delete (trash) icons are shown for default categories
- The page title is "Categories"
- An "Add Category" button is visible at the top of the page

---

### TC-CAT-002: View custom categories
**Priority:** P1
**Description:** Verify that user-created custom categories are displayed separately with edit and delete actions.
**Preconditions:**
- User is logged in
- User has created at least 2 custom categories (e.g., "Subscriptions", "Gifts")

**Steps:**
1. Navigate to the Categories page (`/categories`)
2. Observe the "Custom Categories" section

**Expected Results:**
- Custom categories are listed in a separate section from default categories
- Each custom category shows its name with a color dot
- Each custom category has edit (pencil) and delete (trash) icons
- Custom categories do not have the "Default" label

---

## Add Category Tests

### TC-CAT-003: Add custom category
**Priority:** P0
**Description:** Verify that a user can create a new custom category with a valid name.
**Preconditions:**
- User is logged in
- User is on the Categories page (`/categories`)
- No custom category named "Pet Supplies" exists

**Steps:**
1. Click the "Add Category" button
2. Verify an inline input field appears
3. Type "Pet Supplies" in the category name input
4. Click "Save" (or press Enter)

**Expected Results:**
- A success toast "Category added." is displayed
- "Pet Supplies" appears in the Custom Categories section with a color dot
- Edit and delete icons are visible for the new category
- The inline input field is closed/cleared

---

### TC-CAT-004: Add duplicate category name
**Priority:** P1
**Description:** Verify that creating a category with an already-existing name (default or custom) is rejected.
**Preconditions:**
- User is logged in
- User is on the Categories page
- The "Food" default category exists

**Steps:**
1. Click the "Add Category" button
2. Type "Food" in the category name input
3. Click "Save" (or press Enter)

**Expected Results:**
- An inline error "A category with this name already exists." is displayed
- The category is not created
- The input field remains active for correction
- No success toast is shown

---

### TC-CAT-005: Add category with empty name
**Priority:** P2
**Description:** Verify that creating a category with an empty name is rejected by validation.
**Preconditions:**
- User is logged in
- User is on the Categories page

**Steps:**
1. Click the "Add Category" button
2. Leave the category name input empty
3. Click "Save" (or press Enter)

**Expected Results:**
- An inline error "Category name is required." is displayed
- The category is not created
- The input field remains active

---

### TC-CAT-006: Cancel adding a category
**Priority:** P2
**Description:** Verify that cancelling the add category inline form closes it without creating a category.
**Preconditions:**
- User is logged in
- User is on the Categories page

**Steps:**
1. Click the "Add Category" button
2. Type "Temporary" in the category name input
3. Click "Cancel" (or the close icon)

**Expected Results:**
- The inline input field is closed
- No new category is created
- "Temporary" does not appear in the Custom Categories list
- No toast message is shown

---

## Delete Category Tests

### TC-CAT-007: Delete custom category
**Priority:** P1
**Description:** Verify that a custom category can be deleted after confirmation, and expenses are reassigned to "Other".
**Preconditions:**
- User is logged in
- A custom category "Subscriptions" exists
- At least one expense is assigned to "Subscriptions"

**Steps:**
1. Navigate to the Categories page (`/categories`)
2. Click the delete (trash) icon next to "Subscriptions"
3. Verify a confirmation dialog appears: "Delete category 'Subscriptions'? Expenses using this category will be reassigned to 'Other'."
4. Click "Delete" to confirm

**Expected Results:**
- The "Subscriptions" category is removed from the Custom Categories list
- A success toast is displayed
- Previously associated expenses are now assigned to the "Other" category
- Navigating to the Expenses page confirms the reassignment

---

### TC-CAT-008: Cancel delete custom category
**Priority:** P2
**Description:** Verify that cancelling the delete confirmation preserves the custom category.
**Preconditions:**
- User is logged in
- A custom category "Gifts" exists

**Steps:**
1. Navigate to the Categories page
2. Click the delete icon next to "Gifts"
3. Verify the confirmation dialog appears
4. Click "Cancel"

**Expected Results:**
- The confirmation dialog closes
- "Gifts" remains in the Custom Categories list
- No changes are made

---

### TC-CAT-009: Cannot delete default category
**Priority:** P1
**Description:** Verify that default categories do not have delete actions and cannot be removed.
**Preconditions:**
- User is logged in
- User is on the Categories page

**Steps:**
1. Inspect the default categories section (Food, Transportation, Housing, etc.)
2. Verify no delete icons are present for any default category
3. Attempt to find any way to delete a default category

**Expected Results:**
- No delete (trash) icons are visible for default categories
- No edit (pencil) icons are visible for default categories
- Default categories only show the "Default" label
- There is no mechanism to remove or modify default categories

---

## Category Integration Tests

### TC-CAT-010: Custom category appears in expense form dropdown
**Priority:** P0
**Description:** Verify that a newly created custom category appears in the Category dropdown when adding or editing an expense.
**Preconditions:**
- User is logged in
- User has created a custom category "Pet Supplies"

**Steps:**
1. Navigate to `/expenses/new` (Add Expense form)
2. Click on the Category dropdown
3. Scroll through the available options

**Expected Results:**
- All 8 default categories are listed in the dropdown
- "Pet Supplies" (custom category) is also listed in the dropdown
- Selecting "Pet Supplies" and saving the expense assigns it to that category correctly

---

### TC-CAT-011: Deleted category removed from expense form dropdown
**Priority:** P2
**Description:** Verify that deleting a custom category removes it from the expense form dropdown.
**Preconditions:**
- User is logged in
- A custom category "Old Category" exists and appears in the expense form dropdown

**Steps:**
1. Navigate to Categories page and delete "Old Category"
2. Navigate to `/expenses/new` (Add Expense form)
3. Open the Category dropdown

**Expected Results:**
- "Old Category" no longer appears in the dropdown options
- All default categories remain available
- Other custom categories (if any) remain available
