"use client";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import PageWrapper from "@/app/components/PageWrapper";
import RequireGuest from "@/app/components/RequireGuest";
import CustomCursor from "@/app/components/CustomCursor";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronLeftIcon, PlayCircleIcon } from "@heroicons/react/24/solid";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { useGuest } from "@/app/context/GuestContext";
import { useRouter } from "next/navigation";
import { ACCESS_WEIGHTS, AccessLevel } from "@/app/galeria/data";

import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Video from "yet-another-react-lightbox/plugins/video";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type MediaItem = { 
  id: string; 
  type: 'image' | 'video_link' | 'youtube_link'; 
  url: string; 
  parsedFolder?: string; 
  actualUrl?: string;
  driveId?: string; 
  caption?: string; 
};

// =========================================================================
// KAFELKI MASONRY
// =========================================================================
const MediaVideoTile = ({ item, onClick, delay }: { item: MediaItem, onClick: () => void, delay: number }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const urlToUse = item.actualUrl || item.url;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "200px" }}
            transition={{ duration: 0.5, delay: delay * 0.05 }} 
            onClick={onClick}
            className="break-inside-avoid relative rounded-xl md:rounded-2xl overflow-hidden group cursor-pointer shadow-sm border border-[#4c4a1e]/10 bg-black/5"
        >
            {!hasError ? (
                <video 
                    ref={videoRef}
                    src={`${urlToUse}#t=0.001`} 
                    preload="metadata" 
                    playsInline
                    muted
                    onLoadedData={() => setIsLoaded(true)}
                    onError={() => setHasError(true)} 
                    className={`w-full h-auto object-cover group-hover:scale-[1.03] transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    style={{ minHeight: '100px' }} 
                />
            ) : (
                item.driveId && (
                    <img 
                        src={`https://drive.google.com/thumbnail?id=${item.driveId}&sz=w800`}
                        onLoad={() => setIsLoaded(true)}
                        className={`w-full h-auto object-cover group-hover:scale-[1.03] transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                        alt={item.caption || "Wideo"}
                    />
                )
            )}
            
            {!isLoaded && (
                 <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                     <div className="w-8 h-8 border-[2px] border-[#4E0113]/20 border-t-[#4E0113]/80 rounded-full animate-spin"></div>
                 </div>
            )}

            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500"></div>
            
            {isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <PlayCircleIcon className="w-10 h-10 md:w-12 md:h-12 text-white/90 drop-shadow-md group-hover:scale-110 transition-transform" />
                </div>
            )}

            {item.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-3 pt-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none">
                    <p className="font-serif text-white text-xs md:text-sm tracking-wide drop-shadow-md break-words">
                        {item.caption}
                    </p>
                </div>
            )}
        </motion.div>
    );
};

export default function ArchiwumXPage() {
  const { guest, loading: guestLoading } = useGuest();
  const router = useRouter();

  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (guestLoading) return;
    if (!guest) { router.replace("/"); return; }
    
    const allowedCodes = ["FC3818", "8DD06D"];
    const userWeight = ACCESS_WEIGHTS[(guest.access_level || 'basic') as AccessLevel] || 1;
    
    if (userWeight < ACCESS_WEIGHTS['extended'] && !allowedCodes.includes(guest.code)) {
        router.replace("/galeria");
    }
  }, [guest, guestLoading, router]);

  useEffect(() => {
    const fetchMedia = async () => {
      const { data, error } = await supabase
        .from("gallery_media")
        .select("*")
        .eq("album_id", "cringe");

      if (data) {
        let processedMedia = data.map(item => {
            let folder = "Inne";
            let actualLink = item.url;
            let extractedDriveId: string | undefined = undefined;

            if (item.url.includes('/http')) {
                const firstSlash = item.url.indexOf('/');
                folder = item.url.substring(0, firstSlash);
                actualLink = item.url.substring(firstSlash + 1);
            } else if (item.url.includes('/') && !item.url.startsWith('http')) {
                folder = item.url.split('/')[0];
            }

            if (actualLink.includes('drive.google.com')) {
                const match = actualLink.match(/\/d\/([a-zA-Z0-9_-]+)/);
                if (match && match[1]) {
                    extractedDriveId = match[1];
                    actualLink = `https://drive.google.com/uc?export=download&id=${match[1]}`; 
                }
            }

            return { 
                ...item, 
                parsedFolder: folder, 
                actualUrl: actualLink,
                driveId: extractedDriveId
            };
        });

        processedMedia.sort((a, b) => {
            const folderA = a.parsedFolder || "Inne";
            const folderB = b.parsedFolder || "Inne";
            if (folderA !== folderB) return folderA.localeCompare(folderB);
            return (a.caption || "").localeCompare(b.caption || "");
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

  const getYtId = (url: string) => {
      return url.includes('youtu.be/') 
        ? url.split('youtu.be/')[1].split('?')[0] 
        : url.split('v=')[1]?.split('&')[0];
  };

  const slides = media.map(m => {
      const urlToUse = m.actualUrl || m.url;
      
      if (m.type === 'youtube_link') {
          return { type: 'youtube-custom', id: m.id, url: urlToUse, description: m.caption };
      }
      if (m.type === 'video_link' && m.driveId) {
          return { type: 'drive-custom', id: m.id, driveId: m.driveId, description: m.caption };
      }
      if (m.type === 'video_link') {
          return { type: 'video', sources: [{ src: urlToUse, type: 'video/mp4' }], description: m.caption };
      }
      return { type: 'image', src: getImageUrl(urlToUse), description: m.caption };
  });

  const handleOpenLightbox = (id: string) => {
      const idx = media.findIndex(m => m.id === id);
      if (idx !== -1) {
          setLightboxIndex(idx);
          setLightboxOpen(true);
      }
  };

  const folders = Array.from(new Set(media.map(m => m.parsedFolder || "Inne")));

  if (guestLoading || !guest) return null;

  return (
    <RequireGuest>
      <div className="flex flex-col min-h-screen relative bg-[#FDF9EC]">
        <CustomCursor />
        <Navbar />

        <main className="flex-grow pt-24 md:pt-32 pb-32 overflow-hidden text-[#4c4a1e]">
          <PageWrapper className="max-w-[1600px] w-[95%] mx-auto px-4 md:px-8">
            
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
              <div className="flex flex-col gap-24">
                {folders.map((folderName) => {
                  const folderMedia = media.filter(m => (m.parsedFolder || "Inne") === folderName);

                  return (
                    <section key={folderName}>
                      <div className="flex items-center gap-6 mb-8 md:mb-12">
                        <h2 className="font-serif text-3xl md:text-5xl text-[#4E0113] tracking-wider font-light">
                          {folderName}
                        </h2>
                        <div className="h-[1px] flex-grow bg-[#4c4a1e]/15"></div>
                      </div>

                      <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3 md:gap-6 space-y-3 md:space-y-6">
                        {folderMedia.map((item, itemIndex) => {
                          const urlToUse = item.actualUrl || item.url;
                          const isVideo = item.type === 'video_link';
                          const isYouTube = item.type === 'youtube_link';

                          if (isYouTube) {
                              return (
                                  <motion.div 
                                      key={item.id} 
                                      initial={{ opacity: 0, y: 10 }}
                                      whileInView={{ opacity: 1, y: 0 }}
                                      viewport={{ once: true, margin: "100px" }}
                                      transition={{ duration: 0.5, delay: itemIndex * 0.05 }}
                                      onClick={() => handleOpenLightbox(item.id)}
                                      className="break-inside-avoid relative rounded-xl md:rounded-2xl overflow-hidden group cursor-pointer shadow-sm border border-[#4c4a1e]/10 bg-black/5"
                                  >
                                      <div className="relative w-full aspect-video bg-black">
                                          <img 
                                              src={`https://img.youtube.com/vi/${getYtId(urlToUse)}/hqdefault.jpg`} 
                                              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" 
                                              alt="YouTube"
                                          />
                                          <div className="absolute inset-0 flex items-center justify-center">
                                              <PlayCircleIcon className="w-12 h-12 text-white/80 group-hover:text-white transition-colors drop-shadow-lg group-hover:scale-110" />
                                          </div>
                                          {item.caption && (
                                              <div className="absolute bottom-0 left-0 right-0 p-3 pt-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none">
                                                  <p className="font-serif text-white text-xs md:text-sm tracking-wide drop-shadow-md break-words">
                                                      {item.caption}
                                                  </p>
                                              </div>
                                          )}
                                      </div>
                                  </motion.div>
                              );
                          }

                          if (isVideo) {
                              return (
                                  <MediaVideoTile 
                                      key={item.id} 
                                      item={item} 
                                      onClick={() => handleOpenLightbox(item.id)} 
                                      delay={itemIndex} 
                                  />
                              );
                          }

                          return (
                              <motion.div 
                                  key={item.id} 
                                  initial={{ opacity: 0, y: 10 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  viewport={{ once: true, margin: "100px" }}
                                  transition={{ duration: 0.5, delay: itemIndex * 0.05 }}
                                  onClick={() => handleOpenLightbox(item.id)}
                                  className="break-inside-avoid relative rounded-xl md:rounded-2xl overflow-hidden group cursor-pointer shadow-sm border border-[#4c4a1e]/10 bg-black/5"
                              >
                                  <img 
                                      src={getImageUrl(urlToUse)} 
                                      className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-700" 
                                      alt="Archiwum"
                                  />
                                  {item.caption && (
                                      <div className="absolute bottom-0 left-0 right-0 p-3 pt-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                          <p className="font-serif text-white text-xs md:text-sm tracking-wide drop-shadow-md break-words">
                                              {item.caption}
                                          </p>
                                      </div>
                                  )}
                              </motion.div>
                          );
                        })}
                      </div>
                    </section>
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
          slides={slides as any[]} 
          plugins={[Zoom, Video, Captions]} 
          render={{
            slide: ({ slide, offset }) => {
                // RENDEROWANIE YOUTUBE
                if ((slide as any).type === 'youtube-custom') {
                    const ytId = getYtId((slide as any).url);
                    if (offset === 0) {
                        return (
                            // POPRAWKA: Twarde pozycjonowanie absolute dla iframe na telefonach zapobiega ucinaniu 
                            <div className="relative w-full h-full flex items-center justify-center md:p-8 overflow-hidden">
                                <iframe 
                                    className="absolute inset-0 w-full h-full md:relative md:h-[85vh] max-w-6xl md:rounded-2xl shadow-2xl bg-black border-none" 
                                    src={`https://www.youtube.com/embed/${ytId}?autoplay=1&playsinline=1`} 
                                    allow="autoplay; encrypted-media; fullscreen" 
                                    allowFullScreen 
                                />
                            </div>
                        );
                    } else {
                        return (
                            <div className="relative w-full h-full flex items-center justify-center md:p-8">
                                <img src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`} className="absolute inset-0 w-full h-full md:relative md:max-h-full md:max-w-full object-contain opacity-50" alt="thumbnail" />
                            </div>
                        );
                    }
                }
                
                // RENDEROWANIE GOOGLE DRIVE
                if ((slide as any).type === 'drive-custom') {
                    if (offset === 0) {
                        return (
                            // POPRAWKA: absolute inset-0 wymusza na Google Drive bezwzględne trzymanie się rozmiarów ekranu, likwidując podwójne menu
                            <div className="relative w-full h-full flex items-center justify-center md:p-8 overflow-hidden">
                                <iframe 
                                    className="absolute inset-0 w-full h-full md:relative md:h-[85vh] max-w-6xl md:rounded-2xl shadow-2xl bg-black border-none" 
                                    src={`https://drive.google.com/file/d/${(slide as any).driveId}/preview`} 
                                    allow="autoplay; fullscreen" 
                                    allowFullScreen 
                                />
                            </div>
                        );
                    } else {
                        return (
                             <div className="relative w-full h-full flex items-center justify-center md:p-8">
                                 <img 
                                    src={`https://drive.google.com/thumbnail?id=${(slide as any).driveId}&sz=w800`} 
                                    className="absolute inset-0 w-full h-full md:relative md:max-h-full md:max-w-full object-contain opacity-50" 
                                    alt="thumbnail" 
                                 />
                             </div>
                        );
                    }
                }

                return undefined;
            }
          }}
        />
      </div>
    </RequireGuest>
  );
}