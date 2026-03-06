"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, PlayCircleIcon } from "@heroicons/react/24/outline"; // Outline
import Image from "next/image";
import { Album } from "../data";

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
      .order("created_at", { ascending: false }); 

    if (data) {
      setMedia(data as MediaItem[]);
    }
    setLoading(false);
  };

  const getImageUrl = (pathOrUrl: string) => {
    if (pathOrUrl.startsWith("http")) return pathOrUrl;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/${pathOrUrl}`;
  };

  const images = media.filter(m => m.type === 'image');
  const videos = media.filter(m => m.type === 'video_link');

  const slides = images.map(img => ({ src: getImageUrl(img.url) }));

  return (
    <AnimatePresence>
      {album && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 md:p-8 backdrop-blur-xl overflow-hidden"
          onClick={onClose}
        >
          {/* KONTENER MODALA */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-[#FDF9EC] w-full max-w-6xl h-[90vh] md:h-[85vh] rounded-3xl flex flex-col overflow-hidden relative shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER MODALA */}
            <div className="bg-[#FDF9EC] text-[#4c4a1e] p-6 md:p-8 flex items-center justify-between border-b border-[#4c4a1e]/10 z-10 shrink-0">
                <div className="flex items-center gap-5">
                    <div className="bg-[#4c4a1e]/5 text-[#4c4a1e] p-3 rounded-2xl border border-[#4c4a1e]/10">
                        {album.icon}
                    </div>
                    <div>
                        <h2 className="font-serif text-2xl md:text-3xl font-light tracking-wide">{album.title}</h2>
                        <p className="font-sans font-light uppercase tracking-widest text-[10px] md:text-xs opacity-60 mt-2">
                            {images.length} fotografii • {videos.length} nagrań
                        </p>
                    </div>
                </div>
                <button 
                    onClick={onClose}
                    className="p-3 text-[#4c4a1e]/60 hover:text-[#4c4a1e] hover:bg-[#4c4a1e]/5 rounded-full transition-all duration-300"
                >
                    <XMarkIcon className="w-8 h-8" />
                </button>
            </div>

            {/* TREŚĆ (SCROLLOWANA) */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#FDF9EC]/50">
                
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        {/* Elegancki loader */}
                        <div className="w-12 h-12 border-[3px] border-[#4c4a1e]/20 border-t-[#4c4a1e] rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                         {/* SEKCJA WIDEO */}
                         {videos.length > 0 && (
                            <div className="mb-12">
                                <h3 className="font-sans font-light uppercase tracking-widest text-[#4c4a1e]/80 text-sm mb-6 flex items-center gap-3">
                                    <PlayCircleIcon className="w-5 h-5" /> Materiały Wideo
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    {videos.map((vid) => (
                                        <a 
                                            key={vid.id}
                                            href={vid.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-5 bg-white p-5 rounded-2xl shadow-sm border border-[#4c4a1e]/10 hover:shadow-md hover:border-[#4c4a1e]/30 transition-all duration-300 group"
                                        >
                                            <div className="w-14 h-14 bg-[#4c4a1e]/5 rounded-full flex items-center justify-center text-[#4c4a1e] group-hover:scale-110 transition-transform duration-500">
                                                <PlayCircleIcon className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <p className="font-serif text-lg text-[#4c4a1e] tracking-wide">
                                                    {vid.caption || "Odtwórz nagranie"}
                                                </p>
                                                <p className="font-sans font-light text-[10px] uppercase tracking-widest text-[#4c4a1e]/50 mt-1">
                                                  Dysk Google
                                                </p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                         )}

                         {/* SEKCJA ZDJĘĆ */}
                         {images.length > 0 ? (
                             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {images.map((img, idx) => (
                                    <div 
                                        key={img.id}
                                        className="relative aspect-square cursor-pointer rounded-2xl overflow-hidden shadow-sm border border-[#4c4a1e]/5 group bg-black/5"
                                        onClick={() => {
                                            setLightboxIndex(idx);
                                            setLightboxOpen(true);
                                        }}
                                    >
                                        <Image
                                            src={getImageUrl(img.url)}
                                            alt={img.caption || "Fotografia"}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                            sizes="(max-width: 768px) 50vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                                    </div>
                                ))}
                             </div>
                         ) : (
                             videos.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-[#4c4a1e]/50 py-20">
                                    <p className="font-serif text-2xl md:text-3xl tracking-widest uppercase mb-4 opacity-70">
                                      Brak zawartości
                                    </p>
                                    <p className="font-sans font-light text-sm uppercase tracking-widest text-center max-w-xs">
                                      Wktrótce zdjęcia z pewnością zaczną się tutaj pojawiać.
                                    </p>
                                </div>
                             )
                         )}
                    </>
                )}
            </div>

            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                index={lightboxIndex}
                slides={slides}
            />

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}