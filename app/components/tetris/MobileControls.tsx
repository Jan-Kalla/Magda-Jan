"use client";
import {
  moveLeft,
  moveRight,
  rotate,
  softDrop,
  hardDrop,
  restartGame,
  getIsGameOver,
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
import ScorePanel from "./ScorePanel";
import TetrisLeaderboard from "./TetrisLeaderboard";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return isMobile;
}

export default function MobileControls() {
  const isMobile = useIsMobile();
  const isGameOver = getIsGameOver();

  if (!isMobile) return null;

  return (
    <div
      className="flex flex-col items-center w-full min-h-screen p-4"
      style={{ background: "linear-gradient(to bottom, #FAD6C8, #4E0113)" }}
    >
      {/* Środek: NextPieces po lewej, plansza w środku, ScorePanel po prawej */}
      <div className="flex flex-row items-start justify-center gap-4 w-full max-w-md mb-4">
        <NextPieces />
        <TetrisGame />
        <div className="w-28">
          <ScorePanel />
        </div>
      </div>

      {/* Przyciski mobilne pod planszą */}
      <div className="mt-4 flex flex-col items-center gap-4 w-full max-w-xs">
        <div className="grid grid-cols-3 gap-4 w-full">
          <button onClick={moveLeft} className="control-btn">
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button onClick={rotate} className="control-btn">
            <ArrowPathRoundedSquareIcon className="w-6 h-6" />
          </button>
          <button onClick={moveRight} className="control-btn">
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 w-2/3">
          <button onClick={softDrop} className="control-btn">
            <ChevronDownIcon className="w-6 h-6" />
          </button>
          <button onClick={hardDrop} className="control-btn">
            <ChevronDoubleDownIcon className="w-6 h-6" />
          </button>
        </div>

        {isGameOver && (
          <button
            onClick={restartGame}
            className="mt-6 w-full py-3 bg-[#4E0113] text-white text-lg font-bold rounded shadow"
          >
            Restart
          </button>
        )}
      </div>

      {/* Leaderboard na dole */}
      <div className="mt-6 w-full max-w-md">
        <TetrisLeaderboard />
      </div>
    </div>
  );
}
