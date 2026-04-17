"use client";

import Link from "next/link";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import * as Tabs from "@radix-ui/react-tabs";
import { track } from "@/lib/track";

export function SupportCategoryClient({ category }: { category: string }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/support" className="text-sm text-telstra-blue">
        ← Support hub
      </Link>
      <h1 className="mt-4 text-2xl font-bold capitalize">
        {category.replace(/-/g, " ")}
      </h1>

      <Tabs.Root defaultValue="t1" className="mt-8">
        <Tabs.List className="flex gap-2 border-b">
          <Tabs.Trigger
            value="t1"
            className="px-3 py-2 data-[state=active]:border-b-2 data-[state=active]:border-telstra-blue"
          >
            Common tasks
          </Tabs.Trigger>
          <Tabs.Trigger
            value="t2"
            className="px-3 py-2 data-[state=active]:border-b-2 data-[state=active]:border-telstra-blue"
          >
            FAQ
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="t1" className="mt-4 space-y-2 text-sm">
          <p>Quick actions: Pay a bill, Update details, Track order</p>
        </Tabs.Content>
        <Tabs.Content value="t2" className="mt-4">
          <Accordion.Root type="multiple">
            {["How do I pay my bill?", "How do I change my plan?"].map((q) => (
              <Accordion.Item key={q} value={q} className="border-b">
                <Accordion.Header>
                  <Accordion.Trigger
                    className="flex w-full items-center justify-between py-3 text-left"
                    onClick={() =>
                      track("FAQ Expanded", {
                        question: q,
                        category,
                      })
                    }
                  >
                    {q}
                    <ChevronDown className="h-4 w-4" />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="pb-3 text-sm text-gray-600">
                  Demo answer — for real support visit telstra.com.au
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </Tabs.Content>
      </Tabs.Root>

      <div className="mt-10 flex gap-4 text-sm">
        <button
          type="button"
          className="text-telstra-blue"
          onClick={() =>
            track("Contact Method Selected", { method: "chat" })
          }
        >
          Chat with us
        </button>
        <button
          type="button"
          onClick={() =>
            track("Contact Method Selected", { method: "call" })
          }
        >
          Call
        </button>
      </div>
    </div>
  );
}
