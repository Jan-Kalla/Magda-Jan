"use client";

import Navbar from "@/app/components/Navbar";
import Link from "next/link";
import { useGuest } from "@/app/context/GuestContext";
import Footer from "@/app/components/Footer";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  LockClosedIcon, 
  PlayCircleIcon, 
  PuzzlePieceIcon, 
  BeakerIcon,
  MagnifyingGlassIcon,
  GiftIcon
} from "@heroicons/react/24/outline"; // Zmieniono na wariant outline dla elegancji
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import PageWrapper from "@/app/components/PageWrapper";
import OrganicGlassPattern from "@/app/components/OrganicGlassPattern"; // Dodano import szkła

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- 1. KONTENER (Zarządza kolejnością) ---
const listContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// --- 2. ELEMENT ZWYKŁY (Nagłówek - wjeżdża z dołu) ---
const headerVariant: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

// --- 3. ELEMENT BOCZNY (Karty - wjeżdżają z boków) ---
const cardVariant: Variants = {
  hidden: (direction: number) => ({ 
    opacity: 0, 
    x: direction === -1 ? -150 : 150 
  }),
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.9, 
      ease: [0.25, 1, 0.5, 1] 
    }
  },
};

export default function CompetitionPage() {
  const { guest } = useGuest();
  const router = useRouter();
  
  const [showLockedMessage, setShowLockedMessage] = useState(false);
  const [showTournamentMessage, setShowTournamentMessage] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const isAdmin = guest?.code === "FC3818";
  const isTester = guest?.code === "8DD06D";

  useEffect(() => {
    const checkStatus = async () => {
        const { data } = await supabase.from('quiz_state').select('is_open').single();
        if (data) {
            setIsOpen(data.is_open);
        }
    };
    checkStatus();
    
    const channel = supabase.channel('menu_quiz_access')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'quiz_state', filter: 'id=eq.1' }, 
        (payload) => {
            setIsOpen(payload.new.is_open);
        })
        .subscribe();
        
    return () => { supabase.removeChannel(channel) };
  }, []);

  const handleQuizClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isAdmin) {
      router.push("/rywalizacja/quiz"); 
    } else if (isTester || isOpen) {
      router.push("/rywalizacja/quiz/game"); 
    } else {
      setShowLockedMessage(true);
      setTimeout(() => setShowLockedMessage(false), 2500);
    }
  };

  const handleTournamentClick = () => {
    setShowTournamentMessage(true);
    setTimeout(() => setShowTournamentMessage(false), 2500);
  };

  const isQuizUnlocked = isAdmin || isTester || isOpen;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* GŁÓWNY KONTENER Z PŁYNNYM GRADIENTEM I SZKŁEM */}
      <section className="relative flex-grow bg-gradient-to-b from-[#FDF9EC] via-[#A46C6E] to-[#4E0113] pt-24 md:pt-32 pb-32 overflow-hidden">
        
        <div className="absolute inset-0 z-0 pointer-events-none">
          <OrganicGlassPattern part="top" />
        </div>

        <div className="relative z-10 px-4 md:px-8">
          <PageWrapper className="max-w-2xl mx-auto">
            
            <motion.div 
              className="flex flex-col items-center gap-6 md:gap-8"
              variants={listContainer} 
              initial="hidden"
              animate="visible"
            >
            
              {/* NAGŁÓWEK */}
              <motion.h1 variants={headerVariant} className="font-script text-6xl md:text-7xl text-[#4c4a1e] mb-4 text-center drop-shadow-sm">
                Strefa Rywalizacji
              </motion.h1>

              {/* === KOMUNIKAT WSTĘPNY (Z LEWEJ) === */}
              <motion.div
                custom={-1}
                variants={cardVariant}
                className="bg-white/40 backdrop-blur-xl p-8 md:p-10 rounded-2xl border border-white/60 text-center shadow-[0_8px_30px_rgba(0,0,0,0.06)] w-full"
              >
                 <div className="flex justify-center mb-4">
                    <GiftIcon className="w-8 h-8 text-[#4c4a1e]" />
                 </div>
                 <p className="text-[#4c4a1e] text-sm md:text-base leading-relaxed font-sans font-light">
                    Włączcie ducha walki! <br/><br/>
                    Przygotowaliśmy dla Was kilka angażujących konkurencji. 
                    Liczy się przede wszystkim dobra zabawa, ale jest też o co walczyć.
                    W każdej konkurencji <strong className="font-[system-ui] font-bold text-[#4c4a1e] tracking-wide">TOP 3 </strong>graczy zgarnia wyjątkowe<strong className="font-[system-ui] font-bold text-[#4c4a1e] tracking-wide"> nagrody</strong>, które zostaną wręczone podczas uroczystości weselnej.
                 </p>
              </motion.div>

              {/* === 1. QUIZ (Z PRAWEJ) === */}
              <motion.div
                custom={1}
                variants={cardVariant}
                whileHover={isQuizUnlocked ? { scale: 1.02 } : {}}
                whileTap={isQuizUnlocked ? { scale: 0.98 } : {}}
                className="w-full relative group"
              >
                <div
                  onClick={handleQuizClick}
                  className={`
                    relative w-full p-6 md:p-8 rounded-2xl shadow-lg border-2 flex items-center justify-between cursor-pointer transition-all duration-300 overflow-hidden backdrop-blur-md
                    ${isQuizUnlocked 
                      ? "bg-white/30 border-white/50 text-[#4c4a1e] hover:bg-white/50" 
                      : "bg-black/5 border-[#4c4a1e]/10 text-[#4c4a1e]/70"
                    }
                  `}
                >
                  <div className="flex items-center gap-6 z-10">
                    <div className={`p-4 rounded-full ${isQuizUnlocked ? 'bg-white/40' : 'bg-[#4c4a1e]/5'}`}>
                      {isAdmin ? <PlayCircleIcon className="w-8 h-8" /> :
                       isTester ? <BeakerIcon className="w-8 h-8" /> :
                       isQuizUnlocked ? <PlayCircleIcon className="w-8 h-8" /> :
                       <LockClosedIcon className="w-8 h-8 opacity-60" />}
                    </div>
                    <div className="text-left">
                      <h2 className="font-serif text-2xl md:text-3xl tracking-wide mb-1">Quiz</h2>
                      <p className="font-sans font-light uppercase tracking-widest text-xs md:text-sm opacity-80">
                        {isAdmin ? "Panel Wodzireja" : isTester ? "Tryb Testowy" : "Sprawdź wiedzę o Parze Młodej"}
                      </p>
                    </div>
                  </div>

                  {!isQuizUnlocked && (
                    <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20 backdrop-blur-sm">
                      <p className="text-[#4c4a1e] font-serif italic text-lg px-4 text-center">
                        Quiz zostanie odblokowany w trakcie wesela.
                      </p>
                    </div>
                  )}
                </div>

                <AnimatePresence>
                {showLockedMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute -bottom-14 left-0 right-0 text-center z-30"
                  >
                    <span className="bg-[#4c4a1e] text-[#FDF9EC] text-sm md:text-base font-serif italic px-6 py-3 rounded-xl shadow-xl border border-white/10 inline-block">
                      Quiz jest obecnie zamknięty.
                    </span>
                  </motion.div>
                )}
                </AnimatePresence>
              </motion.div>

              {/* === 2. TETRIS (Z LEWEJ) === */}
              {/* Tutaj zaczyna się ściemniać, zmieniamy styl na ciemne szkło i jasny tekst */}
              <motion.div 
                  custom={-1}
                  variants={cardVariant} 
                  className="w-full"
              >
                  <Link href="/rywalizacja/tetris" className="w-full block">
                  <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full p-6 md:p-8 bg-black/10 backdrop-blur-md border border-white/20 text-[#FDF9EC] rounded-2xl shadow-xl flex items-center gap-6 hover:bg-black/20 transition-all duration-300"
                  >
                      <div className="p-4 bg-white/10 rounded-full">
                      <PuzzlePieceIcon className="w-8 h-8 text-[#FDF9EC]" />
                      </div>
                      <div className="text-left">
                      <h2 className="font-serif text-2xl md:text-3xl tracking-wide mb-1">Tetris</h2>
                      <p className="font-sans font-light uppercase tracking-widest text-xs md:text-sm opacity-80">
                        Klasyczna rozgrywka, zacięta rywalizacja
                      </p>
                      </div>
                  </motion.div>
                  </Link>
              </motion.div>

              {/* === 3. ZAGADKA (Z PRAWEJ) === */}
              <motion.div 
                  custom={1}
                  variants={cardVariant} 
                  className="w-full"
              >
                  <Link href="/rywalizacja/wyprawa" className="w-full block">
                  <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full p-6 md:p-8 bg-black/15 backdrop-blur-md border border-white/20 text-[#FDF9EC] rounded-2xl shadow-xl flex items-center gap-6 hover:bg-black/25 transition-all duration-300"
                  >
                      <div className="p-4 bg-white/10 rounded-full">
                      <MagnifyingGlassIcon className="w-8 h-8 text-[#FDF9EC]" />
                      </div>
                      <div className="text-left">
                      <h2 className="font-serif text-2xl md:text-3xl tracking-wide mb-1">Zagadka</h2>
                      <p className="font-sans font-light uppercase tracking-widest text-xs md:text-sm opacity-80">
                        Mniej zręczności, więcej myślenia
                      </p>
                      </div>
                  </motion.div>
                  </Link>
              </motion.div>

               {/* === 4. Gra melodyjna (Z LEWEJ) === */}
               {/* Na samym dole jest głębokie bordo - stosujemy mocniejsze szkło */}
              <motion.div
                 custom={-1}
                 variants={cardVariant}
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 className="w-full relative group cursor-not-allowed"
              >
                 <div className="w-full p-6 md:p-8 bg-black/20 backdrop-blur-md border border-white/10 text-[#FDF9EC]/60 rounded-2xl shadow-md flex items-center gap-6 transition-all duration-300">
                    <div className="p-4 bg-white/5 rounded-full">
                       <LockClosedIcon className="w-8 h-8 opacity-60" />
                    </div>
                    <div className="text-left">
                       <h2 className="font-serif text-2xl md:text-3xl tracking-wide mb-1">Gra melodyjna</h2>
                       <p className="font-sans font-light uppercase tracking-widest text-xs md:text-sm opacity-80">
                         Konkurencja muzyczna na weselu
                       </p>
                    </div>
                 </div>
              </motion.div>

              {/* === 5. TURNIEJ II (Z PRAWEJ) === */}
              <motion.div
                 custom={1}
                 variants={cardVariant}
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 onClick={handleTournamentClick}
                 className="w-full relative group cursor-pointer"
              >
                 <div className="w-full p-6 md:p-8 bg-black/20 backdrop-blur-md border border-white/10 text-[#FDF9EC]/60 rounded-2xl shadow-md flex items-center gap-6 transition-all duration-300">
                    <div className="p-4 bg-white/5 rounded-full">
                       <LockClosedIcon className="w-8 h-8 opacity-60" />
                    </div>
                    <div className="text-left">
                       <h2 className="font-serif text-2xl md:text-3xl tracking-wide mb-1">Wielki Turniej II</h2>
                       <p className="font-sans font-light uppercase tracking-widest text-xs md:text-sm opacity-80">
                         Dostępne po uroczystości
                       </p>
                    </div>
                 </div>
                 
                 <AnimatePresence>
                 {showTournamentMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute -bottom-14 left-0 right-0 text-center z-30"
                  >
                    <span className="bg-[#4c4a1e] text-[#FDF9EC] text-sm md:text-base font-serif italic px-6 py-3 rounded-xl shadow-xl border border-white/10 inline-block">
                      Wyniki pojawią się tutaj po zakończeniu wesela.
                    </span>
                  </motion.div>
                 )}
                 </AnimatePresence>
              </motion.div>

            </motion.div>
          </PageWrapper>
        </div>
      </section>

      <Footer />
    </div>
  );
}