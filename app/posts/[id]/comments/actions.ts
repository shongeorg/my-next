"use server";

import { revalidatePath } from "next/cache";

const API_BASE_URL = "https://hono-on-vercel-woad.vercel.app";

export async function createComment(postId: string, formData: FormData) {
  const content = formData.get("content") as string;
  const author = formData.get("author") as string;

  const errors: Record<string, string> = {};

  if (!content || content.trim().length < 3) {
    errors.content = "Коментар має містити щонайменше 3 символи";
  }

  if (!author || author.trim().length < 2) {
    errors.author = "Ім'я має містити щонайменше 2 символи";
  }

  if (Object.keys(errors).length > 0) {
    return { errors, values: { content, author } };
  }

  const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content, author }),
  });

  if (!response.ok) {
    return { errors: { form: "Не вдалося створити коментар" }, values: { content, author } };
  }

  revalidatePath(`/posts/${postId}`);
  return { success: true };
}

export async function updateComment(postId: string, commentId: string, formData: FormData) {
  const content = formData.get("content") as string;
  const author = formData.get("author") as string;

  const errors: Record<string, string> = {};

  if (!content || content.trim().length < 3) {
    errors.content = "Коментар має містити щонайменше 3 символи";
  }

  if (!author || author.trim().length < 2) {
    errors.author = "Ім'я має містити щонайменше 2 символи";
  }

  if (Object.keys(errors).length > 0) {
    return { errors, values: { content, author } };
  }

  const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comments/${commentId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content, author }),
  });

  if (!response.ok) {
    return { errors: { form: "Не вдалося оновити коментар" }, values: { content, author } };
  }

  revalidatePath(`/posts/${postId}`);
  return { success: true };
}

export async function deleteComment(postId: string, commentId: string) {
  const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comments/${commentId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Не вдалося видалити коментар");
  }

  revalidatePath(`/posts/${postId}`);
}
