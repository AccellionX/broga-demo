"use client";

import { usePathname } from "next/navigation";
import { DemoBanner } from "@/components/layout/demo-banner";
import { RoleSwitcher } from "@/components/layout/role-switcher";
import { CustomerNav } from "@/components/layout/customer-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { AdminNav } from "@/components/admin/admin-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isDemo = pathname === "/demo";
  const isBooking = pathname.startsWith("/book");
  const isAdmin = pathname.startsWith("/admin");
  const isTeacher = pathname.startsWith("/teacher");

  const showCustomerChrome = !isDemo && !isTeacher && !isAdmin;

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <DemoBanner />
      {showCustomerChrome && <CustomerNav />}
      {isAdmin && <AdminNav />}
      <main className="flex-1">{children}</main>
      {showCustomerChrome && !isBooking && <SiteFooter />}
      <RoleSwitcher />
    </div>
  );
}
