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
  restartGame,
  togglePause,
  getLevel,
  setLevelCallback,
  setScoreCallback,
  getIsGameOver 
} from "./gameLogic";
import { useGuest } from "@/app/context/GuestContext";
import { createClient } from "@supabase/supabase-js";
import TetrisLeaderboard from "./TetrisLeaderBoard";
import NextPieces from "./NextPieces";
import MobileControls from "./MobileControls";
import PauseButton from "./PauseButton";
import "./tetris-theme.css";


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const WIDTH = 300;
const HEIGHT = 600;
const BASE_DROP_INTERVAL = 1000; // ms
const SPEED_FACTOR = 0.85;


export default function TetrisGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { guest } = useGuest();
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [levelState, setLevelState] = useState(getLevel());
  setLevelCallback((lvl) => setLevelState(lvl));
  
    // 🔑 DAS/ARR refs muszą być tutaj, na najwyższym poziomie komponentu
  const keysDown = useRef<{ [key: string]: boolean }>({});
  const lastMoveTime = useRef(0);
  const dasTriggered = useRef(false);
  const [scoreState, setScoreState] = useState(0);

  useEffect(() => {
  setIsMobile("ontouchstart" in window);
    setScoreCallback((s) => setScoreState(s));
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
// konfiguracja DAS/ARR
const DAS = 150; // ms opóźnienia po pierwszym ruchu
const ARR = 40;  // ms między kolejnymi przesunięciami

// stan klawiszy

const handleKeyDown = (e: KeyboardEvent) => {
  if (["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", " "].includes(e.key) || e.code === "Space") {
    e.preventDefault(); // blokuje scrollowanie strony
  }
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    if (!keysDown.current[e.key]) {
      keysDown.current[e.key] = true;
      // natychmiastowe pierwsze przesunięcie
      if (e.key === "ArrowLeft") moveLeft();
      if (e.key === "ArrowRight") moveRight();
      lastMoveTime.current = performance.now();
      dasTriggered.current = false;
    }
  }

  if (e.key === "ArrowDown") softDrop();
  if (e.key === "ArrowUp") rotate();
  if (e.code === "Space") hardDrop();
  if (e.key === "Escape") togglePause();
  if (e.key === "Enter" && getIsGameOver()) {
    restartGame();
    lastDrop = performance.now();
  }
};

const handleKeyUp = (e: KeyboardEvent) => {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    keysDown.current[e.key] = false;
  }
};

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

let lastDrop = performance.now();
let animationId: number;

const loop = (time: number) => {
  const currentLevel = getLevel();
  const interval = Math.max(
  100,
  BASE_DROP_INTERVAL * Math.pow(SPEED_FACTOR, currentLevel - 1)
);

  // grawitacja
  while (time - lastDrop >= interval) {
    tick();
    lastDrop += interval;
  }

  // auto przesuwanie (DAS/ARR)
  if (keysDown.current["ArrowLeft"] || keysDown.current["ArrowRight"]) {
    const key = keysDown.current["ArrowLeft"] ? "ArrowLeft" : "ArrowRight";
    if (!dasTriggered.current) {
      if (time - lastMoveTime.current >= DAS) {
        if (key === "ArrowLeft") moveLeft();
        if (key === "ArrowRight") moveRight();
        lastMoveTime.current = time;
        dasTriggered.current = true;
      }
    } else {
      if (time - lastMoveTime.current >= ARR) {
        if (key === "ArrowLeft") moveLeft();
        if (key === "ArrowRight") moveRight();
        lastMoveTime.current = time;
      }
    }
  }

  render(ctx);
  animationId = requestAnimationFrame(loop);
};

animationId = requestAnimationFrame(loop);

return () => {
  window.removeEventListener("keydown", handleKeyDown);
  window.removeEventListener("keyup", handleKeyUp);
  cancelAnimationFrame(animationId);
};

}, [guest]);

return (
<div className="no-scroll flex flex-col items-center w-full min-h-screen p-6"
     style={{ background: "linear-gradient(to bottom, #FAD6C8, #4E0113)" }}>
    {/* Nagłówek */}
    <div className="flex flex-col md:flex-row gap-8 justify-center items-start w-full max-w-5xl">
      {/* Plansza gry */}
      <div className="flex flex-col items-center mx-auto">
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          className="tetris-canvas rounded-lg"
        />

        {isMobile && <MobileControls />}
        {isMobile && <PauseButton />}
      </div>

      {/* Panel boczny */}
      <div className="flex flex-col items-center gap-4">
        <NextPieces />

        <div className="panel-card w-40 mt-4">
          <p className="text-sm text-gray-300">Score</p>
          <p className="text-2xl font-bold">{scoreState}</p>
        </div>

        <div className="panel-card w-40 mt-4">
          <p className="text-sm text-gray-300">Level</p>
          <p className="text-lg font-semibold">{levelState}</p>
        </div>

        {lastScore !== null && (
          <div className="panel-card w-60 mt-4">
            <p className="text-lg font-semibold mb-2">Twój wynik: {lastScore}</p>
            <TetrisLeaderboard />
          </div>
        )}
      </div>
    </div>
  </div>
);


}