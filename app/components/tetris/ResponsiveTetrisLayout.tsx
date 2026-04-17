"use client";
import TetrisGame from "./TetrisGame";
import ScorePanel from "./ScorePanel";
import NextPieces from "./NextPieces";
import TetrisLeaderboard from "./TetrisLeaderboard";

export default function ResponsiveTetrisLayout() {
  return (
    <div className="min-h-screen w-full p-4">
      <div className="flex flex-col md:flex-row gap-6 justify-center items-start w-full max-w-5xl mx-auto">
      {/* Plansza w centrum */}
        <div className="flex flex-col items-center w-full md:w-auto">
          {/* ZMIANA: Elegancka instrukcja o pauzie widoczna tylko na komputerach */}
          <div className="hidden md:block text-[#4E0113] text-lg font-semibold mb-2 font-sans tracking-wide">
            Naciśnij <kbd className="font-sans px-2 py-0.5 bg-black/40 rounded border border-white/20 text-white shadow-sm mx-1">ESC</kbd> aby zapauzować
          </div>
          <TetrisGame/>
        </div>

        {/* Prawa kolumna */}
        <div className="flex flex-col items-center gap-6 w-full md:w-auto">
          <NextPieces />
          <div className="w-full flex justify-center mt-2">
            <ScorePanel />
          </div>
          <div className="hidden md:block w-full mt-4">
            <TetrisLeaderboard />
          </div>
        </div>
      </div>

      {/* Leaderboard na mobile na dole */}
      <div className="mt-6 w-full max-w-md mx-auto md:hidden">
        <TetrisLeaderboard />
      </div>
    </div>
  );
}