"use client";
import { useState, useEffect, useRef } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronDoubleDownIcon,
  ArrowPathRoundedSquareIcon,
  PauseIcon,
  PlayIcon,
} from "@heroicons/react/24/solid";

import TetrisGame from "./TetrisGame";
import NextPieces from "./NextPieces";
import TetrisLeaderboard from "./TetrisLeaderboard";
import ScorePanel from "./ScorePanel";
import { getIsGameOver, getIsPaused, togglePause } from "./gameLogic";
import { sounds } from "./sounds"; 

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
  const [isPaused, setIsPaused] = useState(false);
  const [, setForceRender] = useState(0);

  const bottomButtonRef = useRef<HTMLDivElement>(null);
  
  // ZMIANA: Ref będzie wskazywał teraz na element H2 (Nagłówek) wewnątrz Leaderboardu
  const leaderboardHeaderRef = useRef<HTMLHeadingElement>(null); 
  
  // ZMIANA: Pamiętamy, czy zrobiliśmy już wielki scroll do rankingu
  const [hasScrolledToLeaderboard, setHasScrolledToLeaderboard] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      setIsPaused(getIsPaused());
      setForceRender(prev => prev + 1);
      raf = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(raf);
  }, []);

  // Scroll do przycisków startowych na telefonie (na starcie i po restarcie gry)
  useEffect(() => {
    if (isMobile && bottomButtonRef.current && !isGameOver) {
      const timer = setTimeout(() => {
        bottomButtonRef.current?.scrollIntoView({ 
          behavior: "smooth", 
          block: "end" 
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isMobile, isGameOver]);

  // ZMIANA: Jednorazowy scroll celujący idealnie w nagłówek
  useEffect(() => {
    if (isMobile && isGameOver && leaderboardHeaderRef.current && !hasScrolledToLeaderboard) {
      const timer = setTimeout(() => {
        leaderboardHeaderRef.current?.scrollIntoView({ 
          behavior: "smooth", 
          block: "start" // Góra ekranu zatrzyma się na napisie "Ranking Tetris" (plus mały margines ze scroll-mt)
        });
        setHasScrolledToLeaderboard(true); // Oznaczamy, że akcja została wykonana
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isMobile, isGameOver, hasScrolledToLeaderboard]);

  if (!isMobile) return null;

  const simulateKeyDown = (key: string, code: string = "") => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key, code, bubbles: true, cancelable: true }));
  };
  
  const simulateKeyUp = (key: string, code: string = "") => {
    window.dispatchEvent(new KeyboardEvent("keyup", { key, code, bubbles: true, cancelable: true }));
  };

  const handleControlPress = (e: React.PointerEvent<HTMLButtonElement>, key: string, code: string = "") => {
    e.preventDefault();
    e.stopPropagation(); 

    let rate = 1.0;
    if (key === "ArrowUp") rate = 0.75;
    else if (key === "ArrowDown") rate = 1.5;
    
    sounds.move.rate(rate);
    sounds.move.play();

    simulateKeyDown(key, code);
  };

  return (
    <div className="flex flex-col items-center min-h-screen overflow-x-hidden select-none w-[calc(100%+2rem)] -ml-4">
      
      <div className="mt-4 mb-2">
        <NextPieces />
      </div>

      <div className="relative w-full flex justify-center mt-2 max-w-[500px] mx-auto">
        
        <div className="w-full px-[5.5rem] sm:px-[6.5rem]">
          <TetrisGame />
        </div>

        <div className="absolute left-0 top-0 bottom-0 w-[5rem] sm:w-[6rem] flex flex-col justify-between items-stretch">
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              togglePause();
            }}
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
              onPointerDown={(e) => handleControlPress(e, "ArrowLeft")}
              onPointerUp={(e) => { e.preventDefault(); simulateKeyUp("ArrowLeft"); }}
              onPointerLeave={() => simulateKeyUp("ArrowLeft")}
              onPointerCancel={() => simulateKeyUp("ArrowLeft")}
              onContextMenu={(e) => e.preventDefault()}
              className="no-global-click w-full h-1/2 bg-[#4E0113] text-white rounded-r-2xl shadow-md flex items-center justify-center touch-none active:brightness-125"
            >
              <ChevronLeftIcon className="w-8 h-8" />
            </button>
            <button
              onPointerDown={(e) => handleControlPress(e, "ArrowUp")}
              onPointerUp={(e) => { e.preventDefault(); simulateKeyUp("ArrowUp"); }}
              onPointerLeave={() => simulateKeyUp("ArrowUp")}
              onPointerCancel={() => simulateKeyUp("ArrowUp")}
              onContextMenu={(e) => e.preventDefault()}
              className="no-global-click w-full h-1/2 bg-[#6b1326] text-white rounded-r-2xl shadow-md flex items-center justify-center touch-none active:brightness-125"
            >
              <ArrowPathRoundedSquareIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-[5rem] sm:w-[6rem] flex flex-col justify-between items-stretch">
          
          <div className="w-full">
            <ScorePanel compact />
          </div>

          <div className="flex flex-col gap-1 h-[55%] w-full">
            <button
              onPointerDown={(e) => handleControlPress(e, "ArrowRight")}
              onPointerUp={(e) => { e.preventDefault(); simulateKeyUp("ArrowRight"); }}
              onPointerLeave={() => simulateKeyUp("ArrowRight")}
              onPointerCancel={() => simulateKeyUp("ArrowRight")}
              onContextMenu={(e) => e.preventDefault()}
              className="no-global-click w-full h-1/2 bg-[#4E0113] text-white rounded-l-2xl shadow-md flex items-center justify-center touch-none active:brightness-125"
            >
              <ChevronRightIcon className="w-8 h-8" />
            </button>
            <button
              onPointerDown={(e) => handleControlPress(e, "ArrowDown")}
              onPointerUp={(e) => { e.preventDefault(); simulateKeyUp("ArrowDown"); }}
              onPointerLeave={() => simulateKeyUp("ArrowDown")}
              onPointerCancel={() => simulateKeyUp("ArrowDown")}
              onContextMenu={(e) => e.preventDefault()}
              className="no-global-click w-full h-1/2 bg-[#6b1326] text-white rounded-l-2xl shadow-md flex items-center justify-center touch-none active:brightness-125"
            >
              <ChevronDownIcon className="w-8 h-8" />
            </button>
          </div>
        </div>

      </div>

      <div ref={bottomButtonRef} className="mt-3 w-full px-4 max-w-[500px]">
        <button
          onPointerDown={(e) => handleControlPress(e, " ", "Space")}
          onPointerUp={(e) => { e.preventDefault(); simulateKeyUp(" ", "Space"); }}
          onPointerLeave={() => simulateKeyUp(" ", "Space")}
          onPointerCancel={() => simulateKeyUp(" ", "Space")}
          onContextMenu={(e) => e.preventDefault()}
          className="no-global-click w-full bg-[#4E0113] text-white py-4 rounded-xl shadow-md flex items-center justify-center text-xl font-bold active:brightness-125 touch-none"
        >
          <ChevronDoubleDownIcon className="w-8 h-8" />
        </button>
      </div>

      {isGameOver && (
        <button
          onClick={() => simulateKeyDown("Enter", "Enter")}
          className="mt-6 w-full max-w-[200px] py-3 bg-[#4E0113] text-white text-lg font-bold rounded-xl shadow-lg"
        >
          Restart
        </button>
      )}

      {/* Przekazujemy refa z dopasowaniem do wnętrza komponentu */}
      <div className="mt-6 w-full px-6 pb-12">
        <TetrisLeaderboard ref={leaderboardHeaderRef} />
      </div>

    </div>
  );
}