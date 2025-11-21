"use client";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";

export default function CompetitionPage() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-[#FAD6C8] to-[#4E0113] pt-0 md:pt-[112px]">
        <div className="flex items-center justify-center h-[70vh]">
          <Link
            href="/rywalizacja/tetris"
            className="px-10 py-5 bg-[#4E0113] text-white text-2xl font-bold rounded-lg shadow-lg hover:bg-[#6b1326] transition cursor-pointer"
          >
            Tetris
          </Link>
        </div>
      </div>
    </>
  );
}
