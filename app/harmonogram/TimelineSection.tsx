"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Info } from "lucide-react";
import { scheduleData, TimelineEvent } from "./data";

// Sub-komponent pojedynczego kafelka
const TimelineItem = ({ item, index }: { item: TimelineEvent; index: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isAct = item.type === "act";

  return (
    <motion.li
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative pl-8 md:pl-0 ${isAct ? "mb-12 mt-8" : "mb-8"}`}
    >
      {/* LINIA CZASU */}
      {!isAct && (
        <div className="absolute left-2 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#FAD6C8]/30 -translate-x-1/2 hidden md:block" />
      )}
      
      <div className={`flex flex-col md:flex-row items-center gap-6 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
        
        {/* CZAS (Desktop) */}
        {!isAct && (
          <div className="hidden md:flex flex-1 justify-end items-center px-6">
            <span className="text-2xl font-bold text-[#FAD6C8] font-mono">{item.time}</span>
          </div>
        )}

        {/* IKONA */}
        <div className={`absolute left-0 md:static md:flex-none z-10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(250,214,200,0.3)]
          ${isAct ? "bg-[#841D30] border-2 border-[#FAD6C8] w-14 h-14 -ml-2 md:ml-0" : "bg-[#4E0113] border border-[#FAD6C8]/50"}
        `}>
          {item.icon}
        </div>

        {/* TREŚĆ */}
        <motion.div 
          layout
          onClick={() => item.details && setIsOpen(!isOpen)}
          className={`flex-1 w-full md:w-auto p-5 rounded-2xl border backdrop-blur-md cursor-pointer transition-colors
            ${isAct 
              ? "bg-[#841D30]/90 border-[#FAD6C8] text-center py-6 shadow-2xl scale-105" 
              : "bg-white/10 border-[#FAD6C8]/20 hover:bg-white/20 hover:border-[#FAD6C8]/40"
            }
          `}
        >
          {!isAct && <span className="md:hidden text-sm font-bold text-[#FAD6C8]/70 mb-1 block">{item.time}</span>}

          <h3 className={`font-bold ${isAct ? "text-2xl text-[#FAD6C8] uppercase tracking-widest" : "text-xl text-white"}`}>
            {item.title}
          </h3>
          
          <p className={`mt-2 ${isAct ? "text-[#FAD6C8]/90 italic" : "text-gray-200"}`}>
            {item.description}
          </p>

          <AnimatePresence>
            {isOpen && item.details && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-[#FAD6C8]/20 text-sm text-[#FAD6C8] flex gap-2 items-start">
                   <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                   <p>{item.details}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!isOpen && item.details && !isAct && (
             <div className="mt-3 flex justify-center">
                <ChevronLeft className="-rotate-90 w-5 h-5 text-[#FAD6C8]/50 animate-bounce" />
             </div>
          )}
        </motion.div>
        
        {isAct && <div className="hidden md:block flex-1" />}
        {!isAct && <div className="hidden md:block flex-1" />}
      </div>
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
          Kliknij na kafelki, aby poznać szczegóły poszczególnych scen.
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