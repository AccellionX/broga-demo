"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import type { ProductType, Role } from "@/lib/mock-data";

export interface SessionBooking {
  id: string;
  courseId: string;
  venueId: string;
  productType: ProductType;
  amountPence: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  injuries?: string;
  createdAt: string;
}

interface DemoContextValue {
  role: Role;
  setRole: (role: Role) => void;
  bookings: SessionBooking[];
  addBooking: (booking: Omit<SessionBooking, "id" | "createdAt">) => SessionBooking;
  postcode: string;
  setPostcode: (pc: string) => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("customer");
  const [bookings, setBookings] = useState<SessionBooking[]>([]);
  const [postcode, setPostcode] = useState("");

  const value = useMemo<DemoContextValue>(
    () => ({
      role,
      setRole,
      bookings,
      addBooking: (booking) => {
        const full: SessionBooking = {
          ...booking,
          id: `sess-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        setBookings((prev) => [full, ...prev]);
        return full;
      },
      postcode,
      setPostcode,
    }),
    [role, bookings, postcode]
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
}
