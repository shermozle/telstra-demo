"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Menu,
  Search,
  ShoppingCart,
  Globe,
  MapPin,
  HelpCircle,
  User,
} from "lucide-react";
import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useDemoStore } from "@/store/useDemoStore";
import { cn } from "@/lib/utils";
import { track } from "@/lib/track";
import { TELSTRA_BRAND } from "@/lib/telstra-assets";

type MegaSection = {
  label: string;
  href: string;
  items: { label: string; href: string; description?: string }[];
};

const NAV_SECTIONS: MegaSection[] = [
  {
    label: "Mobile",
    href: "/mobile-phones",
    items: [
      {
        label: "Mobiles on a plan",
        href: "/mobile-phones/mobiles-on-a-plan",
        description: "Latest phones on Telstra's mobile network",
      },
      {
        label: "SIM only plans",
        href: "/mobile-phones/sim-only-plans",
        description: "Bring your own device — flexible plans",
      },
      {
        label: "Pre-Paid",
        href: "/mobile-phones/prepaid",
        description: "Top up as you go, no lock-in",
      },
      {
        label: "Outright phones",
        href: "/mobile-phones/mobiles-on-a-plan",
        description: "Buy outright and pair with any plan",
      },
    ],
  },
  {
    label: "Internet",
    href: "/internet",
    items: [
      {
        label: "nbn plans",
        href: "/internet/plans",
        description: "Home internet on the nbn network",
      },
      {
        label: "5G Home Internet",
        href: "/internet/5g-home-internet",
        description: "Wireless home internet, no nbn required",
      },
      {
        label: "Internet hub",
        href: "/internet",
        description: "Compare speeds, devices and add-ons",
      },
    ],
  },
  {
    label: "Accessories",
    href: "/accessories",
    items: [
      { label: "Shop accessories", href: "/accessories" },
      { label: "Deals", href: "/deals" },
    ],
  },
  {
    label: "Telstra Plus",
    href: "/deals",
    items: [
      {
        label: "Telstra Plus rewards",
        href: "/deals",
        description: "Redeem points on devices and offers",
      },
      {
        label: "Trade-in",
        href: "/trade-in",
        description: "Trade your old phone for credit",
      },
    ],
  },
];

const PERSONAS = [
  { label: "Personal", href: "/", active: true },
  { label: "Business", href: "/", active: false },
  { label: "Enterprise", href: "/", active: false },
] as const;

export function SiteHeader({
  onOpenSearch,
}: {
  onOpenSearch: () => void;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState<string | null>(null);
  const user = useDemoStore((s) => s.user);
  const cart = useDemoStore((s) => s.cart);
  const logout = useDemoStore((s) => s.logout);

  const cartCount = cart.items.length;

  const sectionActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white text-telstra-dark shadow-sm">
      <div className="border-b border-gray-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5 text-xs">
          <div className="hidden items-center gap-4 text-gray-600 md:flex">
            <Link href="/support" className="flex items-center gap-1 hover:text-telstra-blue">
              <HelpCircle className="h-3.5 w-3.5" /> Support
            </Link>
            <Link href="/support" className="flex items-center gap-1 hover:text-telstra-blue">
              <MapPin className="h-3.5 w-3.5" /> Find a store
            </Link>
            <span className="flex items-center gap-1 text-gray-500">
              <Globe className="h-3.5 w-3.5" /> EN
            </span>
          </div>
          <div
            role="tablist"
            aria-label="Audience"
            className="ml-auto flex items-center gap-1 rounded-full bg-telstra-grey p-0.5"
          >
            {PERSONAS.map((p) => (
              <Link
                key={p.label}
                role="tab"
                aria-selected={p.active}
                href={p.href}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold transition",
                  p.active
                    ? "bg-telstra-dark text-white"
                    : "text-gray-600 hover:text-telstra-dark"
                )}
              >
                {p.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <button
          type="button"
          className="-ml-2 rounded p-2 text-telstra-dark md:hidden"
          aria-label="Open menu"
          onClick={() => setMobileOpen((o) => !o)}
        >
          <Menu className="h-6 w-6" />
        </button>

        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="Telstra home"
          onClick={() =>
            track("Navigation Clicked", {
              nav_section: "header",
              nav_item: "logo",
              nav_level: "brand",
            })
          }
        >
          <Image
            src={TELSTRA_BRAND.tLogoSvg}
            alt=""
            width={32}
            height={36}
            className="h-9 w-auto"
            priority
          />
          <span className="sr-only">Telstra</span>
        </Link>

        <nav
          className="ml-4 hidden items-center gap-1 md:flex"
          onMouseLeave={() => setMegaOpen(null)}
        >
          {NAV_SECTIONS.map((section) => {
            const active = sectionActive(section.href);
            const open = megaOpen === section.label;
            return (
              <div
                key={section.label}
                className="relative"
                onMouseEnter={() => setMegaOpen(section.label)}
              >
                <Link
                  href={section.href}
                  className={cn(
                    "relative flex items-center gap-1 px-3 py-5 text-sm font-semibold transition-colors",
                    active || open
                      ? "text-telstra-blue"
                      : "text-telstra-dark hover:text-telstra-blue"
                  )}
                  onClick={() => {
                    setMegaOpen(null);
                    track("Navigation Clicked", {
                      nav_section: section.label.toLowerCase(),
                      nav_item: section.label,
                      nav_level: "primary",
                    });
                  }}
                >
                  {section.label}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      open && "rotate-180"
                    )}
                  />
                  <span
                    className={cn(
                      "pointer-events-none absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-telstra-blue transition-opacity",
                      active || open ? "opacity-100" : "opacity-0"
                    )}
                  />
                </Link>

                {open && (
                  <div
                    className="absolute left-0 top-full z-50 min-w-[320px] overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-xl"
                  >
                    {section.items.map((item) => (
                      <Link
                        key={item.href + item.label}
                        href={item.href}
                        className="block px-4 py-2.5 text-sm text-telstra-dark hover:bg-telstra-grey"
                        onClick={() => {
                          setMegaOpen(null);
                          track("Navigation Clicked", {
                            nav_section: section.label.toLowerCase(),
                            nav_item: item.label,
                            nav_level: "secondary",
                          });
                        }}
                      >
                        <div className="font-semibold">{item.label}</div>
                        {item.description && (
                          <div className="mt-0.5 text-xs text-gray-500">
                            {item.description}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <Link
            href="/support"
            className={cn(
              "relative flex items-center px-3 py-5 text-sm font-semibold",
              sectionActive("/support")
                ? "text-telstra-blue"
                : "text-telstra-dark hover:text-telstra-blue"
            )}
            onClick={() =>
              track("Navigation Clicked", {
                nav_section: "support",
                nav_item: "Support",
                nav_level: "primary",
              })
            }
          >
            Support
            <span
              className={cn(
                "pointer-events-none absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-telstra-blue transition-opacity",
                sectionActive("/support") ? "opacity-100" : "opacity-0"
              )}
            />
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-telstra-dark hover:bg-telstra-grey"
            aria-label="Search"
            onClick={() => {
              onOpenSearch();
              track("Navigation Clicked", {
                nav_section: "header",
                nav_item: "search",
                nav_level: "utility",
              });
            }}
          >
            <Search className="h-5 w-5" />
          </button>
          <Link
            href="/shop/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-telstra-dark hover:bg-telstra-grey"
            aria-label="Cart"
            onClick={() =>
              track("Navigation Clicked", {
                nav_section: "header",
                nav_item: "cart",
                nav_level: "utility",
              })
            }
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-telstra-red px-1 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {!user.isLoggedIn ? (
            <Link
              href="/login"
              className="ml-1 flex items-center gap-1.5 rounded-full bg-telstra-blue px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <User className="h-4 w-4" /> Sign in
            </Link>
          ) : (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="ml-1 flex items-center gap-1.5 rounded-full bg-telstra-blue px-4 py-2 text-sm font-semibold text-white outline-none hover:bg-blue-700">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{user.firstName}</span>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="z-50 min-w-[220px] rounded-xl border border-gray-200 bg-white p-1 text-telstra-dark shadow-lg"
                  sideOffset={8}
                  align="end"
                >
                  <div className="px-3 py-2 text-xs text-gray-500">
                    Signed in as{" "}
                    <span className="font-semibold text-telstra-dark">
                      {user.firstName}
                    </span>
                  </div>
                  <DropdownMenu.Item asChild>
                    <Link
                      className="block cursor-pointer rounded px-3 py-2 text-sm outline-none hover:bg-telstra-grey"
                      href="/my-telstra"
                    >
                      My Telstra
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link
                      className="block cursor-pointer rounded px-3 py-2 text-sm outline-none hover:bg-telstra-grey"
                      href="/my-telstra/services"
                    >
                      Services
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="my-1 h-px bg-gray-100" />
                  <DropdownMenu.Item
                    className="cursor-pointer rounded px-3 py-2 text-sm outline-none hover:bg-telstra-grey"
                    onSelect={() => logout()}
                  >
                    Sign out
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          )}
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-3 md:hidden">
          <button
            type="button"
            className="mb-3 flex w-full items-center gap-2 rounded-full border border-gray-200 px-3 py-2 text-sm text-gray-600"
            onClick={() => {
              onOpenSearch();
              setMobileOpen(false);
            }}
          >
            <Search className="h-4 w-4" /> Search telstra.com.au
          </button>
          <div className="mb-3 flex gap-1 rounded-full bg-telstra-grey p-0.5">
            {PERSONAS.map((p) => (
              <Link
                key={p.label}
                href={p.href}
                className={cn(
                  "flex-1 rounded-full py-1 text-center text-xs font-semibold",
                  p.active
                    ? "bg-telstra-dark text-white"
                    : "text-gray-600"
                )}
                onClick={() => setMobileOpen(false)}
              >
                {p.label}
              </Link>
            ))}
          </div>
          <div className="divide-y divide-gray-100">
            {NAV_SECTIONS.map((section) => (
              <Link
                key={section.label}
                href={section.href}
                className="block py-3 text-sm font-semibold text-telstra-dark"
                onClick={() => setMobileOpen(false)}
              >
                {section.label}
              </Link>
            ))}
            <Link
              href="/support"
              className="block py-3 text-sm font-semibold text-telstra-dark"
              onClick={() => setMobileOpen(false)}
            >
              Support
            </Link>
          </div>
          {!user.isLoggedIn && (
            <Link
              href="/login"
              className="mt-3 flex items-center justify-center gap-1.5 rounded-full bg-telstra-blue px-3 py-2.5 text-sm font-semibold text-white"
              onClick={() => setMobileOpen(false)}
            >
              <User className="h-4 w-4" /> Sign in
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
