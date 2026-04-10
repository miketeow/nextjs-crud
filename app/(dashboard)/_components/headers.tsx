"use client";

import { cn } from "@/lib/utils";
import { Package2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container max-w-7xl mx-auto flex h-14 items-center">
        <Link href="/" className="mr-8 items-center flex space-x-2">
          <Package2 className="size-4" />
          <span className="font-bold sm:inline-block">Inventory OS</span>
        </Link>

        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link
            href="/inventory"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === "/inventory"
                ? "text-foreground"
                : "text-foreground/60",
            )}
          >
            Inventory
          </Link>
          <Link
            href="/manage"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === "/manage" ? "text-foreground" : "text-foreground/60",
            )}
          >
            Manage
          </Link>
        </nav>
      </div>
    </header>
  );
}
