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
  getIsGameOver,
  setPieceLockCallback,
  setLineClearCallback,
} from "./gameLogic";
import { useGuest } from "@/app/context/GuestContext";
import { createClient } from "@supabase/supabase-js";
import TetrisLeaderboard from "./TetrisLeaderBoard";
import NextPieces from "./NextPieces";
import MobileControls from "./MobileControls";
import "./tetris-theme.css";
import { sounds, playHitAlternating } from "./sounds";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const WIDTH = 300;
const HEIGHT = 600;
const BASE_DROP_INTERVAL = 1000;
const SPEED_FACTOR = 0.85;

const DAS = 150;
const ARR = 40;

export default function TetrisGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { guest } = useGuest();

  const [lastScore, setLastScore] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [levelState, setLevelState] = useState(getLevel());
  const [scoreState, setScoreState] = useState(0);

  const keysDown = useRef<{ [key: string]: boolean }>({});
  const lastMoveTime = useRef(0);
  const dasTriggered = useRef(false);

  const animationIdRef = useRef<number | null>(null);
  const lastDropRef = useRef<number>(performance.now());

  // Odblokowanie audio po pierwszej interakcji
  useEffect(() => {
    const unlockAudio = () => {
      try {
        sounds.hit1.mute(true);
        sounds.hit1.play();
        sounds.hit1.stop();
        sounds.hit1.mute(false);
      } catch {}
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };
    window.addEventListener("click", unlockAudio);
    window.addEventListener("keydown", unlockAudio);
    window.addEventListener("touchstart", unlockAudio);
    return () => {
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };
  }, []);

  useEffect(() => {
    setIsMobile("ontouchstart" in window);

    setLevelCallback((lvl) => setLevelState(lvl));
    setScoreCallback((s) => setScoreState(s));

    setPieceLockCallback(() => {
      playHitAlternating();
    });

    setLineClearCallback(() => {
      sounds.line.play();
    });

    setGameOverCallback(async (score) => {
      sounds.gameover.play();
      setLastScore(score);
      if (!guest) return;

      const currentLevel = getLevel();

      const { data: existing } = await supabase
        .from("tetris_scores")
        .select("id, score, level")
        .eq("guest_id", guest.id)
        .single();

      if (!existing) {
        await supabase.from("tetris_scores").insert({ guest_id: guest.id, score, level: currentLevel });
      } else if (score > existing.score) {
        await supabase
          .from("tetris_scores")
          .update({ score, level: currentLevel })
          .eq("id", existing.id);
      }
    });

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", " "].includes(e.key) || e.code === "Space") {
        e.preventDefault();
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        if (!keysDown.current[e.key]) {
          keysDown.current[e.key] = true;
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
        lastDropRef.current = performance.now();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        keysDown.current[e.key] = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const loop = (time: number) => {
      const currentLevel = getLevel();
      const interval = Math.max(100, BASE_DROP_INTERVAL * Math.pow(SPEED_FACTOR, currentLevel - 1));

      while (time - lastDropRef.current >= interval) {
        tick();
        lastDropRef.current += interval;
      }

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
      animationIdRef.current = requestAnimationFrame(loop);
    };

    animationIdRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    };
  }, [guest]);

  return (
    <div
      className="no-scroll flex flex-col items-center w-full min-h-screen p-6"
      style={{ background: "linear-gradient(to bottom, #FAD6C8, #4E0113)" }}
    >
      {/* Wrapper: trzy kolumny */}
      <div className="flex flex-row gap-6 justify-center items-start w-full max-w-5xl">
        {/* Lewa kolumna: Score + Level */}
        <div className="flex flex-col items-center gap-4">
          <div className="panel-card w-32">
            <p className="text-sm text-gray-300">Score</p>
            <p className="text-2xl font-bold">{scoreState}</p>
          </div>
          <div className="panel-card w-32">
            <p className="text-sm text-gray-300">Level</p>
            <p className="text-lg font-semibold">{levelState}</p>
          </div>
            {lastScore !== null && (
            <div className="panel-card w-40 mt-4">
              <p className="text-lg font-semibold mb-2">Twój wynik: {lastScore}</p>
              <TetrisLeaderboard />
            </div>
          )}
        </div>

        {/* Środek: Plansza */}
        <div className="flex flex-col items-center">
          <canvas
            ref={canvasRef}
            width={WIDTH}
            height={HEIGHT}
            className="tetris-canvas rounded-lg"
          />
          {isMobile && <MobileControls />}
        </div>

        {/* Prawa kolumna: Next pieces + leaderboard */}
        <div className="flex flex-col items-center gap-4">
          <NextPieces />
        </div>
      </div>
    </div>
  );
}
