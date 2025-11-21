"use client";
import { useState, useEffect } from "react";
import { getScore, getLevel } from "./gameLogic";

type Props = {
  compact?: boolean; // mobile-mini wariant
};

export default function ScorePanel({ compact = false }: Props) {
  const [score, setScore] = useState(getScore());
  const [level, setLevel] = useState(getLevel());

  useEffect(() => {
    let raf: number;
    const update = () => {
      setScore(getScore());
      setLevel(getLevel());
      raf = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className={[
        "panel-card text-center flex flex-col justify-center",
        compact ? "w-20 px-2 py-3 h-auto min-h-0 space-y-1" : "w-32 md:w-64 px-4 py-6 space-y-2",
      ].join(" ")}
    >
      <p className={compact ? "text-[10px] leading-none text-gray-300" : "text-sm text-gray-300"}>
        Score
      </p>
      <p className={compact ? "text-base leading-none font-bold" : "text-2xl font-bold"}>
        {score}
      </p>
      <p className={compact ? "text-[10px] leading-none text-gray-300 mt-1" : "text-sm text-gray-300 mt-4"}>
        Level
      </p>
      <p className={compact ? "text-sm leading-none font-semibold" : "text-xl font-semibold"}>
        {level}
      </p>
    </div>
  );
}
