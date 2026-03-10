import { test, expect } from '@playwright/test';

test.describe('Post Forms', () => {
  let authToken: string;
  let testEmail: string;

  test.beforeEach(async ({ page, request }) => {
    // Register and login before each test
    testEmail = `test_${Date.now()}@test.com`;
    
    const registerResponse = await request.post('http://localhost:3000/api/auth/register', {
      data: {
        name: 'Test User',
        email: testEmail,
        password: 'password123'
      }
    });
    
    const data = await registerResponse.json();
    authToken = data.token;
    
    // Set cookies for the browser
    const context = page.context();
    await context.addCookies([{
      name: 'token',
      value: authToken,
      domain: 'localhost',
      path: '/',
      expires: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
    }, {
      name: 'author',
      value: JSON.stringify(data.author),
      domain: 'localhost',
      path: '/',
      expires: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
    }]);
  });

  test.describe('Create Post Page', () => {
    test('should display create post form', async ({ page }) => {
      await page.goto('http://localhost:3000/posts/create');
      
      await expect(page.getByRole('heading', { name: 'Створити пост' })).toBeVisible();
      await expect(page.getByLabel('Заголовок')).toBeVisible();
      await expect(page.getByLabel('Контент')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Створити пост' })).toBeVisible();
    });

    test('should show error for short title', async ({ page }) => {
      await page.goto('http://localhost:3000/posts/create');
      
      await page.getByLabel('Заголовок').fill('ABC');
      await page.getByLabel('Контент').fill('This is valid content');
      await page.getByRole('button', { name: 'Створити пост' }).click();
      
      await expect(page.getByText('Заголовок має містити щонайменше 6 символів')).toBeVisible();
    });

    test('should show error for empty title', async ({ page }) => {
      await page.goto('http://localhost:3000/posts/create');
      
      await page.getByLabel('Заголовок').fill('');
      await page.getByLabel('Контент').fill('This is valid content');
      await page.getByRole('button', { name: 'Створити пост' }).click();
      
      await expect(page.getByText('Заголовок має містити щонайменше 6 символів')).toBeVisible();
    });

    test('should show error for short content', async ({ page }) => {
      await page.goto('http://localhost:3000/posts/create');
      
      await page.getByLabel('Заголовок').fill('Valid title for post');
      await page.getByLabel('Контент').fill('ABC');
      await page.getByRole('button', { name: 'Створити пост' }).click();
      
      await expect(page.getByText('Контент має містити щонайменше 6 символів')).toBeVisible();
    });

    test('should create post successfully', async ({ page }) => {
      await page.goto('http://localhost:3000/posts/create');
      
      const title = `Test Post ${Date.now()}`;
      await page.getByLabel('Заголовок').fill(title);
      await page.getByLabel('Контент').fill('This is valid content for the post');
      await page.getByRole('button', { name: 'Створити пост' }).click();
      
      // Should redirect to the post page
      await expect(page).toHaveURL(/\/posts\/[a-f0-9-]+/);
    });
  });

  test.describe('Edit Post Page', () => {
    test('should display edit post form', async ({ page, request }) => {
      // Create a post first
      const createResponse = await request.post('http://localhost:3000/api/posts', {
        headers: { 'Authorization': `Bearer ${authToken}` },
        data: {
          title: 'Original Title',
          content: 'Original content'
        }
      });
      
      const { post_id } = await createResponse.json();
      
      await page.goto(`http://localhost:3000/posts/${post_id}/edit`);
      
      await expect(page.getByRole('heading', { name: 'Редагувати пост' })).toBeVisible();
      await expect(page.getByLabel('Заголовок')).toHaveValue('Original Title');
      await expect(page.getByLabel('Контент')).toHaveValue('Original content');
    });

    test('should show error for short title on edit', async ({ page, request }) => {
      const createResponse = await request.post('http://localhost:3000/api/posts', {
        headers: { 'Authorization': `Bearer ${authToken}` },
        data: {
          title: 'Original Title',
          content: 'Original content'
        }
      });
      
      const { post_id } = await createResponse.json();
      await page.goto(`http://localhost:3000/posts/${post_id}/edit`);
      
      await page.getByLabel('Заголовок').fill('ABC');
      await page.getByRole('button', { name: 'Зберегти зміни' }).click();
      
      await expect(page.getByText('Заголовок має містити щонайменше 6 символів')).toBeVisible();
    });

    test('should update post successfully', async ({ page, request }) => {
      const createResponse = await request.post('http://localhost:3000/api/posts', {
        headers: { 'Authorization': `Bearer ${authToken}` },
        data: {
          title: 'Original Title',
          content: 'Original content'
        }
      });
      
      const { post_id } = await createResponse.json();
      await page.goto(`http://localhost:3000/posts/${post_id}/edit`);
      
      await page.getByLabel('Заголовок').fill('Updated Title');
      await page.getByLabel('Контент').fill('Updated content here');
      await page.getByRole('button', { name: 'Зберегти зміни' }).click();
      
      // Should redirect to the post page
      await expect(page).toHaveURL(`/posts/${post_id}`);
    });
  });
});
