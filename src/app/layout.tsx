import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { SiteShell } from "@/components/layout/SiteShell";
import { AmplitudeProvider } from "@/components/providers/AmplitudeProvider";
import { PageViewTracker } from "@/components/providers/PageViewTracker";

export const metadata: Metadata = {
  title: "Telstra — Demo",
  description: "Amplitude-instrumented Telstra demo journeys",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <AmplitudeProvider>
          <PageViewTracker />
          <SiteShell>{children}</SiteShell>
          <Toaster position="top-right" richColors />
        </AmplitudeProvider>
      </body>
    </html>
  );
}
