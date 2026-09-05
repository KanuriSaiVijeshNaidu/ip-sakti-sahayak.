import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AYURLEX - AI Legal & Regulatory Assistant for AYUSH & IP",
  description: "AI assistant for Intellectual Property & AYUSH regulatory guidance",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
