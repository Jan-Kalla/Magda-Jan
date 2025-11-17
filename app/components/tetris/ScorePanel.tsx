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
    <div className="panel-card w-28 text-center">
      <p className="text-sm text-gray-300">Score</p>
      <p className="text-xl font-bold">{score}</p>
      <p className="text-sm text-gray-300 mt-2">Level</p>
      <p className="text-lg font-semibold">{level}</p>
    </div>
  );
}
