"use server";

import { db } from "@/db";
import { itemsTable } from "@/db/schema";
import { itemSchema } from "@/schema/item-schema";
import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import z from "zod";

export type ActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function createItem(data: unknown) {
  const parsedData = itemSchema.safeParse(data);

  if (!parsedData.success) {
    const flattened = z.flattenError(parsedData.error);
    return {
      success: false,
      message: "Invalid form data, please check your input and try again.",
      errors: flattened.fieldErrors,
    };
  }

  const { name, description, price, stock, imageUrl } = parsedData.data;

  try {
    const priceInCents = price * 100;
    await db.insert(itemsTable).values({
      name,
      description,
      price: priceInCents,
      stock,
      imageUrl,
    });

    revalidatePath("/manage");
    revalidatePath("/inventory");

    return {
      success: true,
      message: "Item successfully added to inventory!",
    };
  } catch (error) {
    console.error("Database error inserting item:", error);
    return {
      success: false,
      message: "An unexpected database error occurred. Please try again.",
    };
  }
}

export async function updateItem(itemId: string, data: unknown) {
  const parsedData = itemSchema.safeParse(data);

  if (!parsedData.success) {
    const flattened = z.flattenError(parsedData.error);
    return {
      success: false,
      message: "Invalid form data, please check your input and try again.",
      errors: flattened.fieldErrors,
    };
  }

  const { name, description, price, stock, imageUrl } = parsedData.data;

  try {
    const priceInCents = Math.round(price * 100);
    await db
      .update(itemsTable)
      .set({
        name,
        description,
        price: priceInCents,
        stock,
        imageUrl,
      })
      .where(eq(itemsTable.id, itemId));

    revalidatePath("/inventory");

    return {
      success: true,
      message: "Item successfully updated!",
    };
  } catch (error) {
    console.error("Database error inserting item:", error);
    return {
      success: false,
      message: "An unexpected database error occurred. Please try again.",
    };
  }
}

export async function deleteItem(itemId: string) {
  try {
    await db.delete(itemsTable).where(eq(itemsTable.id, itemId));
    revalidatePath("/inventory");
    return {
      success: true,
      message: "Item successfully deleted!",
    };
  } catch (error) {
    console.error("Database error deleting item:", error);
    return {
      success: false,
      message: "An unexpected database error occurred. Please try again.",
    };
  }
}

export async function bulkDeleteItems(itemIds: string[]) {
  if (!itemIds || itemIds.length == 0) {
    return { success: false, message: "No item selected for deletion" };
  }

  try {
    await db.delete(itemsTable).where(inArray(itemsTable.id, itemIds));
    revalidatePath("/inventory");
    return {
      success: true,
      message: `Successfully deleted ${itemIds.length} items`,
    };
  } catch (error) {
    console.log("Database error during bulk delete", error);
    return {
      success: false,
      message: "An unexpected error occured while deleting items",
    };
  }
}
