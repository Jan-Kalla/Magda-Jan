"use client";
import React from "react";

export default function MainCourseSelector({ dishes, mainCourse, setMainCourse }: any) {
  return (
    <div className="mt-8">
      <h2 className="font-serif text-3xl md:text-4xl font-light text-[#4c4a1e] mb-10 text-center uppercase tracking-[0.1em] border-t border-[#4c4a1e]/20 pt-10">
        Danie główne
      </h2>
      <div className="space-y-6 mb-12">
        {dishes.map((dish: any) => (
          <label
            key={dish.name}
            // ZMIANA: Dodano sm:min-h-[240px] md:min-h-[280px] aby wymusić wysokość kafelka
            className={`relative flex flex-col sm:flex-row items-stretch border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 sm:min-h-[240px] md:min-h-[280px] ${
              mainCourse === dish.name
                ? "border-[#4c4a1e] bg-white/60 shadow-xl scale-[1.01]"
                : "border-white/50 hover:border-[#4c4a1e]/50 hover:bg-white/30"
            }`}
          >
            <input
              type="radio"
              name="mainCourse"
              value={dish.name}
              checked={mainCourse === dish.name}
              onChange={(e) => setMainCourse(e.target.value)}
              className="hidden"
            />
            
            {/* ZDJĘCIE */}
            {dish.img && (
              // ZMIANA: Zwiększono szerokość na desktopie (md:w-72) i wysokość na mobile (h-64)
              <div className="relative w-full sm:w-56 md:w-72 flex-shrink-0 h-64 sm:h-auto">
                <img 
                  src={dish.img} 
                  alt={dish.name} 
                  className="absolute inset-0 w-full h-full object-cover" 
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-10 pointer-events-none">
                  <span className="block text-right text-[10px] text-white/90 uppercase tracking-widest font-sans">
                    Propozycja podania
                  </span>
                </div>
              </div>
            )}
            
            {/* TEKST */}
            {/* ZMIANA: Zwiększono padding (p-8 md:p-12) */}
            <div className="p-8 md:p-12 flex items-center flex-1">
              <span className="text-[#4c4a1e] font-serif text-xl md:text-3xl text-center sm:text-left leading-relaxed">
                {dish.name}
              </span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}