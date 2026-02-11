# UI Specification - Expense Tracker App

## Overview

This document defines the detailed page layouts, component specifications, design system, and responsive behavior for the Expense Tracker application.

---

## 1. Design System

### 1.1 Color Palette

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#4F46E5` (Indigo 600) | Primary buttons, active nav links, chart accents |
| `--color-primary-hover` | `#4338CA` (Indigo 700) | Button hover states |
| `--color-primary-light` | `#EEF2FF` (Indigo 50) | Selected states, highlights |
| `--color-success` | `#16A34A` (Green 600) | Positive budget, success toasts |
| `--color-danger` | `#DC2626` (Red 600) | Delete buttons, over-budget, errors |
| `--color-danger-hover` | `#B91C1C` (Red 700) | Delete button hover |
| `--color-warning` | `#F59E0B` (Amber 500) | Near-budget warnings |
| `--color-bg` | `#F9FAFB` (Gray 50) | Page background |
| `--color-surface` | `#FFFFFF` | Card backgrounds, form backgrounds |
| `--color-border` | `#E5E7EB` (Gray 200) | Borders, dividers |
| `--color-text` | `#111827` (Gray 900) | Primary text |
| `--color-text-secondary` | `#6B7280` (Gray 500) | Secondary/helper text |

### 1.2 Typography

- **Font Family:** `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- **Headings:**
  - H1: 24px / 1.2 line-height / font-weight 700
  - H2: 20px / 1.3 / font-weight 600
  - H3: 16px / 1.4 / font-weight 600
- **Body:** 14px / 1.5 / font-weight 400
- **Small/Caption:** 12px / 1.4 / font-weight 400
- **Monospace (amounts):** `'JetBrains Mono', 'Fira Code', monospace` at 14px

### 1.3 Spacing Scale

Base unit: 4px. Use multiples: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.

- Component internal padding: 12px-16px
- Card padding: 20px-24px
- Section gaps: 24px
- Page margins: 24px (desktop), 16px (mobile)

### 1.4 Border Radius

- Buttons: 8px
- Cards: 12px
- Inputs: 8px
- Chips/badges: 16px (fully rounded)
- Modals: 12px

### 1.5 Shadows

- Card shadow: `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)`
- Modal shadow: `0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)`
- Dropdown shadow: `0 4px 6px rgba(0,0,0,0.1)`

### 1.6 Category Colors

Each category has an assigned color for chart segments and badges:

| Category | Color |
|---|---|
| Food | `#F97316` (Orange) |
| Transportation | `#3B82F6` (Blue) |
| Housing | `#8B5CF6` (Violet) |
| Utilities | `#06B6D4` (Cyan) |
| Entertainment | `#EC4899` (Pink) |
| Healthcare | `#10B981` (Emerald) |
| Shopping | `#F59E0B` (Amber) |
| Other | `#6B7280` (Gray) |
| Custom categories | Assigned from a rotating palette |

---

## 2. Global Layout

### 2.1 Desktop Layout (viewport >= 1024px)

```
+------------------+-------------------------------------------+
|                  |  Header / Page Title + Actions             |
|   Sidebar        +-------------------------------------------+
|   (240px fixed)  |                                           |
|                  |  Main Content Area                        |
|   - Logo         |  (padding: 24px)                          |
|   - Nav Items    |                                           |
|   - User Email   |                                           |
|   - Logout       |                                           |
|                  |                                           |
+------------------+-------------------------------------------+
```

- **Sidebar:** 240px wide, fixed position, full height, `--color-surface` background with right border.
- **Main content:** Fills remaining width, scrollable, `--color-bg` background.
- **Header bar:** Within main content area, sticky top, contains page title and primary action button.

### 2.2 Tablet Layout (viewport 768px - 1023px)

- Sidebar collapses to icons-only mode (64px wide).
- Hovering/clicking expands sidebar as an overlay.
- Main content adjusts to fill remaining space.

### 2.3 Mobile Layout (viewport < 768px)

```
+-------------------------------------------+
|  Top Bar: Hamburger | App Name | User     |
+-------------------------------------------+
|                                           |
|  Main Content Area                        |
|  (padding: 16px)                          |
|                                           |
+-------------------------------------------+
|  Bottom Nav (optional, for quick access)  |
+-------------------------------------------+
```

- Sidebar hidden by default, opens as a full-screen overlay via hamburger menu.
- Page content uses single-column layout.
- Cards stack vertically.

---

## 3. Page Specifications

### 3.1 Login Page (`/login`)

**Layout:** Centered card on a `--color-bg` background. No sidebar shown.

```
+-------------------------------------------+
|                                           |
|         [App Logo / Name]                 |
|         "Expense Tracker"                 |
|                                           |
|   +-------------------------------+       |
|   |  Email                        |       |
|   |  [email input]                |       |
|   |                               |       |
|   |  Password                     |       |
|   |  [password input]             |       |
|   |                               |       |
|   |  [   Log In   ] (primary btn) |       |
|   |                               |       |
|   |  Don't have an account?       |       |
|   |  Create account (link)        |       |
|   +-------------------------------+       |
|                                           |
+-------------------------------------------+
```

**Components:**
- **App title:** H1, centered, with subtle icon/logo above it.
- **Form card:** Max-width 400px, centered horizontally and vertically, card shadow.
- **Email input:** type="email", label "Email", placeholder "you@example.com", `aria-label="Email address"`.
- **Password input:** type="password", label "Password", placeholder "Enter your password", `aria-label="Password"`.
- **Submit button:** Full-width primary button, text "Log In".
- **Link:** Below the button, "Don't have an account? Create account" where "Create account" is a link to `/register`.
- **Error message area:** Red-bordered alert box above the form fields, hidden by default.

**Validation:**
- Email: required, valid email format.
- Password: required.
- Show inline error below field on blur or on submit.

---

### 3.2 Registration Page (`/register`)

**Layout:** Same centered card layout as Login.

**Components:**
- Same card structure as Login with three fields:
  - **Email input:** Same as Login.
  - **Password input:** Label "Password", placeholder "At least 8 characters".
  - **Confirm Password input:** Label "Confirm Password", placeholder "Re-enter your password".
- **Submit button:** Full-width primary button, text "Create Account".
- **Link:** "Already have an account? Log in" linking to `/login`.

**Validation:**
- Email: required, valid email format.
- Password: required, minimum 8 characters.
- Confirm Password: required, must match Password field.
- Real-time validation on blur with inline error messages.

---

### 3.3 Dashboard Page (`/dashboard`)

**Layout:** Main content area with sidebar. Content organized in a grid.

```
+--------------------------------------------------+
|  Dashboard                          [Month Picker]|
+--------------------------------------------------+
|                                                   |
|  +----------+ +----------+ +----------+ +-------+ |
|  | Total    | | Budget   | | Trans-   | | Top   | |
|  | Spent    | | Remaining| | actions  | | Cat.  | |
|  | $1,234   | | $766     | | 42       | | Food  | |
|  +----------+ +----------+ +----------+ +-------+ |
|                                                   |
|  +----------------------+ +-----------------------+|
|  | Category Breakdown   | | Monthly Trend         ||
|  |                      | |                       ||
|  |   [Pie/Donut Chart]  | |   [Bar/Line Chart]    ||
|  |                      | |                       ||
|  |   Legend below chart  | |   X: months, Y: USD   ||
|  +----------------------+ +-----------------------+|
|                                                   |
|  +------------------------------------------------+|
|  | Recent Expenses                    [View All >] ||
|  |  Date    | Category | Description | Amount     ||
|  |  Feb 10  | Food     | Lunch       | $12.50     ||
|  |  Feb 09  | Transport| Bus fare    | $2.75      ||
|  |  ...     | ...      | ...         | ...        ||
|  +------------------------------------------------+|
+---------------------------------------------------+
```

**Components:**

#### Summary Cards (top row)
- 4 cards in a row (desktop), 2x2 grid (tablet), stacked (mobile).
- Each card: `--color-surface` background, card shadow, 20px padding.
- Content: label (small, secondary text), value (H2, primary text), optional icon.
- **Total Spent:** Dollar amount, formatted with commas and 2 decimal places.
- **Budget Remaining:** Dollar amount. Green if positive, red if negative (over budget).
- **Transactions:** Integer count.
- **Top Category:** Category name with colored dot indicator.

#### Month Picker
- Positioned in the header area, right-aligned.
- A select/dropdown or left/right arrow buttons showing "February 2026".
- Changes the data for all dashboard components.

#### Category Breakdown Chart
- Pie or donut chart.
- Each segment colored per the category color palette.
- Legend displayed below the chart showing category name, color swatch, amount, and percentage.
- If no data: display "No expenses for this month" with a muted chart placeholder.

#### Monthly Trend Chart
- Bar chart (preferred for clarity) or line chart.
- X-axis: last 6 months labeled (e.g., "Sep", "Oct", "Nov", "Dec", "Jan", "Feb").
- Y-axis: dollar amounts with auto-scaled grid lines.
- Hover/tap on a bar shows a tooltip with exact amount.

#### Recent Expenses
- Compact table/list showing the 5 most recent expenses.
- Columns: Date (formatted "Feb 10"), Category (colored badge), Description (truncated to 30 chars), Amount (right-aligned).
- "View All" link in the header row navigates to `/expenses`.

**Responsive Behavior:**
- Mobile: summary cards stack in a single column, charts stack vertically and take full width, recent expenses become a simplified card list.

---

### 3.4 Expenses List Page (`/expenses`)

**Layout:** Main content area with filters at top and scrollable list below.

```
+---------------------------------------------------+
|  Expenses                         [+ Add Expense]  |
+---------------------------------------------------+
|  Filters:                                          |
|  [Category dropdown] [Start date] [End date] [Apply]|
+---------------------------------------------------+
|  Date       | Category    | Description  | Amount  |
|  ---------- | ----------- | ------------ | ------- |
|  Feb 10     | Food        | Lunch at..   | $12.50  |
|  Feb 09     | Transport   | Bus fare     |  $2.75  |
|  Feb 08     | Shopping    | Headphones   | $49.99  |
|  ...        | ...         | ...          | ...     |
+---------------------------------------------------+
|  < 1 2 3 ... 5 >    Showing 1-10 of 47            |
+---------------------------------------------------+
```

**Components:**

#### Filter Bar
- Horizontal bar below the page title.
- **Category dropdown:** Select with "All Categories" default, lists all categories.
- **Date range:** Two date pickers, "From" and "To".
- **Apply button:** Secondary button. Alternatively, filters apply on change without a button.
- **Clear filters** link appears when any filter is active.

#### Expenses Table (Desktop)
- Columns: Date, Category, Description, Amount, Actions.
- **Date:** Formatted as "MMM DD, YYYY" (e.g., "Feb 10, 2026").
- **Category:** Displayed as a colored badge/chip with category name.
- **Description:** Text, truncated with ellipsis if longer than 40 characters.
- **Amount:** Right-aligned, monospace font, formatted as "$1,234.56".
- **Actions:** Edit (pencil icon) and Delete (trash icon) buttons, visible on row hover (desktop) or always visible (mobile).
- Rows are clickable to open edit form.
- Alternating row backgrounds for readability: white / `--color-bg`.

#### Expenses List (Mobile)
- Each expense is a card:
  ```
  +----------------------------------+
  |  Food                 $12.50     |
  |  Lunch at the cafe               |
  |  Feb 10, 2026          [E] [D]  |
  +----------------------------------+
  ```

#### Pagination
- Shows page numbers with previous/next buttons.
- 10 items per page.
- Display "Showing X-Y of Z" text.
- If fewer than 10 total expenses, pagination is hidden.

#### Empty State
- Illustration or icon placeholder.
- Text: "No expenses yet. Start tracking your spending!"
- Primary button: "Add Your First Expense".

#### No Filter Results State
- Text: "No expenses match your filters."
- Link: "Clear filters" to reset.

---

### 3.5 Add/Edit Expense Form (`/expenses/new`, `/expenses/:id/edit`)

**Layout:** A form page within the main content area, or a modal overlay.

```
+---------------------------------------------------+
|  Add Expense  (or "Edit Expense")                  |
+---------------------------------------------------+
|                                                    |
|  Amount *                                          |
|  [ $ |  0.00                              ]        |
|                                                    |
|  Category *                                        |
|  [ Select a category          v ]                  |
|                                                    |
|  Date *                                            |
|  [ Feb 11, 2026              📅 ]                  |
|                                                    |
|  Description                                       |
|  [ Enter a description (optional)        ]         |
|                                                    |
|  [  Cancel  ]              [  Save Expense  ]      |
|                                                    |
|              [ Delete Expense ] (edit mode only)    |
+---------------------------------------------------+
```

**Components:**

#### Amount Input
- Label: "Amount", required indicator (*).
- Input type: number, step="0.01", min="0.01".
- Prefix "$" shown inside the input or as an inline label.
- `aria-label="Expense amount in dollars"`.
- Validation: required, must be positive, max 2 decimal places.

#### Category Dropdown
- Label: "Category", required indicator (*).
- Select element populated with all categories (default + custom).
- Default: no selection, placeholder "Select a category".
- `aria-label="Expense category"`.
- Validation: required.

#### Date Picker
- Label: "Date", required indicator (*).
- Native date input or custom date picker component.
- Default: today's date.
- Max date: today (no future dates).
- `aria-label="Expense date"`.
- Validation: required, not in the future.

#### Description Input
- Label: "Description (optional)".
- Text input, maxlength=200.
- Placeholder: "What was this expense for?"
- `aria-label="Expense description"`.

#### Buttons
- **Cancel:** Secondary/ghost button, left side. Returns to Expenses list.
- **Save Expense / Save Changes:** Primary button, right side.
- **Delete Expense:** Danger button (red), only shown in edit mode, positioned below the main buttons with visual separation. Triggers the delete confirmation dialog.

---

### 3.6 Categories Management Page (`/categories`)

**Layout:** Simple list page within the main content area.

```
+---------------------------------------------------+
|  Categories                       [+ Add Category] |
+---------------------------------------------------+
|                                                    |
|  Default Categories                                |
|  +----------------------------------------------+  |
|  | [orange dot] Food              Default       |  |
|  | [blue dot]   Transportation    Default       |  |
|  | [violet dot] Housing           Default       |  |
|  | [cyan dot]   Utilities         Default       |  |
|  | [pink dot]   Entertainment     Default       |  |
|  | [green dot]  Healthcare        Default       |  |
|  | [amber dot]  Shopping          Default       |  |
|  | [gray dot]   Other             Default       |  |
|  +----------------------------------------------+  |
|                                                    |
|  Custom Categories                                 |
|  +----------------------------------------------+  |
|  | [dot] Subscriptions            [edit] [del]  |  |
|  | [dot] Gifts                    [edit] [del]  |  |
|  +----------------------------------------------+  |
|                                                    |
|  [New category name input] [Save]  (add mode)     |
+---------------------------------------------------+
```

**Components:**

#### Category List
- Two sections: "Default Categories" and "Custom Categories".
- Each row: color dot, category name, and actions.
- Default categories: no actions, show "Default" label in secondary text.
- Custom categories: edit (pencil icon) and delete (trash icon) buttons.

#### Add Category Form
- Triggered by "Add Category" button.
- Inline form at the top of the Custom Categories section.
- Text input (max 50 characters) + "Save" button + "Cancel" button/icon.
- `aria-label="New category name"`.
- Validation: required, non-empty, no duplicate names.

#### Delete Confirmation
- Modal dialog: "Delete category '[name]'? Expenses using this category will be reassigned to 'Other'."
- "Cancel" and "Delete" buttons.

---

### 3.7 Budget Settings Page (`/budget`)

**Layout:** Simple settings page within the main content area.

```
+---------------------------------------------------+
|  Monthly Budget                                    |
+---------------------------------------------------+
|                                                    |
|  +----------------------------------------------+  |
|  |  Current Monthly Budget                       |  |
|  |  $ 2,000.00                   [Edit]          |  |
|  +----------------------------------------------+  |
|                                                    |
|  +----------------------------------------------+  |
|  |  February 2026 Summary                        |  |
|  |                                               |  |
|  |  Budget:    $2,000.00                         |  |
|  |  Spent:     $1,234.00                         |  |
|  |  Remaining: $  766.00  (green)                |  |
|  |                                               |  |
|  |  [=============================------] 62%    |  |
|  |  (progress bar: green fill)                   |  |
|  +----------------------------------------------+  |
|                                                    |
+---------------------------------------------------+
```

**Components:**

#### Budget Display Card
- Shows current budget amount in large text (H2, monospace).
- "Edit" button (secondary style) to toggle into edit mode.

#### Budget Edit Mode
- The display card transforms to show an input field with the current value.
- Input: type="number", step="0.01", min="0".
- "Save" (primary) and "Cancel" (secondary) buttons.
- Validation: required, positive number.

#### Monthly Summary Card
- **Budget:** Formatted dollar amount.
- **Spent:** Formatted dollar amount (current month total).
- **Remaining:** Budget minus Spent. Green if positive, red if negative.
- **Progress Bar:**
  - Full width within the card.
  - Fill color: green (0-75%), amber/warning (75-100%), red (>100%).
  - Percentage label at the right end.

#### No Budget State
- If no budget is set: "You haven't set a monthly budget yet."
- Primary button: "Set Budget" opens the edit form.

---

## 4. Common Components

### 4.1 Sidebar Navigation

- Width: 240px (desktop), 64px icons-only (tablet), hidden with overlay (mobile).
- Background: `--color-surface` with right border.
- **Logo/App Name:** Top area, "Expense Tracker" in H3 weight.
- **Nav Items:** Vertical list, each item has an icon (24px) and label.
  - Active state: `--color-primary-light` background, `--color-primary` text and icon.
  - Hover state: `--color-bg` background.
  - Each item has `role="link"` and `aria-current="page"` when active.
- **User section:** Bottom of sidebar, shows user email (truncated), "Logout" link.
- **Mobile hamburger:** 48x48px touch target, top-left corner.

### 4.2 Toast Notifications

- Position: top-right corner, 24px from edges.
- Auto-dismiss after 4 seconds.
- Types: success (green left border), error (red left border), info (blue left border).
- Content: icon + message text + close (X) button.
- Max width: 360px.
- `role="alert"` and `aria-live="polite"`.

### 4.3 Confirmation Dialog (Modal)

- Centered overlay with semi-transparent backdrop.
- Card: max-width 440px, card shadow, 24px padding.
- Content: title (H3), description text, action buttons.
- Buttons: right-aligned, "Cancel" (secondary) + action button (danger or primary).
- Backdrop click or Escape key dismisses the dialog.
- Focus trapped within the modal, `role="dialog"`, `aria-modal="true"`.

### 4.4 Form Elements

#### Text/Number Inputs
- Height: 40px.
- Border: 1px solid `--color-border`.
- Focus: 2px `--color-primary` ring (outline).
- Error: red border, error message below in 12px red text.
- Disabled: 50% opacity, not interactive.
- `aria-describedby` points to error message element when in error state.

#### Select/Dropdown
- Same sizing as text inputs.
- Native select on mobile for better UX.
- Custom styled dropdown on desktop.

#### Date Picker
- Native `<input type="date">` for cross-browser support.
- Styled to match other inputs.

#### Buttons
- **Primary:** `--color-primary` background, white text, 40px height, 16px horizontal padding.
- **Secondary:** White background, `--color-border` border, `--color-text` text.
- **Danger:** `--color-danger` background, white text.
- **Ghost:** No background/border, `--color-primary` text.
- All buttons: 8px border-radius, `cursor: pointer`, focus ring on keyboard focus.
- Disabled: 50% opacity, `cursor: not-allowed`.
- Loading state: spinner icon replacing text, `aria-busy="true"`.

### 4.5 Loading States

- **Page load:** Full-page centered spinner with "Loading..." text.
- **Section load:** Skeleton placeholders matching the expected content shape.
- **Button loading:** Inline spinner within the button, button disabled.
- **Table loading:** Skeleton rows (3-5 rows of gray rectangles).

### 4.6 Error States

- **Page-level error:** Alert banner at the top of the content area with red background, error icon, message, and "Retry" button.
- **Form errors:** Inline below each field in red text.
- **Network error:** Full-page message: "Unable to connect. Please check your connection and try again." with Retry button.

---

## 5. Accessibility Requirements

### 5.1 Keyboard Navigation
- All interactive elements are focusable and operable via keyboard.
- Tab order follows visual layout (left-to-right, top-to-bottom).
- Escape key closes modals and dropdowns.
- Enter/Space activates buttons and links.
- Arrow keys navigate within dropdowns and date pickers.

### 5.2 Screen Reader Support
- All form inputs have associated `<label>` elements.
- Images and icons have `alt` text or `aria-label`.
- Dynamic content changes announced via `aria-live` regions.
- Charts provide a text alternative (e.g., a summary table below the chart or `aria-label` on the chart container).
- Page headings use proper hierarchy (h1 > h2 > h3).

### 5.3 Color and Contrast
- All text meets WCAG 2.1 AA contrast ratios (4.5:1 for normal text, 3:1 for large text).
- Color is never the sole indicator of state; icons, text labels, or patterns are also used.
- Focus indicators have at least 3:1 contrast against the background.

### 5.4 Touch Targets
- Minimum touch target size: 44x44px for mobile.
- Adequate spacing between interactive elements (at least 8px gap).

---

## 6. Responsive Breakpoints

| Breakpoint | Name | Layout |
|---|---|---|
| >= 1024px | Desktop | Sidebar + full content grid |
| 768px - 1023px | Tablet | Collapsed sidebar + adapted grid |
| < 768px | Mobile | Hidden sidebar, hamburger menu, stacked layout |

### Responsive Behavior Summary

| Component | Desktop | Tablet | Mobile |
|---|---|---|---|
| Sidebar | 240px visible | 64px icons | Hidden, hamburger overlay |
| Summary cards | 4 in a row | 2x2 grid | Stacked vertically |
| Charts | Side by side | Side by side | Stacked vertically |
| Expense table | Full table | Full table | Card list |
| Forms | Centered, max-width 480px | Centered, max-width 480px | Full width with 16px padding |
| Modals | Centered overlay | Centered overlay | Full-screen on mobile |
