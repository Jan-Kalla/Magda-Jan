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
  getLevel,
  setLevelCallback,
  setScoreCallback,
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

  const playControlSound = (key: string) => {
    const sound = new Audio('/sounds/tetris/hover.mp3');
    (sound as any).preservesPitch = false;
    (sound as any).webkitPreservesPitch = false;

    if (key === "ArrowUp") {
      sound.playbackRate = 0.75;
    } else if (key === "ArrowDown") {
      sound.playbackRate = 1.5;
    } else {
      sound.playbackRate = 1.0;
    }
    sound.play().catch(() => {});
  };

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

    setLevelCallback(() => {
      lastDropRef.current = performance.now();
    });

    setScoreCallback(() => {});

    setGameOverCallback(async (score) => {
      sounds.gameover.play();
      if (!guest) return;

      const currentLevel = getLevel();

      const { data: existing, error: fetchError } = await supabase
        .from("tetris_scores")
        .select("id, score, level")
        .eq("guest_id", guest.id)
        .maybeSingle();

      if (fetchError) {
        console.error("❌ BŁĄD POBIERANIA WYNIKÓW Z SUPABASE:", fetchError);
      }

      if (!existing) {
        const { error: insertError } = await supabase
          .from("tetris_scores")
          .insert({ guest_id: guest.id, score, level: currentLevel });
          
        if (insertError) {
          console.error("❌ BŁĄD TWORZENIA NOWEGO REKORDU:", insertError);
        } else {
          console.log("✅ Dodano nowy wynik do bazy!");
        }
      } else {
        const improvedScore = score > (existing.score ?? 0);
        const improvedLevel = currentLevel > (existing.level ?? 0);

        if (improvedScore || improvedLevel) {
          console.log(`Pobito rekord! Próba nadpisania w bazie: ${existing.score} -> ${score}`);
          
          const { error: updateError } = await supabase
            .from("tetris_scores")
            .update({
              score: improvedScore ? score : existing.score,
              level: improvedLevel ? currentLevel : existing.level,
            })
            // W KOŃCU! OTO PRAWDZIWA POPRAWKA NA GUEST_ID:
            .eq("guest_id", guest.id);

          if (updateError) {
             console.error("❌ SUPABASE ODRZUCIŁ AKTUALIZACJĘ:", updateError);
          } else {
             console.log("✅ Wynik pomyślnie nadpisany w bazie!");
          }
        } else {
          console.log(`Słaby wynik (${score}). Stary rekord to ${existing.score}. Nie zapisuję.`);
        }
      }

      window.dispatchEvent(new Event("scoresUpdated"));
    });

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", " ", "p", "P"].includes(e.key) || e.code === "Space") {
        e.preventDefault();
      }

      let actionTaken = false;

      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        if (!keysDown.current[e.key]) {
          keysDown.current[e.key] = true;
          if (e.key === "ArrowLeft") moveLeft();
          if (e.key === "ArrowRight") moveRight();
          lastMoveTime.current = performance.now();
          dasTriggered.current = false;
          actionTaken = true;
        }
      }
      
      if (e.key === "ArrowDown") {
        softDrop();
        actionTaken = true;
      }
      if (e.key === "ArrowUp") {
        rotate();
        actionTaken = true;
      }
      if (e.code === "Space") {
        hardDrop();
        actionTaken = true;
      }
      
      if (e.key === "Escape") {
        const target = e.target as HTMLElement;
        if (e.isTrusted && (target.tagName === "BODY" || target.tagName === "CANVAS")) {
          togglePause();
        }
      }

      if (e.key === "p" || e.key === "P" || e.code === "KeyP") {
        togglePause();
      }

      if (e.key === "Enter" && getIsGameOver()) {
        restartGame();
        lastDropRef.current = performance.now();
      }

      if (actionTaken && e.isTrusted) {
        playControlSound(e.key);
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
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        className="tetris-canvas rounded-lg aspect-[5/10] max-w-full"
      />
      {mobileLayout}
    </div>
  );
}