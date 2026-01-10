"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import Navbar from "@/app/components/Navbar";
import { useGuest } from "@/app/context/GuestContext";
import { useRouter } from "next/navigation";
import { 
  PlayCircleIcon, 
  StopCircleIcon, 
  ChartBarIcon, 
  ArrowRightCircleIcon, 
  CheckCircleIcon,
  ArrowPathIcon,
  LockClosedIcon,
  LockOpenIcon
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

export default function AdminQuizPage() {
  const { guest, loading } = useGuest();
  const router = useRouter();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [gameState, setGameState] = useState<string>("idle");
  const [answersCount, setAnswersCount] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState<string | null>(null);

  // NOWY STAN: Czy quiz jest otwarty dla ludzi?
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  
  const questionsRef = useRef<Question[]>([]);
  const currentQIndexRef = useRef(currentQIndex);

  useEffect(() => { questionsRef.current = questions; }, [questions]);
  useEffect(() => { currentQIndexRef.current = currentQIndex; }, [currentQIndex]);

  useEffect(() => {
    if (!loading && guest?.code !== "FC3818") {
      router.push("/rywalizacja");
    }
  }, [guest, loading, router]);

  useEffect(() => {
    const initData = async () => {
      const { data: qData } = await supabase.from("quiz_questions").select("*").order("id");
      if (qData) setQuestions(qData);

      const { data: sData } = await supabase.from("quiz_state").select("*").single();
      if (sData) {
        setGameState(sData.status);
        setIsQuizOpen(sData.is_open); // Pobierz status otwarcia
        setQuestionStartTime(sData.question_start_time);
        if (sData.current_question_id && qData) {
          const idx = qData.findIndex((q) => q.id === sData.current_question_id);
          if (idx !== -1) setCurrentQIndex(idx);
        }
      }
    };
    initData();
  }, []);

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

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === "question" && questionStartTime) {
      interval = setInterval(() => {
        const currentQ = questionsRef.current[currentQIndexRef.current];
        if (!currentQ) return;
        const now = new Date().getTime();
        const start = new Date(questionStartTime).getTime();
        const elapsedSeconds = (now - start) / 1000;

        if (elapsedSeconds > currentQ.time_limit_seconds + 1) {
           handleAutoFinish();
        }
      }, 1000);
    }
    const handleAutoFinish = () => {
        updateState("results");
        clearInterval(interval);
    };
    return () => clearInterval(interval);
  }, [gameState, questionStartTime]);

  const updateState = async (status: string, questionId?: number | null) => {
    const payload: any = { status };
    if (questionId !== undefined) payload.current_question_id = questionId;

    if (status === 'question') {
        setAnswersCount(0);
        const now = new Date().toISOString();
        payload.question_start_time = now;
        setQuestionStartTime(now);
    }
    setGameState(status);
    await supabase.from("quiz_state").update(payload).eq("id", 1);
  };

  const toggleQuizLock = async () => {
    const newState = !isQuizOpen;
    setIsQuizOpen(newState);
    await supabase.from("quiz_state").update({ is_open: newState }).eq("id", 1);
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
      await updateState("question", questions[nextIndex].id);
    } else {
      await updateState("finished");
    }
  };

  const handleFinishQuiz = async () => {
    await updateState("finished");
  };

  const handleResetQuiz = async () => {
    const confirmReset = window.confirm(
      "UWAGA! Czy na pewno chcesz zresetować quiz? \n\nTo usunie odpowiedzi i ustawi grę na początek. Quiz zostanie też ZAMKNIĘTY."
    );

    if (confirmReset) {
      await supabase.from("quiz_responses").delete().neq("id", 0);
      // Reset też zamyka quiz dla bezpieczeństwa
      await supabase.from("quiz_state").update({ status: "idle", is_open: false }).eq("id", 1);
      
      setGameState("idle");
      setIsQuizOpen(false);
      setCurrentQIndex(0);
      setAnswersCount(0);
      setQuestionStartTime(null);
      alert("Quiz zresetowany!");
    }
  };

  if (loading || !guest) return null;
  const currentQ = questions[currentQIndex];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#FAD6C8] pt-[112px] pb-20 px-4 text-[#4E0113]">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
              <h1 className="text-3xl font-bold">Panel Administratora 🎤</h1>
              <p className="opacity-80">Sterowanie quizem</p>
          </div>
          
          <div className="flex gap-3">
              {/* PRZYCISK BLOKADY */}
              <button 
                onClick={toggleQuizLock}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-md transition ${
                    isQuizOpen 
                    ? "bg-green-600 text-white hover:bg-green-700" 
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {isQuizOpen ? (
                    <>
                        <LockOpenIcon className="w-5 h-5" /> Quiz OTWARTY
                    </>
                ) : (
                    <>
                        <LockClosedIcon className="w-5 h-5" /> Quiz ZAMKNIĘTY
                    </>
                )}
              </button>

              <button 
                onClick={handleResetQuiz}
                className="p-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-full transition shadow-sm border border-red-300"
                title="Resetuj Quiz"
              >
                <ArrowPathIcon className="w-6 h-6" />
              </button>
          </div>
        </header>

        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border-2 border-[#4E0113]/20 p-6 mb-8 sticky top-[90px] z-30">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#4E0113]/10">
            <div>
               <p className="text-sm uppercase font-bold tracking-widest opacity-60">Status</p>
               <div className="flex items-center gap-2 mt-1">
                 <span className={`w-3 h-3 rounded-full ${
                    gameState === 'question' ? 'bg-green-500 animate-pulse' : 
                    gameState === 'results' ? 'bg-blue-500' : 
                    gameState === 'finished' ? 'bg-black' : 'bg-gray-400'
                 }`} />
                 <span className="font-bold text-xl uppercase">{gameState}</span>
               </div>
            </div>
            <div className="text-right">
                <span className="text-4xl font-bold">{answersCount}</span>
                <span className="text-xs uppercase ml-1">Odp.</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* OSTRZEŻENIE JEŚLI QUIZ ZAMKNIĘTY */}
            {!isQuizOpen && (
                <div className="bg-red-100 text-red-800 p-3 rounded-lg text-center font-bold text-sm mb-2">
                    ⚠️ Quiz jest zamknięty dla gości. Otwórz go przyciskiem u góry, aby mogli dołączyć!
                </div>
            )}

            {gameState !== 'question' && gameState !== 'finished' && (
              <button onClick={handleStartQuestion} className="bg-[#4E0113] text-[#FAD6C8] py-4 rounded-xl font-bold text-xl shadow-lg flex justify-center gap-2 hover:bg-[#6b1326] transition">
                <PlayCircleIcon className="w-8 h-8" /> {gameState === 'results' ? "Następne Pytanie" : "Start Pytania"}
              </button>
            )}

            {gameState === 'question' && (
               <div className="col-span-2 flex flex-col gap-2">
                  <div className="text-center text-sm font-mono opacity-60 animate-pulse mb-1">
                     Automatyczne zakończenie po upływie czasu...
                  </div>
                  <button onClick={handleShowResults} className="bg-blue-600 text-white py-4 rounded-xl font-bold text-xl shadow-lg hover:bg-blue-700 transition flex items-center justify-center gap-3">
                    <ChartBarIcon className="w-8 h-8" /> Pokaż Wyniki Teraz
                  </button>
              </div>
            )}

            {gameState === 'results' && currentQIndex + 1 >= questions.length && (
                 <button onClick={handleFinishQuiz} className="bg-black text-white py-3 rounded-xl font-bold flex justify-center gap-2">
                    <StopCircleIcon className="w-6 h-6"/> Zakończ Quiz
                 </button>
            )}

            {gameState === 'finished' && (
                <div className="text-center py-4 text-gray-600 italic">Quiz zakończony.</div>
            )}
          </div>
        </div>

        {currentQ && (
          <div className="bg-white/80 rounded-3xl p-8 border border-[#4E0113]/10 shadow-md">
            <div className="flex justify-between items-start mb-6">
               <h2 className="text-2xl font-bold">
                 <span className="opacity-50 mr-2">#{currentQIndex + 1}</span> {currentQ.question_text}
               </h2>
               <span className="bg-[#4E0113] text-[#FAD6C8] px-3 py-1 rounded-full font-mono font-bold">
                 {currentQ.time_limit_seconds}s
               </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQ.answers.map((ans, idx) => (
                <div key={idx} className={`p-4 rounded-xl border-2 flex items-center gap-3 ${ans.isCorrect ? "bg-green-100 border-green-500 text-green-900" : "bg-white border-gray-200 text-gray-500"}`}>
                  {ans.isCorrect ? <CheckCircleIcon className="w-6 h-6 text-green-600" /> : <div className="w-6 h-6 rounded-full border-2 border-gray-300" />}
                  <span className="font-semibold">{ans.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 opacity-60 pb-10">
           <h3 className="font-bold text-lg mb-4 uppercase tracking-widest border-b border-[#4E0113]/20 pb-2">Kolejka Pytań</h3>
           <ul className="space-y-2">
             {questions.map((q, idx) => (
               <li key={q.id} onClick={() => { if (gameState !== 'question') setCurrentQIndex(idx); }} className={`p-3 rounded-lg flex items-center gap-4 cursor-pointer transition ${idx === currentQIndex ? "bg-[#4E0113] text-[#FAD6C8] font-bold shadow-md" : "hover:bg-white/50"}`}>
                 <span className="font-mono text-sm">{idx + 1}.</span>
                 <span>{q.question_text}</span>
                 {idx === currentQIndex && <span className="ml-auto text-xs bg-[#FAD6C8] text-[#4E0113] px-2 py-1 rounded">TERAZ</span>}
               </li>
             ))}
           </ul>
        </div>
      </div>
    </div>
    </>
  );
}