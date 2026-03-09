import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  nextPage: number | null;
  prevPage: number | null;
}

export function Pagination({
  currentPage,
  totalPages,
  nextPage,
  prevPage,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
      <Link href={`/?page=${prevPage}`} aria-disabled={!prevPage}>
        <Button
          variant="outline"
          disabled={!prevPage}
          className="rounded-full"
        >
          Previous
        </Button>
      </Link>

      {pages.map((page) => (
        <Link key={page} href={`/?page=${page}`}>
          <Button
            variant={page === currentPage ? "default" : "outline"}
            className="rounded-full w-10"
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Button>
        </Link>
      ))}

      <Link href={`/?page=${nextPage}`} aria-disabled={!nextPage}>
        <Button
          variant="outline"
          disabled={!nextPage}
          className="rounded-full"
        >
          Next
        </Button>
      </Link>
    </nav>
  );
}
