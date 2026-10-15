import { Suspense } from "react";
import { VenueFinder } from "@/components/venues/venue-finder";

export const metadata = {
  title: "Find a class · Bro-ga",
};

export default function VenuesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-charcoal/50">
          Loading venues…
        </div>
      }
    >
      <VenueFinder />
    </Suspense>
  );
}
