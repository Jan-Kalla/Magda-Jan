"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { LockClosedIcon } from "@heroicons/react/24/solid";
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
      className="group relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-xl cursor-pointer bg-black"
      onClick={() => !album.isLockedFuture && onClick(album)}
    >
      {/* TŁO (ZDJĘCIE) */}
      <Image 
        src={album.coverImage} 
        alt={album.title} 
        fill 
        className={`object-cover transition-all duration-700 
          ${album.isLockedFuture 
            ? "grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-40" 
            : "group-hover:scale-110 opacity-80"
          }
        `}
      />

      {/* --- WARIANT 1: ALBUM ZABLOKOWANY (PRZYSZŁY) --- */}
      {album.isLockedFuture ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center transition-all duration-300">
          
          {/* Stan domyślny: Kłódka */}
          <div className="group-hover:opacity-0 transition-opacity duration-300 flex flex-col items-center">
              <div className="bg-[#4E0113]/20 backdrop-blur-sm p-4 rounded-full mb-3 border border-white/20">
                  <LockClosedIcon className="w-8 h-8 text-white/80" />
              </div>
              <h3 className="text-2xl font-bold text-white drop-shadow-md">{album.title}</h3>
          </div>

          {/* Stan HOVER: Komunikat */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#4E0113]/95 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
              <ClockIconAnimated />
              <h3 className="text-xl font-bold text-[#FAD6C8] mb-2">{album.title}</h3>
              <p className="text-white text-sm leading-relaxed">
                  Te zdjęcia pojawią się tutaj po wydarzeniu. <br/>
                  Cierpliwości! 😉
              </p>
          </div>
        </div>
      ) : (
        /* --- WARIANT 2: ALBUM DOSTĘPNY --- */
        <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/90 via-black/30 to-transparent">
          <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <div className="flex items-center gap-2 mb-1">
                  <div className="bg-[#FAD6C8] p-1.5 rounded-lg text-[#4E0113]">
                      {album.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-white/20 text-white">
                      {album.requiredLevel === 'vip' ? 'TOP SECRET' : 'ALBUM'}
                  </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{album.title}</h3>
              <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 leading-snug">
                  {album.description}
              </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function ClockIconAnimated() {
  return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-[#FAD6C8] mb-3 animate-pulse">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
  )
}