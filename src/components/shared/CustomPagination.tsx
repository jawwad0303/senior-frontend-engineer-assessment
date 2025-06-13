
// CustomPagination.tsx
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface CustomPaginationProps {
  total: number;
  count: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({ total, count, currentPage, onPageChange }) => {
  const maxPages = Math.ceil(total / 10);

  const generatePageNumbers = () => {
    let pages: (number | string)[] = [];
    if (maxPages <= 7) return Array.from({ length: maxPages }, (_, i) => i + 1);
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(maxPages - 1, currentPage + 1);
    if (currentPage <= 3) end = 4;
    if (currentPage >= maxPages - 2) start = maxPages - 3;
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < maxPages - 2) pages.push("...");
    pages.push(maxPages);
    return pages;
  };

  return (
    <div className="flex items-center justify-between py-4">
      <span className="text-sm text-gray-600">
        Showing {(currentPage - 1) * 10 + 1}–{Math.min(currentPage * 10, count)} of {count}
      </span>
      <Pagination>
        <PaginationContent className="flex items-center gap-2">
          <PaginationItem>
            <PaginationPrevious
              className={`rounded-full px-3 py-1 ${currentPage === 1 ? "cursor-not-allowed opacity-50" : "hover:bg-gray-200"}`}
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            />
          </PaginationItem>
          {generatePageNumbers().map((page, i) => (
            <PaginationItem key={i}>
              {page === "..." ? (
                <PaginationEllipsis />
              ) : (
                <button
                  className={`rounded-full px-3 py-1 ${page === currentPage ? "border border-blue-600 text-blue-600" : "hover:bg-gray-200"}`}
                  onClick={() => onPageChange(Number(page))}
                >
                  {page}
                </button>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              className={`rounded-full px-3 py-1 ${currentPage === maxPages ? "cursor-not-allowed opacity-50" : "hover:bg-gray-200"}`}
              onClick={() => currentPage < maxPages && onPageChange(currentPage + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default CustomPagination;
