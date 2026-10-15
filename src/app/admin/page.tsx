import Link from "next/link";
import { Button } from "@/components/ui/button";

/** Placeholder until Phase 3 */
export default function AdminPlaceholder() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="text-2xl font-extrabold">Owner dashboard</h1>
      <p className="mt-2 text-charcoal/60">
        KPIs, venues, teachers and bulk course creator land in Phase 3.
      </p>
      <Button asChild className="mt-6" variant="outline">
        <Link href="/">Back to customer home</Link>
      </Button>
    </div>
  );
}
