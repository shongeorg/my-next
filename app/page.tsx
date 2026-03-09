import Link from "next/link";
import { Suspense } from "react";
import { getPosts } from "@/lib/api";
import { PostCard } from "@/components/PostCard";
import { Pagination } from "@/components/Pagination";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

async function PostsContent({ page }: { page: number }) {
  const { posts, nextPage, prevPage, pages } = await getPosts(page);

  return (
    <>
      <div className="grid gap-6">
        {posts.map((post) => (
          <PostCard key={post.post_id} post={post} />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={pages}
        nextPage={nextPage}
        prevPage={prevPage}
      />
    </>
  );
}

export default async function Home({ searchParams }: PageProps) {
  const { page: pageParam } = await searchParams;
  const page = pageParam ? parseInt(pageParam, 10) : 1;

  return (
    <main className="container mx-auto max-w-3xl px-4 py-8 space-y-8">
      <header className="flex items-center justify-between space-y-2">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
          <p className="text-muted-foreground">
            Latest posts and updates
          </p>
        </div>
        <Link
          href="/posts/create"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          +
        </Link>
      </header>

      <Suspense
        key={page}
        fallback={
          <div className="grid gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-lg border p-6 space-y-4 animate-pulse"
              >
                <div className="h-6 bg-muted rounded w-3/4" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                </div>
                <div className="h-4 bg-muted rounded w-1/4" />
              </div>
            ))}
          </div>
        }
      >
        <PostsContent page={page} />
      </Suspense>
    </main>
  );
}
