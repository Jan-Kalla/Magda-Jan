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
        .select("score, guest:guest_id (first_name, last_name)")
        .order("score", { ascending: false })
        .limit(10);
      if (data) setScores(data);
    };
    fetchScores();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6 w-full max-w-md">
      <h2 className="text-xl font-bold mb-4 text-[#4E0113]">Ranking Tetris</h2>
      <ol className="space-y-2">
        {scores.map((row, i) => (
          <li key={i} className="flex justify-between">
            <span>{row.guest.first_name} {row.guest.last_name}</span>
            <span className="font-semibold">{row.score}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
