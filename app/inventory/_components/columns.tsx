"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
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
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      // get the integer value from database
      const amountInCents = parseFloat(row.getValue("price"));
      // convert to floats and format as currecy
      const formatted = new Intl.NumberFormat("en-MY", {
        style: "currency",
        currency: "MYR",
      }).format(amountInCents / 100);
      // right-align to match the header
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "stock",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
];
