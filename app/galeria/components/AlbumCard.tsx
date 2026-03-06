"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { LockClosedIcon } from "@heroicons/react/24/outline"; // Zmieniono na outline dla lżejszego wyglądu
import { Album } from "../data";

type Props = {
  album: Album;
  onClick: (album: Album) => void;
};

export default function AlbumCard({ album, onClick }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.1)] cursor-pointer bg-black/5"
      onClick={() => !album.isLockedFuture && onClick(album)}
    >
      {/* TŁO (ZDJĘCIE) */}
      <Image 
        src={album.coverImage} 
        alt={album.title} 
        fill 
        className={`object-cover transition-all duration-700 
          ${album.isLockedFuture 
            ? "grayscale group-hover:grayscale-[50%] opacity-50 group-hover:opacity-30" 
            : "group-hover:scale-[1.03] opacity-90"
          }
        `}
      />

      {/* --- WARIANT 1: ALBUM ZABLOKOWANY (PRZYSZŁY) --- */}
      {album.isLockedFuture ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center transition-all duration-300">
          
          {/* Stan domyślny: Kłódka */}
          <div className="group-hover:opacity-0 transition-opacity duration-300 flex flex-col items-center">
              <div className="bg-black/20 backdrop-blur-md p-5 rounded-full mb-4 border border-white/20 shadow-lg">
                  <LockClosedIcon className="w-8 h-8 text-[#FDF9EC]/90" />
              </div>
              <h3 className="font-serif text-2xl md:text-3xl font-light text-[#FDF9EC] drop-shadow-md tracking-wide">
                {album.title}
              </h3>
          </div>

          {/* Stan HOVER: Komunikat */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-8 border border-white/10">
              <ClockIconAnimated />
              <h3 className="font-serif text-2xl font-light text-[#FDF9EC] mb-4 tracking-widest uppercase">
                {album.title}
              </h3>
              <div className="h-[1px] w-12 bg-[#FDF9EC]/30 mb-4" />
              <p className="font-sans font-light text-[#FDF9EC]/80 text-sm leading-relaxed max-w-[80%] tracking-widest">
                  Zdjęcia zostaną opublikowane po zakończeniu wydarzenia. Prosimy o cierpliwość.
              </p>
          </div>
        </div>
      ) : (
        /* --- WARIANT 2: ALBUM DOSTĘPNY --- */
        <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
              <div className="flex items-center gap-3 mb-3">
                  <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl text-[#FDF9EC] border border-white/20 shadow-sm">
                      {/* Tutaj zakładałem, że przekazujesz w 'album.icon' komponent ikony (np. z Heroicons) */}
                      {album.icon}
                  </div>
                  {album.requiredLevel === 'vip' && (
                    <span className="font-sans font-medium text-[9px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-md bg-[#4E0113]/80 backdrop-blur-md border border-[#4E0113]/50 text-[#FDF9EC]">
                        Poufne
                    </span>
                  )}
              </div>
              
              <h3 className="font-serif text-2xl md:text-3xl font-light text-[#FDF9EC] mb-2 tracking-wide drop-shadow-md">
                {album.title}
              </h3>
              
              <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500 opacity-0 group-hover:opacity-100">
                <p className="font-sans font-light text-[#FDF9EC]/70 text-sm leading-relaxed mt-2 line-clamp-2">
                    {album.description}
                </p>
              </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function ClockIconAnimated() {
  return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10 text-[#FDF9EC]/80 mb-4 animate-[spin_4s_linear_infinite]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
  )
}