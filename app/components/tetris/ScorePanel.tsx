"use client";
import { useState, useEffect } from "react";
import { getScore, getLevel } from "./gameLogic";

export default function ScorePanel() {
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
    <div className="panel-card text-center 
                    w-32 md:w-64 
                    w-24 sm:w-28 md:w-64 
                    py-6 flex flex-col justify-center">
      <p className="text-sm text-gray-300">Score</p>
      <p className="text-2xl font-bold">{score}</p>
      <p className="text-sm text-gray-300 mt-4">Level</p>
      <p className="text-xl font-semibold">{level}</p>
    </div>
  );
}
