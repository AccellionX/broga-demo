import Link from "next/link";
import { Button } from "@/components/ui/button";

/** Placeholder until Phase 4; keeps nav alive */
export default function AccountPlaceholder() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="text-2xl font-extrabold">My account</h1>
      <p className="mt-2 text-charcoal/60">
        Customer journey timeline lands in Phase 4. Booking success already
        saves to session state.
      </p>
      <Button asChild className="mt-6" variant="outline">
        <Link href="/venues">Find a class</Link>
      </Button>
    </div>
  );
}
