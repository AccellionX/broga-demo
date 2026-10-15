"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { BRAND } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const LINKS = [
  { href: "/venues", label: "Find a class" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/account", label: "My account" },
];

export function CustomerNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-forest-100 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold tracking-tight text-forest-800">
            {BRAND.name}
          </span>
          <span className="hidden text-xs text-charcoal/50 sm:inline">
            for men
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-forest-700",
                pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "text-forest-800"
                  : "text-charcoal/70"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Button asChild variant="accent" size="sm">
            <Link href="/venues">Book a course</Link>
          </Button>
        </nav>

        <button
          type="button"
          className="rounded-lg p-2 text-charcoal md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-forest-100 bg-cream px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-base font-medium text-charcoal hover:bg-forest-50"
              >
                {link.label}
              </Link>
            ))}
            <Button asChild variant="accent" onClick={() => setOpen(false)}>
              <Link href="/venues">Book a course</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
