"use client";

import Navbar from "@/app/components/Navbar";

export default function WyprawaPage() {
  return (
    <div className="min-h-screen bg-[#FAD6C8] pt-[112px] pb-20 px-4 text-[#4E0113]">
      <Navbar />
      <div className="max-w-md mx-auto text-center mt-10">
        <h1 className="text-3xl font-bold mb-4">Wyprawa 🕵️‍♂️</h1>
        <p className="text-lg opacity-80">
          Ta sekcja jest w trakcie przygotowywania. <br />
          Zajrzyj tu wkrótce!
        </p>
      </div>
    </div>
  );
}