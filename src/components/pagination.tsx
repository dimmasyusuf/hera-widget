// Pagination Component
import { useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import usePagination from "../hooks/usePagination";

interface PaginatorOptions {
  totalItems: number;
  perPage?: number;
  maxLinks?: number;
  currentPage: number;
}

type PaginationProps = {
  onChange: (page: number) => void;
  maxLinks?: number;
  size?: "sm" | "md";
} & PaginatorOptions;

const Pagination = ({
  totalItems,
  perPage = 10,
  maxLinks = 5,
  currentPage,
  onChange
}: PaginationProps) => {
  const pagination = usePagination({
    items: Array.from({ length: totalItems }),
    itemsPerPage: perPage
  });
  const { totalPages, goToNextPage, goToPreviousPage, goToPage } = pagination;

  useEffect(() => {
    goToPage(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    goToPage(page);
    onChange(page - 1); // Adjust for zero-indexing
  };

  const pageNumbers = Array.from(
    { length: Math.min(totalPages, maxLinks) },
    (_, index) => index + 1 + Math.max(0, currentPage - Math.ceil(maxLinks / 2))
  ).filter(page => page > 0 && page <= totalPages);

  return (
    <div className="flex space-x-2">
      <button
        aria-label="Previous Page"
        onClick={() => {
          goToPreviousPage();
          onChange(currentPage - 2); // Adjust for zero-indexing
        }}
        disabled={currentPage <= 1}
        className={`p-2 rounded-md ${
          currentPage <= 1
            ? "cursor-not-allowed opacity-50"
            : "hover:bg-gray-200"
        }`}
      >
        <ChevronLeftIcon className="h-5 w-5 text-gray-500" />
      </button>

      {pageNumbers.map(page => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`p-2 rounded-md border ${
            currentPage === page
              ? "bg-teal-50 text-teal-500 border-teal-300"
              : "bg-white text-gray-700 border-gray-200"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        aria-label="Next Page"
        onClick={() => {
          goToNextPage();
          onChange(currentPage);
        }}
        disabled={currentPage >= totalPages}
        className={`p-2 rounded-md ${
          currentPage >= totalPages
            ? "cursor-not-allowed opacity-50"
            : "hover:bg-gray-200"
        }`}
      >
        <ChevronRightIcon className="h-5 w-5 text-gray-500" />
      </button>
    </div>
  );
};

export default Pagination;
