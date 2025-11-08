"use client";
import { useState } from "react";
import { sounds, playHitAlternating } from "@/app/components/tetris/sounds";

export default function TestSounds() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col gap-4 p-4">
      <button
        onClick={() => {
          playHitAlternating();
          setCount((c) => c + 1);
        }}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Play Hit ({count})
      </button>
      <button
        onClick={() => sounds.line.play()}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Play Line
      </button>
      <button
        onClick={() => sounds.gameover.play()}
        className="px-4 py-2 bg-red-600 text-white rounded"
      >
        Play Game Over
      </button>
    </div>
  );
}
