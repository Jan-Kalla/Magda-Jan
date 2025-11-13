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
    <div className="mt-4 flex flex-col items-center gap-4 w-full max-w-xs">
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
  );
}
