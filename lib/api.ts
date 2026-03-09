import { PostsResponse, Comment } from "./types";

const API_BASE_URL = "https://hono-on-vercel-woad.vercel.app";

export async function getPosts(page: number = 1): Promise<PostsResponse> {
  const url = new URL("/api/posts", API_BASE_URL);
  url.searchParams.set("page", page.toString());

  const response = await fetch(url.toString(), {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    return {
      posts: [],
      firstPage: 1,
      lastPage: 1,
      nextPage: null,
      prevPage: null,
      pages: 1,
    };
  }

  return response.json();
}

export async function getComments(postId: string): Promise<Comment[]> {
  const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comments`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}
