import { db } from "@/db";
import { itemsTable } from "@/db/schema";
import { desc } from "drizzle-orm";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export async function InventoryTable() {
  // direct db access in the server component
  // ordering by createdAt so newest items are on top
  const data = await db
    .select()
    .from(itemsTable)
    .orderBy(desc(itemsTable.createdAt));

  return (
    <div className="w-full">
      <DataTable data={data} columns={columns} />
    </div>
  );
}
