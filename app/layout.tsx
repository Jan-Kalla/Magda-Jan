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
  metadataBase: new URL("https://magda-jan.vercel.app"), 
  title: "Magdalena & Jan | Pobieramy się!",
  description: "19 lipca 2026. Dołącz do nas w tym wyjątkowym dniu! Zależy nam na Twojej obecności!",

  openGraph: {
    title: "Magdalena & Jan | Pobieramy się! 👰‍♀️🤵‍♂️",
    description: "To będzie piękny dzień! Zależy nam na Twojej obecności. Kliknij, aby zobaczyć szczegóły.",
    url: "https://magda-jan.vercel.app",
    siteName: "Ślub Magdaleny i Jana",
    locale: "pl_PL",
    type: "website",
    // USUNIĘTO RĘCZNE 'images' - Next.js sam je doda z pliku opengraph-image.jpg
  },

  twitter: {
    card: "summary_large_image",
    title: "Magdalena & Jan | Wielki Dzień",
    description: "Zapraszamy na nasz ślub. Kliknij i zobacz szczegóły.",
    // USUNIĘTO RĘCZNE 'images'
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