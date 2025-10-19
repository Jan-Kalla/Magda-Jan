"use client";

import Navbar from "@/app/components/Navbar";

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAD6C8] to-[#4E0113] pt-20">
      <Navbar />
      <div className="flex items-center justify-center h-[70vh]">
        <h1 className="text-3xl font-bold text-[#4E0113]">
          Tutaj jeszcze nic nie ma
        </h1>
      </div>
    </div>
  );
}
