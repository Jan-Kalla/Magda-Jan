import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google"; // Zakładam, że używasz tych lub podobnych fontów
import "./globals.css";
import { GuestProvider } from "./context/GuestContext";
import { SoundProvider } from "./context/SoundContext";

// Konfiguracja czcionek (jeśli masz inne, zostaw swoje)
const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
});

const lato = Lato({ 
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-lato",
});

// --- TUTAJ JEST MAGIA OPEN GRAPH ---
export const metadata: Metadata = {
  // 1. Podstawowy adres strony (wymagane, żeby obrazki działały poprawnie)
  // Zmień to na swój prawdziwy adres po wrzuceniu na Vercel!
  metadataBase: new URL("https://magda-jan.vercel.app"), 

  // 2. Tytuł widoczny w zakładce przeglądarki
  title: "Magda & Jan | Pobieramy się!",
  
  // 3. Opis pod linkiem w Google
  description: "19 lipca 2026. Dołącz do nas w tym wyjątkowym dniu! Zależy nam na twojej obecności!",

  // 4. Konfiguracja dla Facebooka / Messengera / WhatsAppa
  openGraph: {
    title: "Magda & Jan | Pobieramy się! 💍",
    description: "To będzie piękny dzień! Zależy nam na twojej obecności!.",
    url: "https://magda-jan.vercel.app",
    siteName: "Ślub Magdy i Jana",
    locale: "pl_PL",
    type: "website",
    images: [
      {
        url: "/fotki/raczki.jpg", // Tu podajemy ścieżkę do zdjęcia
        width: 1200,
        height: 630,
        alt: "Magda i Jan - Zaproszenie",
      },
    ],
  },

  // 5. Konfiguracja dla Twittera / X (opcjonalnie)
  twitter: {
    card: "summary_large_image",
    title: "Magda & Jan | Wielki Dzień",
    description: "Zapraszamy na nasz ślub. Kliknij i zobacz szczegóły.",
    images: ["/fotki/raczki.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={`${playfair.variable} ${lato.variable} font-sans antialiased`}>
        <GuestProvider>
          <SoundProvider>
            {children}
          </SoundProvider>
        </GuestProvider>
      </body>
    </html>
  );
}