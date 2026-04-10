"use client";
import { ItemForm } from "@/app/manage/_components/item-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useState } from "react";
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
          <DropdownMenuItem>Delete</DropdownMenuItem>
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
    </>
  );
}
