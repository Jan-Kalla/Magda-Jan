"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Navbar from "@/app/components/Navbar";
import { useGuest } from "@/app/context/GuestContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapIcon, 
  GlobeEuropeAfricaIcon,
  CheckBadgeIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon // Ikona do błędów
} from "@heroicons/react/24/solid";
import confetti from "canvas-confetti";

// IMPORTUJEMY NOWY KOMPONENT ETAPU 1
import StageOnePuzzle from "./components/StageOnePuzzle";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function WyprawaPage() {
  const { guest, loading } = useGuest();
  
  // Stan postępu
  const [progress, setProgress] = useState({
    stage_1_solved: false,
    stage_2_solved: false,
    stage_3_solved: false,
    mistakes_count: 0 // Dodajemy licznik błędów
  });
  
  const [inputVal, setInputVal] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // 1. Pobieranie postępu z bazy
  useEffect(() => {
    const fetchProgress = async () => {
      if (!guest) return;
      
      // Używamy funkcji SQL, która zwraca też mistakes_count
      const { data } = await supabase.rpc('get_or_create_hunt_progress', {
        p_guest_id: guest.id
      });
      
      if (data) {
        setProgress(data);
      }
      setIsLoadingData(false);
    };

    fetchProgress();
  }, [guest]);

  // 2. Efekt konfetti przy finale
  useEffect(() => {
    if (progress.stage_3_solved) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFFFFF', '#003580', '#FAD6C8']
      });
    }
  }, [progress.stage_3_solved]);

  // 3. Obsługa błędu (wspólna dla wszystkich etapów)
  const handleMistake = async () => {
    if (!guest) return;
    
    // Wibracja telefonu (jeśli obsługiwana)
    if (typeof window !== 'undefined' && window.navigator?.vibrate) {
        window.navigator.vibrate(200);
    }

    // Zapis w bazie
    await supabase.rpc('increment_hunt_mistake', { p_guest_id: guest.id });
    
    // Aktualizacja lokalna
    setProgress(prev => ({ 
        ...prev, 
        mistakes_count: (prev.mistakes_count || 0) + 1 
    }));
  };

  // 4. Sukces Etapu 1 (wywoływany przez komponent dziecka)
  const handleStage1Success = async () => {
    if (!guest) return;
    
    await supabase
        .from("honey_hunt_progress")
        .update({ stage_1_solved: true })
        .eq("guest_id", guest.id);
    
    setProgress(prev => ({ ...prev, stage_1_solved: true }));
    confetti({ particleCount: 50, spread: 50 });
  };

  // 5. Sprawdzanie Etapów 2 i 3 (Input tekstowy)
  const checkStage2Or3 = async () => {
    if (!guest) return;
    setIsChecking(true);
    setErrorMsg("");

    const answer = inputVal.trim().toLowerCase();
    let success = false;
    let stageToUpdate = "";

    // LOGIKA ETAPU 2 (FINLANDIA)
    if (!progress.stage_2_solved) {
      const validAnswers = ["finlandia", "finlandii", "suomi", "helsinki", "laponia"];
      if (validAnswers.some(v => answer.includes(v))) {
        success = true;
        stageToUpdate = "stage_2_solved";
      } else {
        setErrorMsg("Nie ten kraj. Szukaj wódki na barze... 🍸");
        handleMistake();
      }
    } 
    // LOGIKA ETAPU 3 (LICZBA DNI)
    else if (!progress.stage_3_solved) {
      const correctNumber = "14"; 
      const correctWords = ["czternaście", "czternascie"];

      if (answer.includes(correctNumber) || correctWords.includes(answer)) {
        success = true;
        stageToUpdate = "stage_3_solved";
      } else {
        setErrorMsg("Blisko, ale to nie tyle dni. Spróbuj innej liczby! 📅");
        handleMistake();
      }
    }

    if (success) {
      await supabase
        .from("honey_hunt_progress")
        .update({ [stageToUpdate]: true })
        .eq("guest_id", guest.id);
      
      setProgress(prev => ({ ...prev, [stageToUpdate]: true }));
      setInputVal("");
      confetti({ particleCount: 50, spread: 50 });
    }
    
    setIsChecking(false);
  };

  if (loading || isLoadingData) return null;

  // Obliczanie aktualnego etapu (1, 2, 3, 4 - koniec)
  let currentStage = 1;
  if (progress.stage_1_solved) currentStage = 2;
  if (progress.stage_2_solved) currentStage = 3;
  if (progress.stage_3_solved) currentStage = 4;

  return (
    <div className="min-h-screen bg-[#fff0e6] pt-[112px] pb-20 px-4 text-[#4E0113]">
      <Navbar />
      
      <div className="max-w-md mx-auto">
        <header className="text-center mb-6">
          <div className="inline-block p-4 bg-[#4E0113] rounded-full mb-4 shadow-lg">
            <MapIcon className="w-10 h-10 text-[#FAD6C8]" />
          </div>
          <h1 className="text-3xl font-bold mb-1">Tajemnicza Wyprawa</h1>
          
          {/* LICZNIK BŁĘDÓW */}
          <div className="flex items-center justify-center gap-2 text-sm text-red-600 font-bold bg-red-50 py-1 px-3 rounded-full inline-flex mt-2 border border-red-100">
             <ExclamationTriangleIcon className="w-4 h-4" />
             Błędy: {progress.mistakes_count || 0}
          </div>
        </header>

        {/* === POSTĘP PASKOWY === */}
        <div className="flex justify-between mb-8 px-4 relative">
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

        {/* === ZAWARTOŚĆ ETAPÓW === */}
        <div className="bg-white p-8 md:p-8 rounded-3xl shadow-xl border border-[#4E0113]/10 relative overflow-hidden">
            
            <AnimatePresence mode="wait">
                
                {/* ETAP 1: KOMPONENT PUZZLI */}
                {currentStage === 1 && (
                    <motion.div key="stage1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <StageOnePuzzle 
                            onSuccess={handleStage1Success} 
                            onMistake={handleMistake} 
                        />
                    </motion.div>
                )}

                {/* ETAP 2: GDZIE? */}
                {currentStage === 2 && (
                    <motion.div 
                        key="stage2"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        className="text-center"
                    >
                        <GlobeEuropeAfricaIcon className="w-16 h-16 mx-auto text-blue-800 mb-4 opacity-80" />
                        <h2 className="text-2xl font-bold mb-2">Zagadka #2</h2>
                        <p className="text-lg mb-6 italic">
                            "Kraina tysiąca jezior, Muminków i Świętego Mikołaja."
                        </p>
                        <div className="bg-yellow-100 p-3 rounded-xl text-sm text-yellow-800 mb-6">
                            💡 Wskazówka: Odpowiedź znajdziesz na butelce przy barze!
                        </div>
                        <p className="text-sm font-bold text-[#4E0113]/60 uppercase tracking-widest mb-4">Gdzie jedziemy?</p>
                    </motion.div>
                )}

                {/* ETAP 3: ILE DNI? */}
                {currentStage === 3 && (
                    <motion.div 
                        key="stage3"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        className="text-center"
                    >
                        <CalendarDaysIcon className="w-16 h-16 mx-auto text-[#4E0113] mb-4 opacity-80" />
                        <h2 className="text-2xl font-bold mb-2">Finał: Czas Wyprawy</h2>
                        <p className="text-lg mb-6 italic">
                            "Szczęśliwi czasu nie liczą, ale my musimy kupić bilety powrotne..."
                        </p>
                        <div className="bg-red-100 p-3 rounded-xl text-sm text-red-800 mb-6">
                            📅 Zgadnijcie (lub poszukajcie wskazówki na sali), na ile dni znikamy po weselu!
                        </div>
                        <p className="text-sm font-bold text-[#4E0113]/60 uppercase tracking-widest mb-4">Liczba dni naszej podróży?</p>
                    </motion.div>
                )}

                {/* KONIEC */}
                {currentStage === 4 && (
                    <motion.div 
                        key="done"
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-5xl">🇫🇮</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-2 text-green-700">Gratulacje!</h2>
                        <p className="text-xl mb-6">
                            Odkryliście nasz plan! <br/>
                            <strong>14 dni na jachcie w Finlandii!</strong> ⛵️
                        </p>
                        <div className="bg-gray-100 p-4 rounded-xl">
                            <p className="text-sm text-gray-500">Twoje pomyłki: <span className="font-bold text-red-500">{progress.mistakes_count}</span></p>
                            <p className="text-xs text-gray-400 mt-1">Im mniej, tym większa szansa na nagrodę!</p>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>

            {/* INPUT TEKSTOWY (Widoczny TYLKO dla Etapu 2 i 3) */}
            {currentStage > 1 && currentStage < 4 && (
                <div className="mt-4">
                    <input
                        type="text"
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        placeholder={currentStage === 3 ? "Wpisz liczbę dni..." : "Wpisz odpowiedź..."}
                        className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-[#4E0113] focus:outline-none text-center text-lg font-bold bg-gray-50 mb-4"
                        onKeyDown={(e) => e.key === 'Enter' && checkStage2Or3()}
                    />
                    
                    {errorMsg && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 font-bold text-center mb-4">
                            {errorMsg}
                        </motion.p>
                    )}

                    <button
                        onClick={checkStage2Or3}
                        disabled={!inputVal || isChecking}
                        className="w-full bg-[#4E0113] text-[#FAD6C8] py-4 rounded-xl font-bold text-xl shadow-lg hover:bg-[#6b1326] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isChecking ? "Sprawdzanie..." : "Sprawdź!"}
                    </button>
                </div>
            )}
        </div>

      </div>
    </div>
  );
}