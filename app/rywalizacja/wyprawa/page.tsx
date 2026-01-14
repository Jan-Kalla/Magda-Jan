"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Navbar from "@/app/components/Navbar";
import { useGuest } from "@/app/context/GuestContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapIcon, 
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  FingerPrintIcon
} from "@heroicons/react/24/solid";
import confetti from "canvas-confetti";

// IMPORTY KOMPONENTÓW
import StageOnePuzzle from "./components/StageOnePuzzle"; // Ten działał, może zostać (jeśli ma export default)
import { StageTwoPuzzle } from "./components/StageTwoPuzzle"; // Dodajemy nawiasy { }
import { StageThreePuzzle } from "./components/StageThreePuzzle"; // Dodajemy nawiasy { }

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function WyprawaPage() {
  const { guest, loading } = useGuest();
  const isAdmin = guest?.code === "FC3818"; // Twój kod admina

  // Stan postępu gracza
  const [progress, setProgress] = useState({
    stage_1_solved: false,
    stage_2_solved: false,
    stage_3_solved: false,
    mistakes_count: 0 
  });
  
  // Stan globalny gry (blokady etapów)
  const [gameState, setGameState] = useState({
    stage_2_active: false,
    stage_3_active: false
  });

  const [isLoadingData, setIsLoadingData] = useState(true);

  // === 1. INICJALIZACJA DANYCH ===
  useEffect(() => {
    const fetchData = async () => {
      if (!guest) return;

      // A. Pobierz postęp gracza
      const { data: progressData } = await supabase.rpc('get_or_create_hunt_progress', {
        p_guest_id: guest.id
      });
      if (progressData) setProgress(progressData);

      // B. Pobierz stan gry (blokady) z tabeli quiz_state
      const { data: stateData } = await supabase.from('quiz_state').select('*').eq('id', 1).single();
      if (stateData) {
        setGameState({
          stage_2_active: stateData.wyprawa_stage_2_active,
          stage_3_active: stateData.wyprawa_stage_3_active
        });
      }
      
      setIsLoadingData(false);
    };

    fetchData();

    // === SUBSKRYPCJA REALTIME (Żeby odblokowywać etapy na żywo) ===
    const channel = supabase.channel('wyprawa_changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'quiz_state', filter: 'id=eq.1' }, 
      (payload) => {
        setGameState({
            stage_2_active: payload.new.wyprawa_stage_2_active,
            stage_3_active: payload.new.wyprawa_stage_3_active
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel) };
  }, [guest]);

  // === 2. OBSŁUGA BŁĘDÓW (WSPÓLNA) ===
  const handleMistake = async () => {
    if (!guest) return;
    if (typeof window !== 'undefined' && window.navigator?.vibrate) window.navigator.vibrate(200);

    await supabase.rpc('increment_hunt_mistake', { p_guest_id: guest.id });
    
    setProgress(prev => ({ ...prev, mistakes_count: (prev.mistakes_count || 0) + 1 }));
  };

  // === 3. OBSŁUGA SUKCESÓW (UNIWERSALNA) ===
  const handleSuccess = async (stageKey: "stage_1_solved" | "stage_2_solved" | "stage_3_solved") => {
    if (!guest) return;
    
    await supabase.from("honey_hunt_progress").update({ [stageKey]: true }).eq("guest_id", guest.id);
    
    setProgress(prev => ({ ...prev, [stageKey]: true }));
    confetti({ particleCount: 80, spread: 60 });
  };

  // === 4. PANEL ADMINA (STEROWANIE) ===
  const toggleStage = async (stage: "stage_2" | "stage_3", currentVal: boolean) => {
    const colName = stage === "stage_2" ? "wyprawa_stage_2_active" : "wyprawa_stage_3_active";
    await supabase.from('quiz_state').update({ [colName]: !currentVal }).eq('id', 1);
  };

  // Strażnik przed nullem
  if (loading || isLoadingData || !guest) return null;

  // Obliczamy logiczny etap
  let currentStage = 1;
  if (progress.stage_1_solved) currentStage = 2;
  if (progress.stage_2_solved) currentStage = 3;
  if (progress.stage_3_solved) currentStage = 4;

  // SPRAWDZAMY CZY ETAP JEST ZABLOKOWANY
  // Jeśli jesteś Adminem -> ignorujesz blokady
  // Jeśli nie -> sprawdzasz gameState
  const isStage2Locked = !isAdmin && !gameState.stage_2_active && currentStage === 2;
  const isStage3Locked = !isAdmin && !gameState.stage_3_active && currentStage === 3;

  return (
    <div className="min-h-screen bg-[#fff0e6] pt-[112px] pb-20 px-4 text-[#4E0113]">
      <Navbar />
      
      {/* Zachowałem Twój max-w-xl */}
      <div className="max-w-xl mx-auto">
        
        {/* === NAGŁÓWEK (Twój design) === */}
        <header className="text-center mb-6">
          <div className="inline-block p-4 bg-[#4E0113] rounded-full mb-4 shadow-lg">
            <MapIcon className="w-10 h-10 text-[#FAD6C8]" />
          </div>
          <h1 className="text-3xl font-bold mb-1">Tajemnicza Wyprawa</h1>

          {/* Ramka informacyjna */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-[#4E0113]/10 shadow-sm max-w-lg mx-auto"
          >
            <p className="text-lg text-[#4E0113] font-medium mb-4 leading-relaxed">
               Czy potraficie odkryć plan naszej<br/>
               <span className="font-bold text-xl">Podróży Poślubnej? 💍✈️</span>
            </p>
            
            <div className="text-sm text-[#4E0113]/90 bg-[#FAD6C8]/30 p-4 rounded-xl text-left inline-block">
               <p className="mb-2 font-bold text-center opacity-80 uppercase tracking-wider text-xs">Misja składa się z 3 części:</p>
               <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="bg-[#4E0113] text-[#FAD6C8] w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <span>Zgadnijcie, <strong>co</strong> będziemy robić</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-[#4E0113] text-[#FAD6C8] w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <span>Odkryjcie, <strong>gdzie</strong> jedziemy</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-[#4E0113] text-[#FAD6C8] w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <span>Ustalcie, <strong>ile</strong> to potrwa</span>
                  </li>
               </ul>
            </div>
          </motion.div>
          
          {/* Licznik błędów */}
          <div className="flex items-center justify-center gap-2 text-sm text-red-600 font-bold bg-white/80 py-2 px-4 rounded-full inline-flex border border-red-100 shadow-sm">
             <ExclamationTriangleIcon className="w-5 h-5" />
             Liczba pomyłek: {progress.mistakes_count || 0}
          </div>
        </header>

        {/* === PANEL ADMINA (WIDOCZNY TYLKO DLA CIEBIE) === */}
        {isAdmin && (
           <div className="mb-8 p-4 bg-gray-800 text-white rounded-xl shadow-xl border border-gray-600">
              <div className="flex items-center gap-2 mb-4 text-yellow-400 font-bold border-b border-gray-600 pb-2">
                  <FingerPrintIcon className="w-5 h-5" /> PANEL STEROWANIA (ADMIN)
              </div>
              <div className="flex gap-4">
                  <button 
                     onClick={() => toggleStage("stage_2", gameState.stage_2_active)}
                     className={`flex-1 py-2 px-4 rounded-lg font-bold transition text-sm md:text-base ${gameState.stage_2_active ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
                  >
                     Etap 2: {gameState.stage_2_active ? "OTWARTY" : "ZAMKNIĘTY"}
                  </button>
                  <button 
                     onClick={() => toggleStage("stage_3", gameState.stage_3_active)}
                     className={`flex-1 py-2 px-4 rounded-lg font-bold transition text-sm md:text-base ${gameState.stage_3_active ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
                  >
                     Etap 3: {gameState.stage_3_active ? "OTWARTY" : "ZAMKNIĘTY"}
                  </button>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">Zmiana jest widoczna natychmiast dla wszystkich gości.</p>
           </div>
        )}

        {/* === PASEK POSTĘPU === */}
        <div className="flex justify-between mb-8 px-4 relative max-w-sm mx-auto">
            <div className="absolute top-1/2 left-4 right-4 h-1 bg-[#4E0113]/10 -z-10" />
            {[1, 2, 3].map((step) => {
                const isCompleted = step < currentStage;
                const isActive = step === currentStage;
                return (
                    <div key={step} className={`
                        w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-500 border-2
                        ${isCompleted ? "bg-green-600 border-green-600 text-white" : 
                          isActive ? "bg-[#4E0113] border-[#4E0113] text-[#FAD6C8] scale-110 shadow-lg" : 
                          "bg-white border-gray-300 text-gray-400"}
                    `}>
                        {isCompleted ? <CheckBadgeIcon className="w-6 h-6" /> : step}
                    </div>
                )
            })}
        </div>

        {/* === KONTENER GRY === */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-[#4E0113]/10 relative overflow-hidden min-h-[400px]">
            <AnimatePresence mode="wait">

                {/* ETAP 1 - KOMPONENT */}
                {currentStage === 1 && (
                    <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <StageOnePuzzle 
                            guestId={guest.id}
                            onSuccess={() => handleSuccess("stage_1_solved")} 
                            onMistake={handleMistake} 
                        />
                    </motion.div>
                )}

                {/* ETAP 2 - KOMPONENT (JEŚLI ODBLOKOWANY) */}
                {currentStage === 2 && !isStage2Locked && (
                    <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <StageTwoPuzzle 
                            onSuccess={() => handleSuccess("stage_2_solved")} 
                            onMistake={handleMistake} 
                        />
                    </motion.div>
                )}

                {/* ETAP 3 - KOMPONENT (JEŚLI ODBLOKOWANY) */}
                {currentStage === 3 && !isStage3Locked && (
                    <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <StageThreePuzzle 
                            onSuccess={() => handleSuccess("stage_3_solved")} 
                            onMistake={handleMistake} 
                        />
                    </motion.div>
                )}

                {/* EKRAN BLOKADY (JEŚLI ETAP ZAMKNIĘTY) */}
                {(isStage2Locked || isStage3Locked) && (
                    <motion.div 
                        key="locked" 
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-10"
                    >
                        <div className="bg-gray-100 p-6 rounded-full inline-block mb-6">
                            <LockClosedIcon className="w-16 h-16 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-600 mb-2">
                            Etap Zablokowany
                        </h2>
                        <p className="text-gray-500 max-w-xs mx-auto mb-6">
                            Dalsza część wyprawy zostanie ujawniona na weselu. Wypatrujcie sygnału od Wodzireja lub Pary Młodej! 🤵👰
                        </p>
                        {/* Przycisk tylko dla Admina, żeby szybko otworzył panel powyżej */}
                        {isAdmin && (
                            <p className="text-xs text-green-600 font-bold uppercase tracking-widest mt-4">
                                Jesteś Adminem – użyj panelu na górze, aby odblokować.
                            </p>
                        )}
                    </motion.div>
                )}

                {/* KONIEC GRY */}
                {currentStage === 4 && (
                    <motion.div key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-5xl">🇫🇮</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-2 text-green-700">Gratulacje!</h2>
                        <p className="text-xl mb-6">
                            Odkryliście nasz plan! <br/>
                            <strong>14 dni na jachcie w Finlandii!</strong> ⛵️
                        </p>
                        <div className="bg-gray-50 p-4 rounded-xl inline-block border border-gray-200">
                            <p className="text-sm text-gray-500">
                                Liczba pomyłek: <span className="font-bold text-red-500 text-lg">{progress.mistakes_count}</span>
                            </p>
                            <p className="text-xs text-gray-400 mt-1">Im mniej, tym większa szansa na nagrodę!</p>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>

      </div>
    </div>
  );
}