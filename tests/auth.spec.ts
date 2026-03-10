import { test, expect } from '@playwright/test';

test.describe('Auth Forms', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cookies before each test
    const context = page.context();
    await context.clearCookies();
  });

  test.describe('Login Page', () => {
    test('should display login form', async ({ page }) => {
      await page.goto('http://localhost:3000/auth/login');
      
      await expect(page.getByRole('heading', { name: 'Увійти' })).toBeVisible();
      await expect(page.getByLabel('Email')).toBeVisible();
      await expect(page.getByLabel('Пароль')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Увійти' })).toBeVisible();
    });

    test('should show error for invalid email', async ({ page }) => {
      await page.goto('http://localhost:3000/auth/login');
      
      await page.getByLabel('Email').fill('invalid-email');
      await page.getByLabel('Пароль').fill('password123');
      await page.getByRole('button', { name: 'Увійти' }).click();
      
      await expect(page.getByText('Введіть правильний email')).toBeVisible();
    });

    test('should show error for empty email', async ({ page }) => {
      await page.goto('http://localhost:3000/auth/login');
      
      await page.getByLabel('Email').fill('');
      await page.getByLabel('Пароль').fill('password123');
      await page.getByRole('button', { name: 'Увійти' }).click();
      
      await expect(page.getByText('Введіть правильний email')).toBeVisible();
    });

    test('should show error for short password', async ({ page }) => {
      await page.goto('http://localhost:3000/auth/login');
      
      await page.getByLabel('Email').fill('test@test.com');
      await page.getByLabel('Пароль').fill('123');
      await page.getByRole('button', { name: 'Увійти' }).click();
      
      await expect(page.getByText('Пароль має містити щонайменше 6 символів')).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('http://localhost:3000/auth/login');
      
      await page.getByLabel('Email').fill('nonexistent@test.com');
      await page.getByLabel('Пароль').fill('wrongpassword');
      await page.getByRole('button', { name: 'Увійти' }).click();
      
      await expect(page.getByText('Помилка входу')).toBeVisible();
    });

    test('should login successfully', async ({ page }) => {
      const email = `test_${Date.now()}@test.com`;
      
      // First register
      await page.goto('http://localhost:3000/auth/register');
      await page.getByLabel(/Ім'я/).fill('Test User');
      await page.getByLabel('Email').fill(email);
      await page.getByLabel('Пароль').fill('password123');
      await page.getByRole('button', { name: 'Зареєструватися' }).click();
      await page.waitForURL('http://localhost:3000');
      
      // Logout by clearing cookies
      const context = page.context();
      await context.clearCookies();
      
      // Now login
      await page.goto('http://localhost:3000/auth/login');
      await page.getByLabel('Email').fill(email);
      await page.getByLabel('Пароль').fill('password123');
      await page.getByRole('button', { name: 'Увійти' }).click();
      
      await expect(page).toHaveURL('http://localhost:3000');
      await expect(page.getByRole('heading', { name: 'Blog' })).toBeVisible();
    });
  });

  test.describe('Register Page', () => {
    test('should display register form', async ({ page }) => {
      await page.goto('http://localhost:3000/auth/register');
      
      await expect(page.getByRole('heading', { name: 'Зареєструватися' })).toBeVisible();
      await expect(page.getByLabel(/Ім'я/)).toBeVisible();
      await expect(page.getByLabel('Email')).toBeVisible();
      await expect(page.getByLabel('Пароль')).toBeVisible();
    });

    test('should show error for short name', async ({ page }) => {
      await page.goto('http://localhost:3000/auth/register');
      
      await page.getByLabel(/Ім'я/).fill('A');
      await page.getByLabel('Email').fill('test@test.com');
      await page.getByLabel('Пароль').fill('password123');
      await page.getByRole('button', { name: 'Зареєструватися' }).click();
      
      await expect(page.getByText("Ім'я має містити щонайменше 2 символи")).toBeVisible();
    });

    test('should show error for invalid email', async ({ page }) => {
      await page.goto('http://localhost:3000/auth/register');
      
      await page.getByLabel(/Ім'я/).fill('Test User');
      await page.getByLabel('Email').fill('invalid');
      await page.getByLabel('Пароль').fill('password123');
      await page.getByRole('button', { name: 'Зареєструватися' }).click();
      
      await expect(page.getByText('Введіть правильний email')).toBeVisible();
    });

    test('should show error for short password', async ({ page }) => {
      await page.goto('http://localhost:3000/auth/register');
      
      await page.getByLabel(/Ім'я/).fill('Test User');
      await page.getByLabel('Email').fill('test@test.com');
      await page.getByLabel('Пароль').fill('123');
      await page.getByRole('button', { name: 'Зареєструватися' }).click();
      
      await expect(page.getByText('Пароль має містити щонайменше 6 символів')).toBeVisible();
    });

    test('should show error for existing email', async ({ page }) => {
      const email = `test_${Date.now()}@test.com`;
      
      // First registration
      await page.goto('http://localhost:3000/auth/register');
      await page.getByLabel(/Ім'я/).fill('Test User');
      await page.getByLabel('Email').fill(email);
      await page.getByLabel('Пароль').fill('password123');
      await page.getByRole('button', { name: 'Зареєструватися' }).click();
      await page.waitForURL('http://localhost:3000');
      
      // Logout
      const context = page.context();
      await context.clearCookies();
      
      // Try to register again with same email
      await page.goto('http://localhost:3000/auth/register');
      await page.getByLabel(/Ім'я/).fill('Another User');
      await page.getByLabel('Email').fill(email);
      await page.getByLabel('Пароль').fill('password123');
      await page.getByRole('button', { name: 'Зареєструватися' }).click();
      
      await expect(page.getByText(/вже існує|already exists/i)).toBeVisible();
    });

    test('should register successfully', async ({ page }) => {
      const email = `test_${Date.now()}@test.com`;
      
      await page.goto('http://localhost:3000/auth/register');
      await page.getByLabel(/Ім'я/).fill('Test User');
      await page.getByLabel('Email').fill(email);
      await page.getByLabel('Пароль').fill('password123');
      await page.getByRole('button', { name: 'Зареєструватися' }).click();
      
      await expect(page).toHaveURL('http://localhost:3000');
      await expect(page.getByRole('heading', { name: 'Blog' })).toBeVisible();
    });
  });
});
