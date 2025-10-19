"use client";
import { moveLeft, moveRight, rotate, softDrop, hardDrop } from "./gameLogic";

export default function MobileControls() {
  return (
    <div className="mt-4 grid grid-cols-3 gap-2 w-64">
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

      <button
        onClick={softDrop}
        className="col-span-2 bg-[#4E0113] text-white py-2 rounded shadow"
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
  );
}
