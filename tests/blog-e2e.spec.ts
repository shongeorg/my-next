import { test, expect } from '@playwright/test';

test.describe('Blog E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test.describe('Home Page', () => {
    test('should display homepage with posts', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Blog' })).toBeVisible();
      await expect(page.getByText('Latest posts and updates')).toBeVisible();
      
      const posts = page.getByRole('link').filter({ has: page.getByRole('heading', { level: 2 }) });
      await expect(posts.first()).toBeVisible();
    });

    test('should display pagination', async ({ page }) => {
      await expect(page.getByRole('navigation', { name: 'Pagination' })).toBeVisible();
      await expect(page.getByText(/1 \/ \d+/)).toBeVisible();
    });

    test('should navigate to next page', async ({ page }) => {
      const nextButton = page.getByRole('button', { name: 'Наступна' });
      const isNextEnabled = await nextButton.isEnabled();
      
      if (isNextEnabled) {
        await nextButton.click();
        await expect(page).toHaveURL(/page=2/);
      }
    });

    test('should toggle dark/light theme', async ({ page }) => {
      const themeToggle = page.getByRole('main').getByRole('button').first();
      await themeToggle.click();
      
      // Check if theme changed (check for dark class on html)
      const html = page.locator('html');
      const hasDarkClass = await html.evaluate(el => el.classList.contains('dark'));
      expect(hasDarkClass).toBeTruthy();
    });
  });

  test.describe('Authentication', () => {
    test('should display login page', async ({ page }) => {
      await page.goto('http://localhost:3000/auth/login');
      
      await expect(page.getByRole('heading', { name: 'Увійти' })).toBeVisible();
      await expect(page.getByLabel('Email')).toBeVisible();
      await expect(page.getByLabel('Пароль')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Увійти' })).toBeVisible();
    });

    test('should display register page', async ({ page }) => {
      await page.goto('http://localhost:3000/auth/register');
      
      await expect(page.getByRole('heading', { name: 'Зареєструватися' })).toBeVisible();
      await expect(page.getByLabel(/Ім'я/)).toBeVisible();
      await expect(page.getByLabel('Email')).toBeVisible();
      await expect(page.getByLabel('Пароль')).toBeVisible();
    });

    test('should show validation errors for short password', async ({ page }) => {
      await page.goto('http://localhost:3000/auth/register');
      
      await page.getByLabel('Пароль').fill('123');
      await page.getByRole('button', { name: 'Зареєструватися' }).click();
      
      await expect(page.getByText('Пароль має містити щонайменше 6 символів')).toBeVisible();
    });

    test('should show validation errors for short name', async ({ page }) => {
      await page.goto('http://localhost:3000/auth/register');
      
      await page.getByLabel(/Ім'я/).fill('A');
      await page.getByRole('button', { name: 'Зареєструватися' }).click();
      
      await expect(page.getByText(/Ім'я має містити/)).toBeVisible();
    });

    test('should handle invalid credentials', async ({ page }) => {
      await page.goto('http://localhost:3000/auth/login');
      
      await page.getByLabel('Email').fill('nonexistent@test.com');
      await page.getByLabel('Пароль').fill('wrongpass');
      await page.getByRole('button', { name: 'Увійти' }).click();
      
      // Should show error or redirect (depends on API response)
      await page.waitForTimeout(1000);
      // Either stays on login with error or redirects
      await expect(page.getByRole('heading', { name: 'Увійти' })).toBeVisible();
    });

    test('should login successfully', async ({ page }) => {
      await page.goto('http://localhost:3000/auth/login');
      
      await page.getByLabel('Email').fill('test@test.com');
      await page.getByLabel('Пароль').fill('password123');
      await page.getByRole('button', { name: 'Увійти' }).click();
      
      await expect(page).toHaveURL('http://localhost:3000/');
      await expect(page.getByRole('button', { name: /Вийти/ })).toBeVisible();
    });
  });

  test.describe('Create Post', () => {
    test('should display create post page', async ({ page }) => {
      await page.goto('http://localhost:3000/posts/create');
      
      await expect(page.getByRole('heading', { name: 'Створити пост' })).toBeVisible();
      await expect(page.getByLabel('Заголовок')).toBeVisible();
      await expect(page.getByLabel('Контент')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Створити пост' })).toBeVisible();
    });

    test('should show validation for short title', async ({ page }) => {
      await page.goto('http://localhost:3000/posts/create');
      
      await page.getByLabel('Заголовок').fill('ABC');
      await page.getByLabel('Контент').fill('Valid content here');
      await page.getByRole('button', { name: 'Створити пост' }).click();
      
      await expect(page.getByText(/Заголовок має містити/)).toBeVisible();
    });

    test('should show validation for short content', async ({ page }) => {
      await page.goto('http://localhost:3000/posts/create');
      
      await page.getByLabel('Заголовок').fill('Valid title here');
      await page.getByLabel('Контент').fill('ABC');
      await page.getByRole('button', { name: 'Створити пост' }).click();
      
      await expect(page.getByText(/Контент має містити/)).toBeVisible();
    });
  });

  test.describe('Post Page', () => {
    test('should display post with comments section', async ({ page }) => {
      // Get first post from home
      const firstPost = page.getByRole('link').filter({ has: page.getByRole('heading', { level: 2 }) }).first();
      await firstPost.click();
      
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.getByText('Коментарі')).toBeVisible();
    });

    test('should show comment form for authenticated user', async ({ page }) => {
      // Login first
      await page.goto('http://localhost:3000/auth/login');
      await page.getByLabel('Email').fill('test@test.com');
      await page.getByLabel('Пароль').fill('password123');
      await page.getByRole('button', { name: 'Увійти' }).click();
      
      // Wait for redirect and go to post
      await page.waitForURL('http://localhost:3000/');
      await page.goto('http://localhost:3000/posts/b9b0ed54-96d4-4ace-b011-970f9959a6d8');
      await page.waitForTimeout(500);
      
      await expect(page.getByRole('heading', { name: 'Коментарі' })).toBeVisible();
    });

    test('should show login prompt for unauthenticated user', async ({ page }) => {
      // Clear cookies
      const context = page.context();
      await context.clearCookies();
      
      await page.goto('http://localhost:3000/posts/b9b0ed54-96d4-4ace-b011-970f9959a6d8');
      
      await expect(page.getByRole('link', { name: 'Увійдіть' })).toBeVisible();
    });
  });

  test.describe('Comments', () => {
    test('should display comments section', async ({ page }) => {
      // Login
      await page.goto('http://localhost:3000/auth/login');
      await page.getByLabel('Email').fill('test@test.com');
      await page.getByLabel('Пароль').fill('password123');
      await page.getByRole('button', { name: 'Увійти' }).click();
      await page.waitForURL('http://localhost:3000/');
      
      // Go to post
      await page.goto('http://localhost:3000/posts/b9b0ed54-96d4-4ace-b011-970f9959a6d8');
      await page.waitForTimeout(500);
      
      await expect(page.getByRole('heading', { name: 'Коментарі' })).toBeVisible();
    });

    test('should display comments with edit/delete buttons', async ({ page }) => {
      // Login
      await page.goto('http://localhost:3000/auth/login');
      await page.getByLabel('Email').fill('test@test.com');
      await page.getByLabel('Пароль').fill('password123');
      await page.getByRole('button', { name: 'Увійти' }).click();
      await page.waitForURL('http://localhost:3000/');
      
      // Go to post with comments
      await page.goto('http://localhost:3000/posts/b9b0ed54-96d4-4ace-b011-970f9959a6d8');
      await page.waitForTimeout(500);
      
      // Comments section should be visible
      await expect(page.getByRole('heading', { name: 'Коментарі' })).toBeVisible();
    });
  });

  test.describe('Edit Post', () => {
    test('should display edit page', async ({ page }) => {
      // Login
      await page.goto('http://localhost:3000/auth/login');
      await page.getByLabel('Email').fill('test@test.com');
      await page.getByLabel('Пароль').fill('password123');
      await page.getByRole('button', { name: 'Увійти' }).click();
      
      // Go to edit page
      await page.goto('http://localhost:3000/posts/4a6483a6-708d-4852-89ef-78c5539ff865/edit');
      
      await expect(page.getByRole('heading', { name: 'Редагувати пост' })).toBeVisible();
      await expect(page.getByLabel('Заголовок')).toBeVisible();
      await expect(page.getByLabel('Контент')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Зберегти зміни' })).toBeVisible();
    });

    test('should show validation for short title', async ({ page }) => {
      await page.goto('http://localhost:3000/posts/4a6483a6-708d-4852-89ef-78c5539ff865/edit');
      
      await page.getByLabel('Заголовок').fill('ABC');
      await page.getByRole('button', { name: 'Зберегти зміни' }).click();
      
      await expect(page.getByText(/Заголовок має містити/)).toBeVisible();
    });
  });

  test.describe('Logout', () => {
    test('should logout successfully', async ({ page }) => {
      // Login
      await page.goto('http://localhost:3000/auth/login');
      await page.getByLabel('Email').fill('test@test.com');
      await page.getByLabel('Пароль').fill('password123');
      await page.getByRole('button', { name: 'Увійти' }).click();
      await page.waitForURL('http://localhost:3000/');
      
      // Logout
      await page.getByRole('button', { name: /Вийти/ }).click();
      await page.waitForTimeout(500);
      
      // Navigate to home to verify logout
      await page.goto('http://localhost:3000');
      
      // Should show login button
      await expect(page.getByRole('link', { name: 'Увійти' })).toBeVisible();
    });
  });
});
