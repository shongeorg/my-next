"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL;

export async function deletePost(postId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/auth/login");
  }

  const response = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete post");
  }

  redirect("/");
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
