"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { TrophyIcon } from "@heroicons/react/24/solid";


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type LeaderboardEntry = {
  first_name: string;
  last_name: string;
  total_score: number;
};

export default function FinishedScreen() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullLeaderboard = async () => {
      // Pobieramy WSZYSTKICH graczy
      const { data } = await supabase
        .from('quiz_leaderboard')
        .select('*');
      
      if (data) {
        setLeaderboard(data);
      }
      setLoading(false);
    };
    
    fetchFullLeaderboard();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-md mx-auto flex flex-col items-center pb-10 h-full"
    >
      {/* NAGŁÓWEK */}
      <div className="text-center bg-white/60 p-6 rounded-3xl shadow-xl backdrop-blur-md mb-6 w-full">
        <h1 className="text-4xl font-bold text-[#4E0113] mb-2">Koniec Quizu! 🏆</h1>
        <p className="text-[#4E0113]/80">Oto ostateczne wyniki rywalizacji.</p>
      </div>

      {/* PEŁNA TABELA WYNIKÓW */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-[#4E0113]/10 w-full flex-1 flex flex-col overflow-hidden min-h-[400px]">
        <div className="bg-[#4E0113] p-4 flex items-center justify-center gap-2 shrink-0">
            <TrophyIcon className="w-6 h-6 text-[#FAD6C8]" />
            <h3 className="text-[#FAD6C8] font-bold text-lg uppercase tracking-widest">Tabela Wyników</h3>
        </div>

        <div className="divide-y divide-gray-100 overflow-y-auto flex-1 p-2">
            {loading ? (
                <div className="p-10 text-center text-gray-500 animate-pulse">Liczenie punktów...</div>
            ) : leaderboard.length === 0 ? (
                <div className="p-10 text-center text-gray-500">Brak wyników.</div>
            ) : (
                leaderboard.map((player, index) => (
                    <div key={index} className={`flex items-center justify-between p-3 px-4 rounded-xl mb-1 ${
                        index === 0 ? 'bg-yellow-100 border border-yellow-300' : 
                        index === 1 ? 'bg-gray-100 border border-gray-300' :
                        index === 2 ? 'bg-orange-100 border border-orange-300' :
                        'hover:bg-[#FAD6C8]/20'
                    }`}>
                        <div className="flex items-center gap-3">
                            <div className={`
                                font-mono font-bold w-8 h-8 flex items-center justify-center rounded-full
                                ${index === 0 ? 'bg-yellow-500 text-white shadow-md' : ''}
                                ${index === 1 ? 'bg-gray-500 text-white shadow-md' : ''}
                                ${index === 2 ? 'bg-amber-700 text-white shadow-md' : ''}
                                ${index > 2 ? 'text-[#4E0113]/50 bg-gray-100' : ''}
                            `}>
                                {index + 1}
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-[#4E0113] leading-tight">
                                    {player.first_name} {player.last_name}
                                </span>
                            </div>
                        </div>
                        <span className="font-black text-[#4E0113] text-lg">
                            {player.total_score}
                        </span>
                    </div>
                ))
            )}
        </div>
      </div>
    </motion.div>
  );
}