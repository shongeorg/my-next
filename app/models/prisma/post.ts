export interface Post {
  id: number;
  title: string;
  body: string;
}

export interface PostsResponse {
  firstPage: number;
  lastPage: number;
  currentPage: number;
  totalPages: number;
  data: Post[];
  nextPage: number | null;
  prevPage: number | null;
}
