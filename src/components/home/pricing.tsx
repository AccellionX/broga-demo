"use client";

import Link from "next/link";
import { PRODUCTS, isMonthlyProduct } from "@/lib/mock-data";
import { formatGBP, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Pricing() {
  const trial = PRODUCTS.find((p) => p.id === "trial")!;
  const rest = PRODUCTS.filter((p) => p.id !== "trial");

  return (
    <section id="pricing" className="border-y border-forest-100 bg-white/60 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-charcoal sm:text-4xl">
          Pricing
        </h2>
        <p className="mt-2 text-charcoal/70">
          Real Bro-ga plans in GBP. New? Start with the 5-week trial.
        </p>

        {/* Featured trial */}
        <div className="relative mt-10 overflow-hidden rounded-2xl border-2 border-accent bg-white p-6 shadow-sm sm:p-8">
          <Badge variant="accent" className="mb-3">
            {trial.badge ?? "Start here"}
          </Badge>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <h3 className="text-2xl font-extrabold text-charcoal sm:text-3xl">
                {trial.name}
              </h3>
              <p className="mt-2 text-charcoal/70">{trial.description}</p>
              {trial.perClassHint && (
                <p className="mt-1 text-sm text-charcoal/50">{trial.perClassHint}</p>
              )}
            </div>
            <div className="shrink-0 text-left sm:text-right">
              <p className="text-4xl font-extrabold text-forest-800">
                {formatGBP(trial.pricePence)}
              </p>
              <Button asChild variant="accent" size="lg" className="mt-3 w-full sm:w-auto">
                <Link href="/venues?trial=1">
                  {trial.ctaLabel ?? "Book trial"}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rest.map((p) => (
            <div
              key={p.id}
              className={cn(
                "relative flex flex-col rounded-xl border border-forest-100 bg-white p-5 shadow-sm"
              )}
            >
              <h3 className="text-base font-bold leading-snug">{p.name}</h3>
              <p className="mt-3 text-3xl font-extrabold text-forest-800">
                {formatGBP(p.pricePence)}
                {isMonthlyProduct(p.id) && (
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
              <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                <Link href={`/venues?product=${p.id}`}>Choose</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
