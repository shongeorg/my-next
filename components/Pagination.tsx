import Link from "next/link";

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
      <Link
        href={`/?page=${prevPage}`}
        className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
          prevPage
            ? "hover:bg-accent hover:text-accent-foreground"
            : "opacity-50 pointer-events-none"
        }`}
        aria-disabled={!prevPage}
      >
        Previous
      </Link>

      {pages.map((page) => (
        <Link
          key={page}
          href={`/?page=${page}`}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            page === currentPage
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent hover:text-accent-foreground"
          }`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </Link>
      ))}

      <Link
        href={`/?page=${nextPage}`}
        className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
          nextPage
            ? "hover:bg-accent hover:text-accent-foreground"
            : "opacity-50 pointer-events-none"
        }`}
        aria-disabled={!nextPage}
      >
        Next
      </Link>
    </nav>
  );
}
