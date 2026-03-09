import { Post } from "@/lib/types";
import { deletePost } from "./action";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ThemeToggle";

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

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Post not found</h1>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <article className="container mx-auto max-w-3xl px-4 py-12">
        <header className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              ← Back to all posts
            </Button>
          </Link>
          <ThemeToggle />
        </header>

        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div className="space-y-4 flex-1">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{post.author}</span>
                <Separator orientation="vertical" className="h-4 w-px bg-border" />
                <time dateTime={post.create_at}>
                  {new Date(post.create_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              <Link href={`/posts/${id}/edit`}>
                <Button variant="outline" size="icon" className="rounded-full" title="Edit post">
                  ✏️
                </Button>
              </Link>
              <form
                action={async () => {
                  "use server";
                  await deletePost(post.post_id);
                }}
              >
                <Button
                  variant="destructive"
                  size="icon"
                  className="rounded-full"
                  title="Delete post"
                >
                  −
                </Button>
              </form>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="prose prose-lg max-w-none dark:prose-invert">
          <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
            {post.content}
          </p>
        </div>
      </article>
    </main>
  );
}
