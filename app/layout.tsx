import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GuestProvider } from "@/app/context/GuestContext"; // 🟢 Import kontekstu gościa
import { SoundProvider } from "@/app/context/SoundContext";

// --- Fonty ---
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// --- Metadane ---
export const metadata: Metadata = {
  title: "Nasze Wesele 💍",
  description: "Witamy na naszej stronie ślubnej 💐",
};

// --- Layout główny ---
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#FAD6C8] text-[#4E0113]`}
      >
        {/* 🟣 Owijamy całą aplikację w kontekst gościa */}
        <GuestProvider>
            <SoundProvider>
              {children}
            </SoundProvider>
          </GuestProvider>
      </body>
    </html>
  );
}
