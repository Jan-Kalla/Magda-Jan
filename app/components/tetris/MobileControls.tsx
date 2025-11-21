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

        <div className="w-20">
          <div className="panel-card text-center px-2 py-3 h-auto min-h-0 flex flex-col justify-center items-center shadow-md space-y-1">
            <p className="text-[10px] leading-none text-gray-300">Score</p>
            <p className="text-base leading-none font-bold">{score}</p>
            <p className="text-[10px] leading-none text-gray-300 mt-1">Level</p>
            <p className="text-sm leading-none font-semibold">{level}</p>
          </div>
        </div>
      </div>


      {/* Plansza + panel wyniku */}
      <div className="flex flex-row items-start justify-center gap-3 w-full max-w-full px-2">
        {/* Plansza */}
        <div className="flex flex-col items-center mt-2">
          <TetrisGame />
        </div>
      </div>

      {/* Przyciski */}
      <div className="mt-4 flex flex-col items-center gap-4 w-full max-w-xs pl-12">
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

      {/* Leaderboard */}
      <div className="mt-6 w-full">
        <TetrisLeaderboard />
      </div>
    </div>
  );
}
