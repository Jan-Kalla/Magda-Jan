"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";
// Dodajemy CheckIcon i XMarkIcon do importów
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon, 
  TrophyIcon, 
  LightBulbIcon, 
  ChartBarIcon,
  CheckIcon,     // NOWE
  XMarkIcon      // NOWE
} from "@heroicons/react/24/solid";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Props = {
  result: { score: number; correct: boolean } | null;
  correctAnswerLabel?: string; 
  questionId: number;
  correctAnswerIndex: number; // NOWE: Odbieramy indeks poprawnej odp.
};

type LeaderboardEntry = {
  first_name: string;
  last_name: string;
  total_score: number;
};

type QuestionStats = {
  a: number;
  b: number;
  c: number;
  d: number;
  total: number;
};

const BAR_COLORS: Record<string, string> = {
  a: "bg-red-500",
  b: "bg-blue-500",
  c: "bg-yellow-400",
  d: "bg-green-500"
};

export default function ResultsScreen({ result, correctAnswerLabel, questionId, correctAnswerIndex }: Props) {
  const hasResult = result !== null;
  const isCorrect = result?.correct;
  
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState<QuestionStats | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: lbData } = await supabase.from('quiz_leaderboard').select('*').limit(10);
      if (lbData) setLeaderboard(lbData);

      const { data: statsData } = await supabase.rpc('get_question_stats', { p_question_id: questionId });
      if (statsData) setStats(statsData);
    };
    fetchData();
  }, [questionId]);

  const getPercent = (count: number) => {
    if (!stats || stats.total === 0) return 0;
    return Math.round((count / stats.total) * 100);
  };

  // Pomocnicza tablica do mapowania kluczy a,b,c,d na indeksy 0,1,2,3
  const KEYS = ['a', 'b', 'c', 'd'];

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-6 pb-24">
      
      {/* 1. KARTA Z WYNIKIEM (BEZ ZMIAN) */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`p-6 rounded-3xl shadow-2xl text-center text-white relative overflow-hidden
            ${isCorrect ? "bg-gradient-to-br from-green-500 to-green-700" : hasResult ? "bg-gradient-to-br from-red-500 to-red-700" : "bg-gradient-to-br from-gray-500 to-gray-700"}
        `}
      >
        <div className="relative z-10">
          {hasResult ? (
            isCorrect ? (
              <>
                <CheckCircleIcon className="w-16 h-16 mx-auto mb-2 text-green-200" />
                <h2 className="text-2xl font-bold">W pytę!</h2>
                <div className="mt-2 bg-white/20 rounded-xl p-2 border border-white/30 inline-block px-6">
                  <span className="text-xs uppercase font-bold opacity-80 block">Punkty</span>
                  <span className="text-4xl font-black">+{result.score}</span>
                </div>
              </>
            ) : (
              <>
                <XCircleIcon className="w-16 h-16 mx-auto mb-2 text-red-200" />
                <h2 className="text-2xl font-bold">Kaprawo...</h2>
                <p className="opacity-90">Niestety, to nie to.</p>
              </>
            )
          ) : (
            <>
              <ClockIcon className="w-16 h-16 mx-auto mb-2 text-gray-300" />
              <h2 className="text-xl font-bold">Czas minął!</h2>
              <p className="text-sm opacity-80">Musisz być szybszy.</p>
            </>
          )}

          {(!isCorrect || !hasResult) && correctAnswerLabel && (
             <div className="mt-4 bg-black/20 rounded-xl p-3 border border-white/10 animate-pulse">
                <div className="flex items-center justify-center gap-2 text-green-200 mb-1">
                    <LightBulbIcon className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">Poprawna odpowiedź</span>
                </div>
                <p className="font-bold text-lg leading-tight">{correctAnswerLabel}</p>
             </div>
          )}
        </div>
      </motion.div>

      {/* 2. STATYSTYKI ODPOWIEDZI */}
      {stats && (
        <motion.div
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.2 }}
           className="bg-white rounded-3xl shadow-lg border border-[#4E0113]/10 p-5"
        >
            <div className="flex items-center gap-2 mb-4 text-[#4E0113] border-b border-gray-100 pb-2">
                <ChartBarIcon className="w-5 h-5" />
                <h3 className="font-bold text-sm uppercase tracking-wide">Jak głosowali inni?</h3>
            </div>
            
            <div className="space-y-3">
                {KEYS.map((key, index) => {
                    const count = stats[key as keyof QuestionStats] || 0;
                    const percent = getPercent(count);
                    const colorClass = BAR_COLORS[key] || "bg-gray-400";
                    
                    // Sprawdzamy czy ten wiersz to poprawna odpowiedź
                    const isRowCorrect = index === correctAnswerIndex;

                    return (
                        <div key={key} className="flex items-center gap-3 text-sm">
                            <span className={`font-bold w-4 uppercase ${key === 'c' ? 'text-yellow-600' : 'text-[#4E0113]'}`}>
                                {key}
                            </span>
                            
                            {/* Kontener Paska */}
                            <div className="flex-1 h-8 bg-gray-100 rounded-full overflow-hidden relative shadow-inner">
                                <div className="absolute inset-0 bg-gray-100" />
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percent}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className={`h-full relative rounded-full flex items-center px-2 ${percent > 0 ? colorClass : ""}`}
                                />
                                <span className={`absolute left-3 top-1/2 -translate-y-1/2 font-bold text-xs z-10 whitespace-nowrap ${count > 0 ? (key === 'c' ? "text-yellow-900" : "text-white") : "text-gray-400"}`}>
                                    głosów: {count}
                                </span>
                                <span className={`absolute right-3 top-1/2 -translate-y-1/2 font-bold text-xs z-10 ${percent > 90 ? (key === 'c' ? "text-yellow-900" : "text-white") : "text-gray-500"}`}>
                                    {percent}%
                                </span>
                            </div>

                            {/* === IKONA WYNIKU (PTASZEK / KRZYŻYK) === */}
                            <div className="w-6 flex justify-center">
                                {isRowCorrect ? (
                                    <div className="bg-green-100 p-1 rounded-full">
                                        <CheckIcon className="w-5 h-5 text-green-600" />
                                    </div>
                                ) : (
                                    <XMarkIcon className="w-5 h-5 text-red-300 opacity-50" />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            <p className="text-xs text-right text-gray-400 mt-2">Łącznie głosów: {stats.total}</p>
        </motion.div>
      )}

      {/* 3. RANKING (BEZ ZMIAN) */}
      <motion.div
         initial={{ y: 20, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         transition={{ delay: 0.4 }}
         className="bg-white/90 backdrop-blur-md rounded-3xl shadow-lg border border-[#4E0113]/10 overflow-hidden"
      >
        <div className="bg-[#4E0113] p-4 flex items-center justify-center gap-2">
            <TrophyIcon className="w-6 h-6 text-[#FAD6C8]" />
            <h3 className="text-[#FAD6C8] font-bold text-lg uppercase tracking-widest">Top 10 Graczy</h3>
        </div>

        <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
            {leaderboard.length === 0 ? (
                <div className="p-6 text-center text-gray-500">Ładowanie rankingu...</div>
            ) : (
                leaderboard.map((player, index) => (
                    <div key={index} className="flex items-center justify-between p-3 px-5 hover:bg-[#FAD6C8]/20 transition-colors">
                        <div className="flex items-center gap-3">
                            <span className={`font-mono font-bold w-6 text-center ${index === 0 ? 'text-yellow-500 text-xl' : ''} ${index === 1 ? 'text-gray-400 text-lg' : ''} ${index === 2 ? 'text-amber-700 text-lg' : ''} ${index > 2 ? 'text-[#4E0113]/50' : ''}`}>
                                {index + 1}.
                            </span>
                            <span className="font-semibold text-[#4E0113]">
                                {player.first_name} {player.last_name?.charAt(0)}.
                            </span>
                        </div>
                        <span className="font-bold text-[#4E0113] bg-[#FAD6C8]/50 px-2 py-0.5 rounded-md text-sm">
                            {player.total_score} pkt
                        </span>
                    </div>
                ))
            )}
        </div>
      </motion.div>
    </div>
  );
}