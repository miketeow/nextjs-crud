import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { InventoryTable } from "./_components/inventory-table";

export default function InventoryPage() {
  return (
    <div className="container max-w-5xl mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Manage your inventory
        </h1>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <InventoryTable />
      </Suspense>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-62.5" />
      <Skeleton className="h-100 w-full rounded-md " />
    </div>
  );
}
