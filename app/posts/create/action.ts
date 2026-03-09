"use server";

import { redirect } from "next/navigation";

const API_BASE_URL = "https://hono-on-vercel-woad.vercel.app";

export async function createPost(prevState: any, formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const author = formData.get("author") as string;

  // Проста валідація
  const errors: Record<string, string> = {};

  if (!title || title.trim().length < 6) {
    errors.title = "Заголовок має містити щонайменше 6 символів";
  }

  if (!content || content.trim().length < 6) {
    errors.content = "Контент має містити щонайменше 6 символів";
  }

  if (!author || author.trim().length < 2) {
    errors.author = "Ім'я автора має містити щонайменше 2 символи";
  }

  if (Object.keys(errors).length > 0) {
    return { errors, values: { title, content, author } };
  }

  const response = await fetch(`${API_BASE_URL}/api/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, content, author }),
  });

  if (!response.ok) {
    return { errors: { form: "Не вдалося створити пост" }, values: { title, content, author } };
  }

  const newPost = await response.json();
  redirect(`/posts/${newPost.post_id}`);
}
