import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import ChatWidget from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: "First Lutheran Church of Miami",
  description:
    "First Lutheran Church of Miami — worship, education, music, and community at 1770 Brickell Avenue, Miami.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {children}
        <ChatWidget />
        <Toaster />
      </body>
    </html>
  );
}
