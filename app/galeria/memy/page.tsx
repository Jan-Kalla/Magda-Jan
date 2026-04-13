"use client";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import PageWrapper from "@/app/components/PageWrapper";
import RequireGuest from "@/app/components/RequireGuest";
import CustomCursor from "@/app/components/CustomCursor";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronLeftIcon, FolderIcon, StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
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

// IMPORT NASZEGO NOWEGO KOMPONENTU!
import MemeGrid from "./components/MemeGrid";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type MediaItem = { id: string; type: 'image' | 'video_link'; url: string; subfolder?: string; caption?: string; };
type MemeRating = { id: string; media_id: string; guest_code: string; rating: number; };

// === SŁOWNIKI FOLDERÓW ===
const FOLDER_NAMES_DICTIONARY: Record<string, string> = {
  "memy_liceum_studia": "Liceum i Studia",
  "madziowe_koszulki": "Which type of Madzia are you today?", 
  "wlasne_memy": "Nasze autorskie memy"
};

const FOLDER_ORDER = [
  "memy_liceum_studia",
  "madziowe_koszulki",
  "wlasne_memy"
];

const FOLDER_DESCRIPTIONS_DICTIONARY: Record<string, string> = {
  "memy_liceum_studia": "Oto olbrzymie archiwum memów i memicznych filmików, sięgające aż do początków naszego liceum! Niektóre z nich bardzo nas śmieszą, niektóre wywołują jedynie drobny uśmiech na twarzy, a jeszcze inne może kiedyś nas śmieszyły, ale z czasem z nich wyrośliśmy. Niemniej jednak zastanawiamy się, które z nich to wy docenicie najbardziej! Każdy z poniższych obrazków/filmików możecie ocenić w skali od 1 do 10, gdzie 1 to nieśmieszny syf, niewarty nawet jednego kilobajta na dysku, a 10 to dzieło wybitnie śmieszne lub poruszające z głębokim przekazem, czy też zwyczajnie fenomenalnie absurdalne. Nie martw się, twoje oceny są anonimowe, są nam potrzebne jedynie do stworzenia średniej. Pamiętaj też, aby włączyć dźwięk, bo przy niektówych filmikach ma on kluczowe znaczenie ;)",
  "madziowe_koszulki": "Legendarna koncepcyjna seria koszulek, którą Johny zrobił Magdzie na jej 19-ste urodziny. 19 twarzy Madzi, każda mówi coś innego - znajdź tę, która najlepiej pasuje do Twojego dzisiejszego nastroju!",
  "wlasne_memy": "Obrazkowy zbiór naszych własnych przemyśleń, spostrzeżeń, opinii i żartów na temat rzeczywistości."
};

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

  useEffect(() => {
    if (selectedFolder) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedFolder]);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const st = e.state;
      if (st?.level === 'lightbox') setLightboxOpen(true);
      else if (st?.level === 'folder') { setLightboxOpen(false); setSelectedFolder(st.folder); } 
      else { setLightboxOpen(false); setSelectedFolder(null); }
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

  useEffect(() => {
    const updateCols = () => {
      if (window.innerWidth >= 1536) setColumnsCount(5);       
      else if (window.innerWidth >= 1280) setColumnsCount(4);  
      else if (window.innerWidth >= 1024) setColumnsCount(3);  
      else setColumnsCount(2);                                 
    };
    updateCols();
    window.addEventListener("resize", updateCols);
    return () => window.removeEventListener("resize", updateCols);
  }, []);

  useEffect(() => {
    const allowedCodes = ["FC3818", "8DD06D"];
    if (guestLoading) return;
    if (!guest) { router.replace("/"); return; }
    const userWeight = ACCESS_WEIGHTS[(guest.access_level || 'basic') as AccessLevel] || 1;
    if (userWeight < ACCESS_WEIGHTS['vip'] && !allowedCodes.includes(guest.code)) router.replace("/galeria");
  }, [guest, guestLoading, router]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: mediaData } = await supabase.from("gallery_media").select("*").eq("album_id", "memes");
      const { data: ratingsData } = await supabase.from("meme_ratings").select("*");

      if (mediaData) {
        const groups: Record<string, MediaItem[]> = {};
        mediaData.forEach((item) => {
          const folder = item.subfolder || (item.url.includes('/') ? item.url.split('/')[0] : "Różne");
          if (!groups[folder]) groups[folder] = [];
          groups[folder].push(item as MediaItem);
        });

        Object.keys(groups).forEach(folderName => groups[folderName].sort((a, b) => a.url.localeCompare(b.url)));
        setGroupedMedia(groups);
      }
      if (ratingsData) setRatings(ratingsData);
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
        .upsert({ media_id: mediaId, guest_code: guest.code, rating: ratingValue }, { onConflict: 'media_id, guest_code' })
        .select();

    if (!error && data) {
        setRatings(prev => {
            const filtered = prev.filter(r => !(r.media_id === mediaId && r.guest_code === guest.code));
            return [...filtered, data[0] as MemeRating];
        });
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
      const slideBase = {
          id: m.id,
          description: m.caption,
      };

      if (m.type === 'video_link') {
          return {
              ...slideBase,
              type: "video" as const,
              sources: [{ src: getImageUrl(m.url), type: "video/mp4" }],
          };
      }
      return { 
          ...slideBase,
          src: getImageUrl(m.url) 
      };
  });

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
                        <motion.div key="back-to-gallery" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                            <Link href="/galeria" className="inline-flex items-center gap-2 text-[#4E0113]/70 hover:text-[#4E0113] transition-colors font-serif italic text-lg">
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
                className="font-sans font-light text-[#4c4a1e]/80 text-base md:text-lg max-w-4xl mx-auto leading-relaxed"
              >
                {selectedFolder 
                    ? (FOLDER_DESCRIPTIONS_DICTIONARY[selectedFolder] || "Kolekcja memów.") 
                    : "Witajcie w sekcji dla koneserów sztuki nowoczesnej. Memy, to dość istotny element naszej wspólnej historii, więc postanowiliśmy podzielić je na pewne kategorie."}
              </motion.p>
            </header>

            {loading ? (
              <div className="flex justify-center py-20"><div className="w-12 h-12 border-[3px] border-[#4c4a1e]/20 border-t-[#4E0113] rounded-full animate-spin"></div></div>
            ) : (
              <AnimatePresence mode="wait">
                {!selectedFolder && (
                    <motion.div key="folders-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {Object.entries(groupedMedia)
                            .sort(([folderA], [folderB]) => (FOLDER_ORDER.indexOf(folderA) === -1 ? 999 : FOLDER_ORDER.indexOf(folderA)) - (FOLDER_ORDER.indexOf(folderB) === -1 ? 999 : FOLDER_ORDER.indexOf(folderB)))
                            .map(([folderName, items]) => {
                                const coverMedia = items.find(i => i.type === 'image') || items[0];
                                return (
                                    <div key={folderName} onClick={() => handleOpenFolder(folderName)} className="group cursor-pointer">
                                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md mb-4 bg-black/5 border border-[#4c4a1e]/10">
                                            {coverMedia?.type === 'video_link' ? (
                                                <video src={getImageUrl(coverMedia.url)} autoPlay loop muted playsInline className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                                            ) : (
                                                coverMedia && <img src={getImageUrl(coverMedia.url)} alt={folderName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                            )}
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                                            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
                                                <div className="bg-white/90 backdrop-blur-sm p-2 rounded-xl text-[#4E0113] shadow-sm"><FolderIcon className="w-6 h-6" /></div>
                                                <span className="bg-black/50 backdrop-blur-md text-white text-xs font-mono font-bold px-3 py-1.5 rounded-full">
                                                    {items.length} {items.length === 1 ? 'mem' : items.length < 5 ? 'memiczne pliki' : 'memicznych plików'}
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
                    <MemeGrid 
                        items={currentMedia}
                        columnsCount={columnsCount}
                        getImageUrl={getImageUrl}
                        handleOpenLightbox={handleOpenLightbox}
                        showRatings={selectedFolder === "memy_liceum_studia"}
                        showCaptions={selectedFolder === "wlasne_memy"} 
                        ratings={ratings}
                        guestCode={guest?.code}
                        onSubmitRating={submitRating}
                    />
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
            plugins={[Zoom, Video, Captions]} 
            render={{
                slideFooter: ({ slide }) => {
                    // ROZWIĄZANIE BŁĘDU TYPESCRIPT: Rzutowanie na 'any', aby TS przestał krzyczeć o braku 'id'
                    const slideId = (slide as any).id;

                    if (selectedFolder !== "memy_liceum_studia" || !slideId) return null;

                    const memeRatings = ratings.filter(r => r.media_id === slideId);
                    const voteCount = memeRatings.length;
                    const avgRating = voteCount > 0 
                        ? (memeRatings.reduce((sum, r) => sum + r.rating, 0) / voteCount).toFixed(1) 
                        : null;
                    const userVote = guest ? memeRatings.find(r => r.guest_code === guest.code) : null;

                    return (
                        <div className="flex flex-col items-center gap-3 pb-6 pt-2 bg-black/60 backdrop-blur-md px-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 text-white font-bold text-lg">
                                    {avgRating ? <StarSolid className="w-5 h-5 text-yellow-500" /> : <StarOutline className="w-5 h-5 text-white/30" />}
                                    <span>{avgRating ? `${avgRating}/10` : 'Brak ocen'}</span>
                                    <span className="text-white/50 font-normal text-sm ml-1">({voteCount})</span>
                                </div>
                                
                                {userVote && (
                                    <div className="flex items-center gap-1 text-green-400 bg-green-900/40 px-3 py-1 rounded-full text-sm font-medium border border-green-500/30">
                                        Twoja ocena: {userVote.rating}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-1.5 justify-center">
                                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                                    <button
                                        key={num}
                                        onClick={(e) => {
                                            e.stopPropagation(); 
                                            submitRating(slideId as string, num);
                                        }}
                                        className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-sm rounded-lg transition-all border
                                            ${userVote?.rating === num 
                                                ? 'bg-[#C97B78] text-white border-[#C97B78] scale-110 shadow-lg' 
                                                : 'bg-white/10 border-white/20 text-white hover:bg-white/30 hover:scale-105'
                                            }`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                }
            }}
        />
      </div>
    </RequireGuest>
  );
}