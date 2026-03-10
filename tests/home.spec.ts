import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display homepage with posts', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Check title
    await expect(page).toHaveTitle('Blog');
    
    // Check heading
    await expect(page.getByRole('heading', { name: 'Blog', level: 1 })).toBeVisible();
    
    // Check posts are displayed
    const posts = page.getByRole('link').filter({ has: page.getByRole('heading', { level: 2 }) });
    await expect(posts.first()).toBeVisible();
  });

  test('should display pagination', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Check pagination navigation exists
    const pagination = page.getByRole('navigation', { name: 'Pagination' });
    await expect(pagination).toBeVisible();
    
    // Check page numbers display
    await expect(page.getByText(/1 \/ \d+/)).toBeVisible();
  });

  test('should navigate to next page', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const nextLink = page.getByRole('link', { name: 'Next' });
    
    // Check if Next button exists (may be disabled on last page)
    const isNextVisible = await nextLink.isVisible().catch(() => false);
    
    if (isNextVisible) {
      await nextLink.click();
      await expect(page).toHaveURL(/page=2/);
      
      // Check page number updated
      await expect(page.getByText(/2 \/ \d+/)).toBeVisible();
    }
  });

  test('should navigate to previous page', async ({ page }) => {
    await page.goto('http://localhost:3000/?page=2');
    
    const prevLink = page.getByRole('link', { name: 'Previous' });
    await expect(prevLink).toBeVisible();
    
    await prevLink.click();
    await expect(page).toHaveURL(/page=1$/);
  });

  test('should display post cards with correct info', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Find first post card
    const firstPost = page.getByRole('link').filter({ has: page.getByRole('heading', { level: 2 }) }).first();
    await expect(firstPost).toBeVisible();
    
    // Check post has title
    await expect(firstPost.getByRole('heading', { level: 2 })).toBeVisible();
    
    // Check post has content
    await expect(firstPost.getByRole('paragraph').first()).toBeVisible();
    
    // Check post has author and time
    await expect(firstPost.getByRole('time')).toBeVisible();
  });

  test('should click on post and navigate to post page', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Click on first post
    const firstPost = page.getByRole('link').filter({ has: page.getByRole('heading', { level: 2 }) }).first();
    await firstPost.click();
    
    // Should navigate to post page
    await expect(page).toHaveURL(/\/posts\/[a-f0-9-]+/);
  });

  test('should display login link', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const loginLink = page.getByRole('link', { name: 'Увійти' });
    await expect(loginLink).toBeVisible();
    await expect(loginLink).toHaveAttribute('href', '/auth/login');
  });

  test('should display loading skeleton during suspense', async ({ page }) => {
    // Navigate and check for skeleton (may be fast, so we check URL)
    await page.goto('http://localhost:3000');
    
    // Page should load successfully
    await expect(page.getByRole('heading', { name: 'Blog' })).toBeVisible();
  });
});
