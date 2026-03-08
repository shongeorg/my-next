export interface Post {
  post_id: string;
  title: string;
  content: string;
  author: string;
  slug: string;
  create_at: string;
  update_at: string;
}

export interface PostsResponse {
  posts: Post[];
  firstPage: number;
  lastPage: number;
  nextPage: number | null;
  prevPage: number | null;
  pages: number;
}
