"use client";

import Link from "next/link";
import { PRODUCTS } from "@/lib/mock-data";
import { formatGBP } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function Pricing() {
  return (
    <section id="pricing" className="border-y border-forest-100 bg-white/60 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-charcoal sm:text-4xl">
          Simple pricing
        </h2>
        <p className="mt-2 text-charcoal/70">
          Sample GBP prices for the demo. Pick what fits.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {PRODUCTS.map((p) => (
            <div
              key={p.id}
              className={cn(
                "relative flex flex-col rounded-xl border bg-white p-5 shadow-sm",
                p.popular
                  ? "border-accent ring-2 ring-accent/30"
                  : "border-forest-100"
              )}
            >
              {p.popular && (
                <Badge variant="accent" className="absolute -top-2.5 right-3">
                  Most popular
                </Badge>
              )}
              <h3 className="text-base font-bold leading-snug">{p.name}</h3>
              <p className="mt-3 text-3xl font-extrabold text-forest-800">
                {formatGBP(p.pricePence)}
                {p.id === "membership" && (
                  <span className="text-sm font-medium text-charcoal/50">
                    /mo
                  </span>
                )}
              </p>
              {p.perClassHint && (
                <p className="text-xs text-charcoal/50">{p.perClassHint}</p>
              )}
              <p className="mt-3 flex-1 text-sm text-charcoal/70">
                {p.description}
              </p>
              <Button
                asChild
                variant={p.popular ? "accent" : "outline"}
                size="sm"
                className="mt-4 w-full"
              >
                <Link href={`/venues?product=${p.id}`}>Choose</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
