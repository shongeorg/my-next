import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { uk } from "date-fns/locale";
import { cookies } from "next/headers";
import Link from "next/link";
import { getPostApi, getCommentsApi } from "@/lib/api";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { CommentsSection } from "./CommentsSection";
import type { Post, Comment, Author } from "@/lib/types";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  
  const postResult = await getPostApi(id);
  if ("error" in postResult) notFound();
  const post = postResult as Post;
  
  const commentsResult = await getCommentsApi(id);
  const comments = ("error" in commentsResult) ? [] : commentsResult as Comment[];
  
  const cookieStore = await cookies();
  const authorCookie = cookieStore.get("author");
  const author: Author | null = authorCookie?.value ? JSON.parse(decodeURIComponent(authorCookie.value)) : null;
  const isAuthor = author && author.authorId === post.author_id;

  return (
    <main className="min-h-screen bg-background">
      <article className="container mx-auto max-w-3xl px-4 py-12">
        <header className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="outline">← Back to all posts</Button>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isAuthor && (
              <>
                <Link href={`/posts/${id}/edit`}>
                  <Button variant="outline">✏️ Edit</Button>
                </Link>
                <form action={`/api/posts/${id}/delete`} method="POST">
                  <Button type="submit" variant="destructive">− Delete</Button>
                </form>
              </>
            )}
          </div>
        </header>

        <div className="space-y-6 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold">{post.title}</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {post.authorName || post.author_id}
            </span>
            <span>•</span>
            <time dateTime={post.create_at}>
              {formatDistanceToNow(new Date(post.create_at), { addSuffix: true, locale: uk })}
            </time>
          </div>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
          <p className="text-lg leading-relaxed whitespace-pre-wrap">{post.content}</p>
        </div>

        <CommentsSection postId={id} comments={comments} author={author} />
      </article>
    </main>
  );
}
