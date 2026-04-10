import { db } from "@/db";
import { itemsTable } from "@/db/schema";
import { desc } from "drizzle-orm";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { CreateItemDialog } from "./create-item-dialog";

export async function InventoryTable() {
  // direct db access in the server component
  // ordering by createdAt so newest items are on top
  const data = await db
    .select()
    .from(itemsTable)
    .orderBy(desc(itemsTable.createdAt));

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">Search Bar</div>
        <CreateItemDialog />
      </div>
      <DataTable data={data} columns={columns} />
    </div>
  );
}
