import React, { useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  PaginationState
} from "@tanstack/react-table";

interface TableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  initialItemsPerPage?: number;
}

function DataTable<TData>({
  data,
  columns,
  initialItemsPerPage = 5
}: TableProps<TData>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialItemsPerPage
  });

  const memoizedData = useMemo(() => data, [data]);
  const memoizedColumns = useMemo(() => columns, [columns]);

  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    pageCount: Math.ceil(memoizedData.length / pagination.pageSize),
    getCoreRowModel: getCoreRowModel(),
    state: {
      pagination
    },
    onPaginationChange: setPagination,
    manualPagination: true
  });

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newItemsPerPage = parseInt(event.target.value, 10);
    setPagination({ pageIndex: 0, pageSize: newItemsPerPage });
  };

  const paginatedRows = table
    .getRowModel()
    .rows.slice(
      pagination.pageIndex * pagination.pageSize,
      (pagination.pageIndex + 1) * pagination.pageSize
    );

  return (
    <div>
      <div
        className="
          heracx-relative heracx-overflow-x-auto heracx-shadow-md heracx-sm:rounded-lg 
          heracx-[&::-webkit-scrollbar]:w-2
          heracx-[&::-webkit-scrollbar-track]:rounded-full
          heracx-[&::-webkit-scrollbar-track]:bg-gray-100
          heracx-[&::-webkit-scrollbar-thumb]:rounded-full
          heracx-[&::-webkit-scrollbar-thumb]:bg-gray-300
          heracx-dark:[&::-webkit-scrollbar-track]:bg-neutral-700
          heracx-dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
      >
        <style>
          {`
          ::-webkit-scrollbar {
            width: 2px; /* Width of the scrollbar */
          }

          ::-webkit-scrollbar-track {
            background: #57574f; /* Light gray background for the track */
            border-radius: 9999px; /* Fully rounded track */
          }

          ::-webkit-scrollbar-thumb {
            background: #d1d5db; /* Gray color for the thumb */
            border-radius: 9999px; /* Fully rounded thumb */
          }

          /* Dark mode styles */
          @media (prefers-color-scheme: dark) {
            ::-webkit-scrollbar-track {
              background: #374151; /* Darker background for the track */
            }

            ::-webkit-scrollbar-thumb {
              background: #6b7280; /* Darker gray color for the thumb */
            }
          }
        `}
        </style>
        <table className="heracx-w-full text-sm heracx-text-left heracx-rtl:text-right heracx-text-gray-500 heracx-dark:text-gray-400">
          <thead className="heracx-text-xs heracx-text-gray-700 heracx-uppercase heracx-bg-gray-50 heracx-dark:bg-gray-700 heracx-dark:text-gray-400">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    scope="col"
                    className="heracx-px-6 heracx-py-3"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {paginatedRows.map((row, idx) => (
              <tr
                key={row.id + idx}
                className="heracx-odd:bg-white heracx-odd:dark:bg-gray-900 heracx-even:bg-gray-50 heracx-even:dark:bg-gray-800 heracx-border-b heracx-dark:border-gray-700"
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="heracx-px-6 heracx-py-4">
                    {/* {JSON.stringify(cell.getValue())}
                    {flexRender(cell.column.columnDef.cell, cell.getContext())} */}
                    {/* {flexRender(cell.column.columnDef.cell ?? cell.getValue, cell.getContext())} */}
                    {<>{cell.getValue()}</>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* footer */}
      <div className="heracx-p-4 heracx-dark:bg-gray-800">
        <div className="heracx-flex heracx-justify-between heracx-items-center heracx-mb-4">
          <div className="heracx-text-sm heracx-font-normal heracx-text-gray-500 heracx-dark:text-gray-400">
            <label htmlFor="itemsPerPage">Items per page:</label>
            <select
              id="itemsPerPage"
              value={pagination.pageSize}
              onChange={handleItemsPerPageChange}
              className="heracx-border heracx-border-gray-300 heracx-rounded-lg heracx-px-3 heracx-py-1.5 heracx-bg-white 
              heracx-text-gray-700 focus:heracx-outline-none focus:flai:ring-2 focus:heracx-ring-blue-500 dark:heracx-bg-gray-600 
              dark:heracx-text-gray-200 dark:heracx-border-gray-600 dark:focus:flai:ring-gray-600 heracx-ml-2"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>
          <span className="heracx-text-sm heracx-font-normal heracx-text-gray-500 heracx-dark:text-gray-400">
            Showing Page{" "}
            <span className="heracx-font-semibold heracx-text-gray-900 heracx-dark:text-white">
              {pagination.pageIndex + 1}
            </span>{" "}
            of{" "}
            <span className="heracx-font-semibold heracx-text-gray-900 heracx-dark:text-white">
              {Math.ceil(memoizedData.length / pagination.pageSize)}
            </span>
          </span>
        </div>

        <div className="heracx-inline-flex heracx-space-x-2">
          <button
            onClick={() =>
              setPagination(prev => ({
                ...prev,
                pageIndex: Math.max(prev.pageIndex - 1, 0)
              }))
            }
            disabled={pagination.pageIndex === 0}
            className="
            heracx-flex heracx-items-center heracx-justify-center heracx-px-4 heracx-h-8 
            heracx-leading-tight heracx-text-gray-200 heracx-bg-white heracx-border 
            heracx-border-gray-300 heracx-rounded-lg hover:heracx-bg-gray-100 hover:heracx-text-white 
            dark:heracx-bg-gray-600 dark:flai:border-gray-700 dark:flai:text-gray-400 dark:hover:heracx-bg-gray-700 
            dark:hover:flai:text-white"
          >
            Previous
          </button>

          {Array.from(
            { length: Math.ceil(memoizedData.length / pagination.pageSize) },
            (_, index) => (
              <button
                key={index}
                onClick={() =>
                  setPagination(prev => ({ ...prev, pageIndex: index }))
                }
                className={`heracx-flex heracx-items-center heracx-justify-center heracx-px-3 heracx-h-8 heracx-leading-tight heracx-text-gray-500 heracx-bg-white heracx-border heracx-border-gray-300 ${
                  pagination.pageIndex === index
                    ? "heracx-text-gray-200 heracx-bg-gray-600 hover:heracx-bg-gray-600 hover:flai:text-white dark:heracx-border-gray-700 dark:heracx-bg-gray-700 dark:flai:text-white"
                    : "hover:heracx-bg-gray-600 hover:heracx-text-white heracx-text-gray-200 dark:heracx-bg-gray-800 dark:flai:border-gray-700 dark:flai:text-gray-200 dark:hover:heracx-bg-gray-700 dark:hover:flai:text-white"
                }`}
              >
                {index + 1}
              </button>
            )
          )}

          <button
            onClick={() =>
              setPagination(prev => ({
                ...prev,
                pageIndex: Math.min(
                  prev.pageIndex + 1,
                  Math.ceil(memoizedData.length / pagination.pageSize) - 1
                )
              }))
            }
            disabled={
              pagination.pageIndex ===
              Math.ceil(memoizedData.length / pagination.pageSize) - 1
            }
            className="
            heracx-flex heracx-items-center heracx-justify-center heracx-px-4 heracx-h-8 
            heracx-leading-tight heracx-text-gray-200 heracx-bg-white heracx-border 
            heracx-border-gray-300 heracx-rounded-lg hover:heracx-bg-gray-100 hover:heracx-text-white 
            dark:heracx-bg-gray-600 dark:flai:border-gray-700 dark:flai:text-gray-400 dark:hover:heracx-bg-gray-700 
            dark:hover:flai:text-white"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
