import { Post } from "@/lib/types";

const API_BASE_URL = "https://hono-on-vercel-woad.vercel.app";

async function getPost(slug: string): Promise<Post | null> {
  const response = await fetch(`${API_BASE_URL}/api/posts/${slug}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return (
      <main className="container mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-bold">Post not found</h1>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-3xl px-4 py-8 space-y-6">
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <header className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="font-medium">{post.author}</span>
            <span>•</span>
            <time dateTime={post.create_at}>
              {new Date(post.create_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
        </header>

        <div className="pt-6">
          <p className="text-lg leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </div>
      </article>

      <a
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        ← Back to all posts
      </a>
    </main>
  );
}
