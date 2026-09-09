import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "AYURLEX — AI-Powered IP & Regulatory Intelligence",
  description: "Know whether your Ayurvedic product can be patented, protected, and sold. Verified legal and regulatory intelligence (SIH26045).",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased selection:bg-emerald-500/20 selection:text-emerald-900">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
