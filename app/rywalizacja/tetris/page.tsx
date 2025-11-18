"use client";
import Navbar from "@/app/components/Navbar";
import ResponsiveTetrisLayout from "@/app/components/tetris/ResponsiveTetrisLayout";
import MobileTetrisLayout from "@/app/components/tetris/MobileControls";
import { useEffect, useState } from "react";

export default function TetrisPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    const mobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua.toLowerCase());
    setIsMobile(mobile);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAD6C8] to-[#4E0113] pt-20">
      <Navbar />
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-[#4E0113] mb-6">Tetris</h1>
        {isMobile ? <MobileTetrisLayout /> : <ResponsiveTetrisLayout />}
      </div>
    </div>
  );
}