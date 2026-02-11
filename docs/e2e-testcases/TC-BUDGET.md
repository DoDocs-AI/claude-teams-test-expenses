# TC-BUDGET: Budget Management Test Cases

## Overview
End-to-end test cases for setting, updating, and viewing monthly budgets, including budget vs. actual spending comparisons and progress bar behavior.

---

## Set Budget Tests

### TC-BUD-001: Set monthly budget
**Priority:** P0
**Description:** Verify that a user can set a monthly budget for the first time.
**Preconditions:**
- User is logged in
- No budget has been set for the current month

**Steps:**
1. Navigate to the Budget page (`/budget`) via the sidebar navigation
2. Verify the page shows "You haven't set a monthly budget yet." (or similar no-budget state)
3. Click the "Set Budget" button
4. Enter "2000.00" in the budget amount input field
5. Click "Save"

**Expected Results:**
- A success toast "Budget updated." is displayed
- The page updates to show the current monthly budget: $2,000.00
- The monthly summary section displays:
  - Budget: $2,000.00
  - Spent: current month total (may be $0.00 if no expenses)
  - Remaining: budget minus spent (green if positive)
- A progress bar shows spending relative to budget
- The "Edit" button is visible next to the budget amount

---

### TC-BUD-002: Set budget with invalid amount (zero)
**Priority:** P1
**Description:** Verify that setting a budget of zero is rejected.
**Preconditions:**
- User is logged in
- User is on the Budget page in edit mode

**Steps:**
1. Navigate to the Budget page
2. Click "Edit" (or "Set Budget" if no budget exists)
3. Enter "0" in the budget amount input
4. Click "Save"

**Expected Results:**
- An inline error "Please enter a valid positive number." is displayed
- The budget is not saved
- The input field remains active for correction

---

### TC-BUD-003: Set budget with negative amount
**Priority:** P1
**Description:** Verify that a negative budget amount is rejected.
**Preconditions:**
- User is logged in
- User is on the Budget page in edit mode

**Steps:**
1. Click "Edit" (or "Set Budget")
2. Enter "-500" in the budget amount input
3. Click "Save"

**Expected Results:**
- An inline error "Please enter a valid positive number." is displayed
- The budget is not saved

---

## Update Budget Tests

### TC-BUD-004: Update monthly budget
**Priority:** P0
**Description:** Verify that an existing monthly budget can be updated to a new value.
**Preconditions:**
- User is logged in
- A budget of $2,000.00 is already set for the current month

**Steps:**
1. Navigate to the Budget page (`/budget`)
2. Verify the current budget shows $2,000.00
3. Click the "Edit" button
4. Verify the input field appears with the current value "2000.00"
5. Change the amount to "2500.00"
6. Click "Save"

**Expected Results:**
- A success toast "Budget updated." is displayed
- The budget amount updates to show $2,500.00
- The monthly summary recalculates:
  - Remaining amount is updated (2500 - spent)
  - Progress bar adjusts to reflect the new budget
- The display returns to view mode with the "Edit" button

---

### TC-BUD-005: Cancel budget edit
**Priority:** P2
**Description:** Verify that cancelling a budget edit reverts to the original value.
**Preconditions:**
- User is logged in
- A budget of $2,000.00 is set

**Steps:**
1. Navigate to the Budget page
2. Click "Edit"
3. Change the amount to "9999.99"
4. Click "Cancel"

**Expected Results:**
- The input field closes, returning to display mode
- The budget still shows $2,000.00 (original value)
- No toast message is displayed
- The monthly summary remains unchanged

---

## Budget vs. Actual Spending Tests

### TC-BUD-006: View budget vs actual spending
**Priority:** P0
**Description:** Verify that the Budget page shows an accurate comparison of the budget and actual spending for the current month.
**Preconditions:**
- User is logged in
- A budget of $2,000.00 is set for the current month
- User has expenses totaling $1,245.50 for the current month

**Steps:**
1. Navigate to the Budget page (`/budget`)
2. Observe the monthly summary section

**Expected Results:**
- The monthly summary displays:
  - Budget: $2,000.00
  - Spent: $1,245.50
  - Remaining: $754.50 (displayed in green since positive)
- The progress bar shows approximately 62% filled
- All dollar amounts are formatted correctly with commas and 2 decimal places

---

### TC-BUD-007: Budget with no expenses
**Priority:** P2
**Description:** Verify the Budget page display when a budget is set but no expenses exist for the current month.
**Preconditions:**
- User is logged in
- A budget of $2,000.00 is set for the current month
- User has zero expenses for the current month

**Steps:**
1. Navigate to the Budget page (`/budget`)

**Expected Results:**
- The monthly summary displays:
  - Budget: $2,000.00
  - Spent: $0.00
  - Remaining: $2,000.00 (displayed in green)
- The progress bar shows 0% filled (empty)
- The progress bar color is green

---

### TC-BUD-008: Budget over spending (over budget)
**Priority:** P1
**Description:** Verify the display when actual spending exceeds the monthly budget.
**Preconditions:**
- User is logged in
- A budget of $1,000.00 is set for the current month
- User has expenses totaling $1,350.00 for the current month

**Steps:**
1. Navigate to the Budget page (`/budget`)

**Expected Results:**
- The monthly summary displays:
  - Budget: $1,000.00
  - Spent: $1,350.00
  - Remaining: -$350.00 (displayed in red since over budget)
- The progress bar shows 135% (filled completely with overflow indication)
- The progress bar color is red

---

## Progress Bar Color Tests

### TC-BUD-009: Budget progress bar green (0-75%)
**Priority:** P1
**Description:** Verify the progress bar is green when spending is between 0% and 75% of the budget.
**Preconditions:**
- User is logged in
- Budget is set to $2,000.00
- Spending is $1,000.00 (50% of budget)

**Steps:**
1. Navigate to the Budget page

**Expected Results:**
- The progress bar is approximately 50% filled
- The progress bar fill color is green
- The percentage label shows approximately "50%"

---

### TC-BUD-010: Budget progress bar amber (75-100%)
**Priority:** P1
**Description:** Verify the progress bar turns amber/warning when spending is between 75% and 100% of the budget.
**Preconditions:**
- User is logged in
- Budget is set to $2,000.00
- Spending is $1,700.00 (85% of budget)

**Steps:**
1. Navigate to the Budget page

**Expected Results:**
- The progress bar is approximately 85% filled
- The progress bar fill color is amber/warning (yellow-orange)
- The percentage label shows approximately "85%"
- The remaining amount is still positive (green text)

---

### TC-BUD-011: Budget progress bar red (over 100%)
**Priority:** P1
**Description:** Verify the progress bar turns red when spending exceeds 100% of the budget.
**Preconditions:**
- User is logged in
- Budget is set to $1,000.00
- Spending is $1,200.00 (120% of budget)

**Steps:**
1. Navigate to the Budget page

**Expected Results:**
- The progress bar is completely filled (100%) with red color
- The remaining amount shows a negative value in red text
- The percentage label shows "120%" or equivalent overflow indication

---

## No Budget State Tests

### TC-BUD-012: Budget page with no budget set
**Priority:** P2
**Description:** Verify the Budget page display when no budget has been configured.
**Preconditions:**
- User is logged in
- No budget has been set for any month

**Steps:**
1. Navigate to the Budget page (`/budget`)

**Expected Results:**
- A message "You haven't set a monthly budget yet." is displayed
- A "Set Budget" button is prominently shown
- No progress bar or spending summary is displayed (or summary shows spent amount with null budget)
- Clicking "Set Budget" opens the budget input form
