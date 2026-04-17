"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { TelstraPlusBanner } from "./TelstraPlusBanner";
import { SearchOverlay } from "./SearchOverlay";
import { DemoControls } from "./DemoControls";

const BANNER_PATHS = ["/", "/shop", "/mobile-phones", "/accessories", "/deals"];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  const showBanner = BANNER_PATHS.some(
    (p) => pathname === p || (p !== "/" && pathname.startsWith(p))
  );

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader onOpenSearch={() => setSearchOpen(true)} />
      {showBanner && <TelstraPlusBanner />}
      <main className="flex-1 bg-telstra-grey/30">{children}</main>
      <SiteFooter />
      <SearchOverlay open={searchOpen} onOpenChange={setSearchOpen} />
      <DemoControls />
    </div>
  );
}
