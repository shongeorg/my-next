import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('SEO Tests - Dev', () => {
  test.describe('Homepage SEO', () => {
    test('should have proper title tag', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const title = await page.title();
      expect(title).toContain('Blog');
      expect(title.length).toBeGreaterThan(30);
      expect(title.length).toBeLessThan(65);
    });

    test('should have meta description', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description).toBeTruthy();
      expect(description.length).toBeGreaterThan(100);
      expect(description.length).toBeLessThan(170);
    });

    test('should have Open Graph tags', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
      const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
      const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');
      const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
      
      expect(ogTitle).toBeTruthy();
      expect(ogDescription).toBeTruthy();
      expect(ogType).toBe('website');
      expect(ogUrl).toContain('localhost:3000');
    });

    test('should have Twitter Card tags', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
      const twitterTitle = await page.locator('meta[name="twitter:title"]').getAttribute('content');
      const twitterDescription = await page.locator('meta[name="twitter:description"]').getAttribute('content');
      
      expect(twitterCard).toBe('summary_large_image');
      expect(twitterTitle).toBeTruthy();
      expect(twitterDescription).toBeTruthy();
    });

    test('should have canonical URL', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toBeTruthy();
      expect(canonical).toContain('localhost:3000');
    });

    test('should have proper H1 structure', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
      
      const h1Text = await page.locator('h1').textContent();
      expect(h1Text).toBeTruthy();
      expect(h1Text.length).toBeGreaterThan(5);
    });

    test('should have lang attribute', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const html = page.locator('html');
      const lang = await html.getAttribute('lang');
      expect(lang).toBe('uk');
    });
  });

  test.describe('Post Page SEO', () => {
    test('should have dynamic title tag', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Get first post link and open in new tab
      const firstPost = page.getByRole('link').filter({ has: page.getByRole('heading', { level: 2 }) }).first();
      const postHref = await firstPost.getAttribute('href');
      await page.goto(BASE_URL + postHref);
      
      const title = await page.title();
      expect(title).toContain('|');
      expect(title.length).toBeGreaterThan(20);
      expect(title.length).toBeLessThan(70);
    });

    test('should have dynamic meta description', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const firstPost = page.getByRole('link').filter({ has: page.getByRole('heading', { level: 2 }) }).first();
      await firstPost.click();
      
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description).toBeTruthy();
      expect(description.length).toBeGreaterThan(100);
      expect(description.length).toBeLessThan(170);
    });

    test('should have Open Graph tags for post', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Get first post and open
      const firstPost = page.getByRole('link').filter({ has: page.getByRole('heading', { level: 2 }) }).first();
      const postHref = await firstPost.getAttribute('href');
      await page.goto(BASE_URL + postHref);
      
      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
      const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
      const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');
      
      expect(ogTitle).toBeTruthy();
      expect(ogDescription).toBeTruthy();
      // Note: og:type might be 'website' from layout or 'article' from page
      expect(ogType).toMatch(/^(article|website)$/);
    });

    test('should have article schema markup', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const firstPost = page.getByRole('link').filter({ has: page.getByRole('heading', { level: 2 }) }).first();
      await firstPost.click();
      
      // Check for JSON-LD schema
      const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent();
      expect(jsonLd).toBeTruthy();
      
      const schema = JSON.parse(jsonLd);
      expect(schema['@type']).toBe('BlogPosting');
      expect(schema.headline).toBeTruthy();
      expect(schema.description).toBeTruthy();
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const firstPost = page.getByRole('link').filter({ has: page.getByRole('heading', { level: 2 }) }).first();
      await firstPost.click();
      
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
      
      const h2Count = await page.locator('h2').count();
      expect(h2Count).toBeGreaterThan(0);
    });

    test('should have author meta tag', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const firstPost = page.getByRole('link').filter({ has: page.getByRole('heading', { level: 2 }) }).first();
      await firstPost.click();
      
      const author = await page.locator('meta[name="author"]').getAttribute('content');
      expect(author).toBeTruthy();
    });

    test('should have article published time', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const firstPost = page.getByRole('link').filter({ has: page.getByRole('heading', { level: 2 }) }).first();
      await firstPost.click();
      
      const publishedTime = await page.locator('meta[property="article:published_time"]').getAttribute('content');
      expect(publishedTime).toBeTruthy();
    });
  });
});
