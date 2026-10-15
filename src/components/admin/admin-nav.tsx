"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/venues", label: "Venues" },
  { href: "/admin/teachers", label: "Teachers" },
  { href: "/admin/courses/new", label: "Bulk courses" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/automations", label: "Automations" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-forest-100 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-forest-800">
              {BRAND.name}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal/40">
              Owner
            </span>
          </Link>
        </div>
        <nav className="-mx-1 flex gap-1 overflow-x-auto pb-1">
          {LINKS.map((link) => {
            const active =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors",
                  active
                    ? "bg-forest-700 text-white"
                    : "text-charcoal/60 hover:bg-forest-50 hover:text-forest-800"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
