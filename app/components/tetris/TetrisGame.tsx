"use client";
import { useEffect, useRef, useState } from "react";
import { 
  tick, 
  render, 
  moveLeft, 
  moveRight, 
  rotate, 
  softDrop, 
  hardDrop, 
  setGameOverCallback,
  restartGame
} from "./gameLogic";
import { useGuest } from "@/app/context/GuestContext";
import { createClient } from "@supabase/supabase-js";
import TetrisLeaderboard from "./TetrisLeaderBoard";
import NextPieces from "./NextPieces";
import MobileControls from "./MobileControls";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const WIDTH = 300;
const HEIGHT = 600;
const DROP_INTERVAL = 1000;

export default function TetrisGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { guest } = useGuest();
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
  setIsMobile("ontouchstart" in window);

  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // game over callback (overwrites previous)
  setGameOverCallback(async (score) => {
    setLastScore(score);
    if (!guest) return;

    const { data: existing } = await supabase
      .from("tetris_scores")
      .select("id, score")
      .eq("guest_id", guest.id)
      .single();

    if (!existing) {
      await supabase.from("tetris_scores").insert({ guest_id: guest.id, score });
    } else if (score > existing.score) {
      await supabase.from("tetris_scores").update({ score }).eq("id", existing.id);
    }
  });

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") moveLeft();
    if (e.key === "ArrowRight") moveRight();
    if (e.key === "ArrowDown") softDrop();
    if (e.key === "ArrowUp") rotate();
    if (e.code === "Space") hardDrop();
    if (e.key === "Enter") {
      restartGame();
      // reset timing to avoid an immediate gravity tick after restart
      lastDrop = performance.now();
    }
  };
  window.addEventListener("keydown", handleKey);

  let lastDrop = performance.now();
  let animationId: number;

  const loop = (time: number) => {
    while (time - lastDrop >= DROP_INTERVAL) {
      tick();
      lastDrop += DROP_INTERVAL;
    }
    render(ctx);
    animationId = requestAnimationFrame(loop);
  };
  animationId = requestAnimationFrame(loop);

  return () => {
    window.removeEventListener("keydown", handleKey);
    cancelAnimationFrame(animationId);
  };
}, [guest]);


    return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Plansza gry */}
        <div className="flex flex-col items-center">
        <canvas
            ref={canvasRef}
            width={WIDTH}
            height={HEIGHT}
            className="border-4 border-[#4E0113] bg-white shadow-lg"
        />

        {/* Sterowanie mobilne – tylko na dotykowych */}
        {isMobile && <MobileControls />}
        </div>

        {/* Panel boczny */}
        <div className="flex flex-col items-center">
        <NextPieces /> {/* podgląd kolejnych klocków */}
        {lastScore !== null && (
            <div className="mt-6 w-full flex flex-col items-center">
            <p className="text-lg font-semibold text-[#4E0113] mb-2">
                Twój wynik: {lastScore}
            </p>
            <TetrisLeaderboard />
            </div>
        )}
        </div>
    </div>
    );

}