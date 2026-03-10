"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL;

export async function createComment(postId: string, prevState: any, formData: FormData) {
  const content = formData.get("content") as string;

  // Валідація
  const errors: Record<string, string> = {};

  if (!content || content.trim().length < 1) {
    errors.content = "Введіть текст коментаря";
  }

  if (Object.keys(errors).length > 0) {
    return { errors, values: { content } };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/auth/login");
  }

  const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });

  const data = await response.json();

  if (!response.ok) {
    return { errors: { form: data.error || "Не вдалося створити коментар" }, values: { content } };
  }

  redirect(`/posts/${postId}`);
}

export async function deleteComment(postId: string, commentId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/auth/login");
  }

  const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete comment");
  }

  redirect(`/posts/${postId}`);
}

export async function getComments(postId: string) {
  const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comments`, {
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}
