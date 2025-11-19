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

  // Stan do wyświetlania wyniku i poziomu (reaktywnie)
  const [score, setScore] = useState(getScore());
  const [level, setLevel] = useState(getLevel());

  // Aktualizacja w pętli rAF (lekka i bez freeze'ów)
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
    <div
      className="flex flex-col items-center w-full min-h-screen p-4 overflow-hidden"
      style={{ background: "linear-gradient(to bottom, #FAD6C8, #4E0113)" }}
    >
      {/* Plansza z bocznymi panelami (wrap dla małych ekranów, działa także w poziomie) */}
     <div className="flex flex-row items-start justify-center gap-3 w-full max-w-full overflow-x-auto">
        {/* NextPieces po lewej (kompaktowe) */}
        <div className="flex flex-col items-center">
          <NextPieces />
        </div>

        {/* Plansza w środku */}
        <div className="flex flex-col items-center">
          <TetrisGame />
        </div>

        {/* Smukły, wysoki panel wyniku po prawej (mobile-only wariant) */}
        <div className="w-20">
          <div className="panel-card text-center py-6 px-2 h-full flex flex-col justify-center items-center">
            <p className="text-xs text-gray-300">Score</p>
            <p className="text-xl font-bold">{score}</p>
            <p className="text-xs text-gray-300 mt-2">Level</p>
            <p className="text-lg font-semibold">{level}</p>
          </div>
        </div>
      </div>

      {/* Przyciski mobilne pod planszą */}
      <div className="mt-4 flex flex-col items-center gap-4 w-full max-w-xs pl-12">
        {/* Pierwszy rząd: Left / Rotate / Right */}
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

        {/* Drugi rząd: Down / Hard Drop */}
        <div className="grid grid-cols-2 gap-6 w-2/3">
          <button onClick={softDrop} className="control-btn">
            <ChevronDownIcon className="w-6 h-6" />
          </button>
          <button onClick={hardDrop} className="control-btn">
            <ChevronDoubleDownIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Restart tylko po Game Over */}
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
      <div className="mt-6 w-full">
        <TetrisLeaderboard />
      </div>
    </div>
  );
}
