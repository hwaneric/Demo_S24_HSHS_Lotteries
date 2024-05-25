"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  // getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useEffect } from "react";
import type { Filters, Response } from "../../types";
import { ButtonControl } from "./button-control";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  page: Filters;
}

export function ResponseDataTable<TData, TValue>({ columns, data, page }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    is_processed: false,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      columnVisibility,
    },
  });

  // helper function to reset table filters and set initial column visibility
  const resetTableToInitialState = () => {
    table
      .getAllColumns()
      .filter((column) => column.getCanHide())
      .map((column) => {
        column.toggleVisibility(true);
        column.setFilterValue(null);
      });
    table.getColumn("is_processed")?.toggleVisibility(false);
    table.getColumn("duplicate_ids")?.toggleVisibility(false);
    table.getColumn("banned_ids")?.toggleVisibility(false);
  };

  // function to filter the table
  function handleFilter(filter: Filters) {
    // first remove filters and set initial visibility
    resetTableToInitialState();

    // change column visibility and row filtering based on filter
    switch (filter) {
      case "unprocessed":
        table.getColumn("is_processed")?.setFilterValue(false);
        table.getColumn("waitlisted_at")?.toggleVisibility(false);
        table.getColumn("unwaitlisted_at")?.toggleVisibility(false);
        table.getColumn("won_at")?.toggleVisibility(false);
        table.getColumn("is_waitlisted")?.toggleVisibility(false);
        table.getColumn("has_won")?.toggleVisibility(false);
        table.getColumn("contact_status")?.toggleVisibility(false);
        break;
      case "processed":
        table.getColumn("is_processed")?.setFilterValue(true);
        break;
      case "waitlist":
        // filter by waitlist = true
        table.getColumn("is_waitlisted")?.setFilterValue(true);

        // hide some columns
        table.getColumn("is_duplicate")?.toggleVisibility(false);
        table.getColumn("is_waitlisted")?.toggleVisibility(false);
        table.getColumn("unwaitlisted_at")?.toggleVisibility(false);
        table.getColumn("won_at")?.toggleVisibility(false);
        table.getColumn("is_banned")?.toggleVisibility(false);

        break;
      case "not on waitlist":
        // filters
        table.getColumn("is_waitlisted")?.setFilterValue(false);
        table.getColumn("is_processed")?.setFilterValue(true);

        // hide some columns
        table.getColumn("is_waitlisted")?.toggleVisibility(false);
        break;
      case "won lottery":
        // filters and sorting
        table.getColumn("has_won")?.setFilterValue(true);
        table.getColumn("id")?.toggleSorting(false);
        table.getColumn("won_at")?.toggleSorting(true);

        // hide some columns
        table.getColumn("is_waitlisted")?.toggleVisibility(false);
        table.getColumn("is_duplicate")?.toggleVisibility(false);
        table.getColumn("waitlisted_at")?.toggleVisibility(false);
        table.getColumn("unwaitlisted_at")?.toggleVisibility(false);
        table.getColumn("is_banned")?.toggleVisibility(false);

        break;
    }
  }

  // function to filter the table when the page first renders
  useEffect(() => {
    handleFilter(page);
  }, []); //TODO: eslint

  return (
    <div className="rounded-md border">
      <ButtonControl
        handleFilter={handleFilter}
        page={page}
        selectedResponses={table.getSelectedRowModel().rows.map((row) => row.original as Response)}
        data={data}
        columns={columns}
        resetSelection={table.resetRowSelection}
      />
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="mt-10">
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
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={
                  row.getValue("is_duplicate") || row.getValue("is_banned") ? "bg-accent hover:bg-accent/70" : ""
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell className="text-center" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}{" "}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
