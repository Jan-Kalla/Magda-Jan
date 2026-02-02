"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function PageWrapper({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      // 1. STAN STARTOWY
      initial={{ 
        // USUNIĘTO: opacity: 0 
        // Dzięki temu strona jest od razu "pełna" i zasłania tło, nie ma efektu "ducha".
        y: 40,               // Przesunięcie w dół (wjazd)
        filter: "blur(8px)"  // Rozmycie na start
      }}
      
      // 2. STAN KOŃCOWY
      animate={{ 
        y: 0, 
        filter: "blur(0px)" 
      }}
      
      // 3. WYJŚCIE (Opcjonalne, przy zmianie stron)
      exit={{ 
        y: -40, 
        filter: "blur(8px)" 
      }}
      
      // 4. FIZYKA RUCHU
      transition={{ 
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] // "Custom easing" - bardzo płynny, "maślany" ruch
      }}
      
      className={className}
    >
      {children}
    </motion.div>
  );
}