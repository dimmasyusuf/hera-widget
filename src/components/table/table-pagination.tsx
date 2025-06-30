// TablePagination Component
import React from "react";
import Pagination from "../pagination";

type TablePaginationProps = {
  currentPage: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
  totalItems?: number;
  maxLinks?: number;
  size?: "sm" | "md";
};

export const TablePagination = ({
  currentPage,
  onPageChange,
  pageSize,
  onPageSizeChange,
  totalItems,
  maxLinks = 5,
  size
}: TablePaginationProps) => {
  const totalPages = Math.ceil((totalItems || 1) / pageSize);

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex gap-4 items-center">
        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-600 whitespace-nowrap">
            {size === "sm" ? "Page size" : "Rows per page"}
          </span>
          <select
            className="border border-gray-300 rounded-lg p-1 text-sm focus:border-teal-400"
            value={pageSize}
            onChange={e => onPageSizeChange(Number(e.target.value))}
          >
            {[5, 10, 20].map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <span className="text-sm text-gray-600">
          Total {size !== "sm" && "records"}: <strong>{totalItems || 0}</strong>
        </span>
      </div>
      <div>
        <Pagination
          totalItems={totalPages}
          currentPage={currentPage + 1} // Convert zero-indexed to human-readable
          onChange={onPageChange}
          perPage={1} // Per page for pagination links
          maxLinks={maxLinks}
          size={size}
        />
      </div>
    </div>
  );
};
