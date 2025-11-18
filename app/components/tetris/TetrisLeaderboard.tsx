"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const medalIcons = ["🥇", "🥈", "🥉"];

export default function TetrisLeaderboard() {
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

    // nasłuchuj eventu z TetrisGame
    const handler = () => {
      fetchScores();
    };
    window.addEventListener("scoresUpdated", handler);

    return () => {
      window.removeEventListener("scoresUpdated", handler);
    };
  }, []);

  return (
    <div className="panel-card w-full max-w-none mx-auto mt-6 px-10 py-6">
      <h2 className="text-xl font-extrabold mb-6 text-white text-center tracking-wide">
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
            <div className="font-semibold text-white flex-1 px-4 break-words">
              {row.guest.first_name} {row.guest.last_name}
            </div>
            <div className="flex gap-8 text-white text-sm font-medium shrink-0">
              <span>Score: {row.score}</span>
              <span>Level: {row.level}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
