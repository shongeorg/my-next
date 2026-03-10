import { Suspense } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { uk } from "date-fns/locale";
import { getPostsApi } from "@/lib/api";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import type { Post, Author } from "@/lib/types";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

async function PostsContent({ page }: { page: number }) {
  const result = await getPostsApi(page);
  
  if ("error" in result || !result.posts.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Постів ще немає</p>
      </div>
    );
  }

  const { posts, nextPage, prevPage, pages } = result;

  return (
    <>
      <div className="grid gap-6">
        {posts.map((post) => (
          <Link 
            key={post.post_id} 
            href={`/posts/${post.post_id}`}
            className="block rounded-lg border p-6 hover:bg-accent/50 transition-colors"
          >
            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
            <p className="text-muted-foreground line-clamp-2 mb-4">
              {post.content}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {post.authorName || post.author_id}
              </span>
              <span>•</span>
              <time dateTime={post.create_at}>
                {formatDistanceToNow(new Date(post.create_at), { addSuffix: true, locale: uk })}
              </time>
            </div>
          </Link>
        ))}
      </div>

      <nav className="flex items-center justify-center gap-2 mt-8" aria-label="Pagination">
        {prevPage ? (
          <Link href={`/?page=${prevPage}`}>
            <Button variant="outline">Попередня</Button>
          </Link>
        ) : (
          <Button variant="outline" disabled>Попередня</Button>
        )}
        
        <span className="px-4 py-2 text-sm">
          {page} / {pages}
        </span>
        
        {nextPage ? (
          <Link href={`/?page=${nextPage}`}>
            <Button variant="outline">Наступна</Button>
          </Link>
        ) : (
          <Button variant="outline" disabled>Наступна</Button>
        )}
      </nav>
    </>
  );
}

export default async function Home({ searchParams }: PageProps) {
  const { page: pageParam } = await searchParams;
  const page = pageParam ? parseInt(pageParam, 10) : 1;
  
  const cookieStore = await cookies();
  const authorCookie = cookieStore.get("author")?.value;
  const author: Author | null = authorCookie ? JSON.parse(authorCookie) : null;

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-12 space-y-8">
        <header className="flex items-center justify-between border-b pb-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold">Blog</h1>
            <p className="text-muted-foreground">Latest posts and updates</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {author ? (
              <>
                <Link href="/posts/create">
                  <Button>+ Створити пост</Button>
                </Link>
                <form action="/api/auth/logout" method="POST">
                  <Button type="submit" variant="outline">
                    Вийти ({author.name})
                  </Button>
                </form>
              </>
            ) : (
              <Link href="/auth/login">
                <Button variant="outline">Увійти</Button>
              </Link>
            )}
          </div>
        </header>

        <Suspense
          key={page}
          fallback={
            <div className="grid gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-lg border p-6 space-y-4 animate-pulse">
                  <div className="h-6 bg-muted w-3/4 rounded" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted w-full rounded" />
                    <div className="h-4 bg-muted w-5/6 rounded" />
                  </div>
                  <div className="h-4 bg-muted w-1/4 rounded" />
                </div>
              ))}
            </div>
          }
        >
          <PostsContent page={page} />
        </Suspense>
      </div>
    </main>
  );
}
