"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Info } from "lucide-react";
import { scheduleData, TimelineEvent } from "@/app/harmonogram/data";

const TimelineItem = ({ item, index }: { item: TimelineEvent; index: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isAct = item.type === "act";

  const initialX = isAct ? 0 : index % 2 === 0 ? 50 : -50;

  return (
    <motion.li
      initial={{ opacity: 0, x: initialX }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`relative pl-8 md:pl-0 ${isAct ? "my-16 md:flex md:justify-center" : "my-6"}`}
    >
      {/* LINIA CZASU - ciągła przez całość */}
      <div className="absolute left-2 md:left-1/2 top-[-24px] bottom-[-24px] w-0.5 bg-[#FAD6C8]/30 -translate-x-1/2 hidden md:block -z-10" />

      {/* --- WARIANT 1: AKT (Centralny, wyróżniony) --- */}
      {isAct ? (
        <div className="relative w-full md:max-w-2xl flex flex-col items-center z-10">
          
          {/* Ikona Aktu - Centralna */}
          {/* FIX: Dodano klasę 'z-20', aby ikona była zawsze nad kartą */}
          <div className="z-20 w-16 h-16 rounded-full bg-[#841D30] border-4 border-[#FAD6C8] flex items-center justify-center shadow-[0_0_20px_rgba(132,29,48,0.6)] mb-4 absolute -top-8 left-0 md:left-1/2 md:-translate-x-1/2">
            {item.icon}
          </div>

          {/* Karta Aktu */}
          <motion.div
            layout
            onClick={() => item.details && setIsOpen(!isOpen)}
            className="w-full bg-gradient-to-b from-[#841D30] to-[#5e0c1d] border border-[#FAD6C8]/50 rounded-2xl shadow-2xl p-6 pt-10 text-center cursor-pointer relative overflow-hidden group"
          >
             <div className="absolute top-0 left-0 w-full h-1 bg-[#FAD6C8]" />
             
             <div className="inline-block px-4 py-1 rounded-full bg-[#FAD6C8]/20 text-[#FAD6C8] font-mono font-bold text-lg mb-2">
                {item.time}
             </div>

             <h3 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-widest mb-2 group-hover:text-[#FAD6C8] transition-colors">
               {item.title}
             </h3>
             <p className="text-[#FAD6C8]/80 italic text-lg">{item.description}</p>

             <AnimatePresence>
              {isOpen && item.details && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-6 pt-6 border-t border-[#FAD6C8]/20">
                     <p className="text-white/90 text-base leading-relaxed max-w-lg mx-auto">
                       {item.details}
                     </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {!isOpen && item.details && (
               <div className="mt-4 flex justify-center">
                  <ChevronLeft className="-rotate-90 w-6 h-6 text-[#FAD6C8]/50 animate-bounce" />
               </div>
            )}
          </motion.div>
        </div>
      ) : (
        /* --- WARIANT 2: ZWYKŁE WYDARZENIE (Zygzak) --- */
        <div className={`flex flex-col md:flex-row items-center gap-6 ${index % 2 !== 0 ? "md:flex-row-reverse" : ""}`}>
          
          <div className={`hidden md:flex flex-1 items-center ${index % 2 !== 0 ? "justify-start" : "justify-end"}`}>
            <span className="text-2xl font-bold text-[#FAD6C8] font-mono opacity-80">{item.time}</span>
          </div>

          {/* Punkt na osi */}
          <div className="absolute left-0 md:static md:flex-none z-10 w-4 h-4 md:w-5 md:h-5 rounded-full bg-[#4E0113] border-2 border-[#FAD6C8] shadow-[0_0_10px_rgba(250,214,200,0.4)]" />

          <div className="flex-1 w-full md:w-auto">
            <div className="bg-white/5 border border-[#FAD6C8]/10 hover:bg-white/10 hover:border-[#FAD6C8]/30 transition-colors p-5 rounded-xl backdrop-blur-sm">
              <span className="md:hidden text-sm font-bold text-[#FAD6C8]/70 mb-1 block">{item.time}</span>
              
              <div className="flex items-start gap-3">
                 <div className="mt-1 p-2 bg-[#4E0113]/50 rounded-lg text-[#FAD6C8]">
                    {item.icon}
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    <p className="text-gray-300 text-sm mt-1">{item.description}</p>
                    
                    {item.details && (
                       <div className="mt-2 text-xs text-[#FAD6C8]/70 flex gap-1.5 items-start">
                         <Info className="w-3 h-3 mt-0.5 shrink-0" />
                         <span>{item.details}</span>
                       </div>
                    )}
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.li>
  );
};

export default function TimelineSection() {
  return (
    <section className="max-w-5xl mx-auto my-16 px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-[#4E0113] drop-shadow-sm mb-4">
          Scenariusz Wydarzenia
        </h2>
        <p className="text-[#4E0113]/80 text-lg">
          Kliknij na główne punkty programu (Akty), aby odkryć szczegóły.
        </p>
      </motion.div>

      <div className="relative">
        <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-[#4E0113]/20 md:hidden" />
        
        <ul className="space-y-4 md:space-y-0 relative">
          {scheduleData.map((item, index) => (
            <TimelineItem key={item.id} item={item} index={index} />
          ))}
        </ul>
      </div>
      
      <div className="h-24" />
    </section>
  );
}