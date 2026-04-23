"use client";
import { useEffect, useState, forwardRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const medalIcons = ["🥇", "🥈", "🥉"];

const TetrisLeaderboard = forwardRef<HTMLHeadingElement>((props, ref) => {
  const [scores, setScores] = useState<any[]>([]);

  const fetchScores = async () => {
    const { data } = await supabase
      .from("tetris_scores")
      .select("score, level, guest:guest_id (first_name, last_name)")
      .order("score", { ascending: false })
      .limit(10);
    if (data) setScores(data);
  };

  useEffect(() => {
    fetchScores();

    const handler = () => {
      fetchScores();
    };
    window.addEventListener("scoresUpdated", handler);

    return () => {
      window.removeEventListener("scoresUpdated", handler);
    };
  }, []);

  return (
    <div className="panel-card w-full max-w-none mx-auto mt-2 px-10 py-6">
      {/* ZMIANA: scroll-mt-28 gwarantuje, że zatrzyma się 112px niżej, omijając Navbar! */}
      <h2 
        ref={ref} 
        className="text-xl font-extrabold mb-6 text-white text-center tracking-wide scroll-mt-28"
      >
        Ranking Tetris
      </h2>
      <div className="flex flex-col gap-2 w-full">
        {scores.map((row, i) => (
          <div
            key={i}
            className={`flex items-center justify-between px-6 py-2 rounded-lg w-full ${
              i === 0
                ? "bg-yellow-600/30"
                : i === 1
                ? "bg-gray-500/30"
                : i === 2
                ? "bg-orange-500/30"
                : "bg-[#4E0113]/30"
            }`}
          >
            <div className="text-2xl font-bold text-white w-10 text-center shrink-0">
              {medalIcons[i] || `${i + 1}.`}
            </div>
            
            <div className="font-semibold text-white flex-1 px-2 break-words">
              {row.guest?.first_name} {row.guest?.last_name}
            </div>
            
            <div className="flex flex-col items-end md:flex-row md:items-center gap-1 md:gap-4 shrink-0">
              <span className="text-white/80 font-mono text-sm uppercase tracking-wider">
                Lvl {row.level}
              </span>
              <span className="text-white font-mono font-bold text-base bg-black/40 px-2 py-0.5 rounded border border-white/10">
                {row.score}
              </span>
            </div>
          </div>
        ))}
        {scores.length === 0 && (
          <div className="text-center text-white/50 italic py-4">
            Brak wyników. Bądź pierwszy!
          </div>
        )}
      </div>
    </div>
  );
});

TetrisLeaderboard.displayName = 'TetrisLeaderboard';
export default TetrisLeaderboard;