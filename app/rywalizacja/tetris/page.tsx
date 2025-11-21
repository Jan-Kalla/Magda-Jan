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
    <>
      <Navbar />
      <div
        className="min-h-screen w-full pt-0 md:pt-[112px] px-4"
        style={{ background: "linear-gradient(to bottom, #FAD6C8, #4E0113)" }}
      >
        <h1 className="text-3xl font-bold text-[#4E0113] mb-6 text-center">Tetris</h1>
        {isMobile ? <MobileTetrisLayout /> : <ResponsiveTetrisLayout />}
      </div>
    </>
  );
}