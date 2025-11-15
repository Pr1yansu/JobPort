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

const siteName = "JobPort";
const siteDescription = "Discover jobs, manage applications, and hire faster with JobPort.";
const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: "%s | JobPort",
  },
  description: siteDescription,
  keywords: [
    "jobs",
    "hiring",
    "recruiting",
    "careers",
    "JobPort",
    "job board",
    "apply jobs",
  ],
  authors: [{ name: "JobPort" }],
  creator: "JobPort",
  publisher: "JobPort",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title: siteName,
    description: siteDescription,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    creator: "@jobport",
  },
  alternates: {
    canonical: siteUrl,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0f" },
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body className={`${poppins.className} antialiased`}>
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
