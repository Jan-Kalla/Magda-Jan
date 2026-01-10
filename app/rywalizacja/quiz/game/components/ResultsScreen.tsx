"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { CheckCircleIcon, XCircleIcon, ClockIcon, TrophyIcon, LightBulbIcon } from "@heroicons/react/24/solid";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Props = {
  result: { score: number; correct: boolean } | null;
  correctAnswerLabel?: string; // NOWE: Tekst poprawnej odpowiedzi
};

type LeaderboardEntry = {
  first_name: string;
  last_name: string;
  total_score: number;
};

export default function ResultsScreen({ result, correctAnswerLabel }: Props) {
  const hasResult = result !== null;
  const isCorrect = result?.correct;
  
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data } = await supabase
        .from('quiz_leaderboard')
        .select('*')
        .limit(10); // Pokazujemy TOP 10 w trakcie gry
      
      if (data) {
        setLeaderboard(data);
      }
    };
    
    fetchLeaderboard();
  }, []);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-6 pb-10">
      
      {/* 1. KARTA Z TWOIM WYNIKIEM */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`p-6 rounded-3xl shadow-2xl text-center text-white relative overflow-hidden
            ${
              isCorrect
                ? "bg-gradient-to-br from-green-500 to-green-700"
                : hasResult
                ? "bg-gradient-to-br from-red-500 to-red-700"
                : "bg-gradient-to-br from-gray-500 to-gray-700"
            }
        `}
      >
        <div className="relative z-10">
          {hasResult ? (
            isCorrect ? (
              <>
                <CheckCircleIcon className="w-16 h-16 mx-auto mb-2 text-green-200" />
                <h2 className="text-2xl font-bold">W pytę!</h2>
                <div className="mt-2 bg-white/20 rounded-xl p-2 border border-white/30">
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

          {/* NOWE: POKAZANIE POPRAWNEJ ODPOWIEDZI JEŚLI BŁĄD */}
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

      {/* 2. RANKING TOP 10 */}
      <motion.div
         initial={{ y: 20, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         transition={{ delay: 0.3 }}
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
                            <span className={`
                                font-mono font-bold w-6 text-center
                                ${index === 0 ? 'text-yellow-500 text-xl' : ''}
                                ${index === 1 ? 'text-gray-400 text-lg' : ''}
                                ${index === 2 ? 'text-amber-700 text-lg' : ''}
                                ${index > 2 ? 'text-[#4E0113]/50' : ''}
                            `}>
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