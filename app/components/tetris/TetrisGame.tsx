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
  getIsGameOver,
  setPieceLockCallback,
  setLineClearCallback,
  getLevel,
  setLevelCallback,
  setScoreCallback,
  securityCheck,
  verifyFairPlay, //
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

  const [cheaterCaught, setCheaterCaught] = useState(false);

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

      // 🚨 TARCZA BEZWZGLĘDNA 🚨
      const isLegit = verifyFairPlay(score);

      if (!isLegit) {
        setCheaterCaught(true);
        
        // ZMIANA: Zamiast zawodnego 'upsert', bezpiecznie weryfikujemy istnienie rekordu
        const { data: existingCheater } = await supabase
          .from("tetris_scores")
          .select("id")
          .eq("guest_id", guest.id)
          .maybeSingle();

        if (existingCheater) {
          // Gracz grał już wcześniej uczciwie, ale teraz oszukuje -> Aktualizujemy jego wiersz
          const { error } = await supabase
            .from("tetris_scores")
            .update({ score: 0, level: 0, is_cheater: true })
            .eq("guest_id", guest.id);
            
          if (error) console.error("Błąd podczas oznaczania oszusta (Update):", error);
        } else {
          // Gracz oszukuje przy pierwszej próbie zagrania -> Tworzymy nowy wiersz
          const { error } = await supabase
            .from("tetris_scores")
            .insert({ guest_id: guest.id, score: 0, level: 0, is_cheater: true });
            
          if (error) console.error("Błąd podczas oznaczania oszusta (Insert):", error);
        }
          
        return; // Zakończenie procesu bez zapisu uczciwego wyniku
      }

      // === NORMALNY ZAPIS UCZCIWEGO WYNIKU (Poniżej bez zmian) ===
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
          
        if (insertError) console.error("❌ BŁĄD TWORZENIA NOWEGO REKORDU:", insertError);
      } else {
        const improvedScore = score > (existing.score ?? 0);
        const improvedLevel = currentLevel > (existing.level ?? 0);

        if (improvedScore || improvedLevel) {
          const { error: updateError } = await supabase
            .from("tetris_scores")
            .update({
              score: improvedScore ? score : existing.score,
              level: improvedLevel ? currentLevel : existing.level,
            })
            .eq("guest_id", guest.id);

          if (updateError) console.error("❌ SUPABASE ODRZUCIŁ AKTUALIZACJĘ:", updateError);
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

      // 🚨 BEZWZGLĘDNY MONITOR PAMIĘCI UŻYTKOWNIKA 🚨
      // Funkcja działa 60 razy na sekundę. Jeśli haker wpisze wynik w konsolę,
      // gra złapie go zanim w ogóle zdąży on wrócić do okienka gry!
      securityCheck();

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
    // ZMIANA: Dodano klasę 'relative', aby absolutna nakładka trzymała się wymiarów gry
    <div className="flex flex-col items-center relative">
      
      {/* 🚨 NAKŁADKA HAŃBY (Zasłania grę po wykryciu oszustwa) 🚨 */}
      {cheaterCaught && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md rounded-lg p-6 text-center border-2 border-[#C05454] shadow-[0_0_50px_rgba(192,84,84,0.3)]">
          <span className="text-6xl mb-4">🕵️‍♂️</span>
          <h2 className="font-serif text-3xl text-[#C05454] font-bold mb-4 uppercase tracking-widest">
            Mamy Cię, Hakerze!
          </h2>
          <p className="text-[#FDF9EC] font-sans text-sm md:text-base leading-relaxed mb-8 max-w-[250px]">
            Myślałeś, że tak łatwo obejdziesz system? Nie z Johnym takie numery! Spróbuj swoich sił w uczciwej grze.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-[#C05454] text-[#FDF9EC] px-6 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-[#4E0113] transition-colors shadow-lg"
          >
            Odśwież ze wstydem
          </button>
        </div>
      )}

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