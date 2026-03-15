import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import { GuestProvider } from "./context/GuestContext";
import { SoundProvider } from "./context/SoundContext";

// Konfiguracja czcionek
const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
});

const lato = Lato({ 
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-lato",
});

// --- MAGIA OPEN GRAPH ---
export const metadata: Metadata = {
  // 1. Podstawowy adres strony
  metadataBase: new URL("https://magda-jan.vercel.app"), 

  // 2. Tytuł widoczny w zakładce przeglądarki
  title: "Magdalena & Jan | Pobieramy się!",
  
  // 3. Opis pod linkiem w Google
  description: "19 lipca 2026. Dołącz do nas w tym wyjątkowym dniu! Zależy nam na Twojej obecności!",

  // 4. Konfiguracja dla Facebooka / Messengera / WhatsAppa
  openGraph: {
    title: "Magdalena & Jan | Pobieramy się! 💍",
    description: "To będzie piękny dzień! Zależy nam na Twojej obecności. Kliknij, aby zobaczyć szczegóły i potwierdzić przybycie.",
    url: "https://magda-jan.vercel.app",
    siteName: "Ślub Magdaleny i Jana",
    locale: "pl_PL",
    type: "website",
    images: [
      {
        // ZMIANA: Pełny, absolutny adres URL do pięknego zdjęcia z górami
        url: "https://magda-jan.vercel.app/fotki/do___linku.jpg", 
        width: 1200,
        height: 630,
        alt: "Magdalena i Jan w górach - Zaproszenie na ślub",
      },
    ],
  },

  // 5. Konfiguracja dla Twittera / X / iMessage (opcjonalnie, ale bardzo przydatne)
  twitter: {
    card: "summary_large_image",
    title: "Magdalena & Jan | Wielki Dzień",
    description: "Zapraszamy na nasz ślub. Kliknij i zobacz szczegóły.",
    // ZMIANA: Tutaj również absolutny URL do zdjęcia
    images: ["https://magda-jan.vercel.app/fotki/do___linku.jpg"],
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