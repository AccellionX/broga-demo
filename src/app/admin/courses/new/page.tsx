import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BulkCoursesPlaceholder() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="text-2xl font-extrabold">Bulk course creator</h1>
      <p className="mt-2 text-charcoal/60">
        Multi-venue course creation lands in Phase 3.
      </p>
      <Button asChild className="mt-6" variant="outline">
        <Link href="/admin">Back to overview</Link>
      </Button>
    </div>
  );
}
