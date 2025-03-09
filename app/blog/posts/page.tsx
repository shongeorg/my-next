import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PostsResponse, Post } from "../../models/prisma/post";

async function getPosts(page = 1): Promise<PostsResponse> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const url = `${baseUrl}/api/blog/posts?page=${page}`;
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      return {
        firstPage: 1,
        lastPage: 1,
        currentPage: page,
        totalPages: 1,
        data: [],
        nextPage: null,
        prevPage: null,
      };
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return {
      firstPage: 1,
      lastPage: 1,
      currentPage: page,
      totalPages: 1,
      data: [],
      nextPage: null,
      prevPage: null,
    };
  }
}

export default async function BlogPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams?.page || "1";
  const currentPage = Number.parseInt(page);

  let postsData: PostsResponse;
  try {
    postsData = await getPosts(currentPage);
  } catch (error) {
    console.error("Error in component:", error);
    postsData = {
      firstPage: 1,
      lastPage: 1,
      currentPage: 1,
      totalPages: 1,
      data: [],
      nextPage: null,
      prevPage: null,
    };
  }

  const posts = postsData?.data || [];
  const totalPages = postsData?.totalPages || 1;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Блог</h1>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium">Немає постів</h2>
          <p className="text-muted-foreground mt-2">
            Пости будуть додані пізніше
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: Post) => (
            <Card key={post.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground line-clamp-2">
                  {post.body || "Немає опису"}
                </p>
              </CardContent>
              <CardFooter>
                <Link
                  href={`/blog/posts/${post.id}`}
                  className="text-primary hover:underline"
                >
                  Читати більше
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              {postsData.prevPage && (
                <PaginationItem>
                  <PaginationPrevious
                    href={`/blog/posts?page=${postsData.prevPage}`}
                  />
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationLink
                  href={`/blog/posts?page=1`}
                  isActive={currentPage === 1}
                >
                  1
                </PaginationLink>
              </PaginationItem>

              {currentPage > 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNumber = i + 1;

                if (
                  pageNumber !== 1 &&
                  pageNumber !== totalPages &&
                  (pageNumber === currentPage - 1 ||
                    pageNumber === currentPage ||
                    pageNumber === currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href={`/blog/posts?page=${pageNumber}`}
                        isActive={pageNumber === currentPage}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                return null;
              })}

              {currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {totalPages > 1 && (
                <PaginationItem>
                  <PaginationLink
                    href={`/blog/posts?page=${totalPages}`}
                    isActive={currentPage === totalPages}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}

              {postsData.nextPage && (
                <PaginationItem>
                  <PaginationNext
                    href={`/blog/posts?page=${postsData.nextPage}`}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
