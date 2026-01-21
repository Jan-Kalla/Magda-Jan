"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Album } from "../data";

type Props = {
  album: Album | null;
  userAccessLevel: string;
  onClose: () => void;
};

export default function AlbumModal({ album, userAccessLevel, onClose }: Props) {
  return (
    <AnimatePresence>
      {album && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-8 max-w-lg w-full text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-[#4E0113] rounded-full flex items-center justify-center mx-auto mb-4 text-[#FAD6C8]">
              {album.icon}
            </div>
            
            <h2 className="text-2xl font-bold text-[#4E0113] mb-4">{album.title}</h2>
            
            <div className="bg-gray-100 p-4 rounded-xl text-left mb-6 text-sm text-gray-600 border border-gray-200">
               <p className="font-bold mb-2 text-[#4E0113]">ℹ️ Informacje o dostępie:</p>
               <ul className="list-disc list-inside space-y-1">
                 <li>Wymagany poziom: <strong>{album.requiredLevel}</strong></li>
                 <li>Twój poziom: <strong>{userAccessLevel}</strong></li>
               </ul>
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">
              Tutaj w przyszłości wyświetli się pełna galeria zdjęć dla kategorii <strong>{album.title}</strong>.
              <br/>
              W tym miejscu podłączysz bibliotekę do przeglądania zdjęć (lightbox).
            </p>

            <button 
              onClick={onClose}
              className="bg-[#4E0113] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#6b1326] transition shadow-lg"
            >
              Zamknij
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}