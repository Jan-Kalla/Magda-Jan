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

  // WERSJA MOBILNA: Przyklejona do prawej krawędzi, powiększona i spójna symetrycznie
  if (compact) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-[90px] bg-black/40 border-2 border-[#4E0113] border-r-0 rounded-l-2xl shadow-[0_0_10px_rgba(78,1,19,0.6)] text-white space-y-1">
        <p className="text-xs leading-none text-gray-300 uppercase tracking-wider">Score</p>
        <p className="text-xl leading-none font-bold">{score}</p>
        <p className="text-xs leading-none text-gray-300 uppercase tracking-wider mt-1">Level</p>
        <p className="text-lg leading-none font-semibold">{level}</p>
      </div>
    );
  }

  // WERSJA DESKTOPOWA: Pozioma, znacznie niższa, z estetyczną przedziałką
  return (
    <div className="panel-card flex flex-row justify-around items-center w-full md:min-w-[340px] px-6 py-4">
      <div className="flex flex-col items-center">
        <p className="text-xs text-gray-300 uppercase tracking-widest mb-1">Score</p>
        <p className="text-xl font-bold text-[#FDF9EC]">{score}</p>
      </div>
      
      <div className="h-12 w-px bg-white/20 mx-4"></div>
      
      <div className="flex flex-col items-center">
        <p className="text-xs text-gray-300 uppercase tracking-widest mb-1">Level</p>
        <p className="text-xl font-bold text-[#FDF9EC]">{level}</p>
      </div>
    </div>
  );
}