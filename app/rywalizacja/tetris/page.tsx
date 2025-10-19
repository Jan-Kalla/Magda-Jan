"use client";
import Navbar from "@/app/components/Navbar";
import TetrisGame from "@/app/components/tetris/TetrisGame";

export default function TetrisPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAD6C8] to-[#4E0113] pt-20">
      <Navbar />
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-[#4E0113] mb-6">Tetris</h1>
        <TetrisGame />
      </div>
    </div>
  );
}
