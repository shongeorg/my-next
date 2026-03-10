"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL;

export async function updatePost(postId: string, prevState: any, formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  // Валідація
  const errors: Record<string, string> = {};

  if (!title || title.trim().length < 6) {
    errors.title = "Заголовок має містити щонайменше 6 символів";
  }

  if (!content || content.trim().length < 6) {
    errors.content = "Контент має містити щонайменше 6 символів";
  }

  if (Object.keys(errors).length > 0) {
    return { errors, values: { title, content } };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/auth/login");
  }

  const response = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content }),
  });

  const data = await response.json();

  if (!response.ok) {
    return { errors: { form: data.error || "Не вдалося оновити пост" }, values: { title, content } };
  }

  redirect(`/posts/${postId}`);
}

export async function getPost(postId: string) {
  const response = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}
