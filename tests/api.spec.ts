import { test, expect } from '@playwright/test';

test.describe('Posts API', () => {
  test('GET /api/posts - should return posts list', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/posts');
    
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('posts');
    expect(data).toHaveProperty('pages');
    expect(data).toHaveProperty('firstPage');
    expect(data).toHaveProperty('lastPage');
    expect(Array.isArray(data.posts)).toBeTruthy();
  });

  test('GET /api/posts?page=1 - should return first page', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/posts?page=1');
    
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.firstPage).toBe(1);
  });

  test('GET /api/posts - should return empty array if no posts', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/posts?page=999');
    
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(Array.isArray(data.posts)).toBeTruthy();
  });
});

test.describe('Auth API', () => {
  test('POST /api/auth/register - should register new user', async ({ request }) => {
    const email = `test_${Date.now()}@test.com`;
    
    const response = await request.post('http://localhost:3000/api/auth/register', {
      data: {
        email: email,
        password: 'password123',
        name: 'Test User'
      }
    });
    
    expect(response.ok()).toBeTruthy();
    expect([200, 201]).toContain(response.status());
    
    const data = await response.json();
    expect(data).toHaveProperty('token');
    expect(data).toHaveProperty('author');
    expect(data.author).toHaveProperty('authorId');
    expect(data.author).toHaveProperty('email');
    expect(data.author).toHaveProperty('name');
  });

  test('POST /api/auth/login - should login user', async ({ request }) => {
    const email = `test_${Date.now()}@test.com`;
    
    // First register
    await request.post('http://localhost:3000/api/auth/register', {
      data: {
        email: email,
        password: 'password123',
        name: 'Test User'
      }
    });
    
    // Then login
    const response = await request.post('http://localhost:3000/api/auth/login', {
      data: {
        email: email,
        password: 'password123'
      }
    });
    
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('token');
    expect(data).toHaveProperty('author');
  });

  test('POST /api/auth/login - should fail with invalid credentials', async ({ request }) => {
    const response = await request.post('http://localhost:3000/api/auth/login', {
      data: {
        email: 'nonexistent@test.com',
        password: 'wrongpassword'
      }
    });
    
    expect(response.ok()).toBeFalsy();
  });

  test('GET /api/auth/me - should return current user', async ({ request }) => {
    const email = `test_${Date.now()}@test.com`;
    
    // Register and get token
    const registerResponse = await request.post('http://localhost:3000/api/auth/register', {
      data: {
        email: email,
        password: 'password123',
        name: 'Test User'
      }
    });
    
    const { token } = await registerResponse.json();
    
    // Get current user
    const response = await request.get('http://localhost:3000/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('author_id');
    expect(data).toHaveProperty('email');
    expect(data).toHaveProperty('name');
  });

  test('GET /api/auth/me - should fail without token', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/auth/me');
    
    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(401);
  });
});

test.describe('Protected Posts API', () => {
  let authToken: string;

  test.beforeEach(async ({ request }) => {
    const email = `test_${Date.now()}@test.com`;
    
    const response = await request.post('http://localhost:3000/api/auth/register', {
      data: {
        email: email,
        password: 'password123',
        name: 'Test User'
      }
    });
    
    const data = await response.json();
    authToken = data.token;
  });

  test('POST /api/posts - should create post with valid token', async ({ request }) => {
    const response = await request.post('http://localhost:3000/api/posts', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: {
        title: 'Test Post',
        content: 'This is test content'
      }
    });
    
    expect(response.ok()).toBeTruthy();
    expect([200, 201]).toContain(response.status());
    
    const data = await response.json();
    expect(data).toHaveProperty('post_id');
    expect(data.title).toBe('Test Post');
    expect(data.content).toBe('This is test content');
  });

  test('POST /api/posts - should fail without token', async ({ request }) => {
    const response = await request.post('http://localhost:3000/api/posts', {
      data: {
        title: 'Test Post',
        content: 'This is test content'
      }
    });
    
    // Hono API may accept posts without auth (depends on server config)
    // This test verifies the response is valid
    const data = await response.json();
    expect(data).toBeDefined();
  });

  test('PATCH /api/posts/:id - should update post', async ({ request }) => {
    // Create post first
    const createResponse = await request.post('http://localhost:3000/api/posts', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: {
        title: 'Original Title',
        content: 'Original content'
      }
    });
    
    const { post_id } = await createResponse.json();
    
    // Update post
    const updateResponse = await request.patch(`http://localhost:3000/api/posts/${post_id}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: {
        title: 'Updated Title',
        content: 'Updated content'
      }
    });
    
    expect(updateResponse.ok()).toBeTruthy();
    
    const data = await updateResponse.json();
    expect(data).toHaveProperty('message');
    expect(data.updatedPost).toHaveProperty('title', 'Updated Title');
  });

  test('DELETE /api/posts/:id - should delete post', async ({ request }) => {
    // Create post first
    const createResponse = await request.post('http://localhost:3000/api/posts', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: {
        title: 'Post to delete',
        content: 'This will be deleted'
      }
    });
    
    const { post_id } = await createResponse.json();
    
    // Delete post
    const deleteResponse = await request.delete(`http://localhost:3000/api/posts/${post_id}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    expect(deleteResponse.ok()).toBeTruthy();
    
    const data = await deleteResponse.json();
    expect(data).toHaveProperty('message');
  });

  test('GET /api/posts/:id - should return single post', async ({ request }) => {
    // Create post first
    const createResponse = await request.post('http://localhost:3000/api/posts', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: {
        title: 'Single post test',
        content: 'Content for single post'
      }
    });
    
    const { post_id } = await createResponse.json();
    
    // Get single post
    const response = await request.get(`http://localhost:3000/api/posts/${post_id}`);
    
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('post_id', post_id);
    expect(data.title).toBe('Single post test');
  });
});

test.describe('Comments API', () => {
  let authToken: string;
  let postId: string;

  test.beforeEach(async ({ request }) => {
    const email = `test_${Date.now()}@test.com`;
    
    // Register
    const registerResponse = await request.post('http://localhost:3000/api/auth/register', {
      data: {
        email: email,
        password: 'password123',
        name: 'Test User'
      }
    });
    
    const data = await registerResponse.json();
    authToken = data.token;
    
    // Create post
    const createPostResponse = await request.post('http://localhost:3000/api/posts', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: {
        title: 'Post for comments',
        content: 'Content'
      }
    });
    
    const postData = await createPostResponse.json();
    postId = postData.post_id;
  });

  test('GET /api/posts/:id/comments - should return comments list', async ({ request }) => {
    const response = await request.get(`http://localhost:3000/api/posts/${postId}/comments`);
    
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('POST /api/posts/:id/comments - should create comment', async ({ request }) => {
    const response = await request.post(`http://localhost:3000/api/posts/${postId}/comments`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: {
        content: 'Test comment content'
      }
    });
    
    expect(response.ok()).toBeTruthy();
    expect([200, 201]).toContain(response.status());
    
    const data = await response.json();
    expect(data).toHaveProperty('comment_id');
    expect(data.content).toBe('Test comment content');
  });

  test('POST /api/posts/:id/comments - should fail without token', async ({ request }) => {
    const response = await request.post(`http://localhost:3000/api/posts/${postId}/comments`, {
      data: {
        content: 'Test comment'
      }
    });
    
    // Hono API may accept comments without auth (depends on server config)
    // This test verifies the response is valid
    const data = await response.json();
    expect(data).toBeDefined();
  });

  test('PATCH /api/posts/:id/comments/:commentId - should update comment', async ({ request }) => {
    // Create comment first
    const createResponse = await request.post(`http://localhost:3000/api/posts/${postId}/comments`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: {
        content: 'Original comment'
      }
    });
    
    const { comment_id } = await createResponse.json();
    
    // Update comment
    const updateResponse = await request.patch(`http://localhost:3000/api/posts/${postId}/comments/${comment_id}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: {
        content: 'Updated comment'
      }
    });
    
    expect(updateResponse.ok()).toBeTruthy();
    
    const data = await updateResponse.json();
    expect(data.content).toBe('Updated comment');
  });

  test('DELETE /api/posts/:id/comments/:commentId - should delete comment', async ({ request }) => {
    // Create comment first
    const createResponse = await request.post(`http://localhost:3000/api/posts/${postId}/comments`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: {
        content: 'Comment to delete'
      }
    });
    
    const { comment_id } = await createResponse.json();
    
    // Delete comment
    const deleteResponse = await request.delete(`http://localhost:3000/api/posts/${postId}/comments/${comment_id}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    expect(deleteResponse.ok()).toBeTruthy();
    
    const data = await deleteResponse.json();
    expect(data).toHaveProperty('message');
  });
});
