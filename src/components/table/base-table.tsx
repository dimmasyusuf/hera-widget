"use client";

import React from "react";
import {
  SortingState,
  TableOptions,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { TablePagination } from "./table-pagination";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import FlexLayout from "../layout-flex";

export type BaseTableProps<T extends object, S> = Partial<TableOptions<T>> & {
  totalItems?: number;
  paginationSize?: "sm" | "md" | undefined;
  handlePageChanged?: ({
    pageSize,
    pageIndex
  }: {
    pageSize: number;
    pageIndex: number;
  }) => void;
  onRowClick?: (data: T, index?: number) => void;
  selectedId?: string;
  fullyShown?: boolean;
  customExpandedRender?: (data: S) => React.ReactNode;
  getExpandedSubRows?: (row: T) => S;
};

export function useBaseTable<T extends object, S>({
  data,
  columns,
  enableRowSelection,
  selectedId,
  manualPagination,
  pageCount,
  initialState,
  handlePageChanged,
  fullyShown,
  ...rest
}: Omit<
  BaseTableProps<T, S>,
  "onRowClick" | "totalItems" | "customExpandedRender" | "getExpandedSubRows"
>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    ...rest,
    columns: columns || [],
    data: data || [],
    enableRowSelection,
    manualPagination: manualPagination || false,
    pageCount: pageCount || undefined,
    initialState: initialState || undefined,
    onRowSelectionChange: val => setRowSelection(val),
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      ...rest.state,
      sorting,
      rowSelection,
      ...(fullyShown && data
        ? { pagination: { pageIndex: 0, pageSize: data.length } }
        : {})
    }
  });

  React.useEffect(() => {
    if (!selectedId) table.toggleAllRowsSelected(false);
  }, [selectedId, table]);

  const { pageIndex, pageSize } = table.getState().pagination;
  const currentPage = initialState?.pagination?.pageIndex ?? pageIndex;

  React.useEffect(() => {
    if (handlePageChanged) {
      handlePageChanged({ pageSize, pageIndex });
    }
  }, [pageIndex, pageSize, handlePageChanged]);

  const handlePageIndex = React.useCallback(
    (page: number) => {
      table.setPageIndex(page);
    },
    [table]
  );

  return { table, sorting, rowSelection, handlePageIndex, currentPage };
}

export function BaseTable<T extends object, S>({
  data,
  columns,
  enableRowSelection,
  onRowClick,
  selectedId,
  manualPagination,
  pageCount,
  initialState,
  totalItems,
  handlePageChanged,
  fullyShown,
  customExpandedRender,
  getExpandedSubRows,
  paginationSize,
  ...rest
}: BaseTableProps<T, S>) {
  const { table, currentPage, handlePageIndex, rowSelection, sorting } =
    useBaseTable({
      ...rest,
      data,
      columns,
      enableRowSelection,
      selectedId,
      manualPagination,
      pageCount,
      initialState,
      handlePageChanged,
      fullyShown
    });

  const expandedRender = React.useCallback(
    (position: number) => {
      if (!customExpandedRender) return null;

      const indexData =
        currentPage * table.getState().pagination.pageSize + position;
      const subRowsData = getExpandedSubRows
        ? getExpandedSubRows(data?.[indexData] ?? ([] as T))
        : ([] as S);
      return customExpandedRender(subRowsData);
    },
    [data, customExpandedRender, currentPage, table, getExpandedSubRows]
  );

  return (
    <FlexLayout
      auto
      direction="row"
      className="flex flex-col space-y-6 w-[95%]"
    >
      <div className="overflow-x-auto w-full">
        {" "}
        {/* Ensure it takes full width */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  const meta: any = header.column.columnDef.meta;
                  return (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      scope="col"
                      className={`${
                        meta?.isNumeric ? "text-right" : ""
                      } p-3 cursor-pointer relative`}
                      style={{
                        width: `${header.column.getSize()}px`
                      }}
                    >
                      <div className="flex items-center">
                        <span
                          className="tooltip"
                          data-tooltip={
                            header.column.columnDef.header as string
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </span>
                        <span className="ml-4">
                          {header.column.getIsSorted() ? (
                            header.column.getIsSorted() === "desc" ? (
                              <ArrowDownIcon className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ArrowUpIcon className="h-5 w-5 text-gray-500" />
                            )
                          ) : null}
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row, index) => (
              <React.Fragment key={row.id}>
                <tr
                  onClick={() => {
                    onRowClick?.(row.original, index);
                    table.resetRowSelection();
                    row.toggleSelected(true);
                  }}
                  className={`${
                    enableRowSelection && !(selectedId && row.getIsSelected())
                      ? "hover:bg-gray-50 cursor-pointer"
                      : ""
                  } ${selectedId && row.getIsSelected() ? "bg-teal-50" : ""}`}
                >
                  {row.getVisibleCells().map(cell => {
                    const meta: any = cell.column.columnDef.meta;
                    return (
                      <td
                        key={cell.id}
                        className={`${
                          meta?.isNumeric ? "text-right" : ""
                        } p-3 truncate`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>

                {row.getIsExpanded() && expandedRender(index)}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {!fullyShown && (
        <TablePagination
          currentPage={currentPage}
          onPageChange={handlePageIndex}
          pageSize={table.getState().pagination.pageSize}
          onPageSizeChange={page => table.setPageSize(page)}
          totalItems={totalItems || data?.length}
          size={paginationSize}
        />
      )}
    </FlexLayout>
  );
}
