"use server";

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL;

interface Post {
  post_id: string;
  title: string;
  content: string;
  author: string;
  authorName?: string;
  slug: string;
  create_at: string;
  update_at: string;
}

interface PostsResponse {
  posts: Post[];
  firstPage: number;
  lastPage: number;
  nextPage: number | null;
  prevPage: number | null;
  pages: number;
}

export async function getPosts(page: number = 1): Promise<PostsResponse> {
  const response = await fetch(`${API_BASE_URL}/api/posts?page=${page}`, {
    next: { revalidate: 0 },
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
