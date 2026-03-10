import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  nextPage: number | null;
  prevPage: number | null;
}

export function Pagination({ currentPage, totalPages, nextPage, prevPage }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex items-center justify-center gap-2 mt-8" aria-label="Pagination">
      {/* Desktop: Full pagination */}
      <div className="hidden sm:flex items-center gap-2">
        {currentPage > 1 && (
          <Link href="/?page=1">
            <Button variant="outline" size="sm">
              First
            </Button>
          </Link>
        )}

        {prevPage ? (
          <Link href={`/?page=${prevPage}`}>
            <Button variant="outline" size="sm">
              &lt;
            </Button>
          </Link>
        ) : (
          <Button variant="outline" size="sm" disabled>
            &lt;
          </Button>
        )}

        {pageNumbers.map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
              ...
            </span>
          ) : (
            <Link key={page} href={`/?page=${page}`}>
              <Button
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
              >
                {page}
              </Button>
            </Link>
          )
        )}

        {nextPage ? (
          <Link href={`/?page=${nextPage}`}>
            <Button variant="outline" size="sm">
              &gt;
            </Button>
          </Link>
        ) : (
          <Button variant="outline" size="sm" disabled>
            &gt;
          </Button>
        )}

        {currentPage < totalPages && (
          <Link href={`/?page=${totalPages}`}>
            <Button variant="outline" size="sm">
              Last
            </Button>
          </Link>
        )}
      </div>

      {/* Mobile: Simple pagination */}
      <div className="flex sm:hidden items-center gap-2">
        {prevPage ? (
          <Link href={`/?page=${prevPage}`}>
            <Button variant="outline" size="icon">
              &lt;
            </Button>
          </Link>
        ) : (
          <Button variant="outline" size="icon" disabled>
            &lt;
          </Button>
        )}

        <span className="px-4 py-2 text-sm font-medium">
          {currentPage} / {totalPages}
        </span>

        {nextPage ? (
          <Link href={`/?page=${nextPage}`}>
            <Button variant="outline" size="icon">
              &gt;
            </Button>
          </Link>
        ) : (
          <Button variant="outline" size="icon" disabled>
            &gt;
          </Button>
        )}
      </div>
    </nav>
  );
}
