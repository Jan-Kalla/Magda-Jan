"use client";
import { useState, useEffect } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronDoubleDownIcon,
  ArrowPathRoundedSquareIcon,
  PauseIcon, // ZMIANA: Dodano import PlayIcon dla dynamicznej zmiany
  PlayIcon,
} from "@heroicons/react/24/solid";

import TetrisGame from "./TetrisGame";
import NextPieces from "./NextPieces";
import TetrisLeaderboard from "./TetrisLeaderboard";
import ScorePanel from "./ScorePanel";
// ZMIANA: ImportgetIsPaused, aby pobrać stan gry
import { getIsGameOver, getIsPaused } from "./gameLogic";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile("ontouchstart" in window || window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return isMobile;
}

export default function MobileControls() {
  const isMobile = useIsMobile();
  const isGameOver = getIsGameOver();
  // ZMIANA: Stan isPaused aktualizowany przez rAF
  const [isPaused, setIsPaused] = useState(false);
  const [, setForceRender] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      // ZMIANA: Pobierz aktualny stan pauzy w pętli renderingu
      setIsPaused(getIsPaused());
      setForceRender(prev => prev + 1);
      raf = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!isMobile) return null;

  // Symulacja klawiatury dla podtrzymania ruchu
  const simulateKeyDown = (key: string, code: string = "") => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key, code, bubbles: true, cancelable: true }));
  };
  const simulateKeyUp = (key: string, code: string = "") => {
    window.dispatchEvent(new KeyboardEvent("keyup", { key, code, bubbles: true, cancelable: true }));
  };

  return (
    // ZMIANA: Rozciągnięcie widoku na telefonie do samych bocznych krawędzi
    <div className="flex flex-col items-center min-h-screen overflow-x-hidden select-none w-[calc(100%+2rem)] -ml-4">
      
      {/* Zapowiedzi 3 klocków centralnie nad planszą */}
      <div className="mt-4 mb-2">
        <NextPieces />
      </div>

      {/* Kontener planszy i symetrycznych kolumn po bokach */}
      <div className="relative w-full flex justify-center mt-2 max-w-[500px] mx-auto">
        
        {/* Plansza w centrum */}
        <div className="w-full px-[5.5rem] sm:px-[6.5rem]">
          <TetrisGame />
        </div>

        {/* LEWA KOLUMNA: Przyklejona do lewej krawędzi (left-0) */}
        <div className="absolute left-0 top-0 bottom-0 w-[5rem] sm:w-[6rem] flex flex-col justify-between items-stretch">
          
          {/* ZMIANA: Dynamiczna zmiana ikony Pauzy (Pause/Play) */}
          <button
            onClick={() => simulateKeyDown("Escape")}
            className="w-full h-[90px] bg-black/40 border-2 border-[#4E0113] border-l-0 rounded-r-2xl shadow-[0_0_10px_rgba(78,1,19,0.6)] flex items-center justify-center active:bg-black/60 touch-none"
          >
            {isPaused ? (
              <PlayIcon className="w-8 h-8 text-white" />
            ) : (
              <PauseIcon className="w-8 h-8 text-white" />
            )}
          </button>

          <div className="flex flex-col gap-1 h-[55%] w-full">
            <button
              onPointerDown={(e) => { e.preventDefault(); simulateKeyDown("ArrowLeft"); }}
              onPointerUp={(e) => { e.preventDefault(); simulateKeyUp("ArrowLeft"); }}
              onPointerLeave={() => simulateKeyUp("ArrowLeft")}
              onPointerCancel={() => simulateKeyUp("ArrowLeft")}
              onContextMenu={(e) => e.preventDefault()}
              className="w-full h-1/2 bg-[#4E0113] text-white rounded-r-2xl shadow-md flex items-center justify-center touch-none active:brightness-125"
            >
              <ChevronLeftIcon className="w-8 h-8" />
            </button>
            <button
              onPointerDown={(e) => { e.preventDefault(); simulateKeyDown("ArrowUp"); }}
              onPointerUp={(e) => { e.preventDefault(); simulateKeyUp("ArrowUp"); }}
              onPointerLeave={() => simulateKeyUp("ArrowUp")}
              onPointerCancel={() => simulateKeyUp("ArrowUp")}
              onContextMenu={(e) => e.preventDefault()}
              className="w-full h-1/2 bg-[#6b1326] text-white rounded-r-2xl shadow-md flex items-center justify-center touch-none active:brightness-125"
            >
              <ArrowPathRoundedSquareIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* PRAWA KOLUMNA: Przyklejona do prawej krawędzi (right-0) */}
        <div className="absolute right-0 top-0 bottom-0 w-[5rem] sm:w-[6rem] flex flex-col justify-between items-stretch">
          
          {/* Panel ze statystykami - symetrycznie od prawej */}
          <div className="w-full">
            <ScorePanel compact />
          </div>

          <div className="flex flex-col gap-1 h-[55%] w-full">
            <button
              onPointerDown={(e) => { e.preventDefault(); simulateKeyDown("ArrowRight"); }}
              onPointerUp={(e) => { e.preventDefault(); simulateKeyUp("ArrowRight"); }}
              onPointerLeave={() => simulateKeyUp("ArrowRight")}
              onPointerCancel={() => simulateKeyUp("ArrowRight")}
              onContextMenu={(e) => e.preventDefault()}
              className="w-full h-1/2 bg-[#4E0113] text-white rounded-l-2xl shadow-md flex items-center justify-center touch-none active:brightness-125"
            >
              <ChevronRightIcon className="w-8 h-8" />
            </button>
            <button
              onPointerDown={(e) => { e.preventDefault(); simulateKeyDown("ArrowDown"); }}
              onPointerUp={(e) => { e.preventDefault(); simulateKeyUp("ArrowDown"); }}
              onPointerLeave={() => simulateKeyUp("ArrowDown")}
              onPointerCancel={() => simulateKeyUp("ArrowDown")}
              onContextMenu={(e) => e.preventDefault()}
              className="w-full h-1/2 bg-[#6b1326] text-white rounded-l-2xl shadow-md flex items-center justify-center touch-none active:brightness-125"
            >
              <ChevronDownIcon className="w-8 h-8" />
            </button>
          </div>
        </div>

      </div>

      {/* Twarde lądowanie pod planszą, ale również wyrównane marginesami */}
      <div className="mt-3 w-full px-4 max-w-[500px]">
        <button
          onPointerDown={(e) => { e.preventDefault(); simulateKeyDown(" ", "Space"); }}
          onPointerUp={(e) => { e.preventDefault(); simulateKeyUp(" ", "Space"); }}
          onPointerLeave={() => simulateKeyUp(" ", "Space")}
          onPointerCancel={() => simulateKeyUp(" ", "Space")}
          onContextMenu={(e) => e.preventDefault()}
          className="w-full bg-[#4E0113] text-white py-4 rounded-xl shadow-md flex items-center justify-center text-xl font-bold active:brightness-125 touch-none"
        >
          <ChevronDoubleDownIcon className="w-8 h-8" />
        </button>
      </div>

      {/* Przycisk Restartu */}
      {isGameOver && (
        <button
          onClick={() => simulateKeyDown("Enter", "Enter")}
          className="mt-6 w-full max-w-[200px] py-3 bg-[#4E0113] text-white text-lg font-bold rounded-xl shadow-lg"
        >
          Restart
        </button>
      )}

      {/* Tablica liderów */}
      <div className="mt-6 w-full px-6 pb-12">
        <TetrisLeaderboard />
      </div>

    </div>
  );
}