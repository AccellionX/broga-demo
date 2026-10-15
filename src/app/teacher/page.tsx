import Link from "next/link";
import { Button } from "@/components/ui/button";

/** Placeholder until Phase 2 */
export default function TeacherPlaceholder() {
  return (
    <div className="mx-auto max-w-sm px-4 py-20 text-center">
      <h1 className="text-2xl font-extrabold">Teacher app</h1>
      <p className="mt-2 text-charcoal/60">
        Mobile register ships in Phase 2. Switch roles anytime with the pill
        bottom-right.
      </p>
      <Button asChild className="mt-6" variant="outline">
        <Link href="/">Back to customer home</Link>
      </Button>
    </div>
  );
}
