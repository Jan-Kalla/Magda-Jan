"use client";
import TetrisGame from "./TetrisGame";
import ScorePanel from "./ScorePanel";
import NextPieces from "./NextPieces";
import TetrisLeaderboard from "./TetrisLeaderboard";
import MobileControls from "./MobileControls";

export default function ResponsiveTetrisLayout() {
  return (
    <div className="min-h-screen w-full p-4" style={{ background: "linear-gradient(to bottom, #FAD6C8, #4E0113)" }}>
      <div className="flex flex-col md:flex-row gap-6 justify-center items-start w-full max-w-5xl mx-auto">

        {/* Plansza w centrum */}
        <div className="flex flex-col items-center w-full md:w-auto">
          <TetrisGame mobileLayout={<div className="flex md:hidden w-full justify-center"><MobileControls /></div>} />
        </div>

        {/* Prawa kolumna */}
      <div className="flex flex-col items-center gap-8 w-full md:w-auto">
        <div className="flex flex-row gap-16 w-full justify-center">
          <NextPieces />
            <div className="w-64 mt-16">
            <ScorePanel />
            </div>
        </div>
        <div className="hidden md:block w-full">
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
