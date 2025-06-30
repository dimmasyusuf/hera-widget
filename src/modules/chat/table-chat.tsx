"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import { PulseLoader } from "react-spinners";
import { transTabelResult } from "../../lib/helper";
import Tooltip from "../../components/tooltip";
import DataTable from "../../components/table/data-table";
import useConfig from "../../hooks/useConfig";

export type TableData = Record<string, number | string>;

export type TableChatType = {
  type: "table";
  payload: {
    content: TableData[];
  };
  isLoading: boolean;
};

type Props = {
  content: TableChatType;
  isLoading?: boolean;
};

const columnHelper = createColumnHelper<TableData>();

export const TableChat = (props: Props) => {
  const { accent_color } = useConfig();

  const columns = useMemo(() => {
    return props.content.payload?.content.length
      ? (Object.keys(props.content.payload?.content?.[0]) || []).map((key) =>
          columnHelper.accessor(key, {
            cell: (info) => {
              const value = info.row.original[key];
              return (
                <Tooltip label={value}>
                  <span className="text-gray-900">{value}</span>
                </Tooltip>
              );
            },
          }),
        )
      : [];
  }, [props.content.payload]);

  const data = useMemo(() => {
    return transTabelResult(props.content.payload.content);
  }, [props.content.payload.content]);

  if (props.content.isLoading) {
    return (
      <div className="flex items-center gap-3 text-gray-500 font-semibold">
        <PulseLoader size={8} color={accent_color || "#546FFF"} />
        <span className="text-sm">Generating table...</span>
      </div>
    );
  }

  return <DataTable data={data} columns={columns} />;
};
