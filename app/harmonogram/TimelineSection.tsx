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
      transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
      className={`relative pl-8 md:pl-0 ${isAct ? "my-24 md:flex md:justify-center" : "my-10"}`}
    >
      {/* LINIA CZASU - Szklana linia idąca w dół */}
      <div className="absolute left-2 md:left-1/2 top-[-40px] bottom-[-40px] w-0.5 bg-white/20 backdrop-blur-sm -translate-x-1/2 hidden md:block -z-10" />

      {/* --- WARIANT 1: AKT (Centralny, wyróżniony) --- */}
      {isAct ? (
        <div className="relative w-full md:max-w-2xl flex flex-col items-center z-10">
          
          <div className="z-20 w-16 h-16 rounded-full bg-black/60 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-2xl mb-6 absolute -top-8 left-0 md:left-1/2 md:-translate-x-1/2 text-[#FDF9EC]">
            {item.icon}
          </div>

          <motion.div
            layout
            onClick={() => item.details && setIsOpen(!isOpen)}
            className="w-full bg-black/30 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.2)] p-8 md:p-12 pt-14 text-center cursor-pointer relative overflow-hidden group"
          >
             {/* Górny akcent */}
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
             
             <div className="inline-block px-4 py-1.5 rounded-lg bg-white/10 text-[#FDF9EC] font-mono font-bold tracking-widest text-sm mb-4 border border-white/10">
                {item.time}
             </div>

             <h3 className="font-serif text-3xl md:text-4xl font-light text-[#FDF9EC] uppercase tracking-[0.15em] mb-4 group-hover:text-white transition-colors">
               {item.title}
             </h3>
             <p className="font-sans font-light text-[#FDF9EC]/80 text-lg leading-relaxed">{item.description}</p>

             <AnimatePresence>
              {isOpen && item.details && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-8 pt-8 border-t border-white/10">
                     <p className="font-serif italic text-[#FDF9EC]/90 text-lg leading-relaxed max-w-lg mx-auto">
                       {item.details}
                     </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {!isOpen && item.details && (
               <div className="mt-6 flex justify-center">
                  <ChevronLeft className="-rotate-90 w-6 h-6 text-white/40 group-hover:text-white/80 transition-colors animate-bounce" />
               </div>
            )}
          </motion.div>
        </div>
      ) : (
        /* --- WARIANT 2: ZWYKŁE WYDARZENIE (Zygzak) --- */
        <div className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 !== 0 ? "md:flex-row-reverse" : ""}`}>
          
          <div className={`hidden md:flex flex-1 items-center ${index % 2 !== 0 ? "justify-start" : "justify-end"}`}>
            <span className="text-3xl font-bold text-white/50 font-serif italic tracking-wide">{item.time}</span>
          </div>

          {/* Punkt na osi */}
          <div className="absolute left-0 md:static md:flex-none z-10 w-4 h-4 md:w-5 md:h-5 rounded-full bg-white/20 backdrop-blur-md border border-white/50 shadow-[0_0_15px_rgba(255,255,255,0.3)]" />

          <div className="flex-1 w-full md:w-auto">
            <div className="bg-black/20 backdrop-blur-xl border border-white/10 hover:border-white/30 transition-all duration-300 p-6 md:p-8 rounded-2xl shadow-xl hover:-translate-y-1">
              <span className="md:hidden text-sm font-bold text-white/50 font-serif italic mb-3 block">{item.time}</span>
              
              <div className="flex items-start gap-4">
                 <div className="mt-1 p-3 bg-white/10 rounded-xl text-[#FDF9EC] border border-white/10">
                    {item.icon}
                 </div>
                 <div>
                    <h3 className="font-serif text-2xl font-light text-[#FDF9EC] tracking-wide mb-1">{item.title}</h3>
                    <p className="font-sans font-light text-[#FDF9EC]/70 text-sm leading-relaxed">{item.description}</p>
                    
                    {item.details && (
                       <div className="mt-4 text-xs font-sans uppercase tracking-widest text-[#FDF9EC]/50 flex gap-2 items-start bg-white/5 p-3 rounded-lg">
                         <Info className="w-4 h-4 shrink-0" />
                         <span className="leading-snug">{item.details}</span>
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
    <section className="max-w-5xl mx-auto mt-24 md:mt-32 mb-24 px-4 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20"
      >
        <h2 className="font-script text-6xl md:text-7xl text-[#FDF9EC] drop-shadow-lg mb-6">
          Scenariusz Wydarzenia
        </h2>
        <p className="font-sans font-light uppercase tracking-widest text-[#FDF9EC]/80 text-sm md:text-base max-w-2xl mx-auto">
          Kliknij na główne punkty programu (Akty), aby odkryć szczegóły
        </p>
      </motion.div>

      <div className="relative">
        {/* Pionowa linia dla mobile */}
        <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-white/20 backdrop-blur-md md:hidden" />
        
        <ul className="space-y-6 md:space-y-0 relative">
          {scheduleData.map((item, index) => (
            <TimelineItem key={item.id} item={item} index={index} />
          ))}
        </ul>
      </div>
      
      <div className="h-32" />
    </section>
  );
}