import { Suspense } from "react";
import { getPosts } from "@/lib/api";
import { PostCard } from "@/components/PostCard";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link } from "@/components/TransitionLink";

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
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-12 space-y-8">
        <header className="flex items-center justify-between border-b pb-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Blog</h1>
            <p className="text-muted-foreground">Latest posts and updates</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/posts/create">
              <Button size="lg" className="rounded-full px-6">
                +
              </Button>
            </Link>
          </div>
        </header>

        <Suspense
          key={page}
          fallback={
            <div className="grid gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-lg border p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                  <Skeleton className="h-4 w-1/4" />
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
