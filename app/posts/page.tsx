import { Post } from "../ui/components/post";

export default async function Posts() {
  const url = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const apiUrl = `${url}/api/posts`;
  const posts = await fetch(apiUrl).then((res) => res.json());
  return (
    <div>
      <h1>hello posts</h1>
      <div className="space-y-6">
        {posts.map((post: any) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
