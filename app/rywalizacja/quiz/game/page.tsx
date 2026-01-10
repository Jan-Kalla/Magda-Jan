"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import Navbar from "@/app/components/Navbar";
import { useGuest } from "@/app/context/GuestContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon, 
  TrophyIcon 
} from "@heroicons/react/24/solid";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Question = {
  id: number;
  question_text: string;
  answers: { label: string; isCorrect: boolean }[];
  time_limit_seconds: number;
};

export default function GamePage() {
  const { guest, loading } = useGuest();
  
  // Stan Gry
  const [gameState, setGameState] = useState("idle");
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<string | null>(null);
  
  // Stan Gracza
  const [submittedIndex, setSubmittedIndex] = useState<number | null>(null);
  const [result, setResult] = useState<{ score: number; correct: boolean } | null>(null);
  
  // Timer
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [progress, setProgress] = useState<number>(100);

  // --- 1. INICJALIZACJA I NASŁUCHIWANIE ---
  useEffect(() => {
    // Funkcja do aktualizacji stanu na podstawie danych z bazy
    const syncState = async (stateData: any) => {
      setGameState(stateData.status);
      setQuestionStartTime(stateData.question_start_time);

      // Jeśli zmieniło się pytanie (lub weszliśmy w trakcie pytania)
      if (stateData.current_question_id) {
        // Sprawdź, czy mamy to pytanie załadowane, jeśli nie - pobierz
        // Używamy funkcji updatera w setCurrentQuestion, żeby uniknąć pętli,
        // ale tutaj prościej pobrać i porównać ID.
        const { data: q } = await supabase
            .from("quiz_questions")
            .select("*")
            .eq("id", stateData.current_question_id)
            .single();
            
        if (q) {
            setCurrentQuestion((prev) => {
                // Resetuj stan gracza TYLKO jeśli to faktycznie nowe pytanie
                if (prev?.id !== q.id) {
                    setSubmittedIndex(null);
                    setResult(null);
                }
                return q;
            });
        }
      }
    };

    // Pobierz stan początkowy
    const fetchInitialState = async () => {
      const { data } = await supabase.from("quiz_state").select("*").single();
      if (data) await syncState(data);
    };
    fetchInitialState();

    // Subskrypcja Realtime
    const channel = supabase
      .channel("quiz_game_sync")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "quiz_state", filter: "id=eq.1" },
        (payload) => {
          syncState(payload.new);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // --- 2. LOGIKA TIMERA ---
  useEffect(() => {
    if (gameState === 'question' && questionStartTime && currentQuestion) {
        const startTime = new Date(questionStartTime).getTime();
        const durationMs = currentQuestion.time_limit_seconds * 1000;
        
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const elapsed = now - startTime;
            const remaining = Math.max(0, durationMs - elapsed);
            
            // Aktualizacja UI
            setTimeLeft(Math.ceil(remaining / 1000));
            setProgress((remaining / durationMs) * 100);

            if (remaining <= 0) {
                clearInterval(interval);
            }
        }, 100); // Odświeżanie co 100ms dla płynnego paska

        return () => clearInterval(interval);
    } else {
        // Reset timera w innych stanach
        setTimeLeft(0);
        setProgress(0);
    }
  }, [gameState, questionStartTime, currentQuestion]);


  // --- 3. PRZYWRACANIE ODPOWIEDZI (Gdy odświeżysz stronę) ---
  useEffect(() => {
    const restoreAnswer = async () => {
        if (!guest || !currentQuestion) return;

        // Sprawdź czy użytkownik już odpowiedział na to pytanie
        const { data } = await supabase
            .from("quiz_responses")
            .select("answer_index, score")
            .eq("guest_id", guest.id)
            .eq("question_id", currentQuestion.id)
            .maybeSingle();

        if (data) {
            setSubmittedIndex(data.answer_index);
            // Jeśli gra jest w fazie wyników, pokaż wynik od razu. 
            // Jeśli trwa pytanie, tylko zaznacz, że odpowiedział.
            if (gameState === 'results') {
                // Musimy wiedzieć czy poprawna, żeby wyświetlić kolor
                // Pobieramy to z definicji pytania (mamy je w currentQuestion)
                const isCorrect = currentQuestion.answers[data.answer_index].isCorrect;
                setResult({ score: data.score, correct: isCorrect });
            }
        }
    };

    if (currentQuestion && guest) {
        restoreAnswer();
    }
  }, [currentQuestion, guest, gameState]); // Zależność od gameState ważna, żeby pokazać wynik po przejściu w 'results'


  // --- 4. WYSYŁANIE ODPOWIEDZI ---
  const submitAnswer = async (index: number) => {
    // Blokada: jeśli już wysłał, brak gościa, brak pytania, lub czas minął
    if (submittedIndex !== null || !guest || !currentQuestion || timeLeft <= 0) return;
    
    // Optymistyczna blokada UI
    setSubmittedIndex(index);

    const { data, error } = await supabase.rpc("submit_quiz_answer", {
        p_question_id: currentQuestion.id,
        p_answer_index: index,
        p_guest_id: guest.id
    });

    if (data) {
        // Data to: { score: 123, correct: true } - ale na razie tego nie pokazujemy (dopiero w results)
        // Możemy to zapisać w stanie, żeby użyć później
        // setResult(data); <--- To odkomentuj, jeśli chcesz pokazać wynik OD RAZU po kliknięciu
        
        // Zapisujemy "na przyszłość" do wyświetlenia w fazie results
        // (Ale useEffect wyżej i tak to obsłuży przy zmianie stanu)
    } else {
        console.error("Błąd wysyłania odpowiedzi:", error);
        // W razie błędu odblokuj (opcjonalne)
        setSubmittedIndex(null); 
    }
  };


  const colors = ["bg-red-500", "bg-blue-500", "bg-yellow-500", "bg-green-500"];
  const icons = ["▲", "◆", "●", "■"];

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#FAD6C8] pt-[80px] md:pt-[112px] flex flex-col overflow-hidden">
      <Navbar />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-lg mx-auto w-full relative">
        
        {/* === EKRAN OCZEKIWANIA (IDLE) === */}
        <AnimatePresence>
        {gameState === "idle" && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center bg-white/50 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-[#4E0113]/10"
            >
                <div className="w-20 h-20 bg-[#4E0113] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <TrophyIcon className="w-10 h-10 text-[#FAD6C8]" />
                </div>
                <h1 className="text-3xl font-bold text-[#4E0113] mb-2">Wielki Quiz</h1>
                <p className="text-lg text-[#4E0113]/80 mb-6">Spójrz na Wodzireja!</p>
                
                <div className="flex items-center justify-center gap-3 bg-white/60 py-3 px-6 rounded-full inline-flex">
                    <div className="animate-spin text-2xl">⏳</div>
                    <span className="font-semibold text-[#4E0113]">Czekamy na pytanie...</span>
                </div>
            </motion.div>
        )}
        </AnimatePresence>

        {/* === EKRAN PYTANIA (QUESTION) === */}
        {gameState === "question" && currentQuestion && (
            <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full h-full flex flex-col"
            >
                {/* Timer Bar */}
                <div className="w-full h-4 bg-gray-300 rounded-full mb-6 overflow-hidden border border-[#4E0113]/20 relative">
                    <motion.div 
                        className="h-full bg-[#4E0113]"
                        style={{ width: `${progress}%` }}
                        // Płynna animacja paska
                        transition={{ ease: "linear", duration: 0.1 }} 
                    />
                </div>

                {/* Treść Pytania */}
                <div className="bg-white p-6 rounded-2xl shadow-xl mb-6 text-center border-2 border-[#4E0113]/10 relative overflow-hidden">
                    <div className="absolute top-2 right-3 flex items-center gap-1 text-[#4E0113]/50 font-bold font-mono">
                        <ClockIcon className="w-4 h-4" />
                        <span>{timeLeft}s</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-[#4E0113] leading-snug mt-2">
                        {currentQuestion.question_text}
                    </h2>
                </div>

                {/* Przyciski Odpowiedzi */}
                <div className="grid grid-cols-2 gap-4 flex-1 min-h-[300px]">
                    {currentQuestion.answers.map((ans, idx) => {
                        const isSelected = submittedIndex === idx;
                        const isDisabled = submittedIndex !== null || timeLeft <= 0;

                        return (
                            <button
                                key={idx}
                                onClick={() => submitAnswer(idx)}
                                disabled={isDisabled}
                                className={`
                                    ${colors[idx % 4]} rounded-xl shadow-lg p-4 flex flex-col items-center justify-center text-white transition-all transform duration-200 relative overflow-hidden
                                    ${isDisabled && !isSelected ? 'opacity-40 grayscale scale-95' : 'hover:scale-105 active:scale-95'}
                                    ${isSelected ? '!opacity-100 !grayscale-0 ring-4 ring-[#4E0113] scale-100 z-10' : ''}
                                `}
                            >
                                {/* Ikona w tle */}
                                <span className="absolute -bottom-4 -right-4 text-8xl opacity-20 pointer-events-none">
                                    {icons[idx % 4]}
                                </span>
                                
                                <span className="text-4xl mb-2 drop-shadow-md">{icons[idx % 4]}</span>
                                <span className="font-bold text-lg leading-tight drop-shadow-sm">{ans.label}</span>
                                
                                {isSelected && (
                                    <motion.div 
                                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                                        className="absolute top-2 right-2 bg-white text-[#4E0113] rounded-full p-1"
                                    >
                                        <CheckCircleIcon className="w-5 h-5" />
                                    </motion.div>
                                )}
                            </button>
                        );
                    })}
                </div>
                
                {/* Status po odpowiedzi */}
                <div className="h-12 flex items-center justify-center mt-4">
                    {submittedIndex !== null ? (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className="text-[#4E0113] font-bold bg-white/60 px-6 py-2 rounded-full backdrop-blur-sm shadow-sm"
                        >
                            Odpowiedź zapisana! Czekaj na wynik... 🤞
                        </motion.div>
                    ) : timeLeft <= 0 ? (
                        <div className="text-red-600 font-bold bg-white/80 px-6 py-2 rounded-full">
                            Czas minął! 🐢
                        </div>
                    ) : null}
                </div>
            </motion.div>
        )}

        {/* === EKRAN WYNIKÓW (RESULTS) === */}
        <AnimatePresence>
        {gameState === "results" && (
             <motion.div 
                key="results"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`p-8 rounded-3xl shadow-2xl text-center text-white w-full max-w-sm relative overflow-hidden
                    ${result?.correct ? 'bg-gradient-to-br from-green-500 to-green-700' : 'bg-gradient-to-br from-red-500 to-red-700'}
                    ${!result && 'bg-gradient-to-br from-gray-500 to-gray-700'}
                `}
             >
                {/* Dekoracja tła */}
                <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-50" style={{ backgroundImage: 'radial-gradient(circle, transparent 20%, #000 20%)', backgroundSize: '20px 20px' }}></div>

                <div className="relative z-10">
                    {result ? (
                        result.correct ? (
                            <>
                                <CheckCircleIcon className="w-24 h-24 mx-auto mb-6 drop-shadow-lg text-green-200" />
                                <h2 className="text-3xl font-bold mb-2">Brawo! 🎉</h2>
                                <p className="text-lg opacity-90 mb-4">Dobra odpowiedź</p>
                                <div className="bg-white/20 rounded-xl p-4 border border-white/30 backdrop-blur-md">
                                    <p className="text-sm uppercase font-bold opacity-80 mb-1">Zdobyte Punkty</p>
                                    <p className="text-6xl font-black tracking-tighter">+{result.score}</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <XCircleIcon className="w-24 h-24 mx-auto mb-6 drop-shadow-lg text-red-200" />
                                <h2 className="text-3xl font-bold">Pudło... 😢</h2>
                                <p className="mt-2 opacity-90 text-lg">Niestety, to nie to.</p>
                                <div className="mt-6 bg-white/10 rounded-lg p-3">
                                    <p className="text-sm">Nie martw się, następnym razem!</p>
                                </div>
                            </>
                        )
                    ) : (
                        <>
                            <ClockIcon className="w-24 h-24 mx-auto mb-6 text-gray-300" />
                            <h2 className="text-2xl font-bold mb-2">Czas minął!</h2>
                            <p className="opacity-80">Nie udzieliłeś odpowiedzi.</p>
                        </>
                    )}
                </div>
             </motion.div>
        )}
        </AnimatePresence>

        {/* === EKRAN KOŃCOWY (FINISHED) === */}
        {gameState === "finished" && (
             <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center bg-white/60 p-10 rounded-3xl shadow-xl backdrop-blur-md"
             >
                <h1 className="text-4xl font-bold text-[#4E0113] mb-4">Koniec Quizu! 🏆</h1>
                <p className="text-lg text-[#4E0113]/80">Dziękujemy za wspólną zabawę.</p>
                <p className="mt-4 font-semibold">Spójrz na Wodzireja, by poznać zwycięzców!</p>
             </motion.div>
        )}

      </div>
    </div>
  );
}