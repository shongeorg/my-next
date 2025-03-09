// app/api/posts/route.js
import { AppComment } from "../../models/jsonplaceholder/comment"; // Update import
import { Post } from "../../models/jsonplaceholder/posts";
import { User } from "../../models/jsonplaceholder/user";
import { PostWithCommentAndUser } from "../../models/jsonplaceholder/posts-user";

export async function GET(request: Request) {
  const getUsers = fetch("https://jsonplaceholder.typicode.com/users").then(
    (res) => res.json()
  );
  const getPosts = fetch("https://jsonplaceholder.typicode.com/posts").then(
    (res) => res.json()
  );
  const getComments = fetch(
    "https://jsonplaceholder.typicode.com/comments"
  ).then((res) => res.json());

  const [users, posts, comments] = await Promise.all([
    getUsers,
    getPosts,
    getComments,
  ]);

  const typedUsers: User[] = users;
  const typedPosts: Post[] = posts;
  const typedComments: AppComment[] = comments;

  const postsWithUsers: PostWithCommentAndUser[] = typedPosts.map((post) => ({
    ...post,
    user: typedUsers.find((user) => user.id === post.userId)!,
    comments: typedComments.filter((comment) => comment.postId === post.id),
  }));

  return new Response(JSON.stringify(postsWithUsers), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
