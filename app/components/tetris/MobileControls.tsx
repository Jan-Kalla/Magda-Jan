"use client";
import {
  moveLeft,
  moveRight,
  rotate,
  softDrop,
  hardDrop,
  restartGame,
  getIsGameOver,
  getScore,
  getLevel,
} from "./gameLogic";
import { useState, useEffect } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronDoubleDownIcon,
  ArrowPathRoundedSquareIcon,
} from "@heroicons/react/24/solid";

import TetrisGame from "./TetrisGame";
import NextPieces from "./NextPieces";
import TetrisLeaderboard from "./TetrisLeaderboard";

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
  const [score, setScore] = useState(getScore());
  const [level, setLevel] = useState(getLevel());

  useEffect(() => {
    let raf = 0;
    const update = () => {
      setScore(getScore());
      setLevel(getLevel());
      raf = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!isMobile) return null;

  return (
    <div className="flex flex-col items-center w-full min-h-screen overflow-hidden">
      {/* NextPieces + ScorePanel obok siebie */}
      <div className="flex flex-row justify-center items-start mt-8 gap-4 mb-4">
        <NextPieces />

        {/* Compact score panel */}
        <div className="w-20 mt-2">
          <div className="panel-card text-center px-2 py-3 h-auto min-h-0 flex flex-col justify-center items-center shadow-md space-y-1">
            <p className="text-[10px] leading-none text-gray-300">Score</p>
            <p className="text-base leading-none font-bold">{score}</p>
            <p className="text-[10px] leading-none text-gray-300 mt-1">Level</p>
            <p className="text-sm leading-none font-semibold">{level}</p>
          </div>
        </div>
      </div>
     {/* Plansza z przyciskami po bokach od środka w dół */}

      <div className="relative w-full flex justify-center mt-2">
        {/* Plansza */}
        <div className="w-full px-4 max-w-[calc(100%-8rem)]">
          <TetrisGame />
        </div>

        {/* Lewa kolumna: MoveLeft + Rotate */}
        <div className="absolute left-0 top-1/2 bottom-0 w-20 flex flex-col justify-around items-center px-1">
          <button
            onClick={moveLeft}
            aria-label="Move left"
            className="w-full h-1/2 bg-[#4E0113] text-white rounded-r-lg shadow-md flex items-center justify-center active:scale-[0.98]"
          >
            <ChevronLeftIcon className="w-8 h-8" />
          </button>
          <button
            onClick={rotate}
            aria-label="Rotate"
            className="w-full h-1/2 bg-[#6b1326] text-white rounded-r-lg shadow-md flex items-center justify-center active:scale-[0.98]"
          >
            <ArrowPathRoundedSquareIcon className="w-8 h-8" />
          </button>
        </div>

        {/* Prawa kolumna: MoveRight + SoftDrop */}
        <div className="absolute right-0 top-1/2 bottom-0 w-20 flex flex-col justify-around items-center px-1">
          <button
            onClick={moveRight}
            aria-label="Move right"
            className="w-full h-1/2 bg-[#4E0113] text-white rounded-l-lg shadow-md flex items-center justify-center active:scale-[0.98]"
          >
            <ChevronRightIcon className="w-8 h-8" />
          </button>
          <button
            onClick={softDrop}
            aria-label="Soft drop"
            className="w-full h-1/2 bg-[#6b1326] text-white rounded-l-lg shadow-md flex items-center justify-center active:scale-[0.98]"
          >
            <ChevronDownIcon className="w-8 h-8" />
          </button>
        </div>
      </div>

      {/* HardDrop — pełna szerokość pod planszą */}
      <div className="mt-3 w-full px-2">
        <button
          onClick={hardDrop}
          aria-label="Hard drop"
          className="w-full bg-[#4E0113] text-white py-5 rounded-lg shadow-md flex items-center justify-center text-xl font-bold active:scale-[0.98]"
        >
          <ChevronDoubleDownIcon className="w-8 h-8" />
        </button>
      </div>


      {/* Restart tylko po Game Over */}
      {isGameOver && (
        <button
          onClick={restartGame}
          className="mt-6 w-full max-w-xs py-3 bg-[#4E0113] text-white text-lg font-bold rounded-lg shadow"
        >
          Restart
        </button>
      )}

      {/* Leaderboard */}
      <div className="mt-6 w-full">
        <TetrisLeaderboard />
      </div>
    </div>
  );
}
