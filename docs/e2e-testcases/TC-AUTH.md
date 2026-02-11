# TC-AUTH: Authentication Test Cases

## Overview
End-to-end test cases for user registration, login, session management, and logout flows.

---

## Registration Tests

### TC-AUTH-001: Registration with valid data
**Priority:** P0
**Description:** Verify that a new user can successfully register with valid email, password, and confirm password.
**Preconditions:**
- The application is running and accessible
- The user is on the `/login` page
- No account exists for the test email

**Steps:**
1. Click the "Create account" link below the login form
2. Verify the registration form is displayed at `/register` with fields: Email, Password, Confirm Password
3. Enter a valid email (e.g., "testuser@example.com")
4. Enter a valid password (e.g., "SecurePass123")
5. Enter the same password in the Confirm Password field
6. Click the "Create Account" button

**Expected Results:**
- User is redirected to the `/login` page
- A success message "Account created. Please log in." is displayed
- The registration form fields are cleared
- No error messages are shown

---

### TC-AUTH-002: Registration with duplicate email
**Priority:** P1
**Description:** Verify that registration fails when using an email that is already registered.
**Preconditions:**
- The application is running and accessible
- An account with "existing@example.com" already exists
- User is on the `/register` page

**Steps:**
1. Enter "existing@example.com" in the Email field
2. Enter "SecurePass123" in the Password field
3. Enter "SecurePass123" in the Confirm Password field
4. Click the "Create Account" button

**Expected Results:**
- Registration fails
- An error message "An account with this email already exists." is displayed
- User remains on the `/register` page
- Form fields retain the entered values (except password fields which may clear)

---

### TC-AUTH-003: Registration with invalid email format
**Priority:** P1
**Description:** Verify that inline validation catches invalid email formats during registration.
**Preconditions:**
- User is on the `/register` page

**Steps:**
1. Enter "invalidemail" in the Email field (no @ symbol)
2. Click or tab away from the Email field (trigger blur validation)
3. Repeat with other invalid formats: "user@", "@domain.com", "user@.com", "user@domain"

**Expected Results:**
- An inline error "Invalid email format" appears below the Email field
- The "Create Account" button submission is blocked if attempted
- Error message disappears when a valid email format is entered

---

### TC-AUTH-004: Registration with short password
**Priority:** P1
**Description:** Verify that passwords shorter than 8 characters are rejected.
**Preconditions:**
- User is on the `/register` page

**Steps:**
1. Enter a valid email in the Email field
2. Enter "Short1" (6 characters) in the Password field
3. Click or tab away from the Password field
4. Click the "Create Account" button

**Expected Results:**
- An inline error "Password must be at least 8 characters" appears below the Password field
- Registration does not proceed
- Error clears when a password of 8 or more characters is entered

---

### TC-AUTH-005: Registration with mismatched passwords
**Priority:** P1
**Description:** Verify that mismatched Password and Confirm Password fields are caught by validation.
**Preconditions:**
- User is on the `/register` page

**Steps:**
1. Enter a valid email in the Email field
2. Enter "SecurePass123" in the Password field
3. Enter "DifferentPass456" in the Confirm Password field
4. Click or tab away from the Confirm Password field
5. Click the "Create Account" button

**Expected Results:**
- An inline error "Passwords do not match" appears below the Confirm Password field
- Registration does not proceed
- Error clears when both password fields contain the same value

---

## Login Tests

### TC-AUTH-006: Login with valid credentials
**Priority:** P0
**Description:** Verify that a registered user can successfully log in with correct credentials.
**Preconditions:**
- The application is running and accessible
- A user account exists with email "testuser@example.com" and password "SecurePass123"
- User is on the `/login` page

**Steps:**
1. Enter "testuser@example.com" in the Email field
2. Enter "SecurePass123" in the Password field
3. Click the "Log In" button

**Expected Results:**
- User is redirected to the `/dashboard` page
- The sidebar navigation is visible with Dashboard, Expenses, Categories, Budget, and Logout items
- The user's email is displayed in the sidebar
- JWT token is stored (in localStorage or memory)
- Dashboard summary cards and charts are displayed

---

### TC-AUTH-007: Login with wrong password
**Priority:** P0
**Description:** Verify that login fails with an incorrect password.
**Preconditions:**
- A user account exists with email "testuser@example.com"
- User is on the `/login` page

**Steps:**
1. Enter "testuser@example.com" in the Email field
2. Enter "WrongPassword123" in the Password field
3. Click the "Log In" button

**Expected Results:**
- Login fails
- An error message "Invalid email or password." appears above the form fields
- User remains on the `/login` page
- Password field is cleared (or retained, depending on implementation)
- No JWT token is stored

---

### TC-AUTH-008: Login with non-existent email
**Priority:** P1
**Description:** Verify that login fails when using an email that has not been registered.
**Preconditions:**
- No account exists for "nonexistent@example.com"
- User is on the `/login` page

**Steps:**
1. Enter "nonexistent@example.com" in the Email field
2. Enter "SomePassword123" in the Password field
3. Click the "Log In" button

**Expected Results:**
- Login fails
- An error message "Invalid email or password." appears (same message as wrong password for security)
- User remains on the `/login` page
- No JWT token is stored

---

### TC-AUTH-009: Login with empty fields
**Priority:** P1
**Description:** Verify that the login form validates required fields before submission.
**Preconditions:**
- User is on the `/login` page

**Steps:**
1. Leave both Email and Password fields empty
2. Click the "Log In" button
3. Then enter an email but leave Password empty and click "Log In"
4. Then clear email, enter a password, and click "Log In"

**Expected Results:**
- Step 2: Inline errors "Email is required" and "Password is required" appear
- Step 3: Inline error "Password is required" appears below the Password field
- Step 4: Inline error "Email is required" appears below the Email field
- No API request is sent when validation fails

---

## Session and Navigation Tests

### TC-AUTH-010: Session persistence after page refresh
**Priority:** P0
**Description:** Verify that a logged-in user remains authenticated after refreshing the page.
**Preconditions:**
- User is logged in and on the `/dashboard` page

**Steps:**
1. Verify the dashboard is loaded and user is authenticated
2. Refresh the page (F5 or browser reload)
3. Wait for the page to reload

**Expected Results:**
- User remains on the `/dashboard` page (not redirected to `/login`)
- The dashboard content loads normally
- The user's email is still displayed in the sidebar
- All authenticated features remain accessible

---

### TC-AUTH-011: Protected route redirect for unauthenticated user
**Priority:** P0
**Description:** Verify that unauthenticated users are redirected to login when accessing protected routes.
**Preconditions:**
- No user is logged in (no JWT token in storage)

**Steps:**
1. Navigate directly to `/dashboard`
2. Navigate directly to `/expenses`
3. Navigate directly to `/categories`
4. Navigate directly to `/budget`

**Expected Results:**
- Each navigation attempt redirects the user to the `/login` page
- No dashboard, expense, category, or budget content is displayed
- The login form is shown

---

## Logout Tests

### TC-AUTH-012: Logout
**Priority:** P0
**Description:** Verify that a user can log out successfully and the session is terminated.
**Preconditions:**
- User is logged in and on any authenticated page

**Steps:**
1. Locate the "Logout" button/link in the sidebar navigation (at the bottom)
2. Click "Logout"

**Expected Results:**
- User is redirected to the `/login` page
- A toast message "You have been logged out." is displayed
- The JWT token is cleared from storage
- Attempting to navigate to any protected route (e.g., `/dashboard`) redirects to `/login`
- The sidebar is no longer visible

---

### TC-AUTH-013: Navigation between login and registration
**Priority:** P2
**Description:** Verify that navigation links between login and registration pages work correctly.
**Preconditions:**
- User is not logged in

**Steps:**
1. Navigate to the `/login` page
2. Click the "Create account" link
3. Verify the `/register` page is displayed
4. Click the "Already have an account? Log in" link
5. Verify the `/login` page is displayed

**Expected Results:**
- Step 2-3: User navigates to `/register`, the registration form is displayed
- Step 4-5: User navigates back to `/login`, the login form is displayed
- Navigation is smooth with no errors
- Form fields are reset on each navigation
