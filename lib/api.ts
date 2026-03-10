import { cache } from 'react';
import type {
  LoginInput,
  RegisterInput,
  CreatePostInput,
  UpdatePostInput,
  CreateCommentInput,
  UpdateCommentInput,
} from "./schemas";
import type {
  AuthResponse,
  PostsResponse,
  Post,
  Comment,
  ApiError,
  ValidationError,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// ==================== HELPER FUNCTIONS ====================

async function handleResponse<T>(response: Response): Promise<T | ApiError | ValidationError> {
  const data = await response.json();
  if (!response.ok) {
    return data as ApiError | ValidationError;
  }
  return data as T;
}

// ==================== AUTH API ====================

export async function loginApi(input: LoginInput): Promise<AuthResponse | ApiError | ValidationError> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    credentials: "include",
  });
  return handleResponse<AuthResponse>(response);
}

export async function registerApi(input: RegisterInput): Promise<AuthResponse | ApiError | ValidationError> {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    credentials: "include",
  });
  return handleResponse<AuthResponse>(response);
}

export function logout(): void {
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
  document.cookie = "author=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
  window.location.href = "/";
}

// ==================== POSTS API ====================

export const getPostsApi = cache(async (page: number = 1): Promise<PostsResponse | ApiError> => {
  const response = await fetch(`${API_BASE_URL}/api/posts?page=${page}`, {
    next: { revalidate: 60 },
  });
  return handleResponse<PostsResponse>(response);
});

export const getPostApi = cache(async (postId: string): Promise<Post | ApiError> => {
  const response = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
    next: { revalidate: 60 },
  });
  return handleResponse<Post>(response);
});

export const getCommentsApi = cache(async (postId: string): Promise<Comment[] | ApiError> => {
  const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comments`, {
    next: { revalidate: 60 },
  });
  return handleResponse<Comment[]>(response);
});

export async function createPostApi(input: CreatePostInput): Promise<Post | ApiError | ValidationError> {
  const response = await fetch(`${API_BASE_URL}/api/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    credentials: "include",
  });
  return handleResponse<Post>(response);
}

export async function updatePostApi(postId: string, input: UpdatePostInput): Promise<Post | ApiError | ValidationError> {
  const response = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    credentials: "include",
  });
  return handleResponse<Post>(response);
}

export async function deletePostApi(postId: string): Promise<{ message: string } | ApiError> {
  const response = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleResponse<{ message: string }>(response);
}

// ==================== COMMENTS API ====================

export async function createCommentApi(postId: string, input: CreateCommentInput): Promise<Comment | ApiError | ValidationError> {
  const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    credentials: "include",
  });
  return handleResponse<Comment>(response);
}

export async function updateCommentApi(postId: string, commentId: string, input: UpdateCommentInput): Promise<Comment | ApiError | ValidationError> {
  const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comments/${commentId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    credentials: "include",
  });
  return handleResponse<Comment>(response);
}

export async function deleteCommentApi(postId: string, commentId: string): Promise<{ message: string } | ApiError> {
  const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comments/${commentId}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleResponse<{ message: string }>(response);
}

// ==================== ERROR HELPERS ====================

export function getErrorMessage(result: unknown): string {
  if (typeof result === "object" && result !== null) {
    if ("details" in result && Array.isArray((result as ValidationError).details)) {
      return (result as ValidationError).details.map(d => d.message).join(", ");
    }
    if ("error" in result && typeof (result as ApiError).error === "string") {
      return (result as ApiError).error;
    }
  }
  return "Сталася невідома помилка";
}

export function isApiError(result: unknown): result is ApiError {
  return typeof result === "object" && result !== null && "error" in result;
}

export function isValidationError(result: unknown): result is ValidationError {
  return typeof result === "object" && result !== null && "details" in result && Array.isArray((result as ValidationError).details);
}
