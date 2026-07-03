"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

// Pages where the footer should NOT be displayed
const NO_FOOTER_ROUTES = ["/chatbot"];

export function ConditionalFooter() {
  const pathname = usePathname();
  const hideFooter = NO_FOOTER_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));
  if (hideFooter) return null;
  return <Footer />;
}
