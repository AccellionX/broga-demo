import Link from "next/link";
import { BRAND } from "@/lib/mock-data";

export function SiteFooter() {
  return (
    <footer className="border-t border-forest-100 bg-forest-900 text-forest-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="text-2xl font-extrabold text-white">{BRAND.name}</p>
          <p className="mt-2 text-sm text-forest-200">{BRAND.tagline}</p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-forest-300">
            Explore
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/venues" className="hover:text-white">
                Find a class
              </Link>
            </li>
            <li>
              <Link href="/#pricing" className="hover:text-white">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/account" className="hover:text-white">
                My account
              </Link>
            </li>
            <li>
              <Link href="/demo" className="hover:text-white">
                Demo overview
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-forest-300">
            Coverage
          </p>
          <p className="mt-3 text-sm text-forest-200">
            23 venues across Surrey, Hampshire &amp; south-east London.
            Growing to 200-300.
          </p>
        </div>
      </div>
      <div className="border-t border-forest-800 px-4 py-4 text-center text-xs text-forest-400">
        Concept demo · sample data · built by AccellionX
      </div>
    </footer>
  );
}
