"use client";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import PageWrapper from "@/app/components/PageWrapper";
import RequireGuest from "@/app/components/RequireGuest";
import CustomCursor from "@/app/components/CustomCursor";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeftIcon, FolderIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useGuest } from "@/app/context/GuestContext";
import { useRouter } from "next/navigation";
import { ACCESS_WEIGHTS, AccessLevel } from "@/app/galeria/data";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type MediaItem = {
  id: string;
  type: 'image' | 'video_link';
  url: string;
  caption?: string;
};

// 1. ZMIANA: Tworzymy "słownik" z ładnymi nazwami.
// Po lewej stronie: dokładna nazwa folderu z bazy (bez polskich znaków)
// Po prawej stronie: piękna nazwa, która wyświetli się na stronie
const FOLDER_NAMES_DICTIONARY: Record<string, string> = {
  "wlochy_2022": "Włochy 2022",
  "paryz_2022": "Paryż 2022",
  "gory_2024": "Tatry i Zakopane 2024",
  "swieta": "Święta Bożego Narodzenia",
  "wesele_pszczyna": "Wesele w Pszczynie",
  "czestochowa": "Częstochowa",
  "licealne_imprezy": "Licealne imprezy",
  // Możesz tu dodawać kolejne foldery w nieskończoność!
};

// 2. ZMIANA: Zmodyfikowana funkcja formatująca
const formatFolderName = (name: string) => {
  // Jeśli folder ma swoje tłumaczenie w słowniku, użyj go:
  if (FOLDER_NAMES_DICTIONARY[name]) {
    return FOLDER_NAMES_DICTIONARY[name];
  }
  
  // Jeśli zapomnisz dodać folderu do słownika, kod i tak wyświetli go 
  // dość ładnie (zamieni podkreślniki na spacje i powiększy litery):
  return name
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function MomentyPage() {
  const { guest, loading: guestLoading } = useGuest();
  const router = useRouter();

  const [groupedMedia, setGroupedMedia] = useState<Record<string, MediaItem[]>>({});
  const [loading, setLoading] = useState(true);
  
  // Stan przechowujący aktualnie otwarty podkatalog. Null = widok wszystkich katalogów
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  // Stany dla pełnoekranowej galerii
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // === STRAŻNIK DOSTĘPU (EXTENDED / VIP) ===
  useEffect(() => {
    if (guestLoading) return;
    
    if (!guest) {
      router.replace("/");
      return;
    }

    const userLevel = (guest.access_level || 'basic') as AccessLevel;
    const userWeight = ACCESS_WEIGHTS[userLevel] || 1;
    const requiredWeight = ACCESS_WEIGHTS['extended']; // Minimum extended

    if (userWeight < requiredWeight) {
      router.replace("/galeria");
    }
  }, [guest, guestLoading, router]);

  useEffect(() => {
    const fetchMedia = async () => {
      const { data, error } = await supabase
        .from("gallery_media")
        .select("*")
        .eq("album_id", "moments") // Pobieramy tylko zdjęcia dla tego albumu
        .order("created_at", { ascending: false }); 

      if (data) {
        // MAGICZNE GRUPOWANIE: Dzieli ścieżkę "folder/zdjecie.jpg" i tworzy kategorie
        const groups: Record<string, MediaItem[]> = {};
        
        data.forEach((item) => {
          const parts = item.url.split('/');
          let folder = "Różne"; // Domyślny folder, jeśli zdjęcie nie jest w żadnym katalogu
          
          if (parts.length > 1) {
            folder = parts[0]; // Bierzemy główny katalog z urla
          }
          
          if (!groups[folder]) groups[folder] = [];
          groups[folder].push(item as MediaItem);
        });

        setGroupedMedia(groups);
      }
      setLoading(false);
    };

    if (guest && ACCESS_WEIGHTS[(guest.access_level as AccessLevel) || 'basic'] >= ACCESS_WEIGHTS['extended']) {
        fetchMedia();
    }
  }, [guest]);

  const getImageUrl = (pathOrUrl: string) => {
    if (pathOrUrl.startsWith("http") || pathOrUrl.startsWith("/")) return pathOrUrl;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/${pathOrUrl}`;
  };

  // Blokada renderowania dla nieuprawnionych, by nie mignęło im okno
  const userWeight = guest ? ACCESS_WEIGHTS[(guest.access_level as AccessLevel) || 'basic'] : 0;
  if (!guestLoading && userWeight < ACCESS_WEIGHTS['extended']) return null;

  // Przygotowanie danych do Lightboxa dla aktualnie wybranego folderu
  const currentMedia = selectedFolder ? groupedMedia[selectedFolder] || [] : [];
  const slides = currentMedia.map(m => ({ src: getImageUrl(m.url) }));

  const openLightbox = (item: MediaItem) => {
    const index = currentMedia.findIndex(m => m.id === item.id);
    if (index !== -1) {
        setLightboxIndex(index);
        setLightboxOpen(true);
    }
  };

  return (
    <RequireGuest>
      <div className="flex flex-col min-h-screen relative bg-[#FDF9EC]">
        <CustomCursor />
        <Navbar />

        <main className="flex-grow pt-24 md:pt-32 pb-32 overflow-hidden text-[#4c4a1e]">
          <PageWrapper className="max-w-7xl mx-auto w-full px-4 md:px-8">
            
            {/* PRZYCISK WSTECZ */}
            <div className="mb-8 h-8">
                <AnimatePresence mode="wait">
                    {selectedFolder ? (
                        <motion.button 
                            key="back-to-folders"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            onClick={() => setSelectedFolder(null)}
                            className="inline-flex items-center gap-2 text-[#4E0113]/70 hover:text-[#4E0113] transition-colors font-serif italic text-lg"
                        >
                            <ChevronLeftIcon className="w-5 h-5" /> Wróć do katalogów
                        </motion.button>
                    ) : (
                        <motion.div
                            key="back-to-gallery"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                        >
                            <Link 
                                href="/galeria" 
                                className="inline-flex items-center gap-2 text-[#4E0113]/70 hover:text-[#4E0113] transition-colors font-serif italic text-lg"
                            >
                                <ChevronLeftIcon className="w-5 h-5" /> Wróć do Galerii
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* NAGŁÓWEK */}
            <header className="text-center mb-16 md:mb-24">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                key={selectedFolder || "main"}
                className="font-serif font-light text-4xl sm:text-5xl md:text-6xl text-[#4E0113] mb-4 uppercase tracking-widest"
              >
                {selectedFolder ? formatFolderName(selectedFolder) : "Najlepsze Momenty"}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-sans font-light text-[#4c4a1e]/80 text-base md:text-lg max-w-2xl mx-auto"
              >
                {selectedFolder 
                    ? "Wspomnienia z tego wyjątkowego czasu." 
                    : "Rozszerzona biblioteka naszych podróży, imprez i chwil wartych zapamiętania."}
              </motion.p>
            </header>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-[3px] border-[#4c4a1e]/20 border-t-[#4E0113] rounded-full animate-spin"></div>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                
                {/* WIDOK 1: SIATKA KATALOGÓW */}
                {!selectedFolder && (
                    <motion.div 
                        key="folders-view"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                    >
                        {Object.entries(groupedMedia).map(([folderName, items]) => {
                            // Okładka to pierwsze zdjęcie w katalogu
                            const coverImage = items.find(i => i.type === 'image')?.url || items[0]?.url;

                            return (
                                <div 
                                    key={folderName}
                                    onClick={() => setSelectedFolder(folderName)}
                                    className="group cursor-pointer"
                                >
                                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md mb-4 bg-black/5 border border-[#4c4a1e]/10">
                                        {coverImage && (
                                            <Image 
                                                src={getImageUrl(coverImage)} 
                                                alt={folderName} 
                                                fill 
                                                className="object-cover group-hover:scale-105 transition-transform duration-700" 
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                                        
                                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
                                            <div className="bg-white/90 backdrop-blur-sm p-2 rounded-xl text-[#4E0113] shadow-sm">
                                                <FolderIcon className="w-6 h-6" />
                                            </div>
                                            <span className="bg-black/50 backdrop-blur-md text-white text-xs font-mono font-bold px-3 py-1.5 rounded-full">
                                                {items.length} {items.length === 1 ? 'plik' : items.length < 5 ? 'pliki' : 'plików'}
                                            </span>
                                        </div>
                                    </div>
                                    <h3 className="font-serif text-2xl text-[#4E0113] tracking-wide group-hover:text-[#C97B78] transition-colors px-1">
                                        {formatFolderName(folderName)}
                                    </h3>
                                </div>
                            );
                        })}
                    </motion.div>
                )}

                {/* WIDOK 2: ZDJĘCIA W KONKRETNYM KATALOGU (MASONRY) */}
                {selectedFolder && (
                    <motion.div
                        key="photos-view"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="columns-1 sm:columns-2 lg:columns-3 gap-6 md:gap-8"
                    >
                        {currentMedia.map((item) => (
                            <div 
                                key={item.id}
                                onClick={() => openLightbox(item)}
                                className="break-inside-avoid mb-6 md:mb-8 bg-white p-3 rounded-sm shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#4c4a1e]/5 cursor-pointer group"
                            >
                                <div className="relative w-full rounded-sm overflow-hidden bg-gray-100">
                                    <Image 
                                        src={getImageUrl(item.url)} 
                                        alt={item.caption || "Wspomnienie"} 
                                        width={800} 
                                        height={800} 
                                        className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.02]" 
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" 
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                                </div>
                                {item.caption && (
                                    <div className="mt-3 text-center px-2 pb-2">
                                        <p className="font-serif italic text-[#4c4a1e]/80 text-sm">
                                            {item.caption}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </motion.div>
                )}

              </AnimatePresence>
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