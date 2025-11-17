"use client";
import { useEffect, useRef } from "react";
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
  getIsGameOver,
  setPieceLockCallback,
  setLineClearCallback,
} from "./gameLogic";
import { useGuest } from "@/app/context/GuestContext";
import { createClient } from "@supabase/supabase-js";
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

export default function TetrisGame({ mobileLayout }: { mobileLayout?: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { guest } = useGuest();

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
    setPieceLockCallback(() => playHitAlternating());
    setLineClearCallback(() => sounds.line.play());
    setGameOverCallback(async (score) => {
      sounds.gameover.play();
      if (!guest) return;
      const currentLevel = 1; // możesz pobrać getLevel jeśli chcesz
      const { data: existing } = await supabase
        .from("tetris_scores")
        .select("id, score, level")
        .eq("guest_id", guest.id)
        .single();
      if (!existing) {
        await supabase.from("tetris_scores").insert({ guest_id: guest.id, score, level: currentLevel });
      } else if (score > existing.score) {
        await supabase.from("tetris_scores").update({ score, level: currentLevel }).eq("id", existing.id);
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
      const interval = Math.max(100, BASE_DROP_INTERVAL * Math.pow(SPEED_FACTOR, 0));
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
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} className="tetris-canvas rounded-lg" />
      {mobileLayout}
    </div>
  );
}
