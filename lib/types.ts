// ==================== AUTH TYPES ====================

export interface Author {
  authorId: string;
  email: string;
  name: string;
  create_at?: string;
}

export interface AuthResponse {
  message: string;
  author: Author;
  token: string;
}

// ==================== POST TYPES ====================

export interface Post {
  post_id: string;
  title: string;
  content: string;
  author_id: string;
  slug: string;
  create_at: string;
  update_at: string;
  authorName?: string;
  authorEmail?: string;
}

export interface PostsResponse {
  firstPage: number;
  lastPage: number;
  nextPage: number | null;
  prevPage: number | null;
  pages: number;
  posts: Post[];
}

// ==================== COMMENT TYPES ====================

export interface Comment {
  comment_id: string;
  post_id: string;
  content: string;
  author_id: string;
  create_at: string;
  update_at?: string;
  authorName?: string;
}

// ==================== ERROR TYPES ====================

export interface ApiError {
  error: string;
}

export interface ValidationError {
  error: string;
  details: Array<{
    field: string;
    message: string;
  }>;
}
