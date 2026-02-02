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
} from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import PageWrapper from "@/app/components/PageWrapper";

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
      staggerChildren: 0.15, // Odstęp czasowy między elementami
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
// direction: -1 (z lewej), 1 (z prawej)
const cardVariant: Variants = {
  hidden: (direction: number) => ({ 
    opacity: 0, 
    x: direction === -1 ? -200 : 200 // Przesunięcie startowe (200px)
  }),
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.9, 
      ease: [0.25, 1, 0.5, 1] // Bardzo miękkie hamowanie (Soft cubic-bezier)
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
      setTimeout(() => setShowLockedMessage(false), 2000);
    }
  };

  const handleTournamentClick = () => {
    setShowTournamentMessage(true);
    setTimeout(() => setShowTournamentMessage(false), 2000);
  };

  const isQuizUnlocked = isAdmin || isTester || isOpen;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-[#FAD6C8] to-[#4E0113] pt-[112px] px-4 pb-20">
        
        <PageWrapper className="max-w-md mx-auto">
          
          <motion.div 
            className="flex flex-col items-center gap-6"
            variants={listContainer} // Przypisujemy kontener sekwencyjny
            initial="hidden"
            animate="visible"
          >
          
            {/* NAGŁÓWEK (Wjeżdża klasycznie z góry/dołu) */}
            <motion.h1 variants={headerVariant} className="text-3xl md:text-4xl font-bold text-[#4E0113] mb-1 text-center">
              Strefa Rywalizacji 🏆
            </motion.h1>

            {/* === KOMUNIKAT (Z LEWEJ) === */}
            <motion.div
              custom={-1} // -1 = Lewa strona
              variants={cardVariant}
              className="bg-white/40 backdrop-blur-sm p-4 rounded-xl border border-[#4E0113]/10 text-center shadow-sm w-full"
            >
               <div className="flex justify-center mb-2">
                  <GiftIcon className="w-6 h-6 text-[#4E0113]" />
               </div>
               <p className="text-[#4E0113] text-sm md:text-base leading-relaxed font-medium">
                  Włączcie ducha walki! 🔥 <br/>
                  Przygotowaliśmy dla was kilka ciekawych konkurencji!<br/>
                  Liczy się przede wszystkim dobra zabawa, ale jest też o co walczyć<br/>
                  W każdej konkurencji <strong>TOP 3 graczy</strong> zgarnia wyjątkowe nagrody, które wręczymy na weselu.
               </p>
            </motion.div>

            {/* === 1. QUIZ (Z PRAWEJ) === */}
            <motion.div
              custom={1} // 1 = Prawa strona
              variants={cardVariant}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full relative group"
            >
              <div
                onClick={handleQuizClick}
                className={`
                  relative w-full p-6 rounded-2xl shadow-xl border-2 flex items-center justify-between cursor-pointer transition-all overflow-hidden
                  ${isQuizUnlocked 
                    ? "bg-[#4E0113] border-[#FAD6C8] text-white hover:bg-[#6b1326]" 
                    : "bg-[#4E0113]/80 border-gray-400 text-gray-200 grayscale-[0.3]"
                  }
                `}
              >
                <div className="flex items-center gap-4 z-10">
                  <div className="p-3 bg-white/10 rounded-full">
                    {isAdmin ? <PlayCircleIcon className="w-8 h-8 text-[#FAD6C8]" /> :
                     isTester ? <BeakerIcon className="w-8 h-8 text-[#FAD6C8]" /> :
                     isQuizUnlocked ? <PlayCircleIcon className="w-8 h-8 text-[#FAD6C8]" /> :
                     <LockClosedIcon className="w-8 h-8 text-gray-400" />}
                  </div>
                  <div className="text-left">
                    <h2 className="text-2xl font-bold">Quiz</h2>
                    <p className="text-sm opacity-80">
                      {isAdmin ? "Panel Wodzireja" : isTester ? "Tryb Testowy" : "Sprawdź wiedzę o Parze Młodej"}
                    </p>
                  </div>
                </div>

                {!isQuizUnlocked && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 backdrop-blur-sm">
                    <p className="text-[#FAD6C8] font-bold text-lg px-4 text-center">
                      Quiz odbędzie się na weselu. 🔒
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
                  className="absolute -bottom-12 left-0 right-0 text-center z-30"
                >
                  <span className="bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                    Quiz jest zamknięty! ⏳
                  </span>
                </motion.div>
              )}
              </AnimatePresence>
            </motion.div>

            {/* === 2. TETRIS (Z LEWEJ) === */}
            <motion.div 
                custom={-1} // -1 = Lewa strona
                variants={cardVariant} 
                className="w-full"
            >
                <Link href="/rywalizacja/tetris" className="w-full">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-6 bg-[#841D30] border-2 border-[#4E0113] text-[#FAD6C8] rounded-2xl shadow-xl flex items-center gap-4 hover:bg-[#9E233A] transition-colors"
                >
                    <div className="p-3 bg-[#4E0113]/30 rounded-full">
                    <PuzzlePieceIcon className="w-8 h-8 text-[#FAD6C8]" />
                    </div>
                    <div className="text-left">
                    <h2 className="text-2xl font-bold">Tetris</h2>
                    <p className="text-sm opacity-80">Tetris... Po prostu tetris... Ale to rywalizacja z innymi uczestnikami ⚔</p>
                    </div>
                </motion.div>
                </Link>
            </motion.div>

            {/* === 3. ZAGADKA (Z PRAWEJ) === */}
            <motion.div 
                custom={1} // 1 = Prawa strona
                variants={cardVariant} 
                className="w-full"
            >
                <Link href="/rywalizacja/wyprawa" className="w-full">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-6 bg-[#FAD6C8] border-2 border-[#4E0113] text-[#4E0113] rounded-2xl shadow-xl flex items-center gap-4 hover:bg-[#ffc5af] transition-colors"
                >
                    <div className="p-3 bg-[#4E0113]/10 rounded-full">
                    <MagnifyingGlassIcon className="w-8 h-8 text-[#4E0113]" />
                    </div>
                    <div className="text-left">
                    <h2 className="text-2xl font-bold">Zagadka</h2>
                    <p className="text-sm opacity-80">Mniej zręczności, a więcej myślenia</p>
                    </div>
                </motion.div>
                </Link>
            </motion.div>

            {/* === 4. TURNIEJ II (Z LEWEJ) === */}
            <motion.div
               custom={-1} // -1 = Lewa strona
               variants={cardVariant}
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               onClick={handleTournamentClick}
               className="w-full relative group cursor-pointer"
            >
               <div className="w-full p-6 bg-gray-300 border-2 border-gray-400 text-gray-500 rounded-2xl shadow-md flex items-center gap-4 grayscale opacity-80">
                  <div className="p-3 bg-gray-400/20 rounded-full">
                     <LockClosedIcon className="w-8 h-8 text-gray-500" />
                  </div>
                  <div className="text-left">
                     <h2 className="text-2xl font-bold">Wielki Turniej - Edycja II</h2>
                     <p className="text-sm opacity-80">Dostępne po weselu</p>
                  </div>
               </div>
               
               <AnimatePresence>
               {showTournamentMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute -bottom-10 left-0 right-0 text-center z-30"
                >
                  <span className="bg-gray-800 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                    Wyniki pojawią się tutaj po weselu! 🤵👰
                  </span>
                </motion.div>
               )}
               </AnimatePresence>
            </motion.div>

          </motion.div>
        </PageWrapper>
      </div>
      <Footer />
    </>
  );
}