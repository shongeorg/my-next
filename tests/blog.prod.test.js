import { test, expect } from '@playwright/test';

const BASE_URL = 'https://my-next-five-pearl.vercel.app';

test.describe('Production Blog Tests', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto(BASE_URL);
    
    await expect(page.getByRole('heading', { name: 'Blog' })).toBeVisible();
    await expect(page.getByText('Latest posts and updates')).toBeVisible();
  });

  test('should display posts list', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const posts = page.getByRole('link').filter({ has: page.getByRole('heading', { level: 2 }) });
    await expect(posts.first()).toBeVisible();
  });

  test('should navigate pagination', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const nextButton = page.getByRole('button', { name: 'Наступна' });
    const isNextVisible = await nextButton.isVisible();
    
    if (isNextVisible) {
      const isNextEnabled = await nextButton.isEnabled();
      if (isNextEnabled) {
        await nextButton.click();
        await expect(page).toHaveURL(/page=2/);
      }
    }
  });

  test('should toggle theme', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const themeToggle = page.getByRole('main').getByRole('button').first();
    await themeToggle.click();
    
    const html = page.locator('html');
    const hasDarkClass = await html.evaluate(el => el.classList.contains('dark'));
    expect(hasDarkClass).toBeTruthy();
  });

  test('should display login page', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/login`);
    
    await expect(page.getByRole('heading', { name: 'Увійти' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Пароль')).toBeVisible();
  });

  test('should display register page', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/register`);
    
    await expect(page.getByRole('heading', { name: 'Зареєструватися' })).toBeVisible();
    await expect(page.getByLabel(/Ім'я/)).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
  });

  test('should show validation for short password', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/register`);
    
    await page.getByLabel('Пароль').fill('123');
    await page.getByRole('button', { name: 'Зареєструватися' }).click();
    
    await expect(page.getByText(/Пароль має містити/)).toBeVisible();
  });

  test('should show validation for short title on create post', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/auth/login`);
    await page.getByLabel('Email').fill('test@test.com');
    await page.getByLabel('Пароль').fill('password123');
    await page.getByRole('button', { name: 'Увійти' }).click();
    await page.waitForTimeout(1000);
    
    await page.goto(`${BASE_URL}/posts/create`);
    
    await page.getByLabel('Заголовок').fill('ABC');
    await page.getByLabel('Контент').fill('Valid content here');
    await page.getByRole('button', { name: 'Створити пост' }).click();
    
    await expect(page.getByText(/Заголовок має містити/)).toBeVisible();
  });

  test('should display post page', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const firstPost = page.getByRole('link').filter({ has: page.getByRole('heading', { level: 2 }) }).first();
    await firstPost.click();
    
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Коментарі' })).toBeVisible();
  });

  test('should show comments section', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const firstPost = page.getByRole('link').filter({ has: page.getByRole('heading', { level: 2 }) }).first();
    await firstPost.click();
    
    await expect(page.getByRole('heading', { name: 'Коментарі' })).toBeVisible();
  });

  test('should display create post page for authenticated user', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/login`);
    await page.getByLabel('Email').fill('test@test.com');
    await page.getByLabel('Пароль').fill('password123');
    await page.getByRole('button', { name: 'Увійти' }).click();
    await page.waitForTimeout(1000);
    
    await page.goto(`${BASE_URL}/posts/create`);
    
    await expect(page.getByRole('heading', { name: 'Створити пост' })).toBeVisible();
    await expect(page.getByLabel('Заголовок')).toBeVisible();
    await expect(page.getByLabel('Контент')).toBeVisible();
  });

  test('should display edit post page', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/login`);
    await page.getByLabel('Email').fill('test@test.com');
    await page.getByLabel('Пароль').fill('password123');
    await page.getByRole('button', { name: 'Увійти' }).click();
    await page.waitForTimeout(1000);
    
    // Get first post URL
    await page.goto(BASE_URL);
    const firstPostLink = page.getByRole('link').filter({ has: page.getByRole('heading', { level: 2 }) }).first();
    const postUrl = await firstPostLink.getAttribute('href');
    
    await page.goto(`${BASE_URL}${postUrl}/edit`);
    
    await expect(page.getByRole('heading', { name: 'Редагувати пост' })).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/login`);
    await page.getByLabel('Email').fill('test@test.com');
    await page.getByLabel('Пароль').fill('password123');
    await page.getByRole('button', { name: 'Увійти' }).click();
    await page.waitForTimeout(1000);
    
    await page.getByRole('button', { name: /Вийти/ }).click();
    await page.waitForTimeout(500);
    
    await page.goto(BASE_URL);
    await expect(page.getByRole('link', { name: 'Увійти' })).toBeVisible();
  });
});
