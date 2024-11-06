import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/query-provider";
import { Toaster } from "sonner";
import InboxModal from "./_components/_modals/inbox-modal";
import { SessionProvider } from "next-auth/react";
import ConvexProviderClient from "@/providers/convex-provider";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JobPort",
  description: "JobPort is a job finding platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} $ antialiased`}>
        <ConvexProviderClient>
          <SessionProvider>
            <QueryProvider>
              <>
                {children}
                <Toaster />
                <InboxModal />
              </>
            </QueryProvider>
          </SessionProvider>
        </ConvexProviderClient>
      </body>
    </html>
  );
}
