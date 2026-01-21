"use client";
import { HeartIcon } from "@heroicons/react/24/solid";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 bg-[#4E0113] text-[#FAD6C8] py-8 border-t border-[#FAD6C8]/20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        
        {/* Górna linia - Imiona */}
        <p className="font-serif text-xl tracking-widest mb-4 opacity-90">
          Magdalena & Jan
        </p>

        {/* Separator */}
        <div className="w-16 h-[1px] bg-[#FAD6C8]/30 mx-auto mb-4"></div>

        {/* Dolna linia - Credits */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-xs md:text-sm font-light opacity-60">
          <span>&copy; {currentYear} Wszelkie prawa zastrzeżone.</span>
          <span className="hidden md:inline">•</span>
          <span className="flex items-center gap-1">
            Stworzone z <HeartIcon className="w-3 h-3 text-red-400 animate-pulse" /> przez Pana Młodego
          </span>
        </div>

      </div>
    </footer>
  );
}