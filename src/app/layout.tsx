import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JANVISTA AI — Jan-AI National Vision & Infrastructure Strategic Targeting Assistant",
  description: "AI-native Digital Public Infrastructure decision-intelligence platform transforming citizen voice into explainable infrastructure priorities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#f8fafc] text-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
