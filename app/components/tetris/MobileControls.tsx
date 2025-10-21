"use client";
import { moveLeft, moveRight, rotate, softDrop, hardDrop, togglePause, restartGame, getIsGameOver } from "./gameLogic";

export default function MobileControls() {
  return (
    <div className="mt-4 flex flex-col items-center gap-2 w-full max-w-xs">
      {/* Górny rząd: pauza i restart */}
      <div className="grid grid-cols-2 gap-2 w-full">
        <button
          onClick={togglePause}
          className="bg-[#4E0113] text-white py-2 rounded shadow"
        >
          ⏸
        </button>
        <button
          onClick={() => {
            if (getIsGameOver()) restartGame();
          }}
          className="bg-[#4E0113] text-white py-2 rounded shadow"
        >
          🔄↩️
        </button>
      </div>

      {/* Środkowy rząd: lewo, obrót, prawo */}
      <div className="grid grid-cols-3 gap-2 w-full">
        <button
          onClick={moveLeft}
          className="bg-[#4E0113] text-white py-2 rounded shadow"
        >
          ◀️
        </button>
        <button
          onClick={rotate}
          className="bg-[#4E0113] text-white py-2 rounded shadow"
        >
          🔄
        </button>
        <button
          onClick={moveRight}
          className="bg-[#4E0113] text-white py-2 rounded shadow"
        >
          ▶️
        </button>
      </div>

      {/* Dolny rząd: miękki i twardy drop */}
      <div className="grid grid-cols-2 gap-2 w-full">
        <button
          onClick={softDrop}
          className="bg-[#4E0113] text-white py-2 rounded shadow"
        >
          ⬇️
        </button>
        <button
          onClick={hardDrop}
          className="bg-[#4E0113] text-white py-2 rounded shadow"
        >
          ⬇️⬇️
        </button>
      </div>
    </div>
  );
}
