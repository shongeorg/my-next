"use server";

import { redirect } from "next/navigation";

const API_BASE_URL = "https://hono-on-vercel-woad.vercel.app";

export async function deletePost(postId: string) {
  const response = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Не вдалося видалити пост");
  }

  redirect("/");
}
