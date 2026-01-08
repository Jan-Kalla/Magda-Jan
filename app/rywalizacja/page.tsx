"use client";

import Navbar from "@/app/components/Navbar";
import Link from "next/link";
import { useGuest } from "@/app/context/GuestContext";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { LockClosedIcon, PlayCircleIcon, PuzzlePieceIcon, BeakerIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Lokalna inicjalizacja klienta
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CompetitionPage() {
  const { guest } = useGuest();
  const router = useRouter();
  const [showLockedMessage, setShowLockedMessage] = useState(false);
  const [isQuizActive, setIsQuizActive] = useState(false);

  // --- UPRAWNIENIA ---
  const isAdmin = guest?.code === "FC3818";
  const isTester = guest?.code === "8DD06D"; // Gość specjalny

  useEffect(() => {
    // Sprawdzamy status quizu w bazie
    const checkStatus = async () => {
        const { data } = await supabase.from('quiz_state').select('status').single();
        if (data && data.status !== 'idle' && data.status !== 'finished') {
            setIsQuizActive(true);
        }
    };
    checkStatus();
    
    // Realtime: nasłuchiwanie na odblokowanie przez Pana Młodego
    const channel = supabase.channel('menu_quiz_status')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'quiz_state', filter: 'id=eq.1' }, 
        (payload) => {
            const status = payload.new.status;
            // Quiz jest aktywny, jeśli nie jest w stanie spoczynku ani zakończony
            setIsQuizActive(status !== 'idle' && status !== 'finished');
        })
        .subscribe();
        
    return () => { supabase.removeChannel(channel) };
  }, []);

  const handleQuizClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isAdmin) {
      router.push("/rywalizacja/quiz"); // Admin -> Panel
    } else if (isTester || isQuizActive) {
      router.push("/rywalizacja/quiz/game"); // Tester LUB Aktywny Quiz -> Gra
    } else {
      // Zablokowane dla reszty
      setShowLockedMessage(true);
      setTimeout(() => setShowLockedMessage(false), 2000);
    }
  };

  // Warunek, czy pokazać kłódkę czy przycisk play
  // Admin i Tester zawsze widzą "otwarte". Reszta widzi otwarte tylko gdy isQuizActive.
  const isUnlocked = isAdmin || isTester || isQuizActive;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-[#FAD6C8] to-[#4E0113] pt-[112px] px-4 pb-20">
        <div className="max-w-md mx-auto flex flex-col items-center justify-center min-h-[60vh] gap-8">
          
          <h1 className="text-3xl md:text-4xl font-bold text-[#4E0113] mb-4 text-center">
            Strefa Rywalizacji 🏆
          </h1>

          {/* === KAFELEK 1: QUIZ === */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full relative group"
          >
            <div
              onClick={handleQuizClick}
              className={`
                relative w-full p-6 rounded-2xl shadow-xl border-2 flex items-center justify-between cursor-pointer transition-all overflow-hidden
                ${isUnlocked 
                  ? "bg-[#4E0113] border-[#FAD6C8] text-white hover:bg-[#6b1326]" 
                  : "bg-[#4E0113]/80 border-gray-400 text-gray-200 grayscale-[0.3]"
                }
              `}
            >
              <div className="flex items-center gap-4 z-10">
                <div className="p-3 bg-white/10 rounded-full">
                  {isAdmin ? (
                    <PlayCircleIcon className="w-8 h-8 text-[#FAD6C8]" />
                  ) : isTester ? (
                    <BeakerIcon className="w-8 h-8 text-[#FAD6C8]" /> 
                  ) : isUnlocked ? (
                    <PlayCircleIcon className="w-8 h-8 text-[#FAD6C8]" />
                  ) : (
                    <LockClosedIcon className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div className="text-left">
                  <h2 className="text-2xl font-bold">Wielki Quiz</h2>
                  <p className="text-sm opacity-80">
                    {isAdmin ? "Panel Administratora" : isTester ? "Tryb Testowy" : "Sprawdź wiedzę o Parze Młodej"}
                  </p>
                </div>
              </div>

              {/* Efekt tła dla zablokowanych */}
              {!isUnlocked && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 backdrop-blur-sm">
                  <p className="text-[#FAD6C8] font-bold text-lg px-4 text-center">
                    Czekaj na sygnał Wodzireja 🔒
                  </p>
                </div>
              )}
            </div>

            {/* Komunikat zablokowania */}
            {showLockedMessage && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute -bottom-12 left-0 right-0 text-center"
              >
                <span className="bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                  Quiz jeszcze nie wystartował! ⏳
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* === KAFELEK 2: TETRIS === */}
          <Link href="/rywalizacja/tetris" className="w-full">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-6 bg-[#FAD6C8] border-2 border-[#4E0113] text-[#4E0113] rounded-2xl shadow-xl flex items-center gap-4 hover:bg-[#ffc5af] transition-colors"
            >
              <div className="p-3 bg-[#4E0113]/10 rounded-full">
                <PuzzlePieceIcon className="w-8 h-8 text-[#4E0113]" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-bold">Tetris</h2>
                <p className="text-sm opacity-80">Graj i bij rekordy w wolnej chwili</p>
              </div>
            </motion.div>
          </Link>

        </div>
      </div>
    </>
  );
}