"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { track } from "@/lib/track";
import { useDemoStore } from "@/store/useDemoStore";

const categoryForPath = (path: string) => {
  if (path.startsWith("/shop")) return "shop";
  if (path.startsWith("/my-telstra")) return "account";
  if (path.startsWith("/mobile-phones")) return "mobile";
  if (path.startsWith("/internet")) return "internet";
  if (path.startsWith("/support")) return "support";
  return "general";
};

export function PageViewTracker() {
  const pathname = usePathname();
  const loggedIn = useDemoStore((s) => s.user.isLoggedIn);

  useEffect(() => {
    track("Page Viewed", {
      page_name: pathname,
      page_category: categoryForPath(pathname),
      referrer: typeof document !== "undefined" ? document.referrer : "",
      logged_in: loggedIn,
    });
  }, [pathname, loggedIn]);

  return null;
}
