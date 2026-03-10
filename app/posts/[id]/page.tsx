import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { uk } from "date-fns/locale";
import { cookies } from "next/headers";
import Link from "next/link";
import { getPostApi, getCommentsApi } from "@/lib/api";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { CommentsSection } from "./CommentsSection";
import type { Post, Comment, Author, Metadata } from "@/lib/types";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

interface PostPageProps {
  params: Promise<{ id: string }>;
}

// Generate metadata for post page
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { id } = await params;
  const postResult = await getPostApi(id);
  
  if ("error" in postResult) {
    return {
      title: "Post Not Found | Blog",
    };
  }
  
  const post = postResult as Post;
  const postUrl = `${SITE_URL}/posts/${id}`;
  
  return {
    title: `${post.title} | Blog`,
    description: post.content.substring(0, 155) + '...',
    keywords: ["blog", "post", "development", "programming"],
    authors: [{ name: post.authorName || "Blog Team" }],
    openGraph: {
      title: post.title,
      description: post.content.substring(0, 155) + '...',
      url: postUrl,
      siteName: "Blog",
      locale: 'uk_UA',
      type: 'article',
      publishedTime: post.create_at,
      modifiedTime: post.update_at,
      authors: [post.authorName || "Blog Team"],
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.content.substring(0, 155) + '...',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;

  // CRITICAL: Eliminate waterfall - fetch post and comments in parallel
  const [postResult, commentsResult] = await Promise.all([
    getPostApi(id),
    getCommentsApi(id)
  ]);
  
  if ("error" in postResult) notFound();
  const post = postResult as Post;

  const comments = ("error" in commentsResult) ? [] : commentsResult as Comment[];

  const cookieStore = await cookies();
  const authorCookie = cookieStore.get("author");
  const author: Author | null = authorCookie?.value ? JSON.parse(decodeURIComponent(authorCookie.value)) : null;
  const isAuthor = author && author.authorId === post.author_id;

  // JSON-LD Schema for BlogPosting
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.content.substring(0, 155) + '...',
    "image": `${SITE_URL}/og-image.png`,
    "datePublished": post.create_at,
    "dateModified": post.update_at,
    "author": {
      "@type": "Person",
      "name": post.authorName || "Blog Team",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Blog",
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/logo.png`,
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_URL}/posts/${id}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
    </>
  );
}
