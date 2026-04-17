"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { track } from "@/lib/track";

const SUGGESTIONS = [
  "iPhone",
  "nbn plans",
  "data usage",
  "change plan",
  "pay bill",
];

export function SearchOverlay({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [q, setQ] = useState("");
  const router = useRouter();

  function submit() {
    const term = q.trim() || "telstra";
    track("Search Submitted", { search_term: term, results_count: 5 });
    onOpenChange(false);
    router.push(`/search?q=${encodeURIComponent(term)}`);
    setQ("");
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-20 z-[61] w-[min(560px,94vw)] -translate-x-1/2 rounded-lg bg-white p-4 shadow-xl">
          <Dialog.Title className="sr-only">Search Telstra</Dialog.Title>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded border border-gray-300 px-3 py-2 text-telstra-dark outline-none focus:border-telstra-blue"
              placeholder="Search..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              autoFocus
            />
            <button
              type="button"
              className="rounded bg-telstra-blue px-4 py-2 text-white"
              onClick={submit}
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-3 text-xs text-gray-500">Suggestions</p>
          <ul className="mt-1 space-y-1">
            {SUGGESTIONS.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  className="w-full rounded px-2 py-1.5 text-left text-sm hover:bg-telstra-grey"
                  onClick={() => {
                    setQ(s);
                    track("Search Submitted", {
                      search_term: s,
                      results_count: 5,
                    });
                    onOpenChange(false);
                    router.push(`/search?q=${encodeURIComponent(s)}`);
                  }}
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
