"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function TetrisLeaderboard() {
  const [scores, setScores] = useState<any[]>([]);

  useEffect(() => {
    const fetchScores = async () => {
      const { data } = await supabase
        .from("tetris_scores")
        .select("score, level, guest:guest_id (first_name, last_name)")
        .order("score", { ascending: false })
        .limit(10);
      if (data) setScores(data);
    };
    fetchScores();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6 w-full max-w-2xl">
      <h2 className="text-xl font-bold mb-4 text-[#4E0113]">Ranking Tetris</h2>
      <ol className="space-y-2">
        {scores.map((row, i) => (
          <li key={i} className="flex justify-between text-[#4E0113] text-lg">
            <span className="flex-1">
              <span className="font-bold mr-3">{i + 1}.</span>
              {row.guest.first_name} {row.guest.last_name}
            </span>
            <span className="flex gap-6">
              <span className="font-semibold">Score: {row.score}</span>
              <span className="font-semibold">Level: {row.level}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
