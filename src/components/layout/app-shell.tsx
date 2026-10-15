"use client";

import { usePathname } from "next/navigation";
import { DemoBanner } from "@/components/layout/demo-banner";
import { RoleSwitcher } from "@/components/layout/role-switcher";
import { CustomerNav } from "@/components/layout/customer-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { useDemo } from "@/lib/demo-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { role } = useDemo();

  const isTeacher = pathname.startsWith("/teacher") || role === "teacher";
  const isAdmin = pathname.startsWith("/admin") || role === "owner";
  const isDemo = pathname === "/demo";
  const isBooking = pathname.startsWith("/book");

  // Teacher & admin get their own chrome in later phases; keep banner + switcher
  const showCustomerChrome =
    !isDemo &&
    !pathname.startsWith("/teacher") &&
    !pathname.startsWith("/admin");

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <DemoBanner />
      {showCustomerChrome && <CustomerNav />}
      <main className="flex-1">{children}</main>
      {showCustomerChrome && !isBooking && <SiteFooter />}
      <RoleSwitcher />
      {/* silence unused until phase 2/3 */}
      {(isTeacher || isAdmin) && null}
    </div>
  );
}
