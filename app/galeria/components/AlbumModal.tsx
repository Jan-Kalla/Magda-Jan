"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, PlayCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { Album } from "../data";

// Import Lightboxa
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

type Props = {
  album: Album | null;
  userAccessLevel: string;
  onClose: () => void;
};

export default function AlbumModal({ album, userAccessLevel, onClose }: Props) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Stan dla Lightboxa (galerii pełnoekranowej)
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (album) {
      fetchMedia();
    }
  }, [album]);

  const fetchMedia = async () => {
    if (!album) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("gallery_media")
      .select("*")
      .eq("album_id", album.id)
      .order("created_at", { ascending: false }); // Najnowsze na górze

    if (data) {
      setMedia(data as MediaItem[]);
    }
    setLoading(false);
  };

  // Helper: Pobranie pełnego URL zdjęcia z Supabase Storage
  // Jeśli w bazie trzymasz pełny link (https://...), to użyj go.
  // Jeśli trzymasz tylko nazwę pliku, użyj tej funkcji:
  const getImageUrl = (pathOrUrl: string) => {
    if (pathOrUrl.startsWith("http")) return pathOrUrl;
    // Zastąp 'gallery' nazwą swojego bucketa, jeśli jest inna
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/${pathOrUrl}`;
  };

  // Filtrowanie: osobno zdjęcia (do lightboxa), osobno filmy
  const images = media.filter(m => m.type === 'image');
  const videos = media.filter(m => m.type === 'video_link');

  // Przygotowanie slajdów dla Lightboxa
  const slides = images.map(img => ({ src: getImageUrl(img.url) }));

  return (
    <AnimatePresence>
      {album && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md overflow-hidden"
          onClick={onClose}
        >
          {/* Kontener Modala (Pełny ekran z marginesami) */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-[#fff0e6] w-full max-w-5xl h-[90vh] rounded-2xl flex flex-col overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modala */}
            <div className="bg-[#4E0113] text-[#FAD6C8] p-4 flex items-center justify-between shadow-md z-10">
                <div className="flex items-center gap-3">
                    <div className="bg-[#FAD6C8] text-[#4E0113] p-2 rounded-full">
                        {album.icon}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold leading-none">{album.title}</h2>
                        <p className="text-xs opacity-70 mt-1">
                            {images.length} zdjęć • {videos.length} filmów
                        </p>
                    </div>
                </div>
                <button 
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-full transition"
                >
                    <XMarkIcon className="w-8 h-8" />
                </button>
            </div>

            {/* Treść (Scrollowana) */}
            <div className="flex-1 overflow-y-auto p-6">
                
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#4E0113]"></div>
                    </div>
                ) : (
                    <>
                         {/* Sekcja Filmów (jeśli są) */}
                         {videos.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-[#4E0113] font-bold text-lg mb-4 flex items-center gap-2">
                                    <PlayCircleIcon className="w-6 h-6" /> Wideo (Google Drive)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {videos.map((vid) => (
                                        <a 
                                            key={vid.id}
                                            href={vid.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-[#4E0113]/10 hover:shadow-md hover:border-[#4E0113]/30 transition group"
                                        >
                                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                                                <PlayCircleIcon className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#4E0113]">
                                                    {vid.caption || "Otwórz wideo"}
                                                </p>
                                                <p className="text-xs text-gray-500">Kliknij, aby obejrzeć na Dysku Google</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                         )}

                         {/* Sekcja Zdjęć (Grid) */}
                         {images.length > 0 ? (
                             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {images.map((img, idx) => (
                                    <div 
                                        key={img.id}
                                        className="relative aspect-square cursor-pointer rounded-xl overflow-hidden shadow-sm group"
                                        onClick={() => {
                                            setLightboxIndex(idx);
                                            setLightboxOpen(true);
                                        }}
                                    >
                                        <Image
                                            src={getImageUrl(img.url)}
                                            alt={img.caption || "Zdjęcie"}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            sizes="(max-width: 768px) 50vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                    </div>
                                ))}
                             </div>
                         ) : (
                             videos.length === 0 && (
                                <div className="text-center py-20 text-gray-500">
                                    <p className="text-xl mb-2">Pusto... na razie! 📸</p>
                                    <p className="text-sm">Wróć tutaj po weselu, a na pewno coś tu znajdziesz.</p>
                                </div>
                             )
                         )}
                    </>
                )}
            </div>

            {/* LIGHTBOX (Galeria pełnoekranowa) */}
            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                index={lightboxIndex}
                slides={slides}
                // Opcjonalnie włączamy wtyczki (Thumbnails, Zoom) - wymaga instalacji dodatkowych paczek
                // plugins={[Thumbnails, Zoom]} 
            />

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}