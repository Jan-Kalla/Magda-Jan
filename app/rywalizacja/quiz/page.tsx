"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Navbar from "@/app/components/Navbar";
import { useGuest } from "@/app/context/GuestContext";
import { useRouter } from "next/navigation";
import { 
  PlayCircleIcon, 
  StopCircleIcon, 
  ChartBarIcon, 
  ArrowRightCircleIcon, 
  CheckCircleIcon 
} from "@heroicons/react/24/solid";

// Inicjalizacja Supabase
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

export default function AdminQuizPage() {
  const { guest, loading } = useGuest();
  const router = useRouter();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0); // Domyślnie pierwsze pytanie
  const [gameState, setGameState] = useState<string>("idle");
  const [answersCount, setAnswersCount] = useState(0);

  // 1. Zabezpieczenie (tylko dla Pana Młodego)
  useEffect(() => {
    if (!loading && guest?.code !== "FC3818") {
      router.push("/rywalizacja");
    }
  }, [guest, loading, router]);

  // 2. Pobranie pytań i aktualnego stanu
  useEffect(() => {
    const initData = async () => {
      // Pytania
      const { data: qData } = await supabase.from("quiz_questions").select("*").order("id");
      if (qData) setQuestions(qData);

      // Stan gry (żebyś wiedział gdzie jesteś po odświeżeniu strony)
      const { data: sData } = await supabase.from("quiz_state").select("*").single();
      if (sData) {
        setGameState(sData.status);
        // Jeśli gra trwa, znajdź index aktywnego pytania
        if (sData.current_question_id && qData) {
          const idx = qData.findIndex((q) => q.id === sData.current_question_id);
          if (idx !== -1) setCurrentQIndex(idx);
        }
      }
    };
    initData();
  }, []);

  // 3. Licznik odpowiedzi na żywo
  useEffect(() => {
    const channel = supabase
      .channel("quiz_responses_count")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "quiz_responses" },
        () => {
          setAnswersCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // --- FUNKCJE STERUJĄCE ---

  const updateState = async (status: string, questionId?: number) => {
    const payload: any = { status };
    if (questionId !== undefined) {
        payload.current_question_id = questionId;
        if (status === 'question') {
            setAnswersCount(0); // Reset licznika przy nowym pytaniu
            payload.question_start_time = new Date().toISOString();
        }
    }
    
    // Optymistyczna aktualizacja UI
    setGameState(status);
    await supabase.from("quiz_state").update(payload).eq("id", 1);
  };

  const handleStartQuestion = async () => {
    if (!questions[currentQIndex]) return;
    await updateState("question", questions[currentQIndex].id);
  };

  const handleShowResults = async () => {
    await updateState("results");
  };

  const handleNextQuestion = async () => {
    if (currentQIndex + 1 < questions.length) {
      const nextIndex = currentQIndex + 1;
      setCurrentQIndex(nextIndex);
      // Automatycznie startujemy kolejne pytanie? 
      // Lepiej ustawić stan 'idle' dla nowego pytania, żebyś mógł je przeczytać zanim puścisz czas.
      // Ale jeśli chcesz płynnie:
      await updateState("question", questions[nextIndex].id);
    } else {
      await updateState("finished");
    }
  };

  const handleFinishQuiz = async () => {
    await updateState("finished");
  };

  if (loading || !guest) return null;

  const currentQ = questions[currentQIndex];

  return (
    <div className="min-h-screen bg-[#FAD6C8] pt-[112px] pb-20 px-4 text-[#4E0113]">
      <Navbar />
      
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Panel Wodzireja 🎤</h1>
          <p className="opacity-80">Sterowanie quizem w czasie rzeczywistym</p>
        </header>

        {/* === GŁÓWNY PANEL STEROWANIA === */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border-2 border-[#4E0113]/20 p-6 mb-8 sticky top-[90px] z-30">
          
          {/* Status Bar */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#4E0113]/10">
            <div>
               <p className="text-sm uppercase font-bold tracking-widest opacity-60">Aktualny Status</p>
               <div className="flex items-center gap-2 mt-1">
                 <span className={`w-3 h-3 rounded-full ${
                    gameState === 'question' ? 'bg-green-500 animate-pulse' : 
                    gameState === 'results' ? 'bg-blue-500' : 'bg-gray-400'
                 }`} />
                 <span className="font-bold text-xl">
                    {gameState === 'idle' && "Oczekiwanie"}
                    {gameState === 'question' && "Pytanie w toku"}
                    {gameState === 'results' && "Wyniki"}
                    {gameState === 'finished' && "Koniec"}
                 </span>
               </div>
            </div>
            
            {/* Licznik Odpowiedzi */}
            <div className="text-right">
                <p className="text-4xl font-bold">{answersCount}</p>
                <p className="text-xs uppercase font-bold tracking-widest opacity-60">Odpowiedzi</p>
            </div>
          </div>

          {/* Przyciski Akcji - Zmieniają się kontekstowo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 1. START PYTANIA */}
            {gameState !== 'question' && gameState !== 'finished' && (
              <button
                onClick={handleStartQuestion}
                className="col-span-2 bg-[#4E0113] text-[#FAD6C8] py-4 rounded-xl font-bold text-xl shadow-lg hover:bg-[#6b1326] transition flex items-center justify-center gap-3"
              >
                <PlayCircleIcon className="w-8 h-8" />
                {gameState === 'results' ? "Uruchom Następne Pytanie" : "Uruchom Pytanie"}
              </button>
            )}

            {/* 2. POKAŻ WYNIKI */}
            {gameState === 'question' && (
              <button
                onClick={handleShowResults}
                className="col-span-2 bg-blue-600 text-white py-4 rounded-xl font-bold text-xl shadow-lg hover:bg-blue-700 transition flex items-center justify-center gap-3"
              >
                <ChartBarIcon className="w-8 h-8" />
                Zatrzymaj i Pokaż Wyniki
              </button>
            )}

            {/* 3. NAWIGACJA (Dostępna gdy są wyniki) */}
            {gameState === 'results' && (
              <>
                {/* Ten przycisk jest trochę redundantny jeśli "Uruchom" robi to samo, ale daje kontrolę */}
                {currentQIndex + 1 < questions.length ? (
                   <button
                    onClick={handleNextQuestion}
                    className="bg-white border-2 border-[#4E0113] text-[#4E0113] py-3 rounded-xl font-bold hover:bg-[#FAD6C8] transition flex items-center justify-center gap-2"
                  >
                    <ArrowRightCircleIcon className="w-6 h-6" />
                    Przejdź do następnego
                  </button>
                ) : (
                  <button
                    onClick={handleFinishQuiz}
                    className="bg-gray-800 text-white py-3 rounded-xl font-bold hover:bg-black transition flex items-center justify-center gap-2"
                  >
                    <StopCircleIcon className="w-6 h-6" />
                    Zakończ Quiz
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* === PODGLĄD AKTUALNEGO PYTANIA === */}
        {currentQ && (
          <div className="bg-white/80 rounded-3xl p-8 border border-[#4E0113]/10 shadow-md">
            <div className="flex justify-between items-start mb-6">
               <h2 className="text-2xl font-bold">
                 <span className="opacity-50 mr-2">#{currentQIndex + 1}</span> 
                 {currentQ.question_text}
               </h2>
               <span className="bg-[#4E0113] text-[#FAD6C8] px-3 py-1 rounded-full font-mono font-bold">
                 {currentQ.time_limit_seconds}s
               </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQ.answers.map((ans, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 rounded-xl border-2 flex items-center gap-3 ${
                    ans.isCorrect 
                      ? "bg-green-100 border-green-500 text-green-900" 
                      : "bg-white border-gray-200 text-gray-500"
                  }`}
                >
                  {ans.isCorrect ? (
                    <CheckCircleIcon className="w-6 h-6 text-green-600 shrink-0" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 shrink-0" />
                  )}
                  <span className="font-semibold">{ans.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === LISTA KOLEJNYCH PYTAŃ (Podgląd) === */}
        <div className="mt-12 opacity-60">
           <h3 className="font-bold text-lg mb-4 uppercase tracking-widest border-b border-[#4E0113]/20 pb-2">Kolejka Pytań</h3>
           <ul className="space-y-2">
             {questions.map((q, idx) => (
               <li 
                 key={q.id} 
                 onClick={() => {
                    // Opcjonalnie: skok do pytania (dla admina)
                    setCurrentQIndex(idx);
                 }}
                 className={`p-3 rounded-lg flex items-center gap-4 cursor-pointer transition ${
                    idx === currentQIndex ? "bg-[#4E0113] text-[#FAD6C8] font-bold shadow-md" : "hover:bg-white/50"
                 }`}
               >
                 <span className="font-mono text-sm">{idx + 1}.</span>
                 <span>{q.question_text}</span>
                 {idx === currentQIndex && <span className="ml-auto text-xs bg-[#FAD6C8] text-[#4E0113] px-2 py-1 rounded">TERAZ</span>}
               </li>
             ))}
           </ul>
        </div>

      </div>
    </div>
  );
}