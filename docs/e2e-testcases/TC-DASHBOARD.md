# TC-DASHBOARD: Dashboard and Reports Test Cases

## Overview
End-to-end test cases for the dashboard page, including summary cards, charts, recent expenses, and month/year navigation.

---

## Dashboard Loading Tests

### TC-DASH-001: Dashboard loads with summary cards
**Priority:** P0
**Description:** Verify that the dashboard page loads and displays all four summary cards with correct data after login.
**Preconditions:**
- User is logged in
- User has expenses for the current month
- A monthly budget is set for the current month

**Steps:**
1. Navigate to the Dashboard (`/dashboard`) via the sidebar or log in to be redirected there
2. Observe the top row of summary cards

**Expected Results:**
- Four summary cards are displayed in a row (desktop):
  1. **Total Spent**: Shows the sum of all expenses for the current month, formatted as a dollar amount (e.g., "$1,245.50")
  2. **Budget Remaining**: Shows the remaining budget amount, color-coded green (if positive) or red (if over budget)
  3. **Transactions**: Shows the integer count of expenses for the current month (e.g., "23")
  4. **Top Category**: Shows the name of the category with the highest spending for the current month (e.g., "Food") with a colored dot indicator
- All values are accurate and match the user's data
- Each card has a label in secondary text and a value in primary/bold text

---

### TC-DASH-002: Dashboard is default landing page after login
**Priority:** P0
**Description:** Verify that the dashboard is shown immediately after a successful login.
**Preconditions:**
- User has a registered account
- User is on the login page

**Steps:**
1. Enter valid credentials on the `/login` page
2. Click "Log In"

**Expected Results:**
- User is redirected to `/dashboard`
- The dashboard page loads with all components (summary cards, charts, recent expenses)
- The "Dashboard" item in the sidebar is highlighted as the active page

---

## Chart Tests

### TC-DASH-003: Category pie chart displays correctly
**Priority:** P1
**Description:** Verify that the category breakdown pie/donut chart renders with accurate data and a legend.
**Preconditions:**
- User is logged in
- User has expenses in at least 3 different categories for the current month

**Steps:**
1. Navigate to the Dashboard (`/dashboard`)
2. Scroll to or observe the Category Breakdown chart section

**Expected Results:**
- A pie or donut chart is displayed
- Each segment represents a category with spending for the current month
- Segment colors match the defined category color palette (e.g., Food = Orange, Transportation = Blue)
- A legend is displayed below/beside the chart showing:
  - Category name
  - Color swatch matching the chart segment
  - Dollar amount
  - Percentage of total spending
- The percentages add up to approximately 100%
- Hovering over a segment (desktop) may show a tooltip with details

---

### TC-DASH-004: Monthly trend chart displays correctly
**Priority:** P1
**Description:** Verify that the monthly trend bar/line chart shows spending totals for the current year.
**Preconditions:**
- User is logged in
- User has expenses in at least 2 different months of the current year

**Steps:**
1. Navigate to the Dashboard
2. Observe the Monthly Trend chart section

**Expected Results:**
- A bar chart (or line chart) is displayed
- The X-axis shows months (e.g., "Jan", "Feb", "Mar", ...)
- The Y-axis shows dollar amounts with auto-scaled grid lines
- Bars/points are shown for months with expenses, with correct amounts
- Months with no expenses show zero or no bar
- Hovering/tapping a bar shows a tooltip with the exact spending amount for that month

---

## Recent Expenses Tests

### TC-DASH-005: Recent expenses shown on dashboard
**Priority:** P0
**Description:** Verify that the 5 most recent expenses are displayed on the dashboard.
**Preconditions:**
- User is logged in
- User has at least 5 expenses

**Steps:**
1. Navigate to the Dashboard (`/dashboard`)
2. Scroll to the "Recent Expenses" section

**Expected Results:**
- A "Recent Expenses" section is visible with a header row
- Exactly 5 expenses are listed (the most recent ones)
- Each expense row shows: Date (formatted, e.g., "Feb 10"), Category (with colored badge), Description (truncated if needed), and Amount (right-aligned)
- Expenses are ordered by date, most recent first
- A "View All" link is visible in the section header

---

### TC-DASH-006: Recent expenses "View All" link
**Priority:** P2
**Description:** Verify that clicking "View All" in the Recent Expenses section navigates to the full Expenses list.
**Preconditions:**
- User is logged in
- User has expenses
- User is on the Dashboard

**Steps:**
1. Locate the "Recent Expenses" section on the Dashboard
2. Click the "View All" link

**Expected Results:**
- User is navigated to the `/expenses` page
- The full expenses list is displayed with all expenses
- Pagination and filter controls are available

---

## Empty State Tests

### TC-DASH-007: Dashboard with no data (empty state)
**Priority:** P2
**Description:** Verify the dashboard handles the case when a user has no expenses and no budget set.
**Preconditions:**
- User is logged in
- User has zero expenses
- No budget is set

**Steps:**
1. Navigate to the Dashboard (`/dashboard`)

**Expected Results:**
- Summary cards display appropriate empty/zero values:
  - Total Spent: $0.00
  - Budget Remaining: shows "No budget set" or appropriate indicator
  - Transactions: 0
  - Top Category: "N/A" or empty indicator
- Category Breakdown chart shows an empty state message: "No spending data for this month" (or a placeholder chart)
- Monthly Trend chart shows an empty or flat chart with $0 values
- Recent Expenses section shows: "No expenses yet" or similar empty state
- The dashboard does not show errors or broken UI

---

### TC-DASH-008: Dashboard with expenses but no budget
**Priority:** P2
**Description:** Verify the dashboard handles the case when a user has expenses but no budget set.
**Preconditions:**
- User is logged in
- User has some expenses for the current month
- No budget is set

**Steps:**
1. Navigate to the Dashboard

**Expected Results:**
- Total Spent card shows the correct sum of expenses
- Budget Remaining card shows "No budget set" or null indicator (not an error)
- Transactions card shows the correct count
- Top Category card shows the correct top category
- Charts display correctly with expense data
- No error messages are shown

---

## Month/Year Navigation Tests

### TC-DASH-009: Month/year navigation
**Priority:** P1
**Description:** Verify that the month/year selector on the dashboard allows viewing historical data.
**Preconditions:**
- User is logged in
- User has expenses in at least 2 different months (e.g., January and February 2026)

**Steps:**
1. Navigate to the Dashboard
2. Observe the current month displayed (e.g., "February 2026")
3. Use the month/year picker (dropdown or arrows) to navigate to a previous month (e.g., January 2026)

**Expected Results:**
- The month label updates to "January 2026"
- All summary cards update to reflect January data:
  - Total Spent shows January's total
  - Budget Remaining shows January's budget vs spending
  - Transactions shows January's count
  - Top Category shows January's top category
- The Category Breakdown chart updates to show January's category distribution
- The Monthly Trend chart may continue showing the year view but highlight the selected month
- Recent Expenses section updates to show January's expenses

---

### TC-DASH-010: Navigate to month with no data
**Priority:** P2
**Description:** Verify the dashboard correctly shows empty states when navigating to a month with no activity.
**Preconditions:**
- User is logged in
- User has no expenses or budget for a specific past month (e.g., March 2025)

**Steps:**
1. Navigate to the Dashboard
2. Use the month/year picker to navigate to March 2025 (or any month with no data)

**Expected Results:**
- Summary cards show zero/empty values for that month
- Charts display empty states: "No spending data for this month"
- No error messages are displayed
- Navigation controls remain functional to switch to other months

---

## Responsive Tests

### TC-DASH-011: Dashboard mobile layout
**Priority:** P2
**Description:** Verify the dashboard renders correctly on mobile screen sizes.
**Preconditions:**
- User is logged in
- User has expenses and a budget set
- Browser is set to a mobile viewport (< 768px)

**Steps:**
1. Navigate to the Dashboard on a mobile viewport
2. Observe the layout of all dashboard sections

**Expected Results:**
- The sidebar is hidden (hamburger menu is available)
- Summary cards stack vertically (single column)
- Charts stack vertically and take full width
- Recent Expenses section shows as a simplified card list
- All content is readable and functional
- No horizontal scrolling is required
- Touch interactions work correctly
