"use client";

import { useRouter } from "next/navigation";
import { User, GraduationCap, LayoutDashboard } from "lucide-react";
import { useDemo } from "@/lib/demo-context";
import type { Role } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ROLES: { id: Role; label: string; icon: typeof User; href: string }[] = [
  { id: "customer", label: "Customer", icon: User, href: "/" },
  { id: "teacher", label: "Teacher", icon: GraduationCap, href: "/teacher" },
  { id: "owner", label: "Owner", icon: LayoutDashboard, href: "/admin" },
];

export function RoleSwitcher() {
  const { role, setRole } = useDemo();
  const router = useRouter();

  function switchRole(next: Role, href: string) {
    setRole(next);
    toast.message(`Viewing as ${next}`, {
      description: "Nav and screens update for this role.",
    });
    router.push(href);
  }

  return (
    <div className="fixed bottom-4 right-4 z-[70] flex items-center gap-0.5 rounded-full border border-forest-200 bg-white/95 p-1 shadow-lg backdrop-blur-sm">
      {ROLES.map(({ id, label, icon: Icon, href }) => (
        <button
          key={id}
          type="button"
          onClick={() => switchRole(id, href)}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-colors",
            role === id
              ? "bg-forest-700 text-white"
              : "text-charcoal/70 hover:bg-forest-50 hover:text-forest-800"
          )}
          aria-pressed={role === id}
        >
          <Icon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
