import { Post } from "@/lib/types";
import EditPostForm from "./EditPostForm";

const API_BASE_URL = "https://hono-on-vercel-woad.vercel.app";

async function getPost(id: string): Promise<Post | null> {
  const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPageProps) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return (
      <main className="container mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-bold">Post not found</h1>
      </main>
    );
  }

  return (
    <EditPostForm
      postId={post.post_id}
      initialData={{
        title: post.title,
        content: post.content,
        author: post.author,
      }}
    />
  );
}
