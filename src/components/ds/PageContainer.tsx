"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

/** Pages built on the new design system lay out their own gutters; older pages keep the previous padded container. */
const REDESIGNED = [/^\/$/, /^\/image\//];

export function PageContainer({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";
  const redesigned = REDESIGNED.some((r) => r.test(pathname));
  return (
    <main className="avr-page">
      {redesigned ? (
        children
      ) : (
        <div className="container mx-auto p-4">{children}</div>
      )}
    </main>
  );
}
