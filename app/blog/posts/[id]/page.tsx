import { notFound } from "next/navigation";

async function getPost(id: number) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/blog/posts/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}

export default async function BlogPostsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  const post = await getPost(id);
  if (!post) {
    notFound();
  }
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-muted-foreground">{post.body}</p>
    </div>
  );
}
