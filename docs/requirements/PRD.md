# Product Requirements Document (PRD) - Expense Tracker App

## 1. Project Overview

The Expense Tracker is a personal finance web application that allows individual users to log expenses, categorize spending, set budgets, and visualize their financial habits through charts and summaries. The app uses a Quarkus (Java) backend with a React frontend, providing a simple and intuitive experience for day-to-day expense management.

## 2. Target Audience

**Primary Users:** Individuals managing personal finances

Users who want a straightforward way to:
- Record daily expenses quickly
- Organize spending into categories
- Set monthly budgets and track spending against them
- Review spending patterns through visual charts and summaries

### User Persona

**Persona: Alex - The Budget-Conscious Individual**
- **Age:** 25-45
- **Tech Comfort:** Moderate - comfortable with web apps
- **Goal:** Keep track of personal spending, understand where money goes each month
- **Pain Point:** Loses track of small daily expenses; wants a simple tool without unnecessary complexity
- **Usage Pattern:** Logs expenses daily (1-5 entries), reviews summaries weekly/monthly

## 3. Functional Requirements

### FR-1: User Registration & Authentication
- FR-1.1: Users can register with email and password
- FR-1.2: Users can log in with email and password
- FR-1.3: Users can log out
- FR-1.4: Passwords must be securely hashed and stored
- FR-1.5: Sessions must be managed securely (JWT or session tokens)

### FR-2: Expense Management
- FR-2.1: Users can add a new expense with: amount (USD), category, date, and optional description
- FR-2.2: Users can view a list of all their expenses
- FR-2.3: Users can edit an existing expense
- FR-2.4: Users can delete an expense
- FR-2.5: Expenses are displayed in reverse chronological order by default
- FR-2.6: Users can filter expenses by category and/or date range

### FR-3: Expense Categories
- FR-3.1: The app provides default categories (Food, Transportation, Housing, Utilities, Entertainment, Healthcare, Shopping, Other)
- FR-3.2: Users can create custom categories
- FR-3.3: Each expense must belong to exactly one category

### FR-4: Budget Management
- FR-4.1: Users can set a monthly budget amount (total)
- FR-4.2: Users can view their current month's spending vs. budget
- FR-4.3: The app displays remaining budget for the current month
- FR-4.4: Budget tracking is simple - display only, no alerts or enforcement

### FR-5: Reporting & Analytics
- FR-5.1: Dashboard showing current month's spending summary
- FR-5.2: Spending breakdown by category (pie/donut chart)
- FR-5.3: Monthly spending trend (bar or line chart)
- FR-5.4: Monthly summary with total spent, number of transactions, and top category
- FR-5.5: Ability to view reports for previous months

## 4. Non-Functional Requirements

### NFR-1: Technology Stack
- **Backend:** Quarkus (Java) with RESTful API
- **Frontend:** React (with modern tooling - Vite)
- **Database:** PostgreSQL
- **Currency:** USD only (single currency)

### NFR-2: Performance
- Page load time under 2 seconds
- API response time under 500ms for standard operations

### NFR-3: Security
- Passwords hashed with bcrypt or equivalent
- API endpoints protected with authentication
- Input validation on both frontend and backend
- Protection against common vulnerabilities (XSS, SQL injection, CSRF)

### NFR-4: Usability
- Responsive design that works on desktop and tablet browsers
- Clean, intuitive interface with minimal learning curve
- Form validation with clear error messages

### NFR-5: Reliability
- Data persistence in PostgreSQL database
- Graceful error handling with user-friendly messages

## 5. Success Metrics

- Users can register, log in, and start tracking expenses within 2 minutes
- Adding a new expense takes fewer than 3 clicks/taps
- Dashboard loads with charts and summary within 2 seconds
- All CRUD operations on expenses work correctly end-to-end

## 6. Out of Scope

- Mobile native apps (iOS/Android)
- Multi-currency support
- Bank account synchronization or third-party integrations
- Receipt photo uploads
- Recurring expense automation
- Budget alerts or notifications
- Shared/team expense tracking
- Data export (CSV/PDF)
- Social login (Google, Facebook, etc.)
- Offline support
