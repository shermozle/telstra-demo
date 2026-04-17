"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useDemoStore } from "@/store/useDemoStore";
import { track } from "@/lib/track";

export default function ProfilePage() {
  const user = useDemoStore((s) => s.user);
  const profileDraft = useDemoStore((s) => s.profileDraft);
  const setProfileDraft = useDemoStore((s) => s.setProfileDraft);
  const [editing, setEditing] = useState<string | null>(null);

  if (!user.isLoggedIn) {
    return (
      <div className="p-16 text-center">
        <Link href="/login" className="text-telstra-blue underline">
          Sign in
        </Link>
      </div>
    );
  }

  function saveField(field: string) {
    track("Profile Updated", {
      field_changed: field as "email" | "phone" | "address",
    });
    toast.success("Saved");
    setEditing(null);
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 md:flex-row">
      <nav className="md:w-56">
        <ul className="space-y-2 text-sm">
          <li className="font-semibold text-telstra-dark">Account settings</li>
          <li>Personal details</li>
          <li>Marketing preferences</li>
          <li className="pt-4 font-semibold">Security</li>
          <li>Sign-in details</li>
        </ul>
      </nav>
      <div className="flex-1 rounded-xl border bg-white p-6">
        <h1 className="text-xl font-bold">Personal details</h1>
        <dl className="mt-6 space-y-4">
          <div>
            <dt className="text-sm text-gray-600">Email</dt>
            <dd className="flex items-center justify-between">
              {editing === "email" ? (
                <input
                  className="rounded border px-2 py-1"
                  value={profileDraft.email}
                  onChange={(e) => setProfileDraft({ email: e.target.value })}
                />
              ) : (
                <span>{profileDraft.email}</span>
              )}
              <button
                type="button"
                className="text-telstra-blue"
                onClick={() =>
                  editing === "email" ? saveField("email") : setEditing("email")
                }
              >
                {editing === "email" ? "Save" : "Update →"}
              </button>
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-600">Mobile</dt>
            <dd className="flex items-center justify-between">
              {editing === "mobile" ? (
                <input
                  className="rounded border px-2 py-1"
                  value={profileDraft.mobile}
                  onChange={(e) => setProfileDraft({ mobile: e.target.value })}
                />
              ) : (
                <span>{profileDraft.mobile}</span>
              )}
              <button
                type="button"
                className="text-telstra-blue"
                onClick={() =>
                  editing === "mobile"
                    ? saveField("phone")
                    : setEditing("mobile")
                }
              >
                {editing === "mobile" ? "Save" : "Update →"}
              </button>
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-600">Residential address</dt>
            <dd className="flex items-center justify-between">
              {editing === "address" ? (
                <input
                  className="w-full rounded border px-2 py-1"
                  value={profileDraft.addressLine}
                  onChange={(e) =>
                    setProfileDraft({ addressLine: e.target.value })
                  }
                />
              ) : (
                <span>{profileDraft.addressLine}</span>
              )}
              <button
                type="button"
                className="ml-2 shrink-0 text-telstra-blue"
                onClick={() =>
                  editing === "address"
                    ? saveField("address")
                    : setEditing("address")
                }
              >
                {editing === "address" ? "Save" : "Update →"}
              </button>
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-600">Customer ID</dt>
            <dd>{user.customerId}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
