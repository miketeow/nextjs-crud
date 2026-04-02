import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container max-w-5xl flex flex-col items-center mx-auto min-h-dvh justify-center">
      <h1 className="text-3xl font-semibold tracking-tight font-mono">
        Welcome to Next JS Inventory Management System
      </h1>
      <div className="p-4 w-full justify-between flex gap-6">
        <Button asChild className="rounded-sm w-full flex-1">
          <Link href="/manage">Add Item</Link>
        </Button>
        <Button
          variant="secondary"
          asChild
          className="w-full rounded-sm flex-1 border border-gray-600"
        >
          <Link href="/inventory">View Inventory</Link>
        </Button>
      </div>
    </div>
  );
}
