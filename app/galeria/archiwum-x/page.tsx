"use client";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import PageWrapper from "@/app/components/PageWrapper";
import RequireGuest from "@/app/components/RequireGuest";
import CustomCursor from "@/app/components/CustomCursor";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronLeftIcon, PlayCircleIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useGuest } from "@/app/context/GuestContext";
import { useRouter } from "next/navigation";
import { ACCESS_WEIGHTS, AccessLevel } from "@/app/galeria/data";

import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Rozszerzyliśmy typ o parsedFolder i actualUrl, które generujemy w locie
type MediaItem = { 
  id: string; 
  type: 'image' | 'video_link' | 'youtube_link'; 
  url: string; 
  parsedFolder?: string; 
  actualUrl?: string;
  caption?: string; 
};

export default function ArchiwumXPage() {
  const { guest, loading: guestLoading } = useGuest();
  const router = useRouter();

  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // 1. Ochrona dostępu (Archiwum X jako sekcja VIP/Extended)
  useEffect(() => {
    if (guestLoading) return;
    if (!guest) { router.replace("/"); return; }
    
    const allowedCodes = ["FC3818", "8DD06D"];
    const userWeight = ACCESS_WEIGHTS[(guest.access_level || 'basic') as AccessLevel] || 1;
    
    if (userWeight < ACCESS_WEIGHTS['extended'] && !allowedCodes.includes(guest.code)) {
        router.replace("/galeria");
    }
  }, [guest, guestLoading, router]);

  // 2. Pobieranie danych i rozdzielanie URL na folder i link
  useEffect(() => {
    const fetchMedia = async () => {
      const { data, error } = await supabase
        .from("gallery_media")
        .select("*")
        .eq("album_id", "cringe")
        .order("created_at", { ascending: false });

      if (data) {
        const processedMedia = data.map(item => {
            let folder = "Inne";
            let actualLink = item.url;

            // Sprawdzamy, czy to link zew. zapisany z folderem (np. "2026/https://youtu.be/...")
            if (item.url.includes('/http')) {
                const firstSlash = item.url.indexOf('/');
                folder = item.url.substring(0, firstSlash);
                actualLink = item.url.substring(firstSlash + 1);
            } 
            // Standardowy plik z bucketu (np. "2026/plik.jpg")
            else if (item.url.includes('/') && !item.url.startsWith('http')) {
                folder = item.url.split('/')[0];
            }

            return { 
                ...item, 
                parsedFolder: folder, 
                actualUrl: actualLink 
            };
        });
        
        setMedia(processedMedia as MediaItem[]);
      }
      setLoading(false);
    };

    if (guest) fetchMedia();
  }, [guest]);

  const getImageUrl = (pathOrUrl: string) => {
    if (pathOrUrl.startsWith("http")) return pathOrUrl;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/${pathOrUrl}`;
  };

  const imageItems = media.filter(m => m.type === 'image');
  const slides = imageItems.map(m => ({ src: getImageUrl(m.actualUrl || m.url) }));

  const folders = Array.from(new Set(media.map(m => m.parsedFolder || "Inne")))
    .sort((a, b) => {
      if (a === "Inne") return 1;
      if (b === "Inne") return -1;
      return b.localeCompare(a); 
    });

  if (guestLoading || !guest) return null;

  return (
    <RequireGuest>
      <div className="flex flex-col min-h-screen relative bg-[#FDF9EC]">
        <CustomCursor />
        <Navbar />

        <main className="flex-grow pt-24 md:pt-32 pb-32 overflow-hidden text-[#4c4a1e]">
          <PageWrapper className="max-w-[1400px] w-[95%] mx-auto px-4 md:px-8">
            
            <div className="mb-8">
                <Link href="/galeria" className="inline-flex items-center gap-2 text-[#4E0113]/70 hover:text-[#4E0113] transition-colors font-serif italic text-lg">
                    <ChevronLeftIcon className="w-5 h-5" /> Wróć do Galerii
                </Link>
            </div>

            <header className="text-center mb-16 md:mb-24">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-serif font-light text-4xl sm:text-5xl md:text-6xl text-[#4E0113] mb-6 uppercase tracking-widest"
              >
                Archiwum X
              </motion.h1>
              <p className="font-sans font-light text-[#4c4a1e]/80 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
                Miejsce na materiały specjalne, archiwalne nagrania i chwile, które wymagają 
                osobnego potraktowania. Chronologiczny zapis naszej wspólnej drogi.
              </p>
            </header>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-[3px] border-[#4c4a1e]/20 border-t-[#4E0113] rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="flex flex-col gap-20">
                {folders.map(folderName => {
                  const folderMedia = media.filter(m => (m.parsedFolder || "Inne") === folderName);
                  const folderImages = folderMedia.filter(m => m.type === 'image');
                  const folderVideos = folderMedia.filter(m => m.type !== 'image');

                  return (
                    <motion.section 
                      key={folderName}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      <div className="flex items-center gap-6 mb-10">
                        <h2 className="font-serif text-3xl md:text-4xl text-[#4E0113] tracking-wider">
                          {folderName}
                        </h2>
                        <div className="h-[1px] flex-grow bg-[#4c4a1e]/15"></div>
                      </div>

                      {folderVideos.length > 0 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                          {folderVideos.map(vid => {
                            const urlToUse = vid.actualUrl || vid.url;

                            if (vid.type === 'youtube_link') {
                              const ytId = urlToUse.includes('youtu.be/') 
                                ? urlToUse.split('youtu.be/')[1].split('?')[0] 
                                : urlToUse.split('v=')[1]?.split('&')[0];
                              
                              return (
                                <div key={vid.id} className="bg-white p-4 rounded-3xl shadow-sm border border-[#4c4a1e]/10">
                                  <div className="aspect-video rounded-2xl overflow-hidden bg-black shadow-inner">
                                    <iframe 
                                      className="w-full h-full"
                                      src={`https://www.youtube.com/embed/${ytId}`} 
                                      allowFullScreen
                                    ></iframe>
                                  </div>
                                  {vid.caption && <p className="font-serif text-xl text-[#4E0113] mt-4 px-2">{vid.caption}</p>}
                                </div>
                              );
                            }
                            return (
                              <a key={vid.id} href={urlToUse} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-white p-6 rounded-3xl border border-[#4c4a1e]/10 hover:border-[#4E0113]/30 transition-all group">
                                <PlayCircleIcon className="w-12 h-12 text-[#4E0113]/40 group-hover:text-[#4E0113] transition-colors shrink-0" />
                                <span className="font-serif text-lg text-[#4E0113]">{vid.caption || "Odtwórz nagranie"}</span>
                              </a>
                            );
                          })}
                        </div>
                      )}

                      {folderImages.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                          {folderImages.map(img => {
                            const idx = imageItems.findIndex(i => i.id === img.id);
                            return (
                              <div 
                                key={img.id}
                                onClick={() => { setLightboxIndex(idx); setLightboxOpen(true); }}
                                className="relative aspect-square cursor-pointer rounded-2xl overflow-hidden group shadow-sm"
                              >
                                <img src={getImageUrl(img.actualUrl || img.url)} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" alt="Archiwum" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </motion.section>
                  );
                })}
              </div>
            )}
          </PageWrapper>
        </main>

        <Footer />
        
        <Lightbox 
          open={lightboxOpen} 
          close={() => setLightboxOpen(false)} 
          index={lightboxIndex} 
          slides={slides} 
          plugins={[Zoom]} 
        />
      </div>
    </RequireGuest>
  );
}