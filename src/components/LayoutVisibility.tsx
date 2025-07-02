"use client";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface LayoutVisibilityProps {
  children: ReactNode;
  hideOn?: string[];
  showOnlyOn?: string[];
}

export default function LayoutVisibility({ children, hideOn = [], showOnlyOn = [] }: LayoutVisibilityProps) {
  const pathname = usePathname() || "";
  if (hideOn.length > 0 && hideOn.some((pattern) => pathname.startsWith(pattern))) {
    return null;
  }
  if (showOnlyOn.length > 0 && !showOnlyOn.some((pattern) => pathname.startsWith(pattern))) {
    return null;
  }
  return <>{children}</>;
}