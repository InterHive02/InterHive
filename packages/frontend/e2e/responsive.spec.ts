import { test, expect, Page } from '@playwright/test';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

async function injectAuth(page: Page, role = 'admin') {
  await page.addInitScript(({ role }: { role: string }) => {
    const fakeUser = {
      id: 'test-user-e2e',
      role,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@interhive.test',
      profilePhoto: '',
    };
    localStorage.setItem('accessToken', 'fake-e2e-token');
    localStorage.setItem('refreshToken', 'fake-e2e-refresh');
    localStorage.setItem('user', JSON.stringify(fakeUser));
  }, { role });
}

async function mockApis(page: Page) {
  await page.route(/\/api\/v1\//, async (route) => {
    const url = route.request().url();
    if (url.includes('/auth/me')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            user: {
              id: 'test-user-e2e',
              role: 'admin',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@interhive.test',
            },
          },
          user: {
            id: 'test-user-e2e',
            role: 'admin',
            firstName: 'Test',
            lastName: 'User',
            email: 'test@interhive.test',
          },
        }),
      });
    }

    if (url.includes('/analytics/admin-dashboard')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            metrics: [
              { id: '1', title: 'Total Interns', value: '128', change: '+12%', trend: 'up' },
              { id: '2', title: 'Partner Companies', value: '42', change: '+4%', trend: 'up' },
              { id: '3', title: 'Active Placements', value: '95', change: '+18%', trend: 'up' },
              { id: '4', title: 'Platform Health', value: '99.8%', change: '+0.2%', trend: 'up' },
            ],
            activities: [
              {
                id: 'act-1',
                name: 'Sarah Connor',
                email: 'sarah@test.com',
                role: 'Frontend Intern',
                date: 'Today, 2:30 PM',
                status: 'Active',
                entityType: 'intern',
              },
            ],
            services: [],
          },
        }),
      });
    }

    // Default mock response
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: [],
        count: 0,
        total: 0,
      }),
    });
  });
}

async function assertNoHorizontalOverflow(page: Page, label: string) {
  const overflow = await page.evaluate(() => {
    const el = document.documentElement;
    return el.scrollWidth - el.clientWidth;
  });
  expect(overflow, `${label}: horizontal overflow = ${overflow}px`).toBeLessThanOrEqual(0);
}

const VIEWPORTS = [
  { width: 375, height: 812, label: '375px (mobile)' },
  { width: 768, height: 1024, label: '768px (tablet)' },
  { width: 1024, height: 768, label: '1024px (desktop)' },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// 1. SIDEBAR (shared/components/layout/sidebar.tsx)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('1. SIDEBAR', () => {
  test('Mobile drawer opens correctly even when collapsed on desktop first', async ({ page }) => {
    await injectAuth(page, 'admin');
    await mockApis(page);

    // Step A: Load authenticated route at >= 1024px desktop
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/admin/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('header', { timeout: 10000 });

    // Step B: Set isCollapsed = true by clicking desktop toggle button
    const desktopToggle = page.getByTestId('desktop-sidebar-toggle');
    await expect(desktopToggle).toBeVisible();
    await desktopToggle.click();
    await page.waitForTimeout(300);

    // Step C: Resize down to 375px mobile
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(300);

    // Step D: Open mobile menu drawer via hamburger button
    const mobileMenuBtn = page.getByTestId('mobile-menu-btn');
    await expect(mobileMenuBtn).toBeVisible();
    await mobileMenuBtn.click();
    await page.waitForTimeout(400);

    // Assert 1: Close (X) button is visible
    const closeBtn = page.getByTestId('sidebar-close-btn');
    await expect(closeBtn, 'Close (X) button is visible').toBeVisible();

    // Assert 2: At least one nav route label (text) is visible, not just icons
    const navText = page.locator('aside nav a, aside [role="navigation"] a, aside a').filter({
      hasText: /dashboard|applications|leads|interns|companies|assessments|training|analytics|settings|profile/i,
    });
    await expect(navText.first(), 'At least one nav route label is visible').toBeVisible();

    // Assert 3: User profile card is visible
    const profileCard = page.getByTestId('sidebar-profile-card');
    await expect(profileCard, 'User profile card is visible').toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. NO HORIZONTAL OVERFLOW
// ─────────────────────────────────────────────────────────────────────────────
test.describe('2. NO HORIZONTAL OVERFLOW', () => {
  const pages = [
    { url: '/', label: 'Landing page', role: undefined },
    { url: '/dashboard', label: 'intern-dashboard', role: 'intern' },
    { url: '/company/dashboard', label: 'company-dashboard', role: 'company' },
    { url: '/admin/dashboard', label: 'admin-dashboard', role: 'admin' },
    { url: '/communication', label: 'communication page', role: 'admin' },
    { url: '/attendance', label: 'attendance page', role: 'intern' },
  ] as const;

  for (const viewport of VIEWPORTS) {
    for (const pg of pages) {
      test(`${pg.label} at ${viewport.label}`, async ({ page }) => {
        if (pg.role) await injectAuth(page, pg.role);
        await mockApis(page);
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(pg.url, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(600);
        await assertNoHorizontalOverflow(page, `${pg.label} @ ${viewport.label}`);
      });
    }
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. TABLE STACKING
// ─────────────────────────────────────────────────────────────────────────────
test.describe('3. TABLE STACKING', () => {
  test('At 375px: card view is visible and table element is hidden', async ({ page }) => {
    await injectAuth(page, 'admin');
    await mockApis(page);

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/admin/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('header', { timeout: 10000 });

    const cardView = page.getByTestId('activity-card-list');
    const tableWrapper = page.getByTestId('activity-desktop-table');

    await expect(cardView).toBeAttached();
    const cardDisplay = await cardView.evaluate((el: Element) => window.getComputedStyle(el).display);
    expect(cardDisplay, 'Card view should not be none at 375px').not.toBe('none');

    await expect(tableWrapper).toBeAttached();
    const tableDisplay = await tableWrapper.evaluate((el: Element) => window.getComputedStyle(el).display);
    expect(tableDisplay, 'Desktop table wrapper should be none at 375px').toBe('none');

    // Assert the <table> element itself is also not visible
    const tableElement = tableWrapper.locator('table');
    await expect(tableElement).toBeHidden();
  });

  test('At 1024px: table is visible and card view is hidden', async ({ page }) => {
    await injectAuth(page, 'admin');
    await mockApis(page);

    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/admin/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('header', { timeout: 10000 });

    const cardView = page.getByTestId('activity-card-list');
    const tableWrapper = page.getByTestId('activity-desktop-table');

    await expect(cardView).toBeAttached();
    const cardDisplay = await cardView.evaluate((el: Element) => window.getComputedStyle(el).display);
    expect(cardDisplay, 'Card view should be none at 1024px').toBe('none');

    await expect(tableWrapper).toBeAttached();
    const tableDisplay = await tableWrapper.evaluate((el: Element) => window.getComputedStyle(el).display);
    expect(tableDisplay, 'Desktop table wrapper should not be none at 1024px').not.toBe('none');

    // Assert the <table> element itself is visible
    const tableElement = tableWrapper.locator('table');
    await expect(tableElement).toBeVisible();
  });

  test('Partner Companies table stacking at 375px and 1024px', async ({ page }) => {
    await injectAuth(page, 'admin');
    await mockApis(page);

    // Test at 375px
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/admin/companies', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('header', { timeout: 10000 });

    const cardView = page.getByTestId('company-card-list');
    const tableWrapper = page.getByTestId('company-desktop-table');

    await expect(cardView).toBeAttached();
    const cardDisplayMobile = await cardView.evaluate((el: Element) => window.getComputedStyle(el).display);
    expect(cardDisplayMobile, 'Company card view not none at 375px').not.toBe('none');

    const tableDisplayMobile = await tableWrapper.evaluate((el: Element) => window.getComputedStyle(el).display);
    expect(tableDisplayMobile, 'Company table wrapper none at 375px').toBe('none');

    // Test at 1024px
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForTimeout(300);

    const cardDisplayDesktop = await cardView.evaluate((el: Element) => window.getComputedStyle(el).display);
    expect(cardDisplayDesktop, 'Company card view none at 1024px').toBe('none');

    const tableDisplayDesktop = await tableWrapper.evaluate((el: Element) => window.getComputedStyle(el).display);
    expect(tableDisplayDesktop, 'Company table wrapper not none at 1024px').not.toBe('none');
  });
});
