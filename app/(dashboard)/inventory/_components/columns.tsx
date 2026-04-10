"use client";
import { deleteItem } from "@/actions/items-actions";
import { ItemForm } from "@/app/(dashboard)/manage/_components/item-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
export type InventoryItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: Date;
};

export const columns: ColumnDef<InventoryItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name: string = row.getValue("name");

      return (
        <div className="max-w-40 truncate font-medium" title={name}>
          {name}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description: string = row.getValue("description");

      return (
        <div className="max-w-80 truncate font-medium " title={description}>
          {description}
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: () => <div className="text-center">Price</div>,
    cell: ({ row }) => {
      // get the integer value from database
      const amountInCents = parseFloat(row.getValue("price"));
      // convert to floats and format as currecy
      const formatted = new Intl.NumberFormat("en-MY", {
        style: "currency",
        currency: "MYR",
      }).format(amountInCents / 100);
      // right-align to match the header
      return <div className="text-center font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "stock",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          Stock
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const stock = parseInt(row.getValue("stock"));
      // add visual ux, red colout for low stock
      const isLowStock = stock < 10;
      return (
        <div
          className={`ml-4 ${isLowStock ? "text-destructive font-bold" : ""}`}
        >
          {stock}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

function DataTableRowActions({ row }: { row: Row<InventoryItem> }) {
  const book = row.original;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteItem(book.id);

      if (result.success) {
        toast.success(result.message);
        setIsDeleteOpen(false);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <span className="sr-only">Open Menu</span>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDeleteOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Items</DialogTitle>
            <DialogDescription>Edit the item information</DialogDescription>
          </DialogHeader>
          <ItemForm initialData={book} onSuccess={() => setIsEditOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this items ?
            </DialogTitle>
            <DialogDescription>This action cannot be undone</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
