"use client";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import PageWrapper from "@/app/components/PageWrapper";
import RequireGuest from "@/app/components/RequireGuest";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { HeartIcon } from "@heroicons/react/24/solid";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useGuest } from "@/app/context/GuestContext";
import { useRouter } from "next/navigation";
import CustomCursor from "@/app/components/CustomCursor";

// Importy dla pełnoekranowej galerii (Lightbox)
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type HistoryEvent = {
  id: number;
  person: 'magda' | 'jan' | 'shared';
  year: string;
  title: string;
  description: string;
  img_url: string;
};

export default function HistoriaPage() {
  const { guest, loading: guestLoading } = useGuest();
  const router = useRouter();

  const [beforeWeMet, setBeforeWeMet] = useState<HistoryEvent[]>([]);
  const [sharedHistory, setSharedHistory] = useState<HistoryEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Stany dla pełnoekranowej galerii
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // ZMIANA: Stan przechowujący aktualną ilość kolumn dla widoku Masonry
  const [columnsCount, setColumnsCount] = useState(3);

  // === STRAŻNIK DOSTĘPU (TYLKO VIP / ADMIN) ===
  useEffect(() => {
    if (!guestLoading && guest && guest.code !== "FC3818") {
      router.replace("/galeria");
    }
  }, [guest, guestLoading, router]);

  // ZMIANA: Nasłuchiwanie na szerokość ekranu
  useEffect(() => {
    const updateCols = () => {
      if (window.innerWidth >= 1024) setColumnsCount(3);
      else if (window.innerWidth >= 640) setColumnsCount(2);
      else setColumnsCount(1);
    };
    updateCols();
    window.addEventListener("resize", updateCols);
    return () => window.removeEventListener("resize", updateCols);
  }, []);

  useEffect(() => {
    if (!guest || guest.code !== "FC3818") return;

    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from("history_events")
        .select("*")
        .order("year", { ascending: true }); 

      if (data) {
        // Zamiast rozdzielać Magdę i Jana, łączymy ich i sortujemy chronologicznie
        const combinedEarly = data
            .filter(item => item.person === 'magda' || item.person === 'jan')
            .sort((a, b) => parseInt(a.year) - parseInt(b.year));
        
        setBeforeWeMet(combinedEarly);
        setSharedHistory(data.filter(item => item.person === 'shared'));
      }
      setLoading(false);
    };

    fetchHistory();
  }, [guest]);

  const getImageUrl = (pathOrUrl: string) => {
    if (pathOrUrl.startsWith("http") || pathOrUrl.startsWith("/")) return pathOrUrl;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/${pathOrUrl}`;
  };

  if (!guestLoading && guest && guest.code !== "FC3818") return null; 

  // Przygotowanie zdjęć do Lightboxa (wszystkie zdjęcia z obu sekcji po kolei)
  const allMedia = [...beforeWeMet, ...sharedHistory];
  const slides = allMedia.map(m => ({ src: getImageUrl(m.img_url) }));

  const openLightbox = (item: HistoryEvent) => {
    const index = allMedia.findIndex(m => m.id === item.id);
    if (index !== -1) {
        setLightboxIndex(index);
        setLightboxOpen(true);
    }
  };

  // ZMIANA: Funkcja rozdzielająca zdjęcia z lewej do prawej
  const distributeToColumns = (items: HistoryEvent[]) => {
    const cols: HistoryEvent[][] = Array.from({ length: columnsCount }, () => []);
    items.forEach((item, index) => {
      cols[index % columnsCount].push(item);
    });
    return cols;
  };

  // Komponent pojedynczego zdjęcia ("Odbitki")
  const GalleryCard = ({ item }: { item: HistoryEvent }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -5 }}
      // break-inside-avoid to kluczowa klasa zapobiegająca przecinaniu kart w CSS Columns (Masonry)
      className="break-inside-avoid mb-6 md:mb-8 bg-white p-3 md:p-4 pb-6 md:pb-8 rounded-sm shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#4c4a1e]/5 cursor-pointer group"
      onClick={() => openLightbox(item)}
    >
      <div className="relative w-full rounded-sm overflow-hidden bg-gray-100">
        {/* ZMIANA: Zwykły tag img, który zawsze respektuje 100% naturalne proporcje pliku! */}
        <img 
            src={getImageUrl(item.img_url)} 
            alt={item.title} 
            loading="lazy"
            className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.02]" 
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
      </div>
      
      <div className="mt-4 md:mt-5 text-center px-2">
        <div className="flex items-center justify-center gap-2 mb-1">
            <span className="font-serif italic font-bold text-[#C97B78] text-lg">{item.year}</span>
            {item.person === 'magda' && <span className="text-[10px] uppercase tracking-widest bg-[#C97B78]/10 text-[#C97B78] px-2 py-0.5 rounded-full">Magda</span>}
            {item.person === 'jan' && <span className="text-[10px] uppercase tracking-widest bg-[#4c4a1e]/10 text-[#4c4a1e] px-2 py-0.5 rounded-full">Johny</span>}
        </div>
        <h3 className="font-serif font-light uppercase tracking-widest text-[#4E0113] text-xl md:text-2xl mb-2">
          {item.title}
        </h3>
        <p className="font-sans text-sm text-[#4c4a1e]/70 leading-relaxed">
          {item.description}
        </p>
      </div>
    </motion.div>
  );

  return (
    <RequireGuest>
      <div className="flex flex-col min-h-screen relative bg-[#FDF9EC]">
        <CustomCursor />
        <Navbar />

        <main className="flex-grow pt-24 md:pt-32 pb-32 overflow-hidden text-[#4c4a1e]">
          <PageWrapper className="max-w-7xl mx-auto w-full px-4 md:px-8">
            
            <div className="mb-8">
              <Link 
                href="/galeria" 
                className="inline-flex items-center gap-2 text-[#4E0113]/70 hover:text-[#4E0113] transition-colors font-serif italic text-lg"
              >
                <ChevronLeftIcon className="w-5 h-5" /> Wróć do Galerii
              </Link>
            </div>

            <header className="text-center mb-20 md:mb-28">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-serif font-light text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#4E0113] mb-4 uppercase tracking-widest"
              >
                Nasza Historia
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-sans font-light text-[#4c4a1e]/80 text-lg max-w-2xl mx-auto"
              >
                Wirtualna wystawa naszych wspomnień. Zobaczcie, jak to wszystko się zaczęło, zanim nasze drogi połączyły się w jedną.
              </motion.p>
            </header>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-[3px] border-[#4c4a1e]/20 border-t-[#4c4a1e] rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {/* ========================================================= */}
                {/* SEKCJA 1: ZANIM SIĘ SPOTKALIŚMY (UKŁAD MASONRY) */}
                {/* ========================================================= */}
                {beforeWeMet.length > 0 && (
                    <div className="mb-32">
                        <div className="text-center mb-16">
                            <h2 className="font-script text-5xl md:text-6xl text-[#4c4a1e] mb-4 drop-shadow-sm">Zanim się spotkaliśmy...</h2>
                            <div className="h-[1px] w-24 bg-[#4c4a1e]/30 mx-auto"></div>
                        </div>
                        {/* ZMIANA: Układ wierszowy od lewej do prawej */}
                        <div className="flex gap-6 md:gap-8 items-start w-full">
                            {distributeToColumns(beforeWeMet).map((column, colIndex) => (
                                <div key={colIndex} className="flex flex-col flex-1 gap-0">
                                    {column.map((item) => (
                                        <GalleryCard key={item.id} item={item} />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ========================================================= */}
                {/* ŁĄCZNIK / SERCE */}
                {/* ========================================================= */}
                {beforeWeMet.length > 0 && sharedHistory.length > 0 && (
                    <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        className="flex justify-center relative z-20 mb-32"
                    >
                        <div className="bg-[#FDF9EC] p-4 rounded-full">
                            <div className="w-20 h-20 bg-gradient-to-br from-[#C97B78] to-[#4E0113] rounded-full flex items-center justify-center shadow-xl border-4 border-[#FDF9EC]">
                                <HeartIcon className="w-10 h-10 text-[#FDF9EC] animate-pulse" />
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ========================================================= */}
                {/* SEKCJA 2: NASZA WSPÓLNA DROGA (UKŁAD MASONRY) */}
                {/* ========================================================= */}
                {sharedHistory.length > 0 && (
                    <div>
                        <div className="text-center mb-16">
                            <h2 className="font-script text-5xl md:text-6xl text-[#C97B78] mb-4 drop-shadow-sm">Nasza Wspólna Droga</h2>
                            <div className="h-[1px] w-24 bg-[#C97B78]/30 mx-auto"></div>
                        </div>
                        {/* ZMIANA: Układ wierszowy od lewej do prawej */}
                        <div className="flex gap-6 md:gap-8 items-start w-full">
                            {distributeToColumns(sharedHistory).map((column, colIndex) => (
                                <div key={colIndex} className="flex flex-col flex-1 gap-0">
                                    {column.map((item) => (
                                        <GalleryCard key={item.id} item={item} />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
              </>
            )}

          </PageWrapper>
        </main>

        <Footer />
        
        {/* PEŁNOEKRANOWA GALERIA */}
        <Lightbox
            open={lightboxOpen}
            close={() => setLightboxOpen(false)}
            index={lightboxIndex}
            slides={slides}
            carousel={{ finite: false }}
        />
      </div>
    </RequireGuest>
  );
}