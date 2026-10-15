"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BRAND } from "@/lib/mock-data";
import { useDemo } from "@/lib/demo-context";

export function Hero() {
  const [pc, setPc] = useState("");
  const { setPostcode } = useDemo();
  const router = useRouter();

  function findClass(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = pc.trim().toUpperCase();
    setPostcode(trimmed);
    router.push(trimmed ? `/venues?postcode=${encodeURIComponent(trimmed)}` : "/venues");
  }

  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #1B4332 0%, transparent 45%), radial-gradient(circle at 80% 60%, #C2410C 0%, transparent 40%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-forest-600">
          {BRAND.name}
        </p>
        <h1 className="mt-3 max-w-2xl text-4xl font-extrabold leading-[1.1] tracking-tight text-charcoal sm:text-5xl lg:text-6xl">
          {BRAND.tagline}
        </h1>
        <p className="mt-5 max-w-xl text-lg text-charcoal/70 sm:text-xl">
          Beginner-friendly classes in village halls near you. No Lycra, no
          judgment. Just a solid stretch after work.
        </p>

        <form
          onSubmit={findClass}
          className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-forest-500" />
            <Input
              value={pc}
              onChange={(e) => setPc(e.target.value)}
              placeholder="Enter postcode (e.g. GU7)"
              className="pl-10"
              aria-label="Postcode"
            />
          </div>
          <Button type="submit" size="lg" className="shrink-0">
            Find a class near you
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <div className="mt-4">
          <Button
            variant="accent"
            size="lg"
            onClick={() => router.push("/venues?trial=1")}
          >
            Book a 5-week beginner course
          </Button>
        </div>

        <p className="mt-6 text-sm text-charcoal/50">
          23 venues · Surrey, Hampshire &amp; SE London · Growing to 200-300
        </p>
      </div>
    </section>
  );
}
