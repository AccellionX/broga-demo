import { BRAND } from "@/lib/mock-data";

export function DemoBanner() {
  return (
    <div className="sticky top-0 z-[60] bg-forest-900 px-3 py-1.5 text-center text-[11px] font-medium tracking-wide text-forest-100 sm:text-xs">
      {BRAND.demoBanner}
    </div>
  );
}
