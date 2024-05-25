"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ColumnDef, ColumnFiltersState, VisibilityState } from "@tanstack/react-table";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import React from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function LotteryTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    is_waitlisted: false,
    is_processed: false,
    won_at: false,
    has_won: false,
    waitlisted_at: false,
    unwaitlisted_at: false,
    duplicate_ids: false,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnVisibility,
      columnFilters,
    },
  });

  return (
    <div className="rounded-md border p-1">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={
                      row.getValue("status") === "accepted"
                        ? "bg-green-500 hover:bg-green-400"
                        : row.getValue("status") === "awaiting response" || row.getValue("status") === "not contacted"
                          ? "bg-orange-500 hover:bg-orange-400"
                          : row.getValue("status") === "no response" || row.getValue("status") === "declined"
                            ? "bg-red-500 hover:bg-red-400"
                            : ""
                      // selectedStatus === "accepted" ? "bg-green-500 hover:bg-green-400" :
                      // selectedStatus === "awaiting response" || selectedStatus === "not contacted" ? "bg-orange-500 hover:bg-orange-400" :
                      // selectedStatus === "no response" || selectedStatus === "declined" ? "bg-red-500 hover:bg-red-400" :
                      // ""
                    }
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
