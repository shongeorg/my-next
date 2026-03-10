import { Suspense, cache } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { uk } from "date-fns/locale";
import { getPostsApi } from "@/lib/api";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserMenu } from "@/components/UserMenu";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import type { Post, Author } from "@/lib/types";

// Cache formatted dates to avoid recalculation
const formatPostDate = cache((dateString: string) => {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: uk });
});

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: "Blog - Latest Tech Tutorials & Development Insights",
  description: "Read the latest articles about web development, programming tutorials, and tech insights. Stay updated with modern development practices and best practices.",
  keywords: ["blog", "development", "programming", "tutorials", "tech", "web development"],
  authors: [{ name: "Blog Team" }],
  creator: "Blog Team",
  publisher: "Blog",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Blog - Latest Tech Tutorials & Development Insights",
    description: "Read the latest articles about web development, programming tutorials, and tech insights.",
    url: SITE_URL,
    siteName: "Blog",
    locale: 'uk_UA',
    type: 'website',
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Blog - Latest Tech Tutorials & Development Insights",
    description: "Read the latest articles about web development, programming tutorials, and tech insights.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

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
            style={{ contentVisibility: 'auto', containIntrinsicSize: '0 200px' }}
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
                {formatPostDate(post.create_at)}
              </time>
            </div>
          </Link>
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
  
  const cookieStore = await cookies();
  const authorCookie = cookieStore.get("author")?.value;
  const author: Author | null = authorCookie ? JSON.parse(authorCookie) : null;

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-12 space-y-8">
        <header className="flex items-center justify-between border-b pb-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold">Blog - Tech Tutorials</h1>
            <p className="text-muted-foreground">Latest posts and updates</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {author ? (
              <>
                <Link href="/posts/create">
                  <Button variant="default" size="icon" className="sm:hidden" aria-label="Створити пост">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Button>
                  <Button variant="default" className="hidden sm:inline-flex">
                    + Створити пост
                  </Button>
                </Link>
                <form action="/api/auth/logout" method="POST">
                  <Button type="submit" variant="outline" size="icon" className="sm:hidden" aria-label="Вийти">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Button>
                  <Button type="submit" variant="outline" className="hidden sm:inline-flex">
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
