import { z } from "zod";

// ==================== AUTH SCHEMAS ====================

export const loginSchema = z.object({
  email: z.string().email("Невірний формат email"),
  password: z.string().min(6, "Пароль має містити щонайменше 6 символів"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Ім'я має містити щонайменше 2 символи").max(100),
  email: z.string().email("Невірний формат email"),
  password: z.string().min(6, "Пароль має містити щонайменше 6 символів"),
});

// ==================== POST SCHEMAS ====================

export const createPostSchema = z.object({
  title: z.string().min(6, "Заголовок має містити щонайменше 6 символів").max(200),
  content: z.string().min(6, "Контент має містити щонайменше 6 символів"),
});

export const updatePostSchema = z.object({
  title: z.string().min(6, "Заголовок має містити щонайменше 6 символів").max(200),
  content: z.string().min(6, "Контент має містити щонайменше 6 символів"),
});

// ==================== COMMENT SCHEMAS ====================

export const createCommentSchema = z.object({
  content: z.string().min(1, "Введіть текст коментаря"),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1, "Введіть текст коментаря"),
});

// ==================== TYPE EXPORTS ====================

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
