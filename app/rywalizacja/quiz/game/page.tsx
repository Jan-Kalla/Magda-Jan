"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import Navbar from "@/app/components/Navbar";
import { useGuest } from "@/app/context/GuestContext";
import { AnimatePresence } from "framer-motion";

import IdleScreen from "./components/IdleScreen";
import QuestionScreen from "./components/QuestionScreen";
import ResultsScreen from "./components/ResultsScreen";
import FinishedScreen from "./components/FinishedScreen";

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

  // Timer UI
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  const gameStateRef = useRef(gameState);
  const currentQRef = useRef(currentQuestion);

  useEffect(() => {
    gameStateRef.current = gameState;
    currentQRef.current = currentQuestion;
  }, [gameState, currentQuestion]);


  // === 1. GŁÓWNA FUNKCJA SYNCHRONIZACJI ===
  const syncGame = useCallback(async () => {
    if (!guest) return;

    const { data: state } = await supabase.from("quiz_state").select("*").single();
    if (!state) return;

    setGameState(state.status);
    setQuestionStartTime(state.question_start_time);

    if (state.current_question_id) {
      if (currentQRef.current?.id !== state.current_question_id) {
        const { data: q } = await supabase
          .from("quiz_questions")
          .select("*")
          .eq("id", state.current_question_id)
          .single();
        
        if (q) {
          setCurrentQuestion(q);
          setSubmittedIndex(null);
          setResult(null);
        }
      }

      if (currentQRef.current) {
         const { data: resp } = await supabase
          .from("quiz_responses")
          .select("answer_index, score")
          .eq("guest_id", guest.id)
          .eq("question_id", state.current_question_id)
          .maybeSingle();

        if (resp) {
            setSubmittedIndex(resp.answer_index);
            
            if (state.status === "results") {
                const isCorrect = currentQRef.current.answers[resp.answer_index].isCorrect;
                setResult({ score: resp.score, correct: isCorrect });
            }
        } else {
             if (state.status === "question") {
                 // W trakcie
             } else if (state.status === "results" || state.status === "finished") {
                 setSubmittedIndex(null);
                 setResult(null); 
             } else {
                 setSubmittedIndex(null);
                 setResult(null);
             }
        }
      }
    } else {
        setCurrentQuestion(null);
    }
  }, [guest]);


  // === 2. POLLING + REALTIME ===
  useEffect(() => {
    if (!guest) return;
    syncGame();

    const intervalId = setInterval(() => {
      syncGame();
    }, 1000);

    const channel = supabase
      .channel("quiz_game_loop")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "quiz_state", filter: "id=eq.1" },
        () => syncGame()
      )
      .subscribe();

    return () => {
      clearInterval(intervalId);
      supabase.removeChannel(channel);
    };
  }, [guest, syncGame]);


  // === 3. TIMER UI ===
  useEffect(() => {
    if (gameState === "question" && questionStartTime && currentQuestion) {
      const startTime = new Date(questionStartTime).getTime();
      const durationMs = currentQuestion.time_limit_seconds * 1000;

      const timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const elapsed = now - startTime;
        const remaining = Math.max(0, durationMs - elapsed);

        setTimeLeft(Math.ceil(remaining / 1000));
        setProgress((remaining / durationMs) * 100);

        if (remaining <= 0) {
          clearInterval(timerInterval);
        }
      }, 100);

      return () => clearInterval(timerInterval);
    } else {
      setTimeLeft(0);
      setProgress(0);
    }
  }, [gameState, questionStartTime, currentQuestion]);


  // === 4. WYŚLIJ ODPOWIEDŹ ===
  const handleSubmitAnswer = async (index: number) => {
    if (submittedIndex !== null || !guest || !currentQuestion || timeLeft <= 0) return;

    setSubmittedIndex(index);

    const { error } = await supabase.rpc("submit_quiz_answer", {
      p_question_id: currentQuestion.id,
      p_answer_index: index,
      p_guest_id: guest.id,
    });

    if (error) {
      console.error("Błąd zapisu:", error);
      setSubmittedIndex(null);
      alert("Błąd połączenia! Spróbuj kliknąć jeszcze raz.");
    } else {
      setTimeout(() => syncGame(), 100); 
    }
  };

  // === 5. OBLICZENIE POPRAWNEJ ODPOWIEDZI (Dla widoku Results) ===
  // Znajdujemy odpowiedź, która ma isCorrect: true
  const correctLabel = currentQuestion?.answers.find(a => a.isCorrect)?.label;

  if (loading) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#FAD6C8] pt-[80px] md:pt-[112px] flex flex-col overflow-hidden">

      <div className="flex-1 flex flex-col items-center justify-center p-4 w-full">
        <AnimatePresence mode="wait">
          
          {gameState === "idle" && (
            <IdleScreen key="idle" />
          )}

          {gameState === "question" && currentQuestion && (
            <QuestionScreen
              key="question"
              questionText={currentQuestion.question_text}
              answers={currentQuestion.answers}
              timeLeft={timeLeft}
              progress={progress}
              submittedIndex={submittedIndex}
              onSubmit={handleSubmitAnswer}
            />
          )}

          {gameState === "results" && (
            <ResultsScreen 
                key="results" 
                result={result} 
                correctAnswerLabel={correctLabel} // PRZEKAZUJEMY TUTAJ
            />
          )}

          {gameState === "finished" && (
            <FinishedScreen key="finished" />
          )}

        </AnimatePresence>
      </div>
    </div>
    </>
  );
}