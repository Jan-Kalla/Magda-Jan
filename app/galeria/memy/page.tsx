"use client";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import PageWrapper from "@/app/components/PageWrapper";
import RequireGuest from "@/app/components/RequireGuest";
import CustomCursor from "@/app/components/CustomCursor";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeftIcon, FolderIcon, StarIcon as StarSolid, PencilSquareIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useGuest } from "@/app/context/GuestContext";
import { useRouter } from "next/navigation";
import { ACCESS_WEIGHTS, AccessLevel } from "@/app/galeria/data";

import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Video from "yet-another-react-lightbox/plugins/video";
import "yet-another-react-lightbox/styles.css";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type MediaItem = {
  id: string;
  type: 'image' | 'video_link';
  url: string;
  subfolder?: string;
  caption?: string;
};

type MemeRating = {
  id: string;
  media_id: string;
  guest_code: string;
  rating: number;
};

const FOLDER_NAMES_DICTIONARY: Record<string, string> = {
  "memy_liceum_studia": "Liceum i Studia",
};

const FOLDER_ORDER = [
  "memy_liceum_studia"
];

const formatFolderName = (name: string) => {
  if (FOLDER_NAMES_DICTIONARY[name]) return FOLDER_NAMES_DICTIONARY[name];
  return name.replace(/[_-]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function MemyPage() {
  const { guest, loading: guestLoading } = useGuest();
  const router = useRouter();

  const [groupedMedia, setGroupedMedia] = useState<Record<string, MediaItem[]>>({});
  const [ratings, setRatings] = useState<MemeRating[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const [columnsCount, setColumnsCount] = useState(5);
  const [ratingPanelOpen, setRatingPanelOpen] = useState<string | null>(null);

  useEffect(() => {
    if (selectedFolder) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedFolder]);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const st = e.state;
      if (st?.level === 'lightbox') {
          setLightboxOpen(true);
      } else if (st?.level === 'folder') {
          setLightboxOpen(false);
          setSelectedFolder(st.folder);
      } else {
          setLightboxOpen(false);
          setSelectedFolder(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleOpenFolder = (folderName: string) => {
    setSelectedFolder(folderName);
    window.history.pushState({ level: 'folder', folder: folderName }, '');
  };

  const handleCloseFolder = () => {
    if (window.history.state?.level === 'folder') window.history.back();
    else setSelectedFolder(null);
  };

  const handleOpenLightbox = (item: MediaItem) => {
    const currentMedia = selectedFolder ? groupedMedia[selectedFolder] || [] : [];
    const index = currentMedia.findIndex(m => m.id === item.id);
    if (index !== -1) {
      setLightboxIndex(index);
      setLightboxOpen(true);
      window.history.pushState({ level: 'lightbox', folder: selectedFolder }, '');
    }
  };

  const handleCloseLightbox = () => {
    if (window.history.state?.level === 'lightbox') window.history.back();
    else setLightboxOpen(false);
  };

  // === ZMIANA 1: ZAAWANSOWANA RESPONSOWNOŚĆ ===
  useEffect(() => {
    const updateCols = () => {
      if (window.innerWidth >= 1536) setColumnsCount(5);       // Bardzo szerokie ekrany
      else if (window.innerWidth >= 1280) setColumnsCount(4);  // Standardowe desktopy
      else if (window.innerWidth >= 1024) setColumnsCount(3);  // Mniejsze laptopy
      else setColumnsCount(2);                                 // Tablety i telefony
    };
    updateCols();
    window.addEventListener("resize", updateCols);
    return () => window.removeEventListener("resize", updateCols);
  }, []);

  useEffect(() => {
    const allowedCodes = ["FC3818", "8DD06D"];
    if (guestLoading) return;
    if (!guest) {
      router.replace("/");
      return;
    }
    const userLevel = (guest.access_level || 'basic') as AccessLevel;
    const userWeight = ACCESS_WEIGHTS[userLevel] || 1;
    const requiredWeight = ACCESS_WEIGHTS['vip'];

    if (userWeight < requiredWeight && !allowedCodes.includes(guest.code)) {
      router.replace("/galeria");
    }
  }, [guest, guestLoading, router]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: mediaData } = await supabase
        .from("gallery_media")
        .select("*")
        .eq("album_id", "memes");

      const { data: ratingsData } = await supabase
        .from("meme_ratings")
        .select("*");

      if (mediaData) {
        const groups: Record<string, MediaItem[]> = {};
        mediaData.forEach((item) => {
          const folder = item.subfolder || (item.url.includes('/') ? item.url.split('/')[0] : "Różne");
          if (!groups[folder]) groups[folder] = [];
          groups[folder].push(item as MediaItem);
        });

        Object.keys(groups).forEach(folderName => {
            groups[folderName].sort((a, b) => a.url.localeCompare(b.url));
        });

        setGroupedMedia(groups);
      }
      
      if (ratingsData) {
        setRatings(ratingsData);
      }

      setLoading(false);
    };

    const allowedCodes = ["FC3818", "8DD06D"];
    if (guest && (ACCESS_WEIGHTS[(guest.access_level as AccessLevel) || 'basic'] >= ACCESS_WEIGHTS['vip'] || allowedCodes.includes(guest.code))) {
        fetchData();
    }
  }, [guest]);

  const submitRating = async (mediaId: string, ratingValue: number) => {
    if (!guest) return;

    const { data, error } = await supabase
        .from("meme_ratings")
        .upsert({ 
            media_id: mediaId, 
            guest_code: guest.code, 
            rating: ratingValue 
        }, { onConflict: 'media_id, guest_code' })
        .select();

    if (!error && data) {
        setRatings(prev => {
            const filtered = prev.filter(r => !(r.media_id === mediaId && r.guest_code === guest.code));
            return [...filtered, data[0] as MemeRating];
        });
        setRatingPanelOpen(null); 
    }
  };

  const getImageUrl = (pathOrUrl: string) => {
    if (pathOrUrl.startsWith("http") || pathOrUrl.startsWith("/")) return pathOrUrl;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/${pathOrUrl}`;
  };

  const allowedCodes = ["FC3818", "8DD06D"];
  const userWeight = guest ? ACCESS_WEIGHTS[(guest.access_level as AccessLevel) || 'basic'] : 0;
  if (!guestLoading && guest && userWeight < ACCESS_WEIGHTS['vip'] && !allowedCodes.includes(guest.code)) return null;

  const currentMedia = selectedFolder ? groupedMedia[selectedFolder] || [] : [];
  
  const slides = currentMedia.map(m => {
    if (m.type === 'video_link') {
        return {
            type: "video" as const,
            sources: [{ src: getImageUrl(m.url), type: "video/mp4" }],
        };
    }
    return { src: getImageUrl(m.url) };
  });

  const distributeToColumns = (items: MediaItem[]) => {
    const cols: MediaItem[][] = Array.from({ length: columnsCount }, () => []);
    items.forEach((item, index) => {
      cols[index % columnsCount].push(item);
    });
    return cols;
  };

  return (
    <RequireGuest>
      <div className="flex flex-col min-h-screen relative bg-[#FDF9EC]">
        <CustomCursor />
        <Navbar />

        <main className="flex-grow pt-24 md:pt-32 pb-32 overflow-hidden text-[#4c4a1e]">
          <PageWrapper className="max-w-[1800px] w-[95%] mx-auto px-4 md:px-8">
            
            <div className="mb-8 h-8">
                <AnimatePresence mode="wait">
                    {selectedFolder ? (
                        <motion.button 
                            key="back-to-folders"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            onClick={handleCloseFolder}
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

            <header className="text-center mb-12 md:mb-24">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                key={selectedFolder || "main"}
                className="font-serif font-light text-4xl sm:text-5xl md:text-6xl text-[#4E0113] mb-4 uppercase tracking-widest"
              >
                {selectedFolder ? formatFolderName(selectedFolder) : "Komnata Memów"}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-sans font-light text-[#4c4a1e]/80 text-base md:text-lg max-w-2xl mx-auto"
              >
                {selectedFolder 
                    ? "Oto olbrzymie archiwum memów i memicznych filmików, sięgające aż do początków naszego liceum! Niektóre z nich bardzo nas śmieszą, niektóre wywołują drobny uśmiech na twarzy, a jeszcze inne, że może kiedyś nas śmieszyły, ale z czasem z nich wyrośliśmy. Niemniej jednak zastanawiamy się, które z nich to wy docenicie najbardziej! Każdy z poniższych obrazków/filmików możecie ocenić w skali od 1 do 10, gdzie 1 to nieśmieszny syf, niewarty nawet jednego kilobajta na dysku, a 10 to dzieło wybitnie śmieszne lub poruszające z głębokim przekazem, czy też zwyczajnie fenomenalnie absurdalne. Nie martw się, twoje oceny są anonimowe, są nam potrzebne jedynie do stworzenia średniej." 
                    : "Witajcie w sekcji dla koneserów sztuki nowoczesnej. Wybierz folder i oceń klasyki."}
              </motion.p>
            </header>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-[3px] border-[#4c4a1e]/20 border-t-[#4E0113] rounded-full animate-spin"></div>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                
                {!selectedFolder && (
                    <motion.div 
                        key="folders-view"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                    >
                        {Object.entries(groupedMedia)
                            .sort(([folderA], [folderB]) => {
                                const indexA = FOLDER_ORDER.indexOf(folderA);
                                const indexB = FOLDER_ORDER.indexOf(folderB);
                                const posA = indexA === -1 ? 999 : indexA;
                                const posB = indexB === -1 ? 999 : indexB;
                                return posA - posB;
                            })
                            .map(([folderName, items]) => {
                                const coverMedia = items.find(i => i.type === 'image') || items[0];

                                return (
                                    <div 
                                        key={folderName}
                                        onClick={() => handleOpenFolder(folderName)}
                                        className="group cursor-pointer"
                                    >
                                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md mb-4 bg-black/5 border border-[#4c4a1e]/10">
                                            {coverMedia?.type === 'video_link' ? (
                                                <video 
                                                    src={getImageUrl(coverMedia.url)} 
                                                    autoPlay loop muted playsInline 
                                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" 
                                                />
                                            ) : (
                                                coverMedia && (
                                                    <img 
                                                        src={getImageUrl(coverMedia.url)} 
                                                        alt={folderName} 
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                                    />
                                                )
                                            )}
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                                            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
                                                <div className="bg-white/90 backdrop-blur-sm p-2 rounded-xl text-[#4E0113] shadow-sm">
                                                    <FolderIcon className="w-6 h-6" />
                                                </div>
                                                <span className="bg-black/50 backdrop-blur-md text-white text-xs font-mono font-bold px-3 py-1.5 rounded-full">
                                                    {items.length} {items.length === 1 ? 'mem' : items.length < 5 ? 'memy' : 'memów'}
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

                {selectedFolder && (
                    <motion.div
                        key="photos-view"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        // ZMIANA: ciaśniejsza luka na telefony (gap-2) i większa na PC
                        className="flex gap-2 sm:gap-4 md:gap-6 items-start w-full"
                    >
                        {distributeToColumns(currentMedia).map((column, colIndex) => (
                            <div key={colIndex} className="flex flex-col flex-1 gap-0 min-w-0">
                                {column.map((item) => {
                                    
                                    const memeRatings = ratings.filter(r => r.media_id === item.id);
                                    const voteCount = memeRatings.length;
                                    const avgRating = voteCount > 0 
                                        ? (memeRatings.reduce((sum, r) => sum + r.rating, 0) / voteCount).toFixed(1) 
                                        : null;
                                    const userVote = guest ? memeRatings.find(r => r.guest_code === guest.code) : null;

                                    return (
                                        <div 
                                            key={item.id}
                                            className="mb-4 sm:mb-6 md:mb-8 bg-white p-1 sm:p-2 pb-3 sm:pb-3 rounded-sm shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#4c4a1e]/5 w-full flex flex-col group"
                                        >
                                            <div 
                                                onClick={() => handleOpenLightbox(item)}
                                                className="relative w-full rounded-sm overflow-hidden bg-gray-100 cursor-pointer"
                                            >
                                                {item.type === 'video_link' ? (
                                                    <video 
                                                        src={getImageUrl(item.url)} 
                                                        autoPlay loop muted playsInline
                                                        className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.02]" 
                                                    />
                                                ) : (
                                                    <img 
                                                        src={getImageUrl(item.url)} 
                                                        alt={item.caption || "Mem"} 
                                                        loading="lazy"
                                                        className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.02]" 
                                                    />
                                                )}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                                            </div>

                                            <div className="mt-2 px-1 flex flex-col gap-2">
                                                
                                                <div className="flex items-center justify-between text-sm flex-wrap gap-y-2">
                                                    <div className="flex items-center gap-1 text-[#4E0113] font-bold">
                                                        {avgRating ? <StarSolid className="w-4 h-4 text-yellow-500" /> : <StarOutline className="w-4 h-4 text-[#4c4a1e]/30" />}
                                                        <span>{avgRating ? `${avgRating}/10` : 'Brak'}</span>
                                                        <span className="text-[#4c4a1e]/50 font-normal text-xs ml-0.5">
                                                            ({voteCount})
                                                        </span>
                                                    </div>

                                                    {/* ZMIANA 2: Klikalna plakietka do edycji oceny */}
                                                    {userVote ? (
                                                        <button 
                                                            onClick={() => setRatingPanelOpen(ratingPanelOpen === item.id ? null : item.id)}
                                                            className="flex items-center gap-1 text-green-700 bg-green-50 hover:bg-green-100 px-1.5 py-0.5 rounded text-xs font-medium border border-green-200 transition-colors"
                                                            title="Zmień ocenę"
                                                        >
                                                            <span>Twoja ocena: {userVote.rating}</span>
                                                            <PencilSquareIcon className="w-3 h-3" />
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            onClick={() => setRatingPanelOpen(ratingPanelOpen === item.id ? null : item.id)}
                                                            className="text-xs font-semibold uppercase tracking-wider text-[#C97B78] hover:text-[#4E0113] transition-colors"
                                                        >
                                                            {ratingPanelOpen === item.id ? 'Anuluj' : 'Oceń!'}
                                                        </button>
                                                    )}
                                                </div>

                                                {/* ZMIANA 3: Usunięcie warunku !userVote, żeby panel mógł się otworzyć do edycji */}
                                                <AnimatePresence>
                                                    {ratingPanelOpen === item.id && (
                                                        <motion.div 
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="pt-2 flex flex-wrap gap-0.5 sm:gap-1 justify-center">
                                                                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                                                                    <button
                                                                        key={num}
                                                                        onClick={() => submitRating(item.id, num)}
                                                                        className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-xs sm:text-sm rounded transition-all border
                                                                            ${userVote?.rating === num 
                                                                                ? 'bg-[#C97B78] text-white border-[#C97B78] shadow-inner' 
                                                                                : 'bg-[#FDF9EC] border-[#4c4a1e]/20 text-[#4c4a1e] hover:bg-[#C97B78] hover:text-white hover:border-[#C97B78]'
                                                                            }`}
                                                                    >
                                                                        {num}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </motion.div>
                )}

              </AnimatePresence>
            )}

          </PageWrapper>
        </main>

        <Footer />
        
        <Lightbox
            open={lightboxOpen}
            close={handleCloseLightbox}
            index={lightboxIndex}
            slides={slides}
            carousel={{ finite: false }}
            plugins={[Zoom, Video]}
        />
      </div>
    </RequireGuest>
  );
}