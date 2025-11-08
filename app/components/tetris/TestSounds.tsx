"use client";
import { useState } from "react";
import { sounds, playHitAlternating } from "./sounds";

export default function TestSounds() {
  const [count, setCount] = useState(0);

  const handlePlay = () => {
    playHitAlternating(); // naprzemiennie hit1/hit2
    setCount((c) => c + 1);
  };

  const handleLine = () => {
    sounds.line.play();
  };

  const handleGameOver = () => {
    sounds.gameover.play();
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <button
        onClick={handlePlay}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Play Hit ({count})
      </button>
      <button
        onClick={handleLine}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Play Line
      </button>
      <button
        onClick={handleGameOver}
        className="px-4 py-2 bg-red-600 text-white rounded"
      >
        Play Game Over
      </button>
    </div>
  );
}
