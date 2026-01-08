"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Navbar from "@/app/components/Navbar";
import { useGuest } from "@/app/context/GuestContext";
import { motion } from "framer-motion";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

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
  const { guest } = useGuest();
  const [gameState, setGameState] = useState("idle");
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [submittedIndex, setSubmittedIndex] = useState<number | null>(null);
  const [result, setResult] = useState<{ score: number; correct: boolean } | null>(null);
  
  useEffect(() => {
    // 1. Pobierz stan początkowy
    const fetchState = async () => {
      const { data: state } = await supabase.from("quiz_state").select("*").single();
      if (state) {
        handleStateChange(state);
      }
    };
    fetchState();

    // 2. Subskrypcja zmian
    const channel = supabase
      .channel("quiz_game_sync")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "quiz_state", filter: "id=eq.1" },
        (payload) => {
          handleStateChange(payload.new);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleStateChange = async (state: any) => {
    setGameState(state.status);
    
    if (state.status === "question" && state.current_question_id) {
        setSubmittedIndex(null);
        setResult(null);
        
        const { data: q } = await supabase
            .from("quiz_questions")
            .select("*")
            .eq("id", state.current_question_id)
            .single();
        setCurrentQuestion(q);
    }
  };

  const submitAnswer = async (index: number) => {
    if (submittedIndex !== null || !guest || !currentQuestion) return;
    setSubmittedIndex(index);

    const { data, error } = await supabase.rpc("submit_quiz_answer", {
        p_question_id: currentQuestion.id,
        p_answer_index: index,
        p_guest_id: guest.id
    });

    if (data) {
        setResult(data);
    } else {
        console.error(error);
    }
  };

  const colors = ["bg-red-500", "bg-blue-500", "bg-yellow-500", "bg-green-500"];
  const icons = ["▲", "◆", "●", "■"];

  return (
    <div className="min-h-screen bg-[#FAD6C8] pt-[80px] md:pt-[112px] flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-lg mx-auto w-full">
        
        {/* EKRAN OCZEKIWANIA */}
        {gameState === "idle" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                <h1 className="text-4xl font-bold text-[#4E0113] mb-4">Wielki Quiz</h1>
                <p className="text-xl text-[#4E0113]/80">Słuchaj Wodzireja!</p>
                <p className="text-lg mt-2">Czekaj na uruchomienie pytania...</p>
                <div className="mt-8 animate-spin text-4xl">⏳</div>
            </motion.div>
        )}

        {/* EKRAN PYTANIA - Pytanie wyświetlane na górze */}
        {gameState === "question" && currentQuestion && (
            <div className="w-full h-full flex flex-col">
                <div className="bg-white p-6 rounded-2xl shadow-xl mb-6 text-center border-2 border-[#4E0113]/10">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#4E0113] leading-snug">
                        {currentQuestion.question_text}
                    </h2>
                </div>

                <div className="grid grid-cols-2 gap-4 flex-1">
                    {currentQuestion.answers.map((ans, idx) => (
                        <button
                            key={idx}
                            onClick={() => submitAnswer(idx)}
                            disabled={submittedIndex !== null}
                            className={`
                                ${colors[idx % 4]} rounded-xl shadow-lg p-4 flex flex-col items-center justify-center text-white transition-all
                                ${submittedIndex === null ? 'hover:scale-105 active:scale-95' : 'opacity-50 grayscale'}
                                ${submittedIndex === idx ? '!opacity-100 !grayscale-0 ring-4 ring-[#4E0113] scale-105' : ''}
                            `}
                        >
                            <span className="text-4xl mb-2">{icons[idx % 4]}</span>
                            <span className="font-bold text-lg leading-tight">{ans.label}</span>
                        </button>
                    ))}
                </div>
                
                {submittedIndex !== null && (
                    <div className="mt-6 text-center text-[#4E0113] font-bold animate-pulse">
                        Odpowiedź zapisana! Czekaj na wynik...
                    </div>
                )}
            </div>
        )}

        {/* EKRAN WYNIKÓW (pojedyncze pytanie) */}
        {gameState === "results" && result && (
             <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`p-8 rounded-2xl shadow-2xl text-center text-white w-full ${result.correct ? 'bg-green-600' : 'bg-red-600'}`}
             >
                {result.correct ? (
                    <>
                        <CheckCircleIcon className="w-20 h-20 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold mb-2">Brawo!</h2>
                        <p className="text-5xl font-black">+{result.score} pkt</p>
                    </>
                ) : (
                    <>
                        <XCircleIcon className="w-20 h-20 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold">Pudło...</h2>
                        <p className="mt-2 opacity-80">Następnym razem!</p>
                    </>
                )}
             </motion.div>
        )}
        
        {/* EKRAN WYNIKÓW (brak odpowiedzi) */}
        {gameState === "results" && !result && (
             <div className="text-center text-[#4E0113]">
                <h2 className="text-3xl font-bold mb-2">Czas minął! 🐢</h2>
                <p>Musisz szybciej klikać.</p>
             </div>
        )}

        {gameState === "finished" && (
             <div className="text-center">
                <h1 className="text-4xl font-bold text-[#4E0113] mb-4">Koniec Quizu! 🏆</h1>
                <p>Dzięki za wspólną zabawę!</p>
             </div>
        )}

      </div>
    </div>
  );
}