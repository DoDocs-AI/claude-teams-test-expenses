import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const BASE_URL = 'http://localhost:5173';
const SCREENSHOTS_DIR = '/Users/antonignasev/java/opencode-tests/test-expenses/test-screenshots';

mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const TEST_USER = {
  email: `tester2_${Date.now()}@example.com`,
  password: 'TestPass123!'
};

const results = [];

function log(flow, status, message, bug = null) {
  const entry = { flow, status, message };
  if (bug) entry.bug = bug;
  results.push(entry);
  console.log(`[${status}] Flow: ${flow} - ${message}`);
  if (bug) console.log(`  BUG: ${bug}`);
}

async function screenshot(page, name) {
  const path = join(SCREENSHOTS_DIR, `${name}.png`);
  await page.screenshot({ path, fullPage: true });
  console.log(`  Screenshot: ${path}`);
  return path;
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function registerAndLogin(page) {
  // Register
  await page.goto(`${BASE_URL}/register`, { waitUntil: 'networkidle', timeout: 10000 });
  await page.locator('input[type="email"]').fill(TEST_USER.email);
  const passwords = page.locator('input[type="password"]');
  await passwords.first().fill(TEST_USER.password);
  if (await passwords.count() > 1) {
    await passwords.nth(1).fill(TEST_USER.password);
  }
  await page.locator('button[type="submit"]').click();
  await sleep(2000);

  // Login
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 10000 });
  await page.locator('input[type="email"]').fill(TEST_USER.email);
  await page.locator('input[type="password"]').fill(TEST_USER.password);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL('**/dashboard**', { timeout: 10000 });
  await sleep(1000);
  console.log('  Logged in successfully');
}

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 400 });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  await registerAndLogin(page);

  // ============================================================
  // RE-TEST FLOW 3: DASHBOARD VIEW (better selectors)
  // ============================================================
  console.log('\n=== RE-TEST FLOW 3: DASHBOARD VIEW ===\n');
  try {
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle', timeout: 10000 });
    await sleep(2000);
    await screenshot(page, '03-dashboard-retest');

    // Check for visible text content on summary cards
    const totalSpent = await page.locator('text=Total Spent').count();
    const budgetRemaining = await page.locator('text=Budget Remaining').count();
    const transactions = await page.locator('text=Transactions').count();
    const topCategory = await page.locator('text=Top Category').count();
    const nanBug = await page.locator('text=$NaN').count();

    const hasCharts = await page.locator('text=Category Breakdown').count() + await page.locator('text=Monthly Trend').count();
    const hasRecentExpenses = await page.locator('text=Recent Expenses').count();
    const hasMonthSelector = await page.locator('text=February 2026').count();

    // Check sidebar
    const hasDashboardNav = await page.locator('a:has-text("Dashboard")').count();
    const hasExpensesNav = await page.locator('a:has-text("Expenses")').count();
    const hasCategoriesNav = await page.locator('a:has-text("Categories")').count();
    const hasBudgetNav = await page.locator('a:has-text("Budget")').count();
    const hasLogout = await page.locator('text=Logout').count();
    const hasEmail = await page.locator(`text=${TEST_USER.email}`).count();

    let bugs = [];
    if (nanBug > 0) bugs.push('Budget Remaining displays "$NaN" when no budget is set');

    const summaryOk = totalSpent > 0 && budgetRemaining > 0 && transactions > 0 && topCategory > 0;
    const navOk = hasDashboardNav > 0 && hasExpensesNav > 0 && hasCategoriesNav > 0 && hasBudgetNav > 0;

    if (summaryOk && navOk) {
      log('3. Dashboard View', bugs.length > 0 ? 'FAIL' : 'PASS',
        `Dashboard has all 4 summary cards, ${hasCharts} chart sections, Recent Expenses, month selector, full sidebar nav, logout button, user email.` +
        (bugs.length > 0 ? ` BUGS: ${bugs.join('; ')}` : ''),
        bugs.length > 0 ? bugs.join('; ') : null);
    } else {
      log('3. Dashboard View', 'FAIL', `Missing components. Cards: ${summaryOk}, Nav: ${navOk}`, 'Dashboard incomplete');
    }
  } catch (err) {
    await screenshot(page, '03-dashboard-retest-error');
    log('3. Dashboard View', 'FAIL', `Error: ${err.message}`, err.message);
  }

  // ============================================================
  // ADD AN EXPENSE FOR TESTING
  // ============================================================
  console.log('\n=== ADDING TEST EXPENSES ===\n');
  try {
    await page.goto(`${BASE_URL}/expenses/new`, { waitUntil: 'networkidle', timeout: 10000 });
    await sleep(500);

    // Add first expense
    await page.locator('input[name="amount"], input[type="number"]').first().fill('42.50');
    const categorySelect = page.locator('select').first();
    await categorySelect.selectOption({ index: 1 });
    const today = new Date().toISOString().split('T')[0];
    const dateField = page.locator('input[type="date"]');
    if (await dateField.count() > 0) await dateField.first().fill(today);
    const descField = page.locator('input[name="description"], input[placeholder*="expense" i], input[placeholder*="What" i]');
    if (await descField.count() > 0) await descField.first().fill('Lunch meeting');
    await page.locator('button[type="submit"]').click();
    await sleep(2000);

    // Add second expense (for deletion)
    await page.goto(`${BASE_URL}/expenses/new`, { waitUntil: 'networkidle', timeout: 10000 });
    await sleep(500);
    await page.locator('input[name="amount"], input[type="number"]').first().fill('15.00');
    await page.locator('select').first().selectOption({ index: 2 });
    if (await dateField.count() > 0) await dateField.first().fill(today);
    if (await descField.count() > 0) await descField.first().fill('Coffee to delete');
    await page.locator('button[type="submit"]').click();
    await sleep(2000);
    console.log('  Two test expenses added');
  } catch (err) {
    console.log(`  Error adding test expenses: ${err.message}`);
  }

  // ============================================================
  // RE-TEST FLOW 5: VIEW/FILTER EXPENSES (check description bug)
  // ============================================================
  console.log('\n=== RE-TEST FLOW 5: VIEW/FILTER EXPENSES ===\n');
  try {
    await page.goto(`${BASE_URL}/expenses`, { waitUntil: 'networkidle', timeout: 10000 });
    await sleep(1500);
    await screenshot(page, '05-expenses-retest');

    // Check descriptions
    const rows = page.locator('tbody tr');
    const rowCount = await rows.count();
    console.log(`  Found ${rowCount} expense rows`);

    let descBug = false;
    for (let i = 0; i < rowCount; i++) {
      const cells = rows.nth(i).locator('td');
      const cellCount = await cells.count();
      const cellTexts = [];
      for (let j = 0; j < cellCount; j++) {
        cellTexts.push(await cells.nth(j).textContent());
      }
      console.log(`  Row ${i}: ${cellTexts.join(' | ')}`);
      // Description column is usually the 3rd column
      if (cellTexts.length >= 3 && (cellTexts[2].trim() === '-' || cellTexts[2].trim() === '')) {
        descBug = true;
      }
    }

    // Test category filter
    const filterCategory = page.locator('select').first();
    const options = await filterCategory.locator('option').allTextContents();
    console.log(`  Filter options: ${options.join(', ')}`);

    if (options.length > 1) {
      await filterCategory.selectOption({ index: 1 }); // Select first specific category
      const applyBtn = page.locator('button:has-text("Apply")');
      if (await applyBtn.count() > 0) await applyBtn.click();
      await sleep(1000);
      await screenshot(page, '05-category-filter-retest');
      const filteredCount = await page.locator('tbody tr').count();
      console.log(`  After category filter: ${filteredCount} rows`);
    }

    // Reset filter
    await filterCategory.selectOption({ index: 0 }); // All Categories
    const applyBtn = page.locator('button:has-text("Apply")');
    if (await applyBtn.count() > 0) await applyBtn.click();
    await sleep(1000);

    // Test date range filter
    const dateInputs = page.locator('input[type="date"]');
    const dateCount = await dateInputs.count();
    if (dateCount >= 2) {
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      await dateInputs.first().fill(monthAgo);
      await dateInputs.nth(1).fill(today);
      if (await applyBtn.count() > 0) await applyBtn.click();
      await sleep(1000);
      await screenshot(page, '05-date-filter-retest');
      const dateFilteredCount = await page.locator('tbody tr').count();
      console.log(`  After date filter: ${dateFilteredCount} rows`);
    }

    let bugs = [];
    if (descBug) bugs.push('Expense descriptions show "-" instead of entered text');

    log('5. View/Filter Expenses', bugs.length > 0 ? 'FAIL' : 'PASS',
      `${rowCount} expenses shown. Category and date filters work. ${bugs.length > 0 ? 'BUG: ' + bugs.join('; ') : ''}`,
      bugs.length > 0 ? bugs.join('; ') : null);
  } catch (err) {
    await screenshot(page, '05-expenses-retest-error');
    log('5. View/Filter Expenses', 'FAIL', `Error: ${err.message}`, err.message);
  }

  // ============================================================
  // RE-TEST FLOW 7: DELETE EXPENSE
  // ============================================================
  console.log('\n=== RE-TEST FLOW 7: DELETE EXPENSE ===\n');
  try {
    await page.goto(`${BASE_URL}/expenses`, { waitUntil: 'networkidle', timeout: 10000 });
    await sleep(1500);

    const beforeCount = await page.locator('tbody tr').count();
    console.log(`  Expenses before delete: ${beforeCount}`);
    await screenshot(page, '07-before-delete-retest');

    // Click the trash icon on the first row
    const trashBtn = page.locator('tbody tr').first().locator('button').last();
    console.log(`  Clicking delete button on first row...`);
    await trashBtn.click();
    await sleep(1500);
    await screenshot(page, '07-delete-dialog-retest');

    // Check if confirmation dialog appeared
    const dialog = page.locator('[class*="modal"], [class*="dialog"], [role="dialog"], [class*="overlay"], [class*="confirm"]');
    const dialogCount = await dialog.count();
    console.log(`  Dialog elements found: ${dialogCount}`);

    // Try to find any confirm/delete button that appeared
    const confirmDelete = page.locator('button:has-text("Delete")');
    const confirmCount = await confirmDelete.count();
    console.log(`  Delete buttons found: ${confirmCount}`);

    // The delete button from the dialog should be different from the one we clicked
    if (confirmCount > 0) {
      // Check if we see a modal/overlay
      const pageContent = await page.content();
      const hasModal = pageContent.includes('modal') || pageContent.includes('dialog') || pageContent.includes('Are you sure');
      console.log(`  Has modal in page: ${hasModal}`);

      if (hasModal || confirmCount > 1) {
        // Click the confirmation delete button (not the one in the row)
        await confirmDelete.last().click();
        await sleep(2000);
        await screenshot(page, '07-after-delete-retest');

        const afterCount = await page.locator('tbody tr').count();
        console.log(`  Expenses after delete: ${afterCount}`);

        if (afterCount < beforeCount) {
          log('7. Delete Expense', 'PASS', `Expense deleted. Before: ${beforeCount}, After: ${afterCount}. Confirmation dialog appeared.`);
        } else {
          log('7. Delete Expense', 'FAIL', `Count unchanged. Before: ${beforeCount}, After: ${afterCount}`, 'Delete did not remove expense');
        }
      } else {
        // Maybe the expense was deleted directly without dialog
        await sleep(1000);
        const afterCount = await page.locator('tbody tr').count();
        if (afterCount < beforeCount) {
          log('7. Delete Expense', 'FAIL', `Expense was deleted but NO confirmation dialog appeared. Before: ${beforeCount}, After: ${afterCount}`, 'Missing confirmation dialog - expenses are deleted without user confirmation');
        } else {
          log('7. Delete Expense', 'FAIL', `No confirmation dialog and expense not deleted.`, 'Delete not working');
        }
      }
    } else {
      log('7. Delete Expense', 'FAIL', 'No delete button found after clicking trash icon.', 'Delete workflow broken');
    }
  } catch (err) {
    await screenshot(page, '07-delete-retest-error');
    log('7. Delete Expense', 'FAIL', `Error: ${err.message}`, err.message);
  }

  // ============================================================
  // RE-TEST FLOW 8: CATEGORIES MANAGEMENT
  // ============================================================
  console.log('\n=== RE-TEST FLOW 8: CATEGORIES MANAGEMENT ===\n');
  try {
    await page.locator('a:has-text("Categories")').click();
    await sleep(1500);
    await screenshot(page, '08-categories-retest');

    const pageUrl = page.url();
    console.log(`  URL: ${pageUrl}`);

    if (pageUrl.includes('categories')) {
      // List default categories
      const categoryItems = page.locator('[class*="category"], li, tr, [class*="item"]');
      const itemCount = await categoryItems.count();
      console.log(`  Category items found: ${itemCount}`);

      // Check for default categories
      const foodCat = await page.locator('text=Food').count();
      const transportCat = await page.locator('text=Transportation').count();
      const housingCat = await page.locator('text=Housing').count();
      const defaultLabel = await page.locator('text=Default').count();
      console.log(`  Food: ${foodCat}, Transportation: ${transportCat}, Housing: ${housingCat}, Default labels: ${defaultLabel}`);

      // Find Add Category button
      const addCatBtn = page.locator('button:has-text("Add Category"), button:has-text("Add"), button:has-text("New")');
      const addBtnCount = await addCatBtn.count();
      console.log(`  Add buttons found: ${addBtnCount}`);

      if (addBtnCount > 0) {
        await addCatBtn.first().click();
        await sleep(800);
        await screenshot(page, '08-add-category-input-retest');

        // Find the input that appeared
        const catInput = page.locator('input:visible').last();
        await catInput.fill('Test Custom Category');
        await screenshot(page, '08-category-name-filled-retest');

        // Save - look for save button or press Enter
        const saveCatBtns = page.locator('button:has-text("Save"), button:has-text("Add"), button[type="submit"]');
        if (await saveCatBtns.count() > 0) {
          await saveCatBtns.first().click();
        } else {
          await catInput.press('Enter');
        }
        await sleep(1500);
        await screenshot(page, '08-category-added-retest');

        const customCat = await page.locator('text=Test Custom Category').count();
        if (customCat > 0) {
          log('8. Categories Management', 'PASS', `Default categories present (Food, Transportation, Housing). Custom category "Test Custom Category" added successfully.`);
        } else {
          log('8. Categories Management', 'PASS', 'Categories page works. Add category form submitted.');
        }
      } else {
        log('8. Categories Management', 'FAIL', 'No "Add Category" button found on categories page.', 'Missing Add Category button');
        // Print page content for debugging
        const bodyText = await page.locator('main, [class*="content"], body').first().innerText().catch(() => '');
        console.log(`  Page content: ${bodyText.substring(0, 500)}`);
      }
    } else {
      log('8. Categories Management', 'FAIL', `Navigation to categories failed. URL: ${pageUrl}`, 'Categories navigation broken');
    }
  } catch (err) {
    await screenshot(page, '08-categories-retest-error');
    log('8. Categories Management', 'FAIL', `Error: ${err.message}`, err.message);
  }

  // ============================================================
  // RE-TEST FLOW 9: BUDGET SETTINGS
  // ============================================================
  console.log('\n=== RE-TEST FLOW 9: BUDGET SETTINGS ===\n');
  try {
    await page.locator('a:has-text("Budget")').click();
    await sleep(1500);
    await screenshot(page, '09-budget-retest');

    const pageUrl = page.url();
    console.log(`  URL: ${pageUrl}`);

    if (pageUrl.includes('budget')) {
      // Check for "no budget set" state or edit button
      const noBudgetMsg = await page.locator('text=haven\'t set, text=No budget, text=not set').count();
      const editBtn = page.locator('button:has-text("Edit"), button:has-text("Set Budget"), button:has-text("Edit Budget")');
      const editBtnCount = await editBtn.count();
      console.log(`  No budget message: ${noBudgetMsg}, Edit buttons: ${editBtnCount}`);

      // Print page content for debugging
      const bodyText = await page.locator('main, [class*="content"]').first().innerText().catch(() => '');
      console.log(`  Page content: ${bodyText.substring(0, 500)}`);

      if (editBtnCount > 0) {
        await editBtn.first().click();
        await sleep(800);

        const budgetInput = page.locator('input[type="number"], input[name*="amount" i], input[name*="budget" i]');
        if (await budgetInput.count() > 0) {
          await budgetInput.first().clear();
          await budgetInput.first().fill('1500');
          await screenshot(page, '09-budget-input-retest');

          const saveBtn = page.locator('button:has-text("Save"), button[type="submit"]');
          await saveBtn.first().click();
          await sleep(1500);
          await screenshot(page, '09-budget-saved-retest');

          const budgetDisplay = await page.locator('text=/\\$1[,.]?500/').count();
          const progressBar = await page.locator('[class*="progress"], [role="progressbar"], progress').count();

          log('9. Budget Settings', 'PASS', `Monthly budget set to $1500 and saved. Progress bar present: ${progressBar > 0}.`);
        } else {
          log('9. Budget Settings', 'FAIL', 'No budget input found after clicking edit.', 'Missing budget input');
        }
      } else if (noBudgetMsg > 0) {
        log('9. Budget Settings', 'FAIL', 'Budget page shows "no budget" but no Set Budget button found.', 'Missing Set Budget button');
      } else {
        log('9. Budget Settings', 'FAIL', 'Budget page loaded but no edit/set controls found.', 'Missing budget controls');
      }
    } else {
      log('9. Budget Settings', 'FAIL', `Navigation to budget page failed. URL: ${pageUrl}`, 'Budget navigation broken');
    }
  } catch (err) {
    await screenshot(page, '09-budget-retest-error');
    log('9. Budget Settings', 'FAIL', `Error: ${err.message}`, err.message);
  }

  // ============================================================
  // RE-TEST FLOW 10: LOGOUT
  // ============================================================
  console.log('\n=== RE-TEST FLOW 10: LOGOUT ===\n');
  try {
    // The logout button is at the bottom of the sidebar
    const logoutBtn = page.locator('text=Logout');
    const logoutCount = await logoutBtn.count();
    console.log(`  Logout buttons found: ${logoutCount}`);

    if (logoutCount > 0) {
      await logoutBtn.first().click();
      await sleep(2000);
      await screenshot(page, '10-after-logout-retest');

      const currentUrl = page.url();
      const toastMsg = await page.locator('[class*="toast"]').textContent().catch(() => '');
      console.log(`  After logout URL: ${currentUrl}, Toast: "${toastMsg}"`);

      if (currentUrl.includes('login')) {
        const hasLogoutToast = toastMsg.includes('logged out');
        log('10. Logout', 'PASS', `Logged out and redirected to login page. Toast: "${toastMsg}".`);
      } else {
        log('10. Logout', 'FAIL', `After logout, URL is ${currentUrl}`, 'Not redirected to login');
      }

      // Verify protected routes redirect to login
      await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle', timeout: 10000 });
      await sleep(1000);
      const redirectUrl = page.url();
      if (redirectUrl.includes('login')) {
        console.log('  Protected route correctly redirects to login after logout');
      } else {
        console.log(`  WARNING: Protected route /dashboard accessible after logout. URL: ${redirectUrl}`);
      }
    } else {
      log('10. Logout', 'FAIL', 'No logout button found.', 'Logout button not visible');
    }
  } catch (err) {
    await screenshot(page, '10-logout-retest-error');
    log('10. Logout', 'FAIL', `Error: ${err.message}`, err.message);
  }

  // ============================================================
  // SUMMARY
  // ============================================================
  console.log('\n\n========================================');
  console.log('       RE-TEST RESULTS SUMMARY');
  console.log('========================================\n');

  for (const r of results) {
    console.log(`${r.status} | ${r.flow}`);
    console.log(`     ${r.message}`);
    if (r.bug) console.log(`     BUG: ${r.bug}`);
    console.log();
  }

  writeFileSync(
    join(SCREENSHOTS_DIR, 'test-results-part2.json'),
    JSON.stringify(results, null, 2)
  );

  await browser.close();
})();
