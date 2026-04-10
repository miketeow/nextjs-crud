"use server";

import { db } from "@/db";
import { itemsTable } from "@/db/schema";
import { itemSchema } from "@/schema/item-schema";
import { eq } from "drizzle-orm";
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

  const { name, description, price, stock } = parsedData.data;

  try {
    const priceInCents = price * 100;
    await db.insert(itemsTable).values({
      name,
      description,
      price: priceInCents,
      stock,
    });

    revalidatePath("/manage");

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

  const { name, description, price, stock } = parsedData.data;

  try {
    const priceInCents = Math.round(price * 100);
    await db
      .update(itemsTable)
      .set({
        name,
        description,
        price: priceInCents,
        stock,
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
