"use client";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Search, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { CreateItemDialog } from "./create-item-dialog";
import { bulkDeleteItems } from "@/actions/items-actions";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DataTableProps<TData extends { id: string }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData extends { id: string }, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  // track sorting state locally
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [isPending, startTransition] = useTransition();
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getRowId: (original) => original.id,
    state: { sorting, globalFilter, rowSelection },
  });

  const handleBulkDelete = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const itemIds = selectedRows.map((row) => row.id);

    startTransition(async () => {
      const result = await bulkDeleteItems(itemIds);

      if (result.success) {
        toast.success(result.message);
        setRowSelection({});
        setIsBulkDeleteOpen(false);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="space-y-4">
      {/*toolbar*/}
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <InputGroup>
            <InputGroupInput
              placeholder="Search..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            {globalFilter && (
              <InputGroupAddon align="inline-end">
                {table.getFilteredRowModel().rows.length}{" "}
                {table.getFilteredRowModel().rows.length > 1
                  ? "results"
                  : "result"}
              </InputGroupAddon>
            )}
          </InputGroup>
        </div>
        <div className="flex items-center gap-4">
          {table.getFilteredSelectedRowModel().rows.length > 0 ? (
            <>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsBulkDeleteOpen(true)}
                disabled={isPending}
              >
                <Trash2 className="mr-2 size-4" />
                Delete {table.getFilteredSelectedRowModel().rows.length}{" "}
                Selected
              </Button>

              <Dialog
                open={isBulkDeleteOpen}
                onOpenChange={setIsBulkDeleteOpen}
              >
                <DialogContent showCloseButton={false}>
                  <DialogHeader>
                    <DialogTitle>
                      Are you sure you want to delete{" "}
                      {table.getFilteredSelectedRowModel().rows.length} items ?
                    </DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. All selected items will be
                      permanently removed
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" disabled={isPending}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      variant="destructive"
                      onClick={handleBulkDelete}
                      disabled={isPending}
                    >
                      {isPending ? "Deleting..." : "Confirm Delete"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          ) : null}
          <CreateItemDialog />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              <>
                {table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="h-15">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

                {/*padding rows*/}
                {table.getRowModel().rows.length <
                  table.getState().pagination.pageSize &&
                  Array.from({
                    length:
                      table.getState().pagination.pageSize -
                      table.getRowModel().rows.length,
                  }).map((_, index) => (
                    <TableRow
                      key={`ghost-${index}`}
                      className="hover:bg-transparent border-0"
                    >
                      <TableCell colSpan={columns.length} className="h-15" />
                    </TableRow>
                  ))}
              </>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No inventory items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/*pagination controls*/}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          className="rounded-md"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="rounded-md"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
