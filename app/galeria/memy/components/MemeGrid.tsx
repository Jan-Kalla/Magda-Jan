"use client";

import { motion, AnimatePresence } from "framer-motion";
import { StarIcon as StarSolid, PencilSquareIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { useState } from "react";

// Definicje typów, żeby TypeScript nie narzekał
type MediaItem = { id: string; type: 'image' | 'video_link'; url: string; caption?: string; };
type MemeRating = { id: string; media_id: string; guest_code: string; rating: number; };

interface MemeGridProps {
  items: MediaItem[];
  columnsCount: number;
  getImageUrl: (url: string) => string;
  handleOpenLightbox: (item: MediaItem) => void;
  showRatings: boolean;
  ratings?: MemeRating[];
  guestCode?: string;
  onSubmitRating?: (mediaId: string, rating: number) => void;
}

export default function MemeGrid({
  items, columnsCount, getImageUrl, handleOpenLightbox, 
  showRatings, ratings = [], guestCode, onSubmitRating
}: MemeGridProps) {
  
  const [ratingPanelOpen, setRatingPanelOpen] = useState<string | null>(null);

  // Funkcja rozdzielająca elementy na kolumny (dla efektu Masonry)
  const distributeToColumns = (itemsToDistribute: MediaItem[]) => {
    const cols: MediaItem[][] = Array.from({ length: columnsCount }, () => []);
    itemsToDistribute.forEach((item, index) => {
      cols[index % columnsCount].push(item);
    });
    return cols;
  };

  return (
    <motion.div
        key="photos-view"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex gap-2 sm:gap-4 md:gap-6 items-start w-full"
    >
        {distributeToColumns(items).map((column, colIndex) => (
            <div key={colIndex} className="flex flex-col flex-1 gap-0 min-w-0">
                {column.map((item) => {
                    // Logika ocen (tylko jeśli showRatings jest true)
                    const memeRatings = showRatings ? ratings.filter(r => r.media_id === item.id) : [];
                    const voteCount = memeRatings.length;
                    const avgRating = voteCount > 0 
                        ? (memeRatings.reduce((sum, r) => sum + r.rating, 0) / voteCount).toFixed(1) 
                        : null;
                    const userVote = (showRatings && guestCode) ? memeRatings.find(r => r.guest_code === guestCode) : null;

                    return (
                        <div 
                            key={item.id}
                            className="mb-4 sm:mb-6 md:mb-8 bg-white p-1 sm:p-2 pb-3 sm:pb-3 rounded-sm shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#4c4a1e]/5 w-full flex flex-col group"
                        >
                            <div 
                                onClick={() => handleOpenLightbox(item)}
                                className="relative w-full rounded-sm overflow-hidden bg-gray-100 cursor-pointer"
                            >
                                {item.type === 'video_link' ? (
                                    <video 
                                        src={getImageUrl(item.url)} 
                                        autoPlay loop muted playsInline
                                        className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.02]" 
                                    />
                                ) : (
                                    <img 
                                        src={getImageUrl(item.url)} 
                                        alt={item.caption || "Mem"} 
                                        loading="lazy"
                                        className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.02]" 
                                    />
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                            </div>

                            {/* SEKCJA OCENIANIA - Renderowana tylko, gdy showRatings = true */}
                            {showRatings && (
                                <div className="mt-2 px-1 flex flex-col gap-2">
                                    <div className="flex items-center justify-between text-sm flex-wrap gap-y-2">
                                        <div className="flex items-center gap-1 text-[#4E0113] font-bold">
                                            {avgRating ? <StarSolid className="w-4 h-4 text-yellow-500" /> : <StarOutline className="w-4 h-4 text-[#4c4a1e]/30" />}
                                            <span>{avgRating ? `${avgRating}/10` : 'Brak'}</span>
                                            <span className="text-[#4c4a1e]/50 font-normal text-xs ml-0.5">
                                                ({voteCount})
                                            </span>
                                        </div>

                                        {userVote ? (
                                            <button 
                                                onClick={() => setRatingPanelOpen(ratingPanelOpen === item.id ? null : item.id)}
                                                className="flex items-center gap-1 text-green-700 bg-green-50 hover:bg-green-100 px-1.5 py-0.5 rounded text-xs font-medium border border-green-200 transition-colors"
                                                title="Zmień ocenę"
                                            >
                                                <span>Twoja: {userVote.rating}</span>
                                                <PencilSquareIcon className="w-3 h-3" />
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => setRatingPanelOpen(ratingPanelOpen === item.id ? null : item.id)}
                                                className="text-xs font-semibold uppercase tracking-wider text-[#C97B78] hover:text-[#4E0113] transition-colors"
                                            >
                                                {ratingPanelOpen === item.id ? 'Anuluj' : 'Oceń!'}
                                            </button>
                                        )}
                                    </div>

                                    <AnimatePresence>
                                        {ratingPanelOpen === item.id && (
                                            <motion.div 
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pt-2 flex flex-wrap gap-0.5 sm:gap-1 justify-center">
                                                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                                                        <button
                                                            key={num}
                                                            onClick={() => {
                                                                if (onSubmitRating) onSubmitRating(item.id, num);
                                                                setRatingPanelOpen(null);
                                                            }}
                                                            className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-xs sm:text-sm rounded transition-all border
                                                                ${userVote?.rating === num 
                                                                    ? 'bg-[#C97B78] text-white border-[#C97B78] shadow-inner' 
                                                                    : 'bg-[#FDF9EC] border-[#4c4a1e]/20 text-[#4c4a1e] hover:bg-[#C97B78] hover:text-white hover:border-[#C97B78]'
                                                                }`}
                                                        >
                                                            {num}
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        ))}
    </motion.div>
  );
}